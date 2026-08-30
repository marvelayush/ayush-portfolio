"use client";

/**
 * One shared animation engine for the interactive background layer.
 *
 * A single requestAnimationFrame loop drives every subscriber. It owns:
 *   - eased/lerped pointer follow (throttled to one read per frame)
 *   - scroll position + document progress
 *   - idle detection (pointer still > 2s) with an autonomous orbit fallback
 *   - environment flags (reduced-motion / coarse-pointer / mobile)
 *
 * The loop only runs while the tab is visible, something is subscribed, and
 * reduced-motion is off. Touch devices never get pointer-reactive motion —
 * only scroll-driven drift.
 */

export type FrameContext = {
  /** ms since previous frame, capped at 50 */
  dt: number;
  /** ms since the loop first started */
  t: number;
  scrollY: number;
  /** 0..1 through the document */
  scrollProgress: number;
  /** eased pointer offset from viewport centre, roughly -1..1 (0,0 on touch) */
  pointerN: { x: number; y: number };
  /** eased pointer position in viewport px */
  pointerPx: { x: number; y: number };
  /** pointer has been still for > 2s */
  idle: boolean;
  idleT: number;
  reduced: boolean;
  touch: boolean;
  mobile: boolean;
};

export type FrameSub = (ctx: FrameContext) => void;

const FOLLOW = 0.08;
const MOBILE_MAX = 768;

class BackgroundEngine {
  private subs = new Set<FrameSub>();
  private raf = 0;
  private running = false;
  private bound = false;
  private lastT = 0;
  private startT = 0;

  private tgtX = 0.5;
  private tgtY = 0.5;
  private curX = 0.5;
  private curY = 0.5;
  private evX = 0.5;
  private evY = 0.5;
  private pendingPointer = false;
  private lastMoveT = -1e9;

  env = { reduced: false, touch: false, mobile: false };

  private ctx: FrameContext = {
    dt: 16.7,
    t: 0,
    scrollY: 0,
    scrollProgress: 0,
    pointerN: { x: 0, y: 0 },
    pointerPx: { x: 0, y: 0 },
    idle: true,
    idleT: 1e9,
    reduced: false,
    touch: false,
    mobile: false,
  };

  private init() {
    if (this.bound || typeof window === "undefined") return;
    this.bound = true;

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    this.env.reduced = mqReduce.matches;
    this.env.touch = mqCoarse.matches;
    this.env.mobile = window.innerWidth < MOBILE_MAX;

    mqReduce.addEventListener("change", (e) => {
      this.env.reduced = e.matches;
      this.sync();
    });

    if (!this.env.touch) {
      window.addEventListener("pointermove", this.onPointer, { passive: true });
    }
    document.addEventListener("visibilitychange", this.sync);
    window.addEventListener(
      "resize",
      () => {
        this.env.mobile = window.innerWidth < MOBILE_MAX;
      },
      { passive: true },
    );
  }

  private onPointer = (e: PointerEvent) => {
    // throttled: stash now, consume once per frame
    this.evX = e.clientX / window.innerWidth;
    this.evY = e.clientY / window.innerHeight;
    this.pendingPointer = true;
    this.lastMoveT = performance.now();
    this.sync();
  };

  subscribe(fn: FrameSub): () => void {
    this.init();
    this.subs.add(fn);
    this.sync();
    return () => {
      this.subs.delete(fn);
      this.sync();
    };
  }

  private shouldRun() {
    return (
      !this.env.reduced &&
      typeof document !== "undefined" &&
      !document.hidden &&
      this.subs.size > 0
    );
  }

  private sync = () => {
    if (this.shouldRun()) {
      if (!this.running) {
        this.running = true;
        this.lastT = performance.now();
        if (!this.startT) this.startT = this.lastT;
        this.raf = requestAnimationFrame(this.tick);
      }
    } else if (this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  };

  /** One-off context for a static first paint / reduced-motion render. */
  snapshot(): FrameContext {
    const c = this.ctx;
    if (typeof window !== "undefined") {
      const de = document.documentElement;
      const max = de.scrollHeight - de.clientHeight;
      c.scrollY = window.scrollY;
      c.scrollProgress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      c.pointerPx.x = window.innerWidth / 2;
      c.pointerPx.y = window.innerHeight / 2;
    }
    c.dt = 16.7;
    c.pointerN.x = 0;
    c.pointerN.y = 0;
    c.idle = true;
    c.idleT = 1e9;
    c.reduced = this.env.reduced;
    c.touch = this.env.touch;
    c.mobile = this.env.mobile;
    return c;
  }

  private tick = (now: number) => {
    if (!this.shouldRun()) {
      this.running = false;
      return;
    }
    const dt = Math.min(50, now - this.lastT || 16.7);
    this.lastT = now;

    if (this.pendingPointer) {
      this.tgtX = this.evX;
      this.tgtY = this.evY;
      this.pendingPointer = false;
    }

    // frame-rate independent ease toward the target
    const k = 1 - Math.pow(1 - FOLLOW, dt / 16.667);
    this.curX += (this.tgtX - this.curX) * k;
    this.curY += (this.tgtY - this.curY) * k;

    let nx = (this.curX - 0.5) * 2;
    let ny = (this.curY - 0.5) * 2;

    const idleT = now - this.lastMoveT;
    const idle = idleT > 2000;
    // autonomous orbit once the pointer has been still a while (never on touch)
    if (idle && !this.env.touch) {
      const ramp = Math.min(1, (idleT - 2000) / 1600);
      const a = (idleT - 2000) * 0.00035;
      nx = nx * (1 - ramp) + Math.cos(a) * 0.55 * ramp;
      ny = ny * (1 - ramp) + Math.sin(a * 0.8) * 0.4 * ramp;
    }

    const de = document.documentElement;
    const max = de.scrollHeight - de.clientHeight;
    const sy = window.scrollY;

    const c = this.ctx;
    c.dt = dt;
    c.t = now - this.startT;
    c.scrollY = sy;
    c.scrollProgress = max > 0 ? Math.min(1, Math.max(0, sy / max)) : 0;
    c.pointerN.x = this.env.touch ? 0 : nx;
    c.pointerN.y = this.env.touch ? 0 : ny;
    c.pointerPx.x = this.curX * window.innerWidth;
    c.pointerPx.y = this.curY * window.innerHeight;
    c.idle = idle;
    c.idleT = idleT;
    c.reduced = this.env.reduced;
    c.touch = this.env.touch;
    c.mobile = this.env.mobile;

    for (const fn of this.subs) fn(c);
    this.raf = requestAnimationFrame(this.tick);
  };
}

export const backgroundEngine = new BackgroundEngine();
