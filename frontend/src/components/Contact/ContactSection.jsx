import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, Mail, Linkedin, Instagram, Github, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { profileData } from '../../data/profile';
import { sendContactMessage } from '../../utils/api';
import { sound } from '../../utils/audio';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sound.playClick();
    setLoading(true);
    setStatus(null);

    try {
      await sendContactMessage(formData);
      setStatus({
        type: 'success',
        message: 'TRANSMISSION RECEIVED // Message relayed directly to Shubham.'
      });
      setFormData({ name: '', email: '', message: '' });
      sound.playReactorBoot();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F5FF', '#FF2A4D', '#00FF9D'],
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to transmit message. Please try again.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const commChannels = [
    {
      name: "LINKEDIN NETWORK",
      label: "shubham-munde",
      icon: Linkedin,
      url: profileData.socials.linkedin,
      color: "hover:text-hud-cyan hover:border-hud-cyan/50",
    },
    {
      name: "INSTAGRAM COMM",
      label: "@smash_8767",
      icon: Instagram,
      url: profileData.socials.instagram,
      color: "hover:text-hud-crimson hover:border-hud-crimson/50",
    },
    {
      name: "DIRECT EMAIL",
      label: profileData.socials.email,
      icon: Mail,
      url: `mailto:${profileData.socials.email}`,
      color: "hover:text-hud-gold hover:border-hud-gold/50",
    },
    {
      name: "GITHUB REPOSITORY",
      label: "munde87",
      icon: Github,
      url: profileData.socials.github,
      color: "hover:text-slate-100 hover:border-slate-400",
    },
  ];

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-hud-cyan/30 text-xs font-mono text-hud-cyan uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5" />
            <span>COMMUNICATION TERMINAL // SECURE TRANSMISSION</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            INITIATE TRANSMISSION
          </h2>
          <p className="font-rajdhani text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Ready to collaborate on high-impact full-stack web applications, 3D web systems, or engineering roles.
          </p>
        </div>

        {/* Transmission Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Transmission Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 hud-card p-6 sm:p-8 rounded-2xl hud-brackets space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-hud-cyan uppercase tracking-widest">
                // TRANSMISSION UPLINK
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                PORT 5000 // ENCRYPTED
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                  OPERATOR IDENTIFIER (NAME) *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Tony Stark"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 focus:border-hud-cyan focus:ring-1 focus:ring-hud-cyan text-white placeholder-slate-600 font-rajdhani text-base outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                  COMMUNICATION RELAY (EMAIL) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. stark@avengers.org"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 focus:border-hud-cyan focus:ring-1 focus:ring-hud-cyan text-white placeholder-slate-600 font-rajdhani text-base outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                  PAYLOAD MESSAGE *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Briefly describe the project, role, or collaboration..."
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 focus:border-hud-cyan focus:ring-1 focus:ring-hud-cyan text-white placeholder-slate-600 font-rajdhani text-base outline-none transition-all resize-none"
                />
              </div>

              {/* Status Banner */}
              {status && (
                <div
                  className={`p-4 rounded-xl font-mono text-xs flex items-center gap-2.5 ${
                    status.type === 'success'
                      ? 'bg-hud-emerald/10 border border-hud-emerald/40 text-hud-emerald'
                      : 'bg-hud-crimson/10 border border-hud-crimson/40 text-hud-crimson'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-hud-cyan to-hud-blue hover:brightness-110 text-slate-950 font-orbitron font-bold text-sm tracking-wider uppercase transition-all shadow-arc-cyan disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>TRANSMITTING PAYLOAD...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>BROADCAST TRANSMISSION</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right: Direct Comms Nodes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="hud-card p-6 sm:p-8 rounded-2xl space-y-4">
              <span className="text-[10px] font-mono text-hud-cyan uppercase tracking-widest">
                // EXTERNAL SATELLITE CHANNELS
              </span>
              <p className="font-rajdhani text-sm sm:text-base text-slate-300">
                You can also connect directly through professional satellites or social communication channels.
              </p>

              <div className="space-y-3 pt-2">
                {commChannels.map((channel, idx) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={idx}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 rounded-xl bg-black/60 border border-slate-800 flex items-center justify-between transition-all group ${channel.color}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2 rounded-lg bg-surface border border-slate-800 text-slate-400 group-hover:text-white">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-orbitron font-bold text-xs text-white tracking-wider">
                            {channel.name}
                          </div>
                          <div className="font-mono text-[11px] text-slate-400">
                            {channel.label}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-600 group-hover:text-hud-cyan">
                        CONNECT →
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
