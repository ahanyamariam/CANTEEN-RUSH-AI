import React from 'react';
import { Link } from 'react-router-dom';
import { useActiveOrders, useOrderHistory } from '../../hooks/useOrders';

export default function ActiveOrders() {
  const { orders: active, loading: al, cancelOrder } = useActiveOrders();
  const { orders: history } = useOrderHistory();

  const past = history.filter((o) => ['collected', 'cancelled'].includes(o.status));

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 pb-24 bg-ferro-offwhite">
      <header className="mb-12 border-b border-ferro-black/10 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black tracking-[0.4em] text-ferro-black/30 uppercase">Log_Registry</span>
          <h1 className="text-5xl font-black tracking-tighter uppercase mt-2">Transaction<br />Monitor</h1>
        </div>
      </header>

      {/* ACTIVE_JOBS SECTION */}
      <section className="mb-16">
        <h2 className="text-[10px] font-black text-ferro-orange uppercase tracking-[0.3em] mb-6">/ ACTIVE_JOBS</h2>
        {al ? (
          <div className="p-10 border border-ferro-black/5 text-[10px] font-black italic">SCANNING_ACTIVE_NODES...</div>
        ) : active.length === 0 ? (
          <div className="p-10 border border-dashed border-ferro-black/20 text-center">
            <p className="text-[10px] font-black text-ferro-black/40 uppercase">No Active Transactions Detected</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {active.map((order) => (
              <div key={order._id} className="bg-white border border-ferro-black/10 p-6 flex justify-between items-center group hover:border-ferro-black transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black tracking-widest text-ferro-black">{order.token}</span>
                    <span className={`text-[9px] font-black px-2 py-1 uppercase tracking-widest ${order.status === 'ready' ? 'bg-ferro-orange text-white animate-pulse' : 'bg-ferro-black text-white'
                      }`}>{order.status}</span>
                  </div>
                  <p className="text-[10px] font-bold text-ferro-black/40 mt-2 uppercase tracking-widest">
                    {order.vendor?.shopName} / {order.items.length} UNITS
                  </p>
                </div>

                <div className="text-right flex flex-col items-end gap-3">
                  <Link to={`/student/track/${order.token}`} className="text-[10px] font-black text-ferro-black underline underline-offset-4 hover:text-ferro-orange uppercase">View_Details</Link>
                  {['placed', 'confirmed'].includes(order.status) && (
                    <button onClick={() => cancelOrder(order._id)} className="text-[9px] font-black text-red-600 uppercase hover:underline">Abort_Order [X]</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ARCHIVED_DATA SECTION */}
      <section>
        <h2 className="text-[10px] font-black text-ferro-black/40 uppercase tracking-[0.3em] mb-6">/ ARCHIVED_DATA</h2>
        <div className="bg-white border border-ferro-black/10 divide-y divide-ferro-black/5">
          {past.map((order) => (
            <div key={order._id} className="p-4 flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-xs font-black text-ferro-black font-mono tracking-tighter">{order.token} / {order.vendor?.shopName}</span>
              <div className="text-right">
                <span className="text-[9px] font-bold text-ferro-black/40 uppercase">{order.status} / ₹{order.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}