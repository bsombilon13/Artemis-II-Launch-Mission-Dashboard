export interface Milestone {
  id: string;
  time: number; // seconds relative to T-0
  label: string;
  description: string;
  type: 'countdown' | 'ascent' | 'mission';
}

export const MISSION_MILESTONES: Milestone[] = [
  // Countdown (L- Minus)
  { id: 'l-46h', time: -165600, label: 'Call to Stations', description: 'Launch team arrives to stations for the countdown.', type: 'countdown' },
  { id: 'l-45h', time: -162000, label: 'Orion Power Up', description: 'Orion spacecraft powered up and systems check initiated.', type: 'countdown' },
  { id: 'l-42h', time: -151200, label: 'Core Stage Power Up', description: 'SLS Core Stage powered up for pre-launch testing.', type: 'countdown' },
  { id: 'l-33h', time: -118800, label: 'Battery Charge', description: 'Orion flight batteries charged to 100%.', type: 'countdown' },
  { id: 'l-15h', time: -54000, label: 'Personnel Evacuation', description: 'Non-essential personnel evacuated from LC-39B.', type: 'countdown' },
  { id: 'l-13h', time: -46800, label: 'GLS Activation', description: 'Ground Launch Sequencer (GLS) activation.', type: 'countdown' },
  { id: 'l-12h35m', time: -45300, label: 'Built-in Hold (2.5H)', description: '2-hour 45-minute built-in countdown hold begins.', type: 'countdown' },
  { id: 'l-10h50m', time: -39000, label: 'Tanking Decision', description: 'Launch team decides "go" or "no-go" for tanking.', type: 'countdown' },
  { id: 'l-10h40m', time: -38400, label: 'Chilldown', description: 'Core stage LOX/LH2 system chilldown begins.', type: 'countdown' },
  { id: 'l-9h55m', time: -35700, label: 'Slow Fill', description: 'Core stage LH2 slow fill start.', type: 'countdown' },
  { id: 'l-9h50m', time: -35400, label: 'Resume T-Clock', description: 'Resume T-Clock from T-8H10M.', type: 'countdown' },
  { id: 'l-9h30m', time: -34200, label: 'Fast Fill', description: 'Core stage LOX/LH2 fast fill begins.', type: 'countdown' },
  { id: 'l-8h15m', time: -29700, label: 'Replenish', description: 'LOX/LH2 replenish begins.', type: 'countdown' },
  { id: 'l-6h', time: -21600, label: 'Weather Brief', description: 'Flight crew weather brief.', type: 'countdown' },
  { id: 'l-5h10m', time: -18600, label: 'Built-in Hold (1H10M)', description: 'Start 1-hour 10-minute built-in hold.', type: 'countdown' },
  { id: 'l-4h', time: -14400, label: 'Crew Suit Up', description: 'Flight crew begins donning flight suits.', type: 'countdown' },
  { id: 'l-3h30m', time: -12600, label: 'Crew Boarding', description: 'Flight crew boards the Orion spacecraft.', type: 'countdown' },
  { id: 'l-3h10m', time: -11400, label: 'Hatch Closure', description: 'Crew module hatch closure and seal checks.', type: 'countdown' },
  { id: 'l-2h55m', time: -10500, label: 'Cabin Leak Check', description: 'Orion cabin leak check and purge.', type: 'countdown' },
  { id: 'l-40m', time: -2400, label: 'Final Hold (30M)', description: 'Built-in 30-minute countdown hold begins.', type: 'countdown' },
  { id: 'l-10m', time: -600, label: 'Launch Director Poll', description: 'Launch director polls team for "go" for launch.', type: 'countdown' },
  { id: 't-10m', time: -600, label: 'Terminal Count', description: 'GLS initiates terminal count.', type: 'countdown' },
  { id: 't-6m', time: -360, label: 'Internal Power', description: 'Orion set to internal power.', type: 'countdown' },
  { id: 't-33s', time: -33, label: 'Automated Sequencer', description: 'GLS sends "go for automated launch sequencer".', type: 'countdown' },
  { id: 't-0', time: 0, label: 'Liftoff', description: 'Booster ignition and liftoff from LC-39B.', type: 'countdown' },

  // Ascent
  { id: 'a-02-12', time: 132, label: 'SRB Separation', description: 'Solid Rocket Booster separation.', type: 'ascent' },
  { id: 'a-03-11', time: 191, label: 'Fairing Jettison', description: 'Service module fairing jettison.', type: 'ascent' },
  { id: 'a-03-16', time: 196, label: 'LAS Jettison', description: 'Launch Abort System jettison.', type: 'ascent' },
  { id: 'a-08-04', time: 484, label: 'MECO', description: 'Main Engine Cutoff.', type: 'ascent' },
  { id: 'a-08-16', time: 496, label: 'Core Stage Separation', description: 'Core stage separates from ICPS.', type: 'ascent' },
  { id: 'a-18-20', time: 1100, label: 'Solar Array Deployment', description: 'Orion solar arrays deployment begins.', type: 'ascent' },
  { id: 'a-51-22', time: 3082, label: 'Perigee Raise Burn', description: 'ICPS perigee raise maneuver.', type: 'ascent' },
  { id: 'a-02-35-40', time: 9340, label: 'TLI Burn', description: 'Translunar Injection burn.', type: 'ascent' },
  { id: 'a-03-38-00', time: 13080, label: 'ICPS Separation', description: 'Orion separates from ICPS.', type: 'ascent' },
  { id: 'a-03-40-00', time: 13200, label: 'Proximity Ops', description: 'Proximity operations and docking target demo.', type: 'ascent' },

  // Mission
  { id: 'm-24h', time: 86400, label: 'HEO Operations', description: 'High Earth Orbit operations and systems checkout.', type: 'mission' },
  { id: 'm-42h', time: 151200, label: 'TLI Burn 2', description: 'Final Translunar Injection burn.', type: 'mission' },
  { id: 'm-day-4', time: 345600, label: 'Lunar SOI Entry', description: 'Orion enters the Lunar Sphere of Influence.', type: 'mission' },
  { id: 'm-day-5', time: 432000, label: 'Lunar Flyby', description: 'Closest approach to the Moon (approx. 4,600 miles).', type: 'mission' },
  { id: 'm-day-6', time: 518400, label: 'Lunar SOI Exit', description: 'Orion exits the Lunar Sphere of Influence.', type: 'mission' },
  { id: 'm-day-10', time: 864000, label: 'Entry Interface', description: 'Orion enters Earth atmosphere.', type: 'mission' },
  { id: 'm-splashdown', time: 865800, label: 'Splashdown', description: 'Splashdown in the Pacific Ocean.', type: 'mission' },
];

export const TELEMETRY_CONFIG = {
  altitude: { min: 0, max: 400000, unit: 'km', label: 'Altitude' },
  velocity: { min: 0, max: 40000, unit: 'km/h', label: 'Velocity' },
  fuel: { min: 0, max: 100, unit: '%', label: 'Propellant' },
  oxygen: { min: 0, max: 100, unit: '%', label: 'O2 Levels' },
};
