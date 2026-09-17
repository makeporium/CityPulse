import React from 'react';
import { 
  RiVideoFill, 
  RiCompass3Fill, 
  RiRainyFill, 
  RiRoadMapFill, 
  RiVolumeUpFill, 
  RiDatabase2Fill 
} from 'react-icons/ri';

const StreamCard = ({ num, title, icon: Icon, metric, barColor }) => {
  return (
    <div className="bg-[#fcfbf9] border border-[#d6d3c7] p-2.5 rounded flex flex-col justify-between hover:border-[#14171a] transition-all">
      {/* Top title & icon */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#14171a]">
          <Icon size={13} className="text-[#5c6370]" />
          <span>{num}. {title}</span>
        </div>
        <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-[#15803d] text-white font-bold uppercase">
          LIVE
        </span>
      </div>

      {/* Dynamic Waveform Graphic */}
      <div className="h-7 my-1.5 flex items-end justify-between gap-0.5 px-1 bg-[#f4f3ee] rounded border border-[#e5e2d6] overflow-hidden">
        {[
          'animate-wave-1', 'animate-wave-3', 'animate-wave-2', 'animate-wave-5', 
          'animate-wave-4', 'animate-wave-1', 'animate-wave-2', 'animate-wave-3',
          'animate-wave-5', 'animate-wave-4', 'animate-wave-2', 'animate-wave-1'
        ].map((animClass, i) => (
          <div 
            key={i} 
            className={`w-1 rounded-t transition-all ${barColor} ${animClass}`} 
            style={{ height: `${25 + (i * 17) % 65}%` }}
          />
        ))}
      </div>

      {/* Metric footer */}
      <div className="text-[10px] font-mono font-semibold text-[#14171a] truncate">
        {metric}
      </div>
    </div>
  );
};

const CityPulseStreams = () => {
  return (
    <div className="arch-panel rounded-none border border-[#c8c5b8] bg-[#fcfbf9] p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#dad7cb]">
        <div className="flex items-center gap-2">
          <span className="arch-header-badge">04</span>
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#14171a]">
              THE TEQ PULSE
            </h2>
            <span className="text-[10px] font-mono text-[#5c6370]">
              SIX DATA STREAMS. ONE REAL-TIME PICTURE.
            </span>
          </div>
        </div>
      </div>

      {/* 6 Stream Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <StreamCard
          num="1"
          title="CCTV (VIDEO)"
          icon={RiVideoFill}
          metric="1,240 frames/s"
          barColor="bg-[#0284c7]"
        />

        <StreamCard
          num="2"
          title="GPS (AMBULANCES)"
          icon={RiCompass3Fill}
          metric="5 units tracking"
          barColor="bg-[#0ea5e9]"
        />

        <StreamCard
          num="3"
          title="WEATHER"
          icon={RiRainyFill}
          metric="26°C Light Rain"
          barColor="bg-[#10b981]"
        />

        <StreamCard
          num="4"
          title="ROAD SENSORS"
          icon={RiRoadMapFill}
          metric="428 sensors"
          barColor="bg-[#f59e0b]"
        />

        <StreamCard
          num="5"
          title="AUDIO (SIRENS)"
          icon={RiVolumeUpFill}
          metric="Siren detected"
          barColor="bg-[#ef4444]"
        />

        <StreamCard
          num="6"
          title="ACCIDENT STREAM"
          icon={RiDatabase2Fill}
          metric="2,489,120 events"
          barColor="bg-[#8b5cf6]"
        />
      </div>
    </div>
  );
};

export default CityPulseStreams;
