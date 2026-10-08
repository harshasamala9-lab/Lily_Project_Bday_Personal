"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  type?: "button" | "submit";
}

/**
 * Magnetic hover: the button leans toward the cursor and springs back on
 * leave. Pointer-coarse devices skip the effect entirely.
 */
export function MagneticButton({
  children,
  className,
  strength = 18,
  as = "button",
  href,
  onClick,
  ariaLabel,
  type = "button",
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  function handleMove(e: React.MouseEvent) {
    if (reduce || !window.matchMedia("(pointer: fine)").matches || !ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set((dx / rect.width) * strength * 2);
    y.set((dy / rect.height) * strength * 2);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const style = reduce ? undefined : { x: sx, y: sy };

  if (as === "a" && href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onBlur={reset}
        style={style}
        whileTap={{ scale: 0.97 }}
        className={className}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      style={style}
      whileTap={{ scale: 0.96 }}
      className={cn(className)}
    >
      {children}
    </motion.button>
  );
}
