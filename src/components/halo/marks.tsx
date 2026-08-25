import type { ChipIcon, ChipTone, CompanyMark } from "@/lib/halo";
import { cn } from "@/lib/utils";

export function CompanyBadge({ mark, className }: { mark: CompanyMark; className?: string }) {
  if (mark === "sixtysix") {
    return <SixtySixMark className={cn("h-10 w-[4.5rem]", className)} ink="currentColor" x="#9B87FF" />;
  }
  return (
    <span
      className={cn(
        "grid size-11 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)]",
        className,
      )}
    >
      {mark === "north" ? <LetterMark letter="N" from="#1f2933" to="#4b6274" /> : null}
      {mark === "atelier" ? <LetterMark letter="A" from="#c46a3a" to="#e2a46a" /> : null}
      {mark === "solace" ? <LetterMark letter="S" from="#2f6f66" to="#7dbea8" /> : null}
      {mark === "rivermark" ? <LetterMark letter="R" from="#3d4f9c" to="#7f96e8" /> : null}
    </span>
  );
}

function SixtySixMark({
  className,
  ink = "#0B1224",
  x = "#7C5CFF",
}: {
  className?: string;
  ink?: string;
  x?: string;
}) {
  return (
    <svg viewBox="0 0 72 36" className={cn("h-8 w-16 bg-transparent", className)} fill="none" aria-hidden="true">
      <SixtySixLockup ink={ink} x={x} />
    </svg>
  );
}

export function SixtySixLockup({ ink, x }: { ink: string; x: string }) {
  return (
    <text
      x="36"
      y="25.5"
      textAnchor="middle"
      fontFamily="'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif"
      fontSize="22"
      fontWeight="800"
      letterSpacing="-1.7"
    >
      <tspan fill={ink}>66</tspan>
      <tspan fill={x}>X</tspan>
    </text>
  );
}

export { SixtySixMark };

function LetterMark({ letter, from, to }: { letter: string; from: string; to: string }) {
  return (
    <span
      className="grid size-8 place-items-center rounded-full text-sm font-bold text-white"
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      {letter}
    </span>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("size-3.5", className)} fill="currentColor" aria-hidden="true">
      <path d="M8 0c.35 3.2 1.4 5.4 4.2 6.4C9.4 7.5 8.35 9.7 8 13c-.35-3.3-1.4-5.5-4.2-6.6C6.6 5.4 7.65 3.2 8 0Z" />
      <path d="M13.2 9.2c.18 1.3.62 2.16 1.8 2.6-1.18.44-1.62 1.3-1.8 2.6-.18-1.3-.62-2.16-1.8-2.6 1.18-.44 1.62-1.3 1.8-2.6Z" />
    </svg>
  );
}

const TONE: Record<ChipTone, string> = {
  violet: "from-[#7C5CFF] to-[#9B7DFF]",
  coral: "from-[#FF8A4C] to-[#FF6A3A]",
  teal: "from-[#2BBBAD] to-[#3DCFB8]",
  blue: "from-[#4C8DFF] to-[#6AA4FF]",
};

export function ChipGlyph({ icon, tone }: { icon: ChipIcon; tone: ChipTone }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br text-white shadow-[0_6px_14px_rgb(80_40_20/0.18)]",
        TONE[tone],
      )}
    >
      {icon === "bag" ? (
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="4" y="8" width="16" height="12" rx="2.4" />
          <path d="M8 8V7a4 4 0 0 1 8 0v1" />
        </svg>
      ) : null}
      {icon === "clock" ? (
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.4l2.6 1.6" />
        </svg>
      ) : null}
      {icon === "pin" ? (
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
          <circle cx="12" cy="11" r="1.7" />
        </svg>
      ) : null}
      {icon === "users" ? (
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="9" cy="9" r="3" />
          <path d="M4.5 18a4.5 4.5 0 0 1 9 0" />
          <circle cx="16.5" cy="9.5" r="2.4" />
          <path d="M15 18c.4-1.6 1.7-3 3.8-3.4" />
        </svg>
      ) : null}
      {icon === "spark" ? (
        <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden="true">
          <path d="M12 3c.4 3.4 1.6 5.8 4.8 6.9C13.6 11 12.4 13.4 12 17c-.4-3.6-1.6-6-4.8-7.1C10.4 8.8 11.6 6.4 12 3Z" />
        </svg>
      ) : null}
    </span>
  );
}

export function PointerCursor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <path
        d="M6 3.5 22.5 16.2l-7.2 1.4 4.3 9.2-3.6 1.6-4.3-9.1-5.1 5.2Z"
        fill="#fff"
        stroke="#0B1224"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
