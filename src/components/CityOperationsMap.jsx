import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Clean Markers
const createIncidentIcon = (_isMajor = false) => {
  return new L.DivIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position:relative; width:26px; height:26px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:rgba(201, 42, 42, 0.25); animation: soft-pulse 1.8s infinite;"></div>
        <div style="width:14px; height:14px; background:#c92a2a; border:2px solid #ffffff; border-radius:50%; box-shadow:0 1px 4px rgba(0,0,0,0.3); z-index:2;"></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

const createAmbulanceIcon = (id, eta, isDispatched = false) => {
  return new L.DivIcon({
    className: 'custom-amb-pin',
    html: `
      <div style="display:flex; align-items:center; gap:2px; background:${isDispatched ? '#0284c7' : '#15803d'}; color:#ffffff; padding:2px 5px; border-radius:3px; border:1px solid #ffffff; box-shadow:0 2px 5px rgba(0,0,0,0.25); font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:bold; white-space:nowrap;">
        <span>🚑</span>
        <span>${id}</span>
        ${eta ? `<span style="background:rgba(0,0,0,0.25); padding:1px 3px; border-radius:2px; font-size:9px;">${eta}</span>` : ''}
      </div>
    `,
    iconSize: [60, 22],
    iconAnchor: [30, 11]
  });
};

const createHospitalIcon = (name) => {
  return new L.DivIcon({
    className: 'custom-hosp-pin',
    html: `
      <div style="display:flex; align-items:center; gap:3px; background:#14171a; color:#ffffff; padding:2px 6px; border-radius:3px; border:1px solid #ffffff; box-shadow:0 1px 4px rgba(0,0,0,0.3); font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:bold;">
        <span style="color:#ef4444;">H</span>
        <span>${name}</span>
      </div>
    `,
    iconSize: [65, 20],
    iconAnchor: [32, 10]
  });
};

const CityOperationsMap = ({ ambulances = [], incidents = [] }) => {
  const [layers, setLayers] = useState({
    incidents: true,
    fleet: true,
    traffic: true,
    diversion: true
  });

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const defaultCenter = [28.6139, 77.2090]; // Delhi Metropolitan Center

  return (
    <div className="arch-panel rounded-none border border-[#c8c5b8] flex flex-col h-full bg-[#fcfbf9] overflow-hidden">
      {/* Panel Top Header with Sub-filters */}
      <div className="p-3 border-b border-[#dad7cb] flex flex-wrap items-center justify-between gap-3 bg-[#f4f3ee]">
        <div className="flex items-center gap-2">
          <span className="arch-header-badge">02</span>
          <div>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-[#14171a]">
              CITY OPERATIONS MAP
            </h2>
          </div>
        </div>

        {/* Filter Badges matching Reference 1 */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {[
            { key: 'incidents', label: 'LIVE INCIDENTS' },
            { key: 'fleet', label: 'AMBULANCE FLEET' },
            { key: 'traffic', label: 'TRAFFIC FLOW' },
            { key: 'diversion', label: 'AI INSIGHTS' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`px-2 py-0.5 rounded border transition-all font-semibold ${
                layers[item.key]
                  ? 'bg-[#14171a] text-white border-[#14171a]'
                  : 'bg-[#f7f6f2] text-[#666d7a] border-[#d2cfc3] hover:bg-[#eae8df]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 min-h-[380px] w-full">
        {/* Scale & Compass Floating HUD */}
        <div className="absolute top-3 left-3 z-[1000] pointer-events-none bg-[#ffffff]/90 border border-[#d2cfc3] px-2 py-1 rounded shadow-sm flex items-center gap-3 font-mono text-[10px] text-[#14171a]">
          <div className="flex items-center gap-1">
            <span className="font-bold">N</span>
            <span className="text-xs">↑</span>
          </div>
          <div className="border-l border-[#d2cfc3] pl-2 flex items-center gap-1.5">
            <span>0</span>
            <div className="w-10 h-1 bg-[#14171a]" />
            <span>2.5</span>
            <div className="w-10 h-1 bg-[#5c6370]" />
            <span>5 km</span>
          </div>
        </div>

        {/* Map Legend (Reference 1) */}
        <div className="absolute top-3 right-3 z-[1000] pointer-events-none bg-[#ffffff]/95 border border-[#d2cfc3] p-2 rounded shadow-sm text-[9px] font-mono space-y-1 text-[#333740]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c92a2a]" />
            <span>Incidents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-[#0284c7]" />
            <span>Ambulances</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-70" />
            <span>Traffic Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#15803d]" />
            <span>Diversion (AI)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#c92a2a]">H</span>
            <span>Hospitals</span>
          </div>
        </div>

        {/* Leaflet Map with Clean Positron / Esri Canvas */}
        <MapContainer 
          center={defaultCenter} 
          zoom={12} 
          style={{ width: '100%', height: '100%', background: '#e9e7dc' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; OpenStreetMap'
            maxZoom={16}
          />

          {/* Traffic Congestion Heat Rings (Soft amber/yellow) */}
          {layers.traffic && (
            <>
              <CircleMarker center={[28.6289, 77.2065]} radius={35} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.18, weight: 0 }} />
              <CircleMarker center={[28.6304, 77.2400]} radius={28} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.22, weight: 0 }} />
              <CircleMarker center={[28.5672, 77.2100]} radius={45} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25, weight: 0 }} />
              <CircleMarker center={[28.6000, 77.1950]} radius={30} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.16, weight: 0 }} />
            </>
          )}

          {/* Hospitals */}
          <Marker position={[28.5672, 77.2100]} icon={createHospitalIcon('AIIMS')} />
          <Marker position={[28.6300, 77.2250]} icon={createHospitalIcon('RML')} />

          {/* Main Major Incident (Ring Road Near AIIMS) */}
          {layers.incidents && (
            <>
              <Marker position={[28.5720, 77.2120]} icon={createIncidentIcon(true)}>
                <Popup>
                  <div className="font-mono text-xs">
                    <strong className="text-[#c92a2a]">MAJOR ACCIDENT</strong><br/>
                    Ring Road Near AIIMS Flyover<br/>
                    3 vehicles involved · 4-6 injuries est.
                  </div>
                </Popup>
              </Marker>
              <CircleMarker 
                center={[28.5720, 77.2120]} 
                radius={36} 
                pathOptions={{ color: '#c92a2a', fillColor: '#c92a2a', fillOpacity: 0.15, weight: 1.5, dashArray: '4, 4' }} 
              />
              <CircleMarker 
                center={[28.5720, 77.2120]} 
                radius={64} 
                pathOptions={{ color: '#c92a2a', fillColor: '#c92a2a', fillOpacity: 0.08, weight: 1, dashArray: '2, 4' }} 
              />

              {/* Other Incidents */}
              <Marker position={[28.6250, 77.2200]} icon={createIncidentIcon(false)} />
              <Marker position={[28.6500, 77.1600]} icon={createIncidentIcon(false)} />
            </>
          )}

          {/* Ambulances */}
          {layers.fleet && (
            <>
              <Marker position={[28.5850, 77.2180]} icon={createAmbulanceIcon('AMB-3', '4.2 min', true)} />
              <Marker position={[28.6250, 77.1950]} icon={createAmbulanceIcon('AMB-1', 'Available')} />
              <Marker position={[28.5950, 77.2800]} icon={createAmbulanceIcon('AMB-2', '6 min')} />
              <Marker position={[28.5800, 77.0600]} icon={createAmbulanceIcon('AMB-4', 'Patrol')} />
              <Marker position={[28.5200, 77.2100]} icon={createAmbulanceIcon('AMB-5', 'Patrol')} />
            </>
          )}

          {/* Blue Ambulance Route to AIIMS & Incident */}
          {layers.fleet && (
            <Polyline
              positions={[
                [28.5850, 77.2180],
                [28.5780, 77.2150],
                [28.5720, 77.2120],
                [28.5672, 77.2100]
              ]}
              pathOptions={{
                color: '#0284c7',
                weight: 4,
                opacity: 0.95
              }}
            />
          )}

          {/* Green AI Suggested Civilian Diversion Route */}
          {layers.diversion && (
            <Polyline
              positions={[
                [28.6100, 77.2300],
                [28.5950, 77.2400],
                [28.5800, 77.2500],
                [28.5650, 77.2400],
                [28.5550, 77.2250]
              ]}
              pathOptions={{
                color: '#15803d',
                weight: 3.5,
                dashArray: '6, 6',
                opacity: 0.9
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Bottom Subpanel: Traffic Prediction Graph & Affected Corridors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-[#dad7cb] bg-[#faf9f5]">
        {/* Left: Traffic Prediction (Next 60 min) Chart */}
        <div className="lg:col-span-8 p-3 border-r border-[#dad7cb]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-mono font-bold text-[#14171a] uppercase tracking-wider">
              TRAFFIC PREDICTION <span className="text-[10px] text-[#5c6370]">(NEXT 60 MIN)</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-[#c92a2a]">
                <span className="w-2.5 h-0.5 bg-[#c92a2a]" /> Predicted Congestion
              </span>
              <span className="flex items-center gap-1 text-[#5c6370]">
                <span className="w-2.5 h-0.5 border-t border-dashed border-[#5c6370]" /> Current
              </span>
              <span className="flex items-center gap-1 text-[#15803d]">
                <span className="w-2.5 h-0.5 bg-[#15803d]" /> With Diversion (AI)
              </span>
            </div>
          </div>

          {/* SVG Traffic Prediction Curve */}
          <div className="h-20 w-full relative">
            <svg viewBox="0 0 500 80" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#e3e0d5" strokeWidth="1" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="#e3e0d5" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#ccc9bc" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="5" y="18" fill="#888" fontSize="8" fontFamily="monospace">High</text>
              <text x="5" y="48" fill="#888" fontSize="8" fontFamily="monospace">Med</text>
              <text x="5" y="72" fill="#888" fontSize="8" fontFamily="monospace">Low</text>

              {/* Current Baseline (Dashed) */}
              <path
                d="M 30 52 Q 150 48, 250 50 T 490 53"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* Predicted Congestion (Red Peak Curve) */}
              <path
                d="M 30 52 Q 130 50, 240 18 Q 340 22, 490 35"
                fill="none"
                stroke="#c92a2a"
                strokeWidth="2.5"
              />

              {/* Shaded Area under red peak */}
              <path
                d="M 30 52 Q 130 50, 240 18 Q 340 22, 490 35 L 490 75 L 30 75 Z"
                fill="rgba(201, 42, 42, 0.08)"
              />

              {/* With Diversion (AI) (Green Dipping Curve) */}
              <path
                d="M 30 52 Q 140 50, 230 42 Q 320 58, 490 65"
                fill="none"
                stroke="#15803d"
                strokeWidth="2"
              />
            </svg>

            {/* Time Axis Markers */}
            <div className="flex justify-between text-[9px] font-mono text-[#666d7a] mt-1 px-4">
              <span>Now</span>
              <span>10m</span>
              <span>20m</span>
              <span>30m</span>
              <span>40m</span>
              <span>50m</span>
              <span>60m</span>
            </div>
          </div>
        </div>

        {/* Right: Affected Corridors (Next 1 Hour) List */}
        <div className="lg:col-span-4 p-3 font-mono text-xs">
          <div className="text-[10px] font-bold text-[#14171a] uppercase tracking-wider mb-1.5">
            AFFECTED CORRIDORS <span className="text-[#5c6370] font-normal">(Next 1 Hour)</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between py-0.5 border-b border-[#eceae0]">
              <span className="text-[#14171a] font-medium">① Ring Road</span>
              <span className="text-[#c92a2a] font-bold">+18 min</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-[#eceae0]">
              <span className="text-[#14171a] font-medium">② ITO</span>
              <span className="text-[#c92a2a] font-bold">+15 min</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-[#eceae0]">
              <span className="text-[#14171a] font-medium">③ Mathura Road</span>
              <span className="text-[#d97706] font-bold">+12 min</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-[#eceae0]">
              <span className="text-[#14171a] font-medium">④ NH48</span>
              <span className="text-[#d97706] font-bold">+10 min</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-[#14171a] font-medium">⑤ Lajpat Nagar</span>
              <span className="text-[#15803d] font-bold">+8 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityOperationsMap;
