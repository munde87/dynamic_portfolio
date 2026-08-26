import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, Lock, User, Key, X, Check, Trash2, Plus, Edit2, LogOut,
  Cpu, LayoutDashboard, Layers, Sparkles, Send, Mail, Activity, UserCheck,
  Code2, Image as ImageIcon, Briefcase, Settings, Menu, ExternalLink, RefreshCw, Upload,
  FileText, Download, Eye, FileUp, AlertTriangle, KeyRound, ShieldCheck, EyeOff,
  Music, Volume2, VolumeX, Play, Pause
} from 'lucide-react';
import api, {
  fetchHeroData, updateHeroData,
  fetchAboutData, updateAboutData,
  fetchProjects, createProject, updateProject, deleteProject,
  fetchSkills, createSkill, updateSkill, deleteSkill,
  fetchExperience, createExperience, updateExperience, deleteExperience,
  fetchCodeExamples, createCodeExample, updateCodeExample, deleteCodeExample,
  uploadImage, uploadModel,
  fetchResume, uploadResume, replaceResume, deleteResume, getResumeDownloadUrl,
  fetchAdminAccount, updateAdminUsername, updateAdminPassword,
  fetchAudioAdmin, uploadAudio, replaceAudio, deleteAudio, updateAudioSettings, getAudioFileUrl
} from '../../utils/api';
import { profileData } from '../../data/profile';
import { projectCategories } from '../../data/projects';
import { skillsData } from '../../data/skills';
import { eventExperienceData } from '../../data/experience';

