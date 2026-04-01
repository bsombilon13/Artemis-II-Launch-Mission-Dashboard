import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Maximize2, Volume2, VolumeX, LayoutGrid, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoWallProps {
  feedIds: string[];
}

const Player = ReactPlayer as any;

export const VideoWall: React.FC<VideoWallProps> = ({ feedIds }) => {
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isGrid, setIsGrid] = useState(false);

  const feeds = feedIds.length > 0 ? feedIds : ['21X5lGlDOfg', '921VbEMAnaM', '3_p_V_p_V_p', 'v64KOxKVzvo'];

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
        {isGrid ? (
          feeds.map((id, idx) => (
            <div key={`grid-${id}-${idx}`} className="relative bg-black rounded overflow-hidden border border-white/5">
              <Player
                url={`https://www.youtube.com/watch?v=${id}`}
                width="100%"
                height="100%"
                muted={isMuted}
                playing={true}
                controls={false}
                config={{ youtube: { rel: 0 } }}
              />
              <div className="absolute top-2 left-2 px-1 bg-black/60 text-[8px] font-mono text-white/60 uppercase rounded">
                Feed {idx + 1}
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Primary Feed */}
            <div className="flex-[3] relative bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl">
              <Player
                key={`primary-${feeds[primaryIndex]}`}
                url={`https://www.youtube.com/watch?v=${feeds[primaryIndex]}`}
                width="100%"
                height="100%"
                muted={isMuted}
                playing={true}
                controls={false}
                config={{ youtube: { rel: 0 } }}
              />
              <div className="absolute top-4 left-4 px-2 py-1 bg-blue-500/80 text-[10px] font-mono text-white uppercase rounded font-bold tracking-widest">
                Primary Mission Feed
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex-1 grid grid-cols-4 gap-2">
              {feeds.map((id, idx) => (
                <button
                  key={`thumb-${id}-${idx}`}
                  onClick={() => setPrimaryIndex(idx)}
                  className={`relative bg-black rounded overflow-hidden border transition-all ${
                    primaryIndex === idx ? 'border-blue-500 ring-1 ring-blue-500' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Player
                    url={`https://www.youtube.com/watch?v=${id}`}
                    width="100%"
                    height="100%"
                    muted={true}
                    playing={true}
                    controls={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-mono text-white uppercase font-bold">Switch</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
