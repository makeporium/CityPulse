import React from 'react';
import { 
  RiPulseFill, 
  RiAlarmWarningFill, 
  RiTimeFill, 
  RiCloudWindyFill,
  RiDatabase2Fill
} from 'react-icons/ri';

const StatCard = ({ title, value, unit, icon: Icon, theme, alertBadge, microDetail }) => {
  const styles = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-400/50',
      bg: 'bg-cyan-950/20',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      valueColor: 'text-cyan-300',
      glow: 'hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
    },
    crimson: {
      border: 'border-rose-500/30 hover:border-rose-400/60',
      bg: 'bg-rose-950/25',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      valueColor: 'text-rose-400',
      glow: 'hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]'
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-400/50',
      bg: 'bg-emerald-950/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      valueColor: 'text-emerald-300',
      glow: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-400/50',
      bg: 'bg-amber-950/20',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      valueColor: 'text-amber-300',
      glow: 'hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]'
    }
  }[theme];

  return (
    <div className={`hud-panel rounded-xl p-3.5 border transition-all duration-200 ${styles.bg} ${styles.border} ${styles.glow}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${styles.iconBg}`}>
            <Icon size={20} />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              {title}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-2xl font-bold font-mono tracking-tight ${styles.valueColor}`}>
                {value}
              </span>
              {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
            </div>
          </div>
        </div>

        {alertBadge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/50 bg-rose-950/80 text-rose-300 animate-pulse font-semibold">
            {alertBadge}
          </span>
        )}
      </div>

      {microDetail && (
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>{microDetail.label}</span>
          <span className={microDetail.highlight ? 'text-cyan-300 font-medium' : 'text-slate-400'}>
            {microDetail.val}
          </span>
        </div>
      )}
    </div>
  );
};

const DashboardStats = ({ incidents }) => {
  const activeIncidents = incidents.filter(i => i.status === 'Active').length;
  const criticalIncidents = incidents.filter(i => i.severity >= 3).length;

  return (
    <div className="flex flex-col gap-3">
      {/* Big Data Volume Proof Banner */}
      <div className="hud-panel rounded-xl p-3 border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiDatabase2Fill className="text-cyan-400" size={18} />
            <span className="text-xs font-mono text-slate-300 font-semibold tracking-wider">
              BIG DATA STREAM
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/30">
            KAFKA INGEST
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-white tracking-tight">
            2,489,120
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            +1,000 ev/s
          </span>
        </div>
      </div>

      {/* Grid of stats */}
      <StatCard 
        title="Active Incidents" 
        value={activeIncidents} 
        unit="live"
        icon={RiPulseFill} 
        theme="cyan"
        microDetail={{ label: "Pipeline Status", val: "Fusing 6 Streams", highlight: true }}
      />

      <StatCard 
        title="Critical Alerts" 
        value={criticalIncidents} 
        unit="p1 priority"
        icon={RiAlarmWarningFill} 
        theme="crimson" 
        alertBadge={criticalIncidents > 0 ? "ACTION REQUIRED" : null}
        microDetail={{ label: "Auto-Dispatch", val: criticalIncidents > 0 ? "Triggered" : "Standby", highlight: criticalIncidents > 0 }}
      />

      <StatCard 
        title="Avg Response Time" 
        value="6.2" 
        unit="min"
        icon={RiTimeFill} 
        theme="emerald" 
        microDetail={{ label: "Historical Baseline", val: "18.5 min (-66%)", highlight: true }}
      />

      <StatCard 
        title="Live Weather Feed" 
        value="26°C" 
        unit="Rain / 2km Vis"
        icon={RiCloudWindyFill} 
        theme="amber" 
        microDetail={{ label: "OpenWeatherMap API", val: "Live Sync: 10m", highlight: false }}
      />
    </div>
  );
};

export default DashboardStats;
