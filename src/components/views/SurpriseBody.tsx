"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Gift, PartyPopper, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { Confetti } from "@/components/fx/Confetti";
import { SparkleField } from "@/components/fx/SparkleField";
import { useSound } from "@/lib/use-sound";
import { cn, isPlaceholder } from "@/lib/utils";

/**
 * Surprise pages get their own flavour based on slug and optional content.
 */
export function SurpriseBody({
  slug,
  title,
  content,
}: {
  slug: string;
  title: string;
  content: string | null;
}) {
  const reduce = useReducedMotion();
  const { play } = useSound();
  const [burst, setBurst] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const celebrate = useCallback(() => {
    setBurst((n) => n + 1);
    play("chime");
    setRevealed(true);
  }, [play]);

  const copy =
    content && !isPlaceholder(content)
      ? content
      : "A little extra birthday surprise, because one ending was clearly not enough.";

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-cream-100/12 bg-night-800/60 p-9 text-center sm:p-14">
      <SparkleField seed={slug} count={20} bounds="panel" />
      <Confetti burst={burst} count={90} originY={45} />

      <motion.div
        className={cn(
          "relative mx-auto grid place-items-center rounded-[32px] bg-gradient-to-br from-ember-400 to-berry-500 text-cream-50 shadow-glow",
          revealed ? "h-28 w-28" : "h-24 w-24",
        )}
        animate={reduce ? undefined : { y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {slug === "hidden-surprise" ? (
          <Sparkles className="h-11 w-11" />
        ) : (
          <Gift className="h-11 w-11" />
        )}
      </motion.div>

      <h2 className="relative mt-8 text-[clamp(1.4rem,4vw,2.1rem)] text-cream-50">
        {title}
      </h2>

      <motion.p
        className="relative mx-auto mt-4 max-w-xl whitespace-pre-line text-[15.5px] leading-relaxed text-cream-100/78"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0.4 }}
        transition={{ duration: 0.6 }}
      >
        {revealed ? copy : "Tap below. Genuinely no idea what happens."}
      </motion.p>

      <button
        type="button"
        onClick={celebrate}
        disabled={revealed}
        className={cn(
          "relative mt-9 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.18em] transition-all active:scale-95",
          revealed
            ? "cursor-default bg-cream-100/8 text-cream-200/45"
            : "bg-cream-50 text-night-900 hover:-translate-y-1 hover:bg-white",
        )}
      >
        <span className="inline-flex items-center gap-2">
          <PartyPopper className="h-4 w-4" />
          {revealed ? "Opened" : "Open it"}
        </span>
      </button>
    </div>
  );
}
