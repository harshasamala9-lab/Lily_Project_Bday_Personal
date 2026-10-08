"use client";

import * as Icons from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { createElement } from "react";
import type { ExperienceLink } from "@/lib/types";
import { cn, isPlaceholder, isExternalUrl } from "@/lib/utils";

/** Resolves a configured icon name (e.g. "LockKeyhole") to a Lucide component. */
export function linkIcon(name: string): Icons.LucideIcon {
  const table = Icons as unknown as Record<string, Icons.LucideIcon | undefined>;
  return table[name] ?? Icons.Sparkles;
}

export function LinkIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return createElement(linkIcon(name), { className, "aria-hidden": true });
}

const ACCENT_BY_TYPE = {
  memory: "from-grape-400 to-grape-600",
  "inside-joke": "from-ember-400 to-ember-600",
  message: "from-berry-400 to-berry-600",
  letter: "from-berry-400 to-berry-600",
  secret: "from-mint-400 to-mint-500",
  quiz: "from-ember-500 to-berry-500",
  surprise: "from-ember-400 to-berry-500",
  lore: "from-grape-500 to-berry-500",
  moment: "from-ember-500 to-mint-500",
  external: "from-night-700 to-night-900",
} as const;

type IdleMotion = Record<string, number[]>;

const MOTION: Record<string, IdleMotion> = {
  float: { y: [0, -8, 0] },
  tilt: { rotate: [-1.4, 1.4, -1.4], y: [0, -5, 0] },
  glow: { scale: [1, 1.025, 1] },
  reveal: { y: [0, -4, 0], opacity: [1, 0.92, 1] },
  pop: { scale: [1, 1.05, 1] },
};

/**
 * 🔗 A single card in Lily Put's Little Internet Universe.
 * Title, description, icon, destination, animation and order come from content.
 */
export function LinkUniverseCard({
  link,
  index = 0,
  compact = false,
}: {
  link: ExperienceLink;
  index?: number;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const external = isExternalUrl(link.destination);
  const href = external ? link.destination : link.destination || "/";
  const accent = ACCENT_BY_TYPE[link.type] ?? ACCENT_BY_TYPE.surprise;
  const motionKey = MOTION[link.animation] ?? MOTION.float;
  const idleAnimation = reduce
    ? undefined
    : {
        ...motionKey,
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
      };

  const inner = (
    <motion.article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-grape-400/16 bg-night-800/75 p-6 shadow-soft transition-all duration-500 backdrop-blur-sm",
        "hover:-translate-y-2 hover:border-grape-400/35 hover:shadow-lift",
        compact && "p-5",
      )}
      initial={reduce ? undefined : { opacity: 0, y: 26, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, delay: (index % 9) * 0.05 }}
      animate={idleAnimation}
      whileHover={reduce ? undefined : { y: -10, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-gradient-to-br opacity-25 blur-2xl transition-transform duration-700 group-hover:scale-150",
          accent,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid place-items-center rounded-2xl bg-gradient-to-br text-cream-50 shadow-soft",
            accent,
            compact ? "h-10 w-10" : "h-12 w-12",
          )}
        >
          <LinkIcon name={link.icon} className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </span>

        {link.eyebrow && (
          <span className="rounded-full border border-grape-400/12 bg-cream-100/6 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-cream-200/55">
            {link.eyebrow}
          </span>
        )}
      </div>

      <h3 className={cn("relative mt-5 font-display font-semibold leading-snug", compact ? "text-base" : "text-lg")}>
        {link.title}
      </h3>

      <p className="relative mt-2 flex-1 text-[13.5px] leading-relaxed text-cream-200/62">
        {isPlaceholder(link.description)
          ? "A small birthday portal with suspiciously specific energy."
          : link.description}
      </p>

      <span className="relative mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ember-600">
        {link.cta ?? "Open"}
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </motion.article>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}
