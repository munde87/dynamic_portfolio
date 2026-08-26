import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ExternalLink, Github, Zap, Shield, X, Code, CheckCircle } from 'lucide-react';
import { initialProjects } from '../../data/projects';
import { fetchProjects } from '../../utils/api';
import { sound } from '../../utils/audio';

export default function ProjectsSection() {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    // Attempt backend sync
    fetchProjects().then((remoteProjects) => {
      if (remoteProjects && remoteProjects.length > 0) {
        // Merge or replace
        const mappedRemote = remoteProjects.map((p, idx) => ({
          id: p._id || `remote_${idx}`,
          title: p.title,
          category: "Full Stack Architecture",
          badge: p.featured ? "FEATURED PROTOCOL" : "CLASSIFIED",
          description: p.description,
          tags: Array.isArray(p.tags) ? p.tags : (p.tags ? p.tags.split(' ') : ['Full Stack']),
          liveUrl: p.liveUrl || 'https://example.com',
          githubUrl: p.githubUrl || 'https://github.com/munde87',
          image: p.imageUrl || '/assets/armor-reference.jpg',
          highlights: [
            "Engineered with scalable Express / MongoDB Atlas microservice",
            "Responsive dynamic client interface optimized for high throughput",
            "Secured with JWT and automated payload validations"
          ],
          stats: {
            latency: "< 45ms",
            architecture: "REST API + Cloud",
            security: "JWT + Bcrypt",
          }
        }));

        setProjects([...initialProjects, ...mappedRemote]);
      }
    });
  }, []);

  const tags = ['ALL', 'Full Stack', 'React', 'Three.js', 'Node.js'];

  const filteredProjects = filter === 'ALL'
    ? projects
    : projects.filter(p => p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  const handleOpenModal = (project) => {
    sound.playClick();
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    sound.playClick();
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-hud-cyan/30 text-xs font-mono text-hud-cyan uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>PROJECT LABORATORY // CLASSIFIED CODEBASES</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            FEATURED ENGINEERING LABS
          </h2>
          <p className="font-rajdhani text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Interactive prototypes, production web ecosystems, and creative 3D environments.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                sound.playHover();
                setFilter(tag);
              }}
              className={`px-4 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-200 border ${
                filter === tag
                  ? 'bg-hud-cyan text-slate-950 font-bold border-hud-cyan shadow-arc-cyan'
                  : 'bg-surface/80 text-slate-400 border-slate-800 hover:border-hud-cyan/40 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="hud-card rounded-2xl overflow-hidden group hover:border-hud-cyan/60 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Project Preview Image with Sci-Fi Scan Overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/80">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-black/80 border border-hud-cyan/40 px-3 py-1 rounded-md text-[10px] font-mono text-hud-cyan tracking-wider uppercase">
                  {project.badge || "PROTOTYPE"}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-orbitron font-bold text-xl text-white tracking-wide group-hover:text-hud-cyan transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-rajdhani text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="text-xs font-orbitron font-semibold text-hud-cyan hover:underline tracking-wider uppercase flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>INSPECT SPECS</span>
                    </button>

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-surface border border-slate-800 text-slate-300 hover:text-hud-cyan hover:border-hud-cyan/40 transition-colors"
                          title="Source Code"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-surface border border-slate-800 text-slate-300 hover:text-hud-cyan hover:border-hud-cyan/40 transition-colors"
                          title="Live Deployment"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Project Inspection Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full bg-[#0B0F19] border border-hud-cyan/40 rounded-2xl p-6 sm:p-8 hud-brackets shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-hud-cyan uppercase tracking-widest">
                    SYSTEM SPECS // {selectedProject.category}
                  </span>
                  <h3 className="font-orbitron font-extrabold text-2xl text-white tracking-wide mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="font-rajdhani text-base sm:text-lg text-slate-300 leading-relaxed">
                {selectedProject.description}
              </p>

              {/* Technical highlights */}
              {selectedProject.highlights && (
                <div className="space-y-2">
                  <h4 className="font-mono text-xs text-hud-cyan uppercase tracking-wider">
                    ARCHITECTURAL HIGHLIGHTS:
                  </h4>
                  <ul className="space-y-2 font-rajdhani text-sm sm:text-base text-slate-200">
                    {selectedProject.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-hud-cyan shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal CTA links */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-slate-800 text-slate-200 font-orbitron text-xs tracking-wider uppercase hover:border-hud-cyan/40"
                  >
                    <Github className="w-4 h-4" />
                    <span>VIEW REPOSITORY</span>
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-hud-cyan text-slate-950 font-orbitron font-bold text-xs tracking-wider uppercase shadow-arc-cyan hover:brightness-110"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>OPEN LIVE DEMO</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
