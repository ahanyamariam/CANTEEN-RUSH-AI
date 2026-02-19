import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVendorQueue } from '../../hooks/useOrders';
import api from '../../api/axios';

export default function VendorDashboard() {
  const { user } = useAuth();
  const { queue } = useVendorQueue();
  const [isOpen, setIsOpen] = useState(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (user?.vendorProfile) {
      api.get(`/vendors/${user.vendorProfile}`).then((r) => setIsOpen(r.data.vendor.isOpen));
    }
  }, [user]);

  const toggleShop = async () => {
    setToggling(true);
    try {
      const { data } = await api.patch('/vendors/toggle-status');
      setIsOpen(data.vendor.isOpen);
    } finally { setToggling(false); }
  };

  const counts = {
    new: queue.filter(o => o.status === 'placed').length,
    preparing: queue.filter(o => o.status === 'preparing' || o.status === 'confirmed').length,
    ready: queue.filter(o => o.status === 'ready').length,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 pb-24">
      {/* Header Protocol */}
      <header className="flex justify-between items-end mb-16 border-b border-ferro-black/10 pb-10">
        <div>
          <span className="text-[10px] font-black tracking-[0.4em] text-ferro-black/40 uppercase">Terminal_v2.0</span>
          <h1 className="text-6xl font-black tracking-tighter uppercase mt-2">{user?.shopName || 'STORE_NODE'}</h1>
        </div>
        <button onClick={toggleShop} disabled={toggling}
          className={`px-8 py-3 text-[10px] font-black tracking-widest transition-colors ${isOpen ? 'bg-ferro-orange text-white' : 'bg-ferro-black text-white'
            }`}>
          {toggling ? 'SYNCING...' : isOpen ? 'STATUS / ONLINE' : 'STATUS / OFFLINE'}
        </button>
      </header>

      {/* Operation Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ferro-black/10 border border-ferro-black/10 mb-10">
        <div className="bg-white p-10">
          <p className="text-[10px] font-black text-ferro-black/30 uppercase tracking-widest mb-6">/ INCOMING_LOAD</p>
          <p className="text-7xl font-black text-ferro-black tracking-tighter">{counts.new}</p>
          <Link to="/vendor/queue" className="text-[10px] font-black text-ferro-orange uppercase mt-8 inline-block underline underline-offset-4">Process_Now [→]</Link>
        </div>
        <div className="bg-ferro-mint p-10">
          <p className="text-[10px] font-black text-ferro-black/30 uppercase tracking-widest mb-6">/ ACTIVE_PREP</p>
          <p className="text-7xl font-black text-ferro-black tracking-tighter">{counts.preparing}</p>
          <Link to="/vendor/queue" className="text-[10px] font-black text-ferro-black uppercase mt-8 inline-block underline underline-offset-4">Manage_Queue [→]</Link>
        </div>
        <div className="bg-white p-10">
          <p className="text-[10px] font-black text-ferro-black/30 uppercase tracking-widest mb-6">/ DISPATCH_READY</p>
          <p className="text-7xl font-black text-ferro-orange tracking-tighter">{counts.ready}</p>
          <Link to="/vendor/queue" className="text-[10px] font-black text-ferro-black uppercase mt-8 inline-block underline underline-offset-4">Clear_Station [→]</Link>
        </div>
      </div>

      {/* System Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/vendor/analytics" className="bg-ferro-black text-white p-12 group">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Module / 01</span>
          <h3 className="text-3xl font-black mt-6 group-hover:text-ferro-orange transition-colors uppercase italic tracking-tighter">AI_Insights_Lab</h3>
          <p className="text-xs font-bold text-white/40 mt-2 uppercase">Neural accuracy and demand metrics</p>
        </Link>
        <Link to="/vendor/menu" className="bg-ferro-mint p-12 group border border-ferro-black/5">
          <span className="text-[10px] font-black text-ferro-black/20 uppercase tracking-[0.3em]">Module / 02</span>
          <h3 className="text-3xl font-black mt-6 group-hover:text-ferro-orange transition-colors uppercase italic tracking-tighter">Provisioning_Core</h3>
          <p className="text-xs font-bold text-ferro-black/40 mt-2 uppercase">Inventory and complexity management</p>
        </Link>
      </div>
    </div>
  );
}