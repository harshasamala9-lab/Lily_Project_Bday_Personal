"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lock, LockKeyhole, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import type { SecretMessage } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { Confetti } from "@/components/fx/Confetti";
import { useSound } from "@/lib/use-sound";
import { cn, isPlaceholder } from "@/lib/utils";

const RARITY = {
  common: { label: "Common", tone: "text-cream-200/60 bg-cream-100/7" },
  rare: { label: "Rare", tone: "text-grape-600 bg-grape-500/10" },
  legendary: { label: "Legendary", tone: "text-ember-600 bg-ember-500/12" },
} as const;

/**
 * 🔐 There's a secret here...
 * Lock → unlock animation, screen pulse, sparkles, tiny confetti, reveal.
 */
export function SecretSection({ secrets }: { secrets: SecretMessage[] }) {
  const reduce = useReducedMotion();
  const { play } = useSound();
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [burst, setBurst] = useState(0);

  const unlock = useCallback(
    (slug: string) => {
      if (unlocked[slug]) return;
      setUnlocked((prev) => ({ ...prev, [slug]: true }));
      play("unlock");
      setBurst((n) => n + 1);
    },
    [play, unlocked],
  );

  return (
    <Section
      id="secrets"
      tone="night"
      eyebrow="🔐 Classified"
      title="There's a Secret Here…"
      lede="Some things are only visible to people who keep clicking."
    >
      <Confetti burst={burst} count={60} originY={50} />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {secrets.map((secret, i) => {
          const open = Boolean(unlocked[secret.slug]);
          const rarity = RARITY[secret.rarity];

          return (
            <motion.article
              key={secret.slug}
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-[28px] border p-7 transition-all duration-700",
                open
                  ? "border-cream-100/20 bg-cream-100/8"
                  : "border-cream-100/10 bg-night-800/60",
              )}
              initial={reduce ? undefined : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.09 }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,164,87,0.35),transparent_65%)] blur-2xl"
              />

              <div className="relative flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] tracking-[0.16em] text-cream-200/45">
                  {secret.slug.toUpperCase()}
                </span>
                <span className={cn("rounded-full px-2.5 py-1 text-[10.5px] font-bold", rarity.tone)}>
                  {rarity.label}
                </span>
              </div>

              <div className="relative mt-7 flex justify-center">
                <motion.div
                  className={cn(
                    "grid h-20 w-20 place-items-center rounded-[26px] transition-all duration-700",
                    open
                      ? "bg-gradient-to-br from-ember-400 to-berry-500 text-cream-50"
                      : "bg-cream-100/6 text-cream-200/45",
                  )}
                  animate={
                    open && !reduce
                      ? { rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{ duration: 0.6 }}
                >
                  {open ? <Sparkles className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
                </motion.div>

                {open && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-[26px] border-2 border-ember-300/50"
                    initial={{ opacity: 0.9, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.7 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>

              <h3 className="relative mt-6 text-center text-xl text-cream-50">
                {secret.title}
              </h3>

              <div className="relative mt-4 flex-1 text-center">
                <AnimatePresence mode="wait">
                  {open ? (
                    <motion.p
                      key="open"
                      className="text-[15px] leading-relaxed text-cream-100/85"
                      initial={reduce ? undefined : { opacity: 0, y: 14, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.55 }}
                    >
                      {isPlaceholder(secret.message)
                        ? "Secret revealed: friendship appreciation detected."
                        : secret.message}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="locked"
                      className="text-[13.5px] leading-relaxed text-cream-200/45"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {secret.unlockHint}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={() => unlock(secret.slug)}
                disabled={open}
                className={cn(
                  "relative mt-7 w-full rounded-full px-5 py-3 text-[13px] font-bold uppercase tracking-[0.14em] transition-all active:scale-95",
                  open
                    ? "cursor-default bg-cream-100/8 text-cream-200/45"
                    : "bg-grape-400 text-night-900 hover:-translate-y-0.5 hover:bg-grape-300",
                )}
              >
                {open ? (
                  <span className="inline-flex items-center gap-2">
                    <LockKeyhole className="h-3.5 w-3.5" /> Unlocked
                  </span>
                ) : (
                  "UNLOCK"
                )}
              </button>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
