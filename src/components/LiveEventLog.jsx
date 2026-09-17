import React, { useState } from 'react';
import { 
  RiAlarmWarningFill, 
  RiRouteLine, 
  RiFireFill, 
  RiRainyFill, 
  RiAlertFill, 
  RiCheckboxCircleFill, 
  RiHospitalFill, 
  RiVolumeUpFill
} from 'react-icons/ri';
import { TbAmbulance } from 'react-icons/tb';

const LiveEventLog = ({ events }) => {
  const [filter, setFilter] = useState('ALL');

  const defaultEvents = [
    { id: 'EVT-12', time: '19:46', type: 'DISPATCH', icon: TbAmbulance, iconColor: 'text-[#0284c7]', title: 'Ambulance AMB-3 en route', desc: 'to Ring Road (ETA 4.2 min)' },
    { id: 'EVT-11', time: '19:45', type: 'INCIDENTS', icon: RiAlarmWarningFill, iconColor: 'text-[#c92a2a]', title: 'Major accident detected', desc: 'Ring Road - 3 vehicles (CCTV + Audio + Traffic)', highlight: true },
    { id: 'EVT-10', time: '19:44', type: 'TRAFFIC', icon: RiRouteLine, iconColor: 'text-[#15803d]', title: 'Traffic diversion activated', desc: 'AI suggested alternate routes' },
    { id: 'EVT-09', time: '19:42', type: 'INCIDENTS', icon: RiFireFill, iconColor: 'text-[#c92a2a]', title: 'Fire reported', desc: 'Lajpat Nagar (via 112 call)' },
    { id: 'EVT-08', time: '19:41', type: 'SYSTEM', icon: RiRainyFill, iconColor: 'text-[#0284c7]', title: 'Weather update', desc: 'Light rain - Visibility 2.1 km' },
    { id: 'EVT-07', time: '19:40', type: 'TRAFFIC', icon: RiAlertFill, iconColor: 'text-[#d97706]', title: 'Congestion predicted', desc: 'ITO - 15 min delay (LSTM)' },
    { id: 'EVT-06', time: '19:39', type: 'DISPATCH', icon: RiCheckboxCircleFill, iconColor: 'text-[#15803d]', title: 'Ambulance AMB-1 completed', desc: 'transport to AIIMS Trauma Centre' },
    { id: 'EVT-05', time: '19:38', type: 'INCIDENTS', icon: RiHospitalFill, iconColor: 'text-[#c92a2a]', title: 'Medical emergency', desc: 'Dwarka Sector 10' },
    { id: 'EVT-04', time: '19:36', type: 'TRAFFIC', icon: RiAlertFill, iconColor: 'text-[#d97706]', title: 'Road sensor alert', desc: 'Abnormal congestion pattern' },
    { id: 'EVT-03', time: '19:34', type: 'SYSTEM', icon: RiVolumeUpFill, iconColor: 'text-[#0284c7]', title: 'Audio alert', desc: 'Siren detected - Patel Nagar (UrbanSound8K)' },
    { id: 'EVT-02', time: '19:32', type: 'INCIDENTS', icon: RiAlarmWarningFill, iconColor: 'text-[#c92a2a]', title: 'Accident report (external)', desc: 'NH48 (3 vehicles involved)' },
    { id: 'EVT-01', time: '19:30', type: 'SYSTEM', icon: RiCheckboxCircleFill, iconColor: 'text-[#15803d]', title: 'System', desc: 'All data streams healthy' }
  ];

  const allEvents = events && events.length > 0 ? events : defaultEvents;

  const filteredEvents = filter === 'ALL' 
    ? allEvents 
    : allEvents.filter(e => e.type === filter);

  return (
    <div className="arch-panel rounded-none border border-[#c8c5b8] flex flex-col h-full bg-[#fcfbf9] overflow-hidden">
      {/* Panel Header */}
      <div className="p-3 border-b border-[#dad7cb] flex items-center justify-between bg-[#f4f3ee]">
        <div className="flex items-center gap-2">
          <span className="arch-header-badge">01</span>
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#14171a]">
              LIVE EVENT LOG
            </h2>
            <p className="text-[10px] font-mono text-[#5c6370]">
              REAL-TIME MULTIMODAL FEED
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-1.5 border-b border-[#dad7cb] bg-[#f8f7f2] flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
        {['ALL', 'INCIDENTS', 'DISPATCH', 'TRAFFIC', 'SYSTEM'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-2 py-0.5 rounded transition-all font-semibold ${
              filter === tab
                ? 'bg-[#14171a] text-white'
                : 'text-[#5c6370] hover:text-[#14171a] hover:bg-[#eae8df]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Event Items Stream */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#eceae2] p-2 space-y-1 font-mono text-xs">
        {filteredEvents.map((evt) => {
          const Icon = evt.icon || RiAlertFill;
          return (
            <div 
              key={evt.id} 
              className={`p-1.5 rounded transition-colors flex items-start gap-2.5 ${
                evt.highlight ? 'bg-[#fffaeb] border-l-2 border-[#c92a2a]' : 'hover:bg-[#f6f5ef]'
              }`}
            >
              {/* Timestamp */}
              <span className="text-[11px] font-mono font-bold text-[#5c6370] shrink-0 pt-0.5">
                {evt.time}
              </span>

              {/* Icon */}
              <div className={`shrink-0 pt-0.5 ${evt.iconColor || 'text-[#14171a]'}`}>
                <Icon size={14} />
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="font-bold text-[#14171a] text-[11px] leading-tight">
                  {evt.title}
                </div>
                <div className="text-[10px] text-[#5c6370] font-sans truncate leading-normal">
                  {evt.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Quote */}
      <div className="p-2.5 border-t border-[#dad7cb] bg-[#f4f3ee] text-center">
        <div className="text-[10px] font-mono font-bold text-[#14171a] tracking-tight">
          “SEE IT. UNDERSTAND IT. RESPOND BEFORE IT SPREADS.”
        </div>
        <div className="text-[9px] font-mono text-[#5c6370] uppercase tracking-widest mt-0.5">
          — TEQ (THAT ESCALATED QUICKLY)
        </div>
      </div>
    </div>
  );
};

export default LiveEventLog;
