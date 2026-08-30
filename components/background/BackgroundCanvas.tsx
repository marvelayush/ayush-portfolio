"use client";

import { useEffect, useState } from "react";
import GlobalLayer from "./GlobalLayer";

/**
 * The single persistent interactive-background layer, mounted once in the root
 * layout. Fixed, behind everything, inert to pointer + AT.
 *
 * Holds only the always-on global layer: a cursor-following accent glow, a
 * faint far wireframe, pointer parallax and scroll drift. All motion is driven
 * by the shared engine's single rAF loop and stops when the tab is hidden or
 * under prefers-reduced-motion.
 */
export default function BackgroundCanvas() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      // layout+paint+style containment (not `size` — a fixed inset-0 box is
      // already size-independent of its contents, and `contain:size` there can
      // collapse to 0 in some engines).
      style={{ contain: "layout paint style" }}
    >
      {mounted ? <GlobalLayer /> : null}
    </div>
  );
}
