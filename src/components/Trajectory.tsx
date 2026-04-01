import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface TrajectoryProps {
  progress: number; // 0 to 1
}

export const Trajectory: React.FC<TrajectoryProps> = ({ progress }) => {
  // Simple Earth-Moon path SVG
  // Earth at (50, 150), Moon at (450, 150)
  // Path is a figure-eight or loop-back
  const pathData = "M 50 150 C 150 50, 350 50, 450 150 C 350 250, 150 250, 50 150";
  
  // Calculate current position on path
  // For simplicity, we'll just use a motion path animation
  
  return (
    <div className="relative w-full h-full bg-black/40 border border-white/10 rounded-lg overflow-hidden p-4">
      <div className="absolute top-2 left-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
        Mission Trajectory Visualization
      </div>
      
      <svg viewBox="0 0 500 300" className="w-full h-full">
        {/* Stars background */}
        <defs>
          <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9ca3af" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Path */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        
        {/* Progress Path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 1, ease: "linear" }}
        />

        {/* Earth */}
        <circle cx="50" cy="150" r="30" fill="url(#earthGlow)" />
        <circle cx="50" cy="150" r="15" fill="#3b82f6" />
        <text x="50" y="190" textAnchor="middle" fill="#3b82f6" fontSize="10" className="font-mono">EARTH</text>

        {/* Moon */}
        <circle cx="450" cy="150" r="20" fill="url(#moonGlow)" />
        <circle cx="450" cy="150" r="10" fill="#9ca3af" />
        <text x="450" y="180" textAnchor="middle" fill="#9ca3af" fontSize="10" className="font-mono">MOON</text>

        {/* Orion Spacecraft */}
        <motion.g
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: `${progress * 100}%` }}
          style={{ offsetPath: `path("${pathData}")` }}
        >
          <circle r="4" fill="#fff" />
          <circle r="8" fill="#fff" fillOpacity="0.2" />
          <path d="M -6 -4 L 6 0 L -6 4 Z" fill="#f97316" transform="rotate(0)" />
        </motion.g>
      </svg>

      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
        <div className="text-[10px] font-mono text-white/40 uppercase">Current Phase</div>
        <div className="text-xs font-mono text-orange-500 uppercase font-bold tracking-wider">
          {progress < 0.1 ? 'Ascent' : progress < 0.5 ? 'Translunar' : progress < 0.9 ? 'Lunar Flyby' : 'Return'}
        </div>
      </div>
    </div>
  );
};
