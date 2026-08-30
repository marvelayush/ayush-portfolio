"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import Scene from "./Scene";
import Effects from "./Effects";

/**
 * The fixed, page-wide WebGL layer. Lazy-loaded via next/dynamic (ssr: false)
 * and only rendered when useCanvasEnabled() is true.
 *
 * DPR is capped hard (<= 1.25) and PerformanceMonitor scales it further to
 * load, dropping post-processing entirely on a sustained decline.
 */
export default function HeroCanvas() {
  const [dpr, setDpr] = useState(0.9);
  const [effectsOn, setEffectsOn] = useState(true);

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 6], fov: 42 }}
    >
      <PerformanceMonitor
        flipflops={3}
        factor={1}
        onChange={({ factor }) =>
          setDpr(Math.round((0.7 + 0.55 * factor) * 100) / 100)
        }
        onDecline={() => {
          setEffectsOn(false);
          setDpr(0.75);
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        {effectsOn ? <Effects /> : null}
      </PerformanceMonitor>
    </Canvas>
  );
}
