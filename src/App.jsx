import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LiveEventLog from './components/LiveEventLog';
import CityOperationsMap from './components/CityOperationsMap';
import IncidentResponsePanel from './components/IncidentResponsePanel';
import CityPulseStreams from './components/CityPulseStreams';
import DataPipelineFlow from './components/DataPipelineFlow';
import BackendPipelineInternals from './components/BackendPipelineInternals';
import IntersectionSimulation from './components/IntersectionSimulation';
import { generateIncident, generateAmbulance } from './services/mockEngine';

function App() {
  const [activeTab, setActiveTab] = useState('live'); // 'live', 'pipeline', 'intersection'
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [incidents, setIncidents] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [events, setEvents] = useState([]);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  const showNotification = (msg) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  // Clock ticker
  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  // Initialize Data
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

  // Simulation tick loop
  useEffect(() => {
    const timer = setInterval(() => {
      // Periodic ambulance position adjustments along real coordinates
      setAmbulances(prev => prev.map(amb => {
        if (amb.status === 'Patrolling') {
          return {
            ...amb,
            lat: amb.lat + (Math.random() - 0.5) * 0.001,
            lng: amb.lng + (Math.random() - 0.5) * 0.001
          };
        } else if (amb.targetIncident) {
          const dLat = amb.targetIncident.lat - amb.lat;
          const dLng = amb.targetIncident.lng - amb.lng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          if (dist < 0.002 || isNaN(dist)) {
            return { ...amb, status: 'Patrolling', targetIncident: null, eta: 'On Scene' };
          }
          return {
            ...amb,
            lat: amb.lat + (dLat / dist) * 0.003,
            lng: amb.lng + (dLng / dist) * 0.003,
            eta: `${Math.max(1, Math.round(dist * 600))} min`
          };
        }
        return amb;
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Handlers for Command Center actions
  const handleDispatch = () => {
    setAmbulances(prev => prev.map(a => {
      if (a.id === 'AMB-03') {
        return {
          ...a,
          status: 'Dispatched',
          eta: '3.8 min',
          targetIncident: { lat: 28.5720, lng: 77.2120 }
        };
      }
      return a;
    }));

    showNotification('EMERGENCY ACTION: Unit AMB-03 dispatched to Ring Road accident via AIIMS flyover.');
  };

  const handleDivert = () => {
    showNotification('AI INSIGHT: Traffic diversion recommendation broadcast to civilian navigation apps.');
  };

  const handleNotifyHospitals = () => {
    showNotification('HOSPITAL LINK: AIIMS Trauma Centre notified. Emergency bay prepared.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0eee6] text-[#14171a] bg-blueprint-grid">
      {/* Top Header & Incident Ticker */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentTime={currentTime} 
      />

      {/* Floating Action Toast Notification */}
      {feedbackNotice && (
        <div className="fixed top-24 right-5 z-[2000] bg-[#14171a] text-white px-4 py-2.5 rounded shadow-lg border border-[#333] font-mono text-xs flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 p-3 lg:p-4 flex flex-col overflow-x-hidden">
        {activeTab === 'live' && (
          <div className="flex-1 flex flex-col gap-3">
            {/* Top Row: Section 01, 02, 03 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
              {/* 01 LIVE EVENT LOG */}
              <div className="lg:col-span-3 min-h-[440px] flex flex-col">
                <LiveEventLog events={events} />
              </div>

              {/* 02 CITY OPERATIONS MAP & TRAFFIC PREDICTION */}
              <div className="lg:col-span-6 min-h-[440px] flex flex-col">
                <CityOperationsMap 
                  ambulances={ambulances} 
                  incidents={incidents}
                />
              </div>

              {/* 03 INCIDENT RESPONSE */}
              <div className="lg:col-span-3 min-h-[440px] flex flex-col">
                <IncidentResponsePanel 
                  onDispatch={handleDispatch}
                  onDivert={handleDivert}
                  onNotifyHospitals={handleNotifyHospitals}
                />
              </div>
            </div>

            {/* Bottom Row: Section 04 (City Pulse) and Section 05 (Data Pipeline) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-7">
                <CityPulseStreams />
              </div>
              <div className="lg:col-span-5">
                <DataPipelineFlow onOpenPipelineDetails={() => setActiveTab('pipeline')} />
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Developer Showcase Tab: Kafka, Spark, ML, and Decision Engine */}
        {activeTab === 'pipeline' && (
          <div className="flex-1 flex flex-col">
            <BackendPipelineInternals />
          </div>
        )}

        {/* Micro View Tab: Smart Intersection Simulation */}
        {activeTab === 'intersection' && (
          <div className="flex-1 flex flex-col">
            <IntersectionSimulation />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
