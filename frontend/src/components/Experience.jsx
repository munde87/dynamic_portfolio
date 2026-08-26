import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { eventExperienceData } from '../data/experience';
import { fadeUp, staggerContainer, sectionViewport, ease } from '../utils/animations';

export default function Experience({ theme = 'dark', experienceData }) {
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();
  const containerRef = useRef(null);

  // Raw items from props (backend data) or fallback
  const rawItems = (experienceData && experienceData.length > 0) ? experienceData : eventExperienceData;

  // Extract clean valid image list
  const galleryImages = rawItems
    .map((item, index) => {
      const src = item.image || item.imageUrl;
      if (!src) return null;
      return {
        id: item.id || item._id || `img-${index}`,
        src: src.startsWith('http') ? src : src,
      };
    })
    .filter(Boolean);

  // If list is shorter than 6, loop to create a rich immersive collage
  const displayItems = galleryImages.length >= 4 
    ? galleryImages 
    : [...galleryImages, ...galleryImages, ...galleryImages].slice(0, 6);

  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Mouse Coordinates for Smooth Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth non-jerky parallax response
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current || prefersReduced) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredIdx(null);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % displayItems.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, displayItems.length]);

  // Asymmetric Collage Layout Configuration (Spans & Heights)
  const layoutConfigs = [
    { colSpan: "col-span-12 md:col-span-7", height: "h-72 sm:h-96", depth: 0.6, border: "border-spider-red/30" },
    { colSpan: "col-span-12 md:col-span-5", height: "h-72 sm:h-96", depth: 0.35, border: "border-spider-blue/30" },
    { colSpan: "col-span-12 md:col-span-8", height: "h-64 sm:h-88", depth: 0.5, border: "border-spider-blue/30" },
    { colSpan: "col-span-12 md:col-span-4", height: "h-64 sm:h-88", depth: 0.75, border: "border-spider-red/30" },
    { colSpan: "col-span-12 md:col-span-5", height: "h-72 sm:h-96", depth: 0.4, border: "border-spider-red/30" },
    { colSpan: "col-span-12 md:col-span-7", height: "h-72 sm:h-96", depth: 0.65, border: "border-spider-blue/30" },
  ];

  return (
    <section
      id="experience"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-24 sm:py-36 px-4 sm:px-8 overflow-hidden select-none"
    >
      {/* Background Web Grid */}
      <div className={`absolute inset-0 pointer-events-none opacity-30 ${
        isDark ? 'bg-web-grid-dark' : 'bg-web-grid-light'
      }`} />

      {/* Subtle Glow Spheres */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-spider-red/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-spider-blue/15 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={prefersReduced ? {} : staggerContainer}
          className="flex flex-col items-start mb-16 sm:mb-20"
        >
          <motion.span variants={fadeUp} className="font-mono text-xs tracking-widest uppercase font-bold text-spider-red mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-spider-red animate-ping" />
            LIVE MOMENTS & HACKATHONS
          </motion.span>

          <motion.div variants={fadeUp} className="flex flex-wrap items-baseline gap-2 sm:gap-6">
            <h2 className="font-orbitron font-black text-3xl sm:text-6xl md:text-7xl uppercase tracking-tight break-words">
              HACKATHONS
            </h2>
            <h2 className="font-orbitron font-black text-3xl sm:text-6xl md:text-7xl uppercase tracking-tight text-stroke-red hover:text-spider-red break-words">
              & EVENTS.
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="w-16 h-1 bg-spider-red mt-4 rounded-full shadow-[0_0_10px_#E62429]" />
        </motion.div>

        {/* Dynamic Image-Only Asymmetric Parallax Collage */}
        <div className="grid grid-cols-12 gap-5 sm:gap-7 items-center">
          {displayItems.map((item, idx) => {
            const config = layoutConfigs[idx % layoutConfigs.length];
            const isItemHovered = hoveredIdx === idx;
            const isAnyHovered = hoveredIdx !== null;
            const isRedAccent = idx % 2 === 0;

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: ease.cinematic }}
                className={`${config.colSpan} relative`}
              >
                {/* Parallax Wrapper Reacting to Mouse Motion */}
                <motion.div
                  style={prefersReduced ? {} : {
                    x: smoothMouseX.get ? smoothMouseX.get() * config.depth * 18 : 0,
                    y: smoothMouseY.get ? smoothMouseY.get() * config.depth * 18 : 0,
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={() => setLightboxIndex(idx)}
                  data-cursor-text="VIEW"
                  whileHover={{ scale: 1.035 }}
                  className={`group relative w-full ${config.height} rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 border-2 ${
                    isItemHovered
                      ? isRedAccent
                        ? 'border-spider-red shadow-[0_0_35px_rgba(230,36,41,0.55)] z-20'
                        : 'border-spider-blue shadow-[0_0_35px_rgba(37,99,235,0.55)] z-20'
                      : `${config.border} z-10`
                  } ${isAnyHovered && !isItemHovered ? 'opacity-65' : 'opacity-100'}`}
                >
                  {/* Clean Image Only - Zero Text Overlay */}
                  <img
                    src={item.src}
                    alt="Hackathon event highlight"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Spider-Web Halftone Accent Overlay on Subtle Hover */}
                  <div className="absolute inset-0 bg-web-grid-dark opacity-20 pointer-events-none group-hover:opacity-10 transition-opacity" />

                  {/* Corner Visual Cyber Brackets */}
                  <div className={`absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 transition-all duration-300 ${
                    isRedAccent ? 'border-spider-red/60 group-hover:border-spider-red' : 'border-spider-blue/60 group-hover:border-spider-blue'
                  }`} />
                  <div className={`absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 transition-all duration-300 ${
                    isRedAccent ? 'border-spider-red/60 group-hover:border-spider-red' : 'border-spider-blue/60 group-hover:border-spider-blue'
                  }`} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 bg-spider-night/95 backdrop-blur-2xl"
            />

            {/* Top Toolbar: Counter & Close */}
            <div className="fixed top-6 inset-x-6 sm:inset-x-10 z-50 flex items-center justify-between pointer-events-auto">
              <span className="font-orbitron font-black text-sm sm:text-base tracking-widest text-spider-red drop-shadow-[0_0_10px_#E62429]">
                0{lightboxIndex + 1} / 0{displayItems.length}
              </span>

              <button
                onClick={() => setLightboxIndex(null)}
                data-cursor-text="CLOSE"
                className="p-2.5 rounded-full border border-white/20 bg-spider-night/80 text-white hover:bg-spider-red hover:border-spider-red transition-all shadow-lg backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
              }}
              data-cursor-text="PREV"
              className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full border border-white/20 bg-spider-night/80 text-white hover:bg-spider-red hover:border-spider-red transition-all shadow-2xl backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Navigation Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % displayItems.length);
              }}
              data-cursor-text="NEXT"
              className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full border border-white/20 bg-spider-night/80 text-white hover:bg-spider-red hover:border-spider-red transition-all shadow-2xl backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Center Image Container - Zero Text */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, ease: ease.cinematic }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center z-40 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={displayItems[lightboxIndex]?.src}
                alt="Hackathon event fullscreen view"
                className="max-h-[82vh] max-w-[90vw] object-contain rounded-3xl border-2 border-spider-red/40 shadow-[0_0_50px_rgba(230,36,41,0.4)]"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
