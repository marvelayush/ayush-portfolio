"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Lenis smooth scroll. No-ops entirely under prefers-reduced-motion so the
 * page uses the browser's native scrolling. Starts only after `load` + one
 * idle tick so its rAF loop never competes with first paint / hydration.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let lenis: Lenis | undefined;
    let frame = 0;
    let cancelled = false;

    const raf = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(raf);
    };

    const startLenis = () => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });
      frame = requestAnimationFrame(raf);
    };

    const schedule = () => {
      const ric = window.requestIdleCallback;
      if (typeof ric === "function") ric(startLenis, { timeout: 2000 });
      else window.setTimeout(startLenis, 300);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
