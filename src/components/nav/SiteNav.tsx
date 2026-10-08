"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { useSound } from "@/lib/use-sound";
import { cn } from "@/lib/utils";

/** Pages whose surface is dark, so the nav has to invert with it. */
const NIGHT_ROUTES = /^\/(secret|surprise|moment)\//;

const LINKS = [
  { href: "/#lore", label: "Lore" },
  { href: "/#jokes", label: "Jokes" },
  { href: "/#memories", label: "Memories" },
  { href: "/quiz", label: "Quiz" },
  { href: "/#letter", label: "Letter" },
  { href: "/#secrets", label: "Secrets" },
  { href: "/#finale", label: "Finale" },
];

/**
 * Sticky navigation. Desktop pill bar; mobile uses a full-height animated
 * sheet. Both are hidden until the opening has been dismissed.
 */
export function SiteNav() {
  const { opened } = useExperience();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // On the home page the nav stays hidden until the gift is opened. Deep links
  // (/quiz, /universe, /memory/...) have no opening sequence, so the nav is
  // always available there.
  const isHome = pathname === "/";
  if (!opened && isHome) return null;

  const night = NIGHT_ROUTES.test(pathname);
  // Scrolling always produces the light bar, so only the pinned-overs-hero state
  // needs to know it is sitting on a dark surface.
  const inverted = night && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-all duration-500",
          scrolled
            ? "border-b border-grape-400/15 bg-night-900/85 shadow-[0_10px_40px_-28px_rgba(167,139,250,0.45)] backdrop-blur-xl"
            : "bg-transparent",
          inverted && "bg-night-900/35 backdrop-blur-md",
        )}
        style={{ height: "var(--nav-h)" }}
      >
        <nav
          aria-label="Primary"
          className="shell-wide flex h-full items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-full py-1.5 pr-2 transition-transform hover:-translate-y-0.5"
            aria-label="Lily Put — home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-ember-400 to-berry-500 text-base shadow-soft transition-transform duration-500 group-hover:rotate-[14deg]">
              🎂
            </span>
            <span
              className={cn(
                "font-display text-[17px] font-semibold tracking-tight",
                inverted || scrolled ? "text-cream-50" : "text-cream-50",
              )}
            >
              Lily Put <span className="text-ember-400">✨</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => play("page")}
                  className={cn(
                    "group relative block rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                    "text-cream-100/72 hover:text-cream-50",
                  )}
                >
                  {link.label}
                  <span className="absolute inset-x-3.5 bottom-1 h-px scale-x-0 bg-gradient-to-r from-ember-400 to-berry-400 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/universe"
                onClick={() => play("page")}
                className={cn(
                  "ml-2 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all hover:-translate-y-0.5",
                  "border-grape-400/20 bg-cream-100/8 text-cream-50 hover:border-grape-400/45 hover:bg-cream-100/14",
                )}
              >
                🔗 Universe
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                play("page");
              }}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full border transition-transform active:scale-95 lg:hidden",
                "border-grape-400/20 bg-cream-100/8 text-cream-50",
              )}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[79] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="absolute inset-0 bg-night-900/35 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="absolute inset-x-0 top-0 rounded-b-[32px] border-b border-grape-400/20 bg-night-900 px-6 pb-8 pt-[calc(var(--nav-h)+1rem)] shadow-lift"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="flex flex-col">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05 }}
                    className="border-b border-cream-100/10"
                  >
                    <Link
                      href={link.href}
                      onClick={() => {
                        setMenuOpen(false);
                        play("page");
                      }}
                      className="flex items-center justify-between py-4 font-display text-2xl font-medium text-cream-50"
                    >
                      {link.label}
                      <span className="text-cream-100/30">→</span>
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 }}
                >
                  <Link
                    href="/universe"
                    onClick={() => setMenuOpen(false)}
                    className="mt-5 flex items-center justify-center gap-2 rounded-full bg-night-900 px-5 py-3.5 text-sm font-semibold text-cream-50"
                  >
                    🔗 Lily Put's Little Internet Universe
                  </Link>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
