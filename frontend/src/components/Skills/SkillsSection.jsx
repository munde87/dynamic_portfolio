import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Layers, Box, Atom, FileCode, Palette, Zap, Server, Database, Shield, Network, Cloud, Coffee, Binary, Table, GitBranch, Flame, Radio } from 'lucide-react';
import { skillCategories } from '../../data/skills';
import { sound } from '../../utils/audio';

// Dynamic icon mapper
const iconMap = {
  Atom: Atom,
  Box: Box,
  FileCode: FileCode,
  Palette: Palette,
  Zap: Zap,
  Code: Terminal,
  Server: Server,
  Cpu: Cpu,
  Database: Database,
  Shield: Shield,
  Network: Network,
  Cloud: Cloud,
  Coffee: Coffee,
  Binary: Binary,
  Terminal: Terminal,
  Table: Table,
  GitBranch: GitBranch,
  TerminalSquare: Terminal,
  Flame: Flame,
  Radio: Radio,
  Layers: Layers,
};

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].id);
  const [inspectedSkill, setInspectedSkill] = useState(skillCategories[0].skills[0]);

  const currentCategory = skillCategories.find((c) => c.id === activeCategory) || skillCategories[0];

  const handleSkillHover = (skill) => {
    sound.playHover();
    setInspectedSkill(skill);
  };

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-hud-cyan/30 text-xs font-mono text-hud-cyan uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5" />
            <span>SYSTEM MATRIX // TECH CAPABILITIES</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            TECHNICAL ARSENAL & SYSTEMS
          </h2>
          <p className="font-rajdhani text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Categorized technical capabilities organized by architectural domain. Hover to inspect tactical specs.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {skillCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat.id);
                  setInspectedSkill(cat.skills[0]);
                }}
                className={`px-5 py-2.5 rounded-xl font-orbitron text-xs tracking-wider uppercase transition-all duration-200 border ${
                  isActive
                    ? 'bg-hud-cyan text-slate-950 font-bold border-hud-cyan shadow-arc-cyan'
                    : 'bg-surface/80 text-slate-300 border-slate-800 hover:border-hud-cyan/40 hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Main Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Skills Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentCategory.skills.map((skill, idx) => {
              const IconComp = iconMap[skill.icon] || Cpu;
              const isSelected = inspectedSkill?.name === skill.name;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onMouseEnter={() => handleSkillHover(skill)}
                  className={`p-5 rounded-xl transition-all duration-200 cursor-pointer border select-none ${
                    isSelected
                      ? 'bg-gradient-to-b from-slate-900 to-black border-hud-cyan shadow-[0_0_20px_rgba(0,245,255,0.25)]'
                      : 'bg-surface/90 border-slate-800/90 hover:border-hud-cyan/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-hud-cyan/20 text-hud-cyan' : 'bg-black/50 text-slate-400'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-hud-cyan font-bold">
                      {skill.level}%
                    </span>
                  </div>

                  <h3 className="font-orbitron font-bold text-sm text-white tracking-wider mb-1">
                    {skill.name}
                  </h3>

                  {/* Level progress meter */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-hud-cyan to-hud-blue rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Tactical HUD Skill Inspector Telemetry */}
          <div className="lg:col-span-4 hud-card p-6 sm:p-7 rounded-2xl hud-brackets space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-hud-cyan uppercase tracking-widest">
                // SYSTEM INSPECTOR
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-hud-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-hud-emerald animate-ping" />
                CALIBRATED
              </span>
            </div>

            {inspectedSkill && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-400 uppercase">
                    SELECTED MODULE:
                  </div>
                  <h4 className="font-orbitron font-extrabold text-2xl text-white tracking-wide text-glow-cyan">
                    {inspectedSkill.name}
                  </h4>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    TACTICAL CAPABILITY & APPLICATION:
                  </span>
                  <p className="font-rajdhani text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                    {inspectedSkill.desc}
                  </p>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">EFFICIENCY SCORE:</span>
                    <span className="text-hud-cyan font-bold">{inspectedSkill.level} / 100</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">DOMAIN CATEGORY:</span>
                    <span className="text-slate-300 uppercase">{currentCategory.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">DEPLOYMENT STATUS:</span>
                    <span className="text-hud-emerald font-bold">READY FOR PRODUCTION</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
