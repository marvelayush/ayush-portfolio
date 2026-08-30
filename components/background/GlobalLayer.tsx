"use client";

import { useRef } from "react";
import {
  useBackgroundFrame,
  useBackgroundEnv,
} from "@/lib/background/useBackground";

/**
 * Always-on part of the interactive background: a single cursor-following
 * proximity glow (screen-blended accent red) that eases toward the pointer and
 * dims slightly when idle. Transform / opacity only. Hidden on touch and under
 * prefers-reduced-motion.
 */
export default function GlobalLayer() {
  const env = useBackgroundEnv();
  const glowRef = useRef<HTMLDivElement>(null);

  useBackgroundFrame((c) => {
    const glow = glowRef.current;
    if (!glow) return;
    glow.style.transform = `translate3d(${(c.pointerPx.x - 200).toFixed(1)}px, ${(
      c.pointerPx.y - 200
    ).toFixed(1)}px, 0)`;
    glow.style.opacity = c.idle ? "0.7" : "1";
  });

  if (env.touch || env.reduced) return null;

  return (
    <div
      ref={glowRef}
      className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full will-change-transform"
      style={{
        mixBlendMode: "screen",
        background:
          "radial-gradient(circle, rgba(255,59,48,0.12), rgba(255,59,48,0) 70%)",
      }}
    />
  );
}
