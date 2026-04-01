import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Save, Calendar, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  launchDate: Date;
  onUpdateLaunchDate: (date: Date) => void;
  youtubeIds: string[];
  onUpdateYoutubeIds: (ids: string[]) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  launchDate,
  onUpdateLaunchDate,
  youtubeIds,
  onUpdateYoutubeIds,
}) => {
  const [tempDate, setTempDate] = useState(format(launchDate, "yyyy-MM-dd'T'HH:mm"));
  const [tempIds, setTempIds] = useState(youtubeIds.join(', '));

  const handleSave = () => {
    onUpdateLaunchDate(new Date(tempDate));
    onUpdateYoutubeIds(tempIds.split(',').map(s => s.trim()).filter(s => s.length > 0));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#151619] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Mission Control Settings</h2>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Configuration Panel</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Launch Date */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">
                  <Calendar className="w-3 h-3" />
                  Launch Date & Time (EDT)
                </label>
                <input
                  type="datetime-local"
                  value={tempDate}
                  onChange={e => setTempDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white font-mono focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* YouTube Feeds */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">
                  <Video className="w-3 h-3" />
                  YouTube Feed IDs (Comma separated)
                </label>
                <textarea
                  value={tempIds}
                  onChange={e => setTempIds(e.target.value)}
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white font-mono focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  placeholder="e.g. 21X5lGlDOfg, 921VbEMAnaM"
                />
                <p className="text-[9px] font-mono text-white/20 italic">
                  Enter the 11-character ID from the YouTube URL.
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-mono text-white uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <Save className="w-4 h-4" />
                Apply Configuration
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
