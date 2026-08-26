import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';
import { getAudioFileUrl } from '../utils/api';

export default function SoundToggle({ theme = 'dark', audioData, activeSection }) {
  const [isOn, setIsOn] = useState(sound.isSoundOn);
  const [loaded, setLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const isDark = theme === 'dark';

  // Load background track when audioData becomes available
  useEffect(() => {
    if (!audioData?.fileUrl || !audioData?.isEnabled) {
      sound.unloadBackgroundTrack();
      setLoaded(false);
      return;
    }

    const fullUrl = getAudioFileUrl(audioData.fileUrl);
    if (fullUrl) {
      sound.loadBackgroundTrack(fullUrl, audioData.defaultVolume ?? 20);
      setLoaded(true);

      // If user previously chose ON and we just loaded the track, try to start
      if (sound.isSoundOn) {
        sound._startMusic();
      }
    }
  }, [audioData?.fileUrl, audioData?.isEnabled, audioData?.defaultVolume]);

  // Pass active section to audio engine for dynamic volume
  useEffect(() => {
    if (activeSection) {
      sound.setSection(activeSection);
    }
  }, [activeSection]);

  const handleToggle = useCallback(() => {
    const newState = sound.toggle();
    setIsOn(newState);
  }, []);

  // Don't render if audio is not available or not enabled by admin
  if (!audioData?.isEnabled || !audioData?.fileUrl) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          relative group w-11 h-11 rounded-full flex items-center justify-center
          backdrop-blur-md border transition-all duration-300 cursor-pointer
          ${isDark
            ? 'bg-white/5 border-white/10 hover:border-spider-red/50 hover:bg-white/10'
            : 'bg-black/5 border-black/10 hover:border-spider-blue/50 hover:bg-black/10'
          }
        `}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOn ? 'Turn Sound Off' : 'Turn Sound On'}
        title={isOn ? 'Turn Sound Off' : 'Turn Sound On'}
      >
        {/* Icon */}
        <AnimatePresence mode="wait">
          {isOn ? (
            <motion.div
              key="on"
              initial={{ opacity: 0, rotate: -20 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Volume2 className={`w-4.5 h-4.5 ${isDark ? 'text-spider-red' : 'text-spider-blue'}`} />
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ opacity: 0, rotate: 20 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -20 }}
              transition={{ duration: 0.2 }}
            >
              <VolumeX className={`w-4.5 h-4.5 ${isDark ? 'text-white/50' : 'text-black/40'}`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated sound bars (only when ON) */}
        {isOn && (
          <div className="absolute -right-0.5 top-1 flex gap-[2px] items-end h-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-[2px] rounded-full ${isDark ? 'bg-spider-red' : 'bg-spider-blue'}`}
                animate={{
                  height: ['4px', `${8 + i * 2}px`, '4px'],
                }}
                transition={{
                  duration: 0.8 + i * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}

        {/* Subtle glow ring when ON */}
        {isOn && (
          <motion.div
            className={`absolute inset-0 rounded-full ${isDark ? 'shadow-[0_0_12px_rgba(220,38,38,0.2)]' : 'shadow-[0_0_12px_rgba(37,99,235,0.2)]'}`}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap
              px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider
              pointer-events-none
              ${isDark
                ? 'bg-spider-night-card border border-white/10 text-white/80'
                : 'bg-white border border-black/10 text-black/70 shadow-md'
              }
            `}
          >
            {isOn ? 'SOUND OFF' : 'SOUND ON'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
