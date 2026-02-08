import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import api from '../../api/axios';

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColors = {
    placed: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    collected: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getTimeRemaining = (readyTime) => {
    if (!readyTime) return null;
    const now = new Date();
    const ready = new Date(readyTime);
    const diffMs = ready - now;
    if (diffMs <= 0) return 'Ready!';
    const mins = Math.ceil(diffMs / 60000);
    return `~${mins} min`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4 animate-pulse">📋</div>
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 text-sm mb-6">Your orders will appear here after you place one</p>
        <button
          onClick={() => navigate('/student')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          Browse Vendors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Orders</h1>

      <div className="grid gap-4">
        {orders.map((order, i) => {
          const remaining = getTimeRemaining(order.predictedReadyTime);
          return (
            <button
              key={order._id}
              onClick={() => navigate(`/student/order/${order.token}`)}
              className="bg-white rounded-2xl p-4 border border-gray-100 text-left hover:shadow-md transition-all hover:border-primary/20 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-lg font-mono">{order.token}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    🍽️ {order.vendor?.shopName || 'Vendor'} · {timeAgo(order.placedAt)}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-300 mt-1" />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {order.items?.map(i => i.menuItem?.name || 'Item').join(', ')}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    ₹{order.items?.reduce((s, i) => s + (i.menuItem?.price || 0) * (i.quantity || 1), 0) || 0}
                  </div>
                  {remaining && order.status !== 'collected' && order.status !== 'cancelled' && (
                    <div className="flex items-center gap-1 text-xs text-primary mt-0.5">
                      <Clock size={11} />
                      {remaining}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}