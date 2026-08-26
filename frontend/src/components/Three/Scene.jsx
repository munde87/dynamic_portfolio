import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Zap, Loader2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SpiderModel from './SpiderModel';
import { fadeUp, scaleReveal, staggerContainer, sectionViewport } from '../../utils/animations';

function ModelLoaderFallback({ isDark }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className={`p-4 rounded-2xl border flex items-center gap-3 backdrop-blur-md ${
        isDark ? 'bg-spider-night-card/80 border-spider-red/40 text-white' : 'bg-white/90 border-spider-blue/30 text-spider-night'
      }`}>
        <Loader2 className="w-5 h-5 text-spider-red animate-spin" />
        <span className="font-mono text-xs font-bold tracking-wider uppercase">
          SYNCHRONIZING 3D SPIDER-MAN...
        </span>
      </div>
    </div>
  );
}

export default function Scene({ theme = 'dark' }) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseRef.current = { x, y };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="reactor"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-28 sm:py-36 px-4 sm:px-8 overflow-hidden select-none border-y border-spider-red/20"
    >
      {/* Background Web Grid */}
      <div className={`absolute inset-0 pointer-events-none opacity-35 ${
        isDark ? 'bg-web-grid-dark' : 'bg-web-grid-light'
      }`} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={prefersReduced ? {} : staggerContainer}
        className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10"
      >
        
        {/* Left Editorial Text Column (5 cols) */}
        <motion.div variants={fadeUp} className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-spider-red/40 bg-spider-red/10 text-[10px] font-mono tracking-widest uppercase font-bold text-spider-red">
            <Zap className="w-3 h-3 animate-pulse text-spider-red" />
            3D WEB ENGINE
          </div>

          <div className="space-y-1 sm:space-y-2">
            <p className="font-orbitron font-bold text-xs sm:text-sm tracking-[0.3em] uppercase text-spider-blue-electric">
              POWERED BY
            </p>
            <h2 className="font-orbitron font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-tight">
              CURIOSITY.
            </h2>
            <h2 className="font-orbitron font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-tight text-stroke-red hover:text-spider-red">
              CODE.
            </h2>
            <h2 className="font-orbitron font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-tight text-stroke-blue hover:text-spider-blue">
              CREATIVITY.
            </h2>
          </div>

          <p className="font-sans text-sm leading-relaxed opacity-85 max-w-md">
            At the center of every dynamic application is an unrelenting drive to learn, build, and optimize. Engineered with React Three Fiber, WebGL, and custom 3D character interactivity.
          </p>

          {/* Telemetry metrics bar */}
          <div className={`p-4 rounded-2xl border font-mono text-xs space-y-2 ${
            isDark ? 'bg-spider-night-card border-spider-red/20 text-white' : 'bg-white border-spider-blue/20 text-spider-night'
          }`}>
            <div className="flex justify-between">
              <span className="opacity-60">CHARACTER ASSET:</span>
              <span className="font-bold text-spider-red">SPIDER-MAN 3D [GLB]</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">RENDER ENGINE:</span>
              <span className="font-bold text-spider-blue-electric">60.0 FPS [WEBGL 2.0]</span>
            </div>
          </div>
        </motion.div>

        {/* Right 3D Spider-Man Canvas Column (7 cols) */}
        <motion.div
          variants={prefersReduced ? {} : scaleReveal}
          className="lg:col-span-7 h-[420px] sm:h-[500px] md:h-[560px] w-full relative flex items-center justify-center"
        >
          
          {/* Ambient Glowing Aura */}
          <div className="absolute w-80 h-80 rounded-full bg-spider-red/20 blur-[100px] pointer-events-none" />
          <div className="absolute w-80 h-80 rounded-full bg-spider-blue/20 blur-[100px] pointer-events-none" />

          {isVisible && (
            <div className="relative w-full h-full" style={{ minHeight: '400px' }}>
              <Suspense fallback={<ModelLoaderFallback isDark={isDark} />}>
                <Canvas
                  camera={{ position: [0, 0.8, 8], fov: 35, near: 0.1, far: 100 }}
                  dpr={[1, 1.8]}
                  gl={{ 
                    antialias: true, 
                    alpha: true, 
                    powerPreference: 'high-performance',
                    preserveDrawingBuffer: false,
                  }}
                  style={{ width: '100%', height: '100%' }}
                  className="cursor-grab active:cursor-grabbing"
                  onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                    setModelLoading(false);
                  }}
                >
                  {/* Strong ambient to prevent dark/black model */}
                  <ambientLight intensity={isDark ? 1.2 : 1.5} />
                  
                  {/* Key light from top-right */}
                  <directionalLight position={[5, 8, 5]} intensity={2.5} color="#FFFFFF" />
                  
                  {/* Red accent fill light from left */}
                  <pointLight position={[-5, 2, 4]} intensity={2.5} color="#E62429" distance={20} />
                  
                  {/* Blue accent fill light from right */}
                  <pointLight position={[5, -2, 4]} intensity={2.5} color="#2563EB" distance={20} />
                  
                  {/* Back/rim light for separation from background */}
                  <pointLight position={[0, 4, -4]} intensity={2.0} color="#FFFFFF" distance={20} />
                  
                  {/* Front fill to eliminate dark faces */}
                  <pointLight position={[0, 0, 6]} intensity={1.0} color="#FFFFFF" distance={15} />
                  
                  {/* Hemisphere light for natural outdoor-like lighting */}
                  <hemisphereLight args={['#87CEEB', '#362a1a', 0.6]} />

                  <SpiderModel
                    mouse={mouseRef}
                    theme={theme}
                    scale={1.25}
                    position={[0, -0.2, 0]}
                    rotation={[0, -0.3, 0]}
                    enableFloat={true}
                  />
                </Canvas>
              </Suspense>
            </div>
          )}

          <motion.div 
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 right-4 font-mono text-[9px] text-spider-red font-bold backdrop-blur-md px-2.5 py-1 rounded-full border border-spider-red/30 bg-spider-red/10 shadow-lg"
          >
            [SYS_SPIDER_AVATAR // 01]
          </motion.div>
          <motion.div 
            animate={{ y: [3, -3, 3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-4 right-4 font-mono text-[9px] text-spider-blue-electric font-semibold backdrop-blur-md px-2.5 py-1 rounded-full border border-spider-blue/30 bg-spider-blue/10 shadow-lg"
          >
            INTERACTIVE CURSOR PARALLAX
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
}
