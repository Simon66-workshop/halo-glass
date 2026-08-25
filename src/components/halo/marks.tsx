import type { ChipIcon, ChipTone, CompanyMark } from "@/lib/halo";
import { cn } from "@/lib/utils";

export function CompanyBadge({ mark, className }: { mark: CompanyMark; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-11 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)]",
        className,
      )}
    >
      {mark === "google" ? <GoogleMark /> : null}
      {mark === "north" ? <LetterMark letter="N" from="#1f2933" to="#4b6274" /> : null}
      {mark === "atelier" ? <LetterMark letter="A" from="#c46a3a" to="#e2a46a" /> : null}
      {mark === "solace" ? <LetterMark letter="S" from="#2f6f66" to="#7dbea8" /> : null}
      {mark === "rivermark" ? <LetterMark letter="R" from="#3d4f9c" to="#7f96e8" /> : null}
    </span>
  );
}

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

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-7" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
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
    <svg viewBox="0 0 28 28" className={cn("size-7 drop-shadow-md", className)} aria-hidden="true">
      <path
        d="M5 3.4 21.6 16.2l-7.1.6 3.5 7.6-3.2 1.4-3.5-7.5-4.8 5.1Z"
        fill="white"
        stroke="#2b241c"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}
