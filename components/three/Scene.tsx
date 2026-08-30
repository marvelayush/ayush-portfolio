"use client";

import { useScrollProgress } from "@/lib/hooks/useScrollProgress";
import { usePointerRef } from "@/lib/hooks/usePointerRef";
import CameraRig from "./CameraRig";
import DistortedIcosahedron from "./DistortedIcosahedron";
import ParticleField from "./ParticleField";

/** All materials here are self-lit (fresnel / basic), so the scene needs no lights. */
export default function Scene() {
  const progress = useScrollProgress();
  const pointer = usePointerRef();

  return (
    <>
      <CameraRig progress={progress} pointer={pointer} />
      <DistortedIcosahedron pointer={pointer} progress={progress} />
      <ParticleField pointer={pointer} />
    </>
  );
}
