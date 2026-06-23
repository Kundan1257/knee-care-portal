import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { getKneeCareTip } from '../services/geminiService.js';

// Dummy layout wrappers to prevent layout crashes
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="min-h-screen bg-gray-50 p-4">{children}</div>;
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <div className={`bg-white rounded-2xl shadow-xl ${className}`}>{children}</div>;
const ChatBubble: React.FC<{ message: string, isBot: boolean }> = ({ message, isBot }) => (
  <div className={`p-4 rounded-2xl max-w-[85%] text-sm font-medium mb-4 shadow-sm ${isBot ? "bg-gray-100 text-gray-800 self-start" : "bg-blue-600 text-white self-end ml-auto"}`}>
    {message}
  </div>
);

const suggestions = [
  "Reduce knee stiffness",
  "Best recovery exercise",
  "Foods for joint support",
  "Relaxation routine"
];

export const HelpSection: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string, isBot: boolean }[]>([
    { text: "Hello! I'm your Knee-Care assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setLoading(true);

    try {
      const response = await getKneeCareTip(userMsg);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "I'm sorry, I couldn't process that. Please try again.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (loading) return;
    setMessages(prev => [...prev, { text: suggestion, isBot: false }]);
    setLoading(true);

    try {
      const response = await getKneeCareTip(suggestion);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "I'm sorry, I couldn't process that. Please try again.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-3">AI Support Assistant</h1>
        <p className="text-gray-500 font-medium max-w-lg mx-auto">Get instant guidance on knee care, recovery techniques, and daily habit tips.</p>
      </header>

      <Card className="max-w-2xl mx-auto border-none shadow-2xl p-0 h-[650px] flex flex-col overflow-hidden bg-white">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Knee Assistant Online</span>
          </div>
          <MessageCircle size={20} className="text-gray-300" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg.text} isBot={msg.isBot} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium italic animate-pulse">
              <Sparkles size={16} className="text-blue-500 animate-spin" />
              Thinking...
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-6 pb-2 flex flex-wrap gap-2">
            {suggestions.map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestionClick(item)}
                disabled={loading}
                className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-all"
              >
                ✨ {item}
              </motion.button>
            ))}
          </div>
        )}

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="relative flex items-center gap-3">
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about knee care..."
              className="flex-1 bg-white border border-gray-200 px-5 py-4 rounded-2xl text-sm font-medium outline-none pr-14"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 text-center font-medium">Verified knee-care tips powered by Gemini AI Specialist</p>
        </div>
      </Card>
      
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-blue-50 border-none p-4 rounded-xl flex gap-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1 text-sm">Expert Tip</h4>
            <p className="text-[10px] text-blue-800/60 font-medium leading-relaxed">Ask about "Knee recovery stretches" or "Healthy knee diet" to get started with research-backed guidance.</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HelpSection;

