import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Terminal, CheckCircle2, Shield, Code2, Sparkles } from 'lucide-react';
import { profileData } from '../data/profile';
import { fadeUp, fadeLeft, fadeRight, scaleReveal, staggerContainer, staggerContainerSlow, sectionViewport, ease } from '../utils/animations';

export default function About({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const statItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.4, ease: ease.cinematic },
    },
  };

  return (
    <section id="about" className="relative py-24 sm:py-32 px-4 sm:px-8">
      {/* Background Web Matrix */}
      <div className={`absolute inset-0 pointer-events-none opacity-30 ${
        isDark ? 'bg-web-grid-dark' : 'bg-web-grid-light'
      }`} />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Eyebrow & Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={prefersReduced ? {} : staggerContainer}
          className="flex flex-col items-start mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="font-mono text-xs tracking-widest uppercase font-bold text-spider-red mb-2 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-spider-red animate-ping" />
            THE PERSON BEHIND THE MASK
          </motion.span>

          <motion.div variants={fadeUp} className="flex flex-wrap items-baseline gap-4 sm:gap-6">
            <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight">
              ABOUT
            </h2>
            <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-stroke-blue hover:text-spider-blue">
              ME.
            </h2>
          </motion.div>
        </motion.div>

        {/* Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Narrative & Stats (7 cols) — fade from left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            variants={prefersReduced ? {} : fadeLeft}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-5 text-base sm:text-lg leading-relaxed opacity-90 font-sans">
              {profileData.aboutBio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Architectural Stats Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={sectionViewport}
              variants={prefersReduced ? {} : staggerContainerSlow}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              {profileData.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={statItem}
                  whileHover={prefersReduced ? {} : { y: -3 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    isDark
                      ? 'bg-spider-night-card border-spider-red/30 hover:border-spider-red text-white shadow-spider-red'
                      : 'bg-white border-spider-blue/25 hover:border-spider-blue text-spider-night shadow-card-light'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-spider-red/10 rounded-bl-3xl pointer-events-none" />
                  
                  <span className="font-mono text-[10px] tracking-wider text-spider-blue-electric font-bold block mb-1">
                    {stat.code}
                  </span>
                  <span className="font-orbitron font-bold text-lg sm:text-xl tracking-tight block">
                    {stat.value}
                  </span>
                  <span className="font-sans text-xs opacity-75 block mt-1">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive Card with Portrait & Primary Stack (5 cols) — fade from right */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            variants={prefersReduced ? {} : fadeRight}
            className="lg:col-span-5 space-y-6 relative"
          >
            
            {/* Floating Dynamic Spider-Man Crouch Cutout */}
            <motion.img
              src="/assets/spider-crouch.png"
              alt="Spider Man Dynamic Pose"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-16 -right-8 w-36 sm:w-44 z-20 pointer-events-none drop-shadow-[0_15px_25px_rgba(230,36,41,0.4)]"
            />

            <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-2xl backdrop-blur-xl relative z-10 ${
              isDark
                ? 'bg-spider-night-card/90 border-spider-blue/40 text-white shadow-spider-blue'
                : 'bg-white border-spider-red/30 text-spider-night shadow-spider-red'
            }`}>
              
              {/* Dossier Header */}
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-current/10 font-mono text-xs">
                <span className="font-bold flex items-center gap-2 text-spider-red">
                  <Terminal className="w-4 h-4" />
                  DEVELOPER DOSSIER
                </span>
                <span className="text-spider-blue-electric font-semibold">IDENTITY // 01</span>
              </div>

              {/* Primary Tech Stack Chips */}
              <div className="space-y-4">
                <p className="font-orbitron text-xs font-bold tracking-wider uppercase opacity-80">
                  PRIMARY TECH ABILITIES
                </p>

                <div className="flex flex-wrap gap-2">
                  {profileData.primaryStack.map((tech, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.06 }}
                      data-cursor-text="SKILL"
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-default ${
                        idx % 2 === 0
                          ? 'border-spider-red/40 bg-spider-red/10 text-spider-red hover:bg-spider-red hover:text-white'
                          : 'border-spider-blue/40 bg-spider-blue/10 text-spider-blue-electric hover:bg-spider-blue hover:text-white'
                      }`}
                    >
                      {tech.name}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Engineering Code of Ethics */}
              <div className="mt-8 pt-6 border-t border-current/10 space-y-3 font-sans text-xs opacity-90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-spider-red shrink-0" />
                  <span>"With great code comes great responsibility."</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-spider-blue shrink-0" />
                  <span>High frame-rate 3D graphics & scalable full-stack engines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-spider-red shrink-0" />
                  <span>Building full-stack web applications with Java & MERN Stack</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
