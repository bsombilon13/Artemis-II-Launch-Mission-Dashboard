import { useState, useEffect, useCallback } from 'react';
import { differenceInSeconds, addSeconds } from 'date-fns';

export interface MissionClock {
  lTime: number; // Seconds relative to launch (L- or L+)
  tTime: number; // Seconds relative to launch (T- or T+)
  isPaused: boolean;
  launchDate: Date;
}

export function useMissionClock(initialLaunchDate: Date) {
  const [launchDate, setLaunchDate] = useState(initialLaunchDate);
  const [isPaused, setIsPaused] = useState(false);
  const [tOffset, setTOffset] = useState(0); // Offset for T-time if paused
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lTime = differenceInSeconds(now, launchDate);
  
  // For simplicity in this dashboard, we'll treat T-time as L-time unless we implement a manual hold
  // But let's at least provide the value
  const tTime = lTime; 

  const updateLaunchDate = useCallback((newDate: Date) => {
    setLaunchDate(newDate);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return {
    lTime,
    tTime,
    isPaused,
    launchDate,
    updateLaunchDate,
    togglePause,
    now
  };
}
