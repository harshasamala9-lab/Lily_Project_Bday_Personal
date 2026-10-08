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
 * Local content mode
 * ------------------
 * Local content for the static website. The copy is intentionally
 * friendship-safe and generic enough to ship, while still being easy to replace
 * with real memories later.
 */

const T0 = "2026-01-01T00:00:00.000Z";

const base = (slug: string, title: string, order: number) => ({
  id: `local-${slug}`,
  slug,
  title,
  description: null as string | null,
  content: null as string | null,
  imageUrl: null as string | null,
  videoUrl: null as string | null,
  externalUrl: null as string | null,
  category: null as string | null,
  order,
  isPublished: true,
  createdAt: T0,
  updatedAt: T0,
});

export const localProfile: Profile = {
  ...base("lily-put", "Lily Put", 1),
  displayName: "Lily Put",
  tagline: "Certified chaos partner, overthinker, and professional mood-lifter.",
  bio:
    "A small unofficial archive for Lily Put: the friend who can turn a normal conversation into a plot twist, a joke, and a memory in under five minutes.",
  birthdayDate: null,
  avatarUrl: null,
  signature: "Mahi",
};

export const localMemories: Memory[] = [
  {
    ...base("that-ridiculous-day", "The Day Normal Plans Lost", 1),
    description:
      "A normal day that somehow became one of those stories that keeps coming back.",
    content:
      "No dramatic setup required: it started like an ordinary conversation, then slowly turned into full comedy. The best part was not the plan; it was how quickly everything became a running joke.",
    quote: "We had one simple job. Somehow, no.",
    occurredOn: null,
    location: null,
    tags: ["chaos", "classic"],
    relatedSlugs: [],
  },
  {
    ...base("the-legendary-call", "The Call That Refused To End", 2),
    description:
      "One conversation, too many topic changes, and exactly zero regrets.",
    content:
      "This is for every call or chat that was supposed to be quick and then became a whole episode. Random updates, sudden jokes, serious thoughts, and then more nonsense, all in the same place.",
    quote: "Okay but one more thing.",
    occurredOn: null,
    location: null,
    tags: ["talks", "friendship"],
    relatedSlugs: ["that-ridiculous-day"],
  },
];

export const localJokes: InsideJoke[] = [
  {
    ...base("the-thing-we-cannot-explain", "The Thing We Cannot Explain", 1),
    preview: "No context survives this joke, and that is the whole point.",
    story:
      "Some jokes make sense only for five seconds when they are born. This one somehow survived anyway. If anyone else asks, the official answer is simple: you had to be there.",
    quote: "Do not ask. It is canon.",
    reactions: ["😂", "💀", "😭"],
  },
  {
    ...base("the-unexplainable-rule", "The Unexplainable Rule", 2),
    preview: "A rule nobody remembers creating, but everyone somehow obeys.",
    story:
      "Every friendship has tiny rules that would sound ridiculous out loud. This one belongs here because it proves the friendship has its own private operating system.",
    quote: "That is just how it works now.",
    reactions: ["😂", "💀", "😭"],
  },
];

export const localLore: LoreEntry[] = [
  {
    ...base("the-lore", "🧠 The Lore", 1),
    entryType: "lore",
    description:
      "Lily has the rare ability to make ordinary moments feel like side quests. Somehow there is always a reaction, a theory, or a joke ready to happen.",
    content:
      "Official lore states that Lily Put is best understood as a mix of chaos, kindness, random timing, and suspiciously good comedic instinct.",
    meta: {},
  },
  {
    ...base("classic-lily-put-behavior", "😂 Classic Lily Put Behavior", 2),
    entryType: "behavior",
    description:
      "Things she does reliably enough that they now count as documented behaviour.",
    content:
      "Turns one small detail into a full conversation, laughs at the worst possible moment, then somehow makes the entire situation better.",
    meta: {},
  },
  {
    ...base("special-ability", "⚡ Special Ability", 3),
    entryType: "ability",
    description:
      "Turning a completely normal situation into absolute chaos, but in the useful way.",
    content:
      "Can detect boring energy from a distance and immediately replace it with a joke, a question, or a completely unnecessary side mission.",
    meta: { ability: "Turns normal into legendary", icon: "Zap" },
  },
  {
    ...base("fact-01", "Small Detail Detector", 4),
    entryType: "fact",
    description: "Will notice one tiny thing and somehow turn it into a whole topic.",
    content: "Will notice one tiny thing and somehow turn it into a whole topic.",
    meta: {},
  },
  {
    ...base("fact-02", "Laugh Timing", 5),
    entryType: "fact",
    description: "Laughs at exactly the moment everyone else is trying to stay normal.",
    content: "Laughs at exactly the moment everyone else is trying to stay normal.",
    meta: {},
  },
  {
    ...base("fact-03", "Friendship Proof", 6),
    entryType: "fact",
    description: "Makes simple conversations feel like something worth remembering.",
    content: "Makes simple conversations feel like something worth remembering.",
    meta: {},
  },
];

