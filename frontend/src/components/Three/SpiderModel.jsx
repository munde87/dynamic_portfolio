import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/spiderman.glb';

export default function SpiderModel({
  mouse,
  theme = 'dark',
  scale = 1.8,
  position = [0, -1.8, 0],
  rotation = [0, 0, 0],
  enableFloat = true,
}) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(MODEL_PATH);
  
  // Clone scene for independent rendering without scene graph conflicts
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Optimize materials and enable high quality rendering
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = false;
        if (child.material) {
          child.material = child.material.clone();
          child.material.side = THREE.DoubleSide;
          child.material.needsUpdate = true;
          if (child.material.map) {
            child.material.map.anisotropy = 4;
          }
        }
      }
    });
    return clone;
  }, [scene]);

  const { actions, names } = useAnimations(animations, groupRef);

  // Play embedded animation if available
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

  // Frame update: Smooth cursor/touch tracking & organic procedural idle motion
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Pointer tracking with smooth lerp damping (works for mouse and touch)
    const mouseX = mouse?.current?.x ?? 0;
    const mouseY = mouse?.current?.y ?? 0;

    // Interactive rotation range (~35 degrees horizontal, 15 degrees vertical)
    const targetRotY = rotation[1] + mouseX * 0.7;
    const targetRotX = rotation[0] - mouseY * 0.3;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.08
    );

    // Procedural breathing / organic idle if no embedded skeleton animation
    if (!names || names.length === 0) {
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.012;
      groupRef.current.scale.set(scale * breathe, scale * breathe, scale * breathe);
    }
  });

  const content = <primitive object={clonedScene} />;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {enableFloat ? (
        <Float
          speed={1.4}
          rotationIntensity={0.12}
          floatIntensity={0.25}
          floatingRange={[-0.06, 0.06]}
        >
          {content}
        </Float>
      ) : (
        content
      )}
    </group>
  );
}

// Preload the 3D model asset for instantaneous rendering
useGLTF.preload(MODEL_PATH);
