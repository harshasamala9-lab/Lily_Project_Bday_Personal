"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[lily-universe]", error);
  }, [error]);

  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
      <span className="text-4xl">🎈💥</span>
      <h1 className="mt-6 text-[clamp(1.8rem,5vw,3rem)]">
        Something went spectacularly wrong
      </h1>
      <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-cream-200/65">
        A candle probably tipped over. Try again, or walk back to the beginning
        and pretend this never happened.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className="btn-ghost">
          Back home
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-6 font-mono text-[11px] text-cream-200/40">
          ref: {error.digest}
        </p>
      ) : null}
    </div>
  );
}
