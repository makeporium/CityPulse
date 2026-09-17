import React, { useState, useEffect } from 'react';
import './index.css';
import MapSimulation from './components/MapSimulation';
import DashboardStats from './components/DashboardStats';
import IncidentFeed from './components/IncidentFeed';
import ControlPanel from './components/ControlPanel';
import IntersectionSimulation from './components/IntersectionSimulation';
import { generateIncident, generateAmbulance } from './services/mockEngine';
import { 
  RiRadarLine, 
  RiCpuLine, 
  RiRoadMapLine, 
  RiSignalTowerFill, 
  RiTimeLine,
  RiDashboard3Line,
  RiTrafficLightLine
} from 'react-icons/ri';

function App() {
  const [view, setView] = useState('city'); // 'city' or 'intersection'
  const [incidents, setIncidents] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Data (5 Ambulances as per project specification)
  useEffect(() => {
    const initialIncidents = [generateIncident(101), generateIncident(102)];
    const initialAmbulances = [
      generateAmbulance(1),
      generateAmbulance(2),
      generateAmbulance(3),
      generateAmbulance(4),
      generateAmbulance(5)
    ];
    setIncidents(initialIncidents);
    setAmbulances(initialAmbulances);
  }, []);

  // Simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to spawn a new incident stream event
      if (Math.random() < 0.35) {
        setIncidents(prev => [...prev, generateIncident(prev.length + 101)].slice(-25));
      }

      // Move ambulances dynamically along road vectors or towards targeted incident
      setAmbulances(prev => prev.map(amb => {
        if (amb.status === 'Patrolling') {
          return {
            ...amb,
            lat: amb.lat + (Math.random() - 0.5) * 0.0015,
            lng: amb.lng + (Math.random() - 0.5) * 0.0015,
          };
        } else if (amb.targetIncident) {
          const dLat = amb.targetIncident.lat - amb.lat;
          const dLng = amb.targetIncident.lng - amb.lng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          
          if (dist < 0.002 || isNaN(dist)) {
            // Arrived at incident location
            return { ...amb, status: 'Patrolling', targetIncident: null, eta: 'On Scene' };
          }
          
          return {
            ...amb,
            lat: amb.lat + (dLat / dist) * 0.004,
            lng: amb.lng + (dLng / dist) * 0.004,
            eta: `${Math.max(1, Math.round(dist * 500))} mins`
          };
        }
        return amb;
      }));

    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const handleDispatchAmbulance = () => {
    const activeIncident = incidents.find(i => i.status === 'Active');
    if (activeIncident) {
      setAmbulances(prev => {
        let dispatchedOne = false;
        return prev.map(a => {
          if (!dispatchedOne && a.status === 'Patrolling') {
            dispatchedOne = true;
            return { ...a, status: 'Dispatched', targetIncident: activeIncident, eta: '4 mins' };
          }
          return a;
        });
      });

      const dispatchLog = {
        id: `SYS-${Date.now().toString().slice(-4)}`,
        type: 'Accident',
        severity: 3,
        description: `AUTONOMOUS DISPATCH TRIGGERED: Unit AMB-03 assigned to ${activeIncident.id} via Dijkstra optimal path.`,
        timestamp: new Date().toISOString(),
        status: 'Active',
        lat: activeIncident.lat,
        lng: activeIncident.lng
      };
      setIncidents(prev => [...prev, dispatchLog]);
    }
  };

  const handleDivertTraffic = () => {
    const log = {
      id: `SYS-${Date.now().toString().slice(-4)}`,
      type: 'Congestion',
      severity: 2,
      description: `LSTM PREDICTIVE DIVERSION: Diverting civilian traffic to Brigade / Barakhamba Rd. Estimated delay saved: 8 mins.`,
      timestamp: new Date().toISOString(),
      status: 'Active'
    };
    setIncidents(prev => [...prev, log]);
  };

  const handleClearSignals = () => {
    const log = {
      id: `SYS-${Date.now().toString().slice(-4)}`,
      type: 'Congestion',
      severity: 1,
      description: `DYNAMIC CORRIDOR: Emergency green corridor activated along Outer Ring Road for dispatched units.`,
      timestamp: new Date().toISOString(),
      status: 'Active'
    };
    setIncidents(prev => [...prev, log]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#07090e] text-slate-100 bg-grid-tactical overflow-hidden scanline-overlay">
      {/* Top Operations Header */}
      <header className="h-16 px-5 border-b border-sky-500/20 bg-black/60 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-5">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-700 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <RiRadarLine size={22} className="text-white animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-wider text-white font-mono uppercase">
                  CityPulse <span className="text-cyan-400">AI</span>
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  v2.0 PROD-STREAM
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-wide">
                MULTIMODAL REAL-TIME URBAN EMERGENCY & TRAFFIC DISPATCH
              </p>
            </div>
          </div>

          {/* View Toggle Tabs with Cyber-Chamfer Buttons */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-lg border border-sky-500/20 ml-4 font-mono text-xs">
            <button 
              onClick={() => setView('city')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-semibold transition-all ${
                view === 'city' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.25)]' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <RiDashboard3Line size={15} />
              <span>MACRO VIEW (METRO MAP)</span>
            </button>
            <button 
              onClick={() => setView('intersection')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-semibold transition-all ${
                view === 'intersection' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(0,240,144,0.25)]' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <RiTrafficLightLine size={15} />
              <span>MICRO VIEW (INTERSECTION AI)</span>
            </button>
          </div>
        </div>

        {/* Telemetry Status Right Side */}
        <div className="flex items-center gap-4 font-mono text-xs">
          {/* Mission Clock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-black/50 border border-white/10 text-slate-300">
            <RiTimeLine className="text-cyan-400" size={14} />
            <span>UTC+05:30: <strong className="text-white">{currentTime}</strong></span>
          </div>

          {/* Real-time Streaming Pulse Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-[11px] tracking-wider">KAFKA LIVE SYNC</span>
          </div>
        </div>
      </header>

      {/* Main Operations Dashboard Grid */}
      <main className="flex-1 p-4 overflow-hidden">
        {view === 'city' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            {/* Left Telemetry Column (Stats + Ingestion Feed) */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
              <DashboardStats incidents={incidents} />
              <IncidentFeed incidents={incidents} />
            </div>

            {/* Center Main Stage (Tactical Map Simulation) */}
            <div className="lg:col-span-6 h-full flex flex-col">
              <MapSimulation incidents={incidents} ambulances={ambulances} />
            </div>

            {/* Right Command & Control Column */}
            <div className="lg:col-span-3 h-full flex flex-col">
              <ControlPanel 
                onDispatchAmbulance={handleDispatchAmbulance}
                onDivertTraffic={handleDivertTraffic}
                onClearSignals={handleClearSignals}
              />
            </div>
          </div>
        ) : (
          <div className="h-full">
            <IntersectionSimulation />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
