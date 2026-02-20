import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';


export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am Canteen AI. How can I help you?', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Quick Actions (Chips)
  const [options, setOptions] = useState([
    { label: '🏪 List Vendors', action: 'list_vendors' },
    { label: '❌ Cancel Order', action: 'cancel_order' }
  ]);

  const endRef = useRef(null);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setLoading(true);
    setOptions([]); // Clear options while thinking

    try {
      // Call Backend API
     const { data } = await api.post('/chat/message', { message: text });
      
      // Add Bot Response
      setMessages(prev => [...prev, { sender: 'bot', text: data.text }]);

      // Update options based on context (Dynamic Chips)
      if (data.options) {
        setOptions(data.options);
      } else {
        // Default options if conversation ends
        setOptions([
          { label: '🏪 List Vendors', action: 'list_vendors' },
          { label: '❌ Cancel Order', action: 'cancel_order' }
        ]);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Connection Error. Is the backend running?' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    // If it's a direct message action, just send it
    if (option.action === 'list_vendors') {
      handleSend("List all open vendors");
    } else if (option.action === 'cancel_order') {
      handleSend("I want to cancel an order");
    } else if (option.action === 'select_vendor') {
      handleSend(`Show menu for ${option.value}`);
    } else {
      handleSend(option.label);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-[#1a1a1a] border border-white/10 w-80 h-[500px] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center shadow-md">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span>🤖</span> Canteen Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl">×</button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f0f0f]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-[#2a2a2a] text-gray-200 rounded-bl-none border border-white/5'
                }`}>
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-1 last:mb-0">{line}</p>
                  ))}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2a2a] rounded-2xl p-4 rounded-bl-none">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Chips / Options Area */}
          {options.length > 0 && !loading && (
            <div className="p-3 bg-[#1a1a1a] flex gap-2 overflow-x-auto border-t border-white/5 scrollbar-hide">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="whitespace-nowrap px-3 py-1.5 bg-[#2a2a2a] border border-blue-500/30 text-blue-400 text-xs rounded-full hover:bg-blue-500/10 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-3 bg-[#1a1a1a] border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your request..."
                className="flex-1 bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform z-50"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}