import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';

const JarvisLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('INITIALIZING BOOT PROTOCOL...');
  const [logs, setLogs] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const bootTasks = [
    { threshold: 15, text: 'SYNCHRONIZING QUANTUM NEURAL CORE...', log: '>> NEURAL LINK: ACTIVE' },
    { threshold: 35, text: 'LOADING 3D VECTOR ENVIRONMENT & SHADERS...', log: '>> WEBGL 2.0 CANVAS READY [60 FPS]' },
    { threshold: 55, text: 'FETCHING USER IDENTITY // SHUBHAM MUNDE...', log: '>> BIOMETRICS MATCH: 100%' },
    { threshold: 75, text: 'CALIBRATING ARMOR HUD & TARGETING RETICLES...', log: '>> HUD TELEMETRY: ONLINE' },
    { threshold: 90, text: 'CONNECTING BACKEND REST API RELAYS...', log: '>> COMM GATEWAY: CONNECTED' },
    { threshold: 100, text: 'SYSTEM ONLINE. WELCOME, SHUBHAM.', log: '>> PROTOCOL 7: ALL SYSTEMS NOMINAL' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          sound.playReactorBoot();
          sound.speak("Systems nominal. Welcome, Shubham.");
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 3;
        const boundedNext = Math.min(next, 100);

        // Update task and logs based on progress threshold
        const matchingTask = bootTasks.find(t => boundedNext >= t.threshold && prev < t.threshold);
        if (matchingTask) {
          setCurrentTask(matchingTask.text);
          setLogs((l) => [...l, matchingTask.log]);
          sound.playClick();
        }

        return boundedNext;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030508] text-white p-6 select-none overflow-hidden">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-scanlines opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Central Holographic Reactor Boot Animation */}
      <div className="relative mb-10">
        {/* Outer Rotating Energy Ring */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-hud-cyan/20 border-dashed animate-spin-slow flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border border-hud-crimson/30 animate-spin-reverse flex items-center justify-center" />
        </div>

        {/* Inner Arc Core */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-hud-cyan/20 to-hud-crimson/20 border-2 border-hud-cyan/80 shadow-arc-cyan flex items-center justify-center animate-pulse-glow">
            <span className="font-orbitron font-bold text-2xl text-hud-cyan tracking-wider">
              {progress}%
            </span>
          </div>
        </div>

        {/* Tactical Crosshairs */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-1 bg-hud-cyan" />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-1 bg-hud-cyan" />
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-1 h-3 bg-hud-cyan" />
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-1 h-3 bg-hud-cyan" />
      </div>

      {/* System Status Readout */}
      <div className="w-full max-w-md text-center space-y-3 z-10">
        <div className="flex items-center justify-between text-xs font-mono text-hud-cyan/70 tracking-widest uppercase border-b border-hud-cyan/20 pb-2">
          <span>JARVIS OS v4.2</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-hud-cyan animate-ping" />
            INITIALIZING
          </span>
        </div>

        <p className="font-orbitron text-sm sm:text-base text-slate-200 tracking-wider h-6 text-glow-cyan">
          {currentTask}
        </p>

        {/* Progress Bar with segmented tactical marks */}
        <div className="relative w-full h-2 bg-slate-900/80 rounded-full overflow-hidden border border-hud-cyan/30 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-hud-cyan via-hud-blue to-hud-crimson rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(0,245,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Terminal diagnostic log waterfall */}
        <div className="mt-4 p-3 rounded bg-black/60 border border-slate-800 text-left font-mono text-[11px] text-hud-cyan/80 space-y-1 h-20 overflow-hidden shadow-inner">
          {logs.slice(-3).map((log, i) => (
            <div key={i} className="animate-pulse">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JarvisLoader;
