import { motion } from 'motion/react';
import { BarChart3, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChartsSection } from '../components/ChartsSection';

export function AnalyticsPage() {
  const { alerts } = useApp();

  const severityDistribution = [
    {
      name: 'Critical',
      value: alerts.filter(a => a.severity === 'CRITICAL').length,
      color: '#ff2e2e'
    },
    {
      name: 'High',
      value: alerts.filter(a => a.severity === 'HIGH').length,
      color: '#ff4444'
    },
    {
      name: 'Medium',
      value: alerts.filter(a => a.severity === 'MEDIUM').length,
      color: '#ff7a00'
    },
    {
      name: 'Low',
      value: alerts.filter(a => a.severity === 'LOW').length,
      color: '#ffc107'
    }
  ];

  const totalIncidents = alerts.length;
  const avgResponseTime = '2.4 min';
  const resolutionRate = Math.round((alerts.filter(a => a.status === 'Resolved').length / totalIncidents) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#e2e8f0] mb-1">Analytics & Reports</h1>
              <p className="text-sm text-[#94a3b8]">Comprehensive data analysis and insights</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff2e2e] to-[#ff4444] text-white font-semibold rounded-xl hover:from-[#ff4444] hover:to-[#ff2e2e] transition-all active:scale-95">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#0f172a]/50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-xs text-[#22c55e]">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-[#e2e8f0] mb-1">{totalIncidents}</div>
          <div className="text-sm text-[#94a3b8]">Total Incidents (24h)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-[#22c55e]/20 to-[#16a34a]/20 backdrop-blur-xl border border-[#22c55e]/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#0f172a]/50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div className="flex items-center gap-1 text-xs text-[#22c55e]">
              <TrendingDown className="w-4 h-4" />
              <span>-8%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-[#e2e8f0] mb-1">{avgResponseTime}</div>
          <div className="text-sm text-[#94a3b8]">Avg Response Time</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#0f172a]/50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-xs text-[#22c55e]">
              <TrendingUp className="w-4 h-4" />
              <span>+5%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-[#e2e8f0] mb-1">{resolutionRate}%</div>
          <div className="text-sm text-[#94a3b8]">Resolution Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[#ff7a00]/20 to-[#ff8800]/20 backdrop-blur-xl border border-[#ff7a00]/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#0f172a]/50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-[#ff7a00]" />
            </div>
            <div className="flex items-center gap-1 text-xs text-[#ff2e2e]">
              <TrendingUp className="w-4 h-4" />
              <span>+3%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-[#e2e8f0] mb-1">92%</div>
          <div className="text-sm text-[#94a3b8]">System Uptime</div>
        </motion.div>
      </div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ChartsSection severityDistribution={severityDistribution} />
      </motion.div>

      {/* Weekly Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">Weekly Comparison</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const height = 40 + Math.random() * 60;
            const isToday = index === 4; // Friday
            return (
              <div key={day} className="text-center">
                <div className="h-32 flex items-end justify-center mb-2">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isToday
                        ? 'bg-gradient-to-t from-[#ff2e2e] to-[#ff4444]'
                        : 'bg-gradient-to-t from-blue-500/50 to-blue-600/50'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className={`text-xs ${isToday ? 'text-[#ff2e2e] font-bold' : 'text-[#94a3b8]'}`}>
                  {day}
                </div>
                <div className="text-xs text-[#64748b] mt-1">
                  {Math.floor(10 + Math.random() * 20)}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Traffic Density Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">Traffic Density by Location</h2>
        <div className="space-y-3">
          {[
            { name: 'Wardha Road - Central', density: 85, color: 'bg-[#ff2e2e]' },
            { name: 'Chatrapati Square', density: 72, color: 'bg-[#ff7a00]' },
            { name: 'Nagpur Railway Station', density: 68, color: 'bg-[#ff7a00]' },
            { name: 'Hingna T-Point', density: 45, color: 'bg-[#22c55e]' },
            { name: 'MIHAN SEZ', density: 38, color: 'bg-[#22c55e]' },
            { name: 'Butibori MIDC', density: 32, color: 'bg-[#22c55e]' }
          ].map((location) => (
            <div key={location.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#e2e8f0]">{location.name}</span>
                <span className="text-sm text-[#94a3b8]">{location.density}%</span>
              </div>
              <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
                <div
                  className={`h-full ${location.color} rounded-full transition-all duration-500`}
                  style={{ width: `${location.density}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
