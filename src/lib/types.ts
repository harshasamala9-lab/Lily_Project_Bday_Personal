/**
 * Content schema types.
 *
 * Every content shape here mirrors one editable content collection in
 * src/lib/content/local-seed.ts. Components consume these types via the local
 * repository instead of hardcoding section data.
 */

export type ContentStatus = "draft" | "published";

export type LinkType =
  | "memory"
  | "inside-joke"
  | "message"
  | "letter"
  | "secret"
  | "quiz"
  | "surprise"
  | "lore"
  | "moment"
  | "external";

export type MediaKind = "image" | "video" | "none";

/** Fields shared by nearly every content record. */
export interface BaseContent {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  externalUrl: string | null;
  category: string | null;
  /** Sort order within its section. Lower comes first. */
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile extends BaseContent {
  displayName: string;
  tagline: string;
  bio: string;
  birthdayDate: string | null;
  avatarUrl: string | null;
  signature: string;
}

export interface Memory extends BaseContent {
  occurredOn: string | null;
  location: string | null;
  quote: string | null;
  tags: string[];
  relatedSlugs: string[];
}

export interface InsideJoke extends BaseContent {
  preview: string;
  story: string;
  quote: string | null;
  /** Emoji reactions the reader can send, stored locally. */
  reactions: string[];
}

export interface LoreEntry extends BaseContent {
  entryType: "lore" | "behavior" | "ability" | "fact";
  meta: Record<string, string | number | boolean | null>;
}

export interface PersonalityStat extends BaseContent {
  statKey: string;
  value: number;
  note: string | null;
  icon: string | null;
}

export interface QuizAnswer {
  id: string;
  questionId: string;
  label: string;
  /** Response shown when this answer is correct. */
  correctFeedback: string;
  /** Response shown when this answer is wrong. */
  wrongFeedback: string;
  order: number;
  isCorrect: boolean;
}

export interface QuizQuestion extends BaseContent {
  question: string;
  explanation: string | null;
  answers: QuizAnswer[];
}

export interface ChaoticMoment extends BaseContent {
  sequence: number;
  label: string | null;
  quote: string | null;
  occurredOn: string | null;
  location: string | null;
  relatedSlug: string | null;
}

export interface AppreciationCard extends BaseContent {
  note: string | null;
  icon: string | null;
  accent: "berry" | "ember" | "grape" | "mint" | null;
}

export interface BirthdayMessage extends BaseContent {
  message: string;
  from: string | null;
  signature: string | null;
}

export interface Letter extends BaseContent {
  body: string[];
  signOff: string | null;
  signature: string;
  isEnvelopeReveal: boolean;
}

export interface SecretMessage extends BaseContent {
  message: string;
  unlockHint: string | null;
  code: string | null;
  rarity: "common" | "rare" | "legendary";
}

export interface ExperienceLink extends BaseContent {
  type: LinkType;
  icon: string;
  destination: string;
  animation: "float" | "tilt" | "glow" | "reveal" | "pop";
  cta: string | null;
  /** Short label shown in the Link Universe grid. */
  eyebrow: string | null;
}

export interface EasterEgg extends BaseContent {
  /** Which surface carries the egg. */
  trigger: "name-click" | "star" | "keyboard" | "hidden-button" | "konami";
  payload: string;
  /** keyboard trigger uses this combo, e.g. "l-i-l-y". */
  secretKey: string | null;
  hint: string | null;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  label: string | null;
  updatedAt: string;
}

/** A single universal shape for listing pages and dynamic routes. */
export interface ContentItem<T extends BaseContent = BaseContent> {
  data: T;
  type: LinkType;
}

export const CONTENT_ROUTE_PREFIX: Record<LinkType, string> = {
  memory: "memory",
  "inside-joke": "inside-joke",
  message: "message",
  letter: "letter",
  secret: "secret",
  quiz: "quiz",
  surprise: "surprise",
  lore: "lore",
  moment: "moment",
  external: "",
};

export function routeFor(type: LinkType, slug: string): string {
  if (type === "external") return "/";
  return `/${CONTENT_ROUTE_PREFIX[type]}/${slug}`;
}
