"use client";

import { useEffect, useState } from "react";

/**
 * Plain `prefers-reduced-motion` hook (no framer-motion dependency).
 * Returns `false` on the server and first client render, then corrects.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
