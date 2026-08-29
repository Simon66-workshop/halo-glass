import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type GlassTone = "dark" | "light";

type GlassCardProps = {
  tone?: GlassTone;
  sheen?: boolean;
  radius?: string;
  padding?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

export function GlassCard({
  tone = "dark",
  sheen = true,
  radius = "2rem",
  padding = "1.5rem",
  className,
  style,
  children,
  ...rest
}: GlassCardProps) {
  const classes = [
    "glass-panel",
    tone === "light" ? "tone-light" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={classes}
      style={{ borderRadius: radius, padding, ...style }}
      {...rest}
    >
      <div className="glass-read" aria-hidden="true" />
      {sheen ? <div className="glass-sheen" aria-hidden="true" /> : null}
      <div className="type-legible" style={{ position: "relative", zIndex: 10 }}>
        {children}
      </div>
    </article>
  );
}

export function GlassInset({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["glass-inset", className ?? ""].filter(Boolean).join(" ")}
      style={{ borderRadius: "1.15rem", padding: "0.65rem 1rem", ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function GlassPill({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={["glass-pill", className ?? ""].filter(Boolean).join(" ")}
      style={{
        borderRadius: 999,
        padding: "0.5rem 0.9rem",
        cursor: "pointer",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
