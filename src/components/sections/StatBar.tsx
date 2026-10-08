"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  note?: string | null;
  delay?: number;
  tone?: "ember" | "berry" | "grape" | "mint";
}

const TONES = {
  ember: "from-ember-400 to-ember-600",
  berry: "from-berry-400 to-berry-600",
  grape: "from-grape-400 to-grape-600",
  mint: "from-mint-400 to-mint-500",
};

/** Animated personality stat. Bar fills when the row scrolls into view. */
export function StatBar({
  label,
  value,
  note,
  delay = 0,
  tone = "ember",
}: StatBarProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="group relative"
      initial={reduce ? undefined : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[15px] font-semibold text-cream-50">
          {label}
        </span>
        <span
          className={cn(
            "font-display text-lg font-bold tabular-nums",
            value >= 80 ? "text-ember-300" : "text-cream-200/50",
          )}
        >
          {value}%
        </span>
      </div>

      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-cream-100/10">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", TONES[tone])}
          initial={reduce ? { width: `${value}%` } : { width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{
            duration: reduce ? 0 : 1.25,
            delay: delay + 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>

      {note ? (
        <p className="mt-1.5 text-[12.5px] text-cream-200/55">{note}</p>
      ) : null}
    </motion.div>
  );
}
