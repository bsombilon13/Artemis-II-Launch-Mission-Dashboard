import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: 'ambient' | 'chatter' | 'alert' | 'milestone' | 'click') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const SOUNDS = {
  ambient: 'https://archive.org/download/nasa-space-sounds/Space%20Station%20Ambient.mp3',
  chatter: 'https://www.nasa.gov/wp-content/uploads/2015/01/590331main_ringtone_eagle_has_landed.mp3',
  alert: 'https://www.soundjay.com/buttons/beep-07.mp3',
  milestone: 'https://www.nasa.gov/wp-content/uploads/2015/01/590313main_ringtone_apollo11_quindar.mp3',
  click: 'https://www.soundjay.com/buttons/button-16.mp3',
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const chatterRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize ambient sound
    const ambient = new Audio(SOUNDS.ambient);
    ambient.loop = true;
    ambient.volume = 0.1;
    ambientRef.current = ambient;

    // Initialize chatter sound
    const chatter = new Audio(SOUNDS.chatter);
    chatter.volume = 0.08;
    chatterRef.current = chatter;

    return () => {
      ambient.pause();
      chatter.pause();
    };
  }, []);

  useEffect(() => {
    const ambient = ambientRef.current;
    const chatter = chatterRef.current;

    if (!isMuted && ambient && chatter) {
      const playAmbient = async () => {
        try {
          await ambient.play();
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            setIsMuted(true);
          }
        }
      };
      playAmbient();
      
      const chatterInterval = setInterval(async () => {
        if (Math.random() > 0.8 && !isMuted) {
          try {
            await chatter.play();
          } catch (error) {
            // Ignore chatter errors
          }
        }
      }, 45000);

      return () => clearInterval(chatterInterval);
    } else {
      ambient?.pause();
      chatter?.pause();
    }
  }, [isMuted]);

  const playSound = async (type: keyof typeof SOUNDS) => {
    if (isMuted) return;
    const audio = new Audio(SOUNDS[type]);
    audio.volume = type === 'alert' ? 0.15 : 0.25;
    try {
      await audio.play();
    } catch (error) {
      // Ignore transient sound errors
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
