import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, Lock, Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { profileData } from '../data/profile';
import { fadeUp, sectionViewport } from '../utils/animations';

export default function Footer({ onScrollTop, onOpenAdmin, theme = 'dark', heroData }) {
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const socials = {
    github: heroData?.socials?.github || profileData.socials.github,
    linkedin: heroData?.socials?.linkedin || profileData.socials.linkedin,
    instagram: heroData?.socials?.instagram || profileData.socials.instagram,
    email: heroData?.socials?.email || profileData.socials.email,
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={prefersReduced ? {} : fadeUp}
      className="relative py-12 px-4 sm:px-8 border-t border-current/10 select-none"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Left: Monogram Badge & Branding */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-orbitron font-black text-xs ${
            isDark ? 'bg-spider-night-card border-spider-red/40 text-spider-red' : 'bg-spider-day-card border-spider-blue/40 text-spider-blue'
          }`}>
            SM
          </div>
          <span className="font-orbitron text-xs font-bold tracking-widest uppercase opacity-85">
            SHUBHAM MUNDE
          </span>
        </div>

        {/* Center: Social Icons Row */}
        <div className="flex items-center gap-3">
          <motion.a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-text="GITHUB"
            whileHover={prefersReduced ? {} : { y: -2, scale: 1.1 }}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-spider-night-surface/60 border-white/15 text-mono-300 hover:text-spider-red hover:border-spider-red' : 'bg-white border-black/15 text-spider-night hover:text-spider-red hover:border-spider-red shadow-sm'
            }`}
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </motion.a>

          <motion.a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-text="LINKEDIN"
            whileHover={prefersReduced ? {} : { y: -2, scale: 1.1 }}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-spider-night-surface/60 border-white/15 text-mono-300 hover:text-spider-blue hover:border-spider-blue' : 'bg-white border-black/15 text-spider-night hover:text-spider-blue hover:border-spider-blue shadow-sm'
            }`}
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </motion.a>

          <motion.a
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-text="INSTAGRAM"
            whileHover={prefersReduced ? {} : { y: -2, scale: 1.1 }}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-spider-night-surface/60 border-white/15 text-mono-300 hover:text-pink-500 hover:border-pink-500' : 'bg-white border-black/15 text-spider-night hover:text-pink-500 hover:border-pink-500 shadow-sm'
            }`}
            aria-label="Instagram Profile"
          >
            <Instagram className="w-4 h-4" />
          </motion.a>

          <motion.a
            href={`mailto:${socials.email}`}
            data-cursor-text="EMAIL"
            whileHover={prefersReduced ? {} : { y: -2, scale: 1.1 }}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-spider-night-surface/60 border-white/15 text-mono-300 hover:text-spider-red hover:border-spider-red' : 'bg-white border-black/15 text-spider-night hover:text-spider-red hover:border-spider-red shadow-sm'
            }`}
            aria-label="Email Address"
          >
            <Mail className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Right: Admin Portal & Back to Top Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onOpenAdmin}
            data-cursor-text="ADMIN"
            whileHover={prefersReduced ? {} : { y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-spider-red/40 text-xs font-mono font-bold text-spider-red hover:bg-spider-red hover:text-white transition-all shadow-sm"
          >
            <Lock className="w-3 h-3" />
            <span>ADMIN</span>
          </motion.button>

          <motion.button
            onClick={onScrollTop}
            data-cursor-text="TOP"
            whileHover={prefersReduced ? {} : { y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-orbitron font-semibold tracking-wider transition-all duration-300 ${
              isDark
                ? 'border-spider-blue/40 hover:border-spider-blue hover:bg-spider-blue/10 text-white'
                : 'border-spider-blue/30 hover:border-spider-blue hover:bg-spider-blue/10 text-spider-night'
            }`}
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-spider-blue" />
          </motion.button>
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-current/5 text-center">
        <p className="font-mono text-[11px] opacity-65">
          © 2026 SHUBHAM MUNDE • DESIGNED & BUILT WITH CODE.
        </p>
      </div>
    </motion.footer>
  );
}
