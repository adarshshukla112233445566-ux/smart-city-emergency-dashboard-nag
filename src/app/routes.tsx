import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { IncidentsPage } from './pages/IncidentsPage';
import { MapPage } from './pages/MapPage';
import { AICommandPage } from './pages/AICommandPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminPage } from './pages/AdminPage';
import { EmergencyPlatformPage } from './pages/EmergencyPlatformPage';
import { AmbulanceTrackingPage } from './pages/AmbulanceTrackingPage';
import { useApp } from './context/AppContext';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'incidents',
        element: <IncidentsPage />
      },
      {
        path: 'map',
        element: <MapPage />
      },
      {
        path: 'ai-center',
        element: <AICommandPage />
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />
      },
      {
        path: 'admin',
        element: <AdminPage />
      },
      {
        path: 'emergency-platform',
        element: <EmergencyPlatformPage />
      },
      {
        path: 'ambulance-tracking',
        element: <AmbulanceTrackingPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);