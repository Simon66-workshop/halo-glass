import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { HALO_TOKENS, HERO_JOB, JOB_PRESETS, SCENES, type JobCardData, type SceneTone } from "@/lib/halo";
import { DEFAULT_LOOK, NEBULA_LOOKS } from "@/lib/nebula";
import { cn } from "@/lib/utils";
import { CinematicHero } from "./CinematicHero";
import { JobCard, useCardState } from "./JobCard";
import { ChipGlyph, CompanyBadge, Sparkle } from "./marks";
import { Scene } from "./Scene";

const NAV = [
  { href: "#scene", label: "Scene" },
  { href: "#lab", label: "Lab" },
  { href: "#kit", label: "Kit" },
  { href: "#play", label: "Playground" },
];

const FLUID_STEPS = [
  {
    kicker: "01 D2Q9",
    title: "Lattice",
    body: "Nine discrete velocities on a square grid. Rest, four cardinals, four diagonals. The fluid is a crowd of packets.",
  },
  {
    kicker: "02 Stream",
    title: "Hop",
    body: "Each packet jumps to its neighbor along eᵢ. Pull-gather on the GPU: a cell reads what just arrived.",
  },
  {
    kicker: "03 BGK",
    title: "Collide",
    body: "Relax toward local equilibrium fᵢᵉᵠ. τ sets viscosity: ν = cₛ² (τ − ½). Low τ, high Reynolds.",
  },
  {
    kicker: "04 Moments",
    title: "Recover",
    body: "Density ρ = Σ fᵢ. Velocity ρu = Σ fᵢ eᵢ. Navier–Stokes emerges from the lattice — we never solve Poisson.",
  },
];

