import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useActiveOrders } from '../../hooks/useOrders';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { orders, loading } = useActiveOrders();

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      {/* Header */}
      <div className="mb-8 pt-2">
        <p className="text-gray-500 text-sm">{greeting()}</p>
        <h1 className="text-3xl font-black text-white mt-1">
          Welcome {user?.name?.split(' ')[0]} !!
        </h1>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link
          to="/student/vendors"
          className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 p-5 rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02]"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="text-3xl mb-2">🍽️</div>
          <p className="font-bold text-white text-sm">Order Food</p>
          <p className="text-blue-200 text-xs mt-0.5">Browse vendors & menus</p>
        </Link>
        <Link
          to="/student/track"
          className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-500 p-5 rounded-2xl shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30 transition-all hover:scale-[1.02]"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="text-3xl mb-2">🔍</div>
          <p className="font-bold text-white text-sm">Track Order</p>
          <p className="text-purple-200 text-xs mt-0.5">Enter token to track</p>
        </Link>
      </div>

      {/* Active Orders */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Active Orders</h2>
        {orders.length > 0 && (
          <Link to="/student/orders" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
        )}
      </div>

      {loading ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">🍕</p>
          <p className="text-gray-500">No active orders</p>
          <Link to="/student/vendors" className="text-blue-400 text-sm mt-2 inline-block hover:text-blue-300">
            Browse vendors →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono font-bold text-lg text-white">{order.token}</p>
                  <p className="text-sm text-gray-500">{order.vendor?.shopName}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  order.status === 'ready'
                    ? 'bg-green-500/20 text-green-400 animate-pulse'
                    : order.status === 'preparing'
                    ? 'bg-orange-500/20 text-orange-400'
                    : order.status === 'confirmed'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {order.status === 'ready' ? '✅ READY' : order.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-400">
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.quantity}× {item.menuItem?.name}
                    {i < order.items.length - 1 && ', '}
                  </span>
                ))}
              </div>

              {order.predictedReadyTime && order.status !== 'ready' && (
                <p className="mt-2 text-xs text-blue-400">
                  ⏱ Ready at {new Date(order.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}

              {order.status === 'ready' && (
                <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <p className="text-sm text-green-400 font-medium">
                    🎉 Show token <span className="font-mono font-bold">{order.token}</span> at the counter
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}