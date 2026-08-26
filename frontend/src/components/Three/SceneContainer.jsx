import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Original Floating Energy Core & Orbital Geometry
function FloatingEnergyCore({ mouse }) {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth subtle camera/mouse parallax
    const targetX = mouse.current.x * 0.35;
    const targetY = mouse.current.y * 0.35;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.04);

    // Continuous orbital rotations
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.35;
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 0.25;
      ring2Ref.current.rotation.y += delta * 0.2;
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.1;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef} position={[3.2, 0.5, -3]}>
      {/* Central Pulsing Energy Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={2.5}
          wireframe={true}
        />
      </mesh>

      {/* Outer Holographic Energy Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.2, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={1.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.6, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#FF2A4D"
          emissive="#FF2A4D"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Point light casting subtle volumetric radiance */}
      <pointLight color="#00F5FF" intensity={2.5} distance={8} />
      <pointLight color="#FF2A4D" intensity={1.8} distance={6} position={[0, 0, 1]} />
    </group>
  );
}

// 3D Floating Mechanical Drone & Orbiting Technical Nodes
function FloatingMechanicalElements({ mouse }) {
  const droneGroupRef = useRef();

  useFrame((state, delta) => {
    if (!droneGroupRef.current) return;
    droneGroupRef.current.rotation.y += delta * 0.2;
    droneGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.2 - 1.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={droneGroupRef} position={[-3.5, -1, -2.5]}>
        {/* Futuristic Mechanical Sensor / Drone Body */}
        <mesh>
          <icosahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial
            color="#1E293B"
            emissive="#00F5FF"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.9}
            wireframe={true}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.7, 0.015, 16, 48]} />
          <meshStandardMaterial color="#00F5FF" emissive="#00F5FF" emissiveIntensity={1.8} />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Atmospheric Depth Particle Grid
function DeepSpaceParticles({ count = 280, mouse }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color('#00F5FF');
    const crimson = new THREE.Color('#FF2A4D');
    const gold = new THREE.Color('#FFB800');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;

      const r = Math.random();
      const choice = r > 0.5 ? cyan : (r > 0.25 ? crimson : gold);
      col[i * 3] = choice.r;
      col[i * 3 + 1] = choice.g;
      col[i * 3 + 2] = choice.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.01;

    // React smoothly to mouse movement
    pointsRef.current.position.x = THREE.MathUtils.lerp(
      pointsRef.current.position.x,
      mouse.current.x * 0.5,
      0.025
    );
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      mouse.current.y * 0.5,
      0.025
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Global 3D Canvas
export default function SceneContainer() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" />
        <FloatingEnergyCore mouse={mouse} />
        <FloatingMechanicalElements mouse={mouse} />
        <DeepSpaceParticles mouse={mouse} />
      </Canvas>
    </div>
  );
}
