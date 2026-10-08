"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { seededRandom } from "@/lib/utils";

const COLORS = [
  "#ff8a3d",
  "#f4527a",
  "#8b5cf6",
  "#34d399",
  "#ffc48c",
];

/**
 * Balloons rising across the viewport. CSS keyframes only, fixed layer, no
 * pointer events — they decorate without ever blocking a click.
 */
export function BalloonRise({
  count = 9,
  className,
  seed = "balloons",
}: {
  count?: number;
  className?: string;
  seed?: string;
}) {
  const reduce = useReducedMotion();

  const balloons = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = seededRandom(`${seed}-${i}`);
        const r2 = seededRandom(`${seed}-${i}-b`);
        return {
          key: i,
          left: 2 + r * 94,
          size: 34 + r2 * 40,
          duration: 16 + r * 16,
          delay: r * 14,
          drift: (r2 - 0.5) * 90,
          color: COLORS[i % COLORS.length],
          wobble: 3 + r * 3,
        };
      }),
    [count, seed],
  );

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[70] overflow-hidden ${className ?? ""}`}
    >
      {balloons.map((b) => (
        <div
          key={b.key}
          className="absolute bottom-[-14vh] motion-reduce:hidden"
          style={{
            left: `${b.left}%`,
            width: b.size,
            animation: `lily-balloon-rise ${b.duration}s linear ${b.delay}s infinite`,
            ["--drift" as string]: `${b.drift}px`,
            ["--wobble" as string]: `${b.wobble}s`,
          }}
        >
          <div
            className="relative aspect-[3/4] w-full rounded-[50%_50%_46%_46%/60%_60%_40%_40%]"
            style={{
              background: `radial-gradient(60% 55% at 32% 26%, rgba(255,255,255,0.65), transparent 60%), ${b.color}`,
              boxShadow: `0 12px 26px -12px ${b.color}`,
              animation: `lily-balloon-sway var(--wobble) ease-in-out infinite`,
            }}
          >
            <span className="absolute -bottom-1.5 left-1/2 h-2 w-1 -translate-x-1/2 rotate-45 rounded-[1px] bg-black/15" />
          </div>
          <span
            className="mx-auto block h-10 w-px opacity-50"
            style={{ background: `linear-gradient(${b.color}, transparent)` }}
          />
        </div>
      ))}
    </div>
  );
}
