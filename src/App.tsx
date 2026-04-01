import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, differenceInSeconds } from 'date-fns';
import { 
  Settings as SettingsIcon, 
  Activity, 
  Clock, 
  Shield, 
  Zap, 
  Radio, 
  Globe, 
  Moon,
  ChevronRight,
  AlertTriangle,
  Play,
  Pause,
  Monitor
} from 'lucide-react';
import { useMissionClock } from './hooks/useMissionClock';
import { MISSION_MILESTONES } from './constants/missionData';
import { Telemetry } from './components/Telemetry';
import { Timeline } from './components/Timeline';
import { VideoWall } from './components/VideoWall';
import { Trajectory } from './components/Trajectory';
import { Settings } from './components/Settings';
import { Spacecraft3D } from './components/Spacecraft3D';
import { DynamicBackground } from './components/DynamicBackground';

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [youtubeIds, setYoutubeIds] = useState(['21X5lGlDOfg', '921VbEMAnaM', '3_p_V_p_V_p', 'v64KOxKVzvo']);
  const [launchDate, setLaunchDate] = useState(new Date('2025-09-01T10:00:00')); // Default future date
  
  const { lTime, tTime, isPaused, togglePause, updateLaunchDate, now } = useMissionClock(launchDate);
  const beepRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    beepRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    beepRef.current.volume = 0.1;
    return () => {
      if (beepRef.current) {
        beepRef.current.pause();
        beepRef.current.src = ""; // Clear source to help GC
        beepRef.current = null;
      }
    };
  }, []);

  const playBeep = useCallback(() => {
    if (beepRef.current) {
      beepRef.current.currentTime = 0;
      const playPromise = beepRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silently handle interruption errors
        });
      }
    }
  }, []);

  useEffect(() => {
    if (Math.abs(lTime) % 60 === 0) {
      playBeep();
    }
  }, [lTime, playBeep]);

  const currentMilestone = useMemo(() => {
    const sorted = [...MISSION_MILESTONES].sort((a, b) => a.time - b.time);
    const index = sorted.findIndex(m => m.time > lTime);
    return index === -1 ? sorted[sorted.length - 1] : sorted[Math.max(0, index - 1)];
  }, [lTime]);

  const progress = useMemo(() => {
    const totalDuration = MISSION_MILESTONES[MISSION_MILESTONES.length - 1].time;
    if (lTime < 0) return 0;
    return Math.min(1, lTime / totalDuration);
  }, [lTime]);

  const formatMissionTime = (seconds: number) => {
    const abs = Math.abs(seconds);
    const d = Math.floor(abs / 86400);
    const h = Math.floor((abs % 86400) / 3600);
    const m = Math.floor((abs % 3600) / 60);
    const s = Math.floor(abs % 60);
    const sign = seconds < 0 ? '-' : '+';
    
    if (d > 0) {
      return `${sign}${d}D ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-screen bg-[#0a0b0d] text-white overflow-hidden font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg" 
              alt="NASA" 
              className="h-8"
              referrerPolicy="no-referrer"
            />
            <div className="h-6 w-px bg-white/10 mx-2" />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Artemis_program_logo.svg" 
              alt="Artemis" 
              className="h-8 brightness-0 invert"
              referrerPolicy="no-referrer"
            />
            <div className="h-6 w-px bg-white/10 mx-2" />
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-white/90 uppercase">Artemis II</span>
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Mission Command Center</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1">Mission Clock (UTC)</span>
              <span className="text-lg font-mono font-bold text-white tracking-tighter">
                {format(now, 'HH:mm:ss')}
              </span>
            </div>
            <div className="flex flex-col items-center px-6 border-x border-white/5">
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1">Countdown / MET</span>
              <span className={`text-2xl font-mono font-bold tracking-tighter ${lTime < 0 ? 'text-orange-500' : 'text-green-500'}`}>
                {lTime < 0 ? 'L' : 'T'}{formatMissionTime(lTime)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1">Mission Status</span>
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                />
                <span className="text-xs font-mono font-bold text-green-500 uppercase tracking-widest">Nominal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
            <Radio className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Comm: Active</span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
          >
            <SettingsIcon className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="h-[calc(100vh-4rem)] p-4 grid grid-cols-12 grid-rows-12 gap-4">
        
        {/* Left Column: Timeline & Sequence */}
        <div className="col-span-3 row-span-12 flex flex-col gap-4">
          <Timeline lTime={lTime} />
          
          {/* Quick Stats */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-white/40 uppercase">Cabin Pressure</span>
              <span className="text-sm font-mono text-white font-bold">14.7 PSI</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-white/40 uppercase">Temp</span>
              <span className="text-sm font-mono text-white font-bold">22.4°C</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-white/40 uppercase">Radiation</span>
              <span className="text-sm font-mono text-green-500 font-bold">0.12 mSv</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-white/40 uppercase">Heart Rate</span>
              <span className="text-sm font-mono text-white font-bold">72 BPM</span>
            </div>
          </div>
        </div>

        {/* Center Column: Video Wall & Trajectory */}
        <div className="col-span-6 row-span-12 flex flex-col gap-4">
          {/* Top: Video Wall */}
          <div className="flex-[3]">
            <VideoWall feedIds={youtubeIds} />
          </div>

          {/* Bottom: Trajectory & Progress */}
          <div className="flex-[2] grid grid-cols-2 gap-4">
            <Trajectory progress={progress} />
            
            <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Mission Progress</span>
                <span className="text-xs font-mono text-orange-500 font-bold">{(progress * 100).toFixed(1)}%</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-white/60">
                    <span>Current Phase</span>
                    <span className="text-white font-bold">{currentMilestone?.label}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-[8px] font-mono text-white/40 uppercase mb-1">Distance to Moon</div>
                    <div className="text-sm font-mono text-white font-bold">
                      {lTime < 0 ? '---' : `${(384400 * (1 - progress)).toFixed(0)} km`}
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-[8px] font-mono text-white/40 uppercase mb-1">Time to Splashdown</div>
                    <div className="text-sm font-mono text-white font-bold">
                      {lTime < 0 ? '---' : formatMissionTime(MISSION_MILESTONES[MISSION_MILESTONES.length - 1].time - lTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry & System Status */}
        <div className="col-span-3 row-span-12 flex flex-col gap-4">
          <div className="flex-1">
            <Telemetry lTime={lTime} />
          </div>

          {/* System Status Grid */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col gap-4">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">System Diagnostics</div>
            <div className="grid grid-cols-2 gap-3">
              <StatusItem icon={<Zap className="w-3 h-3" />} label="Power" status="Optimal" color="text-green-500" />
              <StatusItem icon={<Shield className="w-3 h-3" />} label="Thermal" status="Stable" color="text-green-500" />
              <StatusItem icon={<Activity className="w-3 h-3" />} label="Life Support" status="Nominal" color="text-green-500" />
              <StatusItem icon={<Globe className="w-3 h-3" />} label="Navigation" status="Locked" color="text-blue-500" />
            </div>
          </div>

          {/* 3D Spacecraft View */}
          <div className="flex-1 min-h-[300px]">
            <Spacecraft3D />
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        launchDate={launchDate}
        onUpdateLaunchDate={(date) => {
          setLaunchDate(date);
          updateLaunchDate(date);
        }}
        youtubeIds={youtubeIds}
        onUpdateYoutubeIds={setYoutubeIds}
      />

      {/* Dynamic Background Effects */}
      <DynamicBackground lTime={lTime} progress={progress} />
    </div>
  );
}

function StatusItem({ icon, label, status, color }: { icon: React.ReactNode, label: string, status: string, color: string }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/5">
      <div className={`${color} opacity-80`}>{icon}</div>
      <div className="flex flex-col">
        <span className="text-[8px] font-mono text-white/40 uppercase">{label}</span>
        <span className={`text-[10px] font-mono font-bold ${color} uppercase`}>{status}</span>
      </div>
    </div>
  );
}
