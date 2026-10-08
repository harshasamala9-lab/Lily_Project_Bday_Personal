"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Confetti } from "@/components/fx/Confetti";
import { SparkleField } from "@/components/fx/SparkleField";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { useSound } from "@/lib/use-sound";
import { displayText } from "@/lib/utils";

const UNSAID = [
  "I genuinely appreciate our friendship.",
  "You make ordinary days more fun.",
  "I'm glad we have so many ridiculous memories.",
  "You're genuinely a good person.",
  "Thank you for being yourself.",
  "Some friendships become important without you even noticing.",
];

/**
 * 🎂 Final Birthday Finale
 * Triggers the site-wide celebration when the finale scrolls into view.
 */
export function FinaleSection({
  kicker,
  lines,
  signature,
}: {
  kicker: string;
  lines: string[];
  signature: string;
}) {
  const reduce = useReducedMotion();
  const { celebrate, celebrateNonce } = useExperience();
  const { play } = useSound();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-35%" });

  // The celebration is a side effect, so it belongs in an effect. Calling
  // celebrate() from the render body updated ExperienceProvider state while
  // this component was rendering, which React rejects.
  useEffect(() => {
    if (!inView) return;
    celebrate();
    play("chime");
  }, [inView, celebrate, play]);

  const name = displayText(
    kicker.replace(/HAPPY BIRTHDAY,?/i, "").replace(/[🎂🎈]/g, "").trim(),
    "Lily Put",
  );
  const letters = name.split("");
  const baseDelay = 0.5;

  return (
    <section
      id="finale"
      ref={ref}
      className="relative overflow-hidden bg-night-900 py-24 text-center sm:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-night-sheen"
      />
      <SparkleField seed="finale" count={44} />
      <Confetti burst={celebrateNonce} count={200} originY={38} />

      <div className="shell relative">
        <motion.p
          className="text-[11px] font-bold uppercase tracking-[0.32em] text-ember-300"
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          The finale
        </motion.p>

        <h2 className="mt-6 font-display text-[clamp(2.2rem,8vw,5.5rem)] font-bold leading-[1.02] text-cream-50">
          <span className="block text-[clamp(1rem,3vw,1.6rem)] font-semibold tracking-[0.24em] text-ember-300">
            HAPPY BIRTHDAY
          </span>

          <span className="mt-2 block">
            {letters.map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className="inline-block bg-gradient-to-br from-cream-50 via-ember-300 to-berry-400 bg-clip-text text-transparent"
                initial={reduce ? undefined : { opacity: 0, y: 44, rotateX: -60 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: baseDelay + i * 0.09,
                  duration: 0.7,
                  ease: [0.22, 1.4, 0.4, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <span className="text-3xl sm:text-5xl"> 🎂🎈</span>
          </span>
        </h2>

        <div className="mx-auto mt-10 max-w-2xl space-y-5">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              className={
                i === lines.length - 1
                  ? "text-lg font-semibold text-cream-50 sm:text-xl"
                  : "text-[15.5px] leading-relaxed text-cream-200/72 sm:text-base"
              }
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.7, delay: baseDelay + 0.6 + i * 0.28 }}
            >
              {displayText(line)}
            </motion.p>
          ))}

          <motion.p
            className="pt-4 font-script text-4xl text-ember-300"
            initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: baseDelay + 1.6 }}
          >
            {displayText(signature, "— Mahi")}
          </motion.p>
        </div>

        {/* Things I never say enough */}
        <div className="mx-auto mt-20 max-w-4xl">
          <motion.h3
            className="text-[11px] font-bold uppercase tracking-[0.26em] text-cream-200/45"
            initial={reduce ? undefined : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            😭 Things I Never Say Enough…
          </motion.h3>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {UNSAID.map((line, i) => (
              <motion.p
                key={line}
                className="rounded-2xl border border-cream-100/10 bg-cream-100/5 px-5 py-4 text-[14px] leading-relaxed text-cream-100/80 backdrop-blur-sm"
                initial={reduce ? undefined : { opacity: 0, y: 18, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: (i % 6) * 0.07 }}
                whileHover={reduce ? undefined : { y: -4 }}
              >
                “{line}”
              </motion.p>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/universe" className="btn-primary">
            🔗 Revisit the whole universe
          </Link>
          <Link href="/" className="btn-ghost">
            ↑ Back to the top
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