export const localStats: PersonalityStat[] = [
  {
    ...base("chaos", "Chaos", 1),
    statKey: "chaos",
    value: 100,
    note: "Somehow useful. Somehow dangerous.",
    icon: "Flame",
  },
  {
    ...base("randomness", "Randomness", 2),
    statKey: "randomness",
    value: 90,
    note: "Topic changes may happen without warning.",
    icon: "Shuffle",
  },
  {
    ...base("making-people-laugh", "Making people laugh", 3),
    statKey: "making_people_laugh",
    value: 100,
    note: "Certified mood repair skill.",
    icon: "Laugh",
  },
  {
    ...base("normal-behavior", "Normal behavior", 4),
    statKey: "normal_behavior",
    value: 20,
    note: "Enough to function. Not enough to be boring.",
    icon: "Minus",
  },
  {
    ...base("professional-overthinking", "Professional overthinking", 5),
    statKey: "professional_overthinking",
    value: 80,
    note: "Detailed analysis of things nobody asked to analyze.",
    icon: "Brain",
  },
];

const quizSeed: Array<{
  slug: string;
  question: string;
  explanation: string;
  correct: string;
  correctFeedback: string;
  wrong: [string, string];
}> = [
  {
    slug: "q1-chaos",
    question: "Who is more likely to start random chaos?",
    explanation: "Be honest. History is not on your side here.",
    correct: "Lily Put",
    correctFeedback: "Correct. The evidence is everywhere.",
    wrong: ["Mahi", "The group chat itself"],
  },
  {
    slug: "q2-replies",
    question: "Who replies later?",
    explanation: "There is no wrong answer. Only one correct one.",
    correct: "Depends who is pretending to be busy",
    correctFeedback: "Exactly. A diplomatic answer, but still true.",
    wrong: ["Always Lily", "Always Mahi"],
  },
  {
    slug: "q3-weirdest",
    question: "Who says the weirdest things?",
    explanation: "Documented. Verified. Disputed.",
    correct: "Both, unfortunately",
    correctFeedback: "Correct. This friendship is not beating the allegations.",
    wrong: ["Only Lily", "Only Mahi"],
  },
  {
    slug: "q4-zombies",
    question: "Who would survive a zombie apocalypse?",
    explanation: "Strategic thinking versus raw improvisation.",
    correct: "Lily, by pure unpredictable logic",
    correctFeedback: "Correct. The zombies could not predict the next move either.",
    wrong: ["Mahi with a spreadsheet", "Nobody, we are being honest"],
  },
  {
    slug: "q5-simple-problem",
    question:
      "Who would accidentally turn a simple problem into a major operation?",
    explanation: "Nine times out of ten, the answer is obvious.",
    correct: "Both, but Lily starts the side quest",
    correctFeedback: "Correct. One problem, three theories, five jokes.",
    wrong: ["Nobody", "A responsible adult"],
  },
];

export const localQuiz: QuizQuestion[] = quizSeed.map((q, i) => ({
  ...base(q.slug, `Question ${i + 1}`, i + 1),
  question: q.question,
  explanation: q.explanation,
  answers: [
    {
      id: `${q.slug}-c`,
      questionId: q.slug,
      label: q.correct,
      correctFeedback: q.correctFeedback,
      wrongFeedback: "Close, but the friendship evidence says otherwise.",
      order: 1,
      isCorrect: true,
    },
    ...q.wrong.map((label, j) => ({
      id: `${q.slug}-w${j + 1}`,
      questionId: q.slug,
      label,
      correctFeedback: "",
      wrongFeedback: "Not quite. Funny answer, wrong courtroom.",
      order: j + 2,
      isCorrect: false,
    })),
  ],
}));

