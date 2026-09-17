import React from 'react';
import { 
  RiVideoFill, 
  RiCloudRainFill, 
  RiVolumeUpFill, 
  RiAlarmWarningFill,
  RiRoadMapFill,
  RiFilter3Line
} from 'react-icons/ri';

const IncidentFeed = ({ incidents }) => {
  const getSourceBadge = (type) => {
    switch (type) {
      case 'Accident':
        return {
          icon: RiVideoFill,
          label: 'CCTV-YOLO',
          color: 'text-rose-400 bg-rose-950/60 border-rose-500/40'
        };
      case 'Weather':
        return {
          icon: RiCloudRainFill,
          label: 'WEATHER-API',
          color: 'text-sky-400 bg-sky-950/60 border-sky-500/40'
        };
      case 'Audio':
      case 'Pothole':
        return {
          icon: RiVolumeUpFill,
          label: 'AUDIO-U8K',
          color: 'text-amber-400 bg-amber-950/60 border-amber-500/40'
        };
      case 'Congestion':
      default:
        return {
          icon: RiRoadMapFill,
          label: 'TRAFFIC-SENSOR',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
        };
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 4:
      case 3:
        return { text: 'CRITICAL', border: 'border-l-rose-500', pill: 'bg-rose-950 text-rose-300 border-rose-600/60' };
      case 2:
        return { text: 'MODERATE', border: 'border-l-amber-500', pill: 'bg-amber-950 text-amber-300 border-amber-600/60' };
      case 1:
      default:
        return { text: 'LOW', border: 'border-l-cyan-500', pill: 'bg-cyan-950 text-cyan-300 border-cyan-600/60' };
    }
  };

  return (
    <div className="hud-panel hud-corner rounded-xl p-4 flex flex-col flex-1 overflow-hidden min-h-[360px]">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-500/20">
        <div className="flex items-center gap-2">
          <RiAlarmWarningFill className="text-rose-400 animate-pulse" size={18} />
          <h2 className="text-base font-bold tracking-wider text-slate-100 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            Real-Time Fusion Feed
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <RiFilter3Line size={14} />
          <span>SPARK 30s BATCH</span>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="overflow-y-auto flex-1 flex flex-col gap-2.5 pr-1">
        {incidents.slice().reverse().map((incident) => {
          const source = getSourceBadge(incident.type);
          const SourceIcon = source.icon;
          const sev = getSeverityBadge(incident.severity);

          return (
            <div
              key={incident.id}
              className={`p-3 rounded-lg bg-black/40 border border-white/5 border-l-4 ${sev.border} hover:bg-black/60 transition-all text-xs font-mono`}
            >
              {/* Top Row: IDs, Source, and Timestamp */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold ${source.color}`}>
                    <SourceIcon size={12} />
                    {source.label}
                  </span>
                  <span className="font-bold text-slate-200">{incident.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${sev.pill}`}>
                    {sev.text}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Description & Model Details */}
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                {incident.description}
              </p>

              {/* Telemetry Footer */}
              <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                <span className="text-cyan-400/80">
                  {incident.lat ? `GEO: ${incident.lat.toFixed(4)}N, ${incident.lng.toFixed(4)}E` : 'NODE: SYSTEM-CORE'}
                </span>
                <span className="text-slate-400">
                  CONFIDENCE: <strong className="text-slate-200">{incident.severity >= 3 ? '94%' : '88%'}</strong>
                </span>
              </div>
            </div>
          );
        })}

        {incidents.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-500 font-mono text-xs gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Ingesting Kafka topics...
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentFeed;
