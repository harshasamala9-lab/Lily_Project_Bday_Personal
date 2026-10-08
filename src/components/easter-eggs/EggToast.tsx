"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, X } from "lucide-react";
import { useEffect } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";

/** Toast shown whenever an easter egg fires. Auto-dismisses. */
export function EggToast() {
  const { egg, dismissEgg } = useExperience();

  useEffect(() => {
    if (!egg) return;
    const t = window.setTimeout(dismissEgg, 6000);
    return () => window.clearTimeout(t);
  }, [egg, dismissEgg]);

  return (
    <AnimatePresence>
      {egg && (
        <motion.div
          key={egg.nonce}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1.4, 0.4, 1] }}
          className="fixed inset-x-4 top-[calc(var(--nav-h)+0.75rem)] z-[95] mx-auto max-w-md rounded-3xl border border-grape-400/18 bg-night-900/95 p-4 shadow-lift backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ember-400 to-berry-500 text-cream-50">
              <PartyPopper className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ember-600">
                Easter egg found
              </p>
              <p className="mt-0.5 text-sm font-semibold text-cream-50">
                {egg.title}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-cream-200/70">
                {egg.payload}
              </p>
            </div>
            <button
              type="button"
              onClick={dismissEgg}
              aria-label="Dismiss"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-cream-100/45 transition-colors hover:bg-cream-100/8 hover:text-cream-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
