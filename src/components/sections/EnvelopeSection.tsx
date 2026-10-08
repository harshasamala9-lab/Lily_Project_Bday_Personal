"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Letter } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { useSound } from "@/lib/use-sound";
import { isPlaceholder, sanitizeText } from "@/lib/utils";

/**
 * 📨 Interactive Envelope
 * hover/tap → wiggle → lid opens → paper rises → unfolds → text types in.
 * Sound only ever fires after the user interacts.
 */
export function EnvelopeSection({ letter }: { letter: Letter }) {
  const reduce = useReducedMotion();
  const { play } = useSound();
  const [phase, setPhase] = useState<"idle" | "wiggle" | "opening" | "open">("idle");
  const [typed, setTyped] = useState("");
  const timer = useRef<number | null>(null);

  const body = letter.body.map(sanitizeText).filter((p) => !isPlaceholder(p));
  const text = body.join("\n\n") || "[ ADD ENVELOPE LETTER HERE ]";

  const open = useCallback(() => {
    if (phase !== "idle" && phase !== "wiggle") return;
    setPhase("wiggle");
    play("pop");
    window.setTimeout(() => {
      setPhase("opening");
      play("whoosh");
      window.setTimeout(() => {
        setPhase("open");
        play("chime");
      }, 900);
    }, 620);
  }, [phase, play]);

  useEffect(() => {
    if (phase !== "open" || reduce) {
      return;
    }
    let i = 0;
    const tick = () => {
      i += 2;
      setTyped(text.slice(0, i));
      if (i < text.length) {
        timer.current = window.setTimeout(tick, 16);
      }
    };
    timer.current = window.setTimeout(tick, 260);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [phase, reduce, text]);

  const readableText = reduce && phase === "open" ? text : typed;

  return (
    <Section
      id="envelope"
      eyebrow="✉️ Final chapter"
      title="One Last Friendship Note"
      lede="One final friendship note from Mahi, sealed for the end."
      tone="night"
      className="overflow-hidden bg-[radial-gradient(70%_55%_at_50%_0%,rgba(124,58,237,0.22),transparent_60%),linear-gradient(180deg,#08040f,#12091f)]"
      withField={false}
    >
      <div className="relative mx-auto flex max-w-3xl flex-col items-center">
        <div
          className="relative h-[300px] w-full max-w-lg [perspective:1200px] sm:h-[340px]"
          onMouseEnter={() => phase === "idle" && open()}
        >
          {/* Envelope back */}
          <div className="absolute inset-x-6 bottom-0 top-10 rounded-2xl border border-violet-200/15 bg-gradient-to-b from-violet-950 to-black shadow-[0_30px_90px_-40px_rgba(167,139,250,0.7)]" />

          {/* Paper */}
          <motion.div
            className="absolute inset-x-9 bottom-4 top-5 origin-bottom overflow-hidden rounded-2xl border border-violet-200/15 bg-[linear-gradient(180deg,#181026,#090411)] p-5 shadow-soft sm:inset-x-14 sm:p-7"
            initial={false}
            animate={
              phase === "open"
                ? { y: "-46%", scale: 1, opacity: 1 }
                : { y: "34%", scale: 0.92, opacity: 0.2 }
            }
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_20%_0%,rgba(216,180,254,0.16),transparent_70%)]" />
            <div className="relative">
              {phase === "open" ? (
                <>
                  <p className="whitespace-pre-line text-[14px] leading-[1.75] text-cream-100/82 sm:text-[15px]">
                    {readableText}
                    {readableText.length < text.length && (
                      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-fuchsia-200 align-middle" />
                    )}
                  </p>
                  {readableText.length >= text.length && (
                    <motion.p
                      className="mt-5 font-script text-3xl text-violet-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {letter.signOff ?? "— Mahi"}
                    </motion.p>
                  )}
                </>
              ) : (
                <p className="text-center text-[12px] uppercase tracking-[0.18em] text-violet-100/35">
                  [ sealed ]
                </p>
              )}
            </div>
          </motion.div>

          {/* Envelope front */}
          <motion.div
            className="absolute inset-x-6 bottom-0 top-10 origin-bottom overflow-hidden rounded-2xl"
            style={{ transformStyle: "preserve-3d" }}
            animate={
              phase === "wiggle"
                ? { rotate: [0, -3, 3, -2, 2, 0], y: -6 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.62, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 [clip-path:polygon(0_28%,50%_0,100%_28%,100%_100%,0_100%)] bg-gradient-to-b from-violet-500 to-fuchsia-800" />
            <div className="absolute inset-0 [clip-path:polygon(0_100%,50%_30%,100%_100%)] bg-gradient-to-b from-violet-700/95 to-black" />

            <span className="absolute left-1/2 top-[26%] grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-cream-50/25 text-cream-50 backdrop-blur">
              <Mail className="h-5 w-5" />
            </span>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {phase !== "open" ? (
            <motion.button
              key="cta"
              type="button"
              onClick={open}
            className="mt-9 rounded-full border border-violet-200/20 bg-violet-300 px-7 py-3.5 text-sm font-bold text-night-900 shadow-[0_20px_70px_-32px_rgba(216,180,254,0.9)] transition-all hover:-translate-y-1 hover:bg-violet-200 active:scale-95"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              Open the envelope
            </motion.button>
          ) : (
            <motion.p
              key="hint"
              className="mt-9 text-[13px] text-cream-200/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Friendship note delivered. Still the same chaos. 😂
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
