import React from 'react';
import { motion } from 'framer-motion';
import { User, Download, Code2, Cpu, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { profileData } from '../../data/profile';
import { sound } from '../../utils/audio';

export default function AboutSection() {
  const handleDownloadResume = () => {
    sound.playClick();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F5FF', '#FF2A4D', '#FFB800'],
    });
    window.open(`mailto:${profileData.email}?subject=Resume Request // Shubham Munde`, '_blank');
  };

  const coreStrengths = [
    { title: "FULL-STACK ARCHITECTURE", desc: "Production-grade Node.js/Express APIs, MongoDB schemas, and responsive React web interfaces." },
    { title: "CREATIVE 3D COMPUTING", desc: "Interactive Three.js, React Three Fiber, GLSL shaders, and immersive GPU animations." },
    { title: "SECURITY & RELIABILITY", desc: "Dual JWT auth, bcrypt salting, rate-limiting gates, and robust error handling boundaries." },
    { title: "PERFORMANCE OPTIMIZATION", desc: "Asset minification, lazy loading, memory management, and 60 FPS rendering pipelines." },
  ];

  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 lg:px-12 z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-hud-cyan/30 text-xs font-mono text-hud-cyan uppercase tracking-widest">
            <User className="w-3.5 h-3.5" />
            <span>IDENTITY // BIOMETRIC DOSSIER</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            NEURAL PROFILE & FOUNDATION
          </h2>
          <p className="font-rajdhani text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Deep dive into the architectural principles, computer engineering background, and core technical capabilities.
          </p>
        </div>

        {/* Dossier Grid — Clean, Open Futuristic Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Biometric ID Panel (Open, No Heavy Box) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-surface/50 border border-slate-800/80 backdrop-blur-md space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="text-[10px] font-mono text-hud-cyan tracking-widest uppercase">
                  CLASSIFIED DOSSIER
                </div>
                <div className="font-orbitron font-bold text-xl text-white mt-0.5">
                  SHUBHAM MUNDE
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-black/60 border border-hud-cyan/40 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-hud-cyan animate-pulse" />
              </div>
            </div>

            {/* Spec details list */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500 uppercase">CALLSIGN:</span>
                <span className="text-hud-cyan font-bold">{profileData.callsign}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500 uppercase">ROLE:</span>
                <span className="text-slate-200">Full Stack Engineer</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500 uppercase">EDUCATION:</span>
                <span className="text-slate-200">B.E. Computer Engineering</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500 uppercase">BASE:</span>
                <span className="text-slate-200">{profileData.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500 uppercase">STATUS:</span>
                <span className="text-hud-emerald font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-hud-emerald animate-ping" />
                  AVAILABLE
                </span>
              </div>
            </div>

            {/* Resume Request CTA */}
            <button
              onClick={handleDownloadResume}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-hud-cyan/20 to-hud-blue/20 hover:from-hud-cyan hover:to-hud-blue border border-hud-cyan/40 text-hud-cyan hover:text-slate-950 font-orbitron font-bold text-xs tracking-wider uppercase transition-all shadow-sm group"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>REQUEST OFFICIAL RESUME / CV</span>
            </button>
          </motion.div>

          {/* Right Column: Bio & 4 Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Narrative */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-hud-cyan uppercase tracking-widest">
                <Code2 className="w-4 h-4" />
                <span>ARCHITECTURAL PHILOSOPHY</span>
              </div>
              <div className="space-y-3 font-rajdhani text-slate-300 text-lg sm:text-xl leading-relaxed">
                {profileData.bio.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreStrengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-surface/40 border border-slate-800/80 hover:border-hud-cyan/40 transition-all space-y-2 group"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hud-cyan group-hover:scale-110 transition-transform" />
                    <h3 className="font-orbitron font-bold text-sm text-white tracking-wider">
                      {strength.title}
                    </h3>
                  </div>
                  <p className="font-rajdhani text-sm text-slate-400 leading-normal">
                    {strength.desc}
                  </p>
                </div>
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
