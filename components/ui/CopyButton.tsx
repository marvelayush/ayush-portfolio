"use client";

import { useState } from "react";

export default function CopyButton({
  value,
  idleLabel = "Copy address",
  doneLabel = "Copied",
}: {
  value: string;
  idleLabel?: string;
  doneLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the mailto link is the fallback */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-border px-4 py-2.5 text-sm text-fg transition-colors duration-200 ease-smooth hover:border-fg/40"
    >
      <span aria-live="polite">{copied ? `${doneLabel} ✓` : idleLabel}</span>
    </button>
  );
}
