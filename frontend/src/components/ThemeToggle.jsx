import React, { useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { ease } from '../utils/animations';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';
  const buttonRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const handleToggle = (e) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect ? {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    } : { x: window.innerWidth - 80, y: 40 };

    toggleTheme(origin);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'Day' : 'Night'} Mode`}
      data-cursor-text={isDark ? 'DAY MODE' : 'NIGHT MODE'}
      whileHover={prefersReduced ? {} : { scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-300 ${
        isDark
          ? 'bg-spider-night border-spider-red/40 text-spider-red hover:border-spider-red hover:shadow-spider-red'
          : 'bg-white border-spider-blue/40 text-spider-blue hover:border-spider-blue hover:shadow-spider-blue'
      }`}
    >
      {/* Outer Web Ring */}
      <span className={`absolute inset-0 rounded-full border border-dashed transition-transform duration-700 group-hover:scale-110 animate-spin-slow ${
        isDark ? 'border-spider-red/40' : 'border-spider-blue/40'
      }`} />

      {/* Center Icon with smooth rotate & scale transition */}
      <div className="relative z-10 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
            transition={{ duration: 0.3, ease: ease.cinematic }}
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-spider-red fill-spider-red/20" />
            ) : (
              <Sun className="w-4 h-4 text-spider-blue fill-spider-blue/20" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="sr-only">Toggle Day/Night Mode (Current: {theme})</span>
    </motion.button>
  );
}
