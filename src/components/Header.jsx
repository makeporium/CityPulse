import React from 'react';
import { RiBuilding4Line } from 'react-icons/ri';

const Header = ({ activeTab, setActiveTab, currentTime }) => {
  return (
    <header className="border-b border-[#c8c5b8] bg-[#ece9df] select-none shrink-0">
      {/* Top Masthead Bar */}
      <div className="px-5 py-2.5 flex flex-wrap items-center justify-between gap-4 border-b border-[#dad7cb]">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <h1 
              className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#14171a] uppercase leading-none"
              style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif" }}
            >
              TEQ
            </h1>
            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-[#14171a] text-white">
              AI
            </span>
          </div>

          <div className="hidden sm:block border-l border-[#b5b1a3] pl-3">
            <span 
              className="block text-[12px] font-bold tracking-wider text-[#14171a] uppercase"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              THAT ESCALATED QUICKLY
            </span>
            <span className="block text-[9px] font-mono text-[#5c6370] uppercase tracking-wider">
              AUTONOMOUS INCIDENT RESPONSE
            </span>
          </div>

          <div className="hidden xl:block border-l border-[#b5b1a3] pl-4">
            <div className="text-[11px] font-mono text-[#14171a] font-bold tracking-wide">
              SEE IT. UNDERSTAND IT. RESPOND BEFORE IT SPREADS.
            </div>
            <div className="text-[10px] font-mono text-[#666d7a] flex items-center gap-1.5">
              <span>MULTIMODAL SENSING</span>
              <span>➔</span>
              <span>STREAM FUSION</span>
              <span>➔</span>
              <span>PREDICTIVE DIVERSION</span>
              <span>➔</span>
              <span className="text-[#c92a2a] font-bold">SUB-SECOND DISPATCH</span>
            </div>
          </div>
        </div>

        {/* Center / Right Metadata Telemetry */}
        <div className="flex items-center gap-3 lg:gap-5 flex-wrap">
          {/* Clock */}
          <div className="bg-[#f7f6f2] border border-[#d2cfc3] px-3 py-1 rounded text-right">
            <div className="text-[9px] font-mono text-[#666d7a] uppercase font-semibold">
              WED, 17 SEP 2026
            </div>
            <div className="text-sm font-mono font-bold text-[#14171a] tracking-tight">
              {currentTime} <span className="text-[10px] text-[#666d7a]">IST</span>
            </div>
          </div>

          {/* System Status Banner */}
          <div className="bg-[#f7f6f2] border border-[#d2cfc3] px-3 py-1 rounded">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#15803d]">
              <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
              <span>SYSTEM STATUS: ALL SYSTEMS OPERATIONAL</span>
            </div>
            <div className="text-[9px] font-mono text-[#5c6370]">
              6/6 DATA STREAMS · KAFKA + SPARK ACTIVE
            </div>
          </div>

          {/* City Selector */}
          <div className="bg-[#f7f6f2] border border-[#d2cfc3] px-3 py-1 rounded flex items-center gap-2">
            <RiBuilding4Line className="text-[#14171a]" size={16} />
            <div>
              <div className="text-[9px] font-mono text-[#666d7a] uppercase">CITY</div>
              <div className="text-xs font-bold font-mono text-[#14171a] flex items-center gap-1">
                <span>New Delhi</span>
                <span className="text-[9px] text-[#5c6370] font-normal">| LIVE OPERATIONAL VIEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="px-5 py-1.5 flex items-center justify-between gap-4 bg-[#e5e2d6] border-b border-[#dad7cb]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'live'
                ? 'bg-[#14171a] text-white shadow-sm'
                : 'bg-[#f0eee6] text-[#4a505c] hover:text-[#14171a] hover:bg-[#faf9f5] border border-[#c8c5b8]'
            }`}
          >
            <span className="text-[10px] opacity-75">01</span>
            <span>CITY OPERATIONS & COMMAND CENTER</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'pipeline'
                ? 'bg-[#14171a] text-white shadow-sm'
                : 'bg-[#f0eee6] text-[#4a505c] hover:text-[#14171a] hover:bg-[#faf9f5] border border-[#c8c5b8]'
            }`}
          >
            <span className="text-[10px] opacity-75">02</span>
            <span>DATA PIPELINE & KAFKA/SPARK INTERNALS</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0284c7] text-white uppercase font-bold">
              DEV MODE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('intersection')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'intersection'
                ? 'bg-[#14171a] text-white shadow-sm'
                : 'bg-[#f0eee6] text-[#4a505c] hover:text-[#14171a] hover:bg-[#faf9f5] border border-[#c8c5b8]'
            }`}
          >
            <span className="text-[10px] opacity-75">03</span>
            <span>MICRO VIEW (INTERSECTION AI)</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#4a505c]">
          <span className="w-2 h-2 rounded-full bg-[#c92a2a] animate-ping" />
          <span className="font-bold text-[#c92a2a]">25 ACTIVE INCIDENTS MONITORED</span>
        </div>
      </div>

      {/* Live Incidents Ticker Strip */}
      <div className="bg-[#14171a] text-white px-5 py-1.5 flex items-center overflow-hidden text-xs font-mono">
        <div className="flex items-center gap-2 pr-4 border-r border-[#333842] shrink-0 text-[#ff4d4f] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#ff4d4f] animate-pulse" />
          <span>LIVE INCIDENTS</span>
        </div>

        <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none px-4 flex items-center gap-4 text-[11px] text-[#cfd3dc]">
          <span className="hover:text-white transition-colors cursor-pointer">
            <strong className="text-white">19:45</strong> Major accident - Ring Road (3 vehicles)
          </span>
          <span className="text-[#555a66]">|</span>
          <span className="hover:text-white transition-colors cursor-pointer">
            <strong className="text-white">19:42</strong> Fire reported - Lajpat Nagar
          </span>
          <span className="text-[#555a66]">|</span>
          <span className="hover:text-white transition-colors cursor-pointer">
            <strong className="text-white">19:38</strong> Heavy congestion - ITO
          </span>
          <span className="text-[#555a66]">|</span>
          <span className="hover:text-white transition-colors cursor-pointer">
            <strong className="text-white">19:36</strong> Medical emergency - Dwarka
          </span>
          <span className="text-[#555a66]">|</span>
          <span className="hover:text-white transition-colors cursor-pointer">
            <strong className="text-white">19:32</strong> Road block - Outer Ring Rd
          </span>
          <span className="text-[#555a66]">|</span>
          <span className="hover:text-white transition-colors cursor-pointer">
            <strong className="text-white">19:28</strong> Accident - NH48 (2 cars)
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 pl-3 border-l border-[#333842] shrink-0 text-[10px] text-[#00e5ff] font-bold">
          <span>➔ 25 ACTIVE INCIDENTS</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
