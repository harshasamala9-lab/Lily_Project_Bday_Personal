import "server-only";

import { localSeed } from "./local-seed";
import type {
  AppreciationCard,
  BirthdayMessage,
  ChaoticMoment,
  EasterEgg,
  ExperienceLink,
  InsideJoke,
  Letter,
  LoreEntry,
  Memory,
  PersonalityStat,
  Profile,
  QuizQuestion,
  SecretMessage,
  SiteSettings,
} from "@/lib/types";

/**
 * Local content repository.
 *
 * The website is intentionally self-contained: every section reads typed content
 * from `local-seed.ts`, and components never need to know where that content is
 * stored.
 */

export const contentSource = "local";

function orderRows<T extends { order: number; title?: string }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) => a.order - b.order || (a.title ?? "").localeCompare(b.title ?? ""),
  );
}

const bySlug =
  <T extends { slug: string }>(list: T[]) =>
  (slug: string): T | null =>
    list.find((item) => item.slug === slug) ?? null;

export async function getProfile(): Promise<Profile> {
  return localSeed.profile;
}

export async function getSettings(): Promise<Record<string, string>> {
  return Object.fromEntries(localSeed.settings.map((s) => [s.key, s.value]));
}

export async function getSettingList(): Promise<SiteSettings[]> {
  return localSeed.settings;
}

export async function getMemories(): Promise<Memory[]> {
  return orderRows(localSeed.memories);
}

export async function getJokes(): Promise<InsideJoke[]> {
  return orderRows(localSeed.jokes);
}

export async function getLore(): Promise<LoreEntry[]> {
  return orderRows(localSeed.lore);
}

export async function getStats(): Promise<PersonalityStat[]> {
  return orderRows(localSeed.stats);
}

export async function getMoments(): Promise<ChaoticMoment[]> {
  return orderRows(localSeed.moments);
}

export async function getAppreciation(): Promise<AppreciationCard[]> {
  return orderRows(localSeed.appreciation);
}

export async function getMessages(): Promise<BirthdayMessage[]> {
  return orderRows(localSeed.messages);
}

export async function getLetters(): Promise<Letter[]> {
  return orderRows(localSeed.letters);
}

export async function getSecrets(): Promise<SecretMessage[]> {
  return orderRows(localSeed.secrets);
}

export async function getLinks(): Promise<ExperienceLink[]> {
  return orderRows(localSeed.links);
}

export async function getEggs(): Promise<EasterEgg[]> {
  return orderRows(localSeed.eggs);
}

export async function getQuiz(): Promise<QuizQuestion[]> {
  return orderRows(localSeed.quiz);
}

export const getMemoryBySlug = async (slug: string) =>
  bySlug(localSeed.memories)(slug);
export const getJokeBySlug = async (slug: string) => bySlug(localSeed.jokes)(slug);
export const getLoreBySlug = async (slug: string) => bySlug(localSeed.lore)(slug);
export const getMomentBySlug = async (slug: string) =>
  bySlug(localSeed.moments)(slug);
export const getMessageBySlug = async (slug: string) =>
  bySlug(localSeed.messages)(slug);
export const getLetterBySlug = async (slug: string) =>
  bySlug(localSeed.letters)(slug);
export const getSecretBySlug = async (slug: string) =>
  bySlug(localSeed.secrets)(slug);

export async function getSurpriseBySlug(
  slug: string,
): Promise<ExperienceLink | null> {
  const links = await getLinks();
  return (
    links.find(
      (link) => link.slug === slug || link.destination === `/surprise/${slug}`,
    ) ?? null
  );
}
