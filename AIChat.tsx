import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { createFinancialChat, sendMessageToGemini } from '../services/gemini';
import { Chat } from "@google/genai";

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const chat = await createFinancialChat();
      if (chat) {
        setChatInstance(chat);
        setMessages([{ role: 'ai', text: "Hello! I'm APSO, your financial assistant. How can I help you grow your wealth today?" }]);
      }
    };
    if (isOpen && !chatInstance) {
      initChat();
    }
  }, [isOpen, chatInstance]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatInstance) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const reply = await sendMessageToGemini(chatInstance, userMsg);
    
    setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    setLoading(false);
  };

  if (!process.env.API_KEY) return null; // Hide if no key

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-apso-dark text-apso-gold p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center ring-2 ring-white"
        >
          <Sparkles className="w-6 h-6 mr-2" />
          <span className="font-bold">Ask AI</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-200" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-apso-dark text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-apso-gold rounded-full">
                    <Sparkles className="w-4 h-4 text-apso-dark" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">APSO Assistant</h3>
                    <p className="text-xs text-gray-300">Powered by Gemini</p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    m.role === 'user'
                      ? 'bg-apso-dark text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 ml-2 animate-pulse">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about investing..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-apso-dark"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-apso-gold text-apso-dark p-2 rounded-full hover:bg-yellow-400 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;