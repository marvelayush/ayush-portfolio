"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Pointer } from "@/lib/hooks/usePointerRef";

const COUNT = 700;

/** Soft round sprite drawn on a canvas — points render as discs, not squares. */
function makeSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function ParticleField({
  pointer,
}: {
  pointer: MutableRefObject<Pointer>;
}) {
  const group = useRef<THREE.Group>(null);
  const sprite = useMemo(makeSprite, []);
  useEffect(() => () => sprite.dispose(), [sprite]);

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 3.5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.014;
    g.rotation.x += delta * 0.004;

    const p = pointer.current;
    const k = 1 - Math.exp(-1.8 * delta);
    g.position.x += (p.x * 0.28 - g.position.x) * k;
    g.position.y += (-p.y * 0.2 - g.position.y) * k;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={sprite}
          size={0.055}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          color="#ffb0b6"
        />
      </points>
    </group>
  );
}
