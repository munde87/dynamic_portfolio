import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor({ theme = 'dark' }) {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target.closest('[data-cursor-text], a, button, input, textarea, [role="button"]');
      if (target) {
        const text = target.getAttribute('data-cursor-text');
        setCursorText(text || '');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  const isDark = theme === 'dark';

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Follower Ring / Badge */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center pointer-events-none transition-colors duration-200 backdrop-blur-[1px] ${
          cursorText
            ? 'bg-spider-red text-white font-mono font-bold text-[10px] tracking-wider px-3.5 py-1.5 shadow-[0_0_20px_rgba(230,36,41,0.6)] border border-white/20'
            : isHovered
            ? 'w-12 h-12 border-2 border-spider-blue bg-spider-blue/15 -ml-6 -mt-6 shadow-spider-blue'
            : isDark
            ? 'w-8 h-8 border border-spider-red/60 bg-spider-red/5 -ml-4 -mt-4 shadow-spider-red'
            : 'w-8 h-8 border border-spider-blue/60 bg-spider-blue/5 -ml-4 -mt-4 shadow-spider-blue'
        }`}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovered ? (cursorText ? 1.1 : 1.25) : 1,
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 350,
          mass: 0.5,
        }}
      >
        {cursorText && (
          <span className="whitespace-nowrap select-none uppercase font-orbitron">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Center Precise Red/Blue Dot */}
      {!cursorText && (
        <motion.div
          className="fixed top-0 left-0 w-2 h-2 -ml-[4px] -mt-[4px] rounded-full pointer-events-none bg-spider-red shadow-[0_0_8px_#E62429]"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{
            type: 'spring',
            damping: 40,
            stiffness: 700,
            mass: 0.1,
          }}
        />
      )}
    </div>
  );
}