export const localMoments: ChaoticMoment[] = [
  {
    ...base("moment-01", "The Normal Start", 1),
    sequence: 1,
    label: "😂 100% unnecessary",
    content:
      "Every great Lily moment begins with suspicious calm. A normal message, a normal plan, a normal topic. Then the universe makes its first mistake.",
    quote: "This will be quick.",
    occurredOn: null,
    location: null,
    relatedSlug: null,
  },
  {
    ...base("moment-02", "The Side Quest", 2),
    sequence: 2,
    label: "🤡 We had one job",
    content:
      "One simple thing became three opinions, two jokes, and a completely unnecessary investigation. Nobody stopped it because it was too entertaining.",
    quote: "Wait, why are we doing this now?",
    occurredOn: null,
    location: null,
    relatedSlug: null,
  },
  {
    ...base("moment-03", "The Chaos Peak", 3),
    sequence: 3,
    label: "🚨 Absolute chaos",
    content:
      "The point where logic left the room, everyone accepted it, and the whole thing became funnier because nobody could explain how it got there.",
    quote: "There is no way to explain this properly.",
    occurredOn: null,
    location: null,
    relatedSlug: null,
  },
  {
    ...base("moment-04", "The Aftermath", 4),
    sequence: 4,
    label: "🧠 Brain.exe stopped working",
    content:
      "The final stage: laughing about the entire thing later and realizing it somehow became another friendship memory.",
    quote: "This is going on the record.",
    occurredOn: null,
    location: null,
    relatedSlug: null,
  },
];

export const localAppreciation: AppreciationCard[] = [
  { slug: "random-messages", title: "Random messages at 2am", note: "Because somehow even the random updates have personality.", icon: "MessageCircle", accent: "berry" },
  { slug: "unnecessary-jokes", title: "Jokes that were never necessary", note: "Not needed. Still appreciated. Usually the best part.", icon: "Laugh", accent: "ember" },
  { slug: "ordinary-hilarious", title: "Making ordinary conversations hilarious", note: "A normal topic is never fully safe around Lily.", icon: "Sparkles", accent: "grape" },
  { slug: "random-topic-changes", title: "Completely random topic changes", note: "The conversation GPS recalculates every few minutes.", icon: "Shuffle", accent: "mint" },
  { slug: "shows-up", title: "Being there when it actually matters", note: "Behind the jokes, she is genuinely solid.", icon: "HeartHandshake", accent: "berry" },
  { slug: "boring-better", title: "Making boring situations fun", note: "Boredom enters. Lily interrupts. The day improves.", icon: "PartyPopper", accent: "ember" },
  { slug: "ridiculous-personality", title: "Her ridiculous personality", note: "A feature, not a bug. Mostly.", icon: "Ghost", accent: "grape" },
  { slug: "little-things", title: "The little things that make her her", note: "The reactions, the timing, the tiny habits. All of it counts.", icon: "Star", accent: "mint" },
  { slug: "genuinely-good", title: "Being genuinely a good person", note: "The chaos is loud, but the kindness is the important part.", icon: "BadgeCheck", accent: "berry" },
  { slug: "chaos-partner", title: "The chaos partner I never asked for", note: "Unexpected, slightly dangerous, and honestly very appreciated.", icon: "Flame", accent: "ember" },
].map((c, i) => ({
  ...base(c.slug, c.title, i + 1),
  note: c.note,
  icon: c.icon,
  accent: c.accent as AppreciationCard["accent"],
}));

export const localMessages: BirthdayMessage[] = [
  {
    ...base("happy-birthday-lily-put", "HAPPY BIRTHDAY", 1),
    message: "Today is officially Lily Put Day.",
    from: "Mahi",
    signature: "Mahi",
  },
  {
    ...base("no-speeches", "No speeches", 2),
    message: "No speeches. No emotional damage. Just birthday chaos. 😂",
    from: "Mahi",
    signature: "Mahi",
  },
  {
    ...base("favorite-person", "One of my favorite people", 3),
    message:
      "Although… you are genuinely one of my favorite people to be ridiculous with.",
    from: "Mahi",
    signature: "Mahi",
  },
];

