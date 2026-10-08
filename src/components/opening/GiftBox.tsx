"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Gift } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GiftBoxProps {
  onOpen: () => void;
  ctaLabel: string;
  className?: string;
}

/**
 * The gift: floats, breathes, reacts to hover, and opens on click.
 * Opening lifts the lid and tips the box before handing off to the burst.
 */
export function GiftBox({ onOpen, ctaLabel, className }: GiftBoxProps) {
  const reduce = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const [hover, setHover] = useState(false);

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, reduce ? 200 : 720);
  }

  return (
    <div
      className={cn("flex flex-col items-center gap-9", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative [perspective:900px]">
        {/* Soft shadow cast on the floor */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-full h-10 w-40 rounded-[50%] bg-night-900/25 blur-xl"
          initial={{ x: "-50%" }}
          animate={
            reduce
              ? { x: "-50%" }
              : {
                  x: "-50%",
                  scaleX: [1, 0.86, 1],
                  opacity: [0.35, 0.2, 0.35],
                }
          }
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.button
          type="button"
          onClick={handleOpen}
          aria-label={ctaLabel}
          className="relative block cursor-pointer rounded-[32px] focus-visible:ring-4"
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -14, 0],
                  rotate: hover ? [-1.5, 1.5, -1.5] : [0, 0.8, 0],
                }
          }
          transition={{
            y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 0.7 },
          }}
          whileTap={{ scale: 0.95 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="relative"
            animate={reduce ? undefined : { rotateX: hover ? 12 : 4 }}
            transition={{ duration: 0.5 }}
          >
            {/* Lid */}
            {/* Centring is done with Framer Motion's own x transform: an inline
                motion transform would otherwise override a Tailwind translate
                utility and knock the lid out of alignment. */}
            <motion.div
              className="absolute -top-6 left-1/2 z-30 h-7 rounded-[14px] bg-gradient-to-b from-berry-400 to-berry-600 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)]"
              style={{ width: "min(70vw, 190px)" }}
              initial={{ x: "-50%", y: 0, rotateZ: 0, rotateX: 0 }}
              animate={
                opening
                  ? { x: "-50%", y: -70, rotateZ: -16, rotateX: 42, opacity: 0.85 }
                  : { x: "-50%", y: 0, rotateZ: 0, rotateX: 0 }
              }
              transition={{ duration: 0.65, ease: [0.34, 1.4, 0.5, 1] }}
            >
              <span className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-cream-100/85" />
              <span className="absolute left-1/2 top-1/2 h-full w-5 -translate-x-1/2 -translate-y-1/2 bg-cream-100/85" />
            </motion.div>

            {/* Box body */}
            <motion.div
              className="relative h-[168px] w-[172px] overflow-hidden rounded-[22px] bg-gradient-to-b from-ember-400 to-ember-600 shadow-[inset_0_14px_30px_rgba(255,255,255,0.28),0_24px_50px_-22px_rgba(11,7,19,0.65)]"
              animate={opening ? { rotate: -6, y: 12 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 bg-cream-100/80" />
              <span className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-cream-100/80" />
              <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" />

              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                animate={opening ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Gift className="h-10 w-10 text-cream-50 drop-shadow" />
              </motion.span>
            </motion.div>

            {/* Bow */}
            <motion.div
              className="absolute -top-9 left-1/2 z-20"
              initial={{ x: "-50%" }}
              animate={
                opening
                  ? { x: "-50%", scale: 0.6, opacity: 0, y: -30 }
                  : { x: "-50%", scale: 1, opacity: 1, y: 0 }
              }
              transition={{ duration: 0.5 }}
            >
              <span className="block h-5 w-24 rounded-full bg-cream-100 shadow-sm" />
            </motion.div>

            {/* Glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,164,87,0.45),transparent_65%)] blur-2xl"
              style={{
                opacity: opening ? 1 : 0.65 + (hover ? 0.35 : 0),
                transition: "opacity .4s ease",
              }}
            />
          </motion.div>
        </motion.button>
      </div>

      <motion.div
        className="flex flex-col items-center gap-2"
        animate={reduce ? undefined : { opacity: opening ? 0 : 1, y: opening ? 10 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="btn-primary text-[13px] font-bold uppercase tracking-[0.16em] sm:text-sm">
          🎁 {ctaLabel}
        </span>
        <span className="text-xs text-cream-200/55">
          tap the gift · it reacts to you
        </span>
      </motion.div>
    </div>
  );
}
