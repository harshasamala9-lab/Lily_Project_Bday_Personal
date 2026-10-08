"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 4DX Birthday Candle
 * -------------------
 * The dramatic entrance, the delayed ignition, the flickering 4D flame and the
 * ambient glow burst are all reproduced from the reference animation.
 *
 * Class contract:
 *   onFlameLit  → fired once the flame is visibly lit (drives the CTA reveal)
 *   interactive  → wiggle on hover/tap (pointer-coarse devices included)
 */

interface BirthdayCandleProps {
  onFlameLit?: () => void;
  className?: string;
  scale?: number;
}

export function BirthdayCandle({
  onFlameLit,
  className,
  scale = 1,
}: BirthdayCandleProps) {
  const reduce = useReducedMotion();
  const [nudged, setNudged] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const delay = reduce ? 150 : 1700;
    const t = window.setTimeout(() => onFlameLit?.(), delay);
    return () => window.clearTimeout(t);
  }, [onFlameLit, reduce]);

  function nudge() {
    if (reduce) return;
    setNudged((n) => n + 1);
  }

  return (
    <div
      className={cn(
        "relative flex select-none flex-col items-center justify-end",
        className,
      )}
      style={{
        width: 60 * scale,
        height: 300 * scale,
        transformStyle: "preserve-3d",
        animation: reduce
          ? undefined
          : "candle-entrance 1.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
      }}
      onMouseEnter={nudge}
      onClick={nudge}
      role="img"
      aria-label="A birthday candle, lit"
    >
      {/* Ambient environment light burst */}
      <span
        className="pointer-events-none absolute rounded-full"
        style={{
          top: -20 * scale,
          width: 80 * scale,
          height: 80 * scale,
          background:
            "radial-gradient(circle, rgba(255,146,43,0.34) 0%, transparent 70%)",
          animation: reduce
            ? undefined
            : `candle-glow 1s ease-out 1.4s forwards, candle-wiggle 0.7s ease-in-out ${nudged * 700}ms`,
          transformOrigin: "50% 100%",
        }}
      />

      {/* 4D flickering flame */}
      <span
        className="relative"
        style={{
          width: 24 * scale,
          height: 40 * scale,
          background:
            "radial-gradient(circle at 50% 80%, #fff 20%, #ffd43b 40%, #ff922b 60%, transparent 80%)",
          borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%",
          filter: `drop-shadow(0 0 ${12 * scale}px rgba(255,146,43,0.85))`,
          transformOrigin: "50% 90%",
          animation: reduce
            ? "none"
            : `candle-ignite 0.5s ease-out 1.2s forwards, candle-flame-4d 1.2s ease-in-out 1.7s infinite alternate, candle-wiggle 0.7s ease-in-out ${nudged * 700}ms`,
        }}
      />

      {/* Wick */}
      <span
        className="z-[1]"
        style={{
          width: 4 * scale,
          height: 20 * scale,
          backgroundColor: "#2c2c2c",
          borderRadius: 2 * scale,
          marginBottom: -2 * scale,
        }}
      />

      {/* Striped candle body */}
      <span
        className="relative"
        style={{
          width: 40 * scale,
          height: 180 * scale,
          background:
            "linear-gradient(to right, #ff6b6b, #ff8787, #ff6b6b)",
          borderRadius: `${6 * scale}px ${6 * scale}px ${4 * scale}px ${4 * scale}px`,
          boxShadow: `inset 0 ${10 * scale}px ${20 * scale}px rgba(255,255,255,0.2), 0 ${10 * scale}px ${25 * scale}px rgba(0,0,0,0.35)`,
        }}
      >
        <span
          className="absolute inset-0 h-full w-full"
          style={{
            background: `repeating-linear-gradient(45deg, transparent, transparent ${15 * scale}px, rgba(255,255,255,0.6) ${15 * scale}px, rgba(255,255,255,0.6) ${30 * scale}px)`,
            borderRadius: "inherit",
            opacity: 0.8,
          }}
        />
      </span>
    </div>
  );
}
