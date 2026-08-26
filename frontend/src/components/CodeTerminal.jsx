import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Terminal, Copy, Check, Play, ChevronLeft, ChevronRight, RotateCcw, Cpu } from 'lucide-react';
import { fadeUp, staggerContainer, sectionViewport, ease } from '../utils/animations';

const DEFAULT_CODE_EXAMPLES = [
  {
    id: 'example-1',
    title: 'web-developer.config.js',
    language: 'JavaScript',
    code: `const developer = {
  name: "Shubham Munde",
  role: "Software Engineer",
  skills: ["Web Development", "Java", "MERN Stack", "Three.js"],
  mission: "Build. Learn. Improve.",
  quote: "With great power comes great responsibility in code."
};`,
    output: `Developer Profile Loaded Successfully
Name: Shubham Munde
Role: Software Engineer
Skills: Web Development, Java, MERN Stack, Three.js
Mission: Build. Learn. Improve.`
  },
  {
    id: 'example-2',
    title: 'power-up.java',
    language: 'Java',
    code: `class PowerUp {
    public static void main(String[] args) {
        String name = "Shubham";
        int level = 1;

        for (int i = 1; i <= 5; i++) {
            level++;
        }

        System.out.println(name + " reached level " + level);
        System.out.println("Keep learning. Keep building.");
    }
}`,
    output: `Shubham reached level 6
Keep learning. Keep building.`
  },
  {
    id: 'example-3',
    title: 'skill-scanner.js',
    language: 'JavaScript',
    code: `const skills = ["React", "Java", "Node.js", "MongoDB"];

console.log("Scanning developer skills...");

skills.forEach((skill, index) => {
  console.log(\`\${index + 1}. \${skill} detected\`);
});

console.log("Scan complete.");`,
    output: `Scanning developer skills...
1. React detected
2. Java detected
3. Node.js detected
4. MongoDB detected
Scan complete.`
  },
  {
    id: 'example-4',
    title: 'find-max.java',
    language: 'Java',
    code: `public class FindMax {
    public static void main(String[] args) {
        int[] numbers = {12, 45, 7, 89, 34};
        int max = numbers[0];

        for (int number : numbers) {
            if (number > max) {
                max = number;
            }
        }

        System.out.println("Maximum value: " + max);
    }
}`,
    output: `Maximum value: 89`
  },
  {
    id: 'example-5',
    title: 'api-response.js',
    language: 'JavaScript',
    code: `const response = {
  success: true,
  message: "Portfolio data loaded",
  projects: 4
};

if (response.success) {
  console.log(response.message);
  console.log(\`Projects available: \${response.projects}\`);
}`,
    output: `Portfolio data loaded
Projects available: 4`
  }
];

