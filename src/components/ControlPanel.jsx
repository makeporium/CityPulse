import React from 'react';
import { 
  RiRouteLine, 
  RiTrafficLightFill, 
  RiCpuLine, 
  RiBroadcastLine,
  RiDatabase2Line,
  RiRadarLine 
} from 'react-icons/ri';
import { TbAmbulance } from 'react-icons/tb';

const TacticalActionButton = ({ icon: Icon, label, tag, subtext, onClick, theme }) => {
  const themeStyles = {
    crimson: {
      bg: 'bg-rose-950/30 hover:bg-rose-900/40 border-rose-500/30 hover:border-rose-400/70 text-rose-200',
      glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]',
      pip: 'bg-rose-400 shadow-[0_0_8px_#f43f5e]',
      tagBg: 'bg-rose-900/50 text-rose-300 border-rose-600/40',
      iconColor: '#f43f5e'
    },
    cyan: {
      bg: 'bg-cyan-950/30 hover:bg-cyan-900/40 border-cyan-500/30 hover:border-cyan-400/70 text-cyan-200',
      glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]',
      pip: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]',
      tagBg: 'bg-cyan-900/50 text-cyan-300 border-cyan-600/40',
      iconColor: '#06b6d4'
    },
    emerald: {
      bg: 'bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-500/30 hover:border-emerald-400/70 text-emerald-200',
      glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      pip: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
      tagBg: 'bg-emerald-900/50 text-emerald-300 border-emerald-600/40',
      iconColor: '#10b981'
    }
  }[theme];

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left p-3.5 rounded-lg border transition-all duration-200 btn-tactical ${themeStyles.bg} ${themeStyles.glow} active:scale-[0.99]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-black/40 border border-white/5 group-hover:border-white/20 transition-colors">
            <Icon size={20} style={{ color: themeStyles.iconColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-wide text-slate-100 group-hover:text-white">
                {label}
              </span>
            </div>
            {subtext && (
              <p className="text-[11px] text-slate-400 tracking-normal font-sans mt-0.5">
                {subtext}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${themeStyles.tagBg}`}>
            {tag}
          </span>
          <span className={`w-2 h-2 rounded-full mt-1 ${themeStyles.pip} animate-pulse`} />
        </div>
      </div>
    </button>
  );
};

const ControlPanel = ({ onDispatchAmbulance, onDivertTraffic, onClearSignals }) => {
  return (
    <div className="hud-panel hud-corner rounded-xl p-4 flex flex-col gap-4 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sky-500/20">
        <div className="flex items-center gap-2">
          <RiRadarLine className="text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} size={20} />
          <h2 className="text-base font-bold tracking-wider text-slate-100 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            Mission Control
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          SEC-AUTO
        </span>
      </div>

      {/* Autonomous Action Matrix */}
      <div className="flex flex-col gap-2.5">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>// Action Matrix</span>
        </div>

        <TacticalActionButton
          icon={TbAmbulance}
          label="Dispatch Ambulance"
          tag="EMERGENCY"
          subtext="Dijkstra shortest path with OSM road weights"
          onClick={onDispatchAmbulance}
          theme="crimson"
        />

        <TacticalActionButton
          icon={RiRouteLine}
          label="Civic Traffic Diversion"
          tag="LSTM PREDICT"
          subtext="Calculates secondary detour delay savings"
          onClick={onDivertTraffic}
          theme="cyan"
        />

        <TacticalActionButton
          icon={RiTrafficLightFill}
          label="Green Wave Corridor"
          tag="HARD OVERRIDE"
          subtext="Prioritizes dynamic intersection signal phase"
          onClick={onClearSignals}
          theme="emerald"
        />
      </div>

      {/* Live Pipeline Telemetry Status */}
      <div className="mt-auto bg-black/40 rounded-lg p-3.5 border border-sky-500/15 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/5 text-slate-400">
          <span className="flex items-center gap-1.5">
            <RiBroadcastLine className="text-sky-400" />
            PIPELINE TELEMETRY
          </span>
          <span className="text-emerald-400 text-[10px] font-semibold">ALL NOMINAL</span>
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <RiDatabase2Line size={13} className="text-indigo-400" />
              Kafka Ingestion
            </span>
            <span className="text-cyan-300 font-semibold">6 Topics Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <RiCpuLine size={13} className="text-emerald-400" />
              Spark Micro-Batch
            </span>
            <span className="text-emerald-300 font-semibold">30s Window</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <RiRadarLine size={13} className="text-amber-400" />
              ML Decision Engine
            </span>
            <span className="text-amber-300 font-semibold">&lt; 3.0s Latency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
