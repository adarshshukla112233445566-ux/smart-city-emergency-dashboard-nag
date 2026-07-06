import { LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'motion/react';

const hourlyData = [
  { time: '00:00', alerts: 5 },
  { time: '03:00', alerts: 3 },
  { time: '06:00', alerts: 8 },
  { time: '09:00', alerts: 15 },
  { time: '12:00', alerts: 23 },
  { time: '15:00', alerts: 19 },
  { time: '18:00', alerts: 28 },
  { time: '21:00', alerts: 16 },
  { time: '23:59', alerts: 12 }
];

const trafficData = [
  { time: '0s', density: 45 },
  { time: '5s', density: 62 },
  { time: '10s', density: 78 },
  { time: '15s', density: 55 },
  { time: '20s', density: 71 },
  { time: '25s', density: 89 },
  { time: '30s', density: 67 }
];

interface ChartsSectionProps {
  severityDistribution: { name: string; value: number; color: string }[];
}

export function ChartsSection({ severityDistribution }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 24-Hour Alert Trend */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-[#e2e8f0] mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#ff2e2e] rounded-full animate-pulse" />
          24-Hour Alert Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hourlyData}>
            <defs>
              <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff2e2e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff2e2e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 46, 46, 0.3)',
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
            />
            <Line
              type="monotone"
              dataKey="alerts"
              stroke="#ff2e2e"
              strokeWidth={3}
              dot={{ fill: '#ff2e2e', r: 4 }}
              activeDot={{ r: 6, fill: '#ff2e2e' }}
              fill="url(#alertGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Severity Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-[#e2e8f0] mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#ff2e2e] rounded-full animate-pulse" />
          Severity Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={severityDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {severityDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 46, 46, 0.3)',
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-[#94a3b8] text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Live Traffic Density */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-3 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-[#e2e8f0] mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
          Live Traffic Density - Wardha Road
        </h3>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
              domain={[0, 100]}
              label={{ value: 'Density %', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
            />
            <Area
              type="monotone"
              dataKey="density"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#trafficGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
