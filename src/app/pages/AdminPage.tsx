import { motion } from 'motion/react';
import { Settings, User, Volume2, VolumeX, RefreshCw, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AdminPage() {
  const { 
    currentRole, 
    setCurrentRole, 
    soundEnabled, 
    setSoundEnabled, 
    setAlerts,
    currentUser,
    alerts 
  } = useApp();

  const handleResetSystem = () => {
    if (window.confirm('Are you sure you want to reset the system? All current alerts will be cleared.')) {
      setAlerts([]);
    }
  };

  const roleOptions = [
    { 
      value: 'admin', 
      label: 'System Administrator',
      description: 'Full system access and control',
      color: 'from-[#ff2e2e]/20 to-[#ff4444]/20',
      borderColor: 'border-[#ff2e2e]/30',
      icon: Shield
    },
    { 
      value: 'traffic', 
      label: 'Traffic Control Officer',
      description: 'Traffic management and signal control',
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      icon: Settings
    },
    { 
      value: 'medical', 
      label: 'Medical Response Unit',
      description: 'Emergency medical coordination',
      color: 'from-[#22c55e]/20 to-[#16a34a]/20',
      borderColor: 'border-[#22c55e]/30',
      icon: User
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#ff2e2e]/10 border border-[#ff2e2e]/30 rounded-xl">
            <Settings className="w-8 h-8 text-[#ff2e2e]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#e2e8f0] mb-1">System Administration</h1>
            <p className="text-sm text-[#94a3b8]">User roles, settings, and system configuration</p>
          </div>
        </div>
      </motion.div>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">User Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ff2e2e] to-[#ff4444] rounded-xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#e2e8f0]">{currentUser || 'Admin User'}</div>
            <div className="text-sm text-[#94a3b8]">
              {roleOptions.find(r => r.value === currentRole)?.label || 'System Administrator'}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-[#0f172a]/50 border border-[#334155] rounded-xl p-4">
            <div className="text-[#94a3b8] mb-1">Total Alerts Handled</div>
            <div className="text-2xl font-bold text-[#e2e8f0]">{alerts.length}</div>
          </div>
          <div className="bg-[#0f172a]/50 border border-[#334155] rounded-xl p-4">
            <div className="text-[#94a3b8] mb-1">Session Duration</div>
            <div className="text-2xl font-bold text-[#e2e8f0]">2h 34m</div>
          </div>
          <div className="bg-[#0f172a]/50 border border-[#334155] rounded-xl p-4">
            <div className="text-[#94a3b8] mb-1">Access Level</div>
            <div className="text-2xl font-bold text-[#22c55e]">FULL</div>
          </div>
        </div>
      </motion.div>

      {/* Role Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">Role Selection</h2>
        <p className="text-sm text-[#94a3b8] mb-6">
          Select your operational role to customize your dashboard experience
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleOptions.map((role) => (
            <button
              key={role.value}
              onClick={() => setCurrentRole(role.value)}
              className={`relative bg-gradient-to-br ${role.color} backdrop-blur-xl border ${role.borderColor} rounded-xl p-6 text-left transition-all hover:scale-105 ${
                currentRole === role.value ? 'ring-2 ring-[#ff2e2e]' : ''
              }`}
            >
              {currentRole === role.value && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff2e2e] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
              <role.icon className="w-8 h-8 text-[#e2e8f0] mb-3" />
              <h3 className="font-bold text-[#e2e8f0] mb-2">{role.label}</h3>
              <p className="text-sm text-[#94a3b8]">{role.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* System Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">System Settings</h2>
        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#0f172a]/50 border border-[#334155] rounded-xl">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#22c55e]" />
              ) : (
                <VolumeX className="w-5 h-5 text-[#64748b]" />
              )}
              <div>
                <div className="font-semibold text-[#e2e8f0]">Alert Sounds</div>
                <div className="text-sm text-[#94a3b8]">Enable audio notifications for alerts</div>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative w-14 h-7 rounded-full transition-all ${
                soundEnabled ? 'bg-[#22c55e]' : 'bg-[#334155]'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  soundEnabled ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          {/* Simulation Mode */}
          <div className="flex items-center justify-between p-4 bg-[#0f172a]/50 border border-[#334155] rounded-xl">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-semibold text-[#e2e8f0]">Simulation Mode</div>
                <div className="text-sm text-[#94a3b8]">Automatically generate test alerts</div>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#22c55e]/20 border border-[#22c55e]/30 rounded-lg text-xs font-semibold text-[#22c55e]">
              ACTIVE
            </div>
          </div>

          {/* Auto-expire */}
          <div className="flex items-center justify-between p-4 bg-[#0f172a]/50 border border-[#334155] rounded-xl">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-purple-400" />
              <div>
                <div className="font-semibold text-[#e2e8f0]">Auto-Expire Alerts</div>
                <div className="text-sm text-[#94a3b8]">Automatically resolve alerts after 3 minutes</div>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#22c55e]/20 border border-[#22c55e]/30 rounded-lg text-xs font-semibold text-[#22c55e]">
              ENABLED
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">System Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleResetSystem}
            className="flex items-center gap-3 p-4 bg-[#ff2e2e]/10 border border-[#ff2e2e]/30 rounded-xl text-[#ff2e2e] hover:bg-[#ff2e2e]/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Reset System</div>
              <div className="text-sm text-[#ff2e2e]/70">Clear all alerts and reset counters</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95">
            <Settings className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Advanced Settings</div>
              <div className="text-sm text-blue-400/70">Configure system parameters</div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-[#e2e8f0] mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[#94a3b8]">Version:</span>
            <span className="text-[#e2e8f0] font-semibold">SAFEWAY v2.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94a3b8]">Last Update:</span>
            <span className="text-[#e2e8f0] font-semibold">Feb 20, 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94a3b8]">Coverage Area:</span>
            <span className="text-[#e2e8f0] font-semibold">Burdi - Butibori (~35 km)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94a3b8]">Active Sensors:</span>
            <span className="text-[#22c55e] font-semibold">148/150</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
