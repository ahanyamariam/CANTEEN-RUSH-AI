import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useActiveOrders } from '../../hooks/useOrders';
import ChatBot from '../../components/ChatBot';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { orders, loading } = useActiveOrders();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'MORNING_SYNC';
    if (h < 17) return 'AFTERNOON_SYNC';
    return 'EVENING_SYNC';
  };

  return (
    
    <div className="max-w-4xl mx-auto p-6 lg:p-12 pb-24">
      <header className="mb-12 border-b border-ferro-black/10 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black tracking-[0.4em] text-ferro-orange uppercase">{greeting()}</span>
          <h1 className="text-6xl font-black tracking-tighter uppercase mt-2">
            HELLO / {user?.name?.split(' ')[0]}
          </h1>
        </div>
      </header>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        <Link to="/student/vendors" className="bg-ferro-mint p-10 flex flex-col justify-between aspect-video border border-ferro-black/5 hover:bg-white transition-colors group">
          <span className="text-[10px] font-black text-ferro-black/20 uppercase tracking-widest">PROTOCOL / 01</span>
          <div>
            <p className="text-3xl font-black uppercase tracking-tighter group-hover:text-ferro-orange transition-colors">Order_Now</p>
            <p className="text-[10px] font-bold text-ferro-black/40 mt-1 uppercase tracking-widest">Access Service Nodes</p>
          </div>
        </Link>
        <Link to="/student/track" className="bg-ferro-black text-white p-10 flex flex-col justify-between aspect-video group">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">PROTOCOL / 02</span>
          <div>
            <p className="text-3xl font-black uppercase tracking-tighter group-hover:text-ferro-orange transition-colors">Track_Order</p>
            <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">Real-time Telemetry</p>
          </div>
        </Link>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black text-ferro-black/30 uppercase tracking-[0.4em]">Active_Transactions</h2>
          {orders.length > 0 && (
            <Link to="/student/orders" className="text-[10px] font-black text-ferro-orange uppercase underline underline-offset-4">Archived_Logs</Link>
          )}
        </div>

        {loading ? (
          <div className="p-12 border border-ferro-black/5 text-[10px] font-black text-ferro-black/20 italic tracking-widest uppercase">SCANNING_NETWORK...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 border border-dashed border-ferro-black/20 text-center">
            <p className="text-[10px] font-black text-ferro-black/40 uppercase">No Active Data Detected</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-ferro-black/10 p-8 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black tracking-widest font-mono text-ferro-black">{order.token}</span>
                    <span className={`text-[9px] font-black px-2 py-1 uppercase tracking-widest ${
                      order.status === 'ready' ? 'bg-ferro-orange text-white animate-pulse' : 'bg-ferro-black text-white'
                    }`}>{order.status}</span>
                  </div>
                  <p className="text-[10px] font-bold text-ferro-black/40 mt-2 uppercase tracking-widest">
                    NODE / {order.vendor?.shopName}
                  </p>
                </div>
                
                {order.predictedReadyTime && order.status !== 'ready' && (
                  <div className="text-right">
                    <p className="text-[9px] font-black text-ferro-black/30 uppercase">Estimated_Ready</p>
                    <p className="text-2xl font-black text-ferro-orange">
                      {new Date(order.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <ChatBot />
    </div>
  );
}