import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Cpu, Activity, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { profileData } from '../data/profile';
import { ease } from '../utils/animations';

export default function HUDOverlay({ activeSection, theme = 'dark' }) {
  const [collapsed, setCollapsed] = useState(true);
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const sectionInfo = profileData.assistant.sections[activeSection] || {
    status: "ONLINE",
    message: "SUBJECT: SHUBHAM MUNDE // SOFTWARE ENGINEER"
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.8, ease: ease.cinematic }}
      aria-label="WEB-OS HUD Telemetry System"
      className="fixed bottom-3 right-3 sm:bottom-5 sm:right-6 z-30 select-none max-w-[220px] sm:max-w-xs pointer-events-auto"
    >
      <div className={`p-3.5 sm:p-4 rounded-2xl border-2 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        isDark
          ? 'bg-spider-night-card/90 border-spider-red/40 text-white shadow-spider-red'
          : 'bg-white/95 border-spider-blue/30 text-spider-night shadow-spider-blue'
      }`}>
        {/* Header Bar */}
        <div className="flex items-center justify-between font-mono text-[10px] pb-2 border-b border-current/10">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-spider-red">
            <Cpu className="w-3.5 h-3.5 animate-pulse text-spider-red" />
            <span>WEB-OS // NOVA</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[9px] font-semibold text-spider-blue-electric">
              <Activity className="w-2.5 h-2.5 animate-pulse" />
              {sectionInfo.status}
            </span>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="opacity-60 hover:opacity-100 p-0.5 transition-opacity"
              aria-label="Toggle HUD Telemetry"
            >
              {collapsed ? <ChevronUp className="w-3 h-3 text-spider-red" /> : <ChevronDown className="w-3 h-3 text-spider-red" />}
            </button>
          </div>
        </div>

        {/* Expandable Body */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: ease.cinematic }}
              className="space-y-2 pt-2.5 overflow-hidden"
            >
              {/* Context telemetry readout */}
              <motion.p
                key={activeSection}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-rajdhani text-xs font-semibold leading-tight opacity-90"
              >
                {sectionInfo.message}
              </motion.p>

              {/* Status footer metrics */}
              <div className="flex items-center justify-between font-mono text-[9px] opacity-75 border-t border-current/10 pt-1.5">
                <span className="text-spider-red font-bold">SECTOR: {activeSection.toUpperCase()}</span>
                <span className="flex items-center gap-1 text-spider-blue-electric font-semibold">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  SYS_OK
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
