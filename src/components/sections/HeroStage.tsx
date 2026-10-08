"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState } from "react";
import type { ExperienceLink } from "@/lib/types";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { BalloonRise } from "@/components/fx/BalloonRise";
import { SparkleField } from "@/components/fx/SparkleField";
import { LinkUniverseStrip } from "@/components/links/LinkUniverseStrip";
import { useSound } from "@/lib/use-sound";

/**
 * The hero that greets you once the gift is open. Keeps the name tappable
 * (easter egg), holds a parallax camera on pointer move, and paces the scroll.
 */
export function HeroStage({
  name,
  tagline,
  bio,
  links,
}: {
  name: string;
  tagline: string;
  bio: string;
  links: ExperienceLink[];
}) {
  const reduce = useReducedMotion();
  const { showBalloons, foundEgg } = useExperience();
  const { play } = useSound();
  const taps = useTaps(5, () => foundEgg("Name taps", "Stop poking her name. 😂"));

  return (
    <section className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden pt-[var(--nav-h)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_0%,rgba(139,92,246,0.35),transparent_62%),radial-gradient(60%_50%_at_18%_40%,rgba(244,82,122,0.18),transparent_65%),radial-gradient(65%_55%_at_85%_30%,rgba(167,139,250,0.22),transparent_65%)]"
      />
      <SparkleField seed="hero" count={30} />
      {showBalloons && <BalloonRise count={8} />}

      <div className="shell relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.span
            className="eyebrow"
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🎂 Made for one person
          </motion.span>

          <motion.h1
            className="mt-6 text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-[0.98]"
            initial={reduce ? undefined : { opacity: 0, y: 26, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Happy Birthday,
            <br />
            <button
              type="button"
              onClick={() => {
                taps.bump();
                play("sparkle");
              }}
              className="text-gradient mt-1 inline-block cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              aria-label={name}
            >
              {name}
              {taps.nearLimit ? (
                <motion.span
                  className="ml-2 inline-block align-super text-2xl"
                  animate={reduce ? undefined : { rotate: [0, 14, -14, 0], scale: [1, 1.3, 1.3, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  👀
                </motion.span>
              ) : null}
            </button>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-[17px] leading-relaxed text-cream-100/78"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {tagline}
          </motion.p>

          <motion.p
            className="mt-3 max-w-xl text-[15px] leading-relaxed text-cream-200/62"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            {bio}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <a href="#lore" className="btn-primary">
              Start exploring
              <ArrowDown className="h-4 w-4" />
            </a>
            <a href="/universe" className="btn-ghost">
              🔗 Little Internet Universe
            </a>
          </motion.div>

          <motion.p
            className="mt-8 text-[12.5px] text-cream-200/45"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Pro tip: there are easter eggs. Try the name. Try the keys. Try the
            tiny star. 🎂
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto hidden aspect-square w-full max-w-md lg:block"
          initial={reduce ? undefined : { opacity: 0, scale: 0.86, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1.3, 0.4, 1] }}
        >
          <CardStack />
        </motion.div>
      </div>

      <LinkUniverseStrip links={links} />
    </section>
  );
}

/** Layered card stack — a preview of the type of things inside. */
function CardStack() {
  const reduce = useReducedMotion();
  const layers = [
    { label: "😂 Inside joke", tone: "from-berry-400 to-berry-600", rotate: -9, y: 0 },
    { label: "📸 A memory", tone: "from-grape-400 to-grape-600", rotate: 7, y: 0 },
    { label: "💌 A message", tone: "from-ember-400 to-ember-600", rotate: -3, y: 0 },
  ];

  return (
    <div className="relative h-full w-full">
      {layers.map((layer, i) => (
        <motion.div
          key={layer.label}
          className={`absolute left-1/2 top-1/2 grid h-[56%] w-[70%] place-items-center rounded-[30px] bg-gradient-to-br ${layer.tone} p-6 text-center shadow-lift`}
          /* x/y offsets come from Framer Motion, not Tailwind translate
             utilities — an inline motion transform replaces `transform`. */
          initial={{ x: "-50%", y: "-50%", rotate: layer.rotate }}
          animate={
            reduce
              ? { x: "-50%", y: "-50%", rotate: layer.rotate }
              : { x: "-50%", y: ["-50%", "calc(-50% - 12px)", "-50%"], rotate: layer.rotate }
          }
          transition={{
            duration: 6 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          <span className="text-center font-display text-xl font-semibold text-cream-50">
            {layer.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Counts taps and fires the easter egg at the threshold. State (not a ref) so
 * the "👀" hint can appear in the last few taps.
 */
function useTaps(threshold: number, onFire: () => void) {
  const [count, setCount] = useState(0);

  function bump() {
    const next = count + 1;
    if (next >= threshold) {
      onFire();
      setCount(0);
      return;
    }
    setCount(next);
  }

  return {
    nearLimit: count >= threshold - 2,
    bump,
  };
}
