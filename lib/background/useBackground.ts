"use client";

import { useEffect, useRef, useState } from "react";
import { backgroundEngine, type FrameSub } from "./engine";

/**
 * Subscribe a per-frame callback to the shared background loop. The callback is
 * also invoked once on mount (a static first paint) so motifs lay out correctly
 * even when the loop never runs — e.g. under prefers-reduced-motion.
 */
export function useBackgroundFrame(cb: FrameSub) {
  const ref = useRef(cb);
  ref.current = cb;

  useEffect(() => {
    const unsub = backgroundEngine.subscribe((c) => ref.current(c));
    const id = requestAnimationFrame(() => ref.current(backgroundEngine.snapshot()));
    return () => {
      cancelAnimationFrame(id);
      unsub();
    };
  }, []);
}

type Env = { reduced: boolean; touch: boolean; mobile: boolean };

function readEnv(): Env {
  if (typeof window === "undefined") {
    return { reduced: false, touch: false, mobile: false };
  }
  return {
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    touch: window.matchMedia("(pointer: coarse)").matches,
    mobile: window.innerWidth < 768,
  };
}

/** Environment flags, kept current across media-query + resize changes. */
export function useBackgroundEnv(): Env {
  const [env, setEnv] = useState<Env>(readEnv);

  useEffect(() => {
    const update = () => setEnv(readEnv());
    update();
    const mqs = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
    ];
    mqs.forEach((m) => m.addEventListener("change", update));
    window.addEventListener("resize", update, { passive: true });
    return () => {
      mqs.forEach((m) => m.removeEventListener("change", update));
      window.removeEventListener("resize", update);
    };
  }, []);

  return env;
}
