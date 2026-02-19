import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, History } from 'lucide-react';
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
        console.error('[NETWORK] DATA_LOG_FETCH_FAILED', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const mins = Math.floor((new Date() - new Date(dateStr)) / 60000);
    if (mins < 60) return `${mins}M_AGO`;
    return `${Math.floor(mins / 60)}H_AGO`;
  };

  if (loading) return <div className="p-20 text-center font-black text-[10px]">SCANNING_HISTORY...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 pb-24">
      <header className="mb-12 border-b border-ferro-black/10 pb-8">
        <span className="text-[10px] font-black tracking-[0.4em] text-ferro-black/40 uppercase">Archival_Storage</span>
        <h1 className="text-5xl font-black tracking-tighter uppercase mt-2 text-ferro-black">Transaction<br />Registry</h1>
      </header>

      {orders.length === 0 ? (
        <div className="p-20 border border-dashed border-ferro-black/20 text-center">
          <p className="text-[10px] font-black text-ferro-black/40 uppercase">No Data Found</p>
        </div>
      ) : (
        <div className="grid gap-px bg-ferro-black/10 border border-ferro-black/10">
          {orders.map((order, i) => (
            <button
              key={order._id}
              onClick={() => navigate(`/student/track/${order.token}`)}
              className="bg-white p-6 text-left flex justify-between items-center group hover:bg-ferro-offwhite transition-colors"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black font-mono tracking-tighter text-ferro-black">{order.token}</span>
                  <span className={`text-[8px] font-black px-2 py-0.5 border ${
                    order.status === 'collected' ? 'border-ferro-black/20 text-ferro-black/40' : 'border-ferro-orange text-ferro-orange'
                  }`}>
                    {order.status?.toUpperCase()}
                  </span>
                </div>
                <p className="text-[9px] font-bold text-ferro-black/40 mt-1 uppercase tracking-widest">
                  Node / {order.vendor?.shopName} · {timeAgo(order.placedAt)}
                </p>
              </div>
              <ArrowRight size={16} className="text-ferro-black/20 group-hover:text-ferro-orange group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}