import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, ArrowRight, X, CheckCircle, Sparkles, History } from 'lucide-react';
import { projectCategories } from '../data/projects';
import { profileData } from '../data/profile';
import { fadeUp, scaleReveal, staggerContainer, sectionViewport, ease } from '../utils/animations';

export default function Projects({ theme = 'dark', heroData }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const isDark = theme === 'dark';
  const prefersReduced = useReducedMotion();

  const firstPortfolioUrl = heroData?.socials?.firstPortfolio || profileData.socials.firstPortfolio;

  const projectCardVariant = (idx) => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, delay: idx * 0.1, ease: ease.cinematic },
    },
  });

  return (
    <section id="projects" className="relative py-24 sm:py-32 px-4 sm:px-8">
      {/* Background Web Pattern */}
      <div className={`absolute inset-0 pointer-events-none opacity-30 ${
        isDark ? 'bg-web-grid-dark' : 'bg-web-grid-light'
      }`} />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={prefersReduced ? {} : staggerContainer}
          className="flex flex-col items-start mb-20"
        >
          <motion.span variants={fadeUp} className="font-mono text-xs tracking-widest uppercase font-bold text-spider-red mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-spider-red animate-ping" />
            WHAT I'VE BUILT
          </motion.span>

          <motion.div variants={fadeUp} className="flex flex-wrap items-baseline gap-4 sm:gap-6">
            <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight">
              SELECTED
            </h2>
            <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-stroke-blue hover:text-spider-blue">
              PROJECTS.
            </h2>
          </motion.div>

          <motion.p variants={fadeUp} className="font-sans text-sm sm:text-base leading-relaxed opacity-80 max-w-2xl mt-4">
            A selection of projects built while exploring web development, full-stack engineering, interactive experiences, and practical software solutions.
          </motion.p>
        </motion.div>

        {/* Category Sections */}
        <div className="space-y-24">
          {projectCategories.map((category, catIdx) => (
            <motion.div
              key={category.id}
              initial="hidden"
              whileInView="visible"
              viewport={sectionViewport}
              variants={prefersReduced ? {} : staggerContainer}
              className="space-y-8"
            >
              
              {/* Category Header Banner */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b pb-4 border-current/15 gap-2"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-orbitron font-black text-xl sm:text-2xl text-spider-red">
                    CATEGORY {category.categoryNumber}
                  </span>
                  <span className="opacity-30">•</span>
                  <h3 className="font-orbitron font-bold text-lg sm:text-2xl uppercase tracking-wider">
                    {category.categoryTitle}
                  </h3>
                </div>

                <span className="font-mono text-xs text-spider-blue-electric font-semibold tracking-wider">
                  {category.subtitle}
                </span>
              </motion.div>

              {/* Projects Grid for this Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.projects.map((project, pIdx) => (
                  <motion.div
                    key={project.id}
                    variants={projectCardVariant(pIdx)}
                    whileHover={prefersReduced ? {} : { y: -5 }}
                    onClick={() => setSelectedProject(project)}
                    data-cursor-text="VIEW PROJECT"
                    className={`group relative rounded-3xl border-2 overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                      isDark
                        ? 'bg-spider-night-card border-spider-red/30 hover:border-spider-red hover:shadow-spider-red text-white'
                        : 'bg-white border-spider-blue/20 hover:border-spider-blue hover:shadow-card-light text-spider-night'
                    }`}
                  >
                    {/* Top Preview Image Container */}
                    <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-spider-night">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover filter contrast-110 opacity-75 group-hover:scale-105 group-hover:opacity-95 transition-all duration-700 ease-out"
                      />

                      {/* Web Grid Overlay */}
                      <div className="absolute inset-0 bg-web-grid-dark opacity-35 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-mono tracking-widest font-black backdrop-blur-md bg-spider-red text-white shadow-[0_0_12px_rgba(230,36,41,0.6)]">
                          {project.badge}
                        </span>

                        <div className="w-8 h-8 rounded-full border border-white/20 bg-spider-night/80 flex items-center justify-center backdrop-blur-md group-hover:rotate-45 group-hover:bg-spider-blue transition-all duration-300 text-white">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Bottom Project Number Overlay */}
                      <div className="absolute bottom-3 left-4 font-orbitron font-black text-4xl text-white/30 tracking-tight">
                        {project.number}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-orbitron font-black text-xl sm:text-2xl uppercase tracking-wide group-hover:text-spider-red group-hover:translate-x-1 transition-all">
                          {project.title}
                        </h4>

                        <p className="font-sans text-xs sm:text-sm leading-relaxed opacity-80 mt-2">
                          {project.summary}
                        </p>
                      </div>

                      {/* Tech Tags & Actions */}
                      <div className="pt-4 border-t border-current/10 space-y-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border ${
                                tIdx % 2 === 0
                                  ? 'bg-spider-red/10 border-spider-red/30 text-spider-red'
                                  : 'bg-spider-blue/10 border-spider-blue/30 text-spider-blue-electric'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Direct CTA Links */}
                        <div className="flex items-center gap-3 pt-2">
                          {project.liveUrl && (
                            <motion.a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              data-cursor-text="DEMO"
                              whileHover={{ y: -2, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-4 py-2 rounded-xl text-xs font-orbitron font-bold flex items-center gap-1.5 bg-spider-red text-white hover:bg-spider-red-dark shadow-spider-red transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>VIEW DEMO</span>
                            </motion.a>
                          )}

                          {project.githubUrl && (
                            <motion.a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              data-cursor-text="CODE"
                              whileHover={{ y: -2, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`px-4 py-2 rounded-xl border text-xs font-orbitron font-semibold flex items-center gap-1.5 transition-all ${
                                isDark
                                  ? 'bg-spider-night-surface border-spider-blue/40 text-white hover:border-spider-blue'
                                  : 'bg-spider-day-surface border-spider-blue/30 text-spider-night hover:border-spider-blue'
                              }`}
                            >
                              <Github className="w-3.5 h-3.5 text-spider-blue" />
                              <span>SOURCE</span>
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>

            </motion.div>
          ))}
        </div>

        {/* Developer Journey Archive: First Portfolio Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={prefersReduced ? {} : fadeUp}
          className="mt-20 sm:mt-24 pt-12 border-t border-current/15"
        >
          <div className={`relative p-8 sm:p-10 rounded-3xl border-2 overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-spider-night-card via-spider-night to-spider-night-surface border-spider-blue/40 shadow-spider-blue text-white'
              : 'bg-gradient-to-br from-white via-spider-day-card to-slate-50 border-spider-blue/30 shadow-card-light text-spider-night'
          }`}>
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-spider-blue/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-spider-red/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg font-mono text-[11px] font-bold tracking-widest uppercase bg-spider-blue/15 border border-spider-blue/40 text-spider-blue-electric">
                  <History className="w-3.5 h-3.5" />
                  <span>ARCHIVE_01 // PORTFOLIO ORIGIN</span>
                </div>

                <h3 className="font-orbitron font-black text-2xl sm:text-3xl uppercase tracking-wide">
                  MY FIRST PORTFOLIO
                </h3>

                <p className="font-mono text-xs sm:text-sm text-spider-red font-bold">
                  "Where my journey in web development began."
                </p>

                <p className="font-sans text-xs sm:text-sm leading-relaxed opacity-80">
                  Explore the roots of my engineering journey — from initial web experiments to crafting production-grade full-stack systems and high frame-rate 3D WebGL experiences.
                </p>
              </div>

              <div className="flex-shrink-0">
                <motion.a
                  href={firstPortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-text="ARCHIVE"
                  whileHover={prefersReduced ? {} : { y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-4 rounded-2xl border-2 font-orbitron font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2.5 bg-spider-blue text-white hover:bg-blue-600 border-spider-blue shadow-spider-blue transition-all"
                >
                  <span>VIEW THE ORIGINAL</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Detailed Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-spider-night/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.35, ease: ease.cinematic }}
              className={`relative w-full max-w-3xl rounded-3xl border-2 p-6 sm:p-8 z-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${
                isDark
                  ? 'bg-spider-night-card border-spider-red/40 text-white shadow-spider-red'
                  : 'bg-white border-spider-blue/30 text-spider-night shadow-spider-blue'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b pb-4 mb-6 border-current/10">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-spider-red font-bold uppercase block">
                    PROJECT DOSSIER // {selectedProject.number}
                  </span>
                  <h3 className="font-orbitron font-black text-2xl sm:text-3xl uppercase tracking-wide mt-1">
                    {selectedProject.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  data-cursor-text="CLOSE"
                  className="p-2 rounded-full border border-current/20 hover:bg-spider-red hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                <p className="font-sans text-sm sm:text-base leading-relaxed opacity-90">
                  {selectedProject.description}
                </p>

                {/* Key Technical Highlights */}
                <div>
                  <h4 className="font-orbitron text-xs font-bold uppercase tracking-wider text-spider-blue-electric mb-3">
                    Architectural Highlights
                  </h4>
                  <div className="space-y-2 font-sans text-xs sm:text-sm">
                    {selectedProject.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-spider-red shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics / Specifications Grid */}
                {selectedProject.metrics && (
                  <div className={`p-4 rounded-2xl border grid grid-cols-3 gap-3 font-mono text-xs ${
                    isDark ? 'bg-spider-night border-spider-red/20' : 'bg-spider-day-card border-spider-blue/20'
                  }`}>
                    {Object.entries(selectedProject.metrics).map(([key, val], mIdx) => (
                      <div key={mIdx}>
                        <span className="opacity-60 text-[10px] uppercase block">{key}</span>
                        <span className="font-bold text-spider-red">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Modal Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-current/10">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl border border-spider-blue/40 text-xs font-orbitron font-semibold flex items-center gap-2 hover:bg-spider-blue/10 transition-all"
                    >
                      <Github className="w-4 h-4 text-spider-blue" />
                      VIEW REPOSITORY
                    </a>
                  )}

                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl text-xs font-orbitron font-bold flex items-center gap-2 bg-spider-red text-white hover:bg-spider-red-dark shadow-spider-red transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      LAUNCH LIVE DEMO
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
