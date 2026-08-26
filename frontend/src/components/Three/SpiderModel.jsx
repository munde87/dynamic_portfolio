import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/spiderman.glb';

export default function SpiderModel({
  theme = 'dark',
  scale = 1.25,
  position = [0, -0.2, 0],
  rotation = [0, -0.3, 0],
  enableFloat = true,
}) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(MODEL_PATH);

  // Single memoized scene clone for optimal GPU memory reuse
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;
      }
    });
    return clone;
  }, [scene]);

  const { actions, names } = useAnimations(animations, groupRef);

  // Play embedded skeleton animation if available
  useEffect(() => {
    if (names && names.length > 0 && actions) {
      const idleNames = ['idle', 'stand', 'Idle', 'Stand', 'T-Pose', 'default'];
      let bestAction = null;
      
      for (const name of idleNames) {
        if (actions[name]) {
          bestAction = actions[name];
          break;
        }
      }
      
      if (!bestAction) {
        bestAction = actions[names[0]];
      }
      
      if (bestAction) {
        bestAction.reset().fadeIn(0.5).play();
        bestAction.setLoop(THREE.LoopRepeat, Infinity);
      }
      return () => {
        if (bestAction) bestAction.fadeOut(0.5);
      };
    }
  }, [actions, names]);

  // Lightweight procedural breathing (no heavy matrix matrix conflicts)
  useFrame((state) => {
    if (!groupRef.current) return;
    if (!names || names.length === 0) {
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.008;
      groupRef.current.scale.set(scale * breathe, scale * breathe, scale * breathe);
    }
  });

  const content = <primitive object={clonedScene} />;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {enableFloat ? (
        <Float
          speed={1.2}
          rotationIntensity={0.08}
          floatIntensity={0.18}
          floatingRange={[-0.04, 0.04]}
        >
          {content}
        </Float>
      ) : (
        content
      )}
    </group>
  );
}

// Preload 3D asset for zero-lag rendering
useGLTF.preload(MODEL_PATH);
