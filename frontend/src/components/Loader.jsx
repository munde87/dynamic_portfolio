import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Loader({ onComplete, theme = 'dark' }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const isDark = theme === 'dark';

  const messages = [
    "CONNECTING TO THE WEB...",
    "INITIALIZING PORTFOLIO...",
    "LOCATING THE DEVELOPER...",
    "IDENTITY FOUND.",
    "READY."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 80);
          return 100;
        }
        const step = Math.floor(Math.random() * 25) + 20;
        const next = Math.min(prev + step, 100);

        if (next < 25) setMessageIndex(0);
        else if (next < 50) setMessageIndex(1);
        else if (next < 75) setMessageIndex(2);
        else if (next < 95) setMessageIndex(3);
        else setMessageIndex(4);

        return next;
      });
    }, 15);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden ${
        isDark ? 'bg-spider-night text-white' : 'bg-white text-spider-night'
      }`}
    >
      {/* Spider-Web Radial & Concentric Grid Background */}
      <div className={`absolute inset-0 pointer-events-none opacity-40 ${
        isDark ? 'bg-web-grid-dark' : 'bg-web-grid-light'
      }`} />
      
      {/* Halftone Comic Dots Overlay */}
      <div className="absolute inset-0 bg-halftone-dots opacity-25 pointer-events-none" />

      {/* Red & Blue Ambient Glow Spheres */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-spider-red/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-spider-blue/20 blur-[100px] pointer-events-none" />

      {/* Main Monogram Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        
        {/* Monogram Box with Spider-Red / Electric-Blue Border */}
        <div className="relative mb-8">
          <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 flex items-center justify-center relative overflow-hidden backdrop-blur-xl shadow-2xl ${
            isDark 
              ? 'border-spider-red bg-spider-night-card/90 shadow-spider-red' 
              : 'border-spider-blue bg-spider-day-card/90 shadow-spider-blue'
          }`}>
            {/* Animated Laser Scanning Line */}
            <div className={`absolute inset-x-0 top-0 h-[2px] animate-scanline ${
              isDark ? 'bg-spider-red shadow-[0_0_12px_#E62429]' : 'bg-spider-blue shadow-[0_0_12px_#2563EB]'
            }`} />

            <span className={`font-orbitron text-4xl sm:text-5xl font-black tracking-widest ${
              isDark ? 'text-white' : 'text-spider-night'
            }`}>
              SM
            </span>
          </div>

          {/* Web Corner Indicators */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-spider-red" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-spider-blue" />
        </div>

        {/* Developer Identification */}
        <p className="font-orbitron text-xs tracking-[0.3em] font-bold mb-2 uppercase text-spider-red">
          SHUBHAM MUNDE
        </p>

        {/* Status Message */}
        <div className="h-6 flex items-center justify-center mb-6">
          <motion.span
            key={messages[messageIndex]}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-mono text-xs tracking-wider uppercase font-semibold ${
              isDark ? 'text-spider-blue-electric' : 'text-spider-blue'
            }`}
          >
            {messages[messageIndex]}
          </motion.span>
        </div>

        {/* Progress Bar Container with Red-to-Blue Gradient */}
        <div className="w-full max-w-xs space-y-2">
          <div className={`w-full h-2 rounded-full overflow-hidden border ${
            isDark ? 'bg-spider-night-surface border-spider-red/30' : 'bg-spider-day-surface border-spider-blue/30'
          }`}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-spider-red via-spider-blue to-spider-red shadow-[0_0_15px_rgba(230,36,41,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Percentage & Protocol Code */}
          <div className="flex items-center justify-between font-mono text-[10px] opacity-75">
            <span className="text-spider-red font-semibold">WEB_PROTOCOL // SYNC</span>
            <span className="font-bold text-spider-blue-electric">{progress}%</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
