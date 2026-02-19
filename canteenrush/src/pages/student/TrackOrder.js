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
    <div className="min-h-screen bg-ferro-offwhite p-6 lg:p-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 flex justify-between items-end border-b border-ferro-black/10 pb-10">
          <h1 className="text-6xl font-black tracking-tighter uppercase">Track<br />Order</h1>
          <div className="text-right">
            <span className="text-[10px] font-bold text-ferro-black/40 uppercase tracking-widest">Network Protocol</span>
            <p className="text-xs font-bold mt-1">v2.0 / LIVE_SYNC</p>
          </div>
        </header>

        <form onSubmit={handleSearch} className="mb-20">
          <label className="text-[10px] font-bold uppercase tracking-widest mb-4 block">Input Token ID</label>
          <div className="flex gap-4">
            <input 
              type="text" value={tokenInput} 
              onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
              className="flex-1 bg-transparent border-b-2 border-ferro-black py-4 text-4xl font-black outline-none placeholder:text-ferro-black/10"
              placeholder="00-00-00"
            />
            <button className="bg-ferro-orange text-white px-10 font-bold hover:bg-ferro-black transition-colors">SEARCH</button>
          </div>
        </form>

        {order && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Status Technical Tile */}
            <div className="bg-ferro-mint p-10 ferro-border flex flex-col justify-between min-h-[300px]">
              <span className="text-[10px] font-bold uppercase tracking-widest">Prediction Logic</span>
              <div>
                <p className="text-sm font-bold opacity-40">ESTIMATED_READY</p>
                <p className="text-7xl font-black mt-2">
                  {new Date(order.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-ferro-orange animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">✨ AI_OPTIMIZED_ETA</span>
              </div>
            </div>

            {/* Token Tile */}
            <div className="bg-ferro-black text-white p-10 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Active Token</span>
              <h2 className="text-8xl font-black tracking-tighter text-ferro-orange">{order.token}</h2>
              <div className="border-t border-white/10 pt-6">
                <p className="text-xs font-bold uppercase tracking-widest">{order.vendor?.shopName}</p>
                <p className="text-[10px] text-white/40 mt-1">{order.status.toUpperCase()} / {order.items.length} ITEMS</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}