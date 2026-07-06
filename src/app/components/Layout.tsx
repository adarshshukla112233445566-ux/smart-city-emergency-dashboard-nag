import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { EmergencyBanner } from './EmergencyBanner';
import { Navigation } from './Navigation';
import { useApp } from '../context/AppContext';

export function Layout() {
  const { currentRole, setCurrentRole, soundEnabled, setSoundEnabled, alerts } = useApp();

  const activeAlerts = alerts.filter(a => a.status === 'Active');

  // Calculate current severity based on active alerts
  const calculateSeverity = (): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    if (activeAlerts.some(a => a.severity === 'CRITICAL')) return 'CRITICAL';
    if (activeAlerts.some(a => a.severity === 'HIGH')) return 'HIGH';
    if (activeAlerts.some(a => a.severity === 'MEDIUM')) return 'MEDIUM';
    return 'LOW';
  };

  const currentSeverity = calculateSeverity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]">
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(0deg, rgba(255,46,46,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,46,46,.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Header */}
      <DashboardHeader
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Emergency Banner */}
      <EmergencyBanner
        severity={currentSeverity}
        activeAlertsCount={activeAlerts.length}
      />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <Outlet />
      </div>

      {/* Footer Badge */}
      <div className="fixed bottom-4 left-4 z-50 bg-[#0f172a]/90 backdrop-blur-xl border border-[#ff2e2e]/30 rounded-xl px-4 py-2 text-xs text-[#94a3b8]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
          <span>System Status: <span className="text-[#22c55e] font-semibold">OPERATIONAL</span></span>
        </div>
      </div>
    </div>
  );
}
