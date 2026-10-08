import { ArrowUpRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Memory } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SparkleField } from "@/components/fx/SparkleField";
import { displayText, formatDate, isPlaceholder } from "@/lib/utils";

/**
 * 🔗 Memory Link System
 * Every memory card links to its own generated page at /memory/[slug].
 */
export function MemoriesSection({ memories }: { memories: Memory[] }) {
  return (
    <Section
      id="memories"
      eyebrow="📸 Memory universe"
      title="Every Memory Has Its Own Page"
      lede="Tap any card to open it full screen — story, quote, media and a link you can actually send to someone."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {memories.map((memory, i) => (
          <Reveal key={memory.slug} delay={i * 0.07}>
            <Link
              href={`/memory/${memory.slug}`}
              className="group relative block h-full overflow-hidden rounded-[28px] border border-grape-400/16 bg-night-800/75 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-grape-400/35 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-night-900/4">
                {memory.imageUrl ? (
                  <Image
                    src={memory.imageUrl}
                    alt={displayText(memory.title, "Memory")}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-cream-100/18">
                    <ImageIcon className="h-10 w-10" />
                  </span>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-night-900/55 via-transparent to-transparent opacity-80" />
                <SparkleField seed={memory.slug} count={10} bounds="panel" />

                {memory.occurredOn && (
                  <span className="absolute left-4 top-4 rounded-full bg-cream-50/90 px-3 py-1 text-[11px] font-semibold text-night-900 backdrop-blur">
                    {formatDate(memory.occurredOn)}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl leading-snug transition-colors group-hover:text-ember-600">
                  {displayText(memory.title, "A memory")}
                </h3>

                <p className="mt-2.5 line-clamp-2 text-[14.5px] leading-relaxed text-cream-200/64">
                  {isPlaceholder(memory.description)
                    ? "A small friendship memory with suspicious replay value."
                    : memory.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ember-600">
                  Open memory
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
