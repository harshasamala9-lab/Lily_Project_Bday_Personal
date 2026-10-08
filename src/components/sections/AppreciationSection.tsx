"use client";

import * as Icons from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { AppreciationCard } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { useSound } from "@/lib/use-sound";
import { cn, isPlaceholder } from "@/lib/utils";

const ACCENTS = {
  berry: {
    ring: "group-hover:border-berry-500/40",
    wash: "bg-berry-500/10 text-berry-600",
    glow: "group-hover:shadow-[0_28px_70px_-30px_rgba(244,82,122,0.65)]",
  },
  ember: {
    ring: "group-hover:border-ember-500/45",
    wash: "bg-ember-500/12 text-ember-600",
    glow: "group-hover:shadow-[0_28px_70px_-30px_rgba(242,107,29,0.7)]",
  },
  grape: {
    ring: "group-hover:border-grape-500/40",
    wash: "bg-grape-500/10 text-grape-600",
    glow: "group-hover:shadow-[0_28px_70px_-30px_rgba(139,92,246,0.65)]",
  },
  mint: {
    ring: "group-hover:border-mint-500/45",
    wash: "bg-mint-500/12 text-mint-500",
    glow: "group-hover:shadow-[0_28px_70px_-30px_rgba(52,211,153,0.6)]",
  },
} as const;

/**
 * 😭 Things Lily Put Does That I Secretly Love
 * Friendship appreciation. Deliberately platonic — "love" here means
 * "genuinely appreciate about my friend".
 */
export function AppreciationSection({ cards }: { cards: AppreciationCard[] }) {
  return (
    <Section
      id="appreciation"
      eyebrow="😭 Genuinely appreciated"
      title={
        <>
          Things Lily Put Does
          <br className="hidden sm:block" /> That I Secretly Love
        </>
      }
      lede="For legal reasons, this is friendship appreciation."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <AppreciationCard key={card.slug} card={card} index={i} />
        ))}
      </div>
    </Section>
  );
}

function AppreciationCard({
  card,
  index,
}: {
  card: AppreciationCard;
  index: number;
}) {
  const reduce = useReducedMotion();
  const { play } = useSound();
  const accent = ACCENTS[card.accent ?? "berry"];
  const Icon = (card.icon && (Icons as Record<string, unknown>)[card.icon]
    ? (Icons as unknown as Record<string, Icons.LucideIcon>)[card.icon]
    : Icons.Sparkles) as Icons.LucideIcon;

  return (
    <motion.article
      className={cn(
        "group relative h-full cursor-pointer overflow-hidden rounded-[26px] border border-grape-400/16 bg-night-800/75 p-6 shadow-soft transition-all duration-500 hover:-translate-y-2",
        accent.ring,
        accent.glow,
      )}
      initial={reduce ? undefined : { opacity: 0, y: 24, rotate: index % 3 === 1 ? 1 : -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.05 }}
      whileHover={reduce ? undefined : { rotate: index % 2 === 0 ? -1.2 : 1.2 }}
      onClick={() => play("pop")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-grape-400/25 blur-2xl transition-transform duration-700 group-hover:scale-150"
      />

      <span className={cn("grid h-11 w-11 place-items-center rounded-2xl", accent.wash)}>
        <Icon className="h-5 w-5" />
      </span>

      <h3 className="mt-5 text-[19px] leading-snug">{card.title}</h3>

      <p className="mt-2.5 text-[14px] leading-relaxed text-cream-200/64">
        {isPlaceholder(card.note)
          ? "[ ADD A LINE HERE ]"
          : card.note}
      </p>
    </motion.article>
  );
}
