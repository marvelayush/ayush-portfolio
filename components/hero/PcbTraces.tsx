"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * PCB / circuit-trace field behind the hero cutout — motherboard / hacking-
 * minigame style.
 *
 * The cutout photo's bounding box is measured at runtime (its layout box
 * within the hero section, transform-independent) and re-measured on resize.
 * Every trace starts flush on a hero edge and is routed inward with only
 * H / V / 45° segments; the route is truncated at the box boundary during
 * generation (never masked after the fact) and a trace whose route would
 * enter the box, or can't land cleanly on it, is discarded and re-rolled from
 * a fresh edge point. Each terminus gets a bright solder pad sitting exactly
 * on the boundary. Data pulses travel edge → figure and fade out at the pad.
 *
 * The <svg> viewBox aspect tracks the measured container, so `xMidYMid slice`
 * neither crops nor shears. Layering (svg z-0, cutout z-20, text z-30) keeps
 * every trace behind the figure, the name and the buttons.
 */

const VBW = 1000;
const SEED = 0x51ed270b;
const MAX_REROLLS = 6;

type Pt = { x: number; y: number };
type Trace = { d: string; len: number; dur: number; delay: number };
type Via = { x: number; y: number; r: number };
type Box = { x: number; y: number; hw: number; hh: number };
type Bucket = "mobile" | "tablet" | "desktop";

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

/** point strictly inside the box, shrunk by margin `m`. */
function inBox(p: Pt, b: Box, m: number) {
  return (
    p.x > b.x - b.hw + m &&
    p.x < b.x + b.hw - m &&
    p.y > b.y - b.hh + m &&
    p.y < b.y + b.hh - m
  );
}

/** does segment a–b pass into the box interior (sampled)? */
function segEntersBox(a: Pt, b: Pt, box: Box, m = 1) {
  const n = Math.max(6, Math.ceil(dist(a, b) / 8));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    if (inBox({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, box, m)) {
      return true;
    }
  }
  return false;
}

/** is `p` sitting on the box perimeter (within tol)? */
function onBox(p: Pt, b: Box, tol = 1.5) {
  const onV =
    (Math.abs(p.x - (b.x - b.hw)) < tol || Math.abs(p.x - (b.x + b.hw)) < tol) &&
    p.y >= b.y - b.hh - tol &&
    p.y <= b.y + b.hh + tol;
  const onH =
    (Math.abs(p.y - (b.y - b.hh)) < tol || Math.abs(p.y - (b.y + b.hh)) < tol) &&
    p.x >= b.x - b.hw - tol &&
    p.x <= b.x + b.hw + tol;
  return onV || onH;
}

function polyline(pts: Pt[], dur: number, delay: number): Trace {
  const q = (n: number) => Math.round(n * 10) / 10;
  const clean: Pt[] = [];
  for (const p of pts) {
    const last = clean[clean.length - 1];
    if (!last || Math.abs(last.x - p.x) > 0.4 || Math.abs(last.y - p.y) > 0.4) {
      clean.push(p);
    }
  }
  let len = 0;
  for (let i = 1; i < clean.length; i++) len += dist(clean[i], clean[i - 1]);
  const d = clean
    .map((p, i) => `${i === 0 ? "M" : "L"}${q(p.x)} ${q(p.y)}`)
    .join(" ");
  return { d, len: Math.round(len), dur, delay };
}

/** Final leg from interior point `p` onto box-edge point `T` (outward normal `n`). */
function approachBox(p: Pt, T: Pt, n: Pt, box: Box): Pt[] | null {
  const L = Math.max(28, Math.min(box.hw, box.hh) * 0.35);
  const q = { x: T.x + n.x * L, y: T.y + n.y * L };

  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const sx = Math.sign(dx) || 1;
  const sy = Math.sign(dy) || 1;
  const a = Math.min(Math.abs(dx), Math.abs(dy));
  const candidates: Pt[][] = [
    [{ x: p.x + sx * a, y: p.y + sy * a }, q],
    Math.abs(dx) >= Math.abs(dy)
      ? [{ x: p.x + sx * (Math.abs(dx) - Math.abs(dy)), y: p.y }, q]
      : [{ x: p.x, y: p.y + sy * (Math.abs(dy) - Math.abs(dx)) }, q],
    [{ x: q.x, y: p.y }, q],
    [{ x: p.x, y: q.y }, q],
  ];

  for (const mid of candidates) {
    const chain = [p, ...mid, T];
    let ok = true;
    for (let i = 1; i < chain.length - 1; i++) {
      if (segEntersBox(chain[i - 1], chain[i], box, 0.5)) {
        ok = false;
        break;
      }
    }
    if (ok) {
      return [...mid, T].filter(
        (pt, i, arr) => i === 0 || dist(pt, arr[i - 1]) > 1,
      );
    }
  }
  return null;
}

