import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, User, Activity } from 'lucide-react';

interface AITerminalProps {
  severity: string;
  activeAlertsCount: number;
}

export function AITerminal({ severity, activeAlertsCount }: AITerminalProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    {
      role: 'ai',
      content: '🤖 Safeway AI Emergency Response System initialized. Real-time analysis active.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    // Auto-update based on severity changes
    if (severity === 'CRITICAL' && messages[messages.length - 1]?.role !== 'ai') {
      simulateAIResponse('⚠️ CRITICAL ALERT DETECTED - Initiating emergency protocols...');
    }
  }, [severity]);

  const simulateAIResponse = (customMessage?: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = customMessage ? [customMessage] : [
        '✅ Analysis complete. Traffic rerouting protocols activated for Wardha Road corridor.',
        '🚑 Medical units dispatched to AIIMS Nagpur. ETA: 4 minutes.',
        '📊 Current risk assessment: Traffic density at 78%. Recommending alternate routes via Hingna T-Point.',
        '⚡ Emergency services coordination active. Fire brigade and ambulance units on standby.',
        '🛡️ All systems operational. Monitoring 47 intersections across Nagpur smart grid.',
        '🎯 Predictive analysis suggests traffic normalization in 15 minutes with current interventions.',
      ];
      
      const response = customMessage || responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    simulateAIResponse();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRiskLevel = () => {
    switch (severity) {
      case 'CRITICAL': return { level: 'CRITICAL', color: '#ff2e2e', percent: 95 };
      case 'HIGH': return { level: 'HIGH', color: '#ff2e2e', percent: 78 };
      case 'MEDIUM': return { level: 'MEDIUM', color: '#ff7a00', percent: 52 };
      default: return { level: 'LOW', color: '#22c55e', percent: 23 };
    }
  };

  const riskData = getRiskLevel();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#334155] bg-gradient-to-r from-[#0f172a] to-[#1e293b]">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-[#ff2e2e]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#0f172a] animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#e2e8f0]">
              Safeway AI Terminal
            </h3>
            <p className="text-xs text-[#94a3b8]">Intelligent Emergency Assistant</p>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-[#0f172a]/50 rounded-lg p-3 border border-[#334155]">
            <div className="text-xs text-[#94a3b8] mb-1">Current Risk Level</div>
            <div className={`text-lg font-bold`} style={{ color: riskData.color }}>
              {riskData.level}
            </div>
          </div>
          <div className="bg-[#0f172a]/50 rounded-lg p-3 border border-[#334155]">
            <div className="text-xs text-[#94a3b8] mb-1">Escalation Risk</div>
            <div className="text-lg font-bold text-[#ff7a00]">
              {riskData.percent}%
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Panel */}
      <div className="p-4 border-b border-[#334155] bg-[#0f172a]/30">
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#94a3b8]">Active Incidents:</span>
            <span className="text-[#e2e8f0] font-semibold">{activeAlertsCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#94a3b8]">Response Time:</span>
            <span className="text-[#22c55e] font-semibold">2.4 min avg</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#94a3b8]">Traffic Status:</span>
            <span className="text-[#ff7a00] font-semibold">Moderate</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#94a3b8]">AI Confidence:</span>
            <span className="text-[#e2e8f0] font-semibold">94.7%</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              message.role === 'ai' 
                ? 'bg-[#ff2e2e]/20 border border-[#ff2e2e]/30' 
                : 'bg-[#3b82f6]/20 border border-[#3b82f6]/30'
            }`}>
              {message.role === 'ai' ? (
                <Bot className="w-4 h-4 text-[#ff2e2e]" />
              ) : (
                <User className="w-4 h-4 text-[#3b82f6]" />
              )}
            </div>
            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block px-4 py-2 rounded-xl text-sm ${
                message.role === 'ai'
                  ? 'bg-[#0f172a]/50 border border-[#334155] text-[#e2e8f0]'
                  : 'bg-[#3b82f6]/20 border border-[#3b82f6]/30 text-[#e2e8f0]'
              }`}>
                {message.content}
              </div>
              <div className="text-xs text-[#64748b] mt-1">
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-[#ff2e2e]/20 border border-[#ff2e2e]/30">
              <Bot className="w-4 h-4 text-[#ff2e2e]" />
            </div>
            <div className="flex items-center gap-2 bg-[#0f172a]/50 border border-[#334155] px-4 py-2 rounded-xl">
              <Activity className="w-4 h-4 text-[#ff2e2e] animate-pulse" />
              <span className="text-[#94a3b8] text-sm">AI analyzing...</span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#334155] bg-gradient-to-r from-[#0f172a] to-[#1e293b]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Safeway AI..."
            className="flex-1 bg-[#0f172a]/50 border border-[#334155] rounded-xl px-4 py-2 text-[#e2e8f0] text-sm placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#ff2e2e]/50 focus:border-[#ff2e2e]/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-[#ff2e2e] to-[#ff4444] hover:from-[#ff4444] hover:to-[#ff2e2e] disabled:from-[#334155] disabled:to-[#334155] text-white p-2 rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-[#64748b] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
          AI response system active{showCursor && '▋'}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 46, 46, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 46, 46, 0.5);
        }
      `}</style>
    </div>
  );
}
