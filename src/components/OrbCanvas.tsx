"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function Orb({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#a78bfa"),
    roughness: 0.15,
    metalness: 0.2,
    transmission: 0.8,
    thickness: 0.6,
    emissive: new THREE.Color("#312e81"),
    emissiveIntensity: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  }), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const speed = reduced ? 0.05 : 0.15;
    meshRef.current.rotation.y += delta * speed;
    meshRef.current.rotation.x += delta * speed * 0.6;
  });

  return (
    <Float speed={reduced ? 0.5 : 1} rotationIntensity={reduced ? 0.2 : 0.6} floatIntensity={reduced ? 0.5 : 1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.6, 3]} />
        <primitive object={material} attach="material" />
      </mesh>
    </Float>
  );
}

export default function OrbCanvas() {
  const reduced = false;
  return (
    <div className="relative h-[520px] md:h-[600px] rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 bg-gradient-to-br from-indigo-100 via-rose-50 to-emerald-100 dark:from-indigo-900/30 dark:via-rose-900/20 dark:to-emerald-900/20">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <Suspense fallback={null}>
          <Orb reduced={reduced} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.25),transparent_35%)]" />
    </div>
  );
}


