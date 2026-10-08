import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLinks, getSurpriseBySlug } from "@/lib/content/repository";
import { SurpriseBody } from "@/components/views/SurpriseBody";
import { DetailShell, RelatedLinks, safeTitle } from "@/components/views/DetailShell";

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
  const links = await getLinks();
  return links
    .filter((link) => link.destination.startsWith("/surprise/"))
    .map((link) => ({ slug: link.destination.replace("/surprise/", "") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getSurpriseBySlug(slug);
  if (!item) return { title: "Not found" };
  const title = safeTitle(item.title, "A surprise");
  return {
    title,
    description: item.description ?? "A surprise, because apparently one was enough.",
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const item = await getSurpriseBySlug(slug);
  if (!item) notFound();

  return (
    <DetailShell
      eyebrow={item.eyebrow ?? "✨ A surprise"}
      title={safeTitle(item.title, "A surprise")}
      lede={item.description}
      href={`/surprise/${slug}`}
      tone="night"
    >
      <SurpriseBody slug={slug} title={item.title} content={item.content} />

      <RelatedLinks
        tone="night"
        links={[
          { href: "/universe", label: "Back to the universe" },
          { href: "/", label: "Home" },
        ]}
      />
    </DetailShell>
  );
}
