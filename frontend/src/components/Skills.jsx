import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { skillsData, skillCategories } from '../data/skills';
import { fadeUp, staggerContainer, sectionViewport, ease } from '../utils/animations';

export default function Skills({ theme = 'dark' }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const filteredSkills = activeCategory === "ALL"
    ? skillsData
    : skillsData.filter(s => s.category === activeCategory);

  const cardVariant = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.4, ease: ease.cinematic },
    },
  };

  return (
    <section id="skills" className="relative py-24 sm:py-32 px-4 sm:px-8 overflow-hidden">
      
      {/* Background Web Patterns */}
      <div className={`absolute inset-0 pointer-events-none opacity-30 ${
        isDark ? 'bg-web-grid-dark' : 'bg-web-grid-light'
      }`} />

      {/* Hanging Spider-Man from the Top Right holding Web Strand */}
      <div className="absolute top-0 right-4 sm:right-12 md:right-20 z-20 pointer-events-none select-none">
        {/* Animated Web Line Strand extending from top of page */}
        <div className="w-[1.5px] h-20 sm:h-28 mx-auto bg-gradient-to-b from-spider-red/80 via-white to-spider-blue/80 shadow-[0_0_8px_#E62429]" />
        
        {/* Upside Down Hanging Spider-Man with gentle swing */}
        <motion.div
          animate={{ rotate: [-3, 3, -3], y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative -mt-1"
        >
          <img
            src="/assets/spider-hanging.png"
            alt="Spider-Man Hanging Upside Down"
            className="w-28 sm:w-36 md:w-44 drop-shadow-[0_20px_35px_rgba(230,36,41,0.5)]"
          />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={prefersReduced ? {} : staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6"
        >
          <motion.div variants={fadeUp}>
            <span className="font-mono text-xs tracking-widest uppercase font-bold text-spider-red mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-spider-red animate-ping" />
              ARSENAL & EXPERTISE
            </span>

            <div className="flex flex-wrap items-baseline gap-4">
              <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight">
                TECHNICAL
              </h2>
              <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-stroke-red hover:text-spider-red">
                SKILLS.
              </h2>
            </div>
            {/* Red underline bar */}
            <div className="w-16 h-1 bg-spider-red mt-3 rounded-full shadow-[0_0_10px_#E62429]" />
          </motion.div>

          {/* Category Filter Chips */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 max-w-md">
            {skillCategories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  data-cursor-text="FILTER"
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-spider-red text-white border-spider-red shadow-spider-red'
                      : isDark
                      ? 'bg-spider-night-card/70 border-spider-red/20 text-mono-300 hover:border-spider-red hover:text-white'
                      : 'bg-white border-spider-blue/20 text-mono-700 hover:border-spider-blue hover:text-spider-night shadow-sm'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Skills Cards Grid */}
        <motion.div
          layout
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={prefersReduced ? {} : {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06, delayChildren: 0.05 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.number}
                layout
                variants={cardVariant}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={prefersReduced ? {} : { y: -5 }}
                data-cursor-text="SKILL"
                className={`group relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isDark
                    ? 'bg-spider-night-card border-spider-red/20 hover:border-spider-red hover:shadow-spider-red text-white'
                    : 'bg-white border-spider-blue/20 hover:border-spider-blue hover:shadow-card-light text-spider-night'
                }`}
              >
                {/* Top: Red Indicator Dot + Skill Name + Level Pill */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-spider-red shadow-[0_0_8px_#E62429] shrink-0" />
                      <div>
                        <h3 className="font-orbitron font-black text-lg sm:text-xl tracking-wide uppercase group-hover:text-spider-red transition-colors">
                          {skill.name}
                        </h3>
                        <span className="font-mono text-[10px] tracking-wider text-spider-blue-electric font-semibold uppercase">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-bold border uppercase ${
                      isDark
                        ? 'border-spider-red/30 bg-spider-red/10 text-white'
                        : 'border-spider-blue/30 bg-spider-blue/10 text-spider-blue'
                    }`}>
                      {skill.level}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs leading-relaxed opacity-80 mt-2 mb-4">
                    {skill.description}
                  </p>
                </div>

                {/* Bottom: Tags */}
                <div className="pt-3 border-t border-current/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {skill.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-spider-red/10 text-spider-red font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="font-orbitron font-black text-xs opacity-30 text-spider-blue">
                    {skill.number}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
