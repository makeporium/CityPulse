import React, { useRef, useEffect, useState } from 'react';
import { RiCpuLine, RiRadarLine } from 'react-icons/ri';

const IntersectionSimulation = () => {
  const canvasRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [densitiesState, setDensitiesState] = useState({ North: 0, South: 0, East: 0, West: 0 });
  const [lightsState, setLightsState] = useState({ North: 'GREEN', South: 'GREEN', East: 'RED', West: 'RED' });
  
  // Simulation State Refs (to avoid re-renders on every tick)
  const stateRef = useRef({
    cars: [],
    lights: {
      North: 'GREEN', // N->S
      South: 'GREEN', // S->N
      East: 'RED',    // E->W
      West: 'RED'     // W->E
    },
    densities: { North: 0, South: 0, East: 0, West: 0 }
  });

  const addLog = (msg, isCritical = false) => {
    setLogs(prev => [...prev.slice(-6), { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), msg, isCritical }]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const laneWidth = 44;

    // --- SPAWNING CARS ---
    const spawnInterval = setInterval(() => {
      const dirs = ['North', 'South', 'East', 'West'];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      
      const spawnChance = Math.random();
      if (spawnChance < 0.65) {
        let x, y, dx, dy;
        switch(dir) {
          case 'North': x = cx - laneWidth/2; y = 0; dx = 0; dy = 2.2; break; // moving south
          case 'South': x = cx + laneWidth/2; y = height; dx = 0; dy = -2.2; break; // moving north
          case 'East': x = width; y = cy - laneWidth/2; dx = -2.2; dy = 0; break; // moving west
          case 'West': x = 0; y = cy + laneWidth/2; dx = 2.2; dy = 0; break; // moving east
          default: break;
        }
        stateRef.current.cars.push({ id: Math.random(), dir, x, y, dx, dy, speed: 2.2, waiting: false });
      }
    }, 750);

    // --- AI CONTROL LOOP ---
    const aiInterval = setInterval(() => {
      const state = stateRef.current;
      
      // Calculate densities (cars stopped or waiting)
      let dens = { North: 0, South: 0, East: 0, West: 0 };
      state.cars.forEach(car => {
        if (car.speed < 0.5) dens[car.dir]++;
      });
      state.densities = dens;
      setDensitiesState({ ...dens });

      // AI Decision Logic
      const maxDensity = Math.max(...Object.values(dens));
      if (maxDensity >= 4) {
        const jammedLane = Object.keys(dens).find(k => dens[k] === maxDensity);
        
        if (state.lights[jammedLane] === 'RED') {
          addLog(`DYNAMIC GREEN WAVE: Diverting priority to ${jammedLane} (Congestion Index: ${maxDensity} vehicles queued).`, true);
          
          if (jammedLane === 'North' || jammedLane === 'South') {
            state.lights.North = 'GREEN'; state.lights.South = 'GREEN';
            state.lights.East = 'RED'; state.lights.West = 'RED';
          } else {
            state.lights.East = 'GREEN'; state.lights.West = 'GREEN';
            state.lights.North = 'RED'; state.lights.South = 'RED';
          }
          setLightsState({ ...state.lights });
        }
      } else {
        if (Math.random() < 0.3) {
           if (state.lights.North === 'GREEN') {
             state.lights.North = 'RED'; state.lights.South = 'RED';
             state.lights.East = 'GREEN'; state.lights.West = 'GREEN';
             addLog(`AI BALANCING: Synchronized switch to East-West corridor.`);
           } else {
             state.lights.North = 'GREEN'; state.lights.South = 'GREEN';
             state.lights.East = 'RED'; state.lights.West = 'RED';
             addLog(`AI BALANCING: Synchronized switch to North-South corridor.`);
           }
           setLightsState({ ...state.lights });
        }
      }
    }, 2500);

    // --- RENDER LOOP ---
    const render = () => {
      // Dark asphalt
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, width, height);

      // Grid backdrop
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 25) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Asphalt roads
      ctx.fillStyle = '#171c26';
      ctx.fillRect(cx - laneWidth, 0, laneWidth * 2, height);
      ctx.fillRect(0, cy - laneWidth, width, laneWidth * 2);

      // Road Borders
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - laneWidth, 0, laneWidth * 2, height);
      ctx.strokeRect(0, cy - laneWidth, width, laneWidth * 2);

      // Center intersection box
      ctx.fillStyle = '#1e2433';
      ctx.fillRect(cx - laneWidth, cy - laneWidth, laneWidth * 2, laneWidth * 2);

      // Lane dividers
      ctx.strokeStyle = '#e2e8f0';
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, cy - laneWidth);
      ctx.moveTo(cx, cy + laneWidth); ctx.lineTo(cx, height);
      ctx.moveTo(0, cy); ctx.lineTo(cx - laneWidth, cy);
      ctx.moveTo(cx + laneWidth, cy); ctx.lineTo(width, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Glowing Traffic Lights
      const drawLight = (x, y, color) => {
        const isGreen = color === 'GREEN';
        const hex = isGreen ? '#00f090' : '#ff2a5f';
        ctx.save();
        ctx.shadowColor = hex;
        ctx.shadowBlur = 12;
        ctx.fillStyle = hex;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawLight(cx - laneWidth - 14, cy - laneWidth - 14, stateRef.current.lights.North);
      drawLight(cx + laneWidth + 14, cy + laneWidth + 14, stateRef.current.lights.South);
      drawLight(cx + laneWidth + 14, cy - laneWidth - 14, stateRef.current.lights.East);
      drawLight(cx - laneWidth - 14, cy + laneWidth + 14, stateRef.current.lights.West);

      // Update & Draw Vehicles
      const cars = stateRef.current.cars;
      for (let i = 0; i < cars.length; i++) {
        let car = cars[i];
        let stopDistance = 45;
        let shouldStop = false;
        
        if (stateRef.current.lights[car.dir] === 'RED') {
          if (car.dir === 'North' && car.y > cy - laneWidth - stopDistance && car.y < cy) shouldStop = true;
          if (car.dir === 'South' && car.y < cy + laneWidth + stopDistance && car.y > cy) shouldStop = true;
          if (car.dir === 'East' && car.x < cx + laneWidth + stopDistance && car.x > cx) shouldStop = true;
          if (car.dir === 'West' && car.x > cx - laneWidth - stopDistance && car.x < cx) shouldStop = true;
        }

        // Avoid collision with front car
        for (let j = 0; j < cars.length; j++) {
          if (i === j) continue;
          let other = cars[j];
          if (car.dir === other.dir) {
             let dist = Math.abs((car.x - other.x) + (car.y - other.y));
             if (car.dir === 'North' && other.y > car.y && dist < 32) shouldStop = true;
             if (car.dir === 'South' && other.y < car.y && dist < 32) shouldStop = true;
             if (car.dir === 'East' && other.x < car.x && dist < 32) shouldStop = true;
             if (car.dir === 'West' && other.x > car.x && dist < 32) shouldStop = true;
          }
        }

        if (shouldStop) {
          car.speed = Math.max(0, car.speed - 0.25);
        } else {
          car.speed = Math.min(2.4, car.speed + 0.12);
        }

        if (car.dir === 'North') car.y += car.speed;
        if (car.dir === 'South') car.y -= car.speed;
        if (car.dir === 'East') car.x -= car.speed;
        if (car.dir === 'West') car.x += car.speed;

        // Draw Car Body
        const isWaiting = car.speed < 0.5;
        const carColor = isWaiting ? '#ffaa00' : '#00e5ff';
        
        ctx.save();
        ctx.fillStyle = carColor;
        ctx.shadowColor = isWaiting ? 'rgba(255, 170, 0, 0.4)' : 'rgba(0, 229, 255, 0.4)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(car.x - 7, car.y - 7, 14, 14, 3);
        ctx.fill();
        ctx.restore();
      }

      stateRef.current.cars = cars.filter(c => c.x > -50 && c.x < width + 50 && c.y > -50 && c.y < height + 50);

      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      clearInterval(spawnInterval);
      clearInterval(aiInterval);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-full p-4">
      {/* Visual Canvas Area */}
      <div className="hud-panel hud-corner rounded-2xl p-4 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Top Status Bar */}
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-sky-500/20 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <RiRadarLine className="animate-spin" style={{ animationDuration: '6s' }} size={16} />
            <span className="font-bold">MICRO-VIEW: DYNAMIC SMART INTERSECTION AI</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${lightsState.North === 'GREEN' ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-rose-500'}`} />
              N/S: <strong>{lightsState.North}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${lightsState.East === 'GREEN' ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-rose-500'}`} />
              E/W: <strong>{lightsState.East}</strong>
            </span>
          </div>
        </div>

        <canvas 
          ref={canvasRef} 
          width={520} 
          height={520} 
          className="rounded-xl border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] max-w-full h-auto"
        />

        <div className="w-full mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>QUEUED: N: {densitiesState.North} | S: {densitiesState.South} | E: {densitiesState.East} | W: {densitiesState.West}</span>
          <span className="text-cyan-400">FPS: 60 | REAL-TIME COMPUTER VISION INFERENCE</span>
        </div>
      </div>
      
      {/* AI Decision Log Sidebar */}
      <div className="hud-panel hud-corner rounded-2xl p-4 w-full lg:w-96 flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-500/20">
          <div className="flex items-center gap-2">
            <RiCpuLine className="text-cyan-400" size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
              Signal Decision Engine
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            AUTONOMOUS
          </span>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 font-mono text-xs">
          {logs.slice().reverse().map((log) => (
            <div 
              key={log.id} 
              className={`p-3 rounded-lg bg-black/40 border border-white/5 ${
                log.isCritical 
                  ? 'border-l-4 border-l-rose-500 bg-rose-950/20 text-rose-200' 
                  : 'border-l-4 border-l-emerald-400 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-semibold text-white">{log.time}</span>
                <span className={log.isCritical ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {log.isCritical ? 'CRITICAL DISPATCH' : 'PASSIVE CYCLE'}
                </span>
              </div>
              <p className="leading-relaxed font-sans text-xs">
                {log.msg}
              </p>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-slate-500 text-center py-10 font-mono text-xs">
              Intersection telemetry active. Monitoring queue lengths...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntersectionSimulation;
