"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * Document scroll progress as a 0..1 ref, updated on scroll/resize.
 * A ref (not state) so the R3F frame loop can read it without re-rendering.
 * Works with Lenis because Lenis drives native window scroll.
 */
export function useScrollProgress(): MutableRefObject<number> {
  const ref = useRef(0);

  useEffect(() => {
    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      ref.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return ref;
}
