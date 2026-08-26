import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle, Terminal } from 'lucide-react';
import { experienceData } from '../../data/experience';

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-hud-cyan/30 text-xs font-mono text-hud-cyan uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5" />
            <span>MISSION LOG // OPERATIONAL TIMELINE</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            MISSION HISTORY & DEPLOYMENTS
          </h2>
          <p className="font-rajdhani text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Chronological log of full-stack engineering contracts, laboratory research, and software deployments.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 lg:ml-32 space-y-10 pl-6 sm:pl-10">
          {experienceData.map((mission, idx) => (
            <motion.div
              key={mission.id || idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative group"
            >
              {/* Pulsing Timeline Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-black border-2 border-hud-cyan group-hover:bg-hud-cyan group-hover:shadow-[0_0_15px_#00F5FF] transition-all flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-hud-cyan animate-ping" />
              </div>

              {/* Mission Card */}
              <div className="hud-card p-6 sm:p-8 rounded-2xl hud-brackets space-y-5">
                
                {/* Header details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-hud-cyan uppercase tracking-widest">
                      {mission.status}
                    </span>
                    <h3 className="font-orbitron font-bold text-xl sm:text-2xl text-white tracking-wide mt-0.5">
                      {mission.role}
                    </h3>
                    <div className="font-rajdhani text-base text-slate-300 font-semibold mt-0.5">
                      {mission.company}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-md border border-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-hud-cyan" />
                      {mission.period}
                    </span>
                  </div>
                </div>

                {/* Narrative description */}
                <p className="font-rajdhani text-base sm:text-lg text-slate-300 leading-relaxed">
                  {mission.description}
                </p>

                {/* Key Deliverables */}
                {mission.deliverables && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      KEY DELIVERABLES & IMPACT:
                    </span>
                    <ul className="space-y-2 font-rajdhani text-sm sm:text-base text-slate-200">
                      {mission.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-hud-cyan shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {mission.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-md bg-black/60 border border-slate-800 text-[11px] font-mono text-hud-cyan/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
