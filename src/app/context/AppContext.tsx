import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Alert {
  id: string;
  type: string;
  location: string;
  time: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'Active' | 'Resolved';
  timestamp: number;
  position: [number, number];
}

interface AppContextType {
  currentRole: string;
  setCurrentRole: (role: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  handleResolveAlert: (id: string) => void;
  handleClearAll: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  generateAlert: () => Alert;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Simulated alert types and locations
const alertTypes = [
  'Traffic Accident',
  'Road Blockage',
  'Medical Emergency',
  'Fire Incident',
  'Public Disturbance',
  'Infrastructure Damage',
  'Vehicle Breakdown',
  'Power Outage'
];

const nagpurLocations = [
  { name: 'Wardha Road - Central', position: [21.1350, 79.1200] as [number, number] },
  { name: 'AIIMS Nagpur', position: [21.0926, 79.0455] as [number, number] },
  { name: 'Chatrapati Square', position: [21.1419, 79.0889] as [number, number] },
  { name: 'Nagpur Railway Station', position: [21.1509, 79.0821] as [number, number] },
  { name: 'Maharajbagh Road', position: [21.1385, 79.0910] as [number, number] },
  { name: 'Hingna T-Point', position: [21.1823, 79.1542] as [number, number] },
  { name: 'MIHAN SEZ', position: [21.0822, 79.0471] as [number, number] },
  { name: 'Butibori MIDC', position: [21.2288, 79.2142] as [number, number] }
];

const severities: Array<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> = ['LOW', 'LOW', 'MEDIUM', 'MEDIUM', 'HIGH', 'CRITICAL'];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState('admin');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  // Generate random alert
  const generateAlert = (): Alert => {
    const location = nagpurLocations[Math.floor(Math.random() * nagpurLocations.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const now = new Date();
    
    return {
      id: `alert-${Date.now()}-${Math.random()}`,
      type,
      location: location.name,
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      severity,
      status: 'Active',
      timestamp: now.getTime(),
      position: location.position
    };
  };

  // Simulate dynamic updates every 5 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial alerts
    const initialAlerts = [
      generateAlert(),
      generateAlert(),
      generateAlert()
    ];
    setAlerts(initialAlerts);

    const interval = setInterval(() => {
      // 70% chance to add new alert
      if (Math.random() > 0.3) {
        const newAlert = generateAlert();
        setAlerts(prev => [newAlert, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Auto-expire alerts after 3 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const expiryInterval = setInterval(() => {
      const now = Date.now();
      setAlerts(prev =>
        prev.map(alert =>
          alert.status === 'Active' && now - alert.timestamp > 180000
            ? { ...alert, status: 'Resolved' as const }
            : alert
        )
      );
    }, 10000);

    return () => clearInterval(expiryInterval);
  }, [isAuthenticated]);

  const handleResolveAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, status: 'Resolved' as const } : alert
      )
    );
  };

  const handleClearAll = () => {
    setAlerts(prev =>
      prev.map(alert => ({ ...alert, status: 'Resolved' as const }))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        soundEnabled,
        setSoundEnabled,
        alerts,
        setAlerts,
        handleResolveAlert,
        handleClearAll,
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        generateAlert
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
