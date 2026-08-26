import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity } from 'lucide-react';

const sectionTelemetry = {
  home: {
    status: 'COMMAND CENTER ONLINE',
    message: 'Analyzing developer biometrics. Target locked on Shubham Munde.',
    sub: 'HUD SCANNING ACTIVE',
  },
  about: {
    status: 'NEURAL PROFILE DECRYPTED',
    message: 'Reviewing engineering credentials, core strengths, and architecture.',
    sub: 'DOSSIER CLEARANCE: ALPHA',
  },
  skills: {
    status: 'SYSTEM ARSENAL ACTIVE',
    message: 'Matrix of 20+ technical systems loaded. 60 FPS GPU acceleration ready.',
    sub: 'TIER-1 ARCHITECTURE',
  },
  projects: {
    status: 'LABORATORY PROTOTYPES',
    message: 'Accessing classified repositories. Full-stack microservices online.',
    sub: 'LEVEL 5 AUTHORIZATION',
  },
  experience: {
    status: 'MISSION LOG SYNCHRONIZED',
    message: 'Tracking operational timeline and production software deployments.',
    sub: 'VERIFIED DEPLOYMENTS',
  },
  contact: {
    status: 'TRANSMISSION UPLINK READY',
    message: 'Comms gateway open on port 5000. Ready to broadcast message payload.',
    sub: 'ENCRYPTION: AES-256',
  },
};

export default function AiAssistantOverlay({ activeSection }) {
  const current = sectionTelemetry[activeSection] || sectionTelemetry.home;

  return (
    <motion.aside
      aria-label="JARVIS AI HUD System"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-30 hidden sm:block max-w-xs"
    >
      <div className="hud-card p-4 rounded-xl hud-brackets border-hud-cyan/40 bg-[#030508]/90 shadow-2xl backdrop-blur-xl space-y-2 select-none">
        {/* Top Header */}
        <div className="flex items-center justify-between text-[10px] font-mono text-hud-cyan">
          <span className="flex items-center gap-1.5 font-bold">
            <Cpu className="w-3.5 h-3.5 text-hud-cyan animate-pulse" />
            JARVIS // HUD TELEMETRY
          </span>
          <span className="flex items-center gap-1 text-hud-emerald">
            <Activity className="w-3 h-3 animate-pulse" />
            ACTIVE
          </span>
        </div>

        {/* Dynamic Context Message */}
        <p className="font-rajdhani text-xs text-slate-200 font-medium leading-tight">
          {current.message}
        </p>

        {/* Sub telemetry badge */}
        <div className="text-[9px] font-mono text-slate-500 flex justify-between border-t border-slate-800/80 pt-1.5">
          <span>STATUS: {current.status}</span>
          <span className="text-hud-cyan">{current.sub}</span>
        </div>
      </div>
    </motion.aside>
  );
}
