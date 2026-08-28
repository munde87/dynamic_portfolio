import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { profileData } from '../data/profile';
import { getResumeDownloadUrl } from '../utils/api';

export default function ResumeModal({ isOpen, onClose, theme = 'dark', resumeData }) {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  const downloadUrl = resumeData?.fileUrl ? getResumeDownloadUrl(resumeData.fileUrl) : '/assets/shubham-munde-resume.pdf';

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resumeData?.fileName || 'Shubham_Munde_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-2xl rounded-2xl border p-6 sm:p-8 z-10 shadow-2xl ${
            isDark
              ? 'bg-mono-900 border-white/20 text-white'
              : 'bg-white border-black/15 text-black'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 mb-6 border-current/10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${
                isDark ? 'bg-mono-800 border-white/20' : 'bg-mono-100 border-black/10'
              }`}>
                <FileText className="w-5 h-5 text-spider-red" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-lg sm:text-xl tracking-wide">
                  DOSSIER // RESUME
                </h3>
                <p className="font-mono text-xs opacity-60">
                  SHUBHAM MUNDE — FULL STACK & AI AUTOMATION
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              data-cursor-text="CLOSE"
              className={`p-2 rounded-full border transition-all ${
                isDark ? 'hover:bg-white/10 border-white/10' : 'hover:bg-black/5 border-black/10'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Summary Preview */}
          <div className={`p-4 rounded-xl border mb-6 space-y-3 font-mono text-xs sm:text-sm ${
            isDark ? 'bg-mono-950/60 border-white/10' : 'bg-mono-50 border-black/10'
          }`}>
            <div className="flex justify-between items-center border-b border-current/10 pb-2">
              <span className="opacity-60">TARGET ROLE:</span>
              <span className="font-bold text-spider-red">FULL STACK DEVELOPER | AI & AUTOMATION</span>
            </div>
            <div className="flex justify-between items-center border-b border-current/10 pb-2">
              <span className="opacity-60">EDUCATION:</span>
              <span>B.E. Computer Engineering (Suryodaya College)</span>
            </div>
            <div className="flex justify-between items-center border-b border-current/10 pb-2">
              <span className="opacity-60">PRIMARY TECH:</span>
              <span>React, Node.js, Express, MongoDB, Java, C, Gemini API</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-60">ACTIVE FILE:</span>
              <span className="font-bold text-spider-blue-electric">
                Shubham_Munde_Resume.pdf
              </span>
            </div>
          </div>

          {/* Core Highlights */}
          <div className="space-y-2 mb-8 text-xs sm:text-sm font-sans">
            <h4 className="font-orbitron text-xs font-bold uppercase tracking-wider opacity-80 mb-3">
              Executive Highlights
            </h4>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 mt-0.5 opacity-80 shrink-0 text-spider-red" />
              <span>Full-Stack Developer focused on Node.js, Express.js, MongoDB & React.js platforms.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 mt-0.5 opacity-80 shrink-0 text-spider-blue" />
              <span>AI Agents, Chatbot Development, and Gemini API integration enthusiast.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 mt-0.5 opacity-80 shrink-0 text-spider-red" />
              <span>Built Acadex student academic ecosystem & Tumhara Arogya Panchakarma suite.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-current/10">
            <button
              onClick={onClose}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-xs font-orbitron tracking-wider font-semibold transition-all ${
                isDark
                  ? 'border-white/20 hover:bg-white/10 text-mono-200'
                  : 'border-black/20 hover:bg-black/5 text-mono-800'
              }`}
            >
              DISMISS
            </button>

            <button
              onClick={handleDownload}
              data-cursor-text="DOWNLOAD"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border text-xs font-orbitron tracking-wider font-bold flex items-center justify-center gap-2 transition-all bg-spider-red text-white border-spider-red hover:bg-spider-red-dark shadow-spider-red"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD RESUME PDF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
