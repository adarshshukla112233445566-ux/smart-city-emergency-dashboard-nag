import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { TrendingUp, AlertCircle, CheckCircle, AlertTriangle, Map, Bot, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmergencyMap } from '../components/EmergencyMap';

export function HomePage() {
  const navigate = useNavigate();
  const { alerts } = useApp();

  const activeAlerts = alerts.filter(a => a.status === 'Active');
  const resolvedAlerts = alerts.filter(a => a.status === 'Resolved');
  const highSeverityCount = activeAlerts.filter(
    a => a.severity === 'HIGH' || a.severity === 'CRITICAL'
  ).length;

  // Calculate current severity based on active alerts
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

  const cards = [
    {
      title: 'Total Alerts Today',
      value: alerts.length,
      icon: TrendingUp,
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      change: '+12%'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts.length,
      icon: AlertCircle,
      color: 'from-[#ff2e2e]/20 to-[#ff4444]/20',
      borderColor: 'border-[#ff2e2e]/30',
      iconColor: 'text-[#ff2e2e]',
      change: 'Live',
      pulse: true
    },
    {
      title: 'Resolved Alerts',
      value: resolvedAlerts.length,
      icon: CheckCircle,
      color: 'from-[#22c55e]/20 to-[#16a34a]/20',
      borderColor: 'border-[#22c55e]/30',
      iconColor: 'text-[#22c55e]',
      change: '+8'
    },
    {
      title: 'High Severity',
      value: highSeverityCount,
      icon: AlertTriangle,
      color: 'from-[#ff7a00]/20 to-[#ff8800]/20',
      borderColor: 'border-[#ff7a00]/30',
      iconColor: 'text-[#ff7a00]',
      change: '⚠️'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl p-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">
              Emergency Control Center Overview
            </h1>
            <p className="text-[#94a3b8]">
              Real-time monitoring of Nagpur corridor from Burdi to Butibori MIDC
            </p>
          </div>
          <div className={`px-6 py-3 rounded-xl ${config.bg} border ${config.border}`}>
            <div className="text-xs text-[#94a3b8] mb-1">Current Risk Level</div>
            <div className={`text-2xl font-bold ${config.color}`}>
              {currentSeverity}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-gradient-to-br ${card.color} backdrop-blur-xl border ${card.borderColor} rounded-xl p-6 overflow-hidden group hover:scale-105 transition-transform duration-300`}
          >
            {/* Background grid pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg bg-[#0f172a]/50 ${card.pulse ? 'animate-pulse' : ''}`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  card.pulse ? 'bg-[#ff2e2e]/20 text-[#ff2e2e]' : 'bg-[#1e293b]/50 text-[#94a3b8]'
                }`}>
                  {card.change}
                </span>
              </div>

              <div>
                <div className={`text-4xl font-bold mb-2 ${card.iconColor}`}>
                  {card.value}
                </div>
                <div className="text-sm text-[#94a3b8] uppercase tracking-wider">
                  {card.title}
                </div>
              </div>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.div>
        ))}
      </div>

      {/* Mini Map Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#e2e8f0] mb-1">Live Nagpur Map</h2>
              <p className="text-sm text-[#94a3b8]">Burdi to Butibori corridor monitoring</p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff2e2e] to-[#ff4444] text-white font-semibold rounded-xl hover:from-[#ff4444] hover:to-[#ff2e2e] transition-all active:scale-95 group"
            >
              <Map className="w-4 h-4" />
              <span>Full Screen Map</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="h-[400px]">
          <EmergencyMap activeAlerts={activeAlerts} severity={currentSeverity} />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/incidents')}
          className="bg-gradient-to-br from-[#ff2e2e]/20 to-[#ff4444]/20 backdrop-blur-xl border border-[#ff2e2e]/30 rounded-xl p-6 text-left hover:scale-105 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-[#ff2e2e]" />
            <ArrowRight className="w-6 h-6 text-[#ff2e2e] group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-[#e2e8f0] mb-2">View Live Incidents</h3>
          <p className="text-sm text-[#94a3b8]">Monitor and manage active alerts in real-time</p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate('/ai-center')}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 text-left hover:scale-105 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <Bot className="w-8 h-8 text-blue-400" />
            <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-[#e2e8f0] mb-2">Open AI Console</h3>
          <p className="text-sm text-[#94a3b8]">Access AI-powered emergency response system</p>
        </motion.button>
      </div>
    </div>
  );
}
