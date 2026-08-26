import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Shield, Terminal, Zap } from 'lucide-react';
import { sound } from '../../utils/audio';

export default function Navbar({ activeSection, onNavigate }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: '01 // HOME' },
    { id: 'about', label: '02 // IDENTITY' },
    { id: 'skills', label: '03 // SYSTEMS' },
    { id: 'projects', label: '04 // LAB' },
    { id: 'experience', label: '05 // MISSIONS' },
    { id: 'contact', label: '06 // TRANSMISSION' },
  ];

  const handleAudioToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const handleItemClick = (id) => {
    sound.playClick();
    onNavigate(id);
    setIsMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-xl border-b border-hud-cyan/20 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand / Callsign Logo */}
        <div
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 rounded-lg bg-surface border border-hud-cyan/40 flex items-center justify-center group-hover:border-hud-cyan transition-all shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-hud-cyan animate-pulse-glow" />
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-hud-cyan" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-hud-cyan" />
          </div>
          <div>
            <div className="font-orbitron font-extrabold text-base tracking-wider text-white flex items-center gap-1">
              SMASH <span className="text-hud-cyan text-xs font-mono">// OS</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-widest">
              SHUBHAM MUNDE
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface/60 border border-slate-800/80 rounded-full px-3 py-1.5 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                onMouseEnter={() => sound.playHover()}
                className={`relative px-4 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-slate-950 font-bold bg-hud-cyan shadow-arc-cyan'
                    : 'text-slate-300 hover:text-hud-cyan hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Tactical Controls (Audio Synthesizer Toggle & Mobile Menu) */}
        <div className="flex items-center gap-3">
          {/* Audio Synthesizer Control */}
          <button
            onClick={handleAudioToggle}
            className={`p-2.5 rounded-lg border transition-all ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500'
                : 'bg-surface border-hud-cyan/40 text-hud-cyan hover:border-hud-cyan shadow-sm'
            }`}
            title={isMuted ? 'Audio Synthesizer Muted' : 'Audio Synthesizer Active'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Quick Connect CTA */}
          <button
            onClick={() => handleItemClick('contact')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-slate-900 border border-hud-crimson/50 hover:border-hud-crimson text-xs font-orbitron font-semibold text-hud-crimson tracking-wider uppercase transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>TRANSMIT</span>
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2.5 rounded-lg bg-surface border border-slate-800 text-slate-300 hover:text-hud-cyan"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div className="md:hidden mt-3 px-4 pt-2 pb-6 bg-black/95 border-b border-hud-cyan/30 backdrop-blur-2xl space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-mono text-sm tracking-wider flex items-center justify-between ${
                  isActive
                    ? 'bg-hud-cyan text-slate-950 font-bold shadow-arc-cyan'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <Zap className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