export function Studio() {
  const [copied, setCopied] = useState<string | null>(null);
  const [lookId, setLookId] = useState(DEFAULT_LOOK.id);
  const look = NEBULA_LOOKS.find((item) => item.id === lookId) ?? DEFAULT_LOOK;
  const [density, setDensity] = useState(look.density);
  const [swirl, setSwirl] = useState(look.swirl);
  const [stars, setStars] = useState(look.stars);
  const tone = look.tone;

  const pickLook = (id: string) => {
    const next = NEBULA_LOOKS.find((item) => item.id === id) ?? look;
    setLookId(next.id);
    setDensity(next.density);
    setSwirl(next.swirl);
    setStars(next.stars);
  };

  return (
    <div className="min-h-dvh bg-[#070b14] text-sand">
      <Nav tone={tone} />
      <CinematicHero look={look} density={density} swirl={swirl} stars={stars} onLook={pickLook} />

      <section id="lab" className="px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Header
            invert
            kicker="Lattice lab"
            title="Boltzmann on a grid"
            body="D2Q9 Lattice Boltzmann — collide, stream, recover. No pressure Poisson. Drag to add momentum. Fluidity lowers τ so vortices live longer."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {NEBULA_LOOKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => pickLook(item.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
                  lookId === item.id ? "bg-sand text-ink" : "bg-white/10 text-sand hover:bg-white/16",
                )}
              >
                {item.name}
                <span className="ml-2 text-xs opacity-60">{item.note}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Slider label="Force" value={density} min={0.45} max={1.6} onChange={setDensity} />
            <Slider label="Fluidity" value={swirl} min={0} max={1.8} onChange={setSwirl} />
            <Slider label="Stars" value={stars} min={0} max={1.6} onChange={setStars} />
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FLUID_STEPS.map((step) => (
              <article key={step.title} className="rounded-[1.5rem] bg-white/6 p-4">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-sand/45 uppercase">{step.kicker}</p>
                <h3 className="mt-2 text-lg font-bold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand/65">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="kit" className="relative px-4 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <Header
            invert
            kicker="The kit"
            title="Pieces you can actually use"
            body="Every control on the job card is a reusable Halo part — glass surface, save pill, chips, gradient action."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <KitTile title="Glass panel" note="Frost, specular, inner rim" src={SCENES[tone].src}>
              <div className={cn("glass-panel h-28 rounded-[1.6rem]", tone === "light" && "tone-light")} />
            </KitTile>
            <KitTile title="Save pill" note="Heart fills, bookmark lands" src={SCENES[tone].src}>
              <button
                type="button"
                className={cn(
                  "glass-pill flex items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] font-medium",
                  tone === "light" ? "tone-light text-ink" : "text-white",
                )}
              >
                Save for later
              </button>
            </KitTile>
            <KitTile title="Chips" note="Nested glass + tinted glyph" src={SCENES[tone].src}>
              <div className="flex flex-wrap gap-2">
                {HERO_JOB.chips.map((chip) => (
                  <div
                    key={chip.title}
                    className={cn(
                      "glass-inset flex items-center gap-2 rounded-[1.15rem] px-2.5 py-2 pr-3.5",
                      tone === "light" ? "text-ink" : "text-white",
                    )}
                  >
                    <ChipGlyph icon={chip.icon} tone={chip.tone} />
                    <span className="text-sm font-semibold">{chip.title}</span>
                  </div>
                ))}
              </div>
            </KitTile>
            <KitTile title="Gradient CTA" note="Blue → violet → coral" src={SCENES[tone].src}>
              <button type="button" className="cta-gradient rounded-full px-5 py-2.5 text-sm font-semibold">
                I'm Interested
              </button>
            </KitTile>
            <KitTile title="Company mark" note="White disc, 44px hit" src={SCENES[tone].src}>
              <div className="flex items-center gap-3">
                {(["google", "north", "atelier", "solace"] as const).map((mark) => (
                  <CompanyBadge key={mark} mark={mark} />
                ))}
              </div>
            </KitTile>
            <KitTile title="Top pick" note="Tracked label + spark" src={SCENES[tone].src}>
              <p
                className={cn(
                  "flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase",
                  tone === "light" ? "text-ink/70" : "text-white/80",
                )}
              >
                Top job pick
                <Sparkle className="text-amber-400" />
              </p>
            </KitTile>
          </div>
        </div>
      </section>

      <Playground copied={copied} onCopy={setCopied} tone={tone} onTone={(t) => pickLook(t === "light" ? "dawn" : "veil")} />
      <Tokens copied={copied} onCopy={setCopied} />

      <footer className="px-4 py-12 text-center text-sm text-sand/50">
        Halo glass on a D2Q9 Lattice Boltzmann field.
      </footer>
    </div>
  );
}

function Nav({ tone }: { tone: SceneTone }) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-4 sm:pt-5">
      <nav
        className={cn(
          "pointer-events-auto glass-panel flex items-center gap-1 rounded-full p-1.5 pr-2",
          tone === "light" ? "tone-light text-ink" : "text-white",
        )}
      >
        <a href="#scene" className="flex items-center gap-2 rounded-full px-3 py-2">
          <span className="grid size-7 place-items-center rounded-full bg-white/90 text-[11px] font-extrabold tracking-tight text-ink">
            H
          </span>
          <span className="hidden pr-1 text-sm font-semibold sm:inline">Halo</span>
        </a>
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full px-3 py-2 text-sm font-medium transition-colors duration-150",
              tone === "light" ? "text-ink/70 hover:bg-white/40 hover:text-ink" : "text-white/80 hover:bg-white/15 hover:text-white",
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block rounded-[1.5rem] bg-white/6 p-4">
      <span className="mb-3 flex items-center justify-between text-sm font-semibold">
        {label}
        <span className="font-mono text-xs text-sand/50">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-sand"
      />
    </label>
  );
}

function Header({
  kicker,
  title,
  body,
  invert = false,
}: {
  kicker: string;
  title: string;
  body: string;
  invert?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p
        className={cn(
          "text-[11px] font-semibold tracking-[0.16em] uppercase",
          invert ? "text-sand/55" : "text-ink-soft",
        )}
      >
        {kicker}
      </p>
      <h2
        className={cn(
          "mt-2 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl",
          invert ? "text-sand" : "text-ink",
        )}
      >
        {title}
      </h2>
      <p className={cn("mt-3 text-[15px] leading-relaxed", invert ? "text-sand/70" : "text-ink-soft")}>
        {body}
      </p>
    </div>
  );
}

function KitTile({
  title,
  note,
  children,
  src,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
  src: string;
}) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-white/6 p-5 text-sand shadow-[0_18px_40px_rgb(0_0_0/0.25)]">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-sand/50">{note}</p>
        </div>
      </div>
      <div className="relative min-h-28 overflow-hidden rounded-[1.4rem]">
        <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="relative z-10 flex min-h-28 items-center justify-center p-4">{children}</div>
      </div>
    </div>
  );
}

