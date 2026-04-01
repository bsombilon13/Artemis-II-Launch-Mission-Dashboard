import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MISSION_MILESTONES, Milestone } from '../constants/missionData';
import { Info, CheckCircle2, Circle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useAudio } from '../contexts/AudioContext';

interface TimelineProps {
  lTime: number;
}

export const Timeline: React.FC<TimelineProps> = ({ lTime }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const { playSound } = useAudio();
  const lastMilestoneIndex = useRef(-1);

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

  useEffect(() => {
    if (currentMilestoneIndex > lastMilestoneIndex.current && lastMilestoneIndex.current !== -1) {
      playSound('milestone');
    }
    lastMilestoneIndex.current = currentMilestoneIndex;
  }, [currentMilestoneIndex, playSound]);

  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-black/40 border border-white/10 rounded-lg overflow-hidden relative">
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

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar relative">
        {sortedMilestones.map((m, idx) => {
          const isCompleted = lTime >= m.time;
          const isNext = idx === currentMilestoneIndex;
          
          return (
            <div key={m.id} className="relative">
              <motion.div
                className={`group flex items-center gap-2 p-1.5 rounded cursor-pointer transition-all ${
                  isNext ? 'bg-orange-500/10 border border-orange-500/20' : 'hover:bg-white/5'
                }`}
                onClick={() => {
                  playSound('click');
                  setSelectedMilestone(m);
                }}
                onMouseEnter={() => setHoveredMilestone(m.id)}
                onMouseLeave={() => setHoveredMilestone(null)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.01 }}
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

                <Info className={`w-3 h-3 transition-colors ${hoveredMilestone === m.id ? 'text-orange-500' : 'text-white/10'}`} />
              </motion.div>

              {/* Tooltip on Hover */}
              <AnimatePresence>
                {hoveredMilestone === m.id && !selectedMilestone && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.95 }}
                    className="absolute left-full ml-2 top-0 z-[60] w-48 p-2 bg-[#1a1b1e] border border-white/10 rounded shadow-2xl pointer-events-none"
                  >
                    <div className="text-[8px] font-mono text-orange-500 uppercase tracking-widest mb-1">Description</div>
                    <p className="text-[10px] text-white/70 leading-tight">
                      {m.description}
                    </p>
                    <div className="mt-1 text-[7px] font-mono text-white/30 italic">Click for full details</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#151619] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Decorative background element */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-1 rounded-full bg-orange-500" />
                    <div className="text-[10px] font-mono text-orange-500 uppercase tracking-[0.2em]">Mission Milestone</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight tracking-tight">{selectedMilestone.label}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[10px] font-mono text-white/40 uppercase mb-1">Mission Time</div>
                  <div className="text-sm font-mono font-bold text-white bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {formatMissionTime(selectedMilestone.time)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-sm text-white/80 leading-relaxed font-medium">
                    {selectedMilestone.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-[8px] font-mono text-white/40 uppercase mb-1">Phase</div>
                    <div className="text-xs font-mono text-white uppercase">{selectedMilestone.type}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-[8px] font-mono text-white/40 uppercase mb-1">Status</div>
                    <div className={`text-xs font-mono uppercase ${lTime >= selectedMilestone.time ? 'text-green-500' : 'text-orange-500'}`}>
                      {lTime >= selectedMilestone.time ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-white uppercase tracking-[0.2em] transition-all hover:border-orange-500/30 group"
                onClick={() => setSelectedMilestone(null)}
              >
                <span className="group-hover:text-orange-500 transition-colors">Close Monitor</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
