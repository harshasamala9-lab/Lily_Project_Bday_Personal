import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SparkleField } from "@/components/fx/SparkleField";
import { ShareBar } from "@/components/ui/ShareBar";
import { displayText, formatDate, isPlaceholder } from "@/lib/utils";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Shared chrome for every generated page (/memory/[slug], /inside-joke/[slug],
 * /moment/[slug], …). Keeps them feeling like one product.
 */
export function DetailShell({
  eyebrow,
  title,
  lede,
  href,
  children,
  meta,
  tone = "night",
  accent = "from-ember-400 to-berry-500",
}: {
  eyebrow: string;
  title: string;
  lede?: string | null;
  href: string;
  children: ReactNode;
  meta?: Array<{ label: string; value: string }>;
  tone?: "cream" | "night";
  /** Top hairline gradient, e.g. "from-ember-400 to-berry-500". */
  accent?: string;
}) {
  const night = tone === "night";

  return (
    <article
      className={cn(
        "relative overflow-hidden pb-24 pt-[calc(var(--nav-h)+3rem)]",
        night && "bg-transparent text-cream-100",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(65%_45%_at_50%_0%,rgba(139,92,246,0.24),transparent_62%),radial-gradient(55%_45%_at_12%_18%,rgba(244,82,122,0.14),transparent_65%),radial-gradient(60%_50%_at_88%_12%,rgba(167,139,250,0.18),transparent_65%)]"
      />
      <SparkleField seed={href} count={18} />

      <div className="shell">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r",
            accent,
          )}
        />
        <Link
          href="/"
          className={cn(
            "group inline-flex items-center gap-2 text-[13px] font-semibold transition-colors",
            night ? "text-cream-200/60 hover:text-cream-50" : "text-cream-200/60 hover:text-cream-50",
          )}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to the main experience
        </Link>

        <header className="mt-8 max-w-3xl">
          <span
            className={cn(
              "eyebrow",
              night && "border-cream-100/20 bg-cream-100/5 text-cream-200",
            )}
          >
            {eyebrow}
          </span>

          <h1
            className={cn(
              "mt-5 text-[clamp(2.1rem,6vw,4rem)] leading-[1.02]",
              night && "text-cream-50",
            )}
          >
            {title}
          </h1>

          {lede && !isPlaceholder(lede) ? (
            <p
              className={cn(
                "mt-5 max-w-2xl text-[16.5px] leading-relaxed",
                night ? "text-cream-200/75" : "text-cream-200/75",
              )}
            >
              {lede}
            </p>
          ) : null}

          {meta && meta.length ? (
            <dl className="mt-7 flex flex-wrap gap-2.5">
              {meta.map((m) => (
                <div
                  key={m.label}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[12px]",
                    night
                      ? "border-cream-100/15 bg-cream-100/5 text-cream-200"
                      : "border-grape-400/16 bg-cream-100/7 text-cream-200/70",
                  )}
                >
                  <span className="opacity-55">{m.label}: </span>
                  <span className="font-semibold">{m.value}</span>
                </div>
              ))}
            </dl>
          ) : null}

          <ShareBar
            href={href}
            title={title}
            showQr
            tone={night ? "night" : "cream"}
            className="mt-7"
          />
        </header>

        <div className="mt-12 max-w-3xl">{children}</div>
      </div>
    </article>
  );
}

/** Renders optional media for a generated page. */
export function ContentMedia({
  imageUrl,
  videoUrl,
  title,
  className,
}: {
  imageUrl: string | null;
  videoUrl: string | null;
  title: string;
  className?: string;
}) {
  if (!imageUrl && !videoUrl) return null;

  return (
    <div className={cn("mt-8 space-y-4", className)}>
      {imageUrl && (
        <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-grape-400/16 bg-night-800/65 shadow-soft">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
        </div>
      )}

      {videoUrl && (
        <div className="overflow-hidden rounded-[28px] border border-grape-400/16 bg-night-800/65 shadow-soft">
          <video src={videoUrl} controls playsInline className="w-full" />
        </div>
      )}
    </div>
  );
}

export function QuoteBlock({ quote }: { quote: string | null }) {
  if (!quote || isPlaceholder(quote)) return null;
  return (
    <blockquote className="mt-8 rounded-[24px] border border-grape-400/16 bg-cream-100/7 p-6 sm:p-8">
      <p className="font-script text-[clamp(1.5rem,3.6vw,2.2rem)] leading-snug text-violet-100">
        {quote}
      </p>
    </blockquote>
  );
}

export function Prose({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p className="whitespace-pre-line text-[16px] leading-[1.85] text-cream-100/80">
      {text}
    </p>
  );
}

export function MissingContent({ what }: { what: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-grape-400/22 bg-night-800/55 p-8 text-center">
      <p className="text-[15px] font-semibold text-cream-100/75">
        {what} is being kept mysterious for now.
      </p>
      <p className="mt-2 text-[13px] text-cream-200/50">
        This page still has plenty of birthday energy to explore.
      </p>
    </div>
  );
}

export function RelatedLinks({
  links,
  tone = "cream",
}: {
  links: Array<{ href: string; label: string }>;
  tone?: "cream" | "night";
}) {
  if (!links.length) return null;
  return (
    <div className="mt-12">
      <p
        className={cn(
          "text-[11px] font-bold uppercase tracking-[0.2em]",
          tone === "night" ? "text-cream-200/40" : "text-cream-200/40",
        )}
      >
        Keep going
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-0.5",
              tone === "night"
                ? "border-cream-100/15 bg-cream-100/5 text-cream-100 hover:border-cream-100/35"
                : "border-grape-400/16 bg-cream-100/7 text-cream-100 hover:border-grape-400/35 hover:shadow-soft",
            )}
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}

export function formatMetaDate(value: string | null | undefined) {
  return formatDate(value);
}

export function safeTitle(value: string, fallback: string) {
  return displayText(value, fallback);
}
