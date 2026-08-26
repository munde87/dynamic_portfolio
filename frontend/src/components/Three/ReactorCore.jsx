import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function ReactorCore({ mouse, theme = 'dark' }) {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const coreRef = useRef();

  const isDark = theme === 'dark';

  // Generate orbital particles around core in Red & Blue colors
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 200; i++) {
      const radius = THREE.MathUtils.randFloat(2.0, 4.8);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Mouse parallax
    const targetX = mouse.current.x * 0.45;
    const targetY = mouse.current.y * 0.45;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);

    // Multi-axis orbital rotations for Red and Blue rings
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.45;
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 0.35;
      ring2Ref.current.rotation.y += delta * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.4;
      ring3Ref.current.rotation.z -= delta * 0.25;
    }

    // Gentle pulsing core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.1;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.9}>
        
        {/* Central Web Energy Core - Glowing Octahedron */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.95, 0]} />
          <meshStandardMaterial
            color="#E62429"
            emissive="#E62429"
            emissiveIntensity={isDark ? 2.0 : 1.2}
            wireframe={true}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Inner Solid Electric Blue Diamond */}
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#2563EB"
            emissive="#2563EB"
            emissiveIntensity={isDark ? 1.5 : 0.8}
            roughness={0.2}
            metalness={1}
          />
        </mesh>

        {/* Ring 1: Hero Red Orbital Torus */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.9, 0.035, 16, 80]} />
          <meshStandardMaterial
            color="#E62429"
            emissive="#E62429"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Ring 2: Electric Blue Tilted Torus */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3.5, 0, 0]}>
          <torusGeometry args={[2.5, 0.04, 16, 80]} />
          <meshStandardMaterial
            color="#2563EB"
            emissive="#2563EB"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.9}
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* Ring 3: Outer Web Wireframe Orbit */}
        <mesh ref={ring3Ref} rotation={[-Math.PI / 4, Math.PI / 5, 0]}>
          <torusGeometry args={[3.1, 0.02, 16, 80]} />
          <meshStandardMaterial
            color="#FFFFFF"
            wireframe
            roughness={0.4}
            metalness={0.7}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Orbiting Particles */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.length / 3}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.04}
            color="#E62429"
            transparent
            opacity={0.7}
            sizeAttenuation
          />
        </points>
      </Float>
    </group>
  );
}
