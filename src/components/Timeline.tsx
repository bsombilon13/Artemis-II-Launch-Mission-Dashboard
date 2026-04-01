import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MISSION_MILESTONES, Milestone } from '../constants/missionData';
import { Info, CheckCircle2, Circle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineProps {
  lTime: number;
}

export const Timeline: React.FC<TimelineProps> = ({ lTime }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const formatMissionTime = (seconds: number) => {
    const abs = Math.abs(seconds);
    const h = Math.floor(abs / 3600);
    const m = Math.floor((abs % 3600) / 60);
    const s = Math.floor(abs % 60);
    const sign = seconds < 0 ? 'L-' : 'T+';
    return `${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const sortedMilestones = useMemo(() => {
    return [...MISSION_MILESTONES].sort((a, b) => a.time - b.time);
  }, []);

  const currentMilestoneIndex = useMemo(() => {
    const index = sortedMilestones.findIndex(m => m.time > lTime);
    return index === -1 ? sortedMilestones.length : index;
  }, [lTime, sortedMilestones]);

  const nextMilestone = sortedMilestones[currentMilestoneIndex];

  return (
    <div className="flex flex-col h-full bg-black/40 border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-mono text-white/80 uppercase tracking-widest font-bold">Sequence Monitor</span>
        </div>
        {nextMilestone && (
          <div className="text-[10px] font-mono text-white/40 uppercase">
            Next: <span className="text-orange-500">{nextMilestone.label}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {sortedMilestones.map((m, idx) => {
          const isCompleted = lTime >= m.time;
          const isNext = idx === currentMilestoneIndex;
          
          return (
            <motion.div
              key={m.id}
              className={`group flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                isNext ? 'bg-orange-500/10 border border-orange-500/20' : 'hover:bg-white/5'
              }`}
              onClick={() => setSelectedMilestone(m)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : isNext ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Circle className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                  </motion.div>
                ) : (
                  <Circle className="w-4 h-4 text-white/20" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className={`text-[11px] font-mono font-bold truncate ${isCompleted ? 'text-white/40' : 'text-white/90'}`}>
                    {m.label}
                  </span>
                  <span className="text-[9px] font-mono text-white/30 ml-2">
                    {formatMissionTime(m.time)}
                  </span>
                </div>
              </div>

              <Info className="w-3 h-3 text-white/0 group-hover:text-white/40 transition-colors" />
            </motion.div>
          );
        })}
      </div>

      {/* Milestone Detail Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#151619] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] font-mono text-orange-500 uppercase tracking-widest mb-1">Milestone Detail</div>
                  <h3 className="text-xl font-bold text-white leading-tight">{selectedMilestone.label}</h3>
                </div>
                <div className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">
                  {formatMissionTime(selectedMilestone.time)}
                </div>
              </div>
              
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                {selectedMilestone.description}
              </p>

              <button
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-white uppercase tracking-widest transition-colors"
                onClick={() => setSelectedMilestone(null)}
              >
                Close Monitor
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
