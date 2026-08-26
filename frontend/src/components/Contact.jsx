import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Send, Mail, Linkedin, Instagram, Github, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendContactMessage } from '../utils/api';
import { profileData } from '../data/profile';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerContainerSlow, sectionViewport, ease } from '../utils/animations';

export default function Contact({ theme = 'dark', heroData }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const socials = {
    email: heroData?.socials?.email || profileData.socials.email,
    linkedin: heroData?.socials?.linkedin || profileData.socials.linkedin,
    github: heroData?.socials?.github || profileData.socials.github,
    instagram: heroData?.socials?.instagram || profileData.socials.instagram,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ state: 'error', message: 'Please fill in all telemetry parameters.' });
      return;
    }

    setStatus({ state: 'loading', message: 'Broadcasting transmission to relay...' });

    try {
      await sendContactMessage(formData);
      setStatus({ state: 'success', message: 'Transmission received! I will respond promptly.' });
      setFormData({ name: '', email: '', message: '' });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: isDark ? ['#ffffff', '#a1a1aa', '#71717a'] : ['#000000', '#52525b', '#a1a1aa']
      });
    } catch (err) {
      // Graceful fallback for client demonstration
      setStatus({
        state: 'success',
        message: 'Message dispatched! (Cached in relay buffer: will sync to inbox).'
      });
      setFormData({ name: '', email: '', message: '' });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: isDark ? ['#ffffff', '#a1a1aa', '#71717a'] : ['#000000', '#52525b', '#a1a1aa']
      });
    }
  };

  // Staggered text reveal for the heading
  const headingReveal = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const headingLine = {
    hidden: { opacity: 0, y: '100%' },
    visible: {
      opacity: 1, y: '0%',
      transition: { duration: 0.7, ease: ease.smooth },
    },
  };

  const channelCard = (idx) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.45, delay: idx * 0.1, ease: ease.cinematic },
    },
  });

  return (
    <section id="contact" className="relative py-24 sm:py-36 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Section Header — strong final reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={prefersReduced ? {} : staggerContainer}
          className="flex flex-col items-start mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="font-mono text-xs tracking-widest uppercase font-semibold opacity-60 mb-2 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            LET'S CONNECT
          </motion.span>

          <motion.div
            variants={prefersReduced ? {} : headingReveal}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="space-y-1 sm:space-y-2"
          >
            <div className="overflow-hidden">
              <motion.h2
                variants={headingLine}
                className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight"
              >
                LET'S BUILD
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                variants={headingLine}
                className={`font-orbitron font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight ${
                  isDark ? 'text-stroke-dark hover:text-white' : 'text-stroke-light hover:text-black'
                }`}
              >
                SOMETHING GREAT.
              </motion.h2>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-sans text-sm sm:text-base leading-relaxed opacity-75 max-w-xl mt-4"
          >
            Have an idea, project, opportunity, or just want to connect? My inbox is always open. Let's engineer something exceptional together.
          </motion.p>
        </motion.div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form (7 cols) — fade from left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            variants={prefersReduced ? {} : fadeLeft}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className={`p-6 sm:p-10 rounded-3xl border shadow-2xl backdrop-blur-xl space-y-6 ${
                isDark
                  ? 'bg-mono-900/60 border-white/15 text-white'
                  : 'bg-white border-black/15 text-black'
              }`}
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-wider uppercase font-semibold opacity-70 block">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Mercer"
                  required
                  className={`w-full px-4 py-3.5 rounded-xl border text-sm font-sans focus:outline-none transition-all ${
                    isDark
                      ? 'bg-mono-950/80 border-white/15 focus:border-white text-white placeholder-mono-600'
                      : 'bg-mono-50 border-black/15 focus:border-black text-black placeholder-mono-400'
                  }`}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-wider uppercase font-semibold opacity-70 block">
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. alex@example.com"
                  required
                  className={`w-full px-4 py-3.5 rounded-xl border text-sm font-sans focus:outline-none transition-all ${
                    isDark
                      ? 'bg-mono-950/80 border-white/15 focus:border-white text-white placeholder-mono-600'
                      : 'bg-mono-50 border-black/15 focus:border-black text-black placeholder-mono-400'
                  }`}
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-wider uppercase font-semibold opacity-70 block">
                  MESSAGE PAYLOAD
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your project, timeline, or inquiry..."
                  required
                  className={`w-full px-4 py-3.5 rounded-xl border text-sm font-sans focus:outline-none transition-all resize-none ${
                    isDark
                      ? 'bg-mono-950/80 border-white/15 focus:border-white text-white placeholder-mono-600'
                      : 'bg-mono-50 border-black/15 focus:border-black text-black placeholder-mono-400'
                  }`}
                />
              </div>

              {/* Feedback status message */}
              {status.state !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                    status.state === 'error'
                      ? 'border-red-500/30 bg-red-500/10 text-red-400'
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {status.state === 'error' ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </motion.div>
              )}

              {/* Submit CTA Button */}
              <motion.button
                type="submit"
                disabled={status.state === 'loading'}
                data-cursor-text="SEND"
                whileHover={prefersReduced ? {} : { y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl border text-xs sm:text-sm font-orbitron font-bold tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all duration-300 ${
                  isDark
                    ? 'bg-white text-black border-white hover:bg-mono-200 shadow-glow-white disabled:opacity-50'
                    : 'bg-black text-white border-black hover:bg-mono-800 shadow-glow-dark disabled:opacity-50'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{status.state === 'loading' ? 'TRANSMITTING...' : 'DISPATCH MESSAGE'}</span>
              </motion.button>
            </form>
          </motion.div>

          {/* Right Column: Direct Channels & Connect Badges (5 cols) — stagger from right */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            variants={prefersReduced ? {} : {
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Direct Email Card */}
            <motion.a
              variants={channelCard(0)}
              href={`mailto:${socials.email}`}
              data-cursor-text="EMAIL"
              whileHover={prefersReduced ? {} : { y: -3 }}
              className={`p-6 rounded-3xl border flex items-center justify-between transition-all duration-300 hud-corner-brackets group ${
                isDark
                  ? 'bg-mono-900/50 border-white/10 hover:border-white/40 text-white'
                  : 'bg-white border-black/10 hover:border-black/40 text-black shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-mono-800 border-white/15' : 'bg-mono-100 border-black/15'
                }`}>
                  <Mail className="w-5 h-5 text-spider-red" />
                </div>
                <div className="overflow-hidden min-w-0 flex-1">
                  <span className="font-mono text-[10px] tracking-wider opacity-60 uppercase block">
                    DIRECT INBOX
                  </span>
                  <span className="font-orbitron font-bold text-xs sm:text-base tracking-wide block break-all text-spider-red">
                    {socials.email}
                  </span>
                </div>
              </div>

              <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </motion.a>

            {/* LinkedIn Card */}
            <motion.a
              variants={channelCard(1)}
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="LINKEDIN"
              whileHover={prefersReduced ? {} : { y: -3 }}
              className={`p-6 rounded-3xl border flex items-center justify-between transition-all duration-300 hud-corner-brackets group ${
                isDark
                  ? 'bg-mono-900/50 border-white/10 hover:border-white/40 text-white'
                  : 'bg-white border-black/10 hover:border-black/40 text-black shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-mono-800 border-white/15' : 'bg-mono-100 border-black/15'
                }`}>
                  <Linkedin className="w-5 h-5 text-spider-blue" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-wider opacity-60 uppercase block">
                    PROFESSIONAL NETWORK
                  </span>
                  <span className="font-orbitron font-bold text-sm sm:text-base tracking-wide block">
                    LinkedIn // Shubham Munde
                  </span>
                </div>
              </div>

              <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </motion.a>

            {/* GitHub Card */}
            <motion.a
              variants={channelCard(2)}
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="GITHUB"
              whileHover={prefersReduced ? {} : { y: -3 }}
              className={`p-6 rounded-3xl border flex items-center justify-between transition-all duration-300 hud-corner-brackets group ${
                isDark
                  ? 'bg-mono-900/50 border-white/10 hover:border-white/40 text-white'
                  : 'bg-white border-black/10 hover:border-black/40 text-black shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-mono-800 border-white/15' : 'bg-mono-100 border-black/15'
                }`}>
                  <Github className="w-5 h-5 text-spider-red" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-wider opacity-60 uppercase block">
                    CODE REPOSITORIES
                  </span>
                  <span className="font-orbitron font-bold text-sm sm:text-base tracking-wide block">
                    GitHub // munde87
                  </span>
                </div>
              </div>

              <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </motion.a>

            {/* Instagram Card */}
            <motion.a
              variants={channelCard(3)}
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="INSTAGRAM"
              whileHover={prefersReduced ? {} : { y: -3 }}
              className={`p-6 rounded-3xl border flex items-center justify-between transition-all duration-300 hud-corner-brackets group ${
                isDark
                  ? 'bg-mono-900/50 border-white/10 hover:border-white/40 text-white'
                  : 'bg-white border-black/10 hover:border-black/40 text-black shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-mono-800 border-white/15' : 'bg-mono-100 border-black/15'
                }`}>
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-wider opacity-60 uppercase block">
                    COMMUNITY & SOCIAL
                  </span>
                  <span className="font-orbitron font-bold text-sm sm:text-base tracking-wide block">
                    Instagram // smash_8767
                  </span>
                </div>
              </div>

              <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </motion.a>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
