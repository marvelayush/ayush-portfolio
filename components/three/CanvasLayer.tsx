"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCanvasEnabled } from "@/lib/hooks/useCanvasEnabled";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

/**
 * Decides whether the WebGL layer runs at all, and positions it as a fixed,
 * non-interactive backdrop behind every section.
 *
 * The canvas is purely decorative, so its ~0.5 MB of three / R3F / post-
 * processing must never compete with first paint or hydration: we wait for
 * `requestIdleCallback` (with a timeout fallback) before importing it. This
 * keeps Total Blocking Time and Time-to-Interactive off the critical path
 * while LCP is already the text + portrait.
 */
export default function CanvasLayer() {
  const enabled = useCanvasEnabled();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const cic = window.cancelIdleCallback;

    const start = () => {
      if (!cancelled) setReady(true);
    };

    const schedule = () => {
      const ric = window.requestIdleCallback;
      if (typeof ric === "function") idleId = ric(start, { timeout: 2500 });
      else timeoutId = window.setTimeout(start, 800);
    };

    // Never before the page has loaded — the decorative canvas must not be on
    // the critical path.
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) cic?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [enabled]);

  if (!enabled || !ready) return null;

  return (
    <div
      aria-hidden
      className="canvas-fade-in pointer-events-none fixed inset-0 z-0"
    >
      <HeroCanvas />
    </div>
  );
}
