import { Globe, Heart, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { getSettings } from "@/lib/content/repository";

const COMPANY = {
  name: "Alvantix",
  tagline: "AI & Software Innovation",
  site: "https://alvantix.in/",
  email: "contact.alvantix@gmail.com",
  phone: "+91 7780239013",
  location: "Srikakulam, Andhra Pradesh, India",
  founded: "2025",
};

const NAV = [
  { href: "/#lore", label: "Lily Put Lore" },
  { href: "/#jokes", label: "Inside Jokes" },
  { href: "/#memories", label: "Memories" },
  { href: "/quiz", label: "The Quiz" },
  { href: "/#letter", label: "The Letter" },
  { href: "/universe", label: "Link Universe" },
];

/** Professional site footer with the TEAM ALVANTIX attribution. */
export async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="relative overflow-hidden border-t border-night-900/10 bg-night-900 text-cream-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_0%,rgba(255,138,61,0.18),transparent_60%),radial-gradient(50%_50%_at_85%_10%,rgba(167,139,250,0.16),transparent_60%)]"
      />

      <div className="shell relative py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl font-semibold text-cream-50">
              {settings.reveal_name ?? "Lily Put"} 🎂
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream-200/60">
              A small, extremely unnecessary interactive birthday universe, built
              by a friend who thinks you are genuinely great at being a person.
            </p>

            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-cream-100/12 bg-cream-100/5 px-4 py-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-ember-400 to-berry-500 text-[10px] font-black text-cream-50">
                A
              </span>
              <span className="text-[13px] text-cream-100/85">
                Designed by{" "}
                <span className="font-bold text-cream-50">TEAM ALVANTIX</span>
              </span>
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-cream-200/45">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-[13.5px] text-cream-200/65 transition-colors hover:text-cream-50"
                  >
                    {item.label}
                    <span className="translate-x-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-cream-200/45">
              Alvantix
            </h2>
            <ul className="mt-4 space-y-3 text-[13.5px] text-cream-200/65">
              <li>
                <a
                  href={COMPANY.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream-50"
                >
                  <Globe className="h-3.5 w-3.5" />
                  alvantix.in
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream-50"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream-50"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {COMPANY.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                {COMPANY.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream-100/10 pt-6 text-[12px] text-cream-200/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Alvantix · {COMPANY.tagline} · Est.{" "}
            {COMPANY.founded}
          </p>
          <p className="inline-flex items-center gap-1.5">
            Made with{" "}
            <Heart className="h-3.5 w-3.5 fill-berry-400 text-berry-400" />
            by Mahi, for Lily Put. Friendship only. Obviously. 😂
          </p>
        </div>
      </div>
    </footer>
  );
}
