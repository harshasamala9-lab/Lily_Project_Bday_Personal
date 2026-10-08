import { cn } from "@/lib/utils";

/** Shared page-level gradient field. Sits behind content, never interactive. */
export function PageField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        "bg-[radial-gradient(70%_50%_at_20%_0%,rgba(255,164,87,0.20),transparent_60%),radial-gradient(60%_45%_at_85%_10%,rgba(255,122,156,0.16),transparent_62%),radial-gradient(75%_60%_at_50%_100%,rgba(167,139,250,0.16),transparent_65%)]",
        className,
      )}
    />
  );
}
