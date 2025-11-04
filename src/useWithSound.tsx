import { useRef, useEffect } from 'react';

interface SoundControls {
  playSound: () => void;
  pauseSound: () => void;
}

export const useWithSound = (audioSource: string): SoundControls => {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundRef.current = new Audio(audioSource);
  }, [audioSource]);

  const playSound = (): void => {
    soundRef.current?.play();
  }

  const pauseSound = (): void => {
    soundRef.current?.pause();
  }

  return {
    playSound,
    pauseSound
  };
}
