import React, { useState } from 'react';
import { 
  RiLightbulbFill, 
  RiRouteLine, 
  RiArrowRightLine
} from 'react-icons/ri';
import { TbAmbulance } from 'react-icons/tb';

const IncidentResponsePanel = ({ onDispatch, onDivert, onNotifyHospitals }) => {
  const [activeStep, setActiveStep] = useState('NOW');

  return (
    <div className="arch-panel rounded-none border border-[#c8c5b8] flex flex-col h-full bg-[#fcfbf9] overflow-hidden">
      {/* Panel Top Header */}
      <div className="p-3 border-b border-[#dad7cb] flex items-center justify-between bg-[#f4f3ee]">
        <div className="flex items-center gap-2">
          <span className="arch-header-badge">03</span>
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#14171a]">
              INCIDENT RESPONSE
            </h2>
            <p className="text-[10px] font-mono text-[#5c6370]">
              AI-POWERED DECISION SUPPORT
            </p>
          </div>
        </div>

        {/* Priority Badge */}
        <span className="bg-[#c92a2a] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-widest uppercase">
          CRITICAL
        </span>
      </div>

      <div className="p-3 flex-1 overflow-y-auto space-y-3 font-mono text-xs">
        {/* CCTV Camera Thumbnail & Accident Header */}
        <div className="flex gap-3 items-start border-b border-[#eceae0] pb-3">
          {/* Simulated CCTV Camera Frame */}
          <div className="relative w-28 h-20 bg-[#14171a] rounded overflow-hidden border border-[#555a66] shrink-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            
            {/* Road graphic simulation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-10 border-2 border-[#ef4444] rounded bg-red-500/20 flex flex-col items-center justify-center text-[9px] text-white font-bold animate-pulse">
                <span>COLLISION</span>
                <span className="text-[7px]">YOLO: 0.94</span>
              </div>
            </div>

            <div className="absolute top-1 left-1 bg-black/70 text-[8px] text-emerald-400 px-1 py-0.2 rounded flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span>CAM #104</span>
            </div>
            <div className="absolute bottom-1 right-1 text-[8px] text-white/80">
              1080p · 30fps
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#14171a] leading-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Major Accident Ring Road
            </h3>
            <div className="text-[10px] text-[#5c6370] font-mono mt-0.5">
              19:45 · 2 min ago
            </div>

            <div className="mt-2 space-y-1 text-[11px] text-[#333740] font-sans">
              <div className="flex items-center gap-1.5">
                <span className="text-[#c92a2a]">📍</span>
                <span>Ring Road, Near AIIMS Flyover</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#0284c7]">🚗</span>
                <span>3 vehicles involved (car, truck, bike)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#d97706]">⚠️</span>
                <span>Multiple injuries (estimated 4-6)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#5c6370]">
                <span>🚨 Detected via CCTV + Audio (siren) + Traffic anomaly</span>
              </div>
            </div>
          </div>
        </div>

        {/* NOW / NEXT / WHY Action Sequence Selector */}
        <div>
          <div className="grid grid-cols-3 gap-1 mb-2">
            {['NOW', 'NEXT', 'WHY'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStep(tab)}
                className={`py-1 text-center text-xs font-mono font-bold rounded transition-all ${
                  activeStep === tab
                    ? 'bg-[#14171a] text-white'
                    : 'bg-[#edeae0] text-[#5c6370] hover:text-[#14171a]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Action Step Details */}
          <div className="space-y-1.5">
            {/* Step 1: Ambulance Dispatch */}
            <div 
              onClick={onDispatch}
              className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between ${
                activeStep === 'NOW'
                  ? 'bg-[#eff6ff] border-[#93c5fd] text-[#1e3a8a]'
                  : 'bg-[#fcfbf9] border-[#e2dfd5] text-[#333740] hover:bg-[#f7f6f2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[#0284c7] text-white">
                  <TbAmbulance size={16} />
                </div>
                <div>
                  <div className="font-bold text-[11px] leading-tight flex items-center gap-1.5">
                    <span>AMB-3 DISPATCHED</span>
                    <span className="text-[#0284c7] font-extrabold text-xs">ETA 4.2 min</span>
                  </div>
                  <div className="text-[10px] text-[#5c6370] font-sans">
                    Route via AIIMS Flyover (5.1 km)
                  </div>
                </div>
              </div>
              <RiArrowRightLine className="text-[#0284c7]" />
            </div>

            {/* Step 2: Traffic Diversion */}
            <div 
              onClick={onDivert}
              className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between ${
                activeStep === 'NEXT'
                  ? 'bg-[#f0fdf4] border-[#86efac] text-[#14532d]'
                  : 'bg-[#fcfbf9] border-[#e2dfd5] text-[#333740] hover:bg-[#f7f6f2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[#15803d] text-white">
                  <RiRouteLine size={16} />
                </div>
                <div>
                  <div className="font-bold text-[11px] leading-tight">
                    TRAFFIC DIVERSION ACTIVE
                  </div>
                  <div className="text-[10px] text-[#5c6370] font-sans">
                    Rerouting traffic from Ring Road (-6 min delay saved)
                  </div>
                </div>
              </div>
              <RiArrowRightLine className="text-[#15803d]" />
            </div>

            {/* Step 3: Hospital Notification */}
            <div 
              onClick={onNotifyHospitals}
              className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between ${
                activeStep === 'WHY'
                  ? 'bg-[#fef2f2] border-[#fca5a5] text-[#7f1d1d]'
                  : 'bg-[#fcfbf9] border-[#e2dfd5] text-[#333740] hover:bg-[#f7f6f2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[#14171a] text-white font-bold text-xs flex items-center justify-center w-6 h-6">
                  H
                </div>
                <div>
                  <div className="font-bold text-[11px] leading-tight">
                    AIIMS NOTIFIED
                  </div>
                  <div className="text-[10px] text-[#5c6370] font-sans">
                    Trauma unit on standby · ICU Bay 4 pre-allocated
                  </div>
                </div>
              </div>
              <RiArrowRightLine className="text-[#c92a2a]" />
            </div>
          </div>
        </div>

        {/* AI Decision Reasoning Box */}
        <div className="bg-[#fcfbf7] border border-[#d6d3c7] rounded p-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#14171a] mb-1.5">
            <RiLightbulbFill className="text-[#eab308]" size={14} />
            <span>AI DECISION REASONING</span>
          </div>

          <ul className="text-[10px] font-mono text-[#4a505c] space-y-1 pl-1">
            <li className="flex items-start gap-1.5">
              <span className="text-[#c92a2a]">•</span>
              <span>High confidence incident <strong className="text-[#14171a]">(RF: 0.92)</strong></span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#d97706]">•</span>
              <span>Severe congestion expected <strong className="text-[#14171a]">(LSTM speed drop &gt; 45%)</strong></span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#0284c7]">•</span>
              <span>Nearest available ambulance: <strong className="text-[#14171a]">AMB-3 (2.1 km away)</strong></span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#15803d]">•</span>
              <span>Route selected using <strong className="text-[#14171a]">Dijkstra's shortest path</strong></span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#5c6370]">•</span>
              <span>Alternative routes activated to reduce secondary delay</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Metrics & Analysis CTA */}
      <div className="p-3 border-t border-[#dad7cb] bg-[#f4f3ee]">
        <div className="flex items-center justify-between mb-2 text-xs font-mono">
          <div>
            <div className="text-[9px] uppercase text-[#666d7a]">CONFIDENCE</div>
            <div className="text-base font-bold text-[#14171a]">92%</div>
          </div>

          <div className="border-l border-[#d2cfc3] pl-3">
            <div className="text-[9px] uppercase text-[#666d7a]">EST. RESPONSE TIME</div>
            <div className="text-base font-bold text-[#15803d]">6.2 min</div>
          </div>

          <button className="px-2.5 py-1.5 rounded bg-[#14171a] hover:bg-[#333842] text-white text-[10px] font-mono font-bold transition-all flex items-center gap-1 shadow-sm">
            <span>VIEW FULL ANALYSIS</span>
            <span>➔</span>
          </button>
        </div>

        <div className="text-center text-[9px] font-mono text-[#5c6370] uppercase tracking-widest pt-1 border-t border-[#e2dfd5]">
          PEOPLE + DATA + AI = SAFER CITIES
        </div>
      </div>
    </div>
  );
};

export default IncidentResponsePanel;
