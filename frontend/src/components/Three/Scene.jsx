import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
  const [isMobile, setIsMobile] = useState(false);
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  // Detect mobile screen sizes for responsive 3D model scaling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global window pointer & touch tracking so model rotates on desktop cursor and mobile touch drag
  useEffect(() => {
    const handlePointerMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        mouseRef.current = { x, y };
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
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
      className="relative py-20 sm:py-32 px-4 sm:px-8 overflow-hidden select-none border-y border-spider-red/20"
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
        className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10"
      >
        
        {/* Left Editorial Text Column (5 cols) */}
        <motion.div variants={fadeUp} className="lg:col-span-5 space-y-5 sm:space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-spider-red/40 bg-spider-red/10 text-[10px] font-mono tracking-widest uppercase font-bold text-spider-red">
            <Zap className="w-3 h-3 animate-pulse text-spider-red" />
            3D WEB ENGINE
          </div>

          <div className="space-y-1 sm:space-y-2">
            <p className="font-orbitron font-bold text-xs sm:text-sm tracking-[0.3em] uppercase text-spider-blue-electric">
              POWERED BY
            </p>
            <h2 className="font-orbitron font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-none">
              CURIOSITY.
            </h2>
            <h2 className="font-orbitron font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-none text-stroke-red hover:text-spider-red">
              CODE.
            </h2>
            <h2 className="font-orbitron font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-none text-stroke-blue hover:text-spider-blue">
              CREATIVITY.
            </h2>
          </div>

          <p className="font-sans text-xs sm:text-sm leading-relaxed opacity-85 max-w-md">
            At the center of every dynamic application is an unrelenting drive to learn, build, and optimize. Engineered with React Three Fiber, WebGL, and custom 3D character interactivity.
          </p>

          {/* Telemetry metrics bar */}
          <div className={`p-4 rounded-2xl border font-mono text-[11px] sm:text-xs space-y-2 ${
            isDark ? 'bg-spider-night-card border-spider-red/20 text-white' : 'bg-white border-spider-blue/20 text-spider-night'
          }`}>
            <div className="flex justify-between">
              <span className="opacity-60">CHARACTER ASSET:</span>
              <span className="font-bold text-spider-red">SPIDER-MAN 3D [GLB]</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">INTERACTION:</span>
              <span className="font-bold text-spider-blue-electric">TOUCH & DRAG ROTATION</span>
            </div>
          </div>
        </motion.div>

        {/* Right 3D Spider-Man Canvas Column (7 cols) */}
        <motion.div
          variants={prefersReduced ? {} : scaleReveal}
          className="lg:col-span-7 h-[360px] sm:h-[480px] md:h-[540px] w-full relative flex items-center justify-center"
        >
          
          {/* Ambient Glowing Aura */}
          <div className="absolute w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-spider-red/20 blur-[100px] pointer-events-none" />
          <div className="absolute w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-spider-blue/20 blur-[100px] pointer-events-none" />

          {isVisible && (
            <div className="relative w-full h-full touch-pan-y" style={{ minHeight: '340px' }}>
              <Suspense fallback={<ModelLoaderFallback isDark={isDark} />}>
                <Canvas
                  camera={{ position: [0, 0.8, isMobile ? 9.5 : 8], fov: 35, near: 0.1, far: 100 }}
                  dpr={[1, 1.8]}
                  gl={{ 
                    antialias: true, 
                    alpha: true, 
                    powerPreference: 'high-performance',
                    preserveDrawingBuffer: false,
                  }}
                  style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    rotateSpeed={0.8}
                    maxPolarAngle={Math.PI / 1.7}
                    minPolarAngle={Math.PI / 3.2}
                  />

                  {/* Ambient & directional lighting */}
                  <ambientLight intensity={isDark ? 1.3 : 1.6} />
                  <directionalLight position={[5, 8, 5]} intensity={2.5} color="#FFFFFF" />
                  <pointLight position={[-5, 2, 4]} intensity={2.5} color="#E62429" distance={20} />
                  <pointLight position={[5, -2, 4]} intensity={2.5} color="#2563EB" distance={20} />
                  <pointLight position={[0, 4, -4]} intensity={2.0} color="#FFFFFF" distance={20} />
                  <pointLight position={[0, 0, 6]} intensity={1.0} color="#FFFFFF" distance={15} />
                  <hemisphereLight args={['#87CEEB', '#362a1a', 0.6]} />

                  <SpiderModel
                    mouse={mouseRef}
                    theme={theme}
                    scale={isMobile ? 1.05 : 1.25}
                    position={[0, isMobile ? -0.3 : -0.2, 0]}
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
            className="absolute top-2 sm:top-4 right-2 sm:right-4 font-mono text-[9px] text-spider-red font-bold backdrop-blur-md px-2.5 py-1 rounded-full border border-spider-red/30 bg-spider-red/10 shadow-lg"
          >
            [SYS_SPIDER_AVATAR // 01]
          </motion.div>
          <motion.div 
            animate={{ y: [3, -3, 3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 font-mono text-[9px] text-spider-blue-electric font-semibold backdrop-blur-md px-2.5 py-1 rounded-full border border-spider-blue/30 bg-spider-blue/10 shadow-lg"
          >
            SWIPE / DRAG TO ROTATE 360°
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
}
