import React, { useState } from 'react';
import { useTrackOrder } from '../../hooks/useOrders';

export default function TrackOrder() {
  const [tokenInput, setTokenInput] = useState('');
  const [searchToken, setSearchToken] = useState(null);
  const { order, loading, error } = useTrackOrder(searchToken);

  const handleSearch = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) setSearchToken(tokenInput.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6 lg:p-20 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 flex justify-between items-end border-b border-[#1A1A1A]/10 pb-10">
          <h1 className="text-8xl font-black tracking-tighter uppercase leading-none">Track<br />Order</h1>
          <div className="text-right">
            <span className="text-[10px] font-black text-[#1A1A1A]/40 uppercase tracking-[0.3em]">Network Protocol</span>
            <p className="text-xs font-black mt-1 uppercase">v2.0 / LIVE_SYNC</p>
          </div>
        </header>

        <form onSubmit={handleSearch} className="mb-20">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block text-[#1A1A1A]/40">Input Token ID</label>
          <div className="flex gap-4">
            <input 
              type="text" value={tokenInput} 
              onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
              className="flex-1 bg-transparent border-b-2 border-[#1A1A1A] py-4 text-4xl font-black outline-none placeholder:text-[#1A1A1A]/10 uppercase tracking-tighter"
              placeholder="00-00-00"
            />
            <button className="bg-[#FF6B00] text-white px-10 py-4 font-black text-xs uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors">SEARCH</button>
          </div>
        </form>

        {order && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prediction Logic Tile */}
            <div className="bg-[#D1D9D4] p-12 border border-[#1A1A1A]/5 flex flex-col justify-between min-h-[400px]">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1A1A]/40">Prediction Logic</span>
              <div>
                <p className="text-[10px] font-black text-[#1A1A1A]/30 uppercase tracking-widest">ESTIMATED_READY</p>
                <p className="text-8xl font-black mt-2 tracking-tighter text-[#1A1A1A]">
                  {new Date(order.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FF6B00] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/60">✨ AI_OPTIMIZED_ETA</span>
              </div>
            </div>

            {/* Token Tile - FIXED OVERFLOW */}
            <div className="bg-[#1A1A1A] text-white p-12 flex flex-col justify-between min-h-[400px] overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Active Token</span>
              
              {/* Added break-all and adjusted font size for long tokens */}
              <div className="py-4">
                <h2 className="text-7xl md:text-8xl font-black tracking-tighter text-[#FF6B00] break-all leading-none uppercase">
                  {order.token}
                </h2>
              </div>

              <div className="border-t border-white/10 pt-8">
                <p className="text-xs font-black uppercase tracking-widest">{order.vendor?.shopName}</p>
                <p className="text-[10px] font-bold text-white/30 mt-2 uppercase tracking-widest">
                  {order.status.toUpperCase()} / {order.items.length} ITEMS
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}