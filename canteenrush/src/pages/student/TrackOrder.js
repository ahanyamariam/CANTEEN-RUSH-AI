import React, { useState } from 'react';
import { useTrackOrder } from '../../hooks/useOrders';

export default function TrackOrder() {
  const [tokenInput, setTokenInput] = useState('');
  const [searchToken, setSearchToken] = useState(null);
  const { order, loading, error, track } = useTrackOrder(searchToken);

  const handleSearch = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) setSearchToken(tokenInput.trim().toUpperCase());
  };

  const steps = ['placed', 'confirmed', 'preparing', 'ready', 'collected'];

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <h1 className="text-3xl font-black text-white mb-6 pt-2">Track Order</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input type="text" value={tokenInput} onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
          placeholder="Enter token" maxLength={8}
          className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-center font-mono text-xl tracking-[0.2em] uppercase text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition" />
        <button type="submit" disabled={loading || !tokenInput.trim()}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 shadow-lg shadow-blue-600/30 transition-all">
          {loading ? '...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">{error}</div>
      )}

      {order && (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
          <div className="text-center mb-6">
            <p className="font-mono text-3xl font-black text-white">{order.token}</p>
            <p className="text-sm text-gray-500 mt-1">{order.vendor?.shopName}</p>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between mb-6 px-1">
            {steps.map((step, i) => {
              const si = steps.indexOf(order.status);
              const done = i <= si;
              const current = i === si;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      current ? 'bg-blue-500 text-white ring-4 ring-blue-500/20 scale-110' :
                      done ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-600'
                    }`}>
                      {done && !current ? '✓' : i + 1}
                    </div>
                    <p className={`text-[9px] mt-1.5 ${current ? 'font-bold text-blue-400' : 'text-gray-600'}`}>{step}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 rounded ${i < si ? 'bg-green-500' : 'bg-white/10'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ETA */}
          {order.predictedReadyTime && !['collected', 'cancelled'].includes(order.status) && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center mb-4">
              <p className="text-xs text-blue-400">Expected Ready</p>
              <p className="text-2xl font-black text-blue-300 mt-1">
                {new Date(order.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {order.prediction?.reasoning && (
                <p className="text-xs text-blue-400/60 mt-1 italic">🤖 {order.prediction.reasoning}</p>
              )}
            </div>
          )}

          {/* Items */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-[10px] font-semibold text-gray-500 uppercase mb-2">Items</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-gray-300">{item.quantity}× {item.menuItem?.name}</span>
                <span className="text-gray-500">₹{(item.menuItem?.price || 0) * item.quantity}</span>
              </div>
            ))}
          </div>

          <button onClick={() => track(searchToken)}
            className="w-full mt-4 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-xl transition">
            ↻ Refresh Status
          </button>
        </div>
      )}
    </div>
  );
}