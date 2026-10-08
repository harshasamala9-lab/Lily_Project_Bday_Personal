import Link from "next/link";

export const metadata = {
  title: "404 — nothing here",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[86svh] flex-col items-center justify-center px-6 pt-[var(--nav-h)] text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ember-600">
        Error 404
      </p>
      <h1 className="mt-5 text-[clamp(2rem,6vw,3.6rem)] leading-tight">
        This page does not exist
      </h1>
      <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-cream-200/65">
        Which, honestly, is impressive. You found a URL that isn&apos;t even in
        the universe.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to the birthday experience
        </Link>
        <Link href="/universe" className="btn-ghost">
          🔗 Little Internet Universe
        </Link>
      </div>
    </div>
  );
}