export default function CodeTerminal({ theme = 'dark', codeExamples }) {
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();
  const examples = (codeExamples && codeExamples.length >= 1) ? codeExamples : DEFAULT_CODE_EXAMPLES;

  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  
  // Independent Execution State per Example ID
  const [execStates, setExecStates] = useState({});

  // Auto-scroll states
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isTouching, setIsTouching] = useState(false);
  
  // Mobile touch swipe tracker
  const touchStartX = useRef(null);

  // Section reference for IntersectionObserver
  const sectionRef = useRef(null);

  const currentExample = examples[activeIndex] || examples[0];
  const currentExec = execStates[currentExample.id] || { status: 'READY', output: null };

  // IntersectionObserver to pause auto-scroll when section is off-screen
  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, []);

  // Controlled Auto-Scroll Timer (2.0 seconds = 2000ms)
  useEffect(() => {
    // Check if auto-scroll should be paused
    const isOutputOpen = Boolean(currentExec.output || currentExec.status === 'RUNNING');
    const isPaused = isHovered || !isInView || isOutputOpen || isTouching;

    if (isPaused) return;

    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % examples.length);
    }, 2000);

    return () => clearTimeout(timer);
  }, [activeIndex, isHovered, isInView, isTouching, currentExec.output, currentExec.status, examples.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % examples.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const handleSelectTab = (index) => {
    setActiveIndex(index);
  };

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunCode = (id, expectedOutput) => {
    setExecStates((prev) => ({
      ...prev,
      [id]: { status: 'RUNNING', output: null },
    }));

    setTimeout(() => {
      setExecStates((prev) => ({
        ...prev,
        [id]: { status: 'COMPLETED', output: expectedOutput },
      }));
    }, 600);
  };

  const handleClearOutput = (id) => {
    setExecStates((prev) => ({
      ...prev,
      [id]: { status: 'READY', output: null },
    }));
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsTouching(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX.current;

      if (diffX < -50) {
        // Swipe Left -> Next
        handleNext();
      } else if (diffX > 50) {
        // Swipe Right -> Prev
        handlePrev();
      }
    }
    touchStartX.current = null;
    setIsTouching(false);
  };

  const lines = currentExample.code.split('\n');

  return (
    <section
      id="terminal"
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative py-20 sm:py-28 px-4 sm:px-8 select-none"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={prefersReduced ? {} : staggerContainer}
        className="max-w-4xl mx-auto w-full space-y-6"
      >
        
        {/* Section Header */}
        <motion.div variants={fadeUp} className="flex flex-col items-center text-center space-y-2">
          <span className="font-mono text-xs tracking-widest uppercase font-bold text-spider-red flex items-center gap-2">
            <Cpu className="w-4 h-4 animate-spin-slow" />
            INTERACTIVE CODE LAB
          </span>
          <h2 className="font-orbitron font-black text-3xl sm:text-5xl uppercase tracking-tight">
            CODE <span className="text-spider-red">EXPLORER</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm opacity-75 max-w-lg">
            Explore live algorithms, developer configurations, and full-stack logic powering the portfolio.
          </p>
        </motion.div>

        {/* Horizontal Navigation Tabs & Prev/Next Toolbar */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Scrollable Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            {examples.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id || index}
                  onClick={() => handleSelectTab(index)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-2 ${
                    isActive
                      ? 'bg-spider-red text-white border-spider-red shadow-spider-red scale-105'
                      : isDark
                      ? 'bg-spider-night-card border-spider-red/20 text-mono-300 hover:border-spider-red/60'
                      : 'bg-white border-spider-blue/20 text-spider-night hover:border-spider-blue/60 shadow-sm'
                  }`}
                >
                  <span className="text-[10px] opacity-75">{index + 1}.</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Prev/Next Controls & Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs font-bold text-spider-blue-electric">
              0{activeIndex + 1} / 0{examples.length}
            </span>

            <div className="flex items-center gap-1">
              <motion.button
                onClick={handlePrev}
                data-cursor-text="PREV"
                whileHover={prefersReduced ? {} : { scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-xl border transition-all ${
                  isDark
                    ? 'border-spider-red/30 bg-spider-night-card hover:bg-spider-red hover:text-white'
                    : 'border-spider-blue/30 bg-white hover:bg-spider-blue hover:text-white shadow-sm'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={handleNext}
                data-cursor-text="NEXT"
                whileHover={prefersReduced ? {} : { scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-xl border transition-all ${
                  isDark
                    ? 'border-spider-red/30 bg-spider-night-card hover:bg-spider-red hover:text-white'
                    : 'border-spider-blue/30 bg-white hover:bg-spider-blue hover:text-white shadow-sm'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Code Editor Window Container */}
        <motion.div
          variants={fadeUp}
          className={`rounded-3xl border-2 overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            isDark
              ? 'bg-spider-night-card border-spider-red/40 text-white shadow-spider-red'
              : 'bg-white border-spider-blue/30 text-spider-night shadow-card-light'
          }`}
        >
          
          {/* Editor Header Bar */}
          <div className={`px-6 py-3.5 border-b flex items-center justify-between font-mono text-xs ${
            isDark ? 'border-spider-red/20 bg-spider-night/60' : 'border-spider-blue/15 bg-slate-50'
          }`}>
            {/* Traffic Light Window Control Dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-spider-red shadow-[0_0_6px_#E62429]" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-spider-blue shadow-[0_0_6px_#2563EB]" />
            </div>

            {/* Active File Title */}
            <div className="flex items-center gap-2 font-bold text-spider-blue-electric">
              <Terminal className="w-3.5 h-3.5 text-spider-red" />
              <span>{currentExample.title}</span>
              <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider bg-spider-red/10 text-spider-red font-mono">
                {currentExample.language}
              </span>
            </div>

            {/* Copy Button */}
            <motion.button
              onClick={() => handleCopy(currentExample.id, currentExample.code)}
              data-cursor-text="COPY"
              whileHover={prefersReduced ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-xs font-mono font-bold opacity-75 hover:opacity-100 hover:text-spider-red transition-all p-1"
            >
              {copiedId === currentExample.id ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="text-[10px] hidden sm:inline">
                {copiedId === currentExample.id ? 'COPIED' : 'COPY'}
              </span>
            </motion.button>
          </div>

          {/* Code Editor Body with Framer Motion Smooth Transition */}
          <div className="relative p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExample.id || activeIndex}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.35, ease: ease.out }}
                className="space-y-1"
              >
                {lines.map((line, idx) => (
                  <div key={idx} className="flex">
                    <span className="w-8 opacity-35 select-none text-right mr-4 font-mono text-xs text-spider-red font-bold">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre font-semibold">
                      {line}
                    </span>
                  </div>
                ))}
                {/* Blinking cursor */}
                <span className="inline-block w-2 h-4 align-middle ml-1 animate-pulse bg-spider-red shadow-[0_0_8px_#E62429]" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Animated Output Console Panel (If Run) */}
          <AnimatePresence>
            {currentExec.output && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: ease.cinematic }}
                className={`border-t font-mono text-xs p-5 space-y-3 ${
                  isDark
                    ? 'bg-black/90 border-spider-red/30 text-emerald-400'
                    : 'bg-slate-900 border-spider-blue/30 text-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-mono-400 uppercase tracking-widest border-b border-white/10 pb-2">
                  <span className="text-spider-red font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    EXECUTION CONSOLE // OUTPUT
                  </span>

                  <button
                    onClick={() => handleClearOutput(currentExample.id)}
                    className="hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>CLEAR OUTPUT</span>
                  </button>
                </div>

                <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-emerald-300">
{`> ${currentExec.output}`}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Footer Bar with ▶ RUN CODE Button & Status */}
          <div className={`px-6 py-3 border-t flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] ${
            isDark ? 'border-spider-red/20 bg-spider-night/80' : 'border-spider-blue/15 bg-slate-50'
          }`}>
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <span className="flex items-center gap-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full ${
                  currentExec.status === 'RUNNING'
                    ? 'bg-amber-400 animate-ping'
                    : currentExec.status === 'COMPLETED'
                    ? 'bg-emerald-400'
                    : 'bg-spider-blue'
                }`} />
                <span className={
                  currentExec.status === 'RUNNING'
                    ? 'text-amber-400'
                    : currentExec.status === 'COMPLETED'
                    ? 'text-emerald-400'
                    : 'text-spider-blue-electric'
                }>
                  ● {currentExec.status}
                </span>
              </span>

              <span className="hidden sm:inline opacity-50">•</span>
              <span className="hidden sm:inline opacity-75 text-spider-red font-bold">
                ENGINE: V8 & JAVA RUNTIME
              </span>
            </div>

            {/* RUN CODE Action Button */}
            <motion.button
              onClick={() => handleRunCode(currentExample.id, currentExample.output)}
              disabled={currentExec.status === 'RUNNING'}
              data-cursor-text="RUN"
              whileHover={prefersReduced || currentExec.status === 'RUNNING' ? {} : { y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-5 py-2 rounded-xl font-orbitron font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                currentExec.status === 'RUNNING'
                  ? 'bg-amber-500 text-black cursor-wait opacity-80'
                  : 'bg-spider-red text-white hover:bg-spider-red-dark shadow-spider-red'
              }`}
            >
              <Play className={`w-3.5 h-3.5 fill-current ${currentExec.status === 'RUNNING' ? 'animate-spin' : ''}`} />
              <span>{currentExec.status === 'RUNNING' ? 'RUNNING...' : '▶ RUN CODE'}</span>
            </motion.button>
          </div>

        </motion.div>

      </motion.div>
    </section>
  );
}
