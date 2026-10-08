"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import type { SecretMessage } from "@/lib/types";
import { Confetti } from "@/components/fx/Confetti";
import { useSound } from "@/lib/use-sound";
import { cn, isPlaceholder } from "@/lib/utils";

/** 🔐 Standalone unlock page body for /secret/[slug]. */
export function SecretReveal({ secret }: { secret: SecretMessage }) {
  const reduce = useReducedMotion();
  const { play } = useSound();
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState(0);

  const unlock = useCallback(() => {
    if (open) return;
    setOpen(true);
    play("unlock");
    setBurst((n) => n + 1);
  }, [open, play]);

  return (
    <div className="relative">
      <Confetti burst={burst} count={70} originY={40} />

      <motion.div
        className="relative overflow-hidden rounded-[32px] border border-cream-100/12 bg-night-800/70 p-9 text-center sm:p-14"
        animate={open && !reduce ? { scale: [1, 1.02, 1] } : undefined}
        transition={{ duration: 0.6 }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(255,164,87,0.35),transparent_65%)] blur-2xl"
        />

        <div className="relative flex flex-col items-center">
          <motion.div
            className={cn(
              "grid h-24 w-24 place-items-center rounded-[30px] transition-all duration-700",
              open
                ? "bg-gradient-to-br from-ember-400 to-berry-500 text-cream-50"
                : "bg-cream-100/6 text-cream-200/45",
            )}
            animate={
              open && !reduce ? { rotate: [0, -10, 10, 0] } : { rotate: 0 }
            }
            transition={{ duration: 0.7 }}
          >
            {open ? <Sparkles className="h-10 w-10" /> : <Lock className="h-10 w-10" />}
          </motion.div>

          {open && (
            <motion.span
              aria-hidden
              className="absolute h-24 w-24 rounded-[30px] border-2 border-ember-300/50"
              initial={{ opacity: 0.9, scale: 1 }}
              animate={{ opacity: 0, scale: 1.9 }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          )}

          <p className="mt-8 font-mono text-[11px] tracking-[0.2em] text-cream-200/40">
            {secret.slug.toUpperCase()} · {secret.rarity.toUpperCase()}
          </p>

          <AnimatePresence mode="wait">
            {open ? (
              <motion.p
                key="open"
                className="mt-6 max-w-xl text-[clamp(1.2rem,3.4vw,1.75rem)] font-medium leading-[1.4] text-cream-50"
                initial={reduce ? undefined : { opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6 }}
              >
                  {isPlaceholder(secret.message)
                    ? "Secret revealed: friendship appreciation detected."
                    : secret.message}
              </motion.p>
            ) : (
              <motion.p
                key="locked"
                className="mt-6 max-w-md text-[15px] leading-relaxed text-cream-200/55"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {secret.unlockHint ??
                  "Some things are only visible to people who keep clicking."}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={unlock}
            disabled={open}
            className={cn(
              "mt-10 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.18em] transition-all active:scale-95",
              open
                ? "cursor-default bg-cream-100/8 text-cream-200/45"
                : "bg-grape-400 text-night-900 hover:-translate-y-1 hover:bg-grape-300",
            )}
          >
            {open ? "Unlocked" : "UNLOCK"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
