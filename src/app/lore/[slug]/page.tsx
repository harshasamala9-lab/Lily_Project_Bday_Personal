import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLore, getLoreBySlug } from "@/lib/content/repository";
import {
  ContentMedia,
  DetailShell,
  MissingContent,
  Prose,
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
  const lore = await getLore();
  return lore.map((entry) => ({ slug: entry.slug }));
}

const TYPE_LABEL = {
  lore: "🧠 The Lore",
  behavior: "😂 Classic Behavior",
  ability: "⚡ Special Ability",
  fact: "📌 Fact",
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getLoreBySlug(slug);
  if (!entry) return { title: "Not found" };
  const title = safeTitle(entry.title, "Lily Put Lore");
  const description =
    entry.description && !isPlaceholder(entry.description)
      ? entry.description
      : "A completely unnecessary but highly accurate documentation of Lily Put.";
  return { title, description, openGraph: { title, description } };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getLoreBySlug(slug);
  if (!entry) notFound();

  const ability = entry.meta?.ability as string | undefined;
  const others = (await getLore())
    .filter((l) => l.slug !== entry.slug)
    .map((l) => ({ href: `/lore/${l.slug}`, label: safeTitle(l.title, l.slug) }));

  return (
    <DetailShell
      eyebrow={TYPE_LABEL[entry.entryType]}
      title={safeTitle(entry.title, "Lily Put Lore")}
      lede={entry.description}
      href={`/lore/${slug}`}
    >
      {isPlaceholder(entry.content) ? (
        <MissingContent what="This lore entry" />
      ) : (
        <Prose text={entry.content} />
      )}

      {ability ? (
        <div className="mt-8 rounded-[24px] border border-grape-500/20 bg-grape-500/8 p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-grape-600">
            Special ability
          </p>
          <p className="mt-2 text-[17px] font-semibold text-night-900">
            {isPlaceholder(ability) ? "[ ADD ABILITY NAME HERE ]" : ability}
          </p>
        </div>
      ) : null}

      <ContentMedia
        imageUrl={entry.imageUrl}
        videoUrl={entry.videoUrl}
        title={entry.title}
      />

      <RelatedLinks links={others} />
    </DetailShell>
  );
}
