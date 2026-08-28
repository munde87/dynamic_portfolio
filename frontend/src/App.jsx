import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

// Lazy load below-the-fold and heavy components
const TechMarquee = lazy(() => import('./components/TechMarquee'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Scene = lazy(() => import('./components/Three/Scene'));
const Projects = lazy(() => import('./components/Projects'));
const Experience = lazy(() => import('./components/Experience'));
const CodeTerminal = lazy(() => import('./components/CodeTerminal'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const HUDOverlay = lazy(() => import('./components/HUDOverlay'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'));
const SoundToggle = lazy(() => import('./components/SoundToggle'));

import { fetchHeroData, fetchCodeExamples, fetchResume, fetchExperience, fetchAudioSettings } from './utils/api';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sm_portfolio_theme') || 'dark';
  });
  const [activeSection, setActiveSection] = useState('hero');
  const [resumeOpen, setResumeOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [ripple, setRipple] = useState(null);
  const lenisRef = useRef(null);

  // Dynamic Portfolio Data States from Backend API
  const [heroData, setHeroData] = useState(null);
  const [codeExamples, setCodeExamples] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [experienceData, setExperienceData] = useState(null);
  const [audioData, setAudioData] = useState(null);

  const loadPublicData = async () => {
    try {
      const [hero, code, resume, exp, audio] = await Promise.all([
        fetchHeroData(),
        fetchCodeExamples(),
        fetchResume(),
        fetchExperience(),
        fetchAudioSettings()
      ]);
      if (hero) setHeroData(hero);
      if (code && code.length) setCodeExamples(code);
      setResumeData(resume || null);
      if (exp && exp.length) setExperienceData(exp);
      setAudioData(audio || null);
    } catch (e) {
      console.warn('Backend unavailable, using default profile data.');
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    let reqId;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      reqId = requestAnimationFrame(raf);
    }
    reqId = requestAnimationFrame(raf);

    return () => {
      if (reqId) cancelAnimationFrame(reqId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Sync Theme with DOM <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('sm_portfolio_theme', theme);
  }, [theme]);

  // Section Observer for Active Navigation
  useEffect(() => {
    const sections = [
      'hero',
      'about',
      'skills',
      'reactor',
      'projects',
      'experience',
      'terminal',
      'contact'
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 300;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) {
      try {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { offset: -70 });
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleScrollTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleTheme = (origin) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const rippleColor = nextTheme === 'dark' ? '#050811' : '#ffffff';
    
    setRipple({
      x: origin.x,
      y: origin.y,
      color: rippleColor,
      active: true,
    });

    setTimeout(() => {
      setTheme(nextTheme);
    }, 350);

    setTimeout(() => {
      setRipple(null);
    }, 850);
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-spider-night text-white' : 'bg-mono-50 text-spider-night'
    }`}>
      {/* 1. Page Loader */}
      <AnimatePresence>
        {loading && (
          <Loader onComplete={() => setLoading(false)} theme={theme} />
        )}
      </AnimatePresence>

      {/* 2. Custom Web-Shooter Interactive Cursor */}
      <CustomCursor theme={theme} />

      {/* 3. Expanding Theme Ripple Wave */}
      {ripple && (
        <div
          className="theme-ripple expanding"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${Math.max(window.innerWidth, window.innerHeight) * 2.5}px`,
            height: `${Math.max(window.innerWidth, window.innerHeight) * 2.5}px`,
            backgroundColor: ripple.color,
          }}
        />
      )}

      {/* 4. Global Fixed Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* 5. Main Portfolio Content Flow */}
      <main className="relative z-10">
        <Hero
          onNavigate={handleNavigate}
          theme={theme}
          heroData={heroData}
        />
        
        <Suspense fallback={null}>
          <TechMarquee theme={theme} />
          <About theme={theme} />
          <Skills theme={theme} />
          <Scene theme={theme} />
          <Projects theme={theme} heroData={heroData} />
          <Experience
            theme={theme}
            experienceData={experienceData}
          />
          <CodeTerminal
            theme={theme}
            codeExamples={codeExamples}
          />
          <Contact theme={theme} heroData={heroData} />
        </Suspense>
      </main>

      {/* 6. Footer */}
      <Suspense fallback={null}>
        <Footer
          onScrollTop={handleScrollTop}
          onOpenAdmin={() => setAdminOpen(true)}
          theme={theme}
          heroData={heroData}
        />

        {/* 7. WEB-OS HUD Telemetry */}
        <HUDOverlay activeSection={activeSection} theme={theme} />

        {/* 7.5. Background Audio Sound Toggle */}
        <SoundToggle
          theme={theme}
          audioData={audioData}
          activeSection={activeSection}
        />

        {/* 8. Resume Modal */}
        {resumeOpen && (
          <ResumeModal
            isOpen={resumeOpen}
            onClose={() => setResumeOpen(false)}
            theme={theme}
            resumeData={resumeData}
          />
        )}

        {/* 9. Admin Panel & Control Suite */}
        {adminOpen && (
          <AdminPanel
            isOpen={adminOpen}
            onClose={() => setAdminOpen(false)}
            theme={theme}
            onDataUpdated={loadPublicData}
          />
        )}
      </Suspense>
    </div>
  );
}