export const localLetters: Letter[] = [
  {
    ...base("a-proper-birthday-letter", "Friendship Chapters", 1),
    body: [
      "This is a proper friendship note for Lily Put, because a normal birthday text felt too small for the amount of chaos, laughter, and good energy you bring into ordinary days.",
      "You have this talent for making a simple conversation turn into a full episode. One topic becomes three jokes, one small problem becomes a side quest, and somehow the day becomes more memorable than it had any right to be.",
      "The best part is not only the funny side. Behind all the random jokes and dramatic reactions, you are genuinely a good friend. You make people feel included, you notice small things, and you make boring moments feel lighter.",
      "I appreciate the random messages, the unnecessary jokes, the topic changes with no warning, the overthinking, the laughter, and the way you can make a normal day feel less heavy without even trying that hard.",
      "For this new year of your life, I hope you get more peace, more wins, more reasons to laugh, and fewer situations that need professional-level overthinking. But if chaos still happens, at least make it legendary.",
      "So happy birthday, Lily. Stay kind, stay weird, stay funny, and keep being exactly the kind of friend who makes life feel less boring. This whole little universe is from Mahi, for friendship only, obviously.",
    ],
    signOff: "End of chapters. Go enjoy your birthday like the main character of controlled chaos.",
    signature: "Mahi",
    isEnvelopeReveal: false,
  },
  {
    ...base("the-envelope", "One last friendship note", 2),
    body: [
      "One last thing, Lily: I am genuinely glad we are friends. You make normal days lighter, funnier, and less boring, and that matters more than any fancy birthday line.",
      "From Mahi: keep being the same funny, kind, slightly chaotic person. This is friendship only, but it is real appreciation. Happy birthday.",
    ],
    signOff: "— Mahi",
    signature: "Mahi",
    isEnvelopeReveal: true,
  },
];

export const localSecrets: SecretMessage[] = [
  {
    ...base("001", "Secret 001", 1),
    message:
      "Secret revealed: the jokes are loud, but the appreciation is real.",
    unlockHint: "Some things are only visible to people who keep clicking.",
    code: null,
    rarity: "common",
  },
  {
    ...base("hidden", "The hidden one", 2),
    message: "Secret revealed: you are easier to appreciate than to explain.",
    unlockHint: "You found the quiet one.",
    code: null,
    rarity: "rare",
  },
  {
    ...base("lily-put-level-max", "Lily Put Level Max", 3),
    message: "Secret revealed: maximum Lily energy has been detected. There is no patch for this.",
    unlockHint: "Maximum effort unlocked.",
    code: null,
    rarity: "legendary",
  },
];

export const localLinks: ExperienceLink[] = [
  { slug: "open-this-later", title: "🎁 Open this", eyebrow: "Surprise", description: "A tiny birthday surprise with maximum dramatic framing.", cta: "Open", type: "surprise", icon: "Gift", destination: "/surprise/open-this-later", animation: "pop", order: 1 },
  { slug: "a-memory", title: "📸 A memory", eyebrow: "Memory", description: "One of those moments that became funnier after it happened.", cta: "Read", type: "memory", icon: "Images", destination: "/memory/that-ridiculous-day", animation: "tilt", order: 2 },
  { slug: "inside-joke", title: "😂 Inside joke", eyebrow: "Joke", description: "A private joke that refuses to explain itself to outsiders.", cta: "Open", type: "inside-joke", icon: "Laugh", destination: "/inside-joke/the-thing-we-cannot-explain", animation: "float", order: 3 },
  { slug: "a-message", title: "💌 A message", eyebrow: "Message", description: "A short birthday note without too much emotional damage.", cta: "Read", type: "message", icon: "Mail", destination: "/message/happy-birthday-lily-put", animation: "reveal", order: 4 },
  { slug: "the-quiz", title: "🧠 Quiz", eyebrow: "Quiz", description: "A friendship exam with deeply unserious evidence.", cta: "Play", type: "quiz", icon: "Brain", destination: "/quiz", animation: "glow", order: 5 },
  { slug: "a-secret", title: "🔐 Secret", eyebrow: "Secret", description: "Click carefully. The classified appreciation files are inside.", cta: "Unlock", type: "secret", icon: "LockKeyhole", destination: "/secret/001", animation: "glow", order: 6 },
  { slug: "hidden-surprise", title: "✨ Hidden surprise", eyebrow: "Surprise", description: "A little extra page for people who keep clicking things.", cta: "Open", type: "surprise", icon: "Sparkles", destination: "/surprise/hidden-surprise", animation: "pop", order: 7 },
  { slug: "lily-put-lore", title: "📖 Lily Put lore", eyebrow: "Lore", description: "The unofficial documentation of Lily Put energy.", cta: "Read", type: "lore", icon: "BookOpen", destination: "/lore/the-lore", animation: "tilt", order: 8 },
  { slug: "best-moment", title: "🏆 Best moment", eyebrow: "Moment", description: "A cinematic record of ordinary plans becoming chaos.", cta: "See", type: "moment", icon: "Trophy", destination: "/moment/moment-01", animation: "glow", order: 9 },
  { slug: "the-letter", title: "💌 The letter", eyebrow: "Letter", description: "The sincere part. Still friendship only. Obviously.", cta: "Read", type: "letter", icon: "Mail", destination: "/letter/a-proper-birthday-letter", animation: "tilt", order: 10 },
].map((l) => ({ ...base(l.slug, l.title, l.order), ...l })) as ExperienceLink[];

