import React, { useState } from 'react';
import { useVendorQueue } from '../../hooks/useOrders';

export default function LiveQueue() {
  const { queue, loading, updateStatus, collectByToken } = useVendorQueue();
  const [collectToken, setCollectToken] = useState('');
  const [msg, setMsg] = useState('');

  const next = {
    placed: { label: 'Confirm', status: 'confirmed', color: 'from-blue-600 to-blue-500' },
    confirmed: { label: 'Start Preparing', status: 'preparing', color: 'from-orange-500 to-amber-500' },
    preparing: { label: 'Mark Ready ✓', status: 'ready', color: 'from-green-600 to-emerald-500' },
    ready: { label: 'Collected', status: 'collected', color: 'from-purple-600 to-pink-500' },
  };

  const handleCollect = async (e) => {
    e.preventDefault();
    if (!collectToken.trim()) return;
    try {
      await collectByToken(collectToken.trim());
      setMsg(`✅ ${collectToken} collected!`); setCollectToken('');
    } catch (err) { setMsg(`❌ ${err.response?.data?.error || 'Failed'}`); }
    setTimeout(() => setMsg(''), 3000);
  };

  if (loading) return <div className="p-8 text-center"><div className="w-10 h-10 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6 pt-2">
        <h1 className="text-3xl font-black text-white">Live Queue</h1>
        <span className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm font-bold border border-blue-500/20">
          {queue.length}
        </span>
      </div>

      {/* Collect bar */}
      <form onSubmit={handleCollect} className="flex gap-2 mb-4">
        <input type="text" value={collectToken} onChange={(e) => setCollectToken(e.target.value.toUpperCase())}
          placeholder="Scan / enter token"
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-center uppercase text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500/50 outline-none transition" />
        <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/20">
          Collect
        </button>
      </form>
      {msg && <p className="text-sm text-center mb-4 text-gray-300">{msg}</p>}

      {queue.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-3">🍳</p>
          <p className="text-gray-500">No active orders — relax!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((order) => (
            <div key={order._id} className={`bg-white/5 border rounded-2xl p-5 transition ${
              order.isUrgent ? 'border-red-500/40 bg-red-500/5' : 'border-white/10'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-2xl font-mono font-black text-white">{order.token}</span>
                  <span className="text-sm text-gray-600 ml-2">#{order.queuePosition}</span>
                  {order.isUrgent && <span className="text-red-400 text-xs ml-2 font-medium">⚠ URGENT</span>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  order.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'preparing' ? 'bg-orange-500/20 text-orange-400' :
                  order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{order.status.toUpperCase()}</span>
              </div>

              <div className="mb-3 bg-white/5 rounded-xl p-3 space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-300 font-medium">{item.quantity}× {item.menuItem?.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      item.menuItem?.complexity === 'complex' ? 'bg-red-500/10 text-red-400' :
                      item.menuItem?.complexity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>{item.menuItem?.complexity}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 text-xs text-gray-500 mb-4">
                <span>👤 {order.student?.name}</span>
                <span>⏱ {order.waitingMinutes}m ago</span>
                {order.predictedReadyTime && (
                  <span>🎯 {new Date(order.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>

              {next[order.status] && (
                <button onClick={() => updateStatus(order._id, next[order.status].status)}
                  className={`w-full py-3 rounded-xl text-white text-sm font-semibold bg-gradient-to-r ${next[order.status].color} shadow-lg transition-all hover:scale-[1.01]`}>
                  {next[order.status].label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}