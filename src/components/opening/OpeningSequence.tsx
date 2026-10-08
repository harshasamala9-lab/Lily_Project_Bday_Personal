"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { Confetti } from "@/components/fx/Confetti";
import { SparkleField } from "@/components/fx/SparkleField";
import { BirthdayCandle } from "./BirthdayCandle";
import { GiftBox } from "./GiftBox";
import { NameReveal } from "./NameReveal";
import { useSound } from "@/lib/use-sound";
import { displayText } from "@/lib/utils";

interface OpeningSequenceProps {
  settings: {
    intro: [string, string, string];
    giftCta: string;
    revealKicker: string;
    revealName: string;
    revealSubs: [string, string, string];
  };
}

/**
 * STEP 1 — dark intro → STEP 2 — the gift → STEP 3 — the Lily Put reveal.
 * Then a cinematic hand-off into the main experience.
 */
export function OpeningSequence({ settings }: OpeningSequenceProps) {
  const { stage, setStage, opened, openExperience } = useExperience();
  const reduce = useReducedMotion();
  const { play } = useSound();

  const [lineIndex, setLineIndex] = useState(0);
  const [flameLit, setFlameLit] = useState(false);
  const [burst, setBurst] = useState(0);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    if (opened) return;
    if (stage !== "intro") return;
    if (lineIndex >= settings.intro.length) {
      const t = window.setTimeout(() => setStage("candle"), 900);
      return () => window.clearTimeout(t);
    }
    const hold = lineIndex === 0 ? 1500 : 2000;
    const t = window.setTimeout(() => setLineIndex((i) => i + 1), hold);
    return () => window.clearTimeout(t);
  }, [lineIndex, opened, setStage, stage, settings.intro.length]);

  useEffect(() => {
    if (stage === "candle" && flameLit) {
      const t = window.setTimeout(() => setStage("gift"), 1100);
      return () => window.clearTimeout(t);
    }
  }, [stage, flameLit, setStage]);

  const handleOpen = useCallback(() => {
    play("whoosh");
    setBurst((n) => n + 1);
    window.setTimeout(() => play("chime"), 260);
    window.setTimeout(() => setStage("reveal"), reduce ? 60 : 520);
  }, [play, reduce, setStage]);

  const enter = useCallback(() => {
    play("pop");
    setEntering(true);
    setBurst((n) => n + 1);
    window.setTimeout(() => openExperience(), reduce ? 0 : 620);
  }, [openExperience, play, reduce]);

  if (opened) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-night-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-night-sheen opacity-90"
      />
      <SparkleField seed="opening" count={34} />

      <Confetti burst={burst} count={150} originY={38} />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {/* ---------------- STEP 1 — the dark intro ---------------- */}
          {stage === "intro" && (
            <motion.div
              key="intro"
              className="flex min-h-[42vh] w-full max-w-xl flex-col items-center justify-center gap-6"
              initial={false}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -24, filter: "blur(10px)" }}
              transition={{ duration: reduce ? 0 : 0.6 }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={lineIndex}
                  initial={
                    reduce || lineIndex === 0
                      ? false
                      : { opacity: 0, y: 16, filter: "blur(8px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, y: -14, filter: "blur(8px)" }}
                  transition={{ duration: reduce ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[clamp(1.35rem,4.4vw,2.4rem)] font-light leading-snug text-cream-100/90"
                >
                  {settings.intro[Math.min(lineIndex, settings.intro.length - 1)]}
                  {lineIndex === 1 && (
                    <Sparkles className="ml-2 inline h-5 w-5 text-ember-300 animate-twinkle" />
                  )}
                </motion.p>
              </AnimatePresence>

              <span className="h-px w-24 bg-gradient-to-r from-transparent via-cream-200/40 to-transparent" />
            </motion.div>
          )}

          {/* ---------------- STEP 2 — candle + gift ---------------- */}
          {stage === "candle" && (
            <motion.div
              key="candle"
              className="flex flex-col items-center gap-14"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.94, filter: "blur(12px)" }}
              transition={{ duration: reduce ? 0 : 0.55 }}
            >
              <motion.p
                className="font-display text-[clamp(1.1rem,3vw,1.6rem)] font-light text-cream-100/75"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.25 }}
              >
                Make a wish first.
              </motion.p>

              <BirthdayCandle
                onFlameLit={() => {
                  setFlameLit(true);
                  play("sparkle");
                }}
                scale={reduce ? 0.72 : 1}
              />

              {flameLit && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.6 }}
                >
                  <GiftBox
                    onOpen={handleOpen}
                    ctaLabel={settings.giftCta}
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ---------------- STEP 3 — the reveal ---------------- */}
          {stage === "reveal" && (
            <motion.div
              key="reveal"
              className="flex w-full max-w-4xl flex-col items-center gap-6"
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 1.08, filter: "blur(14px)" }}
              transition={{ duration: reduce ? 0 : 0.7 }}
            >
              <motion.h1
                className="font-display text-[clamp(1.6rem,5vw,3rem)] font-bold uppercase tracking-[0.28em] text-cream-50"
                initial={reduce ? false : { opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "0.28em" }}
                transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {settings.revealKicker}
              </motion.h1>

              <NameReveal name={settings.revealName} />

              <div className="mt-2 flex flex-col items-center gap-3">
                {settings.revealSubs.map((line, i) => (
                  <motion.p
                    key={i}
                    className={`max-w-2xl text-balance ${
                      i === 0
                        ? "text-lg font-semibold text-ember-300 sm:text-xl"
                        : "text-sm leading-relaxed text-cream-100/70 sm:text-base"
                    }`}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 1.4 + i * 0.35, duration: reduce ? 0 : 0.7 }}
                  >
                    {displayText(line)}
                  </motion.p>
                ))}
              </div>

              <motion.button
                type="button"
                onClick={enter}
                className="btn-primary mt-8 text-[13px] uppercase tracking-[0.18em] shadow-glow"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 2.5, duration: reduce ? 0 : 0.6 }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Enter the universe →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic hand-off veil */}
      <AnimatePresence>
        {entering && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[110] bg-violet-200"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 3 }}
            transition={{ duration: 0.62, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
