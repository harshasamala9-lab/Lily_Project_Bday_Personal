import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMemories, getMemoryBySlug } from "@/lib/content/repository";
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
  const items = await getMemories();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMemoryBySlug(slug);
  if (!item) return { title: "Not found" };

  const title = safeTitle(item.title, "A memory");
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
  const item = await getMemoryBySlug(slug);
  if (!item) notFound();

  const href = `/memory/${slug}`;
  const title = safeTitle(item.title, "A memory");
  const related = item.relatedSlugs?.length
    ? item.relatedSlugs.map((s: string) => ({
        href: `/memory/${s}`,
        label: s.replace(/-/g, " "),
      }))
    : [];

  return (
    <DetailShell
      eyebrow="📸 Memory"
      title={title}
      lede={item.description}
      href={href}
      tone="cream"
      meta={[
        ...(item.occurredOn ? [{ label: "When", value: formatMetaDate(item.occurredOn) ?? "" }] : []),
        ...(item.location ? [{ label: "Where", value: item.location }] : []),
      ]}
    >
      {isPlaceholder(item.content) ? (
        <MissingContent what="This memory" />
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
