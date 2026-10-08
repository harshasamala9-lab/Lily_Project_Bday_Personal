import { PenLine } from "lucide-react";
import type { Letter } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { cn, isPlaceholder, sanitizeText } from "@/lib/utils";

const CHAPTER_TITLES = [
  "What this is",
  "The chaos part",
  "The real friend part",
  "The little things",
  "The next year",
  "The final note",
];

/**
 * 💌 A Proper Birthday Letter
 * Paper surface, subtle grain, content-driven paragraphs.
 */
export function LetterSection({ letter }: { letter: Letter }) {
  const paragraphs = letter.body
    .map((p) => sanitizeText(p))
    .filter((p) => !isPlaceholder(p));

  return (
    <Section
      id="letter"
      eyebrow="✦ Friendship chapters"
      title="A Letter In Small Chapters"
      lede="A proper friendship note from Mahi, split into small chapters."
      tone="night"
      className="overflow-hidden bg-[radial-gradient(70%_55%_at_50%_0%,rgba(139,92,246,0.25),transparent_60%),linear-gradient(180deg,#08040f,#12091f_55%,#08040f)]"
    >
      <Reveal className="mx-auto max-w-4xl">
        <article className={cn("relative overflow-hidden rounded-[34px] border border-violet-200/15 bg-black/55 px-5 py-8 shadow-[0_32px_100px_-48px_rgba(167,139,250,0.75)] backdrop-blur-xl sm:px-9 sm:py-10")}>
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_35%_at_18%_0%,rgba(216,180,254,0.18),transparent_70%),radial-gradient(50%_45%_at_100%_20%,rgba(244,114,182,0.13),transparent_65%)]" />

          <span className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-ember-300" />

          <header className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/15 bg-violet-200/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-100/75">
              <PenLine className="h-3.5 w-3.5" />
              {letter.title}
            </span>
            <p className="mt-5 font-script text-4xl leading-tight text-violet-100 sm:text-5xl">
              Hey Lily,
            </p>
            <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-cream-100/60">
              Read this like chapters from a friendship archive: funny first,
              sincere second, dramatic only for design purposes.
            </p>
          </header>

          <div className="relative mt-8 grid gap-4">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.07}
                  y={18}
                  className="rounded-3xl border border-violet-200/12 bg-cream-50/[0.055] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6"
                >
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-fuchsia-200/55">
                    Chapter {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-xl text-cream-50">
                    {CHAPTER_TITLES[i] ?? "Friendship note"}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-[1.85] text-cream-100/78 sm:text-[16px]">
                    {p}
                  </p>
                </Reveal>
              ))
            ) : (
              <p className="rounded-3xl border border-violet-200/12 bg-cream-50/[0.055] p-6 text-center text-[14px] text-cream-100/60">
                A friendship chapter is still being written.
              </p>
            )}
          </div>

          {letter.signOff ? (
            <p className="relative mt-8 rounded-3xl border border-fuchsia-200/12 bg-fuchsia-300/10 p-5 text-[15.5px] font-semibold leading-relaxed text-cream-50">
              {sanitizeText(letter.signOff)}
            </p>
          ) : (
            null
          )}

          <footer className="relative mt-8 flex items-end justify-between gap-4 border-t border-violet-200/10 pt-6">
            <span className="font-script text-4xl text-violet-100">
              {letter.signature || "Mahi"}
            </span>
            <span className="text-right text-[12.5px] leading-relaxed text-cream-200/45">
              Friendship only.
              <br />
              Obviously. 😂🎂
            </span>
          </footer>
        </article>
      </Reveal>
    </Section>
  );
}
