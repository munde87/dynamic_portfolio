import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Zap, Cpu, Activity, Shield } from 'lucide-react';
import { profileData } from '../../data/profile';
import { sound } from '../../utils/audio';

// CONFIGURABLE FINE-TUNED IMAGE ALIGNMENT MATRIX
// You can tweak these values anytime to adjust alignment
const ALIGNMENT = {
  realScale: 1.06,      // Scale factor of real photo underneath
  realOffsetY: '3.8%',  // Vertical shift to align real eyes/chin with helmet visor
  realOffsetX: '0%',    // Horizontal center alignment
  armorScale: 1.0,      // Scale factor of armored suit
  armorOffsetY: '0%',
  armorOffsetX: '0%',
};

export default function HeroSection({ onNavigate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hudData, setHudData] = useState({ x: 0, y: 0, status: 'SYSTEM SECURED // ARMOR ACTIVE' });

  const characterContainerRef = useRef(null);
  const realLayerRef = useRef(null);
  const armorLayerRef = useRef(null);
  const reticleRef = useRef(null);
  const animFrameRef = useRef(null);

  const currentRadiusRef = useRef(0);
  const targetRadiusRef = useRef(0);
  const targetPosRef = useRef({ x: -500, y: -500 });
  const currentPosRef = useRef({ x: -500, y: -500 });

  // 60FPS High-Performance RAF Animation Loop using Lerp for buttery smooth spotlight
  useEffect(() => {
    const updateMask = () => {
      // Lerp spotlight radius: 0px when outside, 140px when cursor is over character
      currentRadiusRef.current += (targetRadiusRef.current - currentRadiusRef.current) * 0.16;

      // Lerp cursor coordinates
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.28;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.28;

      const r = Math.max(0, currentRadiusRef.current);
      const x = currentPosRef.current.x;
      const y = currentPosRef.current.y;

      // 1. TOP ARMOR LAYER: Mask out a soft circular hole WHEREVER the cursor is
      if (armorLayerRef.current) {
        if (r > 1) {
          const armorMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0%, transparent 65%, rgba(0,0,0,1) 100%)`;
          armorLayerRef.current.style.maskImage = armorMask;
          armorLayerRef.current.style.webkitMaskImage = armorMask;
        } else {
          armorLayerRef.current.style.maskImage = 'none';
          armorLayerRef.current.style.webkitMaskImage = 'none';
        }
      }

      // 2. BOTTOM REAL PHOTO LAYER: Render ONLY inside the cursor spotlight!
      // This guarantees with 100% certainty that the real photo is COMPLETELY INVISIBLE by default!
      if (realLayerRef.current) {
        if (r > 1) {
          const realMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 65%, transparent 100%)`;
          realLayerRef.current.style.maskImage = realMask;
          realLayerRef.current.style.webkitMaskImage = realMask;
          realLayerRef.current.style.opacity = '1';
        } else {
          realLayerRef.current.style.maskImage = 'none';
          realLayerRef.current.style.webkitMaskImage = 'none';
          realLayerRef.current.style.opacity = '0';
        }
      }

      // 3. HUD TARGETING RETICLE
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        reticleRef.current.style.opacity = r > 10 ? '1' : '0';
      }

      animFrameRef.current = requestAnimationFrame(updateMask);
    };

    animFrameRef.current = requestAnimationFrame(updateMask);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Cursor interaction triggers
  const handleMouseMove = (e) => {
    if (!characterContainerRef.current) return;
    const rect = characterContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetPosRef.current = { x, y };
    targetRadiusRef.current = 145; // 145px reveal spotlight radius

    if (!isHovered) {
      setIsHovered(true);
      sound.playTargetLock();
      setHudData({
        x: Math.round(x),
        y: Math.round(y),
        status: 'IDENTITY SCANNING // BIOMETRIC OVERRIDE',
      });
    } else {
      setHudData((prev) => ({
        ...prev,
        x: Math.round(x),
        y: Math.round(y),
      }));
    }
  };

  const handleMouseEnter = () => {
    targetRadiusRef.current = 145;
    setIsHovered(true);
    sound.playHover();
  };

  const handleMouseLeave = () => {
    targetRadiusRef.current = 0;
    setIsHovered(false);
    setHudData({
      x: 0,
      y: 0,
      status: 'SYSTEM SECURED // ARMOR ACTIVE',
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-10 px-4 sm:px-6 lg:px-12 overflow-hidden select-none"
    >
      {/* 1. CINEMATIC HERO BACKGROUND IMAGE (Full Cover) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-20 filter brightness-90 contrast-105"
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      >
        {/* Dark Vignette Overlay for Depth & High-Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070B]/90 via-transparent to-[#05070B]/90" />
      </div>

      {/* Main Centered Content Container */}
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center text-center space-y-6 z-10">
        
        {/* Top Identity Readout */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-3 max-w-3xl"
        >
          {/* Status Capsule */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/80 border border-hud-cyan/40 text-xs font-mono text-hud-cyan backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hud-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-hud-cyan"></span>
            </span>
            <span className="tracking-widest uppercase font-semibold">NEURAL CORE // MK-85 ACTIVE</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 font-semibold">{profileData.callsign}</span>
          </div>

          {/* Headline */}
          <div className="space-y-1">
            <h1 className="font-orbitron font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-none">
              SHUBHAM{' '}
              <span className="bg-gradient-to-r from-hud-cyan via-white to-hud-crimson bg-clip-text text-transparent text-glow-cyan">
                MUNDE
              </span>
            </h1>
            <div className="text-xs sm:text-sm font-mono text-hud-cyan/90 tracking-widest uppercase pt-1 font-semibold">
              // FULL STACK ARCHITECT & CREATIVE 3D ENGINEER
            </div>
          </div>
        </motion.div>

        {/* 2. LARGE CINEMATIC CENTERPIECE (80-92% Viewport Height, ZERO BOXES/CARDS/BORDERS) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="relative w-full max-w-[650px] sm:max-w-[780px] lg:max-w-[880px] h-[55vh] sm:h-[68vh] lg:h-[76vh] flex items-center justify-center"
        >
          {/* Character Canvas Container */}
          <div
            ref={characterContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-full flex items-center justify-center cursor-crosshair"
            style={{
              // Seamless gradient blend at bottom into the environment
              maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            }}
          >
            {/* LAYER 1 (BOTTOM): Shubham's Real Photo (100% Hidden by default, revealed only via mask) */}
            <div
              ref={realLayerRef}
              className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center transition-opacity duration-150"
              style={{
                opacity: 0,
                transform: `scale(${ALIGNMENT.realScale}) translate3d(${ALIGNMENT.realOffsetX}, ${ALIGNMENT.realOffsetY}, 0)`,
                transformOrigin: 'top center',
              }}
            >
              <img
                src="/assets/shubham-real.png"
                alt="Shubham Munde Real Photo"
                className="h-full w-auto max-w-none object-contain object-top filter brightness-105 contrast-110"
              />
            </div>

            {/* LAYER 2 (TOP / DEFAULT): Large Armored Suit (100% Visible by default, clipped at cursor) */}
            <div
              ref={armorLayerRef}
              className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center"
              style={{
                transform: `scale(${ALIGNMENT.armorScale}) translate3d(${ALIGNMENT.armorOffsetX}, ${ALIGNMENT.armorOffsetY}, 0)`,
                transformOrigin: 'top center',
              }}
            >
              <img
                src="/assets/shubham-armor.png"
                alt="Shubham Munde Armored Suit"
                className="h-full w-auto max-w-none object-contain object-top filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
              />
            </div>

            {/* LAYER 3: Dynamic Glowing Cursor Spotlight & Reticle */}
            <div
              ref={reticleRef}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-opacity duration-150"
              style={{ opacity: 0 }}
            >
              {/* Glowing Scan Ring with Pulsing Core */}
              <div className="w-32 h-32 rounded-full border-2 border-hud-cyan/80 shadow-[0_0_25px_rgba(0,245,255,0.7)] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-hud-cyan animate-ping" />
              </div>

              {/* Dynamic HUD Coordinate Readout */}
              <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-hud-cyan/50 px-2 py-0.5 rounded text-[10px] font-mono text-hud-cyan shadow-lg">
                X:{hudData.x} Y:{hudData.y} // BIOMETRIC REVEAL
              </div>
            </div>

            {/* Subtle Chest Energy Core Radiance */}
            <div className="absolute top-[59%] left-[46.5%] w-14 h-14 rounded-full bg-hud-cyan/30 blur-xl animate-pulse pointer-events-none" />

          </div>
        </motion.div>

        {/* 3. Action CTAs & Telemetry Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center space-y-4 max-w-xl"
        >
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('projects');
              }}
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-hud-cyan to-hud-blue text-slate-950 font-orbitron font-bold text-xs tracking-wider uppercase overflow-hidden shadow-arc-cyan hover:brightness-110 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>EXPLORE LAB</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('contact');
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-black/70 hover:bg-slate-900 border border-hud-crimson/50 hover:border-hud-crimson text-slate-200 font-orbitron font-semibold text-xs tracking-wider uppercase transition-all active:scale-95 text-glow-crimson"
            >
              <Terminal className="w-4 h-4 text-hud-crimson" />
              <span>INITIATE COMMS</span>
            </button>
          </div>

          {/* Live Scan State Readout */}
          <div className="px-4 py-1.5 rounded-full bg-black/85 border border-hud-cyan/40 text-xs font-mono text-hud-cyan backdrop-blur-md flex items-center gap-2 shadow-lg">
            <Cpu className="w-3.5 h-3.5 text-hud-cyan animate-pulse" />
            <span className="font-semibold tracking-wider">{hudData.status}</span>
            <span className="text-slate-500">|</span>
            <span className="text-white font-bold">{isHovered ? 'REAL HUMAN EXPOSED' : 'ARMOR 100%'}</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
