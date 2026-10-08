"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Play, Quote, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import type { InsideJoke } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { useSound } from "@/lib/use-sound";
import { cn, displayText, isPlaceholder } from "@/lib/utils";

/**
 * 😂 Things Only We Understand
 * Cards expand into an immersive, dimmed reveal with the full story, quote
 * and optional media.
 */
export function JokesSection({ jokes }: { jokes: InsideJoke[] }) {
  const [open, setOpen] = useState<InsideJoke | null>(null);
  const { play } = useSound();

  const close = useCallback(() => {
    play("page");
    setOpen(null);
  }, [play]);

  return (
    <section id="jokes" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <header className="mb-12 flex flex-col items-center gap-5 text-center">
            <span className="eyebrow">😂 Inside archive</span>
            <h2 className="max-w-3xl text-[clamp(2rem,5.4vw,3.6rem)] leading-[1.05]">
              Things Only We Understand
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-cream-200/70">
              You had to be there. Fortunately, here it all is.
            </p>
          </header>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {jokes.map((joke, i) => (
            <Reveal key={joke.slug} delay={i * 0.08}>
              <motion.button
                type="button"
                onClick={() => {
                  play("pop");
                  setOpen(joke);
                }}
                whileHover={undefined}
                className="card-surface group h-full w-full p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-grape-400/35 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl leading-snug transition-colors group-hover:text-ember-600">
                    {displayText(joke.title, "Inside joke")}
                  </h3>
                  <span className="mt-0.5 shrink-0 rounded-full border border-grape-400/12 bg-cream-100/7 px-2.5 py-1 text-[11px] font-semibold text-cream-200/55">
                    0{i + 1}
                  </span>
                </div>

                <p className="mt-3 text-[14.5px] leading-relaxed text-cream-200/65">
                  {isPlaceholder(joke.preview)
                    ? "A joke with classified context and suspicious staying power."
                    : joke.preview}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ember-600">
                  Open the full story
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[88] flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <div
              className="absolute inset-0 bg-night-900/70 backdrop-blur-md"
              onClick={close}
            />

            <motion.div
              className="relative flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[32px] border border-grape-400/18 bg-night-900 shadow-lift sm:rounded-[32px]"
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {open.imageUrl ? (
                <div className="relative h-44 w-full overflow-hidden sm:h-56">
                  <Image
                    src={open.imageUrl}
                    alt={displayText(open.title, "Joke image")}
                    fill
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/10 to-transparent" />
                </div>
              ) : null}

              <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6 sm:px-9">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[clamp(1.5rem,4vw,2.2rem)] leading-tight">
                    {displayText(open.title, "Inside joke")}
                  </h3>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-grape-400/18 bg-cream-100/8 text-cream-100 transition-transform hover:rotate-90 active:scale-95"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-4 whitespace-pre-line text-[15.5px] leading-[1.75] text-cream-100/80">
                  {isPlaceholder(open.story)
                    ? "The full story is classified because explaining it would only make it less funny."
                    : open.story}
                </p>

                {!isPlaceholder(open.quote) && (
                  <blockquote className="mt-6 flex gap-3 rounded-2xl bg-cream-100/7 p-5">
                    <Quote className="h-5 w-5 shrink-0 text-berry-500" />
                    <p className="font-script text-2xl leading-snug text-violet-100">
                      {open.quote}
                    </p>
                  </blockquote>
                )}

                {open.videoUrl && (
                  <div className="mt-6 overflow-hidden rounded-2xl">
                    <video
                      src={open.videoUrl}
                      controls
                      playsInline
                      className="w-full"
                    />
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <ReactionRow slug={open.slug} emojis={open.reactions} />
                  {open.externalUrl && (
                    <a
                      href={open.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost !px-4 !py-2 text-[13px]"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Open original
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Lightweight emoji reactions kept in sessionStorage — no server round trip. */
function ReactionRow({ slug, emojis }: { slug: string; emojis: string[] }) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  function react(emoji: string) {
    const key = `lily-put-universe:react:${slug}`;
    const next = { ...counts, [emoji]: (counts[emoji] ?? 0) + 1 };
    setCounts(next);
    try {
      window.sessionStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* storage disabled — reactions stay local to this view */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => react(emoji)}
          aria-label={`React with ${emoji}`}
          className={cn(
            "rounded-full border border-grape-400/16 bg-cream-100/7 px-3 py-1.5 text-sm text-cream-100",
            "transition-all hover:-translate-y-0.5 hover:border-grape-400/35 active:scale-95",
          )}
        >
          {emoji}
          {counts[emoji] ? (
            <span className="ml-1 text-[11px] font-bold text-cream-200/60">
              {counts[emoji]}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
