"use client";

import { useMemo } from "react";
import { seededRandom } from "@/lib/utils";

interface SparkleFieldProps {
  /** Stable seed so SSR and client agree. */
  seed?: string;
  count?: number;
  className?: string;
  /** Area the sparkles live in. */
  bounds?: "full" | "panel";
}

/**
 * Deterministic decorative sparkle field. Pure CSS animation — no rAF loop —
 * so it costs almost nothing on low-end devices.
 */
export function SparkleField({
  seed = "lily",
  count = 26,
  className,
  bounds = "full",
}: SparkleFieldProps) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = seededRandom(`${seed}-${i}`);
        const r2 = seededRandom(`${seed}-${i}-b`);
        return {
          key: i,
          left: r * 100,
          top: r2 * 100,
          size: 5 + r * 9,
          delay: r2 * 6,
          duration: 2.6 + r * 3.4,
          opacity: 0.25 + r2 * 0.5,
        };
      }),
    [seed, count],
  );

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        bounds === "panel" ? "rounded-[28px]" : ""
      } ${className ?? ""}`}
    >
      {stars.map((s) => (
        <span
          key={s.key}
          className="absolute rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.85)] animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