export default function AdminPanel({ isOpen, onClose, theme = 'dark', onDataUpdated }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Auth state
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Status & Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: '', id: null, title: '' });

  // Data States
  const [heroForm, setHeroForm] = useState({
    eyebrow: "HEY, I'M SHUBHAM MUNDE",
    headline1: "SHUBHAM",
    headline2: "MUNDE",
    title: "SOFTWARE ENGINEER",
    subRole: "WEB DEVELOPER • JAVA • MERN STACK",
    description: "I build interactive digital experiences, modern web applications, and scalable software with creativity, code, and continuous learning.",
    primaryCtaText: "EXPLORE MY WORK",
    primaryCtaLink: "#projects",
    secondaryCtaText: "LET'S CONNECT",
    secondaryCtaLink: "#contact",
    heroImage: "/assets/spider-mask.png",
    portraitImage: "/assets/shubham-real.png",
    modelUrl: "/models/spiderman.glb",
    socials: {
      github: "https://github.com/munde87",
      linkedin: "https://www.linkedin.com/in/shubham-munde-ba5ab4335",
      instagram: "https://www.instagram.com/smash_8767?igsi=bjVyNmgxNXVnaGd1",
      email: "shubhammunde8767@gmail.com",
      firstPortfolio: "https://jolly-naiad-d765aa.netlify.app"
    }
  });

  const [aboutForm, setAboutForm] = useState({
    heading: "ABOUT ME",
    mainTitle: "THE PERSON BEHIND THE MASK",
    aboutBio: [
      "I am a Computer Engineering student and software developer passionate about building high-impact full-stack applications, interactive 3D web experiences, and scalable software architecture.",
      "Driven by the philosophy that with great power comes great responsibility in code — focusing on clean architectures, MERN stack development, building intuitive full-stack web applications with Java & JavaScript, and delivering vibrant user interfaces."
    ],
    stats: [
      { label: "COMPLETED & BUILT", value: "10+ Web Apps", code: "PROJECT_ENGINE" },
      { label: "FULL STACK WEB APPS", value: "Production Ready", code: "MERN_CORE" },
      { label: "INTERACTIVE 3D UI", value: "60 FPS WebGL", code: "WEB_GL_3D" },
      { label: "CORE FOCUS", value: "Java & JavaScript", code: "SYSTEM_CODE" }
    ],
    technologyLabels: ["HTML", "CSS", "JavaScript", "React.js", "Node.js", "Express.js", "JWT", "MongoDB", "C", "Java", "VS Code", "Git", "GitHub", "Canva", "Antigravity", "React Native", "Expo"]
  });

  const [projectsList, setProjectsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [codeList, setCodeList] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [resumeDragActive, setResumeDragActive] = useState(false);

  // Security & Account Settings State
  const [accountData, setAccountData] = useState(null);
  const [usernameForm, setUsernameForm] = useState({ newUsername: '', confirmUsername: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [confirmSecurityModal, setConfirmSecurityModal] = useState({ open: false, type: '', title: '', details: '', onConfirm: null });

  // Audio Management State
  const [audioAdminData, setAudioAdminData] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioDragActive, setAudioDragActive] = useState(false);
  const [audioPreviewRef] = useState({ current: null });
  const [audioPreviewPlaying, setAudioPreviewPlaying] = useState(false);
  const [audioVolumeSlider, setAudioVolumeSlider] = useState(20);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Modal / Editing Item States
  const [projectModal, setProjectModal] = useState({ open: false, isEdit: false, data: null });
  const [skillModal, setSkillModal] = useState({ open: false, isEdit: false, data: null });
  const [expModal, setExpModal] = useState({ open: false, isEdit: false, data: null });
  const [codeModal, setCodeModal] = useState({ open: false, isEdit: false, data: null });

  // Input chip helper
  const [newTechTag, setNewTechTag] = useState('');

  const isDark = theme === 'dark';

  const showToastMsg = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    if (isOpen) {
      checkAuth();
      loadAllData();
    }
  }, [isOpen]);

  const checkAuth = async () => {
    try {
      const res = await api.get('/admin/me');
      if (res.data?.success) {
        setIsLoggedIn(true);
        setAdminUser(res.data.admin);
      }
    } catch (e) {
      setIsLoggedIn(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [hero, about, projects, skills, exp, code, resume, account, audioAdmin] = await Promise.all([
        fetchHeroData(),
        fetchAboutData(),
        fetchProjects(),
        fetchSkills(),
        fetchExperience(),
        fetchCodeExamples(),
        fetchResume(),
        fetchAdminAccount(),
        fetchAudioAdmin()
      ]);

      if (hero) setHeroForm((prev) => ({
        ...prev,
        ...hero,
        socials: {
          ...prev.socials,
          ...(hero.socials || {})
        }
      }));
      if (about) setAboutForm((prev) => ({ ...prev, ...about }));
      
      setProjectsList(projects && projects.length ? projects : projectCategories.flatMap(c => c.projects));
      setSkillsList(skills && skills.length ? skills : skillsData);
      setExperienceList(exp && exp.length ? exp : eventExperienceData);
      setCodeList(code && code.length ? code : []);
      setResumeData(resume || null);
      if (account) {
        setAccountData(account);
        if (adminUser) setAdminUser(prev => ({ ...prev, username: account.username }));
      }
      if (audioAdmin) {
        setAudioAdminData(audioAdmin);
        setAudioVolumeSlider(audioAdmin.defaultVolume ?? 20);
        setAudioEnabled(audioAdmin.isEnabled ?? true);
      } else {
        setAudioAdminData(null);
      }

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Using localized fallback data for Admin Panel");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await api.post('/admin/login', credentials);
      if (res.data?.success) {
        setIsLoggedIn(true);
        setAdminUser({ username: credentials.username });
        setCredentials({ username: '', password: '' });
        showToastMsg('System Authenticated. Welcome Admin!');
        loadAllData();
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid credentials or server offline.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post('/admin/logout'); } catch (e) {}
    setIsLoggedIn(false);
    setAdminUser(null);
    showToastMsg('Logged out successfully.');
  };

  // Image Upload Handler Helper
  const handleFileUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showToastMsg('Uploading image...', 'info');
      const res = await uploadImage(file);
      if (res.success && res.imageUrl) {
        const fullUrl = res.imageUrl.startsWith('http') ? res.imageUrl : `http://localhost:5000${res.imageUrl}`;
        callback(fullUrl);
        showToastMsg('Image uploaded successfully!');
      }
    } catch (err) {
      showToastMsg(err.response?.data?.message || 'Image upload failed. Local path set.', 'error');
    }
  };

  // Hero Save
  const handleSaveHero = async () => {
    try {
      await updateHeroData(heroForm);
      showToastMsg('Hero Section updated & persisted!');
      if (onDataUpdated) onDataUpdated();
    } catch (e) {
      showToastMsg('Failed to save Hero section.', 'error');
    }
  };

  // About Save
  const handleSaveAbout = async () => {
    try {
      await updateAboutData(aboutForm);
      showToastMsg('About Section updated & persisted!');
      if (onDataUpdated) onDataUpdated();
    } catch (e) {
      showToastMsg('Failed to save About section.', 'error');
    }
  };

  // Project CRUD
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const formData = projectModal.data;
    try {
      if (projectModal.isEdit && formData._id) {
        await updateProject(formData._id, formData);
        showToastMsg('Project updated successfully!');
      } else {
        await createProject(formData);
        showToastMsg('New Project added successfully!');
      }
      setProjectModal({ open: false, isEdit: false, data: null });
      loadAllData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      showToastMsg('Failed to save project.', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      showToastMsg('Project deleted.');
      setConfirmDelete({ open: false, type: '', id: null, title: '' });
      loadAllData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      showToastMsg('Failed to delete project.', 'error');
    }
  };

  // Skill CRUD
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    const formData = skillModal.data;
    try {
      if (skillModal.isEdit && formData._id) {
        await updateSkill(formData._id, formData);
        showToastMsg('Skill updated successfully!');
      } else {
        await createSkill(formData);
        showToastMsg('New Skill added!');
      }
      setSkillModal({ open: false, isEdit: false, data: null });
      loadAllData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      showToastMsg('Failed to save skill.', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      showToastMsg('Skill deleted.');
      setConfirmDelete({ open: false, type: '', id: null, title: '' });
      loadAllData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      showToastMsg('Failed to delete skill.', 'error');
    }
  };

  // Experience CRUD
  const handleSaveExp = async (e) => {
    e.preventDefault();
    const formData = expModal.data;
    try {
      if (expModal.isEdit && formData._id) {
        await updateExperience(formData._id, formData);
        showToastMsg('Experience entry updated!');
      } else {
        await createExperience(formData);
        showToastMsg('New Experience entry added!');
      }
      setExpModal({ open: false, isEdit: false, data: null });
      loadAllData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      showToastMsg('Failed to save experience entry.', 'error');
    }
  };

  const handleDeleteExp = async (id) => {
    try {
      await deleteExperience(id);
      showToastMsg('Experience deleted.');
      setConfirmDelete({ open: false, type: '', id: null, title: '' });
      loadAllData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      showToastMsg('Failed to delete experience entry.', 'error');
    }
  };

  // Code Example CRUD
  const handleSaveCode = async (e) => {
    e.preventDefault();
    const formData = codeModal.data;
    try {
      if (codeModal.isEdit && formData._id) {
        await updateCodeExample(formData._id, formData);
        showToastMsg('Code example updated!');
      } else {
        await createCodeExample(formData);
        showToastMsg('New Code example added!');
      }
      setCodeModal({ open: false, isEdit: false, data: null });
      loadAllData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      showToastMsg('Failed to save code example.', 'error');
    }
  };

  const handleDeleteCode = async (id) => {
    try {
      await deleteCodeExample(id);
      showToastMsg('Code example deleted.');
      setConfirmDelete({ open: false, type: '', id: null, title: '' });
      loadAllData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      showToastMsg('Failed to delete code example.', 'error');
    }
  };

  // Resume Management Handlers
  const handleResumeFileSelect = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToastMsg('Invalid file format. Only PDF files are accepted!', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToastMsg('File is too large. Maximum size is 15MB.', 'error');
      return;
    }
    setSelectedResumeFile(file);
    showToastMsg(`Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
  };

  const handleResumeUpload = async (isReplace = false) => {
    if (!selectedResumeFile) {
      showToastMsg('Please select a PDF file first.', 'error');
      return;
    }
    setResumeUploading(true);
    try {
      const res = isReplace
        ? await replaceResume(selectedResumeFile)
        : await uploadResume(selectedResumeFile);

      if (res.success) {
        showToastMsg(isReplace ? 'Resume replaced successfully!' : 'Resume uploaded & active on portfolio!');
        setSelectedResumeFile(null);
        await loadAllData();
        if (onDataUpdated) onDataUpdated();
      }
    } catch (err) {
      showToastMsg(err.response?.data?.message || 'Failed to upload resume.', 'error');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      const res = await deleteResume();
      if (res.success) {
        showToastMsg('Resume removed from portfolio.');
        setConfirmDelete({ open: false, type: '', id: null, title: '' });
        setResumeData(null);
        setSelectedResumeFile(null);
        await loadAllData();
        if (onDataUpdated) onDataUpdated();
      }
    } catch (err) {
      showToastMsg('Failed to delete resume.', 'error');
    }
  };

  const handleDeleteAudio = async () => {
    try {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
        setAudioPreviewPlaying(false);
      }
      const res = await deleteAudio();
      if (res.success) {
        showToastMsg('Background audio removed.');
        setConfirmDelete({ open: false, type: '', id: null, title: '' });
        setAudioAdminData(null);
        setSelectedAudioFile(null);
        await loadAllData();
        if (onDataUpdated) onDataUpdated();
      }
    } catch (err) {
      showToastMsg('Failed to delete audio.', 'error');
    }
  };

  // Account & Security Settings Handlers
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    const { newUsername, confirmUsername } = usernameForm;
    if (!newUsername || newUsername.trim().length < 3) {
      showToastMsg('New username must be at least 3 characters long.', 'error');
      return;
    }
    if (newUsername.trim() !== confirmUsername.trim()) {
      showToastMsg('New username and confirmation do not match.', 'error');
      return;
    }
    if (newUsername.trim() === (accountData?.username || adminUser?.username)) {
      showToastMsg('New username is the same as your current username.', 'info');
      return;
    }

    setConfirmSecurityModal({
      open: true,
      type: 'username',
      title: 'CONFIRM USERNAME UPDATE',
      details: `Are you sure you want to update your admin username to "${newUsername.trim()}"? The old username will no longer work for future logins.`
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword) {
      showToastMsg('Please enter your current password.', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      showToastMsg('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToastMsg('New password and confirmation do not match.', 'error');
      return;
    }

    setConfirmSecurityModal({
      open: true,
      type: 'password',
      title: 'CONFIRM PASSWORD CHANGE',
      details: 'Are you sure you want to update your admin password? Your new password will be securely hashed, and your old password will immediately become invalid.'
    });
  };

  const handleConfirmSecurityUpdate = async () => {
    const { type } = confirmSecurityModal;
    setSecurityLoading(true);
    try {
      if (type === 'username') {
        const res = await updateAdminUsername(usernameForm.newUsername.trim());
        if (res.success) {
          showToastMsg('Admin username updated permanently!');
          setAdminUser(prev => ({ ...prev, username: res.username }));
          setAccountData(prev => ({ ...prev, username: res.username }));
          setUsernameForm({ newUsername: '', confirmUsername: '' });
          setConfirmSecurityModal({ open: false, type: '', title: '', details: '' });
        }
      } else if (type === 'password') {
        const res = await updateAdminPassword(passwordForm.currentPassword, passwordForm.newPassword);
        if (res.success) {
          showToastMsg('Password updated & securely encrypted!');
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setAccountData(prev => ({ ...prev, passwordChangedAt: new Date() }));
          setConfirmSecurityModal({ open: false, type: '', title: '', details: '' });
        }
      }
    } catch (err) {
      showToastMsg(err.response?.data?.message || 'Failed to update credentials. Check your input.', 'error');
    } finally {
      setSecurityLoading(false);
    }
  };

  if (!isOpen) return null;

  const sidebarTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero', icon: UserCheck },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'code', label: 'Code Lab', icon: Code2 },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'security', label: 'Security', icon: KeyRound },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 select-none overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-spider-night/90 backdrop-blur-lg"
        />

        {/* Toast Notification Banner */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className={`fixed top-6 z-50 px-6 py-3 rounded-2xl border font-mono text-xs font-bold shadow-2xl flex items-center gap-2 ${
                toast.type === 'error'
                  ? 'bg-red-900 border-red-500 text-white shadow-red-500/50'
                  : toast.type === 'info'
                  ? 'bg-spider-blue border-spider-blue-electric text-white'
                  : 'bg-emerald-900 border-emerald-500 text-white shadow-emerald-500/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel Container Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className={`relative w-full max-w-6xl h-[90vh] rounded-3xl border-2 z-10 shadow-2xl overflow-hidden flex flex-col md:flex-row ${
            isDark
              ? 'bg-spider-night-card border-spider-red/40 text-white shadow-spider-red'
              : 'bg-white border-spider-blue/30 text-spider-night shadow-card-light'
          }`}
        >
          {!isLoggedIn ? (
            /* VIEW 1: AUTHENTICATION LOGIN FORM */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full border border-current/20 hover:bg-spider-red hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl border-2 border-spider-red bg-spider-red/10 text-spider-red mx-auto flex items-center justify-center shadow-spider-red">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h4 className="font-orbitron font-black text-2xl uppercase tracking-wide">
                    ADMIN AUTHENTICATION
                  </h4>
                  <p className="font-sans text-xs opacity-75">
                    Log in to access portfolio content management, hero parameters, project repositories, and skill modules.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-spider-red font-bold block mb-1.5 uppercase">
                      ADMIN USERNAME
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 opacity-50" />
                      <input
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        placeholder="admin"
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono focus:outline-none ${
                          isDark ? 'bg-spider-night border-spider-red/30 text-white' : 'bg-slate-100 border-spider-blue/30 text-black'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-xs text-spider-blue-electric font-bold block mb-1.5 uppercase">
                      SECURITY PASSWORD
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 absolute left-3.5 top-3.5 opacity-50" />
                      <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        placeholder="••••••••"
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono focus:outline-none ${
                          isDark ? 'bg-spider-night border-spider-red/30 text-white' : 'bg-slate-100 border-spider-blue/30 text-black'
                        }`}
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-widest bg-spider-red text-white hover:bg-spider-red-dark shadow-spider-red transition-all"
                  >
                    {loginLoading ? 'VERIFYING...' : 'AUTHENTICATE SYSTEM'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* VIEW 2: AUTHENTICATED DASHBOARD WITH RESPONSIVE LEFT SIDEBAR */
            <>
              {/* Mobile Sidebar Header Toggle */}
              <div className="md:hidden p-4 border-b flex items-center justify-between border-current/10">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-xl border border-current/20 flex items-center gap-2 font-mono text-xs"
                >
                  <Menu className="w-4 h-4" />
                  <span>MENU</span>
                </button>
                <span className="font-orbitron font-extrabold text-xs text-spider-red">ADMIN DASHBOARD</span>
                <button onClick={onClose} className="p-2 rounded-full border border-current/20">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* LEFT SIDEBAR NAVIGATION */}
              <div className={`w-full md:w-64 border-r flex-shrink-0 flex flex-col justify-between p-4 border-current/10 ${
                sidebarOpen ? 'block' : 'hidden md:flex'
              } ${isDark ? 'bg-spider-night/95' : 'bg-slate-50/95'}`}>
                <div className="space-y-6">
                  {/* Dashboard Title & Admin Info */}
                  <div className="flex items-center gap-3 px-2 pt-2 border-b pb-4 border-current/10">
                    <div className="p-2.5 rounded-xl border border-spider-red/40 bg-spider-red/10 text-spider-red">
                      <ShieldAlert className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-black text-sm uppercase tracking-wider text-spider-red">
                        WEB-OS CONTROL
                      </h4>
                      <span className="font-mono text-[10px] opacity-70 block">
                        ADMIN: {adminUser?.username || 'shubham'}
                      </span>
                    </div>
                  </div>

                  {/* Sidebar Nav Links */}
                  <nav className="space-y-1 font-mono text-xs">
                    {sidebarTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 font-bold transition-all ${
                            isActive
                              ? 'bg-spider-red text-white shadow-spider-red'
                              : isDark
                              ? 'text-mono-300 hover:bg-spider-red/10 hover:text-spider-red'
                              : 'text-mono-700 hover:bg-spider-blue/10 hover:text-spider-blue'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Sidebar Footer Logout */}
                <div className="pt-4 border-t border-current/10 space-y-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-spider-red/40 text-spider-red font-mono text-xs font-bold hover:bg-spider-red hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>LOGOUT</span>
                  </button>
                </div>
              </div>

              {/* RIGHT CONTENT PANEL AREA */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header Bar */}
                <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-current/10">
                  <div className="flex items-center gap-2 font-orbitron font-black text-sm uppercase tracking-wider text-spider-red">
                    <span>SECTION // {activeTab.toUpperCase()}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="opacity-60 text-[10px]">LAST UPDATED: {lastUpdated}</span>
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-full border border-current/20 hover:bg-spider-red hover:text-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Dashboard Body */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
                  
                  {/* TAB 1: DASHBOARD HOME OVERVIEW */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-50 border-spider-blue/30'}`}>
                          <span className="font-mono text-[10px] text-spider-red font-bold uppercase block">TOTAL PROJECTS</span>
                          <span className="font-orbitron font-bold text-2xl">{projectsList.length}</span>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-50 border-spider-blue/30'}`}>
                          <span className="font-mono text-[10px] text-spider-blue-electric font-bold uppercase block">TOTAL SKILLS</span>
                          <span className="font-orbitron font-bold text-2xl">{skillsList.length}</span>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-50 border-spider-blue/30'}`}>
                          <span className="font-mono text-[10px] text-spider-red font-bold uppercase block">EXPERIENCE ENTRIES</span>
                          <span className="font-orbitron font-bold text-2xl">{experienceList.length}</span>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-50 border-spider-blue/30'}`}>
                          <span className="font-mono text-[10px] text-spider-blue-electric font-bold uppercase block">CODE EXAMPLES</span>
                          <span className="font-orbitron font-bold text-2xl">{codeList.length || 5}</span>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-spider-night border-spider-red/20' : 'bg-slate-50 border-spider-blue/20'}`}>
                        <h4 className="font-orbitron text-xs font-bold uppercase text-spider-red">QUICK ACTIONS</h4>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => {
                              setActiveTab('projects');
                              setProjectModal({ open: true, isEdit: false, data: { title: '', category: 'Full Stack App', description: '', fullDescription: '', imageUrl: '', liveUrl: '', githubUrl: '', tags: [], featured: false } });
                            }}
                            className="px-4 py-2.5 rounded-xl bg-spider-red text-white font-mono text-xs font-bold hover:bg-spider-red-dark transition-all flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>ADD PROJECT</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('skills');
                              setSkillModal({ open: true, isEdit: false, data: { name: '', category: 'frontend', level: 85, icon: '' } });
                            }}
                            className="px-4 py-2.5 rounded-xl bg-spider-blue text-white font-mono text-xs font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>ADD SKILL</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('experience');
                              setExpModal({ open: true, isEdit: false, data: { role: '', company: '', description: '', startDate: '2024', endDate: 'Present', technologies: [] } });
                            }}
                            className="px-4 py-2.5 rounded-xl border border-spider-red/40 font-mono text-xs font-bold hover:bg-spider-red hover:text-white transition-all flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>ADD EXPERIENCE</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('code');
                              setCodeModal({ open: true, isEdit: false, data: { title: 'new-example.js', language: 'JavaScript', code: '// write code here', output: '// expected output' } });
                            }}
                            className="px-4 py-2.5 rounded-xl border border-spider-blue/40 font-mono text-xs font-bold hover:bg-spider-blue hover:text-white transition-all flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>ADD CODE EXAMPLE</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: HERO MANAGEMENT */}
                  {activeTab === 'hero' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="font-orbitron text-xs font-bold uppercase text-spider-red">EDIT HERO SECTION</h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveHero}
                            className="px-5 py-2 rounded-xl bg-spider-red text-white font-mono text-xs font-bold hover:bg-spider-red-dark transition-all flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            <span>SAVE CHANGES</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="font-mono text-xs text-spider-red font-bold block mb-1">HEADLINE 1 (FIRST NAME)</label>
                          <input
                            type="text"
                            value={heroForm.headline1}
                            onChange={(e) => setHeroForm({ ...heroForm, headline1: e.target.value })}
                            className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-100 border-spider-blue/30'}`}
                          />
                        </div>

                        <div>
                          <label className="font-mono text-xs text-spider-red font-bold block mb-1">HEADLINE 2 (LAST NAME)</label>
                          <input
                            type="text"
                            value={heroForm.headline2}
                            onChange={(e) => setHeroForm({ ...heroForm, headline2: e.target.value })}
                            className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-100 border-spider-blue/30'}`}
                          />
                        </div>

                        <div>
                          <label className="font-mono text-xs text-spider-blue-electric font-bold block mb-1">ROLE TITLE</label>
                          <input
                            type="text"
                            value={heroForm.title}
                            onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                            className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-100 border-spider-blue/30'}`}
                          />
                        </div>

                        <div>
                          <label className="font-mono text-xs text-spider-blue-electric font-bold block mb-1">SUB-ROLE TAGLINE</label>
                          <input
                            type="text"
                            value={heroForm.subRole}
                            onChange={(e) => setHeroForm({ ...heroForm, subRole: e.target.value })}
                            className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-100 border-spider-blue/30'}`}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="font-mono text-xs text-spider-red font-bold block mb-1">DESCRIPTION</label>
                          <textarea
                            rows={3}
                            value={heroForm.description}
                            onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                            className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-100 border-spider-blue/30'}`}
                          />
                        </div>
                      </div>

                      {/* IMAGE MANAGEMENT FOR HERO VISUAL */}
                      <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-spider-night border-spider-red/20' : 'bg-slate-50 border-spider-blue/20'}`}>
                        <h5 className="font-orbitron text-xs font-bold uppercase text-spider-red flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          <span>HERO REVEAL IMAGES MANAGEMENT</span>
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Image Layer 1: Superhero Masked Image */}
                          <div className="space-y-3 p-4 rounded-xl border border-current/10">
                            <span className="font-mono text-xs font-bold text-spider-red block">MASKED LAYER (SUPERHERO)</span>
                            <div className="flex items-center gap-4">
                              <img src={heroForm.heroImage} alt="Superhero Preview" className="w-16 h-20 object-cover rounded-lg border border-spider-red/40" />
                              <div className="space-y-2 flex-1">
                                <label className="px-3 py-1.5 rounded-lg border border-spider-red/40 text-[10px] font-mono font-bold hover:bg-spider-red hover:text-white cursor-pointer transition-all flex items-center gap-1.5 w-max">
                                  <Upload className="w-3 h-3" />
                                  <span>UPLOAD NEW MASK</span>
                                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setHeroForm({ ...heroForm, heroImage: url }))} className="hidden" />
                                </label>
                                <input
                                  type="text"
                                  value={heroForm.heroImage}
                                  onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                                  placeholder="Image URL"
                                  className={`w-full px-2.5 py-1 rounded text-[10px] font-mono border focus:outline-none ${isDark ? 'bg-spider-night border-white/20' : 'bg-white border-black/20'}`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Image Layer 2: Real Portrait Image */}
                          <div className="space-y-3 p-4 rounded-xl border border-current/10">
                            <span className="font-mono text-xs font-bold text-spider-blue-electric block">REAL PORTRAIT LAYER (UNMASKED)</span>
                            <div className="flex items-center gap-4">
                              <img src={heroForm.portraitImage} alt="Portrait Preview" className="w-16 h-20 object-cover rounded-lg border border-spider-blue/40" />
                              <div className="space-y-2 flex-1">
                                <label className="px-3 py-1.5 rounded-lg border border-spider-blue/40 text-[10px] font-mono font-bold hover:bg-spider-blue hover:text-white cursor-pointer transition-all flex items-center gap-1.5 w-max">
                                  <Upload className="w-3 h-3" />
                                  <span>UPLOAD PORTRAIT</span>
                                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setHeroForm({ ...heroForm, portraitImage: url }))} className="hidden" />
                                </label>
                                <input
                                  type="text"
                                  value={heroForm.portraitImage}
                                  onChange={(e) => setHeroForm({ ...heroForm, portraitImage: e.target.value })}
                                  placeholder="Image URL"
                                  className={`w-full px-2.5 py-1 rounded text-[10px] font-mono border focus:outline-none ${isDark ? 'bg-spider-night border-white/20' : 'bg-white border-black/20'}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SOCIAL & CONTACT LINKS MANAGEMENT */}
                      <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-spider-night border-spider-blue/30' : 'bg-slate-50 border-spider-blue/20'}`}>
                        <h5 className="font-orbitron text-xs font-bold uppercase text-spider-blue-electric flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          <span>OFFICIAL CONTACT & SOCIAL LINKS</span>
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-mono text-xs text-spider-red font-bold block mb-1">
                              EMAIL ADDRESS
                            </label>
                            <input
                              type="email"
                              value={heroForm.socials?.email || ''}
                              onChange={(e) => setHeroForm({
                                ...heroForm,
                                socials: { ...heroForm.socials, email: e.target.value }
                              })}
                              placeholder="shubhammunde8767@gmail.com"
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                                isDark ? 'bg-spider-night border-spider-red/30 text-white' : 'bg-white border-spider-blue/30 text-black'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="font-mono text-xs text-spider-blue-electric font-bold block mb-1">
                              LINKEDIN PROFILE URL
                            </label>
                            <input
                              type="url"
                              value={heroForm.socials?.linkedin || ''}
                              onChange={(e) => setHeroForm({
                                ...heroForm,
                                socials: { ...heroForm.socials, linkedin: e.target.value }
                              })}
                              placeholder="https://www.linkedin.com/in/shubham-munde-ba5ab4335"
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                                isDark ? 'bg-spider-night border-spider-red/30 text-white' : 'bg-white border-spider-blue/30 text-black'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="font-mono text-xs text-spider-red font-bold block mb-1">
                              GITHUB PROFILE URL
                            </label>
                            <input
                              type="url"
                              value={heroForm.socials?.github || ''}
                              onChange={(e) => setHeroForm({
                                ...heroForm,
                                socials: { ...heroForm.socials, github: e.target.value }
                              })}
                              placeholder="https://github.com/munde87"
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                                isDark ? 'bg-spider-night border-spider-red/30 text-white' : 'bg-white border-spider-blue/30 text-black'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="font-mono text-xs text-pink-500 font-bold block mb-1">
                              INSTAGRAM PROFILE URL
                            </label>
                            <input
                              type="url"
                              value={heroForm.socials?.instagram || ''}
                              onChange={(e) => setHeroForm({
                                ...heroForm,
                                socials: { ...heroForm.socials, instagram: e.target.value }
                              })}
                              placeholder="https://www.instagram.com/smash_8767?igsi=bjVyNmgxNXVnaGd1"
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                                isDark ? 'bg-spider-night border-spider-red/30 text-white' : 'bg-white border-spider-blue/30 text-black'
                              }`}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="font-mono text-xs text-spider-blue-electric font-bold block mb-1">
                              FIRST PORTFOLIO URL (JOURNEY ARCHIVE)
                            </label>
                            <input
                              type="url"
                              value={heroForm.socials?.firstPortfolio || ''}
                              onChange={(e) => setHeroForm({
                                ...heroForm,
                                socials: { ...heroForm.socials, firstPortfolio: e.target.value }
                              })}
                              placeholder="https://jolly-naiad-d765aa.netlify.app"
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                                isDark ? 'bg-spider-night border-spider-red/30 text-white' : 'bg-white border-spider-blue/30 text-black'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: ABOUT MANAGEMENT */}
                  {activeTab === 'about' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="font-orbitron text-xs font-bold uppercase text-spider-red">EDIT ABOUT SECTION</h4>
                        <button
                          onClick={handleSaveAbout}
                          className="px-5 py-2 rounded-xl bg-spider-red text-white font-mono text-xs font-bold hover:bg-spider-red-dark transition-all flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>SAVE ABOUT</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="font-mono text-xs text-spider-red font-bold block mb-1">SECTION HEADING</label>
                          <input
                            type="text"
                            value={aboutForm.mainTitle}
                            onChange={(e) => setAboutForm({ ...aboutForm, mainTitle: e.target.value })}
                            className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${isDark ? 'bg-spider-night border-spider-red/30' : 'bg-slate-100 border-spider-blue/30'}`}
                          />
                        </div>

                        {/* DYNAMIC TECHNOLOGY LABELS CHIPS */}
                        <div className="space-y-2">
                          <label className="font-mono text-xs text-spider-blue-electric font-bold block">TECHNOLOGY CHIPS</label>
                          <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-current/10">
                            {aboutForm.technologyLabels.map((tech, idx) => (
                              <span key={idx} className="px-3 py-1 rounded-xl bg-spider-red/20 text-spider-red font-mono text-xs font-bold flex items-center gap-1.5">
                                <span>{tech}</span>
                                <button
                                  type="button"
                                  onClick={() => setAboutForm({ ...aboutForm, technologyLabels: aboutForm.technologyLabels.filter((_, i) => i !== idx) })}
                                  className="hover:text-white"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={newTechTag}
                              onChange={(e) => setNewTechTag(e.target.value)}
                              placeholder="e.g. Node.js"
                              className={`px-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none ${isDark ? 'bg-spider-night border-spider-blue/30' : 'bg-white border-spider-blue/30'}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newTechTag.trim()) {
                                  setAboutForm({ ...aboutForm, technologyLabels: [...aboutForm.technologyLabels, newTechTag.trim()] });
                                  setNewTechTag('');
                                }
                              }}
                              className="px-4 py-1.5 rounded-xl bg-spider-blue text-white font-mono text-xs font-bold"
                            >
                              + ADD TECH
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: SKILLS MANAGEMENT */}
                  {activeTab === 'skills' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="font-bold text-spider-blue-electric">SKILLS ARSENAL ({skillsList.length})</span>
                        <button
                          onClick={() => setSkillModal({ open: true, isEdit: false, data: { name: '', category: 'frontend', level: 85, icon: '' } })}
                          className="px-4 py-2 rounded-xl bg-spider-blue text-white font-bold hover:bg-blue-600 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD NEW SKILL</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                        {skillsList.map((s, idx) => (
                          <div key={s._id || idx} className={`p-3.5 rounded-xl border font-mono text-xs flex justify-between items-center ${isDark ? 'bg-spider-night border-white/10' : 'bg-slate-100 border-black/10'}`}>
                            <div>
                              <span className="font-bold block">{s.name}</span>
                              <span className="opacity-50 text-[10px]">{s.category} • Level: {s.level}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSkillModal({ open: true, isEdit: true, data: s })}
                                className="p-1.5 rounded bg-spider-blue/10 text-spider-blue hover:bg-spider-blue hover:text-white"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ open: true, type: 'skill', id: s._id, title: s.name })}
                                className="p-1.5 rounded bg-spider-red/10 text-spider-red hover:bg-spider-red hover:text-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: PROJECTS MANAGEMENT */}
                  {activeTab === 'projects' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="font-bold text-spider-red">PROJECTS REPOSITORY ({projectsList.length})</span>
                        <button
                          onClick={() => setProjectModal({ open: true, isEdit: false, data: { title: '', category: 'Full Stack App', description: '', fullDescription: '', imageUrl: '', liveUrl: '', githubUrl: '', tags: [], featured: false } })}
                          className="px-4 py-2 rounded-xl bg-spider-red text-white font-bold hover:bg-spider-red-dark transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD NEW PROJECT</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {projectsList.map((p, idx) => (
                          <div key={p._id || idx} className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs ${isDark ? 'bg-spider-night border-white/10' : 'bg-slate-100 border-black/10'}`}>
                            <div className="flex items-center gap-3">
                              {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded object-cover" />}
                              <div>
                                <span className="font-orbitron font-bold block">{p.title}</span>
                                <span className="opacity-60 text-[10px]">{p.category || 'Web App'} • {p.featured ? 'FEATURED' : 'STANDARD'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setProjectModal({ open: true, isEdit: true, data: p })}
                                className="p-1.5 rounded bg-spider-blue/10 text-spider-blue hover:bg-spider-blue hover:text-white"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ open: true, type: 'project', id: p._id, title: p.title })}
                                className="p-1.5 rounded bg-spider-red/10 text-spider-red hover:bg-spider-red hover:text-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: EXPERIENCE MANAGEMENT */}
                  {activeTab === 'experience' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="font-bold text-spider-red">EXPERIENCE LOG ({experienceList.length})</span>
                        <button
                          onClick={() => setExpModal({ open: true, isEdit: false, data: { role: '', company: '', description: '', startDate: '2024', endDate: 'Present', technologies: [] } })}
                          className="px-4 py-2 rounded-xl bg-spider-red text-white font-bold hover:bg-spider-red-dark transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD EXPERIENCE</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {experienceList.map((e, idx) => (
                          <div key={e._id || idx} className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs ${isDark ? 'bg-spider-night border-white/10' : 'bg-slate-100 border-black/10'}`}>
                            <div>
                              <span className="font-orbitron font-bold block">{e.role || e.title}</span>
                              <span className="opacity-60 text-[10px]">{e.company || e.organization} • {e.startDate || e.period}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setExpModal({ open: true, isEdit: true, data: e })}
                                className="p-1.5 rounded bg-spider-blue/10 text-spider-blue hover:bg-spider-blue hover:text-white"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ open: true, type: 'exp', id: e._id, title: e.role || e.title })}
                                className="p-1.5 rounded bg-spider-red/10 text-spider-red hover:bg-spider-red hover:text-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 7: CODE LAB MANAGEMENT */}
                  {activeTab === 'code' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="font-bold text-spider-blue-electric">CODE EXAMPLES ({codeList.length || 5})</span>
                        <button
                          onClick={() => setCodeModal({ open: true, isEdit: false, data: { title: 'new-example.js', language: 'JavaScript', code: '// code here', output: '// output here' } })}
                          className="px-4 py-2 rounded-xl bg-spider-blue text-white font-bold hover:bg-blue-600 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD CODE EXAMPLE</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {codeList.map((c, idx) => (
                          <div key={c._id || idx} className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs ${isDark ? 'bg-spider-night border-white/10' : 'bg-slate-100 border-black/10'}`}>
                            <div>
                              <span className="font-bold block text-spider-blue-electric">{c.title}</span>
                              <span className="opacity-60 text-[10px]">{c.language}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setCodeModal({ open: true, isEdit: true, data: c })}
                                className="p-1.5 rounded bg-spider-blue/10 text-spider-blue hover:bg-spider-blue hover:text-white"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ open: true, type: 'code', id: c._id, title: c.title })}
                                className="p-1.5 rounded bg-spider-red/10 text-spider-red hover:bg-spider-red hover:text-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 8: RESUME MANAGEMENT */}
                  {activeTab === 'resume' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-mono text-xs border-b pb-4 border-current/10">
                        <div>
                          <span className="font-bold text-spider-red text-sm block">RESUME DOSSIER MANAGER</span>
                          <span className="opacity-60 text-[10px]">Manage the active PDF dossier used by the portfolio Resume buttons</span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold self-start sm:self-auto uppercase tracking-wider ${
                          resumeData?.fileUrl
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {resumeData?.fileUrl ? '● ACTIVE DOSSIER ONLINE' : '○ NO ACTIVE RESUME'}
                        </span>
                      </div>

                      {/* Currently Active Resume Card */}
                      {resumeData?.fileUrl ? (
                        <div className={`p-5 rounded-2xl border-2 space-y-4 ${
                          isDark ? 'bg-spider-night border-spider-red/40 text-white' : 'bg-slate-50 border-spider-blue/30 text-spider-night'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 rounded-xl bg-spider-red/10 border border-spider-red/30 text-spider-red">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-orbitron font-bold text-sm sm:text-base">{resumeData.fileName}</h4>
                                <div className="flex flex-wrap gap-2 text-[10px] font-mono opacity-70 mt-1">
                                  <span>TYPE: {resumeData.fileType || 'PDF'}</span>
                                  <span>•</span>
                                  <span>SIZE: {resumeData.formattedSize || `${(resumeData.fileSize / (1024 * 1024)).toFixed(2)} MB`}</span>
                                  <span>•</span>
                                  <span>UPDATED: {new Date(resumeData.updatedAt || resumeData.uploadedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Active Card Actions */}
                            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                              {/* Preview Action */}
                              <a
                                href={getResumeDownloadUrl(resumeData.fileUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl border border-spider-blue/40 text-spider-blue-electric hover:bg-spider-blue hover:text-white transition-all flex items-center gap-1.5 font-bold"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>PREVIEW</span>
                              </a>

                              {/* Download Action */}
                              <a
                                href={getResumeDownloadUrl(resumeData.fileUrl)}
                                download={resumeData.fileName || 'Resume.pdf'}
                                className="px-3.5 py-2 rounded-xl border border-current/20 hover:bg-white/10 transition-all flex items-center gap-1.5 font-bold"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>DOWNLOAD</span>
                              </a>

                              {/* Delete Action */}
                              <button
                                onClick={() => setConfirmDelete({ open: true, type: 'resume', id: 'active-resume', title: resumeData.fileName })}
                                className="px-3.5 py-2 rounded-xl bg-spider-red/10 border border-spider-red/30 text-spider-red hover:bg-spider-red hover:text-white transition-all flex items-center gap-1.5 font-bold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>DELETE</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`p-6 rounded-2xl border border-dashed text-center font-mono text-xs space-y-2 ${
                          isDark ? 'bg-spider-night/50 border-white/20 text-mono-400' : 'bg-slate-50 border-black/20 text-mono-600'
                        }`}>
                          <AlertTriangle className="w-8 h-8 mx-auto text-amber-400 opacity-80" />
                          <p className="font-bold text-sm text-amber-400">NO RESUME CURRENTLY UPLOADED</p>
                          <p className="text-[11px] opacity-75 max-w-sm mx-auto">
                            The portfolio is currently showing fallback request options. Upload a PDF file below to make it active instantly.
                          </p>
                        </div>
                      )}

                      {/* Drag and Drop / Upload Staging Area */}
                      <div className="space-y-3">
                        <span className="font-mono text-xs font-bold block text-spider-blue-electric">
                          {resumeData?.fileUrl ? 'REPLACE ACTIVE RESUME' : 'UPLOAD NEW RESUME'}
                        </span>

                        <div
                          onDragOver={(e) => { e.preventDefault(); setResumeDragActive(true); }}
                          onDragLeave={() => setResumeDragActive(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setResumeDragActive(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleResumeFileSelect(e.dataTransfer.files[0]);
                            }
                          }}
                          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer relative ${
                            resumeDragActive
                              ? 'border-spider-red bg-spider-red/10'
                              : isDark
                              ? 'border-spider-red/30 hover:border-spider-red/60 bg-spider-night/40'
                              : 'border-spider-blue/30 hover:border-spider-blue/60 bg-slate-50'
                          }`}
                        >
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleResumeFileSelect(e.target.files[0]);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />

                          <div className="flex flex-col items-center space-y-2 pointer-events-none">
                            <div className="p-3.5 rounded-2xl bg-spider-red/10 border border-spider-red/30 text-spider-red">
                              <FileUp className="w-6 h-6 animate-pulse" />
                            </div>
                            <span className="font-orbitron font-bold text-xs sm:text-sm tracking-wider uppercase text-spider-red">
                              CLICK TO BROWSE OR DRAG & DROP PDF
                            </span>
                            <span className="font-mono text-[10px] opacity-60">
                              Supported format: <strong>.PDF</strong> (Maximum file size: 15MB)
                            </span>
                          </div>
                        </div>

                        {/* Staged File Card & Confirmation Action */}
                        {selectedResumeFile && (
                          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs ${
                            isDark ? 'bg-spider-night-card border-spider-blue/40' : 'bg-white border-spider-blue/40'
                          }`}>
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-spider-blue" />
                              <div>
                                <span className="font-bold block">{selectedResumeFile.name}</span>
                                <span className="opacity-60 text-[10px]">
                                  {(selectedResumeFile.size / (1024 * 1024)).toFixed(2)} MB • READY FOR UPLOAD
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedResumeFile(null)}
                                className="px-3 py-1.5 rounded-lg border border-current/20 text-[11px]"
                              >
                                CANCEL
                              </button>

                              <button
                                type="button"
                                disabled={resumeUploading}
                                onClick={() => handleResumeUpload(Boolean(resumeData?.fileUrl))}
                                className="px-4 py-1.5 rounded-lg bg-spider-red text-white font-bold hover:bg-spider-red-dark transition-all flex items-center gap-1.5 text-[11px] shadow-spider-red disabled:opacity-50"
                              >
                                {resumeUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                <span>{resumeUploading ? 'UPLOADING...' : (resumeData?.fileUrl ? 'REPLACE RESUME' : 'CONFIRM & UPLOAD')}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 9: SECURITY & ACCOUNT SETTINGS */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-mono text-xs border-b pb-4 border-current/10">
                        <div>
                          <span className="font-bold text-spider-red text-sm block">ACCOUNT & SECURITY SETTINGS</span>
                          <span className="opacity-60 text-[10px]">Manage your admin credentials, password, and session access</span>
                        </div>

                        <span className="px-3 py-1 rounded-full text-[10px] font-bold self-start sm:self-auto uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>AUTHENTICATED // ACTIVE</span>
                        </span>
                      </div>

                      {/* Account Overview Card */}
                      <div className={`p-5 rounded-2xl border-2 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs ${
                        isDark ? 'bg-spider-night border-spider-red/40 text-white' : 'bg-slate-50 border-spider-blue/30 text-spider-night'
                      }`}>
                        <div>
                          <span className="opacity-60 text-[10px] uppercase block">CURRENT USERNAME</span>
                          <span className="font-orbitron font-bold text-sm sm:text-base text-spider-red">
                            {accountData?.username || adminUser?.username || 'admin'}
                          </span>
                        </div>

                        <div>
                          <span className="opacity-60 text-[10px] uppercase block">ENCRYPTION PROTOCOL</span>
                          <span className="font-bold text-spider-blue-electric">
                            BCRYPT // 12-ROUNDS HASH
                          </span>
                        </div>

                        <div>
                          <span className="opacity-60 text-[10px] uppercase block">PASSWORD LAST UPDATED</span>
                          <span className="font-bold opacity-90">
                            {accountData?.passwordChangedAt ? new Date(accountData.passwordChangedAt).toLocaleDateString() : 'Active Session'}
                          </span>
                        </div>
                      </div>

                      {/* Two Columns / Cards for Username & Password */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* FORM 1: CHANGE USERNAME */}
                        <div className={`p-6 rounded-2xl border-2 space-y-4 ${
                          isDark ? 'bg-spider-night-card border-spider-blue/30 text-white' : 'bg-white border-spider-blue/20 text-spider-night'
                        }`}>
                          <div className="flex items-center gap-2.5 border-b pb-3 border-current/10 font-mono text-xs">
                            <UserCheck className="w-4 h-4 text-spider-blue" />
                            <span className="font-bold tracking-wider uppercase text-spider-blue-electric">CHANGE USERNAME</span>
                          </div>

                          <form onSubmit={handleUsernameSubmit} className="space-y-3 font-mono text-xs">
                            {/* Current Username Readonly */}
                            <div>
                              <label className="block mb-1 opacity-70 text-[10px] uppercase font-bold">CURRENT USERNAME</label>
                              <div className="relative">
                                <User className="w-4 h-4 absolute left-3 top-3 opacity-40" />
                                <input
                                  type="text"
                                  disabled
                                  value={accountData?.username || adminUser?.username || ''}
                                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border opacity-60 cursor-not-allowed ${
                                    isDark ? 'bg-spider-night border-white/10' : 'bg-slate-100 border-black/10'
                                  }`}
                                />
                              </div>
                            </div>

                            {/* New Username */}
                            <div>
                              <label className="block mb-1 opacity-70 text-[10px] uppercase font-bold">NEW USERNAME</label>
                              <div className="relative">
                                <UserCheck className="w-4 h-4 absolute left-3 top-3 text-spider-blue" />
                                <input
                                  type="text"
                                  required
                                  value={usernameForm.newUsername}
                                  onChange={(e) => setUsernameForm({ ...usernameForm, newUsername: e.target.value })}
                                  placeholder="e.g. shubham_admin"
                                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border focus:outline-none transition-all ${
                                    isDark ? 'bg-spider-night border-white/20 focus:border-spider-blue' : 'bg-slate-50 border-black/15 focus:border-spider-blue'
                                  }`}
                                />
                              </div>
                            </div>

                            {/* Confirm New Username */}
                            <div>
                              <label className="block mb-1 opacity-70 text-[10px] uppercase font-bold">CONFIRM NEW USERNAME</label>
                              <div className="relative">
                                <Check className="w-4 h-4 absolute left-3 top-3 text-spider-blue" />
                                <input
                                  type="text"
                                  required
                                  value={usernameForm.confirmUsername}
                                  onChange={(e) => setUsernameForm({ ...usernameForm, confirmUsername: e.target.value })}
                                  placeholder="Re-enter new username"
                                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border focus:outline-none transition-all ${
                                    isDark ? 'bg-spider-night border-white/20 focus:border-spider-blue' : 'bg-slate-50 border-black/15 focus:border-spider-blue'
                                  }`}
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={securityLoading}
                              className="w-full py-3 rounded-xl bg-spider-blue text-white font-orbitron font-bold text-xs uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-spider-blue mt-4 disabled:opacity-50"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>UPDATE USERNAME</span>
                            </button>
                          </form>
                        </div>

                        {/* FORM 2: CHANGE PASSWORD */}
                        <div className={`p-6 rounded-2xl border-2 space-y-4 ${
                          isDark ? 'bg-spider-night-card border-spider-red/30 text-white' : 'bg-white border-spider-red/20 text-spider-night'
                        }`}>
                          <div className="flex items-center gap-2.5 border-b pb-3 border-current/10 font-mono text-xs">
                            <KeyRound className="w-4 h-4 text-spider-red" />
                            <span className="font-bold tracking-wider uppercase text-spider-red">CHANGE PASSWORD</span>
                          </div>

                          <form onSubmit={handlePasswordSubmit} className="space-y-3 font-mono text-xs">
                            {/* Current Password */}
                            <div>
                              <label className="block mb-1 opacity-70 text-[10px] uppercase font-bold">CURRENT PASSWORD</label>
                              <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3 top-3 text-spider-red" />
                                <input
                                  type={showPass.current ? 'text' : 'password'}
                                  required
                                  value={passwordForm.currentPassword}
                                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                  placeholder="Enter current password"
                                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border focus:outline-none transition-all ${
                                    isDark ? 'bg-spider-night border-white/20 focus:border-spider-red' : 'bg-slate-50 border-black/15 focus:border-spider-red'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                                  className="absolute right-3 top-3 opacity-60 hover:opacity-100"
                                >
                                  {showPass.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* New Password */}
                            <div>
                              <label className="block mb-1 opacity-70 text-[10px] uppercase font-bold">NEW PASSWORD (MIN. 8 CHARS)</label>
                              <div className="relative">
                                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-spider-red" />
                                <input
                                  type={showPass.next ? 'text' : 'password'}
                                  required
                                  value={passwordForm.newPassword}
                                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                  placeholder="Enter new strong password"
                                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border focus:outline-none transition-all ${
                                    isDark ? 'bg-spider-night border-white/20 focus:border-spider-red' : 'bg-slate-50 border-black/15 focus:border-spider-red'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPass({ ...showPass, next: !showPass.next })}
                                  className="absolute right-3 top-3 opacity-60 hover:opacity-100"
                                >
                                  {showPass.next ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Confirm New Password */}
                            <div>
                              <label className="block mb-1 opacity-70 text-[10px] uppercase font-bold">CONFIRM NEW PASSWORD</label>
                              <div className="relative">
                                <Check className="w-4 h-4 absolute left-3 top-3 text-spider-red" />
                                <input
                                  type={showPass.confirm ? 'text' : 'password'}
                                  required
                                  value={passwordForm.confirmPassword}
                                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                  placeholder="Re-enter new password"
                                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border focus:outline-none transition-all ${
                                    isDark ? 'bg-spider-night border-white/20 focus:border-spider-red' : 'bg-slate-50 border-black/15 focus:border-spider-red'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                                  className="absolute right-3 top-3 opacity-60 hover:opacity-100"
                                >
                                  {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={securityLoading}
                              className="w-full py-3 rounded-xl bg-spider-red text-white font-orbitron font-bold text-xs uppercase tracking-wider hover:bg-spider-red-dark transition-all flex items-center justify-center gap-2 shadow-spider-red mt-4 disabled:opacity-50"
                            >
                              <KeyRound className="w-4 h-4" />
                              <span>UPDATE PASSWORD</span>
                            </button>
                          </form>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* TAB 10: AUDIO MANAGEMENT */}
                  {activeTab === 'audio' && (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-mono text-xs border-b pb-4 border-current/10">
                        <div>
                          <span className="font-bold text-spider-red text-sm block">AUDIO MANAGEMENT</span>
                          <span className="opacity-60 text-[10px]">Manage background soundtrack for the public portfolio</span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold self-start sm:self-auto uppercase tracking-wider flex items-center gap-1.5 ${
                          audioAdminData?.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {audioAdminData?.isActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                          <span>{audioAdminData?.fileUrl ? 'AUDIO ACTIVE' : 'NO AUDIO'}</span>
                        </span>
                      </div>

                      {/* Active Audio Dossier Card */}
                      {audioAdminData?.fileUrl && (
                        <div className={`p-5 rounded-2xl border-2 font-mono text-xs space-y-4 ${
                          isDark ? 'bg-spider-night border-spider-red/40 text-white' : 'bg-slate-50 border-spider-blue/30 text-spider-night'
                        }`}>
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                              <Music className={`w-8 h-8 ${isDark ? 'text-spider-red' : 'text-spider-blue'}`} />
                              <div>
                                <span className="font-bold block">{audioAdminData.fileName || 'Background Audio'}</span>
                                <span className="opacity-60 text-[10px]">
                                  {audioAdminData.fileType} • {audioAdminData.formattedSize || 'N/A'} • Uploaded {audioAdminData.uploadedAt ? new Date(audioAdminData.uploadedAt).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Preview Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (!audioPreviewRef.current) {
                                    const el = new Audio(getAudioFileUrl(audioAdminData.fileUrl));
                                    el.volume = 0.3;
                                    audioPreviewRef.current = el;
                                  }
                                  if (audioPreviewPlaying) {
                                    audioPreviewRef.current.pause();
                                    setAudioPreviewPlaying(false);
                                  } else {
                                    audioPreviewRef.current.play().catch(() => {});
                                    setAudioPreviewPlaying(true);
                                    audioPreviewRef.current.onended = () => setAudioPreviewPlaying(false);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all ${
                                  isDark ? 'border-white/20 hover:border-spider-blue' : 'border-black/20 hover:border-spider-blue'
                                }`}
                              >
                                {audioPreviewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                <span>{audioPreviewPlaying ? 'PAUSE' : 'PREVIEW'}</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (audioPreviewRef.current) {
                                    audioPreviewRef.current.pause();
                                    audioPreviewRef.current = null;
                                    setAudioPreviewPlaying(false);
                                  }
                                  setConfirmDelete({ open: true, type: 'audio', id: null, title: 'Background Audio' });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-red-900/50 border border-red-500/30 text-red-300 hover:bg-red-800/60 text-[11px] flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>DELETE</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Audio Settings */}
                      <div className={`p-5 rounded-2xl border-2 space-y-4 font-mono text-xs ${
                        isDark ? 'bg-spider-night-card border-spider-blue/30' : 'bg-white border-spider-blue/20'
                      }`}>
                        <div className="flex items-center gap-2.5 border-b pb-3 border-current/10">
                          <Settings className="w-4 h-4 text-spider-blue" />
                          <span className="font-bold tracking-wider uppercase text-spider-blue-electric">AUDIO SETTINGS</span>
                        </div>

                        {/* Enable/Disable Toggle */}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px] uppercase opacity-70">BACKGROUND AUDIO ENABLED</span>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!audioAdminData?.fileUrl) {
                                showToastMsg('Upload audio first before toggling.', 'info');
                                return;
                              }
                              const newVal = !audioEnabled;
                              setAudioEnabled(newVal);
                              try {
                                await updateAudioSettings({ isEnabled: newVal });
                                showToastMsg(newVal ? 'Audio enabled on public site.' : 'Audio disabled on public site.');
                                await loadAllData();
                                if (onDataUpdated) onDataUpdated();
                              } catch (err) {
                                showToastMsg('Failed to update audio setting.', 'error');
                                setAudioEnabled(!newVal);
                              }
                            }}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              audioEnabled ? (isDark ? 'bg-spider-red' : 'bg-spider-blue') : (isDark ? 'bg-white/10' : 'bg-black/10')
                            }`}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                              audioEnabled ? 'left-6' : 'left-0.5'
                            }`} />
                          </button>
                        </div>

                        {/* Default Volume Slider */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[10px] uppercase opacity-70">DEFAULT VOLUME</span>
                            <span className={`text-[10px] font-bold ${isDark ? 'text-spider-red' : 'text-spider-blue'}`}>{audioVolumeSlider}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={audioVolumeSlider}
                            onChange={(e) => setAudioVolumeSlider(Number(e.target.value))}
                            onMouseUp={async () => {
                              if (!audioAdminData?.fileUrl) return;
                              try {
                                await updateAudioSettings({ defaultVolume: audioVolumeSlider });
                                showToastMsg(`Default volume set to ${audioVolumeSlider}%`);
                                if (onDataUpdated) onDataUpdated();
                              } catch (err) {
                                showToastMsg('Failed to update volume.', 'error');
                              }
                            }}
                            onTouchEnd={async () => {
                              if (!audioAdminData?.fileUrl) return;
                              try {
                                await updateAudioSettings({ defaultVolume: audioVolumeSlider });
                                showToastMsg(`Default volume set to ${audioVolumeSlider}%`);
                                if (onDataUpdated) onDataUpdated();
                              } catch (err) {
                                showToastMsg('Failed to update volume.', 'error');
                              }
                            }}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-spider-red"
                            style={{ background: `linear-gradient(to right, ${isDark ? '#dc2626' : '#2563eb'} ${audioVolumeSlider}%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} ${audioVolumeSlider}%)` }}
                          />
                          <span className="text-[9px] opacity-50">Recommended: 15%–25%. This controls the starting volume for visitors.</span>
                        </div>
                      </div>

                      {/* Upload / Replace Audio Zone */}
                      <div className={`p-5 rounded-2xl border-2 space-y-4 font-mono text-xs ${
                        isDark ? 'bg-spider-night-card border-spider-red/30' : 'bg-white border-spider-red/20'
                      }`}>
                        <div className="flex items-center gap-2.5 border-b pb-3 border-current/10">
                          <Upload className="w-4 h-4 text-spider-red" />
                          <span className="font-bold tracking-wider uppercase text-spider-red">
                            {audioAdminData?.fileUrl ? 'REPLACE AUDIO' : 'UPLOAD AUDIO'}
                          </span>
                        </div>

                        {/* Drag & Drop Zone */}
                        <div
                          className={`relative p-6 rounded-xl border-2 border-dashed text-center transition-all cursor-pointer ${
                            audioDragActive
                              ? (isDark ? 'border-spider-red bg-spider-red/10' : 'border-spider-blue bg-spider-blue/10')
                              : (isDark ? 'border-white/15 hover:border-spider-red/40' : 'border-black/15 hover:border-spider-blue/40')
                          }`}
                          onDragOver={(e) => { e.preventDefault(); setAudioDragActive(true); }}
                          onDragLeave={() => setAudioDragActive(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setAudioDragActive(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              const ext = file.name.split('.').pop()?.toLowerCase();
                              if (['mp3', 'wav', 'ogg'].includes(ext)) {
                                setSelectedAudioFile(file);
                              } else {
                                showToastMsg('Invalid format. Use MP3, WAV, or OGG.', 'error');
                              }
                            }
                          }}
                          onClick={() => {
                            const inp = document.createElement('input');
                            inp.type = 'file';
                            inp.accept = '.mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg';
                            inp.onchange = (e) => {
                              const file = e.target.files?.[0];
                              if (file) setSelectedAudioFile(file);
                            };
                            inp.click();
                          }}
                        >
                          <Music className={`w-8 h-8 mx-auto mb-2 opacity-30 ${isDark ? 'text-white' : 'text-black'}`} />
                          <p className="font-bold text-[11px] mb-1">
                            {audioDragActive ? 'DROP AUDIO FILE HERE' : 'DRAG & DROP OR CLICK TO SELECT'}
                          </p>
                          <p className="text-[9px] opacity-50">Accepted: MP3, WAV, OGG • Max 30MB</p>
                        </div>

                        {/* Staged File */}
                        {selectedAudioFile && (
                          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                            isDark ? 'bg-spider-night-card border-spider-blue/40' : 'bg-white border-spider-blue/40'
                          }`}>
                            <div className="flex items-center gap-3">
                              <Music className="w-5 h-5 text-spider-blue" />
                              <div>
                                <span className="font-bold block">{selectedAudioFile.name}</span>
                                <span className="opacity-60 text-[10px]">
                                  {(selectedAudioFile.size / (1024 * 1024)).toFixed(2)} MB • READY FOR UPLOAD
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedAudioFile(null)}
                                className="px-3 py-1.5 rounded-lg border border-current/20 text-[11px]"
                              >
                                CANCEL
                              </button>

                              <button
                                type="button"
                                disabled={audioUploading}
                                onClick={async () => {
                                  setAudioUploading(true);
                                  try {
                                    if (audioPreviewRef.current) {
                                      audioPreviewRef.current.pause();
                                      audioPreviewRef.current = null;
                                      setAudioPreviewPlaying(false);
                                    }
                                    const isReplace = Boolean(audioAdminData?.fileUrl);
                                    const res = isReplace
                                      ? await replaceAudio(selectedAudioFile)
                                      : await uploadAudio(selectedAudioFile);
                                    if (res.success) {
                                      showToastMsg(isReplace ? 'Audio replaced successfully!' : 'Audio uploaded successfully!');
                                      setSelectedAudioFile(null);
                                      await loadAllData();
                                      if (onDataUpdated) onDataUpdated();
                                    }
                                  } catch (err) {
                                    showToastMsg(err.response?.data?.message || 'Failed to upload audio.', 'error');
                                  } finally {
                                    setAudioUploading(false);
                                  }
                                }}
                                className="px-4 py-1.5 rounded-lg bg-spider-red text-white font-bold hover:bg-spider-red-dark transition-all flex items-center gap-1.5 text-[11px] shadow-spider-red disabled:opacity-50"
                              >
                                {audioUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                <span>{audioUploading ? 'UPLOADING...' : (audioAdminData?.fileUrl ? 'REPLACE AUDIO' : 'CONFIRM & UPLOAD')}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 11: SETTINGS */}
                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <h4 className="font-orbitron text-xs font-bold uppercase text-spider-red">SYSTEM SETTINGS</h4>
                      <p className="font-sans text-xs opacity-75">
                        Database status: <strong>CONNECTED</strong>. Admin authentication uses HTTP-only JWT cookies and server session token verification.
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* MODAL 1: ADD/EDIT PROJECT */}
        {projectModal.open && projectModal.data && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`max-w-lg w-full p-6 rounded-3xl border-2 space-y-4 ${isDark ? 'bg-spider-night-card border-spider-red/50 text-white' : 'bg-white border-spider-blue/40 text-black'}`}>
              <div className="flex justify-between items-center border-b pb-3 font-mono text-xs font-bold text-spider-red">
                <span>{projectModal.isEdit ? 'EDIT PROJECT' : 'ADD NEW PROJECT'}</span>
                <button onClick={() => setProjectModal({ open: false, isEdit: false, data: null })}><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block mb-1">PROJECT NAME</label>
                  <input type="text" value={projectModal.data.title || ''} onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, title: e.target.value } })} required className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-spider-night border-white/20' : 'bg-slate-100 border-black/20'}`} />
                </div>
                <div>
                  <label className="block mb-1">CATEGORY</label>
                  <input type="text" value={projectModal.data.category || ''} onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, category: e.target.value } })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-spider-night border-white/20' : 'bg-slate-100 border-black/20'}`} />
                </div>
                <div>
                  <label className="block mb-1">DESCRIPTION</label>
                  <textarea rows={2} value={projectModal.data.description || ''} onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, description: e.target.value } })} required className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-spider-night border-white/20' : 'bg-slate-100 border-black/20'}`} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1">GITHUB URL</label>
                    <input type="text" value={projectModal.data.githubUrl || ''} onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, githubUrl: e.target.value } })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-spider-night border-white/20' : 'bg-slate-100 border-black/20'}`} />
                  </div>
                  <div>
                    <label className="block mb-1">LIVE DEMO URL</label>
                    <input type="text" value={projectModal.data.liveUrl || ''} onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, liveUrl: e.target.value } })} className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-spider-night border-white/20' : 'bg-slate-100 border-black/20'}`} />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setProjectModal({ open: false, isEdit: false, data: null })} className="px-4 py-2 rounded-xl border border-current/20">CANCEL</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-spider-red text-white font-bold">SAVE PROJECT</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: CONFIRM DELETE DIALOG */}
        {confirmDelete.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`max-w-sm w-full p-6 rounded-3xl border-2 space-y-4 text-center ${isDark ? 'bg-spider-night border-spider-red text-white' : 'bg-white border-spider-red text-black'}`}>
              <Trash2 className="w-10 h-10 text-spider-red mx-auto animate-bounce" />
              <h5 className="font-orbitron font-bold text-sm uppercase">CONFIRM DELETION</h5>
              <p className="font-mono text-xs opacity-80">Are you sure you want to delete <strong className="text-spider-red">{confirmDelete.title}</strong>?</p>
              <div className="flex justify-center gap-3 pt-2 font-mono text-xs">
                <button onClick={() => setConfirmDelete({ open: false, type: '', id: null, title: '' })} className="px-4 py-2 rounded-xl border border-current/20">CANCEL</button>
                <button
                  onClick={() => {
                    if (confirmDelete.type === 'project') handleDeleteProject(confirmDelete.id);
                    if (confirmDelete.type === 'skill') handleDeleteSkill(confirmDelete.id);
                    if (confirmDelete.type === 'exp') handleDeleteExp(confirmDelete.id);
                    if (confirmDelete.type === 'code') handleDeleteCode(confirmDelete.id);
                    if (confirmDelete.type === 'resume') handleDeleteResume();
                    if (confirmDelete.type === 'audio') handleDeleteAudio();
                  }}
                  className="px-5 py-2 rounded-xl bg-spider-red text-white font-bold"
                >
                  DELETE NOW
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: CONFIRM SECURITY CREDENTIALS UPDATE */}
        {confirmSecurityModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`max-w-md w-full p-6 rounded-3xl border-2 space-y-4 text-center ${
              isDark ? 'bg-spider-night border-spider-blue text-white shadow-spider-blue' : 'bg-white border-spider-blue text-black shadow-lg'
            }`}>
              <ShieldAlert className="w-10 h-10 text-spider-blue mx-auto animate-pulse" />
              <h5 className="font-orbitron font-bold text-sm uppercase text-spider-blue-electric">{confirmSecurityModal.title}</h5>
              <p className="font-mono text-xs opacity-85 leading-relaxed">{confirmSecurityModal.details}</p>
              
              <div className="flex justify-center gap-3 pt-3 font-mono text-xs">
                <button
                  disabled={securityLoading}
                  onClick={() => setConfirmSecurityModal({ open: false, type: '', title: '', details: '' })}
                  className="px-4 py-2 rounded-xl border border-current/20 hover:bg-white/10"
                >
                  CANCEL
                </button>
                <button
                  disabled={securityLoading}
                  onClick={handleConfirmSecurityUpdate}
                  className="px-5 py-2 rounded-xl bg-spider-blue text-white font-bold hover:bg-blue-600 flex items-center gap-1.5 shadow-spider-blue disabled:opacity-50"
                >
                  {securityLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>CONFIRM UPDATE</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AnimatePresence>
  );
}
