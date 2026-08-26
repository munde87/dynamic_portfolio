/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Spider-Man Inspired Red, Blue, Black & White Palette
        spider: {
          red: '#E62429',
          'red-dark': '#B91C1C',
          'red-light': '#EF4444',
          'red-glow': 'rgba(230, 36, 41, 0.5)',
          blue: '#1D4ED8',
          'blue-electric': '#2563EB',
          'blue-vivid': '#0284C7',
          'blue-dark': '#0F172A',
          'blue-glow': 'rgba(37, 99, 235, 0.5)',
          night: '#050811',
          'night-card': '#0B1120',
          'night-surface': '#111A2E',
          day: '#FFFFFF',
          'day-card': '#F8FAFC',
          'day-surface': '#F1F5F9',
        },
        mono: {
          950: '#050811',
          900: '#0A0F1D',
          850: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50:  '#F8FAFC',
          0:   '#FFFFFF',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 25s linear infinite',
        'spin-reverse': 'spinReverse 30s linear infinite',
        'scanline': 'scanline 5s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'swing': 'swing 3s ease-in-out infinite',
        'marquee-left': 'marqueeLeft 30s linear infinite',
        'marquee-right': 'marqueeRight 30s linear infinite',
      },
      keyframes: {
        spinReverse: {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        swing: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        marqueeLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      boxShadow: {
        'spider-red': '0 0 30px rgba(230, 36, 41, 0.4), inset 0 0 15px rgba(230, 36, 41, 0.2)',
        'spider-blue': '0 0 30px rgba(37, 99, 235, 0.4), inset 0 0 15px rgba(37, 99, 235, 0.2)',
        'glow-red': '0 0 25px rgba(230, 36, 41, 0.5)',
        'glow-blue': '0 0 25px rgba(37, 99, 235, 0.5)',
        'card-dark': '0 10px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(230, 36, 41, 0.15)',
        'card-light': '0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(230, 36, 41, 0.12)',
      },
    },
  },
  plugins: [],
}
