import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { absoluteUrl } from "@/lib/utils";
import { getEggs, getProfile, getSettings } from "@/lib/content/repository";
import { SiteNav } from "@/components/nav/SiteNav";
import { Footer } from "@/components/Footer";
import { ExperienceProvider } from "@/components/experience/ExperienceProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { EasterEggWatcher } from "@/components/easter-eggs/EasterEggWatcher";
import { EggToast } from "@/components/easter-eggs/EggToast";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const script = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-script",
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [profile, settings] = await Promise.all([getProfile(), getSettings()]);
  const name = profile?.displayName ?? "Lily Put";
  const title = `Happy Birthday, ${name} · A Little Universe`;
  const description =
    settings?.reveal_sub_3 ??
    "A small, extremely unnecessary interactive birthday universe, built by a friend.";

  return {
    metadataBase: new URL(absoluteUrl("/")),
    title: {
      default: title,
      template: `%s · ${name}'s Birthday Universe`,
    },
    description,
    applicationName: `${name} Birthday Universe`,
    authors: [{ name: "Mahi" }],
    creator: "TEAM ALVANTIX",
    keywords: [
      "birthday",
      "Lily Put",
      "interactive birthday",
      "digital scrapbook",
      "friendship",
    ],
    openGraph: {
      type: "website",
      siteName: `${name} Birthday Universe`,
      title,
      description,
      url: absoluteUrl("/"),
    },
    icons: {
      icon: [{ url: "/favicon.ico", type: "image/svg+xml" }],
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#08040f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Chrome that depends on content (easter eggs) and so must be resolved on the
 * server before it can reach the client components.
 */
async function ExperienceChrome() {
  const eggs = await getEggs();
  return (
    <>
      <EasterEggWatcher eggs={eggs} />
      <EggToast />
    </>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${script.variable}`}
      suppressHydrationWarning
    >
      <body className="theme-violet min-h-dvh bg-night-900 text-cream-100">
        <ExperienceProvider>
          <PageTransition>
            <SiteNav />
            <main id="main" className="pb-24 sm:pb-0">
              {children}
            </main>
            <Footer />
          </PageTransition>
          <ExperienceChrome />
        </ExperienceProvider>
      </body>
    </html>
  );
}
