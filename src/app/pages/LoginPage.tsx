import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setCurrentUser, setCurrentRole } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (username && password) {
        setIsAuthenticated(true);
        setCurrentUser(username);
        setCurrentRole('admin');
        navigate('/');
      } else {
        setError('Please enter valid credentials');
      }
      setLoading(false);
    }, 800);
  };

  // Demo credentials
  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'traffic', password: 'traffic123', role: 'Traffic Control Officer' },
    { username: 'medical', password: 'medical123', role: 'Medical Response Unit' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(0deg, rgba(255,46,46,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,46,46,.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#ff2e2e]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#ff2e2e]/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl p-8 flex flex-col justify-center"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <Shield className="w-16 h-16 text-[#ff2e2e]" strokeWidth={2} />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Shield className="w-16 h-16 text-[#ff2e2e]" strokeWidth={2} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#e2e8f0]">SAFEWAY</h1>
                <p className="text-sm text-[#94a3b8]">Emergency Control System</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#e2e8f0] mb-4">
              Nagpur Smart City<br />Emergency Control Center
            </h2>
            <p className="text-[#94a3b8] mb-6">
              AI-Powered Real-Time Monitoring & Response System
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#94a3b8]">
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                <span>24/7 Real-Time Monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#94a3b8]">
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                <span>AI-Powered Threat Detection</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#94a3b8]">
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                <span>Burdi to Butibori Coverage</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#334155]">
              <p className="text-xs text-[#64748b]">
                Authorized Personnel Only | Government of Maharashtra
              </p>
            </div>
          </motion.div>

          {/* Right Panel - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#ff2e2e]/20 rounded-2xl p-8"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#e2e8f0] mb-2">System Login</h3>
              <p className="text-sm text-[#94a3b8]">Enter your credentials to access the control center</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0f172a]/50 border border-[#334155] rounded-xl pl-11 pr-4 py-3 text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#ff2e2e]/50 focus:border-[#ff2e2e]/50 transition-all"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0f172a]/50 border border-[#334155] rounded-xl pl-11 pr-4 py-3 text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#ff2e2e]/50 focus:border-[#ff2e2e]/50 transition-all"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-[#ff2e2e]/10 border border-[#ff2e2e]/30 rounded-xl p-3 text-sm text-[#ff2e2e]">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ff2e2e] to-[#ff4444] text-white font-semibold py-3 rounded-xl hover:from-[#ff4444] hover:to-[#ff2e2e] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Access Control Center</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-8 border-t border-[#334155]">
              <p className="text-xs text-[#64748b] mb-3">Demo Credentials:</p>
              <div className="space-y-2">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.username}
                    onClick={() => {
                      setUsername(cred.username);
                      setPassword(cred.password);
                    }}
                    className="w-full text-left bg-[#0f172a]/50 border border-[#334155] rounded-lg px-3 py-2 text-xs text-[#94a3b8] hover:border-[#ff2e2e]/30 hover:bg-[#0f172a]/70 transition-all"
                  >
                    <span className="font-semibold text-[#e2e8f0]">{cred.username}</span>
                    <span className="text-[#64748b]"> / {cred.password}</span>
                    <span className="text-[#64748b] ml-2">({cred.role})</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-[#0f172a]/80 backdrop-blur-xl border border-[#22c55e]/30 rounded-xl px-4 py-2 text-xs text-[#94a3b8]">
            <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
            <span>System Status: <span className="text-[#22c55e] font-semibold">OPERATIONAL</span></span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
