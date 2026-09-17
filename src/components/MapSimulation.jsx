import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RiCrosshair2Line, RiCompass3Line, RiShieldCrossFill, RiRouteLine } from 'react-icons/ri';

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Tactical Custom Icons
const createIncidentIcon = (severity) => {
  const isCritical = severity >= 3;
  const color = isCritical ? '#ff2a5f' : '#ffaa00';
  return new L.DivIcon({
    className: 'custom-incident-icon',
    html: `
      <div style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:radial-gradient(circle, ${color}66 0%, transparent 70%); animation: beacon-pulse 1.8s infinite;"></div>
        <div style="width:14px; height:14px; background:${color}; border:2px solid #ffffff; border-radius:50%; box-shadow: 0 0 12px ${color}; z-index:2;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const createAmbulanceIcon = (status) => {
  const isDispatched = status === 'Dispatched';
  const color = isDispatched ? '#00e5ff' : '#00f090';
  return new L.DivIcon({
    className: 'custom-ambulance-icon',
    html: `
      <div style="position:relative; width:30px; height:30px; display:flex; align-items:center; justify-content:center;">
        ${isDispatched ? `<div style="position:absolute; width:100%; height:100%; border-radius:50%; border:2px solid ${color}; animation: beacon-pulse 1.2s infinite;"></div>` : ''}
        <div style="background:#0c1017; border:2px solid ${color}; color:${color}; padding:3px 5px; border-radius:4px; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:bold; box-shadow:0 0 10px ${color}88; display:flex; align-items:center; gap:2px;">
          <span>+</span>
          <span>AMB</span>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const MapSimulation = ({ incidents, ambulances }) => {
  const defaultCenter = [28.6139, 77.2090]; // Delhi Metropolitan Center

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-sky-500/25 hud-panel shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
      {/* HUD Radar Corner Overlays */}
      <div className="absolute top-3 left-3 z-[1000] pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/75 border border-sky-500/30 backdrop-blur-md text-xs font-mono text-cyan-300">
        <RiCrosshair2Line className="animate-spin text-cyan-400" style={{ animationDuration: '12s' }} size={16} />
        <span>RADAR: 28.6139°N / 77.2090°E [OSM GEO-ROUTING ACTIVE]</span>
      </div>

      <div className="absolute top-3 right-3 z-[1000] pointer-events-none flex items-center gap-3 px-3 py-1.5 rounded-md bg-black/75 border border-sky-500/30 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>BLUE: DISPATCH TRAJECTORY</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>GREEN: DIVERSION</span>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none px-3 py-1 rounded bg-black/80 border border-white/10 text-[11px] font-mono text-slate-400 flex items-center gap-2">
        <RiShieldCrossFill className="text-cyan-400" size={13} />
        <span>FLEET: 5 UNITS [ACTIVE TELEMETRY]</span>
      </div>

      {/* React Leaflet Map */}
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ width: '100%', height: '100%', background: '#07090e' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Render Incidents with Pulse Rings */}
        {incidents.filter(inc => inc.lat !== undefined && inc.lng !== undefined).map(inc => (
          <React.Fragment key={inc.id}>
            <Marker position={[inc.lat, inc.lng]} icon={createIncidentIcon(inc.severity)}>
              <Popup className="dark-popup">
                <div style={{ padding: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#111827' }}>
                  <strong style={{ color: inc.severity >= 3 ? '#e11d48' : '#0284c7' }}>
                    {inc.id} [{inc.type.toUpperCase()}]
                  </strong>
                  <br />
                  Severity: {inc.severity} / 4
                  <br />
                  {inc.description}
                </div>
              </Popup>
            </Marker>
            <CircleMarker 
              center={[inc.lat, inc.lng]} 
              radius={inc.severity * 14} 
              pathOptions={{ 
                color: inc.severity >= 3 ? '#ff2a5f' : '#ffaa00', 
                fillColor: inc.severity >= 3 ? '#ff2a5f' : '#ffaa00', 
                fillOpacity: 0.18, 
                weight: 1.5,
                dashArray: '3, 6'
              }} 
            />
          </React.Fragment>
        ))}

        {/* Render Ambulances & Dynamic Shortest-Path Trajectory Polylines */}
        {ambulances.map(amb => {
          const isDispatched = amb.status === 'Dispatched' && amb.targetIncident;
          return (
            <React.Fragment key={amb.id}>
              <Marker position={[amb.lat, amb.lng]} icon={createAmbulanceIcon(amb.status)}>
                <Popup>
                  <div style={{ padding: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#111827' }}>
                    <strong>{amb.id}</strong><br/>
                    Status: <span style={{ color: isDispatched ? '#0284c7' : '#16a34a' }}>{amb.status}</span><br/>
                    ETA: {amb.eta || '4 mins'}<br/>
                    Road: {amb.currentRoad || 'Outer Ring Rd'}
                  </div>
                </Popup>
              </Marker>

              {/* Blue Shortest Path Line (Dijkstra Trajectory) */}
              {isDispatched && (
                <Polyline
                  positions={[
                    [amb.lat, amb.lng],
                    [(amb.lat + amb.targetIncident.lat) / 2 + 0.003, (amb.lng + amb.targetIncident.lng) / 2 - 0.003],
                    [amb.targetIncident.lat, amb.targetIncident.lng]
                  ]}
                  pathOptions={{
                    color: '#00e5ff',
                    weight: 3.5,
                    dashArray: '8, 8',
                    opacity: 0.85
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Civilian Diversion Route Green Polyline */}
        <Polyline
          positions={[
            [28.6250, 77.2050],
            [28.6320, 77.2180],
            [28.6400, 77.2300]
          ]}
          pathOptions={{
            color: '#00f090',
            weight: 3,
            opacity: 0.75
          }}
        />
      </MapContainer>
    </div>
  );
};

export default MapSimulation;
