import { forwardRef, useState, type Ref } from "react";
import { Bookmark, Heart, MapPin } from "lucide-react";
import type { JobCardData, SceneTone } from "@/lib/halo";
import { cn } from "@/lib/utils";
import { ChipGlyph, CompanyBadge, Sparkle } from "./marks";

type JobCardProps = {
  data: JobCardData;
  saved?: boolean;
  interested?: boolean;
  onSave?: () => void;
  onInterested?: () => void;
  demoClick?: boolean;
  className?: string;
  compact?: boolean;
  saveRef?: Ref<HTMLButtonElement>;
  tone?: SceneTone;
};

export const JobCard = forwardRef<HTMLElement, JobCardProps>(function JobCard(
  {
    data,
    saved = false,
    interested = false,
    onSave,
    onInterested,
    demoClick = false,
    className,
    compact = false,
    saveRef,
    tone = "dark",
  },
  ref,
) {
  const light = tone === "light";
  return (
    <article
      ref={ref}
      className={cn(
        "glass-panel relative w-full max-w-[560px] rounded-[2rem] will-change-transform",
        light ? "tone-light text-ink" : "text-white",
        compact ? "p-5" : "p-6 sm:p-7",
        className,
      )}
    >
      <div className="glass-read" aria-hidden="true" />
      <div className="glass-sheen" aria-hidden="true" />
      <div className="type-legible relative z-10 flex flex-col gap-5 sm:gap-6">
        <header className="flex items-start justify-between gap-3">
          <CompanyBadge mark={data.mark} className="mark-pop" />
          <SaveButton ref={saveRef} saved={saved} onClick={onSave} pressed={demoClick} light={light} />
        </header>

        <div>
          <p
            className={cn(
              "mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase",
              light ? "text-ink/70" : "text-white/90",
            )}
          >
            {data.badge}
            <Sparkle className="sparkle-twinkle text-amber-500" />
          </p>
          <h2
            className={cn(
              "font-extrabold tracking-[-0.035em]",
              light ? "text-ink" : "text-white",
              compact ? "text-[1.65rem] leading-none" : "text-[2rem] leading-none sm:text-[2.35rem]",
            )}
          >
            {data.title}
          </h2>
          <p
            className={cn(
              "mt-2 font-medium",
              light ? "text-ink/75" : "text-white/92",
              compact ? "text-sm" : "text-[15px] sm:text-base",
            )}
          >
            {data.tagline}{" "}
            <span className="text-love">{data.taglineAccent}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {data.chips.map((chip) => (
            <div
              key={chip.title}
              className="glass-inset flex items-center gap-2.5 rounded-[1.15rem] px-2.5 py-2 pr-4 transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              <ChipGlyph icon={chip.icon} tone={chip.tone} />
              <div className="leading-tight">
                <p className={cn("text-[13px] font-semibold", light ? "text-ink" : "text-white")}>
                  {chip.title}
                </p>
                <p className={cn("text-[11px] font-medium", light ? "text-ink/60" : "text-white/80")}>
                  {chip.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <footer className="flex flex-wrap items-end justify-between gap-3 pt-1">
          <div className="min-w-0">
            <p className={cn("text-[11px] font-medium", light ? "text-ink/55" : "text-white/70")}>
              {data.metaLabel}
            </p>
            <p
              className={cn(
                "mt-1 flex items-center gap-1.5 text-[12px] font-medium",
                light ? "text-ink/70" : "text-white/80",
              )}
            >
              <MapPin className={cn("size-3.5 shrink-0", light ? "text-ink/55" : "text-white/70")} strokeWidth={2} />
              <span className="truncate">{data.meta}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onInterested}
            className={cn(
              "cta-gradient rounded-full px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] transition-[transform,filter] duration-150 ease-out active:scale-[0.96]",
              interested && "brightness-110",
            )}
          >
            {interested ? "You're in" : data.cta}
          </button>
        </footer>
      </div>
    </article>
  );
});

const SaveButton = forwardRef<
  HTMLButtonElement,
  { saved: boolean; onClick?: () => void; pressed: boolean; light: boolean }
>(function SaveButton({ saved, onClick, pressed, light }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      className={cn(
        "glass-pill relative flex min-h-11 items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-[transform,background-color] duration-150 ease-out active:scale-[0.96]",
        light ? "text-ink/80" : "text-white/90",
        pressed && "scale-[0.96] bg-white/40",
      )}
    >
      <span className="relative size-4">
        <Heart
          className={cn(
            "absolute inset-0 size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            saved ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
          )}
          fill="currentColor"
          strokeWidth={0}
        />
        <Heart
          className={cn(
            "absolute inset-0 size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            saved ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
          )}
          strokeWidth={1.8}
        />
      </span>
      Save for later
      <span
        className={cn(
          "grid place-items-center overflow-hidden transition-[width,opacity,margin] duration-300 ease-out",
          saved ? "ml-0.5 w-4 opacity-100" : "ml-0 w-0 opacity-0",
        )}
      >
        <Bookmark className="size-3.5" fill="currentColor" strokeWidth={0} />
      </span>
    </button>
  );
});

export function useCardState() {
  const [saved, setSaved] = useState(false);
  const [interested, setInterested] = useState(false);
  return {
    saved,
    interested,
    toggleSave: () => setSaved((v) => !v),
    markInterested: () => setInterested(true),
    reset: () => {
      setSaved(false);
      setInterested(false);
    },
  };
}