/** Route one trace from a fresh edge start; null if it can't land cleanly. */
function routeOne(
  rnd: () => number,
  box: Box,
  vbh: number,
): { pts: Pt[]; T: Pt } | null {
  const edges = ["top", "right", "bottom", "left"] as const;
  const edge = edges[Math.floor(rnd() * 4)];
  const f = 0.05 + rnd() * 0.9;
  const start: Pt =
    edge === "top"
      ? { x: f * VBW, y: 0 }
      : edge === "bottom"
        ? { x: f * VBW, y: vbh }
        : edge === "left"
          ? { x: 0, y: f * vbh }
          : { x: VBW, y: f * vbh };

  let T: Pt;
  let n: Pt;
  if (rnd() < 0.8) {
    const left = start.x <= box.x;
    T = {
      x: left ? box.x - box.hw : box.x + box.hw,
      y: box.y - box.hh + (0.18 + rnd() * 0.7) * 2 * box.hh,
    };
    n = { x: left ? -1 : 1, y: 0 };
  } else {
    const top = start.y <= box.y;
    T = {
      x: box.x - box.hw + (0.15 + rnd() * 0.7) * 2 * box.hw,
      y: top ? box.y - box.hh : box.y + box.hh,
    };
    n = { x: 0, y: top ? -1 : 1 };
  }

  let p = start;
  const pts: Pt[] = [p];
  const turns = 3 + Math.floor(rnd() * 4);
  let lastDir: Pt | null = null;

  for (let s = 0; s < turns; s++) {
    const dx = T.x - p.x;
    const dy = T.y - p.y;
    if (Math.hypot(dx, dy) < 90) break;

    const sx = Math.sign(dx) || 1;
    const sy = Math.sign(dy) || 1;
    const cand: Pt[] = [
      { x: sx, y: 0 },
      { x: 0, y: sy },
      { x: sx, y: sy },
    ];
    let choices = cand.filter(
      (d) => !lastDir || d.x !== lastDir.x || d.y !== lastDir.y,
    );
    if (!choices.length) choices = cand;
    const dir = choices[Math.floor(rnd() * choices.length)];

    const step = 40 + rnd() * 175;
    const next = { x: p.x + dir.x * step, y: p.y + dir.y * step };
    if (segEntersBox(p, next, box, -22)) break;

    pts.push(next);
    p = next;
    lastDir = dir;
  }

  const tail = approachBox(p, T, n, box);
  if (!tail) return null;
  pts.push(...tail);

  // hard validation: no segment may enter the box, and the last point must
  // sit on the boundary
  for (let i = 1; i < pts.length - 1; i++) {
    if (segEntersBox(pts[i - 1], pts[i], box, 0.5)) return null;
  }
  const end = pts[pts.length - 1];
  if (!onBox(end, box)) return null;

  return { pts, T: end };
}

function buildPcb(count: number, box: Box, vbh: number) {
  const rnd = mulberry32(SEED);
  const traces: Trace[] = [];
  const vias: Via[] = [];
  const pads: Pt[] = [];
  const cc = { x: box.x, y: box.y };

  for (let i = 0; i < count; i++) {
    let built: { pts: Pt[]; T: Pt } | null = null;
    for (let attempt = 0; attempt < MAX_REROLLS && !built; attempt++) {
      built = routeOne(rnd, box, vbh);
    }
    if (!built) continue; // discard rather than render a partial trace

    const { pts } = built;
    // vias on a couple of interior corners
    for (let k = 1; k < pts.length - 2; k++) {
      if (rnd() < 0.28) {
        vias.push({ x: pts[k].x, y: pts[k].y, r: 1.5 + rnd() * 1.9 });
      }
    }

    pads.push(pts[pts.length - 1]);
    traces.push(polyline(pts, 3 + rnd() * 5, -rnd() * 8));

    // dead-end stub pointing away from the figure
    if (pts.length > 3 && rnd() < 0.4) {
      const corner = pts[1 + Math.floor(rnd() * (pts.length - 3))];
      const ang =
        Math.round(
          Math.atan2(corner.y - cc.y, corner.x - cc.x) / (Math.PI / 4),
        ) *
        (Math.PI / 4);
      const u = { x: Math.round(Math.cos(ang)), y: Math.round(Math.sin(ang)) };
      const sl = 16 + rnd() * 30;
      const s1 = { x: corner.x + u.x * sl, y: corner.y + u.y * sl };
      if (!segEntersBox(corner, s1, box, 0.5)) {
        traces.push(polyline([corner, s1], 3 + rnd() * 5, -rnd() * 8));
        vias.push({ x: s1.x, y: s1.y, r: 1.4 + rnd() * 1.6 });
      }
    }
  }

  return { traces, vias, pads };
}

// Fallback box (fraction of viewBox) used only until the photo is measured.
const CFG: Record<
  Bucket,
  { count: number; cxf: number; cyf: number; hwf: number; hhf: number }
> = {
  mobile: { count: 8, cxf: 0.5, cyf: 0.36, hwf: 0.34, hhf: 0.24 },
  tablet: { count: 16, cxf: 0.17, cyf: 0.5, hwf: 0.16, hhf: 0.34 },
  desktop: { count: 24, cxf: 0.147, cyf: 0.5, hwf: 0.105, hhf: 0.36 },
};