function Playground({
  copied,
  onCopy,
  tone,
  onTone,
}: {
  copied: string | null;
  onCopy: (v: string | null) => void;
  tone: SceneTone;
  onTone: (t: SceneTone) => void;
}) {
  const [presetId, setPresetId] = useState(HERO_JOB.id);
  const [draft, setDraft] = useState<JobCardData>(HERO_JOB);
  const state = useCardState();
  const scene = SCENES[tone];

  useEffect(() => {
    const next = JOB_PRESETS.find((j) => j.id === presetId) ?? HERO_JOB;
    setDraft(next);
    state.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetId]);

  const snippet = useMemo(() => JSON.stringify(draft, null, 2), [draft]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      onCopy("json");
      window.setTimeout(() => onCopy(null), 1600);
    } catch {
      onCopy(null);
    }
  };

  const set = (patch: Partial<JobCardData>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <section id="play" className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Header
          invert
          kicker="Playground"
          title="Compose a card"
          body="Swap a preset or rewrite the copy. Toggle Night and Dawn to proof the glass on both skies."
        />
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {JOB_PRESETS.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => setPresetId(job.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
                presetId === job.id ? "bg-sand text-ink" : "bg-white/10 text-sand hover:bg-white/16",
              )}
            >
              {job.company}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />
          {(["dark", "light"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onTone(id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
                tone === id ? "bg-sand text-ink" : "bg-white/10 text-sand hover:bg-white/16",
              )}
            >
              {SCENES[id].label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Scene
            src={scene.src}
            alt={scene.alt}
            className="min-h-[520px] rounded-[2rem]"
            parallax={false}
            overlay={
              tone === "dark"
                ? "bg-linear-to-b from-black/20 via-transparent to-black/35"
                : "bg-linear-to-b from-white/5 via-transparent to-black/10"
            }
          >
            <JobCard
              data={draft}
              tone={tone}
              saved={state.saved}
              interested={state.interested}
              onSave={state.toggleSave}
              onInterested={state.markInterested}
            />
          </Scene>
          <form
            className="flex flex-col gap-3 rounded-[2rem] bg-white/8 p-5 sm:p-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="Title" value={draft.title} onChange={(v) => set({ title: v })} />
            <Field label="Tagline" value={draft.tagline} onChange={(v) => set({ tagline: v })} />
            <Field label="Accent" value={draft.taglineAccent} onChange={(v) => set({ taglineAccent: v })} />
            <Field label="Badge" value={draft.badge} onChange={(v) => set({ badge: v })} />
            <Field label="Meta" value={draft.meta} onChange={(v) => set({ meta: v })} />
            <Field label="CTA" value={draft.cta} onChange={(v) => set({ cta: v })} />
            <button
              type="button"
              onClick={copy}
              className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-full bg-sand px-4 text-sm font-semibold text-ink transition-transform duration-150 active:scale-[0.96]"
            >
              {copied === "json" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "json" ? "Copied card JSON" : "Copy card JSON"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.12em] text-sand/50 uppercase">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-2xl border border-white/10 bg-white/8 px-3.5 text-sm text-sand outline-none ring-sand/30 transition-[box-shadow] duration-150 focus:ring-2"
      />
    </label>
  );
}

function Tokens({
  copied,
  onCopy,
}: {
  copied: string | null;
  onCopy: (v: string | null) => void;
}) {
  const sheet = HALO_TOKENS.map((t) => `${t.token}: ${t.value};`).join("\n");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sheet);
      onCopy("tokens");
      window.setTimeout(() => onCopy(null), 1600);
    } catch {
      onCopy(null);
    }
  };

  return (
    <section id="tokens" className="px-4 pb-20 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white/6 p-6 text-sand sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Header
            invert
            kicker="Tokens"
            title="One surface language"
            body="Sand, ink, love-violet, coral. Glass is a fill plus blur — not a second palette."
          />
          <button
            type="button"
            onClick={copy}
            className="flex min-h-11 items-center gap-2 rounded-full bg-sand px-4 text-sm font-semibold text-ink transition-transform duration-150 active:scale-[0.96]"
          >
            {copied === "tokens" ? <Check className="size-4" /> : <Copy className="size-4" />}
            Copy tokens
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {HALO_TOKENS.map((token) => (
            <div key={token.name} className="rounded-2xl bg-white/8 p-3">
              <div
                className="h-14 rounded-xl border border-white/10"
                style={{ background: token.value }}
              />
              <p className="mt-2 text-sm font-semibold">{token.name}</p>
              <p className="font-mono text-[11px] text-sand/55">{token.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
