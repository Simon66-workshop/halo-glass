import { useEffect, useRef, useState } from "react";
import { HERO_JOB } from "@/lib/halo";
import { NEBULA_LOOKS, type NebulaLook } from "@/lib/nebula";
import { cn } from "@/lib/utils";
import { JobCard, useCardState } from "./JobCard";
import { PointerCursor } from "./marks";
import { FluidField } from "./FluidField";

export function CinematicHero({
  look,
  density,
  swirl,
  stars,
  onLook,
}: {
  look: NebulaLook;
  density: number;
  swirl: number;
  stars: number;
  onLook: (id: string) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const userTouched = useRef(false);
  const phase = useRef<"idle" | "approach" | "clicked" | "done">("idle");
  const [demoClick, setDemoClick] = useState(false);
  const hero = useCardState();
  const savedRef = useRef(false);
  const resetRef = useRef(hero.reset);
  const toggleRef = useRef(hero.toggleSave);
  savedRef.current = hero.saved;
  resetRef.current = hero.reset;
  toggleRef.current = hero.toggleSave;
  const tone = look.tone;

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const cursor = cursorRef.current;
    const save = saveRef.current;
    if (!stage || !card || !cursor || !save) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const start = performance.now();

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      pointer.current.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.current.y = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const onDown = () => {
      userTouched.current = true;
      cursor.style.opacity = "0";
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerdown", onDown);

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const cycle = t % 12;
      const narrow = stage.clientWidth < 720;
      const mx = pointer.current.x;
      const my = pointer.current.y;
      const rotY = (narrow ? -2 : -5) + Math.sin(t * 0.32) * (narrow ? 1.4 : 3) + mx * 6;
      const rotX = 2.2 + Math.cos(t * 0.38) * 1.2 - my * 3.5;
      const floatY = Math.sin(t * 0.7) * 8;
      const floatX = Math.sin(t * 0.25) * 4;
      card.style.transform = `perspective(1600px) rotateY(${rotY}deg) rotateX(${rotX}deg) translate3d(${floatX}px, ${floatY}px, 0)`;

      if (!userTouched.current) {
        driveCursor(cycle, stage, save, cursor);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerdown", onDown);
    };
  }, []);

  const driveCursor = (
    cycle: number,
    stageEl: HTMLDivElement,
    saveEl: HTMLButtonElement,
    cursorEl: HTMLDivElement,
  ) => {
    const stageBox = stageEl.getBoundingClientRect();
    const saveBox = saveEl.getBoundingClientRect();
    const targetX = saveBox.left - stageBox.left + saveBox.width * 0.72;
    const targetY = saveBox.top - stageBox.top + saveBox.height * 0.7;
    const fromX = targetX + 140;
    const fromY = targetY + 90;

    if (cycle < 0.25) {
      if (phase.current !== "idle") {
        phase.current = "idle";
        setDemoClick(false);
        if (savedRef.current) resetRef.current();
      }
      cursorEl.style.opacity = "0";
      cursorEl.style.transform = `translate3d(${fromX}px, ${fromY}px, 0)`;
      return;
    }

    if (cycle < 3.45) {
      if (phase.current !== "approach") phase.current = "approach";
      const p = easeOut((cycle - 1.55) / 1.85);
      const clamped = Math.min(Math.max(p, 0), 1);
      cursorEl.style.opacity = cycle < 1.55 ? "0" : "1";
      cursorEl.style.transform = `translate3d(${fromX + (targetX - fromX) * clamped}px, ${fromY + (targetY - fromY) * clamped}px, 0) scale(1)`;
      return;
    }

    if (cycle < 3.85) {
      if (phase.current !== "clicked") {
        phase.current = "clicked";
        setDemoClick(true);
        if (!savedRef.current) toggleRef.current();
      }
      cursorEl.style.opacity = "1";
      cursorEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(0.86)`;
      return;
    }

    if (phase.current !== "done") {
      phase.current = "done";
      setDemoClick(false);
    }
    const fade = Math.min((cycle - 3.85) / 1.4, 1);
    cursorEl.style.opacity = String(1 - fade);
    cursorEl.style.transform = `translate3d(${targetX + 16 * fade}px, ${targetY + 20 * fade}px, 0) scale(1)`;
  };

  return (
    <section id="scene" ref={stageRef} className="relative h-dvh min-h-[640px] overflow-hidden bg-[#070b14]">
      <FluidField look={look} density={density} swirl={swirl} stars={stars} />
      <div className="relative z-10 flex h-full items-center justify-center px-4 pt-16 pb-24 sm:px-8">
        <JobCard
          ref={cardRef}
          saveRef={saveRef}
          data={HERO_JOB}
          tone={tone}
          saved={hero.saved}
          interested={hero.interested}
          onSave={() => {
            userTouched.current = true;
            hero.toggleSave();
          }}
          onInterested={() => {
            userTouched.current = true;
            hero.markInterested();
          }}
          demoClick={demoClick}
          className="hero-card w-[min(100%,560px)]"
        />
      </div>
      <div
        ref={cursorRef}
        className="pointer-events-none absolute top-0 left-0 z-30 opacity-0 will-change-transform"
        aria-hidden="true"
      >
        <PointerCursor className="size-8 drop-shadow-lg" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
        <LookSwitch lookId={look.id} tone={tone} onLook={onLook} />
      </div>
    </section>
  );
}

export function LookSwitch({
  lookId,
  tone,
  onLook,
}: {
  lookId: string;
  tone: "dark" | "light";
  onLook: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "pointer-events-auto glass-panel flex max-w-[100%] flex-wrap justify-center rounded-full p-1",
        tone === "light" ? "tone-light text-ink" : "text-white",
      )}
    >
      {NEBULA_LOOKS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onLook(item.id)}
          className={cn(
            "rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-150",
            lookId === item.id
              ? "bg-white/90 font-semibold text-ink"
              : tone === "light"
                ? "text-ink/70 hover:text-ink"
                : "text-white/80 hover:text-white",
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

function easeOut(t: number) {
  const x = Math.min(Math.max(t, 0), 1);
  return 1 - (1 - x) ** 3;
}
