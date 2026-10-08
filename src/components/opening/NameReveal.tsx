"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { seededRandom } from "@/lib/utils";

interface NameRevealProps {
  name: string;
  className?: string;
}

/**
 * Per-letter reveal with a sparkle on every character, plus an elegant
 * particle halo around the name.
 */
export function NameReveal({ name, className }: NameRevealProps) {
  const reduce = useReducedMotion();
  const letters = name.split("");

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const r = seededRandom(`halo-${i}`);
        const angle = r * Math.PI * 2;
        const radius = 90 + r * 130;
        return {
          key: i,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius * 0.62,
          size: 3 + r * 5,
          delay: 0.9 + r * 1.4,
        };
      }),
    [],
  );

  return (
    <div className={className}>
      <div className="relative inline-flex flex-wrap items-baseline justify-center gap-x-[0.02em]">
        {letters.map((char, i) => (
          <span
            key={`${char}-${i}`}
            className="relative inline-block"
            aria-label={i === 0 ? name : undefined}
          >
            <motion.span
              className="inline-block bg-gradient-to-br from-cream-50 via-ember-300 to-berry-400 bg-clip-text font-display text-[clamp(3rem,13vw,8.5rem)] font-bold leading-[0.95] text-transparent"
              style={{
                backgroundSize: "220% auto",
                animation: reduce ? undefined : "lily-sheen 9s linear infinite",
              }}
              initial={reduce ? undefined : { opacity: 0, y: 40, rotateX: -70, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{
                delay: 0.35 + i * 0.16,
                duration: 0.75,
                ease: [0.22, 1.4, 0.4, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {!reduce && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-ember-300"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 0] }}
                transition={{
                  delay: 0.55 + i * 0.16,
                  duration: 0.7,
                  ease: "easeOut",
                }}
              />
            )}
          </span>
        ))}

        {/* Elegant particle halo */}
        {!reduce &&
          particles.map((p) => (
            <motion.span
              key={p.key}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-ember-300/90"
              style={{
                width: p.size,
                height: p.size,
                boxShadow: "0 0 12px 2px rgba(255,196,140,0.7)",
              }}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.95, 0],
                x: p.x,
                y: p.y,
              }}
              transition={{
                delay: p.delay,
                duration: 2.6,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 1.4,
              }}
            />
          ))}
      </div>

      <span className="sr-only">{name}</span>
    </div>
  );
}
