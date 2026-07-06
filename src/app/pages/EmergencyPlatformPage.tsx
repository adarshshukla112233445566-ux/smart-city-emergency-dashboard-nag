import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Ambulance, MapPin, Navigation as NavigationIcon, Clock, AlertCircle, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AmbulanceData {
  id: string;
  position: [number, number];
  driver: string;
  vehicleId: string;
  status: 'available' | 'dispatched' | 'busy';
  speed: number;
}

export function EmergencyPlatformPage() {
  const { alerts } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Emergency Support Assistant. I\'m here to help you during emergencies. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([21.1458, 79.0882]);
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceData | null>(null);
  const [requestedAmbulance, setRequestedAmbulance] = useState(false);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const ambulanceMarkersRef = useRef<L.Marker[]>([]);

  // Simulated ambulances in Nagpur
  const [ambulances, setAmbulances] = useState<AmbulanceData[]>([
    { id: 'AMB001', position: [21.1520, 79.0850], driver: 'Rajesh Kumar', vehicleId: 'MH-31-AB-1234', status: 'available', speed: 45 },
    { id: 'AMB002', position: [21.1380, 79.0920], driver: 'Priya Sharma', vehicleId: 'MH-31-CD-5678', status: 'available', speed: 52 },
    { id: 'AMB003', position: [21.1600, 79.0780], driver: 'Amit Deshmukh', vehicleId: 'MH-31-EF-9012', status: 'available', speed: 38 },
    { id: 'AMB004', position: [21.1200, 79.0950], driver: 'Sneha Patel', vehicleId: 'MH-31-GH-3456', status: 'available', speed: 48 },
    { id: 'AMB005', position: [21.1700, 79.0900], driver: 'Vikram Singh', vehicleId: 'MH-31-IJ-7890', status: 'busy', speed: 55 }
  ]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current).setView(userLocation, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add user location marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative;">
          <div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);"></div>
          <div style="position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; background: rgba(59, 130, 246, 0.3); border-radius: 50%; transform: translate(-50%, -50%); animation: pulse 2s infinite;"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    L.marker(userLocation, { icon: userIcon }).addTo(map)
      .bindPopup('<strong>Your Location</strong><br/>Current Position')
      .openPopup();

    // Add ambulance markers
    ambulances.forEach((ambulance) => {
      const ambulanceIcon = L.divIcon({
        className: 'custom-ambulance-marker',
        html: `
          <div style="position: relative; cursor: pointer;">
            <div style="width: 32px; height: 32px; background: ${ambulance.status === 'available' ? '#22c55e' : ambulance.status === 'dispatched' ? '#ff7a00' : '#64748b'}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(255, 46, 46, 0.5);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                <path d="M3 11h1v2H3zM5 11h1v2H5zM7 11h1v2H7z"/>
                <rect x="10" y="6" width="10" height="8" rx="1"/>
                <rect x="4" y="10" width="12" height="6" rx="1"/>
                <circle cx="7" cy="18" r="2"/>
                <circle cx="16" cy="18" r="2"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(ambulance.position, { icon: ambulanceIcon })
        .addTo(map)
        .bindPopup(`
          <strong>${ambulance.id}</strong><br/>
          Driver: ${ambulance.driver}<br/>
          Vehicle: ${ambulance.vehicleId}<br/>
          Status: <span style="color: ${ambulance.status === 'available' ? '#22c55e' : '#64748b'}">${ambulance.status.toUpperCase()}</span>
        `);

      marker.on('click', () => {
        if (ambulance.status === 'available') {
          setSelectedAmbulance(ambulance);
          calculateDistanceAndETA(ambulance.position);
        }
      });

      ambulanceMarkersRef.current.push(marker);
    });

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
      ambulanceMarkersRef.current = [];
    };
  }, []);

  // Animate ambulances
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances(prev => prev.map(ambulance => {
        if (ambulance.status === 'dispatched') {
          // Move towards user location
          const latDiff = (userLocation[0] - ambulance.position[0]) * 0.05;
          const lngDiff = (userLocation[1] - ambulance.position[1]) * 0.05;
          return {
            ...ambulance,
            position: [
              ambulance.position[0] + latDiff,
              ambulance.position[1] + lngDiff
            ] as [number, number]
          };
        }
        return ambulance;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [userLocation]);

  // Update ambulance markers on map
  useEffect(() => {
    ambulances.forEach((ambulance, index) => {
      if (ambulanceMarkersRef.current[index]) {
        ambulanceMarkersRef.current[index].setLatLng(ambulance.position);
      }
    });

    // Update distance and ETA for dispatched ambulance
    if (selectedAmbulance && requestedAmbulance) {
      const currentAmbulance = ambulances.find(a => a.id === selectedAmbulance.id);
      if (currentAmbulance) {
        calculateDistanceAndETA(currentAmbulance.position);
      }
    }
  }, [ambulances]);

  const calculateDistanceAndETA = (ambulancePos: [number, number]) => {
    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (userLocation[0] - ambulancePos[0]) * Math.PI / 180;
    const dLon = (userLocation[1] - ambulancePos[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(ambulancePos[0] * Math.PI / 180) * Math.cos(userLocation[0] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;

    setDistance(dist);
    // Calculate ETA (assuming average speed of 40 km/h in city)
    const estimatedTime = (dist / 40) * 60; // in minutes
    setEta(Math.ceil(estimatedTime));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('ambulance') || input.includes('emergency') || input.includes('help')) {
      return 'I can help you request an ambulance immediately. Click the "Request Ambulance" button below, and I\'ll dispatch the nearest available ambulance to your location. Is this a medical emergency?';
    }
    
    if (input.includes('accident') || input.includes('injury')) {
      return 'For an accident or injury:\n\n1. Stay calm and assess the situation\n2. Check if the person is breathing\n3. Do not move the injured person unless there\'s immediate danger\n4. Apply pressure to any bleeding wounds\n5. Keep the person warm\n\nI\'m dispatching an ambulance now. Help is on the way!';
    }
    
    if (input.includes('heart') || input.includes('chest pain')) {
      return 'For chest pain or heart-related symptoms:\n\n1. Have the person sit down and rest\n2. Loosen tight clothing\n3. If they have prescribed medication (like nitroglycerin), help them take it\n4. Do NOT give them food or water\n5. Monitor their breathing\n\nAn ambulance is being dispatched immediately!';
    }
    
    if (input.includes('breathing') || input.includes('asthma')) {
      return 'For breathing difficulties:\n\n1. Help them sit upright\n2. Loosen tight clothing around neck and chest\n3. If they have an inhaler, help them use it\n4. Keep them calm - anxiety makes breathing harder\n5. Open windows for fresh air\n\nEmergency services are on the way!';
    }

    if (input.includes('location') || input.includes('where')) {
      return 'I can see your current location on the map. You\'re in Nagpur. We have 4 ambulances available nearby. The closest one is approximately 2-3 km away and can reach you in 4-6 minutes.';
    }

    return 'I\'m here to help you with emergencies. I can:\n\n• Request an ambulance for you\n• Provide first aid guidance\n• Guide you through emergency procedures\n• Track the ambulance location in real-time\n\nWhat do you need assistance with?';
  };

  const handleRequestAmbulance = () => {
    // Find nearest available ambulance
    const availableAmbulances = ambulances.filter(a => a.status === 'available');
    if (availableAmbulances.length === 0) {
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: 'I apologize, but all ambulances are currently busy. I\'ve put you on the priority queue. An ambulance will be dispatched as soon as one becomes available.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      return;
    }

    // Calculate nearest ambulance
    let nearestAmbulance = availableAmbulances[0];
    let minDistance = Infinity;

    availableAmbulances.forEach(ambulance => {
      const dist = Math.sqrt(
        Math.pow(userLocation[0] - ambulance.position[0], 2) +
        Math.pow(userLocation[1] - ambulance.position[1], 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestAmbulance = ambulance;
      }
    });

    // Dispatch ambulance
    setAmbulances(prev => prev.map(a => 
      a.id === nearestAmbulance.id ? { ...a, status: 'dispatched' as const } : a
    ));
    setSelectedAmbulance(nearestAmbulance);
    setRequestedAmbulance(true);
    calculateDistanceAndETA(nearestAmbulance.position);

    // Add AI message
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: `✅ Ambulance dispatched!\n\n**${nearestAmbulance.id}** is on the way!\n\nDriver: ${nearestAmbulance.driver}\nVehicle: ${nearestAmbulance.vehicleId}\n\nYou can track the ambulance on the map in real-time. Stay calm, help is coming!`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);

    // Draw route on map
    if (leafletMapRef.current) {
      L.polyline([nearestAmbulance.position, userLocation], {
        color: '#ff2e2e',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(leafletMapRef.current);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#ff2e2e]/10 border border-[#ff2e2e]/30 rounded-xl">
            <Ambulance className="w-8 h-8 text-[#ff2e2e]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#e2e8f0] mb-1">Emergency Support Platform</h1>
            <p className="text-sm text-[#94a3b8]">AI-Powered Emergency Assistance & Real-Time Ambulance Tracking</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Panel - AI Chatbot */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl overflow-hidden flex flex-col"
          style={{ height: '600px' }}
        >
          <div className="p-4 border-b border-[#334155] bg-blue-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#e2e8f0]">AI Emergency Assistant</h3>
                <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                  <span>Online & Ready to Help</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-[#ff2e2e] to-[#ff4444] text-white'
                      : 'bg-[#0f172a]/50 border border-[#334155] text-[#e2e8f0]'
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-[#64748b]'}`}>
                    {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-[#0f172a]/50 border border-[#334155] rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-[#334155]">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your emergency..."
                className="flex-1 bg-[#0f172a]/50 border border-[#334155] rounded-xl px-4 py-3 text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Live Ambulance Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/30 rounded-2xl overflow-hidden flex flex-col"
          style={{ height: '600px' }}
        >
          <div className="p-4 border-b border-[#334155] bg-[#ff2e2e]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff2e2e] to-[#ff4444] rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#e2e8f0]">Live Ambulance Tracking</h3>
                  <div className="text-xs text-[#94a3b8]">
                    {ambulances.filter(a => a.status === 'available').length} ambulances available
                  </div>
                </div>
              </div>
              {selectedAmbulance && requestedAmbulance && (
                <div className="text-right">
                  <div className="text-xs text-[#94a3b8]">ETA</div>
                  <div className="text-xl font-bold text-[#ff2e2e]">{eta} min</div>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />
            
            {selectedAmbulance && (
              <div className="absolute top-4 left-4 right-4 bg-[#0f172a]/90 backdrop-blur-xl border border-[#334155] rounded-xl p-4 z-[1000]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-[#e2e8f0] mb-2">{selectedAmbulance.id}</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-[#94a3b8]">
                        <User className="w-4 h-4" />
                        <span>{selectedAmbulance.driver}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#94a3b8]">
                        <Ambulance className="w-4 h-4" />
                        <span>{selectedAmbulance.vehicleId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {distance && (
                      <div className="mb-2">
                        <div className="text-xs text-[#94a3b8]">Distance</div>
                        <div className="text-lg font-bold text-[#e2e8f0]">{distance.toFixed(1)} km</div>
                      </div>
                    )}
                    {eta && (
                      <div>
                        <div className="text-xs text-[#94a3b8]">ETA</div>
                        <div className="text-lg font-bold text-[#ff2e2e]">{eta} min</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Request Ambulance Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleRequestAmbulance}
        disabled={requestedAmbulance}
        className={`w-full py-6 rounded-2xl font-bold text-xl transition-all ${
          requestedAmbulance
            ? 'bg-[#64748b]/20 border border-[#64748b]/30 text-[#64748b] cursor-not-allowed'
            : 'bg-gradient-to-r from-[#ff2e2e] to-[#ff4444] text-white hover:from-[#ff4444] hover:to-[#ff2e2e] active:scale-[0.98] shadow-lg shadow-[#ff2e2e]/20'
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          {requestedAmbulance ? (
            <>
              <Clock className="w-8 h-8 animate-pulse" />
              <span>Ambulance En Route - Tracking Live</span>
            </>
          ) : (
            <>
              <Ambulance className="w-8 h-8" />
              <span>REQUEST AMBULANCE NOW</span>
            </>
          )}
        </div>
      </motion.button>
    </div>
  );
}