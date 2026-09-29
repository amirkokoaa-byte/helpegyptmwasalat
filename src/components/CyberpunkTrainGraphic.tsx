import React from 'react';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';

interface CyberpunkTrainGraphicProps {
  modeName?: string;
}

export const CyberpunkTrainGraphic: React.FC<CyberpunkTrainGraphicProps> = ({ modeName = 'القطار الكهربائي السريع' }) => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden neon-border-blue bg-gradient-to-b from-[#09101b] via-[#0d1624] to-[#060a12] p-3 sm:p-4 my-3 group">
      {/* HUD Corner Tech Accents */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff] opacity-80"></div>
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#00f0ff] opacity-80"></div>
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#00f0ff] opacity-80"></div>
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff] opacity-80"></div>

      {/* Top HUD Telemetry Line */}
      <div className="flex items-center justify-between text-[10px] tracking-wider text-[#00f0ff] mb-2 px-1 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
          SYS.TRANSPORT // {modeName}
        </span>
        <span className="text-[#38bdf8] opacity-80">SPEED: 250 KM/H · GRID: ACTIVE</span>
      </div>

      {/* Futuristic High-Speed Train Vector Illustration */}
      <div className="relative h-32 sm:h-40 w-full flex items-center justify-center overflow-hidden rounded-lg bg-[#050811]/90 border border-[#00f0ff]/30 shadow-[inset_0_0_20px_rgba(0,240,255,0.15)]">
        {/* Animated Cyber Speed Grid / Grid Floor Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(0,240,255,0.08)_95%)] pointer-events-none"></div>
        <div className="absolute bottom-0 inset-x-0 h-12 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,240,255,0.15)_20px,rgba(0,240,255,0.15)_22px)] opacity-60"></div>
        
        {/* Glow backdrop behind the train */}
        <div className="absolute w-48 h-20 bg-[#00f0ff]/20 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        {/* Train SVG Graphic */}
        <svg
          viewBox="0 0 600 180"
          className="w-full h-full max-h-36 object-contain z-10 drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Laser Rail Track */}
          <line x1="20" y1="145" x2="580" y2="145" stroke="#00f0ff" strokeWidth="2.5" strokeOpacity="0.8" />
          <line x1="20" y1="150" x2="580" y2="150" stroke="#0284c7" strokeWidth="1" strokeOpacity="0.5" />
          
          {/* Track sleepers */}
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={i}
              x1={40 + i * 30}
              y1="145"
              x2={40 + i * 30 + 10}
              y2="155"
              stroke="#00f0ff"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
          ))}

          {/* Aerodynamic Bullet Train Body */}
          <path
            d="M 540 135 C 500 135, 420 135, 380 135 L 360 85 L 140 85 L 100 100 L 70 120 L 50 135 Z"
            fill="url(#trainMetallicGrad)"
            stroke="#00f0ff"
            strokeWidth="1.5"
          />

          {/* Nose aerodynamic cockpit (Reversed for RTL motion or high-speed stance) */}
          <path
            d="M 50 135 C 40 135, 25 130, 20 120 C 15 110, 30 100, 70 95 L 140 85 L 140 135 Z"
            fill="url(#trainNoseGrad)"
            stroke="#00f0ff"
            strokeWidth="2"
          />

          {/* Cockpit Glowing Windshield */}
          <polygon
            points="35,115 65,100 120,92 110,115"
            fill="#00f0ff"
            fillOpacity="0.85"
            className="animate-pulse"
          />

          {/* Glowing Headlight beam */}
          <polygon
            points="20,122 0,110 0,145 25,130"
            fill="url(#headlightBeam)"
            opacity="0.9"
          />
          <circle cx="25" cy="125" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #00f0ff)" />

          {/* Passenger Cabin Panoramic Neon Windows */}
          <rect x="160" y="94" width="45" height="18" rx="2" fill="#00f0ff" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1" />
          <rect x="215" y="94" width="45" height="18" rx="2" fill="#00f0ff" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1" />
          <rect x="270" y="94" width="45" height="18" rx="2" fill="#00f0ff" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1" />
          <rect x="325" y="94" width="45" height="18" rx="2" fill="#00f0ff" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1" />

          {/* Second Carriage segment */}
          <path
            d="M 390 135 L 390 85 L 560 85 L 570 135 Z"
            fill="url(#trainMetallicGrad)"
            stroke="#00f0ff"
            strokeWidth="1.2"
          />
          <rect x="405" y="94" width="45" height="18" rx="2" fill="#00f0ff" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1" />
          <rect x="460" y="94" width="45" height="18" rx="2" fill="#00f0ff" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1" />
          <rect x="515" y="94" width="40" height="18" rx="2" fill="#00f0ff" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1" />

          {/* Continuous Glowing Neon Blue Racing Stripe */}
          <path
            d="M 25 125 Q 80 120 140 120 L 565 120"
            stroke="#00f0ff"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="drop-shadow(0 0 5px #00f0ff)"
          />
          <path
            d="M 60 128 L 565 128"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeOpacity="0.8"
          />

          {/* High speed light streaks behind train */}
          <line x1="565" y1="95" x2="600" y2="95" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="6 4" />
          <line x1="565" y1="120" x2="600" y2="120" stroke="#00f0ff" strokeWidth="2.5" strokeOpacity="0.6" strokeDasharray="10 5" />
          <line x1="570" y1="135" x2="600" y2="135" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.3" />

          {/* Gradients */}
          <defs>
            <linearGradient id="trainMetallicGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="40%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="trainNoseGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="headlightBeam" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Digital Speed & Egyptian Transit Badge */}
        <div className="absolute bottom-2 right-3 z-20 flex items-center gap-1.5 bg-[#080d1a]/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#00f0ff]/40 text-[11px] text-[#00f0ff] font-mono shadow-[0_0_8px_rgba(0,240,255,0.3)]">
          <Zap className="w-3.5 h-3.5 text-[#00f0ff] fill-[#00f0ff]" />
          <span>EGYPT HIGH-SPEED TRANSIT // 2026</span>
        </div>
      </div>

      {/* Frame Status Sub-Bar */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
        <span className="flex items-center gap-1 text-[#38bdf8]">
          <span className="inline-block w-1 h-1 bg-[#00f0ff] rounded-full"></span>
          قطار كهربائي فائق السرعة صديق للبيئة
        </span>
        <span className="text-[#00f0ff] font-bold">100% ELECTRIC</span>
      </div>
    </div>
  );
};
