"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";
import type { Pointer } from "@/lib/hooks/usePointerRef";

export default function DistortedIcosahedron({
  pointer,
  progress,
}: {
  pointer: MutableRefObject<Pointer>;
  progress: MutableRefObject<number>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const spin = useRef(0);
  const damp = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDistort: { value: 0.22 },
      uFreq: { value: 0.8 },
      uColorA: { value: new THREE.Color("#0c0405") },
      uColorB: { value: new THREE.Color("#ff3245") },
    }),
    [],
  );

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    spin.current += delta * 0.05;

    // Damped lerp toward the pointer — never snappy.
    const p = pointer.current;
    const k = 1 - Math.exp(-2.5 * delta);
    damp.current.x += (p.y * 0.2 - damp.current.x) * k;
    damp.current.y += (p.x * 0.3 - damp.current.y) * k;

    const m = mesh.current;
    if (!m) return;
    m.rotation.set(
      damp.current.x + Math.sin(state.clock.elapsedTime * 0.2) * 0.05,
      spin.current + damp.current.y,
      0,
    );

    // A quiet dark form pushed up and far back, out of the hero's centre —
    // the portrait now has its own coral blob (CSS), so this is only a faint
    // backdrop near the top edge. Drifts further up-left and shrinks away as
    // the reader leaves the hero, so it never sits behind the Projects text.
    const prog = progress.current;
    m.position.set(-5.5 - prog * 3.0, 3.4 + prog * 1.5, -3.8 - prog * 2);
    m.scale.setScalar(Math.max(0.1, 0.4 - prog * 0.7));
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 10]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
