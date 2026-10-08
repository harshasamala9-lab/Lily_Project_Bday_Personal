"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Quote } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { ChaoticMoment } from "@/lib/types";
import { cn, displayText, isPlaceholder } from "@/lib/utils";

/**
 * 🏆 Best Lily Put Moments / 💀 Our Most Chaotic Moments
 * One cinematic scroll timeline with a progress rail that fills as you move.
 */
export function MomentsTimeline({
  moments,
  id = "moments",
  heading,
  eyebrow,
  lede,
  tone = "cream",
}: {
  moments: ChaoticMoment[];
  id?: string;
  heading: string;
  eyebrow: string;
  lede: string;
  tone?: "cream" | "night";
}) {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 78%", "end 40%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  const railHeight = useToPercent(fill);

  const night = tone === "night";

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28",
        night && "bg-night-900",
      )}
    >
      <div className="shell">
        <motion.header
          className="mb-14 flex flex-col items-center gap-5 text-center"
          initial={reduce ? undefined : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={cn("eyebrow", night && "border-cream-100/20 bg-cream-100/5 text-cream-200")}>
            {eyebrow}
          </span>
          <h2 className={cn("max-w-3xl text-[clamp(2rem,5.4vw,3.6rem)] leading-[1.05]", night && "text-cream-50")}>
            {heading}
          </h2>
          <p className={cn("max-w-2xl text-base leading-relaxed", night ? "text-cream-200/70" : "text-night-700/70")}>
            {lede}
          </p>
        </motion.header>

        <div ref={railRef} className="relative">
          {/* Rail */}
          <div
            aria-hidden
            className={cn(
              "absolute left-[22px] top-2 hidden h-[calc(100%-1rem)] w-0.5 rounded-full sm:block",
              night ? "bg-cream-100/12" : "bg-night-900/10",
            )}
          >
            <motion.div
              className="w-full rounded-full bg-gradient-to-b from-ember-400 via-berry-500 to-grape-500"
              style={reduce ? { height: "100%" } : { height: railHeight }}
            />
          </div>

          <ol className="space-y-6">
            {moments.map((moment, i) => (
              <TimelineItem
                key={moment.slug}
                moment={moment}
                index={i}
                night={night}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  moment,
  index,
  night,
}: {
  moment: ChaoticMoment;
  index: number;
  night: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 55%"],
  });
  const scale = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });

  return (
    <li className="relative">
      <motion.div
        ref={ref}
        className="flex gap-5"
        initial={reduce ? undefined : { opacity: 0, x: 28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Node */}
        <div className="relative z-10 shrink-0 sm:w-11">
          <motion.span
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-cream-50 bg-gradient-to-br from-ember-400 to-berry-500 text-[11px] font-black text-cream-50 shadow-soft sm:h-11 sm:w-11 sm:text-xs"
            style={reduce ? undefined : { scale }}
          >
            {String(moment.sequence ?? index + 1).padStart(2, "0")}
          </motion.span>
        </div>

        <div
          className={cn(
            "card-surface flex-1 p-6 transition-shadow duration-500 hover:shadow-lift sm:p-7",
            night && "border-cream-100/10 bg-night-800/70",
          )}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            {moment.label && (
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-bold",
                  night ? "bg-cream-100/10 text-cream-200" : "bg-night-900/5 text-night-800/70",
                )}
              >
                {moment.label}
              </span>
            )}
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.16em]",
                night ? "text-cream-200/40" : "text-night-700/40",
              )}
            >
              Moment #{String(moment.sequence ?? index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3
            className={cn(
              "mt-3.5 text-[clamp(1.25rem,3vw,1.75rem)] leading-snug",
              night && "text-cream-50",
            )}
          >
            {displayText(moment.title, "A chaotic moment")}
          </h3>

          <p
            className={cn(
              "mt-3 whitespace-pre-line text-[15px] leading-[1.75]",
              night ? "text-cream-200/75" : "text-night-800/72",
            )}
          >
            {isPlaceholder(moment.content)
              ? "The details are classified, but the chaos is confirmed."
              : moment.content}
          </p>

          {!isPlaceholder(moment.quote) && (
            <blockquote
              className={cn(
                "mt-5 flex gap-3 rounded-2xl p-4",
                night ? "bg-cream-100/5" : "bg-night-900/4",
              )}
            >
              <Quote className={cn("h-4 w-4 shrink-0", night ? "text-ember-300" : "text-berry-500")} />
              <p className={cn("font-script text-xl leading-snug", night ? "text-cream-100" : "text-night-900")}>
                {moment.quote}
              </p>
            </blockquote>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4">
            {moment.relatedSlug && (
              <Link
                href={`/moment/${moment.relatedSlug}`}
                className="text-[13px] font-semibold text-ember-600 transition-colors hover:text-ember-500"
              >
                Open the full moment →
              </Link>
            )}
            {moment.location ? (
              <span className={cn("text-[12.5px]", night ? "text-cream-200/45" : "text-night-700/50")}>
                📍 {moment.location}
              </span>
            ) : null}
          </div>
        </div>
      </motion.div>
    </li>
  );
}

/** Maps a 0–1 spring onto a CSS percentage. */
function useToPercent(spring: MotionValue<number>) {
  return useTransform(spring, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);
}
