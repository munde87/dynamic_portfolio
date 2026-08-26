import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, FileText, ArrowUpRight, Shield } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { profileData } from '../data/profile';
import { ease } from '../utils/animations';

export default function Navbar({
  activeSection,
  onNavigate,
  theme,
  toggleTheme,
  onOpenResume
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const navLinks = [
    { id: 'hero', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'reactor', label: 'CORE' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'contact', label: 'CONTACT' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  // Staggered nav items entrance
  const navItemVariant = {
    hidden: { opacity: 0, y: -8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, delay: 0.3 + i * 0.04, ease: ease.cinematic },
    }),
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 flex justify-center px-4 sm:px-8 pt-3 sm:pt-4 transition-all duration-500">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: ease.smooth }}
        className={`w-full max-w-6xl rounded-2xl border transition-all duration-300 flex items-center justify-between px-5 sm:px-7 ${
          scrolled ? 'py-2.5 sm:py-3 shadow-2xl' : 'py-3.5 sm:py-4'
        } ${
          isDark
            ? 'bg-spider-night/85 border-spider-red/30 text-white backdrop-blur-xl shadow-spider-red'
            : 'bg-white/90 border-spider-blue/20 text-spider-night backdrop-blur-xl shadow-spider-blue'
        }`}
      >
        {/* Left: Brand Monogram / Identity */}
        <motion.button
          onClick={() => handleLinkClick('hero')}
          data-cursor-text="HOME"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <motion.div 
            animate={{ boxShadow: isDark ? ['0 0 10px rgba(230,36,41,0.2)', '0 0 20px rgba(230,36,41,0.6)', '0 0 10px rgba(230,36,41,0.2)'] : ['0 0 10px rgba(37,99,235,0.2)', '0 0 20px rgba(37,99,235,0.6)', '0 0 10px rgba(37,99,235,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center font-orbitron font-black text-sm tracking-wider transition-all duration-300 ${
              isDark
                ? 'bg-spider-night-card border-spider-red/50 group-hover:border-spider-red text-spider-red'
                : 'bg-spider-day-card border-spider-blue/50 group-hover:border-spider-blue text-spider-blue'
            }`}
          >
            SM
          </motion.div>
          <div className="hidden sm:block">
            <span className="font-orbitron font-black text-xs tracking-widest block uppercase group-hover:text-spider-red transition-colors">
              SHUBHAM MUNDE
            </span>
            <span className="font-mono text-[9px] tracking-wider block text-spider-blue-electric font-semibold">
              SOFTWARE ENGINEER
            </span>
          </div>
        </motion.button>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link, i) => {
            const isActive = activeSection === link.id;
            return (
              <motion.button
                key={link.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={prefersReduced ? {} : navItemVariant}
                onClick={() => handleLinkClick(link.id)}
                data-cursor-text="GOTO"
                whileHover={prefersReduced ? {} : { y: -2 }}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-semibold tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-spider-red font-bold'
                    : isDark
                    ? 'text-mono-300 hover:text-white'
                    : 'text-mono-700 hover:text-spider-night'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-spider-red to-spider-blue shadow-[0_0_8px_#E62429]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right: Theme Toggle + Resume CTA + Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Resume CTA with Spider Red / Blue Styling */}
          <motion.button
            onClick={onOpenResume}
            data-cursor-text="RESUME"
            whileHover={prefersReduced ? {} : { y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-orbitron font-bold tracking-wider transition-all duration-300 ${
              isDark
                ? 'bg-spider-night-surface/60 border-spider-red/30 text-white hover:border-spider-red hover:bg-spider-red/20 hover:shadow-spider-red'
                : 'bg-spider-day-surface border-spider-blue/30 text-spider-night hover:border-spider-blue hover:bg-spider-blue/10 hover:shadow-spider-blue'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-spider-red" />
            <span>RESUME</span>
          </motion.button>

          {/* Day / Night Theme Toggle */}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            data-cursor-text="MENU"
            className={`md:hidden p-2 rounded-xl border transition-all ${
              isDark ? 'border-spider-red/30 bg-spider-night-card text-white' : 'border-spider-blue/30 bg-spider-day-card text-spider-night'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-spider-red" /> : <Menu className="w-5 h-5 text-spider-blue" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: ease.cinematic }}
            className={`md:hidden fixed top-20 inset-x-4 p-6 rounded-3xl border shadow-2xl backdrop-blur-2xl ${
              isDark
                ? 'bg-spider-night/95 border-spider-red/40 text-white shadow-spider-red'
                : 'bg-white/95 border-spider-blue/40 text-spider-night shadow-spider-blue'
            }`}
          >
            <div className="flex flex-col space-y-4">
              <p className="font-mono text-[10px] tracking-widest text-spider-red uppercase border-b border-current/10 pb-2">
                WEB MATRIX NAVIGATION
              </p>

              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`flex items-center justify-between text-left py-2 font-orbitron text-sm font-bold tracking-wider transition-colors ${
                      isActive
                        ? 'text-spider-red'
                        : isDark
                        ? 'text-mono-300 hover:text-white'
                        : 'text-mono-700 hover:text-spider-night'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-spider-blue" />
                  </button>
                );
              })}

              <div className="pt-4 border-t border-current/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenResume();
                  }}
                  className="w-full py-2.5 rounded-xl border text-xs font-orbitron font-bold tracking-wider flex items-center justify-center gap-2 bg-spider-red text-white border-spider-red hover:bg-spider-red-dark shadow-spider-red"
                >
                  <FileText className="w-4 h-4" />
                  VIEW DOSSIER // RESUME
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
