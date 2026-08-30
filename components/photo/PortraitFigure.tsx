"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { usePointerLerp } from "@/lib/hooks/usePointerLerp";

const ENTRANCE_EASE = [0.16, 1, 0.3, 1] as const;
const CUTOUT_SRC = "/ayush_cutout.png";
const FALLBACK_SRC = "/ayush_photo.jpg";

/**
 * Hero centrepiece — a background-removed cutout rendered free-standing with
 * hard, crisp edges: no mask, no vignette, no rounded crop. A thin accent rim
 * light traces the real silhouette (chained drop-shadows on the alpha edge),
 * and a directional shadow grounds the figure. Behind it a slowly rotating
 * hard-edged partial ring sits smaller than the cutout, so the figure overlaps
 * and breaks its outline — that overlap is the depth cue. Scroll parallax +
 * fade and a damped pointer tilt remain; all motion drops for reduced-motion,
 * tilt/parallax drop on mobile. `object-contain`, never cropped — the head and
 * shoulders are free to break past the container.
 */
export default function PortraitFigure() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const interactive = !reduce && !isMobile;
  const [src, setSrc] = useState(CUTOUT_SRC);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the cutout 404s before hydration the `error` event never reaches React,
  // so also check the decoded size on mount and fall back to the original photo.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0 && src !== FALLBACK_SRC) {
      setSrc(FALLBACK_SRC);
    }
  }, [src]);

  const { scrollY } = useScroll();
  const parallaxEnd = 900;
  const yScroll = useTransform(
    scrollY,
    [0, parallaxEnd],
    interactive ? [0, -60] : [0, 0],
  );
  const opacityScroll = useTransform(
    scrollY,
    [0, parallaxEnd * 0.5, parallaxEnd * 0.95],
    interactive ? [1, 1, 0] : [1, 1, 1],
  );

  // Damped pointer -> small tilt. Never 1:1.
  const pointer = usePointerLerp(interactive);
  const rotateX = useTransform(pointer.y, [-1, 1], [5, -5]);
  const rotateY = useTransform(pointer.x, [-1, 1], [-5, 5]);

  return (
    <div className="relative isolate mx-auto w-[min(62vw,256px)] overflow-visible">
      <motion.div
        className="overflow-visible"
        style={{ y: yScroll, opacity: opacityScroll }}
      >
        {/* hard-edged backdrop hexagon — smaller than the figure, slow linear
            spin. A clean single outline (no dashed arcs) so it reads as one
            calm shape behind the cutout rather than competing with the
            circuit traces. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className="pcb-ring pointer-events-none absolute left-1/2 top-[40%] -z-10 aspect-square w-[52%]"
        >
          <polygon
            points="50,6 88,28 88,72 50,94 12,72 12,28"
            fill="none"
            stroke="#FF3B30"
            strokeOpacity="0.18"
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />
        </svg>

        {/* mount entrance — separate node so it does not fight the scroll y */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: ENTRANCE_EASE }}
        >
          {/* damped tilt — relative + z-10 so the cutout stacks above the ring */}
          <motion.div
            className="relative z-10 [transform-style:preserve-3d]"
            style={
              interactive
                ? { rotateX, rotateY, transformPerspective: 900 }
                : undefined
            }
          >
            {/* Plain <img>: keeps the PNG's alpha edge razor-sharp with no
                optimiser resampling. Falls back to the original photo until
                the cutout asset is added. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt={site.photo.alt}
              onError={() => {
                if (src !== FALLBACK_SRC) setSrc(FALLBACK_SRC);
              }}
              draggable={false}
              fetchPriority="high"
              decoding="async"
              className="pcb-cutout h-auto w-full select-none object-contain"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
