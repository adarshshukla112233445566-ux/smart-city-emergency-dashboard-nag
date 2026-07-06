import { motion } from 'motion/react';
import { MapPin, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmergencyMap } from '../components/EmergencyMap';

export function MapPage() {
  const { alerts } = useApp();
  const activeAlerts = alerts.filter(a => a.status === 'Active');

  // Calculate current severity
  const calculateSeverity = (): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    if (activeAlerts.some(a => a.severity === 'CRITICAL')) return 'CRITICAL';
    if (activeAlerts.some(a => a.severity === 'HIGH')) return 'HIGH';
    if (activeAlerts.some(a => a.severity === 'MEDIUM')) return 'MEDIUM';
    return 'LOW';
  };

  const currentSeverity = calculateSeverity();

  const severityConfig = {
    CRITICAL: { color: 'text-[#ff2e2e]', bg: 'bg-[#ff2e2e]/20', border: 'border-[#ff2e2e]/30' },
    HIGH: { color: 'text-[#ff4444]', bg: 'bg-[#ff4444]/20', border: 'border-[#ff4444]/30' },
    MEDIUM: { color: 'text-[#ff7a00]', bg: 'bg-[#ff7a00]/20', border: 'border-[#ff7a00]/30' },
    LOW: { color: 'text-[#22c55e]', bg: 'bg-[#22c55e]/20', border: 'border-[#22c55e]/30' }
  };

  const config = severityConfig[currentSeverity];

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#ff2e2e]/10 border border-[#ff2e2e]/30 rounded-xl">
              <MapPin className="w-6 h-6 text-[#ff2e2e]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#e2e8f0] mb-1">Tactical Smart Map</h1>
              <p className="text-sm text-[#94a3b8]">
                Burdi (Sitabuldi) → Butibori MIDC Industrial Area Coverage
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl ${config.bg} border ${config.border}`}>
              <div className="text-xs text-[#94a3b8] mb-1">Threat Level</div>
              <div className={`text-xl font-bold ${config.color}`}>{currentSeverity}</div>
            </div>
            <div className="px-4 py-2 bg-[#0f172a]/50 border border-[#334155] rounded-xl">
              <div className="text-xs text-[#94a3b8] mb-1">Active Incidents</div>
              <div className="text-xl font-bold text-[#ff2e2e]">{activeAlerts.length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Screen Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl overflow-hidden"
      >
        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button className="bg-[#0f172a]/90 backdrop-blur-xl border border-[#ff2e2e]/30 rounded-xl p-3 text-[#e2e8f0] hover:bg-[#1e293b] transition-all active:scale-95">
            <Maximize2 className="w-5 h-5" />
          </button>
          <button className="bg-[#0f172a]/90 backdrop-blur-xl border border-[#ff2e2e]/30 rounded-xl p-3 text-[#e2e8f0] hover:bg-[#1e293b] transition-all active:scale-95">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button className="bg-[#0f172a]/90 backdrop-blur-xl border border-[#ff2e2e]/30 rounded-xl p-3 text-[#e2e8f0] hover:bg-[#1e293b] transition-all active:scale-95">
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-[#0f172a]/90 backdrop-blur-xl border border-[#334155] rounded-xl p-4">
          <h3 className="text-sm font-bold text-[#e2e8f0] mb-3">Map Legend</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff2e2e] rounded-full animate-pulse" />
              <span className="text-[#94a3b8]">Critical Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff4444] rounded-full" />
              <span className="text-[#94a3b8]">High Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff7a00] rounded-full" />
              <span className="text-[#94a3b8]">Medium Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ffc107] rounded-full" />
              <span className="text-[#94a3b8]">Low Alert</span>
            </div>
            <div className="border-t border-[#334155] my-2" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span className="text-[#94a3b8]">Emergency Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-[#22c55e]" />
              <span className="text-[#94a3b8]">Traffic Flow</span>
            </div>
          </div>
        </div>

        {/* Main Map */}
        <div className="h-[calc(100vh-250px)] min-h-[600px]">
          <EmergencyMap activeAlerts={activeAlerts} severity={currentSeverity} />
        </div>
      </motion.div>

      {/* Map Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-xl p-4">
          <div className="text-xs text-[#94a3b8] mb-1">Total Coverage Area</div>
          <div className="text-2xl font-bold text-[#e2e8f0]">~35 km</div>
          <div className="text-xs text-[#64748b] mt-1">Burdi to Butibori</div>
        </div>
        <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-xl p-4">
          <div className="text-xs text-[#94a3b8] mb-1">Monitored Landmarks</div>
          <div className="text-2xl font-bold text-[#e2e8f0]">12</div>
          <div className="text-xs text-[#64748b] mt-1">Key locations tracked</div>
        </div>
        <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-xl p-4">
          <div className="text-xs text-[#94a3b8] mb-1">Emergency Zones</div>
          <div className="text-2xl font-bold text-[#e2e8f0]">3</div>
          <div className="text-xs text-[#64748b] mt-1">Active heat zones</div>
        </div>
        <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-xl p-4">
          <div className="text-xs text-[#94a3b8] mb-1">Traffic Flow Status</div>
          <div className="text-2xl font-bold text-[#22c55e]">Normal</div>
          <div className="text-xs text-[#64748b] mt-1">Real-time analysis</div>
        </div>
      </motion.div>
    </div>
  );
}
