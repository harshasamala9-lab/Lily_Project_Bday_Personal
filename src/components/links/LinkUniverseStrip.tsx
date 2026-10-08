import { cn } from "@/lib/utils";
import type { ExperienceLink } from "@/lib/types";
import { LinkIcon, LinkUniverseCard } from "./LinkUniverseCard";

/**
 * Compact marquee of Link Universe items, shown under the hero.
 */
export function LinkUniverseStrip({ links }: { links: ExperienceLink[] }) {
  if (!links.length) return null;

  const row = [...links, ...links];

  return (
    <div className="relative mt-4 border-y border-grape-400/14 bg-night-800/40 py-4 backdrop-blur-sm">
      <p className="mb-3 text-center text-[10.5px] font-bold uppercase tracking-[0.22em] text-cream-200/42">
        🔗 her little internet universe
      </p>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className={cn(
            "flex w-max items-center gap-3 animate-marquee hover:[animation-play-state:paused]",
          )}
        >
          {row.map((link, i) => (
            <a
              key={`${link.slug}-${i}`}
              href={link.destination}
              className="flex shrink-0 items-center gap-2 rounded-full border border-grape-400/16 bg-cream-100/8 px-4 py-2 text-[12.5px] font-medium text-cream-100 shadow-soft transition-transform hover:-translate-y-0.5 hover:border-grape-400/35"
            >
              <LinkIcon name={link.icon} className="h-3.5 w-3.5 text-ember-600" />
              {link.title.replace(/^[^\p{L}\p{N}]+/u, "") || link.slug}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export { LinkUniverseCard };
