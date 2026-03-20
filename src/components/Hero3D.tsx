import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

function OrbCluster() {
  const groupRef = useRef<THREE.Group>(null);
  const spheres = useMemo(
    () => [
      { position: [-2.4, 1.2, -0.3], scale: 1.1, color: '#38bdf8' },
      { position: [0.6, -1.2, 0.4], scale: 1.45, color: '#8b5cf6' },
      { position: [2.3, 0.9, -0.5], scale: 0.95, color: '#f97316' },
      { position: [-0.4, 1.9, -1.2], scale: 0.7, color: '#14b8a6' },
    ],
    []
  );

  useFrame(({ clock, mouse }) => {
    if (!groupRef.current) return;

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.18, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.24, 0.05);
    groupRef.current.position.y = Math.sin(elapsed * 0.6) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, index) => (
        <Float key={sphere.color} speed={2 + index * 0.3} rotationIntensity={0.8} floatIntensity={1.2}>
          <Sphere args={[1, 96, 96]} position={sphere.position as [number, number, number]} scale={sphere.scale}>
            <MeshDistortMaterial
              color={sphere.color}
              emissive={sphere.color}
              emissiveIntensity={0.35}
              distort={0.32 + index * 0.05}
              speed={2.2 + index * 0.15}
              roughness={0.16}
              metalness={0.2}
              transparent
              opacity={0.86}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-[2rem] lg:rounded-[3rem]">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 48 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 8, 18]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 6, 4]} intensity={1.4} color="#c4b5fd" />
        <pointLight position={[-4, 2, 3]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[4, -1, 2]} intensity={1.3} color="#fb923c" />
        <Suspense fallback={null}>
          <Stars radius={80} depth={32} count={1800} factor={3.2} saturation={0} fade speed={0.8} />
          <OrbCluster />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};