function useBucket(): Bucket {
  const [b, setB] = useState<Bucket>("desktop");
  useEffect(() => {
    const tablet = window.matchMedia("(min-width: 768px)");
    const desktop = window.matchMedia("(min-width: 1280px)");
    const update = () =>
      setB(desktop.matches ? "desktop" : tablet.matches ? "tablet" : "mobile");
    update();
    tablet.addEventListener("change", update);
    desktop.addEventListener("change", update);
    return () => {
      tablet.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, []);
  return b;
}

/** layout box of `el` within `ancestor`, transform-independent. */
function layoutBoxWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor && node.offsetParent) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

export default function PcbTraces({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const bucket = useBucket();
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [photoBox, setPhotoBox] = useState<Box | null>(null);

  useEffect(() => {
    const node = svgRef.current;
    if (!node) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setSize({ w: rect.width, h: rect.height });

      const section = node.closest("section") as HTMLElement | null;
      const img = document.querySelector<HTMLElement>(".pcb-cutout");
      if (section && img && img.offsetWidth > 0) {
        const lb = layoutBoxWithin(img, section);
        const scale = VBW / rect.width;
        // Terminate exactly on the photo's edge — pads sit right on the
        // boundary. The backdrop hexagon is now small enough (52% of the
        // figure) that edge-terminating traces never reach it.
        setPhotoBox({
          x: (lb.x + lb.w / 2) * scale,
          y: (lb.y + lb.h / 2) * scale,
          hw: (lb.w / 2) * scale,
          hh: (lb.h / 2) * scale,
        });
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    const img = document.querySelector<HTMLElement>(".pcb-cutout");
    if (img) ro.observe(img);
    window.addEventListener("resize", measure);
    // catch the fallback-image swap in PortraitFigure
    const t = window.setTimeout(measure, 400);
    const t2 = window.setTimeout(measure, 1200);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);

  const vbh = size
    ? Math.max(360, Math.min(2600, Math.round((VBW * size.h) / size.w / 8) * 8))
    : 620;

  const { count, cxf, cyf, hwf, hhf } = CFG[bucket];
  const box: Box = photoBox ?? {
    x: cxf * VBW,
    y: cyf * vbh,
    hw: hwf * VBW,
    hh: hhf * vbh,
  };

  const { traces, vias, pads } = useMemo(
    () => buildPcb(count, box, vbh),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, box.x, box.y, box.hw, box.hh, vbh],
  );

  const rampR = Math.hypot(
    Math.max(box.x, VBW - box.x),
    Math.max(box.y, vbh - box.y),
  );

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={className}
      viewBox={`0 0 ${VBW} ${vbh}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <radialGradient
          id="pcb-ramp"
          gradientUnits="userSpaceOnUse"
          cx={box.x}
          cy={box.y}
          r={rampR}
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.1" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.09" />
        </radialGradient>
        <mask
          id="pcb-ramp-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={VBW}
          height={vbh}
        >
          <rect x="0" y="0" width={VBW} height={vbh} fill="url(#pcb-ramp)" />
        </mask>
        <filter
          id="pcb-glow"
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {size && (
        <>
          <g
            mask="url(#pcb-ramp-mask)"
            fill="none"
            stroke="#FF3B30"
            strokeWidth={1.2}
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            {traces.map((t, i) => (
              <path key={`s${i}`} d={t.d} />
            ))}
          </g>

          <g mask="url(#pcb-ramp-mask)">
            {vias.map((v, i) => (
              <g key={`v${i}`}>
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={v.r}
                  fill="#FF3B30"
                  fillOpacity={0.5}
                />
                <circle cx={v.x} cy={v.y} r={v.r * 0.42} fill="#0a0607" />
              </g>
            ))}
          </g>

          {/* solder pads on the boundary — brightest + glow */}
          <g filter="url(#pcb-glow)">
            {pads.map((p, i) => (
              <g key={`p${i}`}>
                <circle cx={p.x} cy={p.y} r={3.4} fill="#FF5A5A" />
                <circle cx={p.x} cy={p.y} r={1.3} fill="#0a0607" />
              </g>
            ))}
          </g>

          {/* data pulses — travel edge → figure, fade out at the pad */}
          {!reduced && (
            <g
              filter="url(#pcb-glow)"
              fill="none"
              stroke="#FF5A5A"
              strokeWidth={1.7}
              strokeLinecap="round"
            >
              {traces.map((t, i) => (
                <path
                  key={`d${i}`}
                  d={t.d}
                  className="pcb-pulse"
                  strokeDasharray={`7 ${t.len}`}
                  style={
                    {
                      "--pcb-len": `${t.len + 7}`,
                      animationDuration: `${t.dur.toFixed(2)}s`,
                      animationDelay: `${t.delay.toFixed(2)}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </g>
          )}
        </>
      )}
    </svg>
  );
}
