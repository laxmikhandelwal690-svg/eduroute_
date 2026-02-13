import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const SOUND_STORAGE_KEY = 'eduroute-ui-sound-muted';

type SoundContextValue = {
  isMuted: boolean;
  toggleMuted: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playAchievement: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const createTone = (
  context: AudioContext,
  config: { frequency: number; duration: number; type: OscillatorType; gain: number; delay?: number }
) => {
  const now = context.currentTime + (config.delay ?? 0);
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.frequency, now);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(config.gain, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + config.duration + 0.02);
};

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem(SOUND_STORAGE_KEY) === 'true');
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastClickSoundRef = useRef(0);

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!audioContextRef.current) {
      const Context = window.AudioContext || (window as any).webkitAudioContext;
      if (!Context) {
        return null;
      }
      audioContextRef.current = new Context();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => undefined);
    }

    return audioContextRef.current;
  }, []);

  const playClick = useCallback(() => {
    if (isMuted) return;

    const now = Date.now();
    if (now - lastClickSoundRef.current < 60) return;
    lastClickSoundRef.current = now;

    const context = getContext();
    if (!context) return;

    createTone(context, { frequency: 540, duration: 0.08, type: 'triangle', gain: 0.018 });
    createTone(context, { frequency: 720, duration: 0.07, type: 'sine', gain: 0.012, delay: 0.03 });
  }, [getContext, isMuted]);

  const playSuccess = useCallback(() => {
    if (isMuted) return;
    const context = getContext();
    if (!context) return;

    createTone(context, { frequency: 520, duration: 0.12, type: 'sine', gain: 0.02 });
    createTone(context, { frequency: 660, duration: 0.14, type: 'triangle', gain: 0.017, delay: 0.08 });
    createTone(context, { frequency: 810, duration: 0.16, type: 'sine', gain: 0.014, delay: 0.15 });
  }, [getContext, isMuted]);

  const playAchievement = useCallback(() => {
    if (isMuted) return;
    const context = getContext();
    if (!context) return;

    createTone(context, { frequency: 460, duration: 0.1, type: 'triangle', gain: 0.018 });
    createTone(context, { frequency: 690, duration: 0.15, type: 'sine', gain: 0.018, delay: 0.09 });
    createTone(context, { frequency: 920, duration: 0.2, type: 'triangle', gain: 0.016, delay: 0.18 });
    createTone(context, { frequency: 1150, duration: 0.22, type: 'sine', gain: 0.012, delay: 0.26 });
  }, [getContext, isMuted]);

  const toggleMuted = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const onGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const interactiveElement = target.closest('button, a, [role="button"], input[type="button"], input[type="submit"]');
      if (!interactiveElement) return;

      playClick();
    };

    document.addEventListener('click', onGlobalClick, true);
    return () => document.removeEventListener('click', onGlobalClick, true);
  }, [playClick]);

  const value = useMemo(
    () => ({ isMuted, toggleMuted, playClick, playSuccess, playAchievement }),
    [isMuted, toggleMuted, playClick, playSuccess, playAchievement]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useUISound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useUISound must be used inside SoundProvider');
  }
  return context;
};
