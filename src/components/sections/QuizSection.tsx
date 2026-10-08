"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { isPlaceholder } from "@/lib/utils";

/**
 * 🧠 How well do you know us?
 *
 * Answer correctness is resolved against the answer set loaded on the server;
 * the score screen is derived from the number of correct picks. Fully replayable.
 */

interface AnswerRecord {
  questionSlug: string;
  answerId: string;
  correct: boolean;
}

const BANDS = [
  {
    max: 0.3,
    headline: "We need to have a meeting. 💀",
    body: "This is not a drill. Genuinely, we need to sit down and talk about what just happened here.",
  },
  {
    max: 0.7,
    headline: "Okay… you know us somewhat. 😂",
    body: "You passed the friend test. Barely. Do not let it go to your head.",
  },
  {
    max: 1.01,
    headline: "Certified friendship historian. 🏆",
    body: "You have the receipts, the citations and the emotional damage. Perfect score behaviour.",
  },
];

export function QuizSection({ questions }: { questions: QuizQuestion[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const current = questions[index];
  const progress = total ? ((records.length + (picked ? 1 : 0)) / total) * 100 : 0;

  const score = useMemo(
    () => records.filter((r) => r.correct).length,
    [records],
  );

  const band = useMemo(() => {
    const ratio = total ? score / total : 0;
    return BANDS.find((b) => ratio <= b.max) ?? BANDS[BANDS.length - 1];
  }, [score, total]);

  const choose = useCallback(
    (answerId: string, correct: boolean) => {
      if (picked) return;
      setPicked(answerId);
      setRecords((prev) => [
        ...prev,
        { questionSlug: current.slug, answerId, correct },
      ]);
    },
    [current.slug, picked],
  );

  const next = useCallback(() => {
    setPicked(null);
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }, [index, total]);

  const replay = useCallback(() => {
    setIndex(0);
    setRecords([]);
    setPicked(null);
    setDone(false);
  }, []);

  if (!total) return null;

  return (
    <Section
      id="quiz"
      eyebrow="🧠 Friendship exam"
      title="How Well Do You Know Us?"
      lede="Five questions. No notes. Very much no peeking at each other."
    >
      <div className="mx-auto max-w-3xl">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-4">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-100/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ember-400 via-berry-500 to-grape-500"
              animate={{ width: `${done ? 100 : progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="shrink-0 text-[13px] font-semibold tabular-nums text-cream-200/60">
            {done ? total : records.length + (picked ? 1 : 0)}/{total}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="score"
              className="card-surface overflow-hidden p-8 text-center sm:p-12"
              initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember-600">
                Final score
              </p>

              <p className="mt-4 font-display text-[clamp(3.5rem,14vw,7rem)] font-bold leading-none text-gradient">
                {Math.round((score / total) * 100)}%
              </p>

              <p className="mt-2 text-[13px] font-semibold text-cream-200/55">
                {score} of {total} correct
              </p>

              <h3 className="mt-6 text-[clamp(1.4rem,4vw,2rem)]">{band.headline}</h3>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-cream-200/70">
                {band.body}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={replay}
                  className="btn-primary"
                >
                  <RotateCcw className="h-4 w-4" /> Play again
                </button>
                <Link href="/universe" className="btn-ghost">
                  Back to the universe
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={current.slug}
              className="card-surface p-6 sm:p-9"
              initial={reduce ? undefined : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -28 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-grape-600">
                Question {index + 1}
              </p>

              <h3 className="mt-3 text-[clamp(1.35rem,3.6vw,2rem)] leading-snug">
                {current.question}
              </h3>

              <div className="mt-7 grid gap-3">
                {current.answers.map((answer, ai) => {
                  const chosen = picked === answer.id;
                  const revealed = picked !== null;
                  const state = !revealed
                    ? "idle"
                    : chosen
                      ? answer.isCorrect
                        ? "correct"
                        : "wrong"
                      : answer.isCorrect
                        ? "correct"
                        : "idle";

                  return (
                    <motion.button
                      key={answer.id}
                      type="button"
                      disabled={revealed}
                      onClick={() => choose(answer.id, answer.isCorrect)}
                      whileTap={revealed ? undefined : { scale: 0.985 }}
                      className={optionClass(state)}
                      initial={reduce ? undefined : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + ai * 0.07 }}
                    >
                      <span className="flex-1 text-left">
                        {isPlaceholder(answer.label)
                          ? "[ ADD ANSWER OPTION HERE ]"
                          : answer.label}
                      </span>

                      {state === "correct" && (
                        <Check className="h-5 w-5 shrink-0 text-mint-500" />
                      )}
                      {state === "wrong" && (
                        <X className="h-5 w-5 shrink-0 text-berry-600" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {picked && (
                  <motion.div
                    initial={reduce ? undefined : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Feedback picked={picked} question={current} />
                    <button
                      type="button"
                      onClick={next}
                      className="btn-primary mt-6 w-full sm:w-auto"
                      autoFocus
                    >
                      {index + 1 >= total ? "See my score" : "Next question →"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function Feedback({
  picked,
  question,
}: {
  picked: string;
  question: QuizQuestion;
}) {
  const answer = question.answers.find((a) => a.id === picked);
  const correct = answer?.isCorrect ?? false;
  const text = correct ? answer?.correctFeedback : answer?.wrongFeedback;

  return (
    <div
      className={`mt-6 rounded-2xl p-5 ${
        correct ? "bg-mint-500/12" : "bg-berry-500/10"
      }`}
      role="status"
      aria-live="polite"
    >
      <p
        className={`text-[13px] font-bold uppercase tracking-[0.14em] ${
          correct ? "text-mint-500" : "text-berry-600"
        }`}
      >
        {correct ? "Correct ✅" : "Incorrect ❌"}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-cream-100/80">
        {isPlaceholder(text)
          ? "The friendship court accepts this answer with mild suspicion."
          : text}
      </p>
      {!correct && !isPlaceholder(question.explanation) && (
        <p className="mt-3 text-[13.5px] text-cream-200/60">
          {question.explanation}
        </p>
      )}
    </div>
  );
}

function optionClass(state: "idle" | "correct" | "wrong") {
  switch (state) {
    case "correct":
      return "flex w-full items-center gap-4 rounded-2xl border border-mint-500/40 bg-mint-500/10 px-5 py-4 text-[15px] font-semibold text-cream-50";
    case "wrong":
      return "flex w-full items-center gap-4 rounded-2xl border border-berry-500/40 bg-berry-500/10 px-5 py-4 text-[15px] font-semibold text-cream-50";
    default:
      return "flex w-full items-center gap-4 rounded-2xl border border-grape-400/16 bg-cream-100/7 px-5 py-4 text-[15px] font-medium text-cream-50 transition-all hover:-translate-y-0.5 hover:border-grape-400/35 hover:shadow-soft focus-visible:border-grape-400/40 disabled:cursor-default disabled:opacity-70 disabled:hover:translate-y-0";
  }
}
