import { motion } from 'motion/react';
import { Bot, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AITerminal } from '../components/AITerminal';

export function AICommandPage() {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#22c55e] rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#e2e8f0] mb-1">AI Command Center</h1>
              <p className="text-sm text-[#94a3b8]">SAFEWAY AI - Intelligent Emergency Response System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl">
            <Cpu className="w-5 h-5 text-[#22c55e]" />
            <div>
              <div className="text-xs text-[#94a3b8]">AI Status</div>
              <div className="text-sm font-bold text-[#22c55e]">ONLINE</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Terminal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="h-[calc(100vh-280px)] min-h-[600px]"
      >
        <AITerminal severity={currentSeverity} activeAlertsCount={activeAlerts.length} />
      </motion.div>

      {/* AI Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#0f172a]/50 rounded-lg">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-[#e2e8f0]">Risk Prediction</h3>
          </div>
          <p className="text-sm text-[#94a3b8]">
            Real-time analysis of threat patterns and predictive emergency modeling
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#0f172a]/50 rounded-lg">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-[#e2e8f0]">Automated Response</h3>
          </div>
          <p className="text-sm text-[#94a3b8]">
            Intelligent routing and resource allocation for emergency services
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#22c55e]/20 to-[#16a34a]/20 backdrop-blur-xl border border-[#22c55e]/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#0f172a]/50 rounded-lg">
              <Cpu className="w-5 h-5 text-[#22c55e]" />
            </div>
            <h3 className="font-bold text-[#e2e8f0]">Smart Analytics</h3>
          </div>
          <p className="text-sm text-[#94a3b8]">
            Deep learning insights for traffic optimization and incident prevention
          </p>
        </div>
      </motion.div>
    </div>
  );
}
