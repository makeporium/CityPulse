import React from 'react';
import { 
  RiArrowRightLine, 
  RiDatabase2Fill, 
  RiCpuFill, 
  RiBrainFill, 
  RiRouteFill, 
  RiFlashlightFill,
  RiRadarFill
} from 'react-icons/ri';

const PipelineNode = ({ title, desc, icon: Icon, tag, _isFirst = false }) => {
  return (
    <div className="flex-1 flex items-center">
      <div className="w-full bg-[#fcfbf9] border border-[#d6d3c7] p-2 rounded flex flex-col justify-between hover:border-[#14171a] transition-all">
        <div className="flex items-center justify-between mb-1 text-[10px] font-mono">
          <span className="font-bold text-[#14171a] flex items-center gap-1">
            <Icon size={12} className="text-[#0284c7]" />
            {title}
          </span>
          {tag && (
            <span className="text-[8px] px-1 py-0.2 rounded bg-[#f4f3ee] text-[#5c6370] border border-[#e2dfd5]">
              {tag}
            </span>
          )}
        </div>
        <div className="text-[10px] font-sans text-[#5c6370] leading-tight">
          {desc}
        </div>
      </div>
    </div>
  );
};

const DataPipelineFlow = ({ onOpenPipelineDetails }) => {
  return (
    <div className="arch-panel rounded-none border border-[#c8c5b8] bg-[#fcfbf9] p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#dad7cb]">
        <div className="flex items-center gap-2">
          <span className="arch-header-badge">05</span>
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#14171a]">
              DATA PIPELINE
            </h2>
            <span className="text-[10px] font-mono text-[#5c6370]">
              FROM SENSORS TO ACTIONS
            </span>
          </div>
        </div>

        <button 
          onClick={onOpenPipelineDetails}
          className="text-[10px] font-mono font-bold text-[#0284c7] hover:underline flex items-center gap-1"
        >
          <span>INSPECT KAFKA & SPARK INTERNALS</span>
          <span>➔</span>
        </button>
      </div>

      {/* Connected Architecture Chain */}
      <div className="flex flex-col md:flex-row items-center gap-2 font-mono">
        <PipelineNode
          title="DATA SOURCES"
          desc="6 heterogeneous feeds (video, GPS, weather, audio, sensors, stream)"
          icon={RiRadarFill}
          tag="INGEST"
          isFirst
        />

        <RiArrowRightLine className="text-[#8e8a7c] shrink-0 hidden md:block" size={16} />

        <PipelineNode
          title="KAFKA"
          desc="Distributed pub-sub queue across 6 topics (fault tolerant)"
          icon={RiDatabase2Fill}
          tag="QUEUE"
        />

        <RiArrowRightLine className="text-[#8e8a7c] shrink-0 hidden md:block" size={16} />

        <PipelineNode
          title="SPARK"
          desc="Structured streaming 30s window fusion & feature alignment"
          icon={RiCpuFill}
          tag="MICRO-BATCH"
        />

        <RiArrowRightLine className="text-[#8e8a7c] shrink-0 hidden md:block" size={16} />

        <PipelineNode
          title="ML MODELS"
          desc="RF (Detection) · XGBoost (Severity) · LSTM (Traffic) · NLP"
          icon={RiBrainFill}
          tag="4x INFERENCE"
        />

        <RiArrowRightLine className="text-[#8e8a7c] shrink-0 hidden md:block" size={16} />

        <PipelineNode
          title="DECISION ENGINE"
          desc="Dijkstra shortest path with dynamic LSTM congestion penalty"
          icon={RiRouteFill}
          tag="OSMNX GRAPH"
        />

        <RiArrowRightLine className="text-[#8e8a7c] shrink-0 hidden md:block" size={16} />

        <PipelineNode
          title="ACTIONS"
          desc="Instant ambulance allocation, green corridor & civilian diversion"
          icon={RiFlashlightFill}
          tag="&lt; 3.0s"
        />
      </div>
    </div>
  );
};

export default DataPipelineFlow;
