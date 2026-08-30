"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

/**
 * Bloom only. Chromatic aberration was pulled — at the DPR / render-target
 * sizes this scene runs at it cost more than it was worth and fringed the
 * particle sprites. Bloom alone gives the rim of the icosahedron its lift.
 *
 * Only ever mounted on desktop (the canvas does not mount on mobile /
 * reduced-motion) and dropped entirely when PerformanceMonitor declines.
 */
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={0.32}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.25}
        radius={0.55}
      />
    </EffectComposer>
  );
}