export const localEggs: EasterEgg[] = [
  {
    ...base("forbidden-button", "The forbidden button", 1),
    trigger: "hidden-button",
    payload: "You found the forbidden button. There was absolutely no reason to click that. 😂",
    secretKey: null,
    hint: "There was absolutely no reason to click that.",
  },
  {
    ...base("name-clicks", "Name taps", 2),
    trigger: "name-click",
    payload: "Stop poking her name. 😂",
    secretKey: null,
    hint: "Tap the name a few times.",
  },
  {
    ...base("tiny-star", "The tiny star", 3),
    trigger: "star",
    payload: "You found a tiny star. 🌟",
    secretKey: null,
    hint: "Somewhere on this page is a very small star.",
  },
  {
    ...base("keyboard-lily", "Keyboard shortcut", 4),
    trigger: "keyboard",
    payload: "L-I-L-Y. Typed. Loudly. In your mind.",
    secretKey: "lily",
    hint: "Try four keys in a row.",
  },
  {
    ...base("konami", "Konami", 5),
    trigger: "konami",
    payload: "↑ ↑ ↓ ↓ → ← → ← B A. Honestly, respect.",
    secretKey: "upupdowndownleftrightleftrightbaba",
    hint: "Old-school cheat code energy.",
  },
];

export const localSettings: SiteSettings[] = [
  ["intro_line_1", "For Lily Put."],
  ["intro_line_2", "Yeah… you."],
  ["intro_line_3", "I made something for your birthday."],
  ["gift_cta", "OPEN MY BIRTHDAY SURPRISE"],
  ["reveal_kicker", "HAPPY BIRTHDAY"],
  ["reveal_name", "LILY PUT"],
  ["reveal_sub_1", "Today is officially Lily Put Day."],
  ["reveal_sub_2", "No speeches. No emotional damage. Just birthday chaos. 😂"],
  ["reveal_sub_3", "Although… you are genuinely one of my favorite people to be ridiculous with."],
  ["universe_title", "🔗 Lily Put's Little Internet Universe"],
  ["universe_description", "Apparently one birthday website wasn't enough."],
  ["finale_kicker", "HAPPY BIRTHDAY, LILY PUT! 🎂🎈"],
  ["finale_line_1", "Here's to another year of chaos, ridiculous conversations, unforgettable moments, and new memories."],
  ["finale_line_2", "Stay exactly as weird as you are. 😂"],
  ["finale_line_3", "And seriously, Lily Put — I'm really glad you're my friend."],
  ["finale_signature", "— Mahi"],
  ["video_placeholder", ""],
  ["photo_placeholder", "/placeholders/photo.svg"],
  ["quote_placeholder", "No quote needed. The chaos speaks for itself."],
].map(([key, value], i) => ({
  id: `local-setting-${key}`,
  key: key as string,
  value: value as string,
  label: null,
  updatedAt: T0,
  order: i + 1,
}));

export const localSeed = {
  profile: localProfile,
  memories: localMemories,
  jokes: localJokes,
  lore: localLore,
  stats: localStats,
  quiz: localQuiz,
  moments: localMoments,
  appreciation: localAppreciation,
  messages: localMessages,
  letters: localLetters,
  secrets: localSecrets,
  links: localLinks,
  eggs: localEggs,
  settings: localSettings,
};
