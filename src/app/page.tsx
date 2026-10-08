import type { Metadata } from "next";
import { OpeningSequence } from "@/components/opening/OpeningSequence";
import { HeroStage } from "@/components/sections/HeroStage";
import { LoreSection } from "@/components/sections/LoreSection";
import { JokesSection } from "@/components/sections/JokesSection";
import { MomentsTimeline } from "@/components/sections/MomentsTimeline";
import { MemoriesSection } from "@/components/sections/MemoriesSection";
import { QuizSection } from "@/components/sections/QuizSection";
import { AppreciationSection } from "@/components/sections/AppreciationSection";
import { LetterSection } from "@/components/sections/LetterSection";
import { EnvelopeSection } from "@/components/sections/EnvelopeSection";
import { SecretSection } from "@/components/sections/SecretSection";
import { FinaleSection } from "@/components/sections/FinaleSection";
import {
  getAppreciation,
  getSettings,
  getJokes,
  getLetters,
  getLinks,
  getLore,
  getMemories,
  getMoments,
  getProfile,
  getQuiz,
  getSecrets,
  getStats,
} from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Happy Birthday · A Little Universe",
  description:
    "An interactive birthday experience built by a friend: memories, inside jokes, a quiz, secrets and a lot of chaos.",
};

export const revalidate = 60;

export default async function HomePage() {
  const [
    profile,
    settings,
    lore,
    stats,
    jokes,
    moments,
    memories,
    quiz,
    appreciation,
    letters,
    secrets,
    links,
  ] = await Promise.all([
    getProfile(),
    getSettings(),
    getLore(),
    getStats(),
    getJokes(),
    getMoments(),
    getMemories(),
    getQuiz(),
    getAppreciation(),
    getLetters(),
    getSecrets(),
    getLinks(),
  ]);

  const mainLetter = letters.find((l) => !l.isEnvelopeReveal) ?? letters[0];
  const envelopeLetter =
    letters.find((l) => l.isEnvelopeReveal) ?? letters[letters.length - 1];

  return (
    <>
      <OpeningSequence
        settings={{
          intro: [
            settings.intro_line_1 || "For Lily Put.",
            settings.intro_line_2 || "Yeah… you.",
            settings.intro_line_3 || "I made something for your birthday.",
          ],
          giftCta: settings.gift_cta || "OPEN MY BIRTHDAY SURPRISE",
          revealKicker: settings.reveal_kicker || "HAPPY BIRTHDAY",
          revealName: settings.reveal_name || "Lily Put",
          revealSubs: [
            settings.reveal_sub_1 || "Today is officially Lily Put Day.",
            settings.reveal_sub_2 ||
              "No speeches. No emotional damage. Just birthday chaos. 😂",
            settings.reveal_sub_3 ||
              "Although… you are genuinely one of my favorite people to be ridiculous with.",
          ],
        }}
      />

      <HeroStage
        name={profile.displayName}
        tagline={profile.tagline}
        bio={profile.bio}
        links={links}
      />

      <LoreSection lore={lore} stats={stats} />

      <JokesSection jokes={jokes} />

      <MomentsTimeline
        moments={moments}
        id="best-moments"
        eyebrow="🏆 Hall of fame"
        heading="Best Lily Put Moments"
        lede="A cinematic timeline of the moments that made the whole group chat worth having."
      />

      <MemoriesSection memories={memories} />

      <QuizSection questions={quiz} />

      <AppreciationSection cards={appreciation} />

      <MomentsTimeline
        moments={moments}
        id="chaos"
        tone="night"
        eyebrow="💀 Incident report"
        heading="Our Most Chaotic Moments"
        lede="It started normally. It absolutely did not end normally."
      />

      {mainLetter ? <LetterSection letter={mainLetter} /> : null}

      {envelopeLetter ? <EnvelopeSection letter={envelopeLetter} /> : null}

      <SecretSection secrets={secrets} />

      <FinaleSection
        kicker={settings.finale_kicker || "HAPPY BIRTHDAY, Lily Put! 🎂🎈"}
        lines={[
          settings.finale_line_1 ||
            "Here's to another year of chaos, ridiculous conversations, unforgettable moments, and new memories.",
          settings.finale_line_2 || "Stay exactly as weird as you are. 😂",
          settings.finale_line_3 ||
            "And seriously, Lily Put — I'm really glad you're my friend.",
        ]}
        signature={settings.finale_signature || "— Mahi"}
      />

    </>
  );
}
