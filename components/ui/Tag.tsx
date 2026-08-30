import type { ReactNode } from "react";

export default function Tag({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "fg";
}) {
  return (
    <span
      className={`rounded-full border border-border px-2.5 py-1 font-mono text-[11px] ${
        tone === "fg" ? "text-fg" : "text-muted"
      }`}
    >
      {children}
    </span>
  );
}
