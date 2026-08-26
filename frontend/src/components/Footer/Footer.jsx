import React from 'react';
import { ArrowUp, Shield, Cpu } from 'lucide-react';
import { profileData } from '../../data/profile';
import { sound } from '../../utils/audio';

export default function Footer({ onScrollTop }) {
  return (
    <footer className="relative border-t border-slate-800/80 bg-[#030508] py-12 px-4 sm:px-6 lg:px-8 z-10 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand & Telemetry */}
        <div className="space-y-1 text-center md:text-left">
          <div className="font-orbitron font-extrabold text-sm tracking-widest text-white flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-hud-cyan animate-ping" />
            <span>SHUBHAM MUNDE</span>
            <span className="text-hud-cyan font-mono text-xs">// ARCHITECT</span>
          </div>
          <p className="font-mono text-xs text-slate-500">
            ENGINEERED WITH REACT, THREE.JS, & NODE.JS • {new Date().getFullYear()} ALL SYSTEMS NOMINAL
          </p>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-400 bg-surface/60 px-4 py-2 rounded-full border border-slate-800">
          <span>LATENCY: 12ms</span>
          <span>•</span>
          <span>GPU: ACCELERATED</span>
          <span>•</span>
          <span className="text-hud-emerald">STATUS: OPTIMAL</span>
        </div>

        {/* Right: Scroll to top Arc Reactor trigger */}
        <button
          onClick={() => {
            sound.playReactorBoot();
            onScrollTop();
          }}
          className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-hud-cyan/40 hover:border-hud-cyan text-hud-cyan text-xs font-orbitron font-bold tracking-wider uppercase transition-all shadow-sm active:scale-95"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          <span>RETURN TO TOP</span>
        </button>

      </div>
    </footer>
  );
}
