import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface EmergencyBannerProps {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activeAlertsCount: number;
}

export function EmergencyBanner({ severity, activeAlertsCount }: EmergencyBannerProps) {
  const isCritical = severity === 'CRITICAL';
  const isHigh = severity === 'HIGH';

  if (!isCritical && !isHigh) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden"
      >
        <div 
          className={`${
            isCritical 
              ? 'bg-gradient-to-r from-[#ff2e2e] via-[#ff4444] to-[#ff2e2e]' 
              : 'bg-gradient-to-r from-[#ff7a00] via-[#ff8800] to-[#ff7a00]'
          } py-3 px-4`}
          style={{
            animation: isCritical ? 'pulse 1s ease-in-out infinite' : 'none'
          }}
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-3 text-white">
              <AlertTriangle 
                className="w-6 h-6" 
                style={{
                  animation: isCritical ? 'bounce 0.5s ease-in-out infinite' : 'none'
                }}
              />
              <div className="text-center">
                <span className="font-bold text-lg uppercase tracking-wider">
                  {isCritical ? '🚨 CRITICAL EMERGENCY ALERT 🚨' : '⚠️ HIGH SEVERITY ALERT ⚠️'}
                </span>
                <span className="ml-4 text-sm opacity-90">
                  {activeAlertsCount} active {activeAlertsCount === 1 ? 'incident' : 'incidents'} requiring immediate attention
                </span>
              </div>
              <AlertTriangle 
                className="w-6 h-6" 
                style={{
                  animation: isCritical ? 'bounce 0.5s ease-in-out infinite' : 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Scanning line animation */}
        {isCritical && (
          <motion.div
            className="absolute top-0 left-0 h-full w-2 bg-white/50"
            initial={{ x: '-100%' }}
            animate={{ x: '100vw' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
