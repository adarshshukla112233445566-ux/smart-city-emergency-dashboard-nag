import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle, Clock, MapPin, Filter, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function IncidentsPage() {
  const { alerts, handleResolveAlert, handleClearAll } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity === 'all') return true;
    return alert.severity === filterSeverity;
  });

  const activeAlerts = filteredAlerts.filter(a => a.status === 'Active');
  const resolvedAlerts = filteredAlerts.filter(a => a.status === 'Resolved');

  const severityColors = {
    CRITICAL: { bg: 'bg-[#ff2e2e]/20', border: 'border-[#ff2e2e]/50', text: 'text-[#ff2e2e]' },
    HIGH: { bg: 'bg-[#ff4444]/20', border: 'border-[#ff4444]/50', text: 'text-[#ff4444]' },
    MEDIUM: { bg: 'bg-[#ff7a00]/20', border: 'border-[#ff7a00]/50', text: 'text-[#ff7a00]' },
    LOW: { bg: 'bg-[#ffc107]/20', border: 'border-[#ffc107]/50', text: 'text-[#ffc107]' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">Live Incidents Monitor</h1>
            <p className="text-[#94a3b8]">Active emergency alerts and incident history</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#ff2e2e]/10 border border-[#ff2e2e]/30 rounded-xl px-4 py-2">
              <div className="text-xs text-[#94a3b8] mb-1">Active</div>
              <div className="text-2xl font-bold text-[#ff2e2e]">{activeAlerts.length}</div>
            </div>
            <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl px-4 py-2">
              <div className="text-xs text-[#94a3b8] mb-1">Resolved</div>
              <div className="text-2xl font-bold text-[#22c55e]">{resolvedAlerts.length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-[#94a3b8]" />
            <span className="text-sm text-[#94a3b8]">Filter by Severity:</span>
            <div className="flex gap-2">
              {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => (
                <button
                  key={severity}
                  onClick={() => setFilterSeverity(severity)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filterSeverity === severity
                      ? 'bg-[#ff2e2e] text-white'
                      : 'bg-[#0f172a]/50 text-[#94a3b8] hover:bg-[#0f172a]'
                  }`}
                >
                  {severity === 'all' ? 'All' : severity}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f172a]/50 border border-[#334155] rounded-xl text-[#94a3b8] hover:border-[#ff2e2e]/30 hover:text-[#ff2e2e] transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Resolve All</span>
          </button>
        </div>
      </motion.div>

      {/* Active Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-[#334155]">
          <h2 className="text-xl font-bold text-[#e2e8f0] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#ff2e2e]" />
            Active Alerts
          </h2>
        </div>
        <div className="divide-y divide-[#334155] max-h-[500px] overflow-y-auto">
          {activeAlerts.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-[#22c55e] mx-auto mb-3 opacity-50" />
              <p className="text-[#94a3b8]">No active alerts</p>
            </div>
          ) : (
            activeAlerts.map((alert, index) => {
              const colors = severityColors[alert.severity];
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-[#0f172a]/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${colors.bg} ${colors.border} ${colors.text} border`}>
                          {alert.severity}
                        </span>
                        <span className="text-sm font-semibold text-[#e2e8f0]">{alert.type}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#94a3b8]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-4 py-2 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg text-[#22c55e] text-sm font-semibold hover:bg-[#22c55e]/20 transition-all active:scale-95"
                    >
                      Resolve
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Incident History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-[#334155]">
          <h2 className="text-xl font-bold text-[#e2e8f0] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#94a3b8]" />
            Incident History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f172a]/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredAlerts.slice(0, 20).map((alert) => {
                const colors = severityColors[alert.severity];
                return (
                  <tr key={alert.id} className="hover:bg-[#0f172a]/30 transition-all">
                    <td className="px-6 py-4 text-sm text-[#e2e8f0]">{alert.time}</td>
                    <td className="px-6 py-4 text-sm text-[#e2e8f0]">{alert.type}</td>
                    <td className="px-6 py-4 text-sm text-[#94a3b8]">{alert.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${colors.bg} ${colors.text}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {alert.status === 'Active' ? (
                        <span className="flex items-center gap-1 text-[#ff2e2e] text-sm">
                          <div className="w-2 h-2 bg-[#ff2e2e] rounded-full animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#22c55e] text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
