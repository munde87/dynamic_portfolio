import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, ShieldAlert, CheckCircle, Crosshair } from 'lucide-react';

export default function ArmorReveal({ theme = 'dark' }) {
  const containerRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // percentage
  const [isHovered, setIsHovered] = useState(false);
  const [scanRadius, setScanRadius] = useState(130);
  const isDark = theme === 'dark';

  // Smooth mouse tracker over container
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorPos({ x: 50, y: 50 });
  };

  // Mobile / Touch tap toggle
  const handleTouch = () => {
    setIsHovered((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Outer Tactical Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTouch}
        data-cursor-text="SCAN"
        className={`relative w-72 h-88 sm:w-80 sm:h-[420px] md:w-96 md:h-[480px] rounded-3xl border overflow-hidden cursor-crosshair transition-all duration-500 shadow-2xl group ${
          isDark
            ? 'border-white/20 bg-mono-950 shadow-[0_0_50px_rgba(0,0,0,0.8)]'
            : 'border-black/15 bg-mono-50 shadow-[0_15px_45px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* Layer 2 (Bottom): Real Developer Portrait */}
        <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-mono-900">
          <img
            src="/assets/shubham-real.png"
            onError={(e) => {
              // fallback if png differs
              e.target.src = '/assets/shubham-real.jpg';
            }}
            alt="Shubham Munde - Portrait"
            className="w-full h-full object-cover object-top filter grayscale contrast-110"
          />

          {/* Biometric Analysis Grid Lines on Portrait */}
          <div className="absolute inset-0 bg-tech-grid-dark opacity-30 pointer-events-none" />
          
          {/* Target Reticle Overlay on Portrait */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/20 rounded-full pointer-events-none flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
            <span className="absolute -bottom-5 font-mono text-[8px] text-white/70 tracking-widest">
              BIO_MATCH: 100%
            </span>
          </div>
        </div>

        {/* Layer 1 (Top): Futuristic Powered Armor with Dynamic Radial Mask */}
        <div
          className="absolute inset-0 z-20 transition-all duration-150 ease-out flex items-center justify-center overflow-hidden"
          style={{
            maskImage: isHovered
              ? `radial-gradient(circle ${scanRadius}px at ${cursorPos.x}% ${cursorPos.y}%, transparent 0%, transparent 80%, black 100%)`
              : 'radial-gradient(circle 0px at 50% 50%, transparent 0%, black 100%)',
            WebkitMaskImage: isHovered
              ? `radial-gradient(circle ${scanRadius}px at ${cursorPos.x}% ${cursorPos.y}%, transparent 0%, transparent 80%, black 100%)`
              : 'radial-gradient(circle 0px at 50% 50%, transparent 0%, black 100%)',
          }}
        >
          {/* Armor Image (Original Futuristic Powered Plating) */}
          <img
            src="/assets/shubham-armor.png"
            onError={(e) => {
              e.target.src = '/assets/hero-bg.jpg';
            }}
            alt="Powered Armor Exosuit"
            className="w-full h-full object-cover object-top filter grayscale contrast-125"
          />

          {/* Armor Plating Mechanical Wireframe Grid */}
          <div className={`absolute inset-0 pointer-events-none opacity-40 ${
            isDark ? 'bg-tech-grid-dark' : 'bg-tech-grid-light'
          }`} />

          {/* Central Reactor Core Mechanism Indicator on Armor */}
          <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full border border-dashed flex items-center justify-center animate-spin-slow ${
              isDark ? 'border-white/60 bg-white/5' : 'border-black/60 bg-black/5'
            }`}>
              <div className={`w-4 h-4 rounded-full ${isDark ? 'bg-white shadow-glow-white' : 'bg-black shadow-glow-dark'}`} />
            </div>
            <span className="font-mono text-[8px] tracking-widest mt-1 opacity-70">
              CORE_ONLINE
            </span>
          </div>
        </div>

        {/* Interactive Holographic Scanning Ring following Cursor */}
        {isHovered && (
          <div
            className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: `${cursorPos.x}%`,
              top: `${cursorPos.y}%`,
              width: `${scanRadius * 2}px`,
              height: `${scanRadius * 2}px`,
            }}
          >
            {/* Pulsing Target Ring */}
            <div className={`w-full h-full rounded-full border border-dashed animate-spin-slow flex items-center justify-center ${
              isDark ? 'border-white/80 shadow-[0_0_25px_rgba(255,255,255,0.3)]' : 'border-black/80 shadow-[0_0_25px_rgba(0,0,0,0.2)]'
            }`}>
              <Crosshair className={`w-6 h-6 animate-pulse ${isDark ? 'text-white' : 'text-black'}`} />
            </div>

            {/* Scanning Laser Beam */}
            <div className={`absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 ${
              isDark ? 'bg-white shadow-[0_0_10px_#ffffff]' : 'bg-black shadow-[0_0_10px_#000000]'
            }`} />
          </div>
        )}

        {/* Ambient HUD Corner Brackets */}
        <div className={`absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 pointer-events-none ${isDark ? 'border-white/60' : 'border-black/50'}`} />
        <div className={`absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 pointer-events-none ${isDark ? 'border-white/60' : 'border-black/50'}`} />
        <div className={`absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 pointer-events-none ${isDark ? 'border-white/60' : 'border-black/50'}`} />
        <div className={`absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 pointer-events-none ${isDark ? 'border-white/60' : 'border-black/50'}`} />

        {/* Real-time Telemetry Bar at bottom of card */}
        <div className={`absolute bottom-0 inset-x-0 z-30 px-4 py-2 flex items-center justify-between font-mono text-[9px] backdrop-blur-md border-t ${
          isDark ? 'bg-mono-950/80 border-white/10 text-white' : 'bg-white/80 border-black/10 text-black'
        }`}>
          <span>MK-VII // EXOSUIT</span>
          <span className="flex items-center gap-1 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-emerald-400 animate-ping' : 'bg-mono-400'}`} />
            {isHovered ? 'SCAN_ACTIVE' : 'ARMORED'}
          </span>
        </div>
      </div>

      {/* Interactive Status Indicator below Visual */}
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1 }}
        className="mt-4 flex items-center gap-2 font-mono text-xs tracking-widest font-semibold uppercase"
      >
        {isHovered ? (
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-black'}`}>
            <CheckCircle className="w-3.5 h-3.5" />
            IDENTITY VERIFIED // ARMOR OVERRIDE ACTIVE
          </span>
        ) : (
          <span className="flex items-center gap-1.5 opacity-60">
            <Scan className="w-3.5 h-3.5 animate-pulse" />
            HOVER TO REVEAL PORTRAIT
          </span>
        )}
      </motion.div>
    </div>
  );
}
