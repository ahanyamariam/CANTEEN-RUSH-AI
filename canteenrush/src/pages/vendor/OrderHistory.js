import React, { useState } from 'react';
import { useVendorHistory } from '../../hooks/useOrders';

export default function OrderHistory() {
  const [days, setDays] = useState(7);
  const { orders, stats, loading } = useVendorHistory(days);

  if (loading) return <div className="p-8 text-center"><div className="w-10 h-10 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <h1 className="text-3xl font-black text-white mb-6 pt-2">History</h1>

      <div className="flex gap-2 mb-6">
        {[1, 7, 14, 30].map((d) => (
          <button key={d} onClick={() => setDays(d)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              days === d ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}>
            {d === 1 ? 'Today' : `${d}d`}
          </button>
        ))}
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { v: stats.totalOrders, l: 'Total', c: 'white' },
            { v: stats.completed, l: 'Done', c: 'green' },
            { v: stats.cancelled, l: 'Cancelled', c: 'red' },
            { v: `${stats.avgPrepTimeMinutes}m`, l: 'Avg Prep', c: 'blue' },
          ].map((s) => (
            <div key={s.l} className={`bg-${s.c === 'white' ? 'white/5' : `${s.c}-500/10`} border border-${s.c === 'white' ? 'white/10' : `${s.c}-500/20`} rounded-2xl p-3 text-center`}>
              <p className={`text-xl font-black text-${s.c === 'white' ? 'white' : `${s.c}-400`}`}>{s.v}</p>
              <p className="text-xs text-gray-500">{s.l}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {orders.map((order) => (
          <div key={order._id} className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-white text-sm">{order.token}</span>
                <span className="text-xs text-gray-600 ml-2">
                  {order.items.map((i) => `${i.quantity}× ${i.menuItem?.name}`).join(', ')}
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                order.status === 'collected' ? 'bg-green-500/10 text-green-400' :
                order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
              }`}>{order.status}</span>
            </div>
            <div className="flex gap-3 mt-1.5 text-xs text-gray-600">
              <span>{new Date(order.placedAt).toLocaleString()}</span>
              <span>₹{order.totalPrice}</span>
              {order.prediction?.estimatedPrepMinutes && <span>Predicted: {order.prediction.estimatedPrepMinutes}m</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}