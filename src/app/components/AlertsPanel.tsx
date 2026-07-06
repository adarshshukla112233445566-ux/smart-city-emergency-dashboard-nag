import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, AlertTriangle, CheckCircle, X, Trash2 } from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  location: string;
  time: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'Active' | 'Resolved';
  timestamp: number;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onResolve: (id: string) => void;
  onClearAll: () => void;
}

export function AlertsPanel({ alerts, onResolve, onClearAll }: AlertsPanelProps) {
  const activeAlerts = alerts.filter(a => a.status === 'Active');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#ff2e2e]/20 border-[#ff2e2e] text-[#ff2e2e]';
      case 'HIGH':
        return 'bg-[#ff2e2e]/20 border-[#ff2e2e] text-[#ff2e2e]';
      case 'MEDIUM':
        return 'bg-[#ff7a00]/20 border-[#ff7a00] text-[#ff7a00]';
      case 'LOW':
        return 'bg-[#ffc107]/20 border-[#ffc107] text-[#ffc107]';
      default:
        return 'bg-[#94a3b8]/20 border-[#94a3b8] text-[#94a3b8]';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#334155]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#e2e8f0] flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ff2e2e] rounded-full animate-pulse" />
            Active Alerts
          </h3>
          <div className="text-xl font-bold text-[#ff2e2e]">
            {activeAlerts.length}
          </div>
        </div>
        {activeAlerts.length > 0 && (
          <button
            onClick={onClearAll}
            className="w-full bg-[#ff2e2e]/10 hover:bg-[#ff2e2e]/20 border border-[#ff2e2e]/30 text-[#ff2e2e] py-2 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Alerts
          </button>
        )}
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {activeAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <CheckCircle className="w-16 h-16 text-[#22c55e] mb-4" />
              <p className="text-[#94a3b8] text-lg font-semibold">All Clear</p>
              <p className="text-[#64748b] text-sm mt-2">No active alerts at this moment</p>
            </motion.div>
          ) : (
            activeAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative bg-gradient-to-br from-[#0f172a]/50 to-[#1e293b]/50 backdrop-blur-sm border ${
                  alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                    ? 'border-[#ff2e2e] shadow-lg shadow-[#ff2e2e]/20'
                    : 'border-[#334155]'
                } rounded-xl p-4 overflow-hidden group hover:scale-[1.02] transition-transform`}
              >
                {/* Glow effect for high severity */}
                {(alert.severity === 'HIGH' || alert.severity === 'CRITICAL') && (
                  <div className="absolute inset-0 bg-[#ff2e2e]/5 animate-pulse" />
                )}

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`w-4 h-4 ${
                          alert.severity === 'CRITICAL' || alert.severity === 'HIGH'
                            ? 'text-[#ff2e2e] animate-pulse'
                            : alert.severity === 'MEDIUM'
                            ? 'text-[#ff7a00]'
                            : 'text-[#ffc107]'
                        }`} />
                        <h4 className="text-[#e2e8f0] font-semibold text-sm">
                          {alert.type}
                        </h4>
                      </div>
                      <div className={`inline-block px-2 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </div>
                    </div>
                    <button
                      onClick={() => onResolve(alert.id)}
                      className="text-[#94a3b8] hover:text-[#22c55e] transition-colors"
                      title="Mark as resolved"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#94a3b8] mt-0.5 flex-shrink-0" />
                    <span className="text-[#94a3b8] text-sm">
                      {alert.location}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#94a3b8]" />
                    <span className="text-[#64748b] text-xs">
                      {alert.time}
                    </span>
                  </div>
                </div>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 46, 46, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 46, 46, 0.5);
        }
      `}</style>
    </div>
  );
}
