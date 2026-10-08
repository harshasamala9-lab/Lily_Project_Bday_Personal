import type { Metadata } from "next";
import { getQuiz } from "@/lib/content/repository";
import { QuizSection } from "@/components/sections/QuizSection";
import { RelatedLinks } from "@/components/views/DetailShell";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "How Well Do You Know Us?",
  description:
    "Five questions about the two of you. No notes. Very much no peeking.",
};

export default async function QuizPage() {
  const questions = await getQuiz();

  return (
    <>
      <div className="pt-[calc(var(--nav-h)+4rem)]">
        <QuizSection questions={questions} />
      </div>

      <div className="shell pb-24">
        <div className="mx-auto max-w-3xl">
          <RelatedLinks
            links={[
              { href: "/universe", label: "All links" },
              { href: "/#lore", label: "Lily Put Lore" },
              { href: "/#jokes", label: "Inside jokes" },
              { href: "/", label: "Back home" },
            ]}
          />
        </div>
      </div>
    </>
  );
}
