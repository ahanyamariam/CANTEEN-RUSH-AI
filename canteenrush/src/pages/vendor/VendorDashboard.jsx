import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVendorQueue } from '../../hooks/useOrders';
import api from '../../api/axios';

export default function VendorDashboard() {
  const { user } = useAuth();
  const { queue, loading } = useVendorQueue();
  const [isOpen, setIsOpen] = useState(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (user?.vendorProfile) {
      api.get(`/vendors/${user.vendorProfile}`).then((r) => setIsOpen(r.data.vendor.isOpen)).catch(console.error);
    }
  }, [user]);

  const toggleShop = async () => {
    setToggling(true);
    try { const { data } = await api.patch('/vendors/toggle-status'); setIsOpen(data.vendor.isOpen); }
    catch (e) { console.error(e); }
    finally { setToggling(false); }
  };

  const counts = {
    placed: queue.filter((o) => o.status === 'placed').length,
    confirmed: queue.filter((o) => o.status === 'confirmed').length,
    preparing: queue.filter((o) => o.status === 'preparing').length,
    ready: queue.filter((o) => o.status === 'ready').length,
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pt-2">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <button onClick={toggleShop} disabled={toggling}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg ${
            isOpen
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-green-500/10 hover:bg-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-red-500/10 hover:bg-red-500/30'
          }`}>
          {toggling ? '...' : isOpen ? '🟢 Open' : '🔴 Closed'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'New', count: counts.placed, color: 'yellow' },
          { label: 'Confirmed', count: counts.confirmed, color: 'blue' },
          { label: 'Preparing', count: counts.preparing, color: 'orange' },
          { label: 'Ready', count: counts.ready, color: 'green' },
        ].map((s) => (
          <div key={s.label} className={`bg-${s.color}-500/10 border border-${s.color}-500/20 rounded-2xl p-3 text-center`}>
            <p className={`text-2xl font-black text-${s.color}-400`}>{s.count}</p>
            <p className={`text-xs text-${s.color}-400/70`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { to: '/vendor/queue', icon: '📋', label: 'Live Queue', color: 'from-blue-600 to-blue-500' },
          { to: '/vendor/menu', icon: '📝', label: 'Menu', color: 'from-green-600 to-emerald-500' },
          { to: '/vendor/analytics', icon: '🤖', label: 'AI Stats', color: 'from-purple-600 to-pink-500' },
        ].map((l) => (
          <Link key={l.to} to={l.to}
            className={`bg-gradient-to-br ${l.color} rounded-2xl p-4 text-center shadow-lg hover:scale-[1.03] transition-transform`}>
            <div className="text-2xl mb-1">{l.icon}</div>
            <p className="text-xs font-semibold text-white">{l.label}</p>
          </Link>
        ))}
      </div>

      {/* Queue preview */}
      <h2 className="text-lg font-bold text-white mb-3">Latest Orders</h2>
      {loading ? (
        <div className="bg-white/5 rounded-2xl p-8 text-center"><div className="w-8 h-8 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div></div>
      ) : queue.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <p className="text-4xl mb-2">🍳</p>
          <p className="text-gray-500">No active orders</p>
        </div>
      ) : (
        <div className="space-y-2">
          {queue.slice(0, 5).map((order) => (
            <div key={order._id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-white">{order.token}</span>
                <span className="text-xs text-gray-600 ml-2">{order.items.length} items · {order.waitingMinutes}m ago</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                order.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                order.status === 'preparing' ? 'bg-orange-500/20 text-orange-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>{order.status}</span>
            </div>
          ))}
          {queue.length > 5 && (
            <Link to="/vendor/queue" className="block text-center text-blue-400 text-sm py-2 hover:text-blue-300">
              View all {queue.length} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}