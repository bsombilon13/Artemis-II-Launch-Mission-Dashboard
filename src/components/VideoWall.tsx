import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Maximize2, Volume2, VolumeX, LayoutGrid, Monitor, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoWallProps {
  feedIds: string[];
}

// Handle potential ESM/CJS default export issues
const Player = (ReactPlayer as any).default || ReactPlayer;

export const VideoWall: React.FC<VideoWallProps> = ({ feedIds }) => {
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isGrid, setIsGrid] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const feeds = feedIds.length > 0 ? feedIds : ['21X5lGlDOfg', '921VbEMAnaM', 'v64KOxKVzvo', 'CMLD0Lp0JBg'];

  const getYoutubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

  const handlePlayerError = (id: string) => {
    console.error(`Video player error for feed: ${id}`);
    setErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-col h-full bg-black/40 border border-white/10 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-mono text-white/80 uppercase tracking-widest font-bold">Mission Visual Feeds</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-white/40 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsGrid(!isGrid)}
            className={`text-white/40 hover:text-white transition-colors ${isGrid ? 'text-blue-500' : ''}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`flex-1 relative p-2 ${isGrid ? 'grid grid-cols-2 grid-rows-2 gap-2' : 'flex flex-col gap-2'}`}>
        {feeds.map((id, idx) => {
          const isPrimary = !isGrid && primaryIndex === idx;
          const isThumbnail = !isGrid && primaryIndex !== idx;
          const hasError = errors[id];
          
          return (
            <div 
              key={`player-${id}-${idx}`}
              className={`relative bg-black rounded overflow-hidden border transition-all duration-500 ${
                isGrid ? 'border-white/5' : 
                isPrimary ? 'flex-[3] border-white/10 shadow-2xl' : 
                'flex-1 border-white/10 opacity-60 hover:opacity-100'
              }`}
              onClick={() => !isGrid && setPrimaryIndex(idx)}
            >
              {!hasError ? (
                <Player
                  url={getYoutubeUrl(id)}
                  width="100%"
                  height="100%"
                  muted={isPrimary ? isMuted : true}
                  playing={true}
                  loop={true}
                  controls={false}
                  onError={() => handlePlayerError(id)}
                  config={{ 
                    youtube: { 
                      playerVars: { 
                        autoplay: 1, 
                        mute: (isPrimary ? isMuted : true) ? 1 : 0, 
                        controls: 0, 
                        rel: 0,
                        modestbranding: 1,
                        origin: window.location.origin
                      } 
                    } 
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-500/40" />
                  <span className="text-[8px] font-mono text-white/40 uppercase">Feed Unavailable</span>
                </div>
              )}
              
              <div className="absolute top-2 left-2 px-1 bg-black/60 text-[8px] font-mono text-white/60 uppercase rounded pointer-events-none">
                {isPrimary ? 'Primary Mission Feed' : `Feed ${idx + 1}`}
              </div>
              {isThumbnail && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-[8px] font-mono text-white uppercase font-bold">Switch to Primary</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
