"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "./useIsMobile";
import { useReducedMotion } from "./useReducedMotion";

/**
 * The WebGL canvas mounts only when ALL hold:
 *  - component is mounted on the client
 *  - a WebGL context is actually obtainable
 *  - not a mobile / coarse-pointer device
 *  - the user has not asked for reduced motion
 * Otherwise the site runs on the Phase 2 DOM hero — fully usable with zero WebGL.
 */
export function useCanvasEnabled(): boolean {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported && !isMobile && !reduced;
}
