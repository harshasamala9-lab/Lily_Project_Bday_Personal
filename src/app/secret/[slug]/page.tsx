import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSecretBySlug, getSecrets } from "@/lib/content/repository";
import { DetailShell, RelatedLinks, safeTitle } from "@/components/views/DetailShell";
import { SecretReveal } from "@/components/views/SecretReveal";

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
  const secrets = await getSecrets();
  return secrets.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const secret = await getSecretBySlug(slug);
  if (!secret) return { title: "Not found" };
  const title = safeTitle(secret.title, "A secret");
  return {
    title,
    description: "A locked message. Mostly because it looked better locked.",
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const secret = await getSecretBySlug(slug);
  if (!secret) notFound();

  const others = (await getSecrets())
    .filter((s) => s.slug !== secret.slug)
    .slice(0, 3)
    .map((s) => ({ href: `/secret/${s.slug}`, label: s.title }));

  return (
    <DetailShell
      eyebrow="🔐 There's a secret here…"
      title={safeTitle(secret.title, "A secret")}
      href={`/secret/${slug}`}
      tone="night"
    >
      <SecretReveal secret={secret} />

      {others.length ? <RelatedLinks links={others} tone="night" /> : null}

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
