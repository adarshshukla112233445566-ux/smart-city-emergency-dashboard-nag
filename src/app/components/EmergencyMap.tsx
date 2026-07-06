import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { motion } from 'motion/react';

interface Landmark {
  id: string;
  name: string;
  position: [number, number];
  type: 'landmark' | 'emergency' | 'transport' | 'industrial';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const landmarks: Landmark[] = [
  { id: '1', name: 'Burdi / Sitabuldi', position: [21.1457, 79.0882], type: 'landmark' },
  { id: '2', name: 'Maharajbagh Road', position: [21.1385, 79.0910], type: 'landmark' },
  { id: '3', name: 'Nagpur Railway Station', position: [21.1509, 79.0821], type: 'transport' },
  { id: '4', name: 'Cotton Market', position: [21.1498, 79.0765], type: 'landmark' },
  { id: '5', name: 'Chatrapati Square', position: [21.1419, 79.0889], type: 'landmark' },
  { id: '6', name: 'AIIMS Nagpur', position: [21.0926, 79.0455], type: 'emergency', severity: 'HIGH' },
  { id: '7', name: 'MIHAN SEZ', position: [21.0822, 79.0471], type: 'industrial' },
  { id: '8', name: 'Airport Metro Station', position: [21.0841, 79.0488], type: 'transport' },
  { id: '9', name: 'Dr. Babasaheb Ambedkar International Airport', position: [21.0892, 79.0472], type: 'transport' },
  { id: '10', name: 'Hingna T-Point', position: [21.1823, 79.1542], type: 'landmark' },
  { id: '11', name: 'Butibori MIDC Industrial Area', position: [21.2288, 79.2142], type: 'industrial' },
  { id: '12', name: 'Wardha Road - Central', position: [21.1350, 79.1200], type: 'emergency', severity: 'CRITICAL' },
];

const wardhRoadPath: [number, number][] = [
  [21.1419, 79.0889],
  [21.1350, 79.1200],
  [21.1250, 79.1550],
  [21.1823, 79.1542],
  [21.2288, 79.2142],
];

const createCustomIcon = (type: string, alertSeverity?: string) => {
  const colors: { [key: string]: string } = {
    landmark: '#3b82f6',
    emergency: '#ff2e2e',
    transport: '#22c55e',
    industrial: '#ff7a00',
  };

  const severityColors: { [key: string]: string } = {
    CRITICAL: '#ff2e2e',
    HIGH: '#ff2e2e',
    MEDIUM: '#ff7a00',
    LOW: '#ffc107',
  };

  const color = alertSeverity ? severityColors[alertSeverity] : colors[type] || '#3b82f6';
  const isPulsing = alertSeverity === 'HIGH' || alertSeverity === 'CRITICAL';

  const html = `
    <div style="position: relative; width: 30px; height: 30px;">
      ${isPulsing ? `
        <div style="
          position: absolute;
          width: 30px;
          height: 30px;
          background: ${color};
          border-radius: 50%;
          opacity: 0.4;
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
      ` : ''}
      <div style="
        position: relative;
        width: 20px;
        height: 20px;
        background: ${color};
        border: 3px solid #020617;
        border-radius: 50%;
        box-shadow: 0 0 15px ${color};
        margin: 5px;
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

interface EmergencyMapProps {
  activeAlerts: any[];
  severity: string;
}

export function EmergencyMap({ activeAlerts, severity }: EmergencyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circlesRef = useRef<L.Circle[]>([]);
  const overlayRef = useRef<L.Rectangle | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [21.1650, 79.1200],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    leafletMapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add Wardha Road corridor polylines
    L.polyline(wardhRoadPath, {
      color: '#ff2e2e',
      weight: 8,
      opacity: 0.3,
    }).addTo(map);

    L.polyline(wardhRoadPath, {
      color: '#22c55e',
      weight: 4,
      opacity: 0.6,
      dashArray: '10, 10',
    }).addTo(map);

    // Add landmark markers
    landmarks.forEach((landmark) => {
      const marker = L.marker(landmark.position, {
        icon: createCustomIcon(landmark.type, landmark.severity),
      }).addTo(map);

      let popupContent = `
        <div style="color: #e2e8f0; font-weight: 600; margin-bottom: 4px;">
          ${landmark.name}
        </div>
        <div style="color: #94a3b8; font-size: 11px; margin-bottom: 4px;">
          ${landmark.type.toUpperCase()}
        </div>
      `;

      if (landmark.severity) {
        const bgColor = 
          landmark.severity === 'CRITICAL' || landmark.severity === 'HIGH' ? '#ff2e2e' :
          landmark.severity === 'MEDIUM' ? '#ff7a00' : '#ffc107';
        const textColor = landmark.severity === 'LOW' ? '#020617' : 'white';
        
        popupContent += `
          <div style="display: inline-block; padding: 4px 8px; background: ${bgColor}; color: ${textColor}; border-radius: 4px; font-size: 11px; margin-top: 4px;">
            ${landmark.severity}
          </div>
        `;
      }

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update alert markers
  useEffect(() => {
    if (!leafletMapRef.current) return;

    const map = leafletMapRef.current;

    // Clear existing alert markers and circles
    markersRef.current.forEach((marker) => {
      if (marker.getPopup()?.getContent()?.toString().includes('🚨')) {
        map.removeLayer(marker);
      }
    });
    circlesRef.current.forEach((circle) => map.removeLayer(circle));
    circlesRef.current = [];

    // Add new alert markers
    activeAlerts.forEach((alert) => {
      // Add heatmap circle for high severity
      if (alert.severity === 'HIGH' || alert.severity === 'CRITICAL') {
        const circle = L.circle(alert.position, {
          radius: 1500,
          fillColor: '#ff2e2e',
          fillOpacity: 0.2,
          color: '#ff2e2e',
          weight: 2,
          opacity: 0.5,
        }).addTo(map);
        circlesRef.current.push(circle);
      }

      // Add marker
      const marker = L.marker(alert.position, {
        icon: createCustomIcon('emergency', alert.severity),
      }).addTo(map);

      const bgColor = 
        alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? '#ff2e2e' :
        alert.severity === 'MEDIUM' ? '#ff7a00' : '#ffc107';
      const textColor = alert.severity === 'LOW' ? '#020617' : 'white';

      const popupContent = `
        <div style="color: #e2e8f0; font-weight: 600; margin-bottom: 4px;">
          🚨 ${alert.type}
        </div>
        <div style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">
          ${alert.location}
        </div>
        <div style="display: inline-block; padding: 4px 8px; background: ${bgColor}; color: ${textColor}; border-radius: 4px; font-size: 11px; margin-bottom: 8px;">
          ${alert.severity}
        </div>
        <div style="color: #94a3b8; font-size: 11px;">
          ${alert.time}
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
  }, [activeAlerts]);

  // Handle critical severity overlay
  useEffect(() => {
    if (!leafletMapRef.current) return;

    const map = leafletMapRef.current;

    if (overlayRef.current) {
      map.removeLayer(overlayRef.current);
      overlayRef.current = null;
    }

    if (severity === 'CRITICAL') {
      overlayRef.current = L.rectangle(map.getBounds(), {
        color: '#ff2e2e',
        weight: 0,
        fillColor: '#ff2e2e',
        fillOpacity: 0.1,
      }).addTo(map);
    }
  }, [severity]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-full w-full overflow-hidden rounded-xl border border-[#334155] shadow-2xl"
    >
      {/* Overlay grid */}
      <div 
        className="absolute inset-0 z-[1000] pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(0deg, rgba(255,46,46,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,46,46,.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Map container */}
      <div ref={mapRef} className="h-full w-full" style={{ background: '#0a0e1a' }} />

      {/* Map legend */}
      <div className="absolute bottom-4 right-4 bg-[#0f172a]/90 backdrop-blur-xl border border-[#334155] rounded-xl p-4 z-[1000] text-sm">
        <div className="text-[#e2e8f0] font-semibold mb-2">Legend</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff2e2e] rounded-full animate-pulse"></div>
            <span className="text-[#94a3b8] text-xs">Emergency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#3b82f6] rounded-full"></div>
            <span className="text-[#94a3b8] text-xs">Landmark</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#22c55e] rounded-full"></div>
            <span className="text-[#94a3b8] text-xs">Transport</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff7a00] rounded-full"></div>
            <span className="text-[#94a3b8] text-xs">Industrial</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
