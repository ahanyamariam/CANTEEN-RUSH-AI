import React from 'react';
import { Link } from 'react-router-dom';
import { useActiveOrders, useOrderHistory } from '../../hooks/useOrders';

export default function ActiveOrders() {
  const { orders: active, loading: al, cancelOrder } = useActiveOrders();
  const { orders: history, loading: hl } = useOrderHistory();
  const past = history.filter((o) => ['collected', 'cancelled'].includes(o.status));

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <h1 className="text-3xl font-black text-white mb-6 pt-2">My Orders</h1>

      {/* Active */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Active</p>
      {al ? (
        <div className="bg-white/5 rounded-2xl p-8 text-center"><div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div></div>
      ) : active.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center mb-8">
          <p className="text-gray-500">No active orders</p>
          <Link to="/student/vendors" className="text-blue-400 text-sm mt-1 inline-block">Order now →</Link>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {active.map((order) => (
            <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-lg text-white">{order.token}</span>
                  <p className="text-sm text-gray-500">{order.vendor?.shopName}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  order.status === 'ready' ? 'bg-green-500/20 text-green-400 animate-pulse' :
                  order.status === 'preparing' ? 'bg-orange-500/20 text-orange-400' :
                  order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{order.status.toUpperCase()}</span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {order.items.map((item, i) => (
                  <span key={i}>{item.quantity}× {item.menuItem?.name}{i < order.items.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-600">
                  ₹{order.totalPrice}
                  {order.predictedReadyTime && ` · ETA ${new Date(order.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </p>
                {['placed', 'confirmed'].includes(order.status) && (
                  <button onClick={() => cancelOrder(order._id)} className="text-xs text-red-400 hover:text-red-300 transition">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">History</p>
      {hl ? (
        <div className="text-gray-600 text-center py-4">Loading...</div>
      ) : past.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No past orders</p>
      ) : (
        <div className="space-y-2">
          {past.slice(0, 10).map((order) => (
            <div key={order._id} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
              <div className="flex justify-between">
                <div>
                  <span className="font-mono text-sm font-medium text-gray-400">{order.token}</span>
                  <span className="text-xs text-gray-600 ml-2">{order.vendor?.shopName}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  order.status === 'collected' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>{order.status}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{new Date(order.placedAt).toLocaleDateString()} · ₹{order.totalPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}