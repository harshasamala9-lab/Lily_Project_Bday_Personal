import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, getMessageBySlug } from "@/lib/content/repository";
import {
  ContentMedia,
  DetailShell,
  MissingContent,
  RelatedLinks,
  safeTitle,
} from "@/components/views/DetailShell";
import { isPlaceholder } from "@/lib/utils";

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
  const items = await getMessages();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMessageBySlug(slug);
  if (!item) return { title: "Not found" };
  const title = safeTitle(item.title, "A message");
  const description =
    item.message && !isPlaceholder(item.message)
      ? item.message
      : "A birthday message from Mahi.";
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const item = await getMessageBySlug(slug);
  if (!item) notFound();

  return (
    <DetailShell
      eyebrow="💌 A message"
      title={safeTitle(item.title, "A message")}
      href={`/message/${slug}`}
    >
      {isPlaceholder(item.message) ? (
        <MissingContent what="This message" />
      ) : (
        <blockquote className="rounded-[28px] border border-grape-400/18 bg-night-800/70 p-8 shadow-paper sm:p-12">
          <p className="font-display text-[clamp(1.5rem,4vw,2.4rem)] font-medium leading-[1.25] text-cream-50">
            {item.message}
          </p>
          {item.signature ? (
            <p className="mt-7 font-script text-3xl text-violet-100">
              {item.signature}
            </p>
          ) : null}
        </blockquote>
      )}

      <ContentMedia imageUrl={item.imageUrl} videoUrl={item.videoUrl} title={item.title} />

      <RelatedLinks
        links={[
          { href: "/letter/a-proper-birthday-letter", label: "Read the letter" },
          { href: "/secret/001", label: "Unlock a secret" },
          { href: "/universe", label: "All links" },
        ]}
      />
    </DetailShell>
  );
}
