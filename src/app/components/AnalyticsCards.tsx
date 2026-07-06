import { motion } from 'motion/react';
import { TrendingUp, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface AnalyticsCardsProps {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  highSeverityCount: number;
}

export function AnalyticsCards({ 
  totalAlerts, 
  activeAlerts, 
  resolvedAlerts, 
  highSeverityCount 
}: AnalyticsCardsProps) {
  const cards = [
    {
      title: 'Total Alerts Today',
      value: totalAlerts,
      icon: TrendingUp,
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      change: '+12%'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts,
      icon: AlertCircle,
      color: 'from-[#ff2e2e]/20 to-[#ff4444]/20',
      borderColor: 'border-[#ff2e2e]/30',
      iconColor: 'text-[#ff2e2e]',
      change: 'Live',
      pulse: true
    },
    {
      title: 'Resolved Alerts',
      value: resolvedAlerts,
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
  );
}
