import { NavLink, useNavigate } from 'react-router';
import { Home, AlertCircle, Map, Bot, BarChart3, Settings, LogOut, Ambulance, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navigation() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setCurrentUser } = useApp();

  const navItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/incidents', label: 'Live Incidents', icon: AlertCircle },
    { path: '/map', label: 'Smart Map', icon: Map },
    { path: '/ambulance-tracking', label: 'Ambulance Tracking', icon: Activity },
    { path: '/emergency-platform', label: 'Emergency Platform', icon: Ambulance },
    { path: '/ai-center', label: 'AI Center', icon: Bot },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin', label: 'Admin', icon: Settings }
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] border-b border-[#ff2e2e]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all relative group ${
                    isActive
                      ? 'text-[#ff2e2e]'
                      : 'text-[#94a3b8] hover:text-[#e2e8f0]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ff2e2e] to-transparent" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#94a3b8] hover:text-[#ff2e2e] transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}