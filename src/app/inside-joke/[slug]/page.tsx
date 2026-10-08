import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJokes, getJokeBySlug } from "@/lib/content/repository";
import {
  ContentMedia,
  DetailShell,
  MissingContent,
  Prose,
  QuoteBlock,
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
  const items = await getJokes();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getJokeBySlug(slug);
  if (!item) return { title: "Not found" };

  const title = safeTitle(item.title, "An inside joke");
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
  const item = await getJokeBySlug(slug);
  if (!item) notFound();

  const href = `/inside-joke/${slug}`;
  const title = safeTitle(item.title, "An inside joke");
  const related: Array<{ href: string; label: string }> = [
    { href: "/#jokes", label: "All inside jokes" },
    { href: "/universe", label: "All links" },
    { href: "/", label: "Home" },
  ];

  return (
    <DetailShell
      eyebrow="😂 Inside joke"
      title={title}
      lede={item.description}
      href={href}
      tone="night"
    >
      {isPlaceholder(item.story) ? (
        <MissingContent what="This inside joke story" />
      ) : (
        <div className="space-y-8">
          {!isPlaceholder(item.preview) ? (
            <p className="text-[17px] font-medium leading-relaxed text-cream-100/80">
              {item.preview}
            </p>
          ) : null}
          <Prose text={item.story} />
          {item.reactions.length ? (
            <div className="flex flex-wrap gap-2">
              {item.reactions.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-grape-400/16 bg-cream-100/7 px-3 py-1.5 text-sm text-cream-100"
                >
                  {r}
                </span>
              ))}
            </div>
          ) : null}
        </div>
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
