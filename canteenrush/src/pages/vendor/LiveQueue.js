import React, { useState } from 'react';
import { useVendorQueue } from '../../hooks/useOrders';

export default function LiveQueue() {
  const { queue, updateStatus, collectByToken } = useVendorQueue();
  const [collectToken, setCollectToken] = useState('');

  const next = {
    placed: { label: 'CONFIRM_ORDER', status: 'confirmed', bg: 'bg-ferro-black' },
    confirmed: { label: 'START_PRODUCTION', status: 'preparing', bg: 'bg-ferro-black' },
    preparing: { label: 'MARK_AS_READY', status: 'ready', bg: 'bg-ferro-orange' },
    ready: { label: 'ARCHIVE_COLLECTION', status: 'collected', bg: 'bg-ferro-mint text-ferro-black' },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 pb-24">
      <header className="flex justify-between items-center mb-10 border-b border-ferro-black/10 pb-8">
        <h1 className="text-5xl font-black tracking-tighter uppercase text-ferro-black">Live_Stream</h1>
        <div className="text-right">
          <p className="text-3xl font-black text-ferro-orange leading-none">{queue.length}</p>
          <p className="text-[10px] font-black text-ferro-black/40 uppercase tracking-widest mt-1">ACTIVE_UNITS</p>
        </div>
      </header>

      {/* Collect Bar - Industrial Input */}
      <form onSubmit={(e) => { e.preventDefault(); collectByToken(collectToken.toUpperCase()); setCollectToken(''); }} className="flex mb-10">
        <input type="text" value={collectToken} onChange={(e) => setCollectToken(e.target.value)}
          placeholder="INPUT_COLLECTION_TOKEN_ID"
          className="flex-1 bg-ferro-mint border-none p-6 text-xl font-black uppercase tracking-widest placeholder:text-ferro-black/20 outline-none" />
        <button type="submit" className="bg-ferro-black text-white px-10 font-black text-xs uppercase tracking-widest hover:bg-ferro-orange transition-colors">
          VERIFY
        </button>
      </form>

      {queue.length === 0 ? (
        <div className="p-20 border border-dashed border-ferro-black/20 text-center">
          <p className="text-[10px] font-black text-ferro-black/40 uppercase tracking-[0.4em]">SYSTEM_IDLE / NO_PENDING_UNITS</p>
        </div>
      ) : (
        <div className="grid gap-px bg-ferro-black/10 border border-ferro-black/10">
          {queue.map((order) => (
            <div key={order._id} className="bg-white p-8 group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-ferro-black/30 uppercase tracking-widest">UNIT / {order.token}</span>
                  <div className="flex items-center gap-4 mt-2">
                    <h2 className="text-5xl font-black tracking-tighter text-ferro-black uppercase">{order.student?.name}</h2>
                    <span className="text-[10px] font-black border border-ferro-black px-2 py-1">POS_{order.queuePosition}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black px-4 py-1 uppercase tracking-widest ${order.status === 'ready' ? 'bg-ferro-orange text-white animate-pulse' : 'bg-ferro-mint text-ferro-black'
                    }`}>{order.status}</span>
                  <p className="text-[10px] font-bold text-ferro-black/40 mt-2 uppercase tracking-widest">{order.waitingMinutes}M_ELAPSED</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-ferro-black/30 uppercase tracking-[0.2em] mb-3">MANIFEST</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs font-bold uppercase tracking-tight border-b border-ferro-black/5 pb-2">
                      <span>{item.quantity}X {item.menuItem?.name}</span>
                      <span className="text-[9px] text-ferro-orange opacity-60">CX_{item.menuItem?.complexity?.toUpperCase()}</span>
                    </div>
                  ))}
                </div>

                {next[order.status] && (
                  <button onClick={() => updateStatus(order._id, next[order.status].status)}
                    className={`w-full py-5 font-black text-white text-[10px] uppercase tracking-[0.3em] transition-colors ${next[order.status].bg}`}>
                    {next[order.status].label} [→]
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}