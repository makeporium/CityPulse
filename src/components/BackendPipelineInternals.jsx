import React, { useState } from 'react';
import { 
  RiDatabase2Fill, 
  RiCpuFill, 
  RiBrainFill, 
  RiRouteFill, 
  RiCheckLine,
  RiFileCopyLine,
  RiTerminalBoxFill
} from 'react-icons/ri';

const BackendPipelineInternals = () => {
  const [activeSubTab, setActiveSubTab] = useState('kafka');
  const [selectedTopic, setSelectedTopic] = useState('cctv-events');
  const [copied, setCopied] = useState(false);

  // Raw Kafka Topic Mock Payloads for Developer Showcase
  const topicPayloads = {
    'cctv-events': {
      topic: 'cctv-events',
      partition: 2,
      offset: 1489201,
      timestamp: new Date().toISOString(),
      schema: 'org.citypulse.telemetry.CCTVEventAvro',
      payload: {
        camera_id: 'CAM-DEL-RING-104',
        intersection_id: 'INT-AIIMS-02',
        coordinates: { lat: 28.5720, lng: 77.2120 },
        fps: 30.0,
        yolo_inference: {
          model: 'yolov8x-seg',
          detected_objects: [
            { class: 'car', confidence: 0.94, bbox: [120, 340, 260, 480] },
            { class: 'truck', confidence: 0.91, bbox: [250, 310, 480, 520] },
            { class: 'motorcycle', confidence: 0.88, bbox: [210, 410, 270, 470] }
          ],
          incident_flag: 'COLLISION_DETECTED',
          confidence: 0.924,
          smoke_signature: true,
          vehicles_at_abnormal_angle: true
        }
      }
    },
    'gps-events': {
      topic: 'gps-events',
      partition: 0,
      offset: 894012,
      timestamp: new Date().toISOString(),
      schema: 'org.citypulse.telemetry.AmbulanceGPSAvro',
      payload: {
        vehicle_id: 'AMB-03',
        status: 'DISPATCHED',
        telemetry: {
          lat: 28.5850,
          lng: 77.2180,
          speed_kmh: 46.2,
          heading_degrees: 215.4,
          current_edge_id: 'osm_way_4198271',
          current_road: 'Ring Road South Approach'
        },
        dispatch_metadata: {
          assigned_incident_id: 'INC-0101',
          target_coordinates: { lat: 28.5720, lng: 77.2120 },
          dijkstra_eta_seconds: 252,
          estimated_arrival: '19:49:12 IST'
        }
      }
    },
    'weather-events': {
      topic: 'weather-events',
      partition: 1,
      offset: 42109,
      timestamp: new Date().toISOString(),
      schema: 'org.citypulse.telemetry.OpenWeatherMapAvro',
      payload: {
        source: 'OpenWeatherMap API v3.0 (10-min poll)',
        city: 'New Delhi',
        station_id: 'VIDD',
        readings: {
          temperature_celsius: 26.4,
          humidity_percent: 88,
          rainfall_1h_mm: 18.2,
          visibility_meters: 2100,
          wind_speed_mps: 5.6,
          road_surface_condition: 'WET_ASPHALT',
          friction_coefficient_mu: 0.38
        }
      }
    },
    'audio-events': {
      topic: 'audio-events',
      partition: 0,
      offset: 210984,
      timestamp: new Date().toISOString(),
      schema: 'org.citypulse.telemetry.UrbanSound8KAvro',
      payload: {
        acoustic_sensor_id: 'MIC-PATEL-08',
        coordinates: { lat: 28.6520, lng: 77.1650 },
        sample_rate_hz: 44100,
        classifier: {
          model: 'CNN-Spectrogram-UrbanSound8K',
          predicted_class: 'siren',
          confidence: 0.942,
          secondary_class: 'screeching_brakes',
          secondary_confidence: 0.781,
          sound_pressure_db: 92.4
        }
      }
    },
    'sensor-events': {
      topic: 'sensor-events',
      partition: 2,
      offset: 5410982,
      timestamp: new Date().toISOString(),
      schema: 'org.citypulse.telemetry.TrafficSensorAvro',
      payload: {
        sensor_id: 'SENSOR-SEG-418',
        road_corridor: 'Ring Road (AIIMS to Moolchand)',
        readings: {
          observed_speed_kmh: 14.2,
          historical_baseline_speed_kmh: 48.0,
          speed_drop_percentage: 70.4,
          vehicle_density_per_km: 184,
          level_of_service: 'LOS_F_BREAKDOWN'
        }
      }
    },
    'accident-events': {
      topic: 'accident-events',
      partition: 1,
      offset: 2489120,
      timestamp: new Date().toISOString(),
      schema: 'org.citypulse.telemetry.USAccidentsReplayAvro',
      payload: {
        source_dataset: 'US-Accidents (7.7M record stream replay at 1,000 ev/s)',
        record_id: 'A-2489120',
        severity_ground_truth: 3,
        start_time: '2026-09-17 19:45:00',
        weather_condition: 'Rain',
        temperature_f: 79.5,
        visibility_mi: 1.3,
        traffic_signal_present: true,
        junction_present: false
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(topicPayloads[selectedTopic], null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col arch-panel rounded-none border border-[#c8c5b8] bg-[#fcfbf9] overflow-hidden">
      {/* Developer Header Banner */}
      <div className="p-4 border-b border-[#dad7cb] bg-[#f4f3ee] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="arch-header-badge">DEV</span>
            <h1 className="text-sm font-bold font-mono uppercase tracking-wider text-[#14171a]">
              BACKEND SYSTEM INTERNALS & STREAMING ARCHITECTURE
            </h1>
          </div>
          <p className="text-xs font-mono text-[#5c6370] mt-0.5">
            Decoupled real-time processing: Apache Kafka (Ingestion) ➔ Apache Spark Structured Streaming (30s Micro-batch) ➔ 4x ML Serving Layer ➔ Dijkstra Routing Graph
          </p>
        </div>

        {/* Global Cluster Stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-white border border-[#d2cfc3] px-2.5 py-1 rounded">
            <div className="text-[9px] text-[#666d7a] uppercase">KAFKA CLUSTER</div>
            <div className="text-xs font-bold text-[#15803d]">3 BROKERS (KRAFT)</div>
          </div>
          <div className="bg-white border border-[#d2cfc3] px-2.5 py-1 rounded">
            <div className="text-[9px] text-[#666d7a] uppercase">SPARK ENGINE</div>
            <div className="text-xs font-bold text-[#0284c7]">30s WINDOW / 18.4K RPS</div>
          </div>
          <div className="bg-white border border-[#d2cfc3] px-2.5 py-1 rounded">
            <div className="text-[9px] text-[#666d7a] uppercase">ML INFERENCE</div>
            <div className="text-xs font-bold text-[#8b5cf6]">14.2ms LATENCY</div>
          </div>
        </div>
      </div>

      {/* Internal Sub-Tabs */}
      <div className="px-4 py-2 border-b border-[#dad7cb] bg-[#e5e2d6] flex items-center gap-2 overflow-x-auto text-xs font-mono">
        {[
          { id: 'kafka', label: '1. KAFKA BROKER & TOPIC MATRIX' },
          { id: 'spark', label: '2. SPARK STRUCTURED STREAMING' },
          { id: 'ml', label: '3. 4x ML MODELS & EVALUATION' },
          { id: 'dijkstra', label: '4. DECISION ENGINE & OSM GRAPH' },
          { id: 'inspector', label: '5. LIVE KAFKA PAYLOAD INSPECTOR' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3 py-1 rounded font-bold transition-all ${
              activeSubTab === tab.id
                ? 'bg-[#14171a] text-white shadow-sm'
                : 'bg-[#f0eee6] text-[#5c6370] hover:text-[#14171a] border border-[#c8c5b8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main SubTab Content Area */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-4">
        {/* SUBTAB 1: KAFKA BROKER & TOPICS */}
        {activeSubTab === 'kafka' && (
          <div className="space-y-4">
            <div className="arch-panel p-3 border border-[#d6d3c7] bg-white rounded">
              <h3 className="text-xs font-bold uppercase text-[#14171a] mb-2 flex items-center gap-2">
                <RiDatabase2Fill className="text-[#0284c7]" size={15} />
                <span>Kafka Topic Partitioning & High-Throughput Matrix</span>
              </h3>
              <p className="text-[11px] text-[#5c6370] font-sans mb-3">
                All 6 heterogeneous sources push independently to isolated Kafka topics. No producer communicates directly with downstream consumers, ensuring zero pipeline bottlenecks and dynamic scale-out.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-[#e5e2d6] text-[11px]">
                  <thead>
                    <tr className="bg-[#f4f3ee] text-[#14171a] border-b border-[#e5e2d6]">
                      <th className="p-2 border-r border-[#e5e2d6]">Topic Name</th>
                      <th className="p-2 border-r border-[#e5e2d6]">Input Data Source</th>
                      <th className="p-2 border-r border-[#e5e2d6]">Partitions</th>
                      <th className="p-2 border-r border-[#e5e2d6]">Replication</th>
                      <th className="p-2 border-r border-[#e5e2d6]">Producer Rate</th>
                      <th className="p-2 border-r border-[#e5e2d6]">Consumer Lag</th>
                      <th className="p-2">Schema Format</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eceae0]">
                    <tr>
                      <td className="p-2 font-bold text-[#0284c7] border-r border-[#e5e2d6]">cctv-events</td>
                      <td className="p-2 border-r border-[#e5e2d6]">OpenCV + YOLO (Accidents/Smoke)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">3</td>
                      <td className="p-2 border-r border-[#e5e2d6]">3 (ISR: 3)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">1,240 frames/s</td>
                      <td className="p-2 text-[#15803d] font-bold border-r border-[#e5e2d6]">4 ms</td>
                      <td className="p-2">Avro (Binary)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#0284c7] border-r border-[#e5e2d6]">gps-events</td>
                      <td className="p-2 border-r border-[#e5e2d6]">5 Ambulances (OSM Roads)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">2</td>
                      <td className="p-2 border-r border-[#e5e2d6]">3 (ISR: 3)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">2.5 msgs/s</td>
                      <td className="p-2 text-[#15803d] font-bold border-r border-[#e5e2d6]">1 ms</td>
                      <td className="p-2">JSON / Avro</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#0284c7] border-r border-[#e5e2d6]">weather-events</td>
                      <td className="p-2 border-r border-[#e5e2d6]">OpenWeatherMap API (Live)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">1</td>
                      <td className="p-2 border-r border-[#e5e2d6]">3 (ISR: 3)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">0.1 msgs/s (10m poll)</td>
                      <td className="p-2 text-[#15803d] font-bold border-r border-[#e5e2d6]">0 ms</td>
                      <td className="p-2">JSON</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#0284c7] border-r border-[#e5e2d6]">audio-events</td>
                      <td className="p-2 border-r border-[#e5e2d6]">UrbanSound8K Audio Classifier</td>
                      <td className="p-2 border-r border-[#e5e2d6]">2</td>
                      <td className="p-2 border-r border-[#e5e2d6]">3 (ISR: 3)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">12 msgs/s</td>
                      <td className="p-2 text-[#15803d] font-bold border-r border-[#e5e2d6]">8 ms</td>
                      <td className="p-2">Avro</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#0284c7] border-r border-[#e5e2d6]">sensor-events</td>
                      <td className="p-2 border-r border-[#e5e2d6]">NYC Open Data / Routes API Speeds</td>
                      <td className="p-2 border-r border-[#e5e2d6]">4</td>
                      <td className="p-2 border-r border-[#e5e2d6]">3 (ISR: 3)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">428 sensors (2m poll)</td>
                      <td className="p-2 text-[#15803d] font-bold border-r border-[#e5e2d6]">12 ms</td>
                      <td className="p-2">Avro</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#0284c7] border-r border-[#e5e2d6]">accident-events</td>
                      <td className="p-2 border-r border-[#e5e2d6]">US Accidents (7.7M Record Stream)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">6</td>
                      <td className="p-2 border-r border-[#e5e2d6]">3 (ISR: 3)</td>
                      <td className="p-2 border-r border-[#e5e2d6]">1,000 records/s</td>
                      <td className="p-2 text-[#15803d] font-bold border-r border-[#e5e2d6]">15 ms</td>
                      <td className="p-2">Snappy Parquet/JSON</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consumer Group Telemetry */}
            <div className="arch-panel p-3 border border-[#d6d3c7] bg-white rounded">
              <h4 className="text-xs font-bold text-[#14171a] mb-2 uppercase">
                Active Consumer Group: <span className="text-[#0284c7]">citypulse-spark-streaming</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded bg-[#f4f3ee] border border-[#e5e2d6]">
                  <span className="text-[#5c6370]">State:</span>
                  <div className="font-bold text-[#15803d]">STABLE</div>
                </div>
                <div className="p-2 rounded bg-[#f4f3ee] border border-[#e5e2d6]">
                  <span className="text-[#5c6370]">Coordinator:</span>
                  <div className="font-bold text-[#14171a]">Broker #2 (Node ID: 102)</div>
                </div>
                <div className="p-2 rounded bg-[#f4f3ee] border border-[#e5e2d6]">
                  <span className="text-[#5c6370]">Assigned Partitions:</span>
                  <div className="font-bold text-[#14171a]">18 / 18</div>
                </div>
                <div className="p-2 rounded bg-[#f4f3ee] border border-[#e5e2d6]">
                  <span className="text-[#5c6370]">Total Ingest Velocity:</span>
                  <div className="font-bold text-[#14171a]">2.48M+ Events</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SPARK STRUCTURED STREAMING */}
        {activeSubTab === 'spark' && (
          <div className="space-y-4">
            <div className="arch-panel p-3 border border-[#d6d3c7] bg-white rounded">
              <h3 className="text-xs font-bold uppercase text-[#14171a] mb-2 flex items-center gap-2">
                <RiCpuFill className="text-[#15803d]" size={15} />
                <span>Apache Spark Structured Streaming 30-Second Micro-Batch Pipeline</span>
              </h3>
              <p className="text-[11px] text-[#5c6370] font-sans mb-3">
                Apache Spark reads simultaneously from all 6 Kafka topics. In each 30-second micro-batch, heterogeneous timestamps and spatial coordinates are aligned into an integrated feature vector.
              </p>

              {/* Step by step timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-2.5 rounded bg-[#fcfbf9] border border-[#d6d3c7]">
                  <div className="text-[10px] font-bold text-[#0284c7] mb-1">STAGE 1: INGESTION & WATERMARKING</div>
                  <p className="text-[11px] font-sans text-[#5c6370] leading-relaxed">
                    Reads raw byte payloads from Kafka with a 1-minute watermark to handle late-arriving mobile GPS packets without data loss.
                  </p>
                  <code className="block mt-2 p-1.5 bg-[#f4f3ee] text-[9px] rounded text-[#333]">
                    .withWatermark("event_time", "1 minute")
                  </code>
                </div>

                <div className="p-2.5 rounded bg-[#fcfbf9] border border-[#d6d3c7]">
                  <div className="text-[10px] font-bold text-[#15803d] mb-1">STAGE 2: SPATIAL & TEMPORAL JOIN</div>
                  <p className="text-[11px] font-sans text-[#5c6370] leading-relaxed">
                    Matches weather precipitation and road speed readings to the exact 500m geohash radius where CCTV or citizens reported an anomaly.
                  </p>
                  <code className="block mt-2 p-1.5 bg-[#f4f3ee] text-[9px] rounded text-[#333]">
                    join(weatherDF, expr("st_distance(geo, w_geo) &lt; 500"))
                  </code>
                </div>

                <div className="p-2.5 rounded bg-[#fcfbf9] border border-[#d6d3c7]">
                  <div className="text-[10px] font-bold text-[#8b5cf6] mb-1">STAGE 3: VECTOR ASSEMBLY & SINK</div>
                  <p className="text-[11px] font-sans text-[#5c6370] leading-relaxed">
                    Assembles feature vector (hour, rain, speed_drop, vehicle_count, siren_flag) and triggers parallel inference on the 4 ML models.
                  </p>
                  <code className="block mt-2 p-1.5 bg-[#f4f3ee] text-[9px] rounded text-[#333]">
                    VectorAssembler(inputCols=[...], outputCol="features")
                  </code>
                </div>
              </div>

              {/* Spark Execution Metrics */}
              <div className="mt-4 pt-3 border-t border-[#eceae0] flex flex-wrap items-center justify-between gap-3 text-[11px]">
                <span>Batch Processing Duration: <strong className="text-[#14171a]">1.42 seconds</strong></span>
                <span>Active Micro-Batch Interval: <strong className="text-[#15803d]">30.0 seconds (Configurable to 5s)</strong></span>
                <span>Worker Heap Memory: <strong className="text-[#14171a]">4.2 GB / 16 GB</strong></span>
                <span>Output Rate: <strong className="text-[#0284c7]">18,400 records/sec</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: 4x ML MODELS */}
        {activeSubTab === 'ml' && (
          <div className="space-y-4">
            <div className="arch-panel p-3 border border-[#d6d3c7] bg-white rounded">
              <h3 className="text-xs font-bold uppercase text-[#14171a] mb-2 flex items-center gap-2">
                <RiBrainFill className="text-[#8b5cf6]" size={15} />
                <span>Four Simultaneous Machine Learning Models Making Autonomous Decisions</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Model 1 */}
                <div className="p-3 rounded bg-[#fcfbf9] border border-[#d6d3c7]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#14171a] text-xs">Model 1: Random Forest (Incident Detection)</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0284c7] text-white font-bold">BINARY</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#5c6370] mb-2">
                    Trained on 7.7 million US-Accidents records. Filters out sensor jitter and false alarms. Answers: "Is this a real incident or background city noise?"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#333740] bg-[#f4f3ee] p-1.5 rounded">
                    <span>Accuracy: <strong>94.2%</strong></span>
                    <span>ROC-AUC: <strong>0.961</strong></span>
                    <span>Latency: <strong>11ms</strong></span>
                  </div>
                </div>

                {/* Model 2 */}
                <div className="p-3 rounded bg-[#fcfbf9] border border-[#d6d3c7]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#14171a] text-xs">Model 2: XGBoost (Severity Classification)</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#c92a2a] text-white font-bold">4-CLASS</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#5c6370] mb-2">
                    Inputs: Rain, visibility, road speed drop, time of day, CCTV vehicle count. Classifies severity into Low, Moderate, High, or Critical.
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#333740] bg-[#f4f3ee] p-1.5 rounded">
                    <span>Accuracy: <strong>88.4%</strong></span>
                    <span>F1-Score: <strong>0.871</strong></span>
                    <span>Latency: <strong>14ms</strong></span>
                  </div>
                </div>

                {/* Model 3 */}
                <div className="p-3 rounded bg-[#fcfbf9] border border-[#d6d3c7]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#14171a] text-xs">Model 3: LSTM Congestion Predictor</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#15803d] text-white font-bold">TIME-SERIES</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#5c6370] mb-2">
                    Ingests last 5 minutes of road speed sequence; forecasts next 15 minutes of traffic velocity. Enables proactive diversion before gridlock forms.
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#333740] bg-[#f4f3ee] p-1.5 rounded">
                    <span>Lookback: <strong>5 min</strong></span>
                    <span>Horizon: <strong>15 min</strong></span>
                    <span>MSE: <strong>0.038</strong></span>
                  </div>
                </div>

                {/* Model 4 */}
                <div className="p-3 rounded bg-[#fcfbf9] border border-[#d6d3c7]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#14171a] text-xs">Model 4: NLP Text / Report Analysis</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#f59e0b] text-white font-bold">TF-IDF</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#5c6370] mb-2">
                    TF-IDF + Logistic Regression analyzing incoming citizen mobile reports, 112 dispatch transcripts, and audio speech-to-text keywords.
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#333740] bg-[#f4f3ee] p-1.5 rounded">
                    <span>Precision: <strong>91.8%</strong></span>
                    <span>Recall: <strong>90.4%</strong></span>
                    <span>Latency: <strong>8ms</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: DECISION ENGINE & DIJKSTRA */}
        {activeSubTab === 'dijkstra' && (
          <div className="space-y-4">
            <div className="arch-panel p-3 border border-[#d6d3c7] bg-white rounded">
              <h3 className="text-xs font-bold uppercase text-[#14171a] mb-2 flex items-center gap-2">
                <RiRouteFill className="text-[#0284c7]" size={15} />
                <span>Decision Engine: Dijkstra Shortest Path with Dynamic LSTM Congestion Penalties</span>
              </h3>
              <p className="text-[11px] text-[#5c6370] font-sans mb-3">
                CityPulse AI operates on a real OpenStreetMap road network graph of Delhi generated using OSMnx and NetworkX. Unlike traditional Google Maps routing which only knows current congestion, CityPulse routes around roads that are predicted to become jammed 15 minutes in advance.
              </p>

              <div className="p-3 bg-[#f4f3ee] border border-[#e5e2d6] rounded font-mono text-[11px] text-[#14171a] space-y-2">
                <div className="font-bold text-[#0284c7]">Dynamic Edge Cost Mathematical Formulation:</div>
                <div className="p-2 bg-white rounded border border-[#d2cfc3] text-xs font-bold">
                  Weight(edge_i) = [ Length(edge_i) / Predicted_Speed_LSTM(edge_i) ] × RainFrictionFactor × IncidentBlockFactor
                </div>
                <ul className="list-disc list-inside text-[#5c6370] font-sans text-[11px] space-y-1">
                  <li><strong>OpenStreetMap Graph:</strong> 48,210 nodes (intersections), 112,490 directed edges (road segments).</li>
                  <li><strong>Ambulance Selection:</strong> Evaluates all 5 live vehicles simultaneously in &lt; 3.0 seconds and picks minimum travel time.</li>
                  <li><strong>Civilian Diversion:</strong> Runs Yen's K-Shortest-Paths (K=3) to generate alternate detours and sends diversion signals to navigation apps.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: LIVE KAFKA PAYLOAD INSPECTOR */}
        {activeSubTab === 'inspector' && (
          <div className="space-y-3">
            <div className="arch-panel p-3 border border-[#d6d3c7] bg-white rounded">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <RiTerminalBoxFill className="text-[#14171a]" size={16} />
                  <span className="text-xs font-bold uppercase text-[#14171a]">Live Kafka Event Payload Inspector</span>
                </div>

                {/* Topic Selector */}
                <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono">
                  {Object.keys(topicPayloads).map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-2 py-0.5 rounded border transition-all ${
                        selectedTopic === topic
                          ? 'bg-[#14171a] text-white border-[#14171a]'
                          : 'bg-[#f7f6f2] text-[#5c6370] border-[#d2cfc3] hover:bg-[#eae8df]'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* JSON Code Viewer */}
              <div className="relative rounded bg-[#14171a] text-[#e2e8f0] p-3 font-mono text-[11px] overflow-x-auto border border-[#333842]">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#333842] text-[#8e94a0] text-[10px]">
                  <span>TOPIC: <strong className="text-cyan-400">{selectedTopic}</strong> | PARTITION: {topicPayloads[selectedTopic].partition} | OFFSET: {topicPayloads[selectedTopic].offset}</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] text-white bg-[#333842] hover:bg-[#444b58] px-2 py-0.5 rounded transition-all"
                  >
                    {copied ? <RiCheckLine className="text-emerald-400" /> : <RiFileCopyLine />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre className="text-emerald-300">
                  {JSON.stringify(topicPayloads[selectedTopic], null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendPipelineInternals;
