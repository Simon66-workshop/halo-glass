export type SceneTone = "dark" | "light";

export const SCENES: Record<
  SceneTone,
  { src: string; label: string; alt: string }
> = {
  dark: {
    src: "/scenes/space-dark.jpg",
    label: "Night",
    alt: "Ringed planet in deep space",
  },
  light: {
    src: "/scenes/space-light.jpg",
    label: "Dawn",
    alt: "Ice planet at orbital dawn",
  },
};

export type ChipTone = "violet" | "coral" | "teal" | "blue";
export type ChipIcon = "bag" | "clock" | "pin" | "users" | "spark";
export type CompanyMark = "google" | "north" | "atelier" | "solace" | "rivermark";

export type JobChip = {
  tone: ChipTone;
  icon: ChipIcon;
  title: string;
  subtitle: string;
};

export type JobCardData = {
  id: string;
  company: string;
  mark: CompanyMark;
  badge: string;
  title: string;
  tagline: string;
  taglineAccent: string;
  chips: JobChip[];
  metaLabel: string;
  meta: string;
  cta: string;
};

export const HERO_JOB: JobCardData = {
  id: "hero",
  company: "Google",
  mark: "google",
  badge: "Top job pick",
  title: "Product Designer",
  tagline: "Build products",
  taglineAccent: "people love.",
  chips: [
    { tone: "violet", icon: "bag", title: "Full-Time", subtitle: "Remote" },
    { tone: "coral", icon: "clock", title: "Flexible", subtitle: "Work anywhere" },
  ],
  metaLabel: "Inspected by",
  meta: "100.8K  ·  $247K  ·  First",
  cta: "I'm Interested",
};

export const JOB_PRESETS: JobCardData[] = [
  HERO_JOB,
  {
    id: "north",
    company: "North",
    mark: "north",
    badge: "Featured role",
    title: "Staff Engineer",
    tagline: "Shape systems",
    taglineAccent: "people trust.",
    chips: [
      { tone: "blue", icon: "bag", title: "Full-Time", subtitle: "Hybrid" },
      { tone: "teal", icon: "users", title: "Team of 8", subtitle: "Platform" },
    ],
    metaLabel: "Open in",
    meta: "SF  ·  $280K  ·  Series C",
    cta: "I'm Interested",
  },
  {
    id: "atelier",
    company: "Atelier",
    mark: "atelier",
    badge: "Studio pick",
    title: "Brand Lead",
    tagline: "Craft worlds",
    taglineAccent: "people feel.",
    chips: [
      { tone: "coral", icon: "spark", title: "Contract", subtitle: "6 months" },
      { tone: "violet", icon: "pin", title: "Lisbon", subtitle: "On-site" },
    ],
    metaLabel: "Casting",
    meta: "12K  ·  Day rate  ·  Now",
    cta: "Apply now",
  },
  {
    id: "solace",
    company: "Solace",
    mark: "solace",
    badge: "Founding seat",
    title: "Product Designer",
    tagline: "Start from",
    taglineAccent: "quiet care.",
    chips: [
      { tone: "teal", icon: "bag", title: "Full-Time", subtitle: "Remote" },
      { tone: "blue", icon: "clock", title: "Early", subtitle: "Equity heavy" },
    ],
    metaLabel: "Raised",
    meta: "Seed  ·  $4.2M  ·  Remote",
    cta: "Say hello",
  },
];

export const HALO_TOKENS = [
  { name: "Sand", token: "--color-sand", value: "#E7D7C2" },
  { name: "Ink", token: "--color-ink", value: "#3C342C" },
  { name: "Love", token: "--color-love", value: "#C9A8FF" },
  { name: "Violet", token: "--color-chip-violet", value: "#7C5CFF" },
  { name: "Coral", token: "--color-chip-coral", value: "#FF7B4A" },
  { name: "Glass", token: "glass fill", value: "rgba(255,255,255,.22)" },
];
