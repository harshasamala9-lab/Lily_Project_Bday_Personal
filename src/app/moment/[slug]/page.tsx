import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMoments, getMomentBySlug } from "@/lib/content/repository";
import {
  ContentMedia,
  DetailShell,
  MissingContent,
  Prose,
  QuoteBlock,
  RelatedLinks,
  formatMetaDate,
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
  const items = await getMoments();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMomentBySlug(slug);
  if (!item) return { title: "Not found" };

  const title = safeTitle(item.title, "A chaotic moment");
  const description =
    item.description && !isPlaceholder(item.description)
      ? item.description
      : "Part of Lily Put's little internet universe.";

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const item = await getMomentBySlug(slug);
  if (!item) notFound();

  const href = `/moment/${slug}`;
  const title = safeTitle(item.title, "A chaotic moment");
  const related: Array<{ href: string; label: string }> = [
    ...(item.relatedSlug
      ? [{ href: `/memory/${item.relatedSlug}`, label: "The matching memory" }]
      : []),
    { href: "/#chaos", label: "All chaotic moments" },
    { href: "/universe", label: "All links" },
  ];

  return (
    <DetailShell
      eyebrow="💀 Chaotic moment"
      title={title}
      lede={item.description}
      href={href}
      tone="night"
      meta={[
        ...(item.occurredOn ? [{ label: "When", value: formatMetaDate(item.occurredOn) ?? "" }] : []),
        ...(item.location ? [{ label: "Where", value: item.location }] : []),
      ]}
    >
      {isPlaceholder(item.content) ? (
        <MissingContent what="This moment" />
      ) : (
        <Prose text={item.content} />
      )}

      <ContentMedia
        imageUrl={item.imageUrl}
        videoUrl={item.videoUrl}
        title={title}
      />

      <QuoteBlock quote={item.quote ?? null} />

      <RelatedLinks links={related} />
    </DetailShell>
  );
}
