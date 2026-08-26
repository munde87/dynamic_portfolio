/**
 * Premium Framer Motion Animation Variants
 * 
 * Reusable, consistent animation system for the portfolio.
 * Uses transform/opacity only for GPU-accelerated performance.
 * Respects prefers-reduced-motion via the useReducedMotion hook in components.
 */

// Premium easing curves
export const ease = {
  smooth: [0.16, 1, 0.3, 1],        // Apple-style overshoot
  cinematic: [0.22, 1, 0.36, 1],     // Cinematic reveal
  subtle: [0.25, 0.46, 0.45, 0.94],  // Material-style
  out: [0, 0, 0.2, 1],               // Quick deceleration
};

// ─── Fade Variants ─────────────────────────────────────────

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: ease.subtle },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.cinematic },
  },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.cinematic },
  },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: ease.cinematic },
  },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: ease.cinematic },
  },
};

// ─── Scale Variants ────────────────────────────────────────

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: ease.cinematic },
  },
};

// ─── Text Reveal (clip-path style via overflow hidden + Y) ─

export const textReveal = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.7, ease: ease.smooth },
  },
};

// ─── Stagger Containers ────────────────────────────────────

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// ─── Hero-specific Cinematic Sequence ──────────────────────

export const heroSequence = {
  container: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  },
  badge: {
    hidden: { opacity: 0, y: 15, scale: 0.97 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.5, ease: ease.cinematic },
    },
  },
  headlinePrimary: {
    hidden: { opacity: 0, y: '100%' },
    visible: {
      opacity: 1, y: '0%',
      transition: { duration: 0.7, ease: ease.smooth },
    },
  },
  headlineSecondary: {
    hidden: { opacity: 0, y: '100%' },
    visible: {
      opacity: 1, y: '0%',
      transition: { duration: 0.7, delay: 0.1, ease: ease.smooth },
    },
  },
  role: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: ease.cinematic },
    },
  },
  description: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: ease.cinematic },
    },
  },
  cta: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: ease.cinematic },
    },
  },
  social: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: ease.subtle },
    },
  },
  image: {
    hidden: { opacity: 0, scale: 0.96, x: 25 },
    visible: {
      opacity: 1, scale: 1, x: 0,
      transition: { duration: 0.8, delay: 0.4, ease: ease.cinematic },
    },
  },
};

// ─── Section Scroll-In Viewport Config ─────────────────────

export const sectionViewport = {
  once: true,
  amount: 0.15,
};

// ─── Code Lab Transition ───────────────────────────────────

export const codeSlide = {
  enter: { opacity: 0, x: 15 },
  center: {
    opacity: 1, x: 0,
    transition: { duration: 0.35, ease: ease.out },
  },
  exit: {
    opacity: 0, x: -15,
    transition: { duration: 0.25, ease: ease.subtle },
  },
};

// ─── Card Hover Interaction ────────────────────────────────

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -5,
    transition: { duration: 0.3, ease: ease.subtle },
  },
};

export const buttonHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -2,
    scale: 1.02,
    transition: { duration: 0.2, ease: ease.subtle },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// ─── Utility: Build delayed variant ────────────────────────

export function withDelay(variant, delay) {
  return {
    ...variant,
    visible: {
      ...variant.visible,
      transition: {
        ...variant.visible.transition,
        delay,
      },
    },
  };
}
