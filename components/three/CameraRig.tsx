"use client";

import { type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Pointer } from "@/lib/hooks/usePointerRef";

/**
 * Fixed camera path. One keyframe per section (hero → contact); scroll
 * progress interpolates between them with a smootherstep, then the camera
 * position is damped toward that target every frame. Pointer adds a small
 * parallax offset. Nothing linear, nothing snappy.
 */
const KEYFRAMES: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 6.0), // hero
  new THREE.Vector3(1.3, -0.25, 6.7), // projects
  new THREE.Vector3(-1.5, 0.35, 7.1), // skills
  new THREE.Vector3(1.1, 0.55, 7.5), // github
  new THREE.Vector3(-0.9, -0.45, 6.9), // research
  new THREE.Vector3(0.1, 0.15, 6.3), // contact
];

const target = new THREE.Vector3();

function smootherstep(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export default function CameraRig({
  progress,
  pointer,
}: {
  progress: MutableRefObject<number>;
  pointer: MutableRefObject<Pointer>;
}) {
  useFrame((state, delta) => {
    const prog = progress.current;
    const f = prog * (KEYFRAMES.length - 1);
    const i = Math.min(KEYFRAMES.length - 2, Math.floor(f));
    const t = smootherstep(f - i);

    target.lerpVectors(KEYFRAMES[i], KEYFRAMES[i + 1], t);

    const p = pointer.current;
    target.x += p.x * 0.22;
    target.y += -p.y * 0.18;

    const k = 1 - Math.exp(-3.5 * delta);
    state.camera.position.lerp(target, k);
    state.camera.lookAt(0, -prog * 0.5, 0);
  });

  return null;
}
