export const generateIncident = (id) => {
  const types = ['Accident', 'Congestion', 'Weather', 'Audio'];
  const severities = [1, 2, 3, 4]; // 1: Low, 4: Critical
  const type = types[Math.floor(Math.random() * types.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  
  // Delhi metropolitan coordinate space ~ 28.6139, 77.2090
  const lat = 28.6139 + (Math.random() - 0.5) * 0.08;
  const lng = 77.2090 + (Math.random() - 0.5) * 0.08;
  
  const descriptions = {
    'Accident': 'CCTV #104 YOLO inference: 2-vehicle collision detected (92% confidence). Smoke signature verified.',
    'Congestion': 'LSTM predicts average road speed dropping from 48 km/h to 14 km/h in next 15 mins.',
    'Weather': 'OpenWeatherMap API: Rainfall 18mm/hr, visibility reduced to 1.8km. Wet asphalt friction factor 0.38.',
    'Audio': 'UrbanSound8K classifier: Emergency siren & screech acoustic pattern flagged with 94.2% match.'
  };

  return {
    id: `INC-${id.toString().padStart(4, '0')}`,
    type,
    severity,
    lat,
    lng,
    description: descriptions[type],
    timestamp: new Date().toISOString(),
    status: 'Active'
  };
};

export const generateAmbulance = (id) => {
  // 5 ambulances distributed across Delhi OSM network
  const baseCoordinates = [
    { lat: 28.6250, lng: 77.2050, road: 'Connaught Outer Circle' },
    { lat: 28.5890, lng: 77.2210, road: 'Lodhi Road' },
    { lat: 28.6380, lng: 77.2280, road: 'Barakhamba Road' },
    { lat: 28.6010, lng: 77.1950, road: 'Ring Road South' },
    { lat: 28.6490, lng: 77.1820, road: 'Pusa Road' }
  ];

  const base = baseCoordinates[(id - 1) % baseCoordinates.length];
  
  return {
    id: `AMB-0${id}`,
    lat: base.lat + (Math.random() - 0.5) * 0.01,
    lng: base.lng + (Math.random() - 0.5) * 0.01,
    currentRoad: base.road,
    status: 'Patrolling', // 'Patrolling' or 'Dispatched'
    targetIncident: null,
    eta: '5 mins'
  };
};
