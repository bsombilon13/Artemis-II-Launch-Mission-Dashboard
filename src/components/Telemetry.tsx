import React, { useMemo, useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { TELEMETRY_CONFIG } from '../constants/missionData';
import { Activity, Zap, Shield, Globe, Thermometer, Droplets } from 'lucide-react';

interface TelemetryProps {
  lTime: number;
}

const DynamicValue = ({ value, unit, label, color }: { value: number, unit: string, label: string, color: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{label}</span>
      <div className="flex items-baseline gap-1">
        <motion.span 
          key={value}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-lg font-mono font-bold ${color}`}
        >
          {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </motion.span>
        <span className="text-[10px] font-mono text-white/40">{unit}</span>
      </div>
    </div>
  );
};

const SystemGauge = ({ label, value, color }: { label: string, value: number, color: string }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
        <span>{label}</span>
        <span className="text-white font-bold">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
        <motion.div 
          className={`h-full ${color} relative z-10`}
          initial={{ width: '100%' }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
        {/* Animated pulse effect for low levels */}
        {value < 20 && (
          <motion.div 
            className="absolute inset-0 bg-red-500/50 z-20"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/10 p-2 rounded shadow-2xl backdrop-blur-md">
        <p className="text-[8px] font-mono text-white/40 uppercase tracking-tighter mb-1">{payload[0].name}</p>
        <p className="text-xs font-mono font-bold text-white">
          {payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export const Telemetry: React.FC<TelemetryProps> = ({ lTime }) => {
  // Generate some "live" data based on lTime
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev, {
          time: lTime,
          velocity: Math.abs(Math.sin(lTime / 100) * 20000 + 15000) + (Math.random() * 100 - 50),
          altitude: Math.abs(Math.cos(lTime / 500) * 300000 + 50000) + (Math.random() * 50 - 25),
          fuel: Math.max(0, 100 - (lTime / 10000)),
          oxygen: 98 + Math.random() * 2,
          temp: 22 + Math.random() * 2,
          pressure: 14.7 + (Math.random() * 0.2 - 0.1)
        }].slice(-30); // Keep last 30 points for smoother look
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lTime]);

  const currentStats = data[data.length - 1] || { velocity: 0, altitude: 0, fuel: 100, oxygen: 100, temp: 22, pressure: 14.7 };

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
          <DynamicValue label="Velocity" value={currentStats.velocity} unit="km/h" color="text-orange-500" />
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '7px', textTransform: 'uppercase', fontFamily: 'monospace', opacity: 0.4, top: -20 }}
                />
                <Area name="Velocity" type="monotone" dataKey="velocity" stroke="#f97316" fillOpacity={1} fill="url(#colorVelocity)" isAnimationActive={false} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="w-8 h-8 text-blue-500" />
          </div>
          <DynamicValue label="Altitude" value={currentStats.altitude} unit="km" color="text-blue-500" />
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAltitude" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '7px', textTransform: 'uppercase', fontFamily: 'monospace', opacity: 0.4, top: -20 }}
                />
                <Area name="Altitude" type="monotone" dataKey="altitude" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAltitude)" isAnimationActive={false} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Environmental Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/40 border border-white/10 rounded-lg p-2 flex items-center gap-2">
          <div className="p-2 bg-white/5 rounded-lg">
            <Thermometer className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/40 uppercase">Internal Temp</span>
            <span className="text-xs font-mono text-white font-bold">{currentStats.temp.toFixed(1)}°C</span>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/40 uppercase">Cabin Pressure</span>
            <span className="text-xs font-mono text-white font-bold">{currentStats.pressure.toFixed(1)} PSI</span>
          </div>
        </div>
      </div>

      {/* Resource Gauges */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex flex-col gap-2">
        <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-1.5">Resource Consumption</div>
        <div className="flex flex-col gap-2">
          <SystemGauge label="Propellant" value={currentStats.fuel} color="bg-orange-500" />
          <SystemGauge label="O2 Levels" value={currentStats.oxygen} color="bg-blue-500" />
        </div>
      </div>
    </div>
  );
};
