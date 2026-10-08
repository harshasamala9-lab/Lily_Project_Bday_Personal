import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLinks, getSettings } from "@/lib/content/repository";
import { LinkUniverseCard } from "@/components/links/LinkUniverseCard";
import { SparkleField } from "@/components/fx/SparkleField";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Lily Put's Little Internet Universe",
    description: settings.universe_description ?? "Apparently one birthday website wasn't enough.",
  };
}

/**
 * 🔗 Lily Put's Little Internet Universe
 * Every card opens one part of the birthday website.
 */
export default async function UniversePage() {
  const [links, settings] = await Promise.all([getLinks(), getSettings()]);

  return (
    <div className="relative overflow-hidden pb-24 pt-[calc(var(--nav-h)+3rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(139,92,246,0.24),transparent_62%),radial-gradient(55%_45%_at_10%_20%,rgba(244,82,122,0.14),transparent_65%),radial-gradient(60%_50%_at_90%_10%,rgba(167,139,250,0.18),transparent_65%)]"
      />
      <SparkleField seed="universe" count={26} />

      <div className="shell">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[13px] font-semibold text-cream-200/60 transition-colors hover:text-cream-50"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to the main experience
        </Link>

        <header className="mt-8 max-w-3xl">
          <span className="eyebrow">🔗 Personal mini portal</span>
          <h1 className="mt-5 text-[clamp(2.1rem,6vw,4rem)] leading-[1.02]">
            {settings.universe_title ?? "🔗 Lily Put's Little Internet Universe"}
          </h1>
          <p className="mt-5 text-[16.5px] leading-relaxed text-cream-200/72">
            {settings.universe_description ??
              "Apparently one birthday website wasn't enough."}
          </p>
          <p className="mt-4 text-[13.5px] text-cream-200/50">
            {links.length} tiny doors into memories, jokes, messages, lore,
            secrets and birthday chaos.
          </p>
        </header>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.06}>
          {links.map((link, i) => (
            <StaggerItem key={link.id}>
              <LinkUniverseCard link={link} index={i} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-14 rounded-[28px] border border-dashed border-grape-400/20 bg-night-800/55 p-7 text-center">
          <p className="text-[15px] font-semibold text-cream-100/75">
            Want to see everything at once?
          </p>
          <p className="mx-auto mt-2 max-w-lg text-[13.5px] leading-relaxed text-cream-200/55">
            The main experience walks through every section in order — lore,
            jokes, moments, memories, the quiz, the letter, the envelope and the
            secrets.
          </p>
          <Link href="/" className="btn-primary mt-6">
            Walk through it all →
          </Link>
        </div>
      </div>
    </div>
  );
}
