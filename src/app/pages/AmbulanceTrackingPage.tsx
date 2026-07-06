import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ambulance, MapPin, Clock, Navigation2, Activity, Phone, User, Filter, X, Maximize2, Minimize2 } from 'lucide-react';
import L from 'leaflet';

interface AmbulanceData {
  id: string;
  position: [number, number];
  driver: string;
  vehicleId: string;
  status: 'available' | 'dispatched' | 'busy';
  speed: number;
  patientName?: string;
  destination?: string;
  contact: string;
  lastUpdate: Date;
}

interface EmergencyLocation {
  id: string;
  position: [number, number];
  name: string;
  severity: 'critical' | 'high' | 'medium';
  assignedAmbulance?: string;
}

export function AmbulanceTrackingPage() {
  const [ambulances, setAmbulances] = useState<AmbulanceData[]>([
    { 
      id: 'AMB001', 
      position: [21.1520, 79.0850], 
      driver: 'Rajesh Kumar', 
      vehicleId: 'MH-31-AB-1234', 
      status: 'available', 
      speed: 0,
      contact: '+91 98765 43210',
      lastUpdate: new Date()
    },
    { 
      id: 'AMB002', 
      position: [21.1380, 79.0920], 
      driver: 'Priya Sharma', 
      vehicleId: 'MH-31-CD-5678', 
      status: 'dispatched', 
      speed: 52,
      patientName: 'Anil Deshmukh',
      destination: 'AIIMS Nagpur',
      contact: '+91 98765 43211',
      lastUpdate: new Date()
    },
    { 
      id: 'AMB003', 
      position: [21.1600, 79.0780], 
      driver: 'Amit Deshmukh', 
      vehicleId: 'MH-31-EF-9012', 
      status: 'available', 
      speed: 0,
      contact: '+91 98765 43212',
      lastUpdate: new Date()
    },
    { 
      id: 'AMB004', 
      position: [21.1200, 79.0950], 
      driver: 'Sneha Patel', 
      vehicleId: 'MH-31-GH-3456', 
      status: 'dispatched', 
      speed: 48,
      patientName: 'Kavita Singh',
      destination: 'Mayo Hospital',
      contact: '+91 98765 43213',
      lastUpdate: new Date()
    },
    { 
      id: 'AMB005', 
      position: [21.1700, 79.0900], 
      driver: 'Vikram Singh', 
      vehicleId: 'MH-31-IJ-7890', 
      status: 'busy', 
      speed: 55,
      patientName: 'Rahul Verma',
      destination: 'Government Medical College',
      contact: '+91 98765 43214',
      lastUpdate: new Date()
    },
    { 
      id: 'AMB006', 
      position: [21.1450, 79.0830], 
      driver: 'Meera Joshi', 
      vehicleId: 'MH-31-KL-2345', 
      status: 'available', 
      speed: 0,
      contact: '+91 98765 43215',
      lastUpdate: new Date()
    },
    { 
      id: 'AMB007', 
      position: [21.1680, 79.0820], 
      driver: 'Suresh Rao', 
      vehicleId: 'MH-31-MN-6789', 
      status: 'dispatched', 
      speed: 45,
      patientName: 'Lakshmi Naidu',
      destination: 'Wockhardt Hospital',
      contact: '+91 98765 43216',
      lastUpdate: new Date()
    },
    { 
      id: 'AMB008', 
      position: [21.1280, 79.0880], 
      driver: 'Pooja Gupta', 
      vehicleId: 'MH-31-OP-3456', 
      status: 'available', 
      speed: 0,
      contact: '+91 98765 43217',
      lastUpdate: new Date()
    }
  ]);

  const [emergencyLocations] = useState<EmergencyLocation[]>([
    { id: 'EM001', position: [21.1350, 79.0930], name: 'Sitabuldi Traffic Circle', severity: 'critical', assignedAmbulance: 'AMB002' },
    { id: 'EM002', position: [21.1180, 79.0960], name: 'Butibori MIDC Gate', severity: 'high', assignedAmbulance: 'AMB004' },
    { id: 'EM003', position: [21.1720, 79.0890], name: 'Seminary Hills Junction', severity: 'medium', assignedAmbulance: 'AMB007' }
  ]);

  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceData | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'dispatched' | 'busy'>('all');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const ambulanceMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const emergencyMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLinesRef = useRef<Map<string, L.Polyline>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current).setView([21.1458, 79.0882], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
      ambulanceMarkersRef.current.clear();
      emergencyMarkersRef.current.clear();
      routeLinesRef.current.clear();
    };
  }, []);

  // Update ambulance markers
  useEffect(() => {
    if (!leafletMapRef.current) return;

    const filteredAmbulances = filterStatus === 'all' 
      ? ambulances 
      : ambulances.filter(a => a.status === filterStatus);

    // Remove markers that are no longer needed
    ambulanceMarkersRef.current.forEach((marker, id) => {
      if (!filteredAmbulances.find(a => a.id === id)) {
        marker.remove();
        ambulanceMarkersRef.current.delete(id);
      }
    });

    // Add or update ambulance markers
    filteredAmbulances.forEach((ambulance) => {
      const color = ambulance.status === 'available' ? '#22c55e' : 
                    ambulance.status === 'dispatched' ? '#ff7a00' : '#ef4444';
      
      const pulseAnimation = ambulance.speed > 0 ? 'animation: pulse 2s infinite;' : '';

      const ambulanceIcon = L.divIcon({
        className: 'custom-ambulance-marker',
        html: `
          <div style="position: relative; cursor: pointer;">
            <div style="width: 40px; height: 40px; background: ${color}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ${color}80; ${pulseAnimation}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                <path d="M3 11h1v2H3zM5 11h1v2H5zM7 11h1v2H7z"/>
                <rect x="10" y="6" width="10" height="8" rx="1"/>
                <rect x="4" y="10" width="12" height="6" rx="1"/>
                <circle cx="7" cy="18" r="2"/>
                <circle cx="16" cy="18" r="2"/>
              </svg>
            </div>
            ${ambulance.speed > 0 ? `
              <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap; font-weight: bold;">
                ${ambulance.speed} km/h
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      let marker = ambulanceMarkersRef.current.get(ambulance.id);
      
      if (marker) {
        marker.setLatLng(ambulance.position);
        marker.setIcon(ambulanceIcon);
      } else {
        marker = L.marker(ambulance.position, { icon: ambulanceIcon })
          .addTo(leafletMapRef.current!)
          .bindPopup(`
            <div style="min-width: 200px;">
              <strong style="color: #ff2e2e; font-size: 14px;">${ambulance.id}</strong><br/>
              <div style="margin-top: 8px; font-size: 12px;">
                <strong>Driver:</strong> ${ambulance.driver}<br/>
                <strong>Vehicle:</strong> ${ambulance.vehicleId}<br/>
                <strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${ambulance.status.toUpperCase()}</span><br/>
                ${ambulance.speed > 0 ? `<strong>Speed:</strong> ${ambulance.speed} km/h<br/>` : ''}
                ${ambulance.patientName ? `<strong>Patient:</strong> ${ambulance.patientName}<br/>` : ''}
                ${ambulance.destination ? `<strong>Destination:</strong> ${ambulance.destination}<br/>` : ''}
              </div>
            </div>
          `);

        marker.on('click', () => {
          setSelectedAmbulance(ambulance);
          setShowSidebar(true);
        });

        ambulanceMarkersRef.current.set(ambulance.id, marker);
      }
    });

    // Add emergency location markers
    emergencyLocations.forEach((emergency) => {
      if (!emergencyMarkersRef.current.has(emergency.id)) {
        const color = emergency.severity === 'critical' ? '#ef4444' :
                      emergency.severity === 'high' ? '#f59e0b' : '#fbbf24';

        const emergencyIcon = L.divIcon({
          className: 'custom-emergency-marker',
          html: `
            <div style="position: relative;">
              <div style="width: 30px; height: 30px; background: ${color}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ${color}80; animation: pulse 2s infinite;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker(emergency.position, { icon: emergencyIcon })
          .addTo(leafletMapRef.current!)
          .bindPopup(`
            <div style="min-width: 180px;">
              <strong style="color: ${color}; font-size: 14px;">${emergency.name}</strong><br/>
              <div style="margin-top: 8px; font-size: 12px;">
                <strong>Severity:</strong> <span style="color: ${color}; font-weight: bold;">${emergency.severity.toUpperCase()}</span><br/>
                ${emergency.assignedAmbulance ? `<strong>Ambulance:</strong> ${emergency.assignedAmbulance}` : '<em>Awaiting ambulance...</em>'}
              </div>
            </div>
          `);

        emergencyMarkersRef.current.set(emergency.id, marker);

        // Draw route line if ambulance is assigned
        if (emergency.assignedAmbulance) {
          const assignedAmb = ambulances.find(a => a.id === emergency.assignedAmbulance);
          if (assignedAmb) {
            const routeLine = L.polyline([assignedAmb.position, emergency.position], {
              color: '#ff2e2e',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 10'
            }).addTo(leafletMapRef.current!);

            routeLinesRef.current.set(emergency.id, routeLine);
          }
        }
      }
    });

    // Update route lines
    emergencyLocations.forEach((emergency) => {
      if (emergency.assignedAmbulance) {
        const assignedAmb = ambulances.find(a => a.id === emergency.assignedAmbulance);
        const routeLine = routeLinesRef.current.get(emergency.id);
        
        if (assignedAmb && routeLine) {
          routeLine.setLatLngs([assignedAmb.position, emergency.position]);
        }
      }
    });

  }, [ambulances, filterStatus]);

  // Animate ambulances (simulated movement)
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances(prev => prev.map(ambulance => {
        if (ambulance.status === 'dispatched' || ambulance.status === 'busy') {
          // Find assigned emergency location
          const assignedEmergency = emergencyLocations.find(e => e.assignedAmbulance === ambulance.id);
          
          if (assignedEmergency) {
            // Move towards emergency location
            const latDiff = (assignedEmergency.position[0] - ambulance.position[0]) * 0.03;
            const lngDiff = (assignedEmergency.position[1] - ambulance.position[1]) * 0.03;
            
            return {
              ...ambulance,
              position: [
                ambulance.position[0] + latDiff,
                ambulance.position[1] + lngDiff
              ] as [number, number],
              lastUpdate: new Date()
            };
          }
        }
        return ambulance;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredAmbulances = filterStatus === 'all' 
    ? ambulances 
    : ambulances.filter(a => a.status === filterStatus);

  const stats = {
    total: ambulances.length,
    available: ambulances.filter(a => a.status === 'available').length,
    dispatched: ambulances.filter(a => a.status === 'dispatched').length,
    busy: ambulances.filter(a => a.status === 'busy').length
  };

  return (
    <div className="relative h-[calc(100vh-120px)]">
      {/* Full Screen Map Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] to-[#0f172a] rounded-2xl overflow-hidden border border-[#ff2e2e]/30">
        <div ref={mapRef} className="w-full h-full" />

        {/* Top Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4 z-[1000] flex gap-4"
        >
          <div className="flex-1 bg-gradient-to-br from-[#1e293b]/95 to-[#0f172a]/95 backdrop-blur-xl border border-[#ff2e2e]/30 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#ff2e2e]/20 border border-[#ff2e2e]/40 rounded-lg">
                  <Ambulance className="w-6 h-6 text-[#ff2e2e]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#e2e8f0]">Live Ambulance Tracking</h2>
                  <p className="text-xs text-[#94a3b8]">Real-time GPS monitoring • Nagpur Emergency Network</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-center px-4 py-2 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg">
                  <div className="text-2xl font-bold text-[#22c55e]">{stats.available}</div>
                  <div className="text-xs text-[#94a3b8]">Available</div>
                </div>
                <div className="text-center px-4 py-2 bg-[#ff7a00]/10 border border-[#ff7a00]/30 rounded-lg">
                  <div className="text-2xl font-bold text-[#ff7a00]">{stats.dispatched}</div>
                  <div className="text-xs text-[#94a3b8]">Dispatched</div>
                </div>
                <div className="text-center px-4 py-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg">
                  <div className="text-2xl font-bold text-[#ef4444]">{stats.busy}</div>
                  <div className="text-xs text-[#94a3b8]">In Service</div>
                </div>
                <div className="text-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                  <div className="text-xs text-[#94a3b8]">Total Fleet</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 bg-[#1e293b] border border-[#334155] rounded-lg hover:bg-[#334155] transition-all"
                  title={showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
                >
                  {showSidebar ? <Minimize2 className="w-5 h-5 text-[#e2e8f0]" /> : <Maximize2 className="w-5 h-5 text-[#e2e8f0]" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute top-32 left-4 z-[1000] bg-gradient-to-br from-[#1e293b]/95 to-[#0f172a]/95 backdrop-blur-xl border border-[#334155] rounded-xl p-4 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[#94a3b8]" />
            <span className="text-sm font-bold text-[#e2e8f0]">Filter Status</span>
          </div>
          <div className="space-y-2">
            {(['all', 'available', 'dispatched', 'busy'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-[#ff2e2e] text-white shadow-lg'
                    : 'bg-[#0f172a]/50 text-[#94a3b8] border border-[#334155] hover:bg-[#1e293b]'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sidebar - Ambulance List */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-32 right-4 bottom-4 w-96 z-[1000] bg-gradient-to-br from-[#1e293b]/95 to-[#0f172a]/95 backdrop-blur-xl border border-[#334155] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-[#334155]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#e2e8f0]">
                    Active Ambulances ({filteredAmbulances.length})
                  </h3>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-1 hover:bg-[#334155] rounded transition-all"
                  >
                    <X className="w-5 h-5 text-[#94a3b8]" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredAmbulances.map((ambulance) => {
                  const color = ambulance.status === 'available' ? '#22c55e' : 
                                ambulance.status === 'dispatched' ? '#ff7a00' : '#ef4444';
                  
                  return (
                    <motion.div
                      key={ambulance.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        setSelectedAmbulance(ambulance);
                        const marker = ambulanceMarkersRef.current.get(ambulance.id);
                        if (marker && leafletMapRef.current) {
                          leafletMapRef.current.setView(ambulance.position, 14);
                          marker.openPopup();
                        }
                      }}
                      className={`p-4 bg-[#0f172a]/50 border rounded-xl cursor-pointer transition-all hover:bg-[#1e293b] ${
                        selectedAmbulance?.id === ambulance.id 
                          ? 'border-[#ff2e2e] shadow-lg shadow-[#ff2e2e]/20' 
                          : 'border-[#334155]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: `${color}20`, border: `2px solid ${color}` }}
                          >
                            <Ambulance className="w-5 h-5" style={{ color }} />
                          </div>
                          <div>
                            <div className="font-bold text-[#e2e8f0]">{ambulance.id}</div>
                            <div className="text-xs text-[#94a3b8]">{ambulance.vehicleId}</div>
                          </div>
                        </div>
                        <div 
                          className="px-2 py-1 rounded text-xs font-bold"
                          style={{ background: `${color}20`, color }}
                        >
                          {ambulance.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-[#94a3b8]">
                          <User className="w-4 h-4" />
                          <span>{ambulance.driver}</span>
                        </div>
                        
                        {ambulance.speed > 0 && (
                          <div className="flex items-center gap-2 text-[#94a3b8]">
                            <Activity className="w-4 h-4" />
                            <span>{ambulance.speed} km/h</span>
                          </div>
                        )}

                        {ambulance.patientName && (
                          <div className="flex items-center gap-2 text-[#94a3b8]">
                            <MapPin className="w-4 h-4" />
                            <span>{ambulance.patientName}</span>
                          </div>
                        )}

                        {ambulance.destination && (
                          <div className="flex items-center gap-2 text-[#94a3b8]">
                            <Navigation2 className="w-4 h-4" />
                            <span className="truncate">{ambulance.destination}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
                          <div className="flex items-center gap-2 text-xs text-[#64748b]">
                            <Clock className="w-3 h-3" />
                            <span>Updated {Math.floor((Date.now() - ambulance.lastUpdate.getTime()) / 1000)}s ago</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`tel:${ambulance.contact}`);
                            }}
                            className="p-1.5 bg-[#22c55e]/20 border border-[#22c55e]/40 rounded hover:bg-[#22c55e]/30 transition-all"
                            title="Call Driver"
                          >
                            <Phone className="w-3 h-3 text-[#22c55e]" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 left-4 z-[1000] bg-gradient-to-br from-[#1e293b]/95 to-[#0f172a]/95 backdrop-blur-xl border border-[#334155] rounded-xl p-4 shadow-2xl"
        >
          <div className="text-xs font-bold text-[#e2e8f0] mb-3">MAP LEGEND</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#22c55e] rounded-full border-2 border-white"></div>
              <span className="text-[#94a3b8]">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#ff7a00] rounded-full border-2 border-white"></div>
              <span className="text-[#94a3b8]">Dispatched</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#ef4444] rounded-full border-2 border-white"></div>
              <span className="text-[#94a3b8]">In Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#f59e0b] rounded-full border-2 border-white"></div>
              <span className="text-[#94a3b8]">Emergency Location</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
