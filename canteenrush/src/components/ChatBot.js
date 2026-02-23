import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'SYSTEM_READY. How can I assist?', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Quick Actions (Chips)
  const [options, setOptions] = useState([
    { label: 'LIST_VENDORS', action: 'list_vendors' },
    { label: 'CANCEL_ORDER', action: 'cancel_order' }
  ]);

  const endRef = useRef(null);

  // Updated handleSend to support hidden actions
  const handleSend = async (text, displayText = null) => { 
    if (!text.trim()) return;

    // Show the "Pretty" text in the chat bubble
    setMessages(prev => [...prev, { sender: 'user', text: displayText || text }]);
    
    setInput('');
    setLoading(true);
    setOptions([]); 

    try {
      // Send the "Raw" text (Action/ID) to the backend
      const { data } = await api.post('/chat/message', { message: text });
      
      setMessages(prev => [...prev, { sender: 'bot', text: data.text }]);

      if (data.options) {
        setOptions(data.options);
      } else {
        setOptions([
          { label: 'LIST_VENDORS', action: 'list_vendors' },
          { label: 'CANCEL_ORDER', action: 'cancel_order' }
        ]);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: '[ERR] CONNECTION_LOST' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    // 1. Direct Action Mapping
    if (option.action === 'list_vendors') {
      handleSend("List all open vendors", "List vendors");
    } 
    else if (option.action === 'cancel_order') {
      handleSend("I want to cancel an order", "Cancel an order");
    }
    // 2. ID-Based Actions (Fixes ugly ID display)
    else if (option.action) {
      // Send Action (ID) to backend, Show Label (Name) in chat
      handleSend(option.action, option.label); 
    }
    // 3. Fallback
    else {
      handleSend(option.label);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-[#F2F2F2] border border-[#1A1A1A]/20 w-80 h-[500px] shadow-2xl flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-[#1A1A1A] p-4 flex justify-between items-center shadow-md">
            <h3 className="font-black text-white flex items-center gap-2 uppercase tracking-widest text-xs">
              <span>[ AI_TERMINAL ]</span>
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-[#FF6B00] text-lg font-black transition-colors">X</button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e2e8e4]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-xs font-bold uppercase tracking-wide leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#FF6B00] text-white' 
                    : 'bg-white text-[#1A1A1A] border border-[#1A1A1A]/10'
                }`}>
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-1 last:mb-0">{line}</p>
                  ))}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#1A1A1A]/10 p-4">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#1A1A1A]/40 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#1A1A1A]/40 animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-[#1A1A1A]/40 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Chips / Options Area */}
          {options.length > 0 && !loading && (
            <div className="p-3 bg-[#F2F2F2] flex gap-2 overflow-x-auto border-t border-[#1A1A1A]/10 scrollbar-hide">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="whitespace-nowrap px-3 py-2 bg-[#1A1A1A] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#FF6B00] transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-3 bg-[#F2F2F2] border-t border-[#1A1A1A]/20">
            <div className="flex gap-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="INPUT_COMMAND..."
                className="flex-1 bg-white border-y border-l border-[#1A1A1A]/20 px-4 py-3 text-xs font-bold text-[#1A1A1A] placeholder-[#1A1A1A]/40 uppercase tracking-wide focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-[#1A1A1A] text-white px-4 py-3 hover:bg-[#FF6B00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-black uppercase tracking-widest"
              >
                SEND [→]
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 shadow-lg flex items-center justify-center text-lg font-black hover:scale-105 transition-all z-50 ${isOpen ? 'bg-[#1A1A1A] text-white' : 'bg-[#FF6B00] text-white'}`}
      >
        {isOpen ? 'X' : 'AI'}
      </button>
    </div>
  );
}