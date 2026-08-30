"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

export type Pointer = { x: number; y: number };

/**
 * Raw pointer position relative to viewport centre, in [-1, 1], as a ref.
 * Consumers damp it themselves in the frame loop — this never smooths.
 */
export function usePointerRef(): MutableRefObject<Pointer> {
  const ref = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return ref;
}
