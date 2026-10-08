import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLetters, getLetterBySlug } from "@/lib/content/repository";
import {
  DetailShell,
  MissingContent,
  RelatedLinks,
  safeTitle,
} from "@/components/views/DetailShell";
import { isPlaceholder, sanitizeText } from "@/lib/utils";

export const revalidate = 60;

/**
 * Only published slugs are served. Unknown slugs resolve to the 404 page with
 * a real 404 status instead of a soft 200.
 */
export const dynamicParams = false;


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getLetters();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const letter = await getLetterBySlug(slug);
  if (!letter) return { title: "Not found" };
  const title = safeTitle(letter.title, "A letter");
  return {
    title,
    description: "A proper birthday letter, written properly.",
    openGraph: { title, description: "A proper birthday letter, written properly." },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const letter = await getLetterBySlug(slug);
  if (!letter) notFound();

  const paragraphs = letter.body
    .map((p) => sanitizeText(p))
    .filter((p) => !isPlaceholder(p));

  return (
    <DetailShell
      eyebrow="💌 Correspondence"
      title={safeTitle(letter.title, "A letter")}
      href={`/letter/${slug}`}
    >
      <article className="paper-surface relative overflow-hidden px-6 py-10 sm:px-12 sm:py-14">
        <span aria-hidden className="paper-grain pointer-events-none absolute inset-0 opacity-[0.32] mix-blend-multiply" />
        <span className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-ember-400 via-berry-400 to-grape-500" />

        <div className="relative">
          <p className="font-script text-3xl text-violet-100">Hey Lily,</p>

          <div className="mt-7 space-y-5">
            {paragraphs.length ? (
              paragraphs.map((p, i) => (
                <p key={i} className="text-[16px] leading-[1.85] text-cream-100/80">
                  {p}
                </p>
              ))
            ) : (
              <MissingContent what="This letter" />
            )}
          </div>

          {letter.signOff && !isPlaceholder(letter.signOff) ? (
            <p className="mt-8 text-[16px] font-semibold text-cream-50">
              {sanitizeText(letter.signOff)}
            </p>
          ) : null}

          <footer className="mt-8 border-t border-grape-400/16 pt-6">
            <span className="font-script text-4xl text-violet-100">
              {letter.signature || "Mahi"}
            </span>
          </footer>
        </div>
      </article>

      <RelatedLinks
        links={[
          { href: "/#envelope", label: "Open the envelope" },
          { href: "/universe", label: "All links" },
          { href: "/", label: "Back home" },
        ]}
      />
    </DetailShell>
  );
}
