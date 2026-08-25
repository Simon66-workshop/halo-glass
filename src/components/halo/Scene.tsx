import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SceneProps = {
  src: string;
  alt?: string;
  children: ReactNode;
  className?: string;
  frameClassName?: string;
  parallax?: boolean;
  overlay?: string;
};

export function Scene({
  src,
  alt = "",
  children,
  className,
  frameClassName,
  parallax = true,
  overlay = "bg-linear-to-b from-black/10 via-transparent to-black/25",
}: SceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!parallax) return;
    const root = rootRef.current;
    const bg = bgRef.current;
    if (!root || !bg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      bg.style.transform = `translate3d(${x * -18}px, ${y * -12}px, 0) scale(1.08)`;
    };

    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, [parallax]);

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate overflow-hidden bg-[#070b14]", className)}
    >
      <img
        ref={bgRef}
        src={src}
        alt={alt}
        className="pointer-events-none absolute inset-0 size-full scale-105 object-cover object-center transition-transform duration-500 ease-out"
      />
      <div className={cn("pointer-events-none absolute inset-0", overlay)} />
      <div
        className={cn(
          "relative z-10 flex h-full items-center justify-center px-4 py-10 sm:px-8",
          frameClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
