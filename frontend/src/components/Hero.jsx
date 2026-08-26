import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, Send, Github, Linkedin, Instagram, Mail, Sparkles, Terminal } from 'lucide-react';
import MaskReveal from './MaskReveal';
import { profileData } from '../data/profile';
import { heroSequence, ease } from '../utils/animations';

export default function Hero({ onNavigate, theme = 'dark', heroData }) {
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const data = {
    eyebrow: heroData?.eyebrow || "HEY, I'M SHUBHAM MUNDE",
    headline1: heroData?.headline1 || profileData.headline1,
    headline2: heroData?.headline2 || profileData.headline2,
    title: heroData?.title || profileData.title,
    subRole: heroData?.subRole || profileData.subRole,
    description: heroData?.description || profileData.description,
    primaryCtaText: heroData?.primaryCtaText || "EXPLORE MY WORK",
    secondaryCtaText: heroData?.secondaryCtaText || "LET'S CONNECT",
    github: heroData?.socials?.github || profileData.socials.github,
    linkedin: heroData?.socials?.linkedin || profileData.socials.linkedin,
    instagram: heroData?.socials?.instagram || profileData.socials.instagram,
    email: heroData?.socials?.email || profileData.socials.email,
    heroImage: heroData?.heroImage,
    portraitImage: heroData?.portraitImage,
  };

  // If user prefers reduced motion, show everything immediately
  const anim = (variant) => prefersReduced
    ? { initial: variant.visible, animate: variant.visible }
    : { initial: 'hidden', animate: 'visible', variants: variant };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 px-4 sm:px-8 flex flex-col justify-center overflow-hidden"
    >
      {/* Background Spider-Web Grid */}
      <div className={`absolute inset-0 pointer-events-none opacity-45 ${
        isDark ? 'bg-web-grid-dark' : 'bg-web-grid-light'
      }`} />
      
      {/* Halftone Comic Dots */}
      <div className="absolute inset-0 bg-halftone-dots opacity-20 pointer-events-none" />

      {/* Red & Blue Ambient Glowing Spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-spider-red/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-spider-blue/25 blur-[120px] pointer-events-none" />

      <motion.div
        variants={heroSequence.container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        
        {/* Left Column: Hero Typography & Info (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          
          {/* 1. Eyebrow badge */}
          <motion.div
            variants={heroSequence.badge}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 font-mono text-xs tracking-widest uppercase font-bold backdrop-blur-md ${
              isDark
                ? 'bg-spider-night-card border-spider-red/50 text-white shadow-spider-red'
                : 'bg-white border-spider-blue/40 text-spider-night shadow-md'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-spider-red animate-ping" />
            <span className="text-spider-red font-black">HEY, I'M</span>
            <span className="font-extrabold">{data.headline1} {data.headline2}</span>
          </motion.div>

          {/* 2 & 3. Giant Hero Typography with text reveal */}
          <div className="space-y-1 sm:space-y-2 max-w-full">
            <div className="overflow-hidden">
              <motion.h1
                variants={heroSequence.headlinePrimary}
                className={`font-orbitron font-black text-4xl sm:text-7xl md:text-8xl tracking-tight uppercase leading-none break-words ${
                  isDark ? 'text-white' : 'text-spider-night'
                }`}
              >
                {data.headline1}
              </motion.h1>
            </div>

            <div className="overflow-hidden">
              <motion.h1
                variants={heroSequence.headlineSecondary}
                className="font-orbitron font-black text-4xl sm:text-7xl md:text-8xl tracking-tight uppercase leading-none text-spider-red drop-shadow-[0_0_25px_rgba(230,36,41,0.5)] break-words"
              >
                {data.headline2}
              </motion.h1>
            </div>
          </div>

          {/* 4. Role & Secondary Line */}
          <motion.div
            variants={heroSequence.role}
            className="space-y-2"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-black uppercase tracking-wider bg-spider-red text-white shadow-md">
                ROLE
              </span>
              <h2 className={`font-orbitron text-lg sm:text-xl font-extrabold tracking-widest uppercase ${
                isDark ? 'text-white' : 'text-spider-night'
              }`}>
                {data.title}
              </h2>
            </div>

            <p className="font-mono text-xs sm:text-sm tracking-wider text-spider-blue font-extrabold">
              {data.subRole}
            </p>
          </motion.div>

          {/* 5. Description */}
          <motion.p
            variants={heroSequence.description}
            className={`font-sans text-sm sm:text-base leading-relaxed max-w-xl font-medium ${
              isDark ? 'text-mono-200 opacity-90' : 'text-spider-night opacity-95'
            }`}
          >
            {data.description}
          </motion.p>

          {/* 6. Action Buttons */}
          <motion.div
            variants={heroSequence.cta}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-2 w-full sm:w-auto"
          >
            {/* Primary CTA Button */}
            <motion.button
              onClick={() => onNavigate('projects')}
              data-cursor-text="PROJECTS"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group w-full sm:w-auto px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-orbitron font-extrabold tracking-wider flex items-center justify-center gap-2.5 bg-spider-red text-white hover:bg-spider-red-dark shadow-spider-red transition-all duration-300 border-2 border-spider-red"
            >
              <span className="text-white">{data.primaryCtaText}</span>
              <ArrowDownRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </motion.button>

            {/* Secondary CTA Button */}
            <motion.button
              onClick={() => onNavigate('contact')}
              data-cursor-text="CONNECT"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl border-2 text-xs sm:text-sm font-orbitron font-extrabold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                isDark
                  ? 'bg-spider-night-card border-spider-blue/60 text-white hover:border-spider-blue hover:bg-spider-blue/20 hover:shadow-spider-blue'
                  : 'bg-white border-spider-blue text-spider-night hover:bg-spider-blue hover:text-white shadow-md'
              }`}
            >
              <Send className="w-4 h-4 text-spider-blue group-hover:text-white" />
              <span>{data.secondaryCtaText}</span>
            </motion.button>
          </motion.div>

          {/* 7. Social Links */}
          <motion.div
            variants={heroSequence.social}
            className="flex flex-wrap items-center gap-3 sm:gap-6 pt-3 font-mono text-xs tracking-wider font-bold w-full"
          >
            <motion.a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="GITHUB"
              whileHover={{ y: -2 }}
              className={`flex items-center gap-1.5 transition-all hover:text-spider-red ${
                isDark ? 'text-mono-300' : 'text-spider-night'
              }`}
            >
              <Github className="w-4 h-4 text-spider-red" />
              <span>GITHUB</span>
            </motion.a>

            <span className="opacity-30">•</span>

            <motion.a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="LINKEDIN"
              whileHover={{ y: -2 }}
              className={`flex items-center gap-1.5 transition-all hover:text-spider-blue ${
                isDark ? 'text-mono-300' : 'text-spider-night'
              }`}
            >
              <Linkedin className="w-4 h-4 text-spider-blue" />
              <span>LINKEDIN</span>
            </motion.a>

            <span className="opacity-30">•</span>

            <motion.a
              href={data.instagram}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="INSTAGRAM"
              whileHover={{ y: -2 }}
              className={`flex items-center gap-1.5 transition-all hover:text-pink-500 ${
                isDark ? 'text-mono-300' : 'text-spider-night'
              }`}
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>INSTAGRAM</span>
            </motion.a>

            <span className="opacity-30">•</span>

            <motion.a
              href={`mailto:${data.email}`}
              data-cursor-text="EMAIL"
              whileHover={{ y: -2 }}
              className={`flex items-center gap-1.5 transition-all hover:text-spider-red ${
                isDark ? 'text-mono-300' : 'text-spider-night'
              }`}
            >
              <Mail className="w-4 h-4 text-spider-red" />
              <span>EMAIL</span>
            </motion.a>
          </motion.div>

        </div>

        {/* 8. Right Column: MaskReveal Visual (5 cols) */}
        <motion.div
          variants={heroSequence.image}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <motion.div
            animate={prefersReduced ? {} : { y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MaskReveal
              theme={theme}
              heroImage={data.heroImage}
              portraitImage={data.portraitImage}
            />
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
}
