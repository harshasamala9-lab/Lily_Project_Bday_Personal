import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PLACEHOLDER = /\[(?:ADD|FEEDBACK)[^\]]*\]/i;

/** True when a string is still an unfilled placeholder from the seed. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || PLACEHOLDER.test(value);
}

/** Keeps obvious seed placeholders out of the rendered experience. */
export function displayText(
  value: string | null | undefined,
  fallback = "",
): string {
  if (isPlaceholder(value)) return fallback;
  return (value ?? "").trim();
}

export function formatDate(value: string | null | undefined): string | null {
  if (!value || isPlaceholder(value)) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Deterministic pseudo-random in [0,1) from a string — keeps SSR stable. */
export function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://birthday-lily-put.vercel.app";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isExternalUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
}

/** Sanitises authored text before it reaches the DOM. */
export function sanitizeText(input: string | null | undefined, maxLength = 8000): string {
  if (!input) return "";
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .trim()
    .slice(0, maxLength);
}

export function splitParagraphs(body: string | string[] | null | undefined): string[] {
  if (!body) return [];
  const parts = Array.isArray(body) ? body : body.split(/\n{2,}/);
  return parts.map((p) => p.trim()).filter(Boolean);
}
