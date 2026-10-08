"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  color: string;
  shape: "rect" | "circle" | "ribbon";
}

const COLORS = [
  "#ff8a3d",
  "#f4527a",
  "#8b5cf6",
  "#34d399",
  "#ffc48c",
  "#ffd166",
];

interface ConfettiProps {
  /** Increment to trigger a new burst. */
  burst: number;
  count?: number;
  className?: string;
  /** Origin as viewport percentages. */
  originX?: number;
  originY?: number;
}

let nextId = 0;

/** How long a piece stays on screen, in ms. */
const LIFE_MS = 4200;

/**
 * Canvas confetti burst. One rAF loop, no per-frame React state, so it stays
 * smooth on low-end mobile. Skipped entirely when motion is reduced.
 */
export function Confetti({
  burst,
  count = 120,
  className,
  originX = 50,
  originY = 42,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  const palette = useMemo(() => COLORS, []);

  useEffect(() => {
    if (reduce || burst === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();

    const pieces = Array.from({ length: count }, (_, i) => ({
      // Staggered release so the burst reads as a spray, not a single pulse.
      delay: (i / count) * 260,
      x: (window.innerWidth * originX) / 100,
      y: (window.innerHeight * originY) / 100,
      vx: (Math.random() - 0.5) * 13,
      vy: -(6 + Math.random() * 11),
      size: 6 + Math.random() * 9,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.34,
      color: palette[i % palette.length],
      shape: (Math.random() > 0.72 ? "circle" : "rect") as "circle" | "rect",
      wobble: Math.random() * Math.PI * 2,
      id: nextId++,
    }));

    let raf = 0;

    const frame = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      const alive = pieces.filter(
        (piece) => t > piece.delay && t < LIFE_MS + piece.delay,
      );
      for (const p of alive) {
        p.vy += 0.32;
        p.vx *= 0.995;
        p.wobble += 0.06;
        p.x += p.vx + Math.sin(p.wobble) * 1.1;
        p.y += p.vy;
        p.rot += p.vr;

        const age = t - p.delay;
        const fade = age > 3200 ? Math.max(0, 1 - (age - 3200) / 1000) : 1;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x * dpr, p.y * dpr);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.42 * dpr, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(
            -p.size * 0.5 * dpr,
            -p.size * 0.26 * dpr,
            p.size * dpr,
            p.size * 0.52 * dpr,
          );
        }
        ctx.restore();
      }

      if (alive.length) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [burst, count, originX, originY, palette, reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[90] ${className ?? ""}`}
    />
  );
}
