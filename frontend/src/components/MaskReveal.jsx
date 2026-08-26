import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Crosshair, Eye } from 'lucide-react';

export default function MaskReveal({ theme = 'dark', heroImage, portraitImage }) {
  const containerRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // percentage
  const [isHovered, setIsHovered] = useState(false);
  const [scanRadius] = useState(135);
  const isDark = theme === 'dark';

  const maskImg = heroImage || '/assets/spider-mask.png';
  const realImg = portraitImage || '/assets/shubham-real.png';

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x: Math.max(0, Math.min(100, xPct)), y: Math.max(0, Math.min(100, yPct)) });
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorPos({ x: 50, y: 50 });
  };

  const handleTouch = () => {
    setIsHovered((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Outer Tactical Comic Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTouch}
        data-cursor-text="UNMASK"
        className={`relative w-72 h-88 sm:w-80 sm:h-[420px] md:w-96 md:h-[480px] rounded-3xl border-2 overflow-hidden cursor-crosshair transition-all duration-500 shadow-2xl group ${
          isDark
            ? 'border-spider-red/40 bg-spider-night-card shadow-spider-red'
            : 'border-spider-blue/30 bg-slate-50 shadow-card-light'
        }`}
      >
        {/* Base Layer (Layer 1 - Spider-Man Mask/Suit Image) */}
        <div className={`absolute inset-0 z-10 flex items-center justify-center overflow-hidden ${
          isDark ? 'bg-spider-night-card' : 'bg-slate-50'
        }`}>
          {/* Ambient Glows */}
          <div className="absolute w-56 h-56 rounded-full bg-spider-red/20 blur-[60px] pointer-events-none" />
          <div className="absolute w-56 h-56 rounded-full bg-spider-blue/20 blur-[60px] pointer-events-none" />

          <img
            src={maskImg}
            alt="Spider Superhero Character"
            className="w-full h-full object-cover object-top filter contrast-110 saturate-105"
          />

          {/* Web Overlay Pattern on Suit Container */}
          <div className="absolute inset-0 bg-halftone-dots opacity-15 pointer-events-none" />
        </div>

        {/* Top Layer (Layer 2 - Real Face Portrait, Strictly Revealed Only Under Cursor Spotlight) */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center overflow-hidden transition-opacity duration-300 pointer-events-none ${
            isDark ? 'bg-spider-night' : 'bg-slate-100'
          }`}
          style={{
            opacity: isHovered ? 1 : 0,
            maskImage: isHovered
              ? `radial-gradient(circle ${scanRadius}px at ${cursorPos.x}% ${cursorPos.y}%, black 0%, black 75%, transparent 100%)`
              : 'radial-gradient(circle 0px at 50% 50%, transparent 0%, transparent 100%)',
            WebkitMaskImage: isHovered
              ? `radial-gradient(circle ${scanRadius}px at ${cursorPos.x}% ${cursorPos.y}%, black 0%, black 75%, transparent 100%)`
              : 'radial-gradient(circle 0px at 50% 50%, transparent 0%, transparent 100%)',
          }}
        >
          <img
            src={realImg}
            onError={(e) => {
              e.target.src = '/assets/shubham-real.jpg';
            }}
            alt="Shubham Munde - Real Face"
            className="w-full h-full object-cover object-top filter contrast-110 saturate-105"
          />

          {/* Biometric Web Grid on Portrait */}
          <div className={`absolute inset-0 pointer-events-none ${
            isDark ? 'bg-web-grid-dark opacity-35' : 'bg-web-grid-light opacity-25'
          }`} />
          
          {/* Target Reticle Overlay on Portrait */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-spider-red/50 rounded-full pointer-events-none flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-spider-red animate-ping opacity-90" />
            <span className="absolute -bottom-5 font-mono text-[8px] text-spider-red tracking-widest font-bold bg-black/60 px-1.5 py-0.5 rounded">
              IDENTITY_VERIFIED: 100%
            </span>
          </div>
        </div>

        {/* Interactive Holographic Web Reticle following Cursor */}
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
            <div className="w-full h-full rounded-full border-2 border-spider-red/80 shadow-[0_0_30px_rgba(230,36,41,0.6)] animate-spin-slow flex items-center justify-center">
              <Crosshair className="w-6 h-6 text-spider-red animate-pulse" />
            </div>

            {/* Glowing Laser Cross Lines */}
            <div className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-spider-red shadow-[0_0_12px_#E62429]" />
            <div className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-spider-blue shadow-[0_0_12px_#2563EB]" />
          </div>
        )}

        {/* Ambient Corner Web Brackets */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-spider-red pointer-events-none z-30" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-spider-blue pointer-events-none z-30" />
        <div className="absolute bottom-10 left-3 w-4 h-4 border-b-2 border-l-2 border-spider-blue pointer-events-none z-30" />
        <div className="absolute bottom-10 right-3 w-4 h-4 border-b-2 border-r-2 border-spider-red pointer-events-none z-30" />

        {/* Telemetry Bar at bottom of card */}
        <div className={`absolute bottom-0 inset-x-0 z-30 px-4 py-2 flex items-center justify-between font-mono text-[9px] backdrop-blur-md border-t ${
          isDark ? 'bg-spider-night/95 border-spider-red/20 text-white' : 'bg-white/95 border-spider-blue/20 text-spider-night font-bold shadow-md'
        }`}>
          <span className="text-spider-red font-extrabold">SUIT // WEB_V5</span>
          <span className="flex items-center gap-1 font-extrabold">
            <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-spider-red animate-ping' : 'bg-spider-blue'}`} />
            {isHovered ? 'UNMASK_ACTIVE' : 'HERO_MASKED'}
          </span>
        </div>
      </div>

      {/* Interactive Status Text Below Visual */}
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1 }}
        className="mt-4 flex items-center gap-2 font-mono text-xs tracking-widest font-bold uppercase"
      >
        {isHovered ? (
          <span className="flex items-center gap-1.5 text-spider-red">
            <CheckCircle2 className="w-3.5 h-3.5" />
            MASK OFF. CODE ON. // IDENTITY UNMASKED
          </span>
        ) : (
          <span className={`flex items-center gap-1.5 font-extrabold ${isDark ? 'text-spider-blue-electric' : 'text-spider-blue'}`}>
            <Eye className="w-3.5 h-3.5 animate-pulse text-spider-red" />
            MOVE CURSOR TO REVEAL IDENTITY
          </span>
        )}
      </motion.div>
    </div>
  );
}
