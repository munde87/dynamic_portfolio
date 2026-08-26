/**
 * PORTFOLIO AUDIO SYSTEM
 * Background music engine + procedural sci-fi sound effects.
 * Uses Web Audio API for SFX and HTMLAudioElement for background music.
 */

const STORAGE_KEY = 'sm_portfolio_sound';
const FADE_DURATION = 800; // ms
const FADE_STEP = 16; // ~60fps

// Section volume multipliers (subtle adjustments)
const SECTION_VOLUMES = {
  hero: 1.0,
  about: 0.95,
  skills: 1.05,
  reactor: 0.9,
  projects: 1.05,
  experience: 0.95,
  terminal: 0.7,
  contact: 1.0,
};

class AudioSystem {
  constructor() {
    // Web Audio API context for SFX
    this.ctx = null;
    this.initialized = false;

    // Background music
    this.bgAudio = null;
    this.bgLoaded = false;
    this.bgUrl = null;

    // State
    this.muted = true; // Default OFF
    this.baseVolume = 0.20; // 20% default
    this.currentVolume = 0;
    this.targetVolume = 0;
    this.fadeInterval = null;
    this.currentSection = 'hero';

    // Restore saved preference
    this._restorePreference();
  }

  _restorePreference() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'on') {
        this.muted = false;
      } else {
        this.muted = true;
      }
    } catch (e) {
      this.muted = true;
    }
  }

  _savePreference() {
    try {
      localStorage.setItem(STORAGE_KEY, this.muted ? 'off' : 'on');
    } catch (e) { /* ignore */ }
  }

  /** Get current sound state */
  get isSoundOn() {
    return !this.muted;
  }

  get isPlaying() {
    return this.bgAudio && !this.bgAudio.paused;
  }

  // ─── Web Audio API Init (for SFX) ──────────────────────────

  _initCtx() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  _resumeCtx() {
    this._initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // ─── Background Music ─────────────────────────────────────

  /**
   * Load a background track URL. Does not auto-play.
   * @param {string} url - Full URL to the audio file
   * @param {number} defaultVolume - 0-100 from admin settings
   */
  loadBackgroundTrack(url, defaultVolume) {
    if (!url) return;

    // Update base volume from admin setting
    if (typeof defaultVolume === 'number' && defaultVolume >= 0 && defaultVolume <= 100) {
      this.baseVolume = defaultVolume / 100;
    }

    // Skip if already loaded with same URL
    if (this.bgUrl === url && this.bgAudio) {
      return;
    }

    // Clean up old audio element
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.removeAttribute('src');
      this.bgAudio.load();
      this.bgAudio = null;
    }

    this.bgUrl = url;
    this.bgLoaded = false;

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.loop = true;
    audio.volume = 0;
    audio.crossOrigin = 'anonymous';

    audio.addEventListener('canplaythrough', () => {
      this.bgLoaded = true;
    }, { once: true });

    audio.addEventListener('error', (e) => {
      console.warn('Background audio load error:', e);
      this.bgLoaded = false;
    });

    audio.src = url;
    this.bgAudio = audio;
  }

  /** Unload and clean up background track */
  unloadBackgroundTrack() {
    this._clearFade();
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.removeAttribute('src');
      this.bgAudio.load();
      this.bgAudio = null;
    }
    this.bgUrl = null;
    this.bgLoaded = false;
    this.currentVolume = 0;
    this.targetVolume = 0;
  }

  /**
   * Toggle sound on/off. Returns new state.
   * @returns {boolean} true = sound is ON
   */
  toggle() {
    this.muted = !this.muted;
    this._savePreference();

    if (!this.muted) {
      this._startMusic();
    } else {
      this._stopMusic();
    }

    return !this.muted;
  }

  /** Start or resume music with fade-in */
  _startMusic() {
    if (!this.bgAudio || !this.bgUrl) return;

    this._resumeCtx();

    const sectionMul = SECTION_VOLUMES[this.currentSection] || 1.0;
    this.targetVolume = this.baseVolume * sectionMul;

    const playPromise = this.bgAudio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay blocked — will retry on next user interaction
      });
    }

    this._fadeToTarget(FADE_DURATION);
  }

  /** Stop music with fade-out then pause */
  _stopMusic() {
    this.targetVolume = 0;
    this._fadeToTarget(FADE_DURATION, () => {
      if (this.bgAudio) {
        this.bgAudio.pause();
      }
    });
  }

  /** Update section for dynamic volume adjustment */
  setSection(sectionId) {
    if (this.currentSection === sectionId) return;
    this.currentSection = sectionId;

    if (!this.muted && this.isPlaying) {
      const sectionMul = SECTION_VOLUMES[sectionId] || 1.0;
      this.targetVolume = this.baseVolume * sectionMul;
      this._fadeToTarget(400); // Smooth 400ms transition between sections
    }
  }

  // ─── Volume Fading ────────────────────────────────────────

  _clearFade() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  _fadeToTarget(durationMs, onComplete) {
    this._clearFade();

    if (!this.bgAudio) {
      if (onComplete) onComplete();
      return;
    }

    const steps = Math.max(1, Math.floor(durationMs / FADE_STEP));
    const delta = (this.targetVolume - this.currentVolume) / steps;
    let step = 0;

    this.fadeInterval = setInterval(() => {
      step++;
      this.currentVolume = Math.max(0, Math.min(1, this.currentVolume + delta));

      if (this.bgAudio) {
        this.bgAudio.volume = Math.max(0, Math.min(1, this.currentVolume));
      }

      if (step >= steps) {
        this._clearFade();
        this.currentVolume = this.targetVolume;
        if (this.bgAudio) {
          this.bgAudio.volume = Math.max(0, Math.min(1, this.targetVolume));
        }
        if (onComplete) onComplete();
      }
    }, FADE_STEP);
  }

  // ─── Procedural SFX (Web Audio API) ──────────────────────

  /** Tactical click / blip */
  playClick() {
    if (this.muted) return;
    this._resumeCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) { /* ignore */ }
  }

  /** Futuristic HUD hover chirp */
  playHover() {
    if (this.muted) return;
    this._resumeCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) { /* ignore */ }
  }

  /** Target lock / scanner ping */
  playTargetLock() {
    if (this.muted) return;
    this._resumeCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.setValueAtTime(3200, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) { /* ignore */ }
  }

  /** Arc Reactor power-up surge */
  playReactorBoot() {
    if (this.muted) return;
    this._resumeCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) { /* ignore */ }
  }

  /** Soft futuristic swoosh (hero entrance, theme switch) */
  playSwoosh() {
    if (this.muted) return;
    this._resumeCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const noise = this.ctx.createBufferSource();
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.15);
      filter.Q.value = 2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.15);
    } catch (e) { /* ignore */ }
  }

  /** Soft success chime (code run complete) */
  playSuccess() {
    if (this.muted) return;
    this._resumeCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } catch (e) { /* ignore */ }
  }

  /** AI Speech Synthesizer (Optional & non-intrusive) */
  speak(text) {
    if (this.muted) return;
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.volume = 0.4;
      const voices = window.speechSynthesis.getVoices();
      const sciFiVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('David') || v.name.includes('Google') || v.name.includes('Natural')));
      if (sciFiVoice) utterance.voice = sciFiVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) { /* ignore */ }
  }
}

export const sound = new AudioSystem();
