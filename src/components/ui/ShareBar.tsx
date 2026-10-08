"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, QrCode, Share2 } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface ShareBarProps {
  /** Route to share, e.g. /memory/the-legendary-call */
  href: string;
  title: string;
  className?: string;
  /** Offer the QR code button. */
  showQr?: boolean;
  /** Light styling for pages with a night background. */
  tone?: "cream" | "night";
}

function subscribeToOrigin() {
  return () => {};
}

function getOriginSnapshot() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

/**
 * Copy + native share for every generated page. Native share is used where it
 * exists, with a clipboard copy as the universal fallback, plus a scannable QR
 * code for handing a memory to someone in person.
 */
export function ShareBar({
  href,
  title,
  className,
  showQr = false,
  tone = "cream",
}: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const origin = useSyncExternalStore(subscribeToOrigin, getOriginSnapshot, () => "");

  const night = tone === "night";

  const url = origin ? `${origin}${href}` : href;

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }, [url]);

  const share = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* dismissed — fall through to copy */
      }
    }
    await copy();
  }, [copy, title, url]);

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <button
        type="button"
        onClick={copy}
        className={ghostClass(night)}
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4 text-mint-500" /> Copied
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" /> Copy link
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <button type="button" onClick={share} className={ghostClass(night)}>
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {showQr && (
        <button
          type="button"
          onClick={() => setQrOpen((v) => !v)}
          className={ghostClass(night)}
          aria-expanded={qrOpen}
          aria-controls="share-qr"
        >
          <QrCode className="h-4 w-4" />
          QR
        </button>
      )}

      <AnimatePresence>
        {qrOpen && (
          <motion.div
            id="share-qr"
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "w-fit rounded-3xl border p-3",
              night
                ? "border-cream-100/15 bg-cream-50/95"
                : "border-night-900/10 bg-cream-50/95",
            )}
          >
            <QrImage value={url} />
            <p
              className={cn(
                "mt-2 max-w-[168px] truncate text-center text-[11px]",
                night ? "text-night-800/60" : "text-night-700/60",
              )}
            >
              Scan to open {title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ghostClass(night: boolean) {
  return cn(
    "btn-ghost !px-4 !py-2.5 text-[13px]",
    night &&
      "!border-cream-100/15 !bg-cream-100/8 !text-cream-100 hover:!border-cream-100/35 hover:!bg-cream-100/15",
  );
}

/**
 * Real, scannable QR code. `qrcode` is loaded on demand so it costs nothing
 * until someone actually opens the QR panel.
 */
function QrImage({ value }: { value: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!value) return;

    import("qrcode")
      .then((mod) =>
        mod.default.toDataURL(value, {
          width: 336,
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: "#150d24", light: "#fffdf9" },
        }),
      )
      .then((dataUrl) => {
        if (!cancelled) setSrc(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [value]);

  if (failed) {
    return (
      <p className="max-w-[168px] py-6 text-center text-[12px] text-night-700/60">
        QR unavailable — use the copy link instead.
      </p>
    );
  }

  if (!src) {
    return (
      <div
        className="h-[168px] w-[168px] animate-pulse rounded-lg bg-night-900/8"
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`QR code linking to ${value}`}
      width={168}
      height={168}
      className="rounded-lg"
    />
  );
}
