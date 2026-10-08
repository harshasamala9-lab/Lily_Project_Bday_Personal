# The Lily Put Birthday Experience

A cinematic birthday website built for Lily Put. It is a friendship gift: warm,
funny, chaotic, and never romantic.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Lucide React

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run dev         # development server
npm run build       # production build
npm run start       # serve the production build
npm run lint        # ESLint
npm run typecheck   # TypeScript check
```

## Editing Content

All website content is local in `src/lib/content/local-seed.ts`.

Edit that file to change:

- Hero name, tagline, and bio
- Memories
- Inside jokes
- Lore and personality stats
- Quiz questions and answers
- Timeline moments
- Appreciation cards
- Letters and envelope reveal
- Secret messages
- Link Universe cards
- Opening and finale copy

No external setup is required.

## Developer Shortcut

Create `.env.local` if you want to skip the opening while editing:

```env
NEXT_PUBLIC_SKIP_OPENING="1"
```

Leave it unset for the version Lily sees.

## Routes

```text
/                                   full walk-through
/universe                           Link Universe
/quiz                               quiz page
/memory/[slug]                      memory detail
/inside-joke/[slug]                 inside joke detail
/moment/[slug]                      chaotic moment detail
/message/[slug]                     birthday message detail
/letter/[slug]                      letter detail
/lore/[slug]                        lore detail
/secret/[slug]                      secret message detail
/surprise/[slug]                    surprise detail
```

## Project Layout

```text
src/
  app/                    routes
  components/
    opening/              intro, candle, gift box, reveal
    sections/             home page sections
    fx/                   confetti, sparkles, balloons
    links/                Link Universe cards and strip
    views/                shared detail-page UI
    nav/ music/ ui/ motion/ experience/
  lib/
    content/              local content repository and seed data
    types.ts              domain types
    use-sound.ts          WebAudio cue kit
    utils.ts              helpers
public/
  placeholders/           fallback media
```

## Production Check

Before hosting:

```bash
npm run lint
npm run typecheck
npm run build
```

Designed by TEAM ALVANTIX · alvantix.in · contact.alvantix@gmail.com
