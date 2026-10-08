"use client";

import { useEffect } from "react";
import type { EasterEgg } from "@/lib/types";
import { useExperience } from "@/components/experience/ExperienceProvider";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Global easter-egg listener.
 *
 * Database-driven: the payload for each trigger lives in public.easter_eggs,
 * so new eggs ship as rows rather than code. Disabled entirely for visitors
 * who prefer reduced motion.
 */
export function EasterEggWatcher({ eggs }: { eggs: EasterEgg[] }) {
  const { foundEgg, egg } = useExperience();

  useEffect(() => {
    const byTrigger = new Map(eggs.map((e) => [e.trigger, e]));

    function fire(trigger: EasterEgg["trigger"], key?: string) {
      const egg = byTrigger.get(trigger);
      if (!egg) return;
      if (key && egg.secretKey && egg.secretKey !== key) return;
      foundEgg(egg.title, egg.payload);
    }

    // Keyboard combo
    let buffer = "";
    let konamiIndex = 0;
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer = (buffer + key).slice(-24);

      for (const candidate of byTrigger.values()) {
        if (candidate.trigger !== "keyboard") continue;
        const combo = candidate.secretKey ?? "";
        if (combo && buffer.endsWith(combo)) {
          fire("keyboard", combo);
          buffer = "";
        }
      }

      konamiIndex =
        key.toLowerCase() === KONAMI[konamiIndex]?.toLowerCase()
          ? konamiIndex + 1
          : 0;
      if (konamiIndex === KONAMI.length) {
        fire("konami", "upupdowndownleftrightleftrightbaba");
        konamiIndex = 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [eggs, foundEgg, egg?.nonce]);

  return null;
}
