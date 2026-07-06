import { useState, useEffect } from 'react';
import { Shield, Volume2, VolumeX } from 'lucide-react';

interface DashboardHeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export function DashboardHeader({ currentRole, onRoleChange, soundEnabled, onSoundToggle }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] border-b border-[#ff2e2e]/20 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left Section - Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="w-12 h-12 text-[#ff2e2e]" strokeWidth={2} />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Shield className="w-12 h-12 text-[#ff2e2e]" strokeWidth={2} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#e2e8f0] tracking-tight">
                  Nagpur Smart City Emergency Control Center
                </h1>
                <p className="text-sm text-[#94a3b8] mt-1">
                  AI-Powered Real-Time Monitoring System
                </p>
              </div>
            </div>

            {/* Right Section - Time, Role, Sound */}
            <div className="flex items-center gap-6">
              {/* Digital Clock */}
              <div className="hidden md:block text-right">
                <div className="text-2xl font-mono font-bold text-[#ff2e2e]">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">
                  {formatDate(currentTime)}
                </div>
              </div>

              {/* Role Selector */}
              <div className="relative">
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value)}
                  className="bg-[#1e293b] border border-[#ff2e2e]/30 rounded-xl px-4 py-2 text-[#e2e8f0] text-sm cursor-pointer hover:border-[#ff2e2e]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#ff2e2e]/50 appearance-none pr-10"
                >
                  <option value="admin">Admin</option>
                  <option value="traffic">Traffic Control Officer</option>
                  <option value="medical">Medical Response Unit</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#ff2e2e]">
                  ▼
                </div>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={onSoundToggle}
                className="bg-[#1e293b] border border-[#ff2e2e]/30 rounded-xl p-2 text-[#e2e8f0] hover:border-[#ff2e2e]/50 hover:bg-[#1e293b]/80 transition-all active:scale-95"
                title={soundEnabled ? 'Mute alerts' : 'Unmute alerts'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#ff2e2e]" />
                ) : (
                  <VolumeX className="w-5 h-5 text-[#64748b]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Glowing divider */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ff2e2e] to-transparent opacity-50"></div>
    </div>
  );
}
