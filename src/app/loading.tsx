import { SparkleField } from "@/components/fx/SparkleField";

/** Route-level loading state for generated pages. */
export default function Loading() {
  return (
    <div
      className="relative flex min-h-[80svh] flex-col items-center justify-center gap-6 overflow-hidden px-6 pt-[var(--nav-h)]"
      role="status"
      aria-live="polite"
    >
      <SparkleField seed="loading" count={18} />

      <div className="relative grid h-20 w-20 place-items-center">
        <span className="absolute inset-0 rounded-full bg-ember-500/20 animate-pulseRing" />
        <span className="absolute inset-0 rounded-full bg-berry-500/20 animate-pulseRing [animation-delay:0.6s]" />
        <span className="relative text-3xl">🎂</span>
      </div>

      <div className="text-center">
        <p className="font-display text-xl text-cream-50">
          Wrapping something up…
        </p>
        <p className="mt-1.5 text-[13.5px] text-cream-200/55">
          Loading the Lily Put birthday universe.
        </p>
      </div>

      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-cream-100/10">
        <span className="block h-full w-1/3 animate-[shimmer_1.6s_linear_infinite] rounded-full bg-gradient-to-r from-ember-400 to-berry-500" />
      </div>
    </div>
  );
}
