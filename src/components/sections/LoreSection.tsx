import { BookOpen, Ghost, Zap } from "lucide-react";
import type { LoreEntry } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/ui/Section";
import { StatBar } from "./StatBar";
import { cn, displayText, isPlaceholder } from "@/lib/utils";

const TYPE_META = {
  lore: { icon: BookOpen, label: "Entry", tone: "text-grape-600" },
  behavior: { icon: Ghost, label: "Behaviour", tone: "text-berry-600" },
  ability: { icon: Zap, label: "Ability", tone: "text-ember-600" },
  fact: { icon: Zap, label: "Fact", tone: "text-cream-200/60" },
} as const;

const TONES = ["ember", "berry", "grape", "mint"] as const;

interface LoreProps {
  lore: LoreEntry[];
  stats: Array<{ title: string; value: number; note: string | null; statKey: string }>;
}

/**
 * 📖 Lily Put Lore — an "encyclopedia" of her, with animated stat bars.
 * All copy comes from lily_put_lore + personality_stats.
 */
export function LoreSection({ lore, stats }: LoreProps) {
  const entries = lore.filter((l) => isPlaceholder(l.description) === false || l.entryType !== "fact");
  const facts = lore.filter((l) => l.entryType === "fact");

  return (
    <Section
      id="lore"
      eyebrow="📖 Field guide"
      title={<>Lily Put Lore</>}
      lede="A completely unnecessary but highly accurate documentation of Lily Put."
      className="overflow-hidden"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Stagger className="grid gap-5 sm:grid-cols-2">
          {entries.map((entry, i) => {
            const meta = TYPE_META[entry.entryType];
            const Icon = meta.icon;
            const ability = entry.meta?.ability as string | undefined;

            return (
              <StaggerItem key={entry.slug}>
                <article
                  className="card-surface h-full p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
                  style={{ transitionProperty: "transform, box-shadow" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream-100/8">
                      <Icon className={cn(meta.tone, "h-4 w-4")} />
                    </span>
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-cream-200/45">
                      {meta.label}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl leading-snug">
                    {displayText(
                      isPlaceholder(entry.title) ? meta.label : entry.title,
                      entry.entryType === "behavior"
                        ? "Classic Lily Put Behavior"
                        : "Lily Put",
                    )}
                  </h3>

                  {isPlaceholder(entry.description) ? (
                    <p className="mt-2.5 text-[14.5px] italic leading-relaxed text-cream-200/45">
                      Lily Put lore classified. More evidence will appear with time.
                    </p>
                  ) : (
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-cream-200/72">
                      {entry.description}
                    </p>
                  )}

                  {entry.entryType === "ability" && (
                    <p className="mt-4 rounded-2xl bg-cream-100/7 px-4 py-3 text-[13.5px] font-semibold text-cream-100">
                      Ability: {displayText(ability, "Turns normal into chaos")}
                    </p>
                  )}

                  <span className="sr-only">Entry {i + 1}</span>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="h-full" delay={0.1}>
          <div className="card-surface h-full p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl">🎭 Personality Stats</h3>
              <span className="rounded-full border border-grape-400/12 bg-cream-100/7 px-3 py-1 text-[11px] font-semibold text-cream-200/60">
                live
              </span>
            </div>

            <div className="mt-7 space-y-6">
              {stats.map((stat, i) => (
                <StatBar
                  key={stat.statKey}
                  label={stat.title}
                  value={stat.value}
                  note={isPlaceholder(stat.note) ? null : stat.note}
                  delay={i * 0.09}
                  tone={TONES[i % TONES.length]}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {facts.length > 0 && (
        <Reveal className="mt-6" delay={0.15}>
          <div className="grid gap-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <div
                key={fact.slug}
                className="rounded-3xl border border-dashed border-grape-400/20 bg-night-800/55 p-5"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ember-600">
                  Fact #{fact.order}
                </p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-cream-200/70">
                  {isPlaceholder(fact.description)
                    ? "[ ADD FACT HERE ]"
                    : fact.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </Section>
  );
}
