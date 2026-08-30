"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

type PointerLerp = {
  /** Pointer X relative to viewport centre, normalised to roughly [-1, 1]. */
  x: MotionValue<number>;
  /** Pointer Y relative to viewport centre, normalised to roughly [-1, 1]. */
  y: MotionValue<number>;
};

/**
 * Damped, spring-smoothed pointer position. Never tracks 1:1 — the spring
 * config is deliberately soft. When `enabled` is false the values stay at 0.
 */
export function usePointerLerp(enabled = true): PointerLerp {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 90, damping: 22, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!enabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}
