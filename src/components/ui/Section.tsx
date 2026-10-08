import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PageField } from "@/components/motion/PageField";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Night sections invert the surface for pacing. */
  tone?: "cream" | "night" | "none";
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  withField?: boolean;
}

/**
 * Standard section shell: rhythm, heading hierarchy, optional night tone.
 * Keeps vertical pacing consistent across every section of the site.
 */
export function Section({
  id,
  children,
  className,
  containerClassName,
  tone = "night",
  eyebrow,
  title,
  lede,
  align = "center",
  withField = true,
}: SectionProps) {
  const isNight = tone === "night";

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28",
        isNight && "bg-transparent text-cream-100",
        tone === "none" && "py-14 sm:py-16",
        className,
      )}
    >
      {withField && <PageField className={isNight ? "opacity-70" : ""} />}
      <div className={cn("shell", containerClassName)}>
        {(eyebrow || title || lede) && (
          <header
            className={cn(
              "mb-12 flex flex-col gap-5 sm:mb-16",
              align === "center" && "items-center text-center",
              align === "left" && "items-start text-left",
            )}
          >
            {eyebrow && (
              <span
                className={cn(
                  "eyebrow",
                  isNight && "border-cream-100/20 bg-cream-100/5 text-cream-200",
                )}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                className={cn(
                  "max-w-4xl text-[clamp(2rem,5.4vw,3.6rem)] leading-[1.05]",
                  align === "center" && "mx-auto",
                  isNight && "text-cream-50",
                )}
              >
                {title}
              </h2>
            )}
            {lede && (
              <p
                className={cn(
                  "max-w-2xl text-base leading-relaxed sm:text-lg",
                  isNight ? "text-cream-200/80" : "text-night-700/75",
                  align === "center" && "mx-auto",
                )}
              >
                {lede}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
