import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeIn, sectionViewport } from '../utils/animations';

export default function TechMarquee({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const row1 = [
    { text: "HTML", color: "red" },
    { text: "CSS", color: "blue" },
    { text: "JAVASCRIPT", color: "red" },
    { text: "REACT.JS", color: "blue" },
    { text: "NODE.JS", color: "red" },
    { text: "EXPRESS.JS", color: "blue" }
  ];

  const row2 = [
    { text: "JWT", color: "blue" },
    { text: "MONGODB", color: "red" },
    { text: "C", color: "blue" },
    { text: "JAVA", color: "red" },
    { text: "VS CODE", color: "blue" },
    { text: "GIT", color: "red" }
  ];

  const row3 = [
    { text: "GITHUB", color: "red" },
    { text: "CANVA", color: "blue" },
    { text: "ANTIGRAVITY", color: "red" },
    { text: "REACT NATIVE", color: "blue" },
    { text: "EXPO", color: "red" }
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={prefersReduced ? {} : fadeIn}
      className="relative py-12 sm:py-16 overflow-hidden select-none border-y border-spider-red/20 bg-spider-night-surface/30"
    >
      {/* Background Gradients to Fade Edges */}
      <div className={`absolute left-0 inset-y-0 w-24 sm:w-48 z-10 pointer-events-none ${
        isDark
          ? 'bg-gradient-to-r from-spider-night to-transparent'
          : 'bg-gradient-to-r from-white to-transparent'
      }`} />
      
      <div className={`absolute right-0 inset-y-0 w-24 sm:w-48 z-10 pointer-events-none ${
        isDark
          ? 'bg-gradient-to-l from-spider-night to-transparent'
          : 'bg-gradient-to-l from-white to-transparent'
      }`} />

      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Row 1: Scrolling Left */}
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="flex gap-8 sm:gap-14 animate-marquee-left shrink-0">
            {[...row1, ...row1, ...row1].map((item, idx) => (
              <div
                key={`r1-${idx}`}
                data-cursor-text="TECH"
                className={`font-orbitron font-black text-4xl sm:text-6xl md:text-7xl tracking-wider cursor-default uppercase transition-transform duration-300 hover:scale-105 ${
                  item.color === 'red' ? 'text-stroke-red' : 'text-stroke-blue'
                }`}
              >
                {item.text} <span className="opacity-30 ml-8 sm:ml-14 text-spider-red">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="flex gap-8 sm:gap-14 animate-marquee-right shrink-0">
            {[...row2, ...row2, ...row2].map((item, idx) => (
              <div
                key={`r2-${idx}`}
                data-cursor-text="TECH"
                className={`font-orbitron font-black text-4xl sm:text-6xl md:text-7xl tracking-wider cursor-default uppercase transition-transform duration-300 hover:scale-105 ${
                  item.color === 'red' ? 'text-stroke-red' : 'text-stroke-blue'
                }`}
              >
                {item.text} <span className="opacity-30 ml-8 sm:ml-14 text-spider-blue">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Scrolling Left (Smooth / Slow) */}
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="flex gap-8 sm:gap-14 animate-marquee-left shrink-0 opacity-80" style={{ animationDuration: '45s' }}>
            {[...row3, ...row3, ...row3].map((item, idx) => (
              <div
                key={`r3-${idx}`}
                data-cursor-text="TECH"
                className={`font-orbitron font-black text-3xl sm:text-5xl md:text-6xl tracking-wider cursor-default uppercase transition-transform duration-300 hover:scale-105 ${
                  item.color === 'red' ? 'text-stroke-red' : 'text-stroke-blue'
                }`}
              >
                {item.text} <span className="opacity-30 ml-8 sm:ml-14 text-spider-red">•</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  );
}
