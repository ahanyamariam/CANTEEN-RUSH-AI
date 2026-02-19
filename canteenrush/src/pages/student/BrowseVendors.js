import React from 'react';
import { Link } from 'react-router-dom';
import { useVendors } from '../../hooks/useVendors';

export default function BrowseVendors() {
  const { vendors, loading } = useVendors(true);
  const open = vendors.filter((v) => v.isOpen);

  if (loading) return <div className="p-10 animate-pulse text-[10px] font-black">SCANNING_NETWORK...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 pb-24">
      <header className="mb-12 border-b border-ferro-black/10 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black tracking-[0.3em] text-ferro-black/40">NODE_DIRECTORY</span>
          <h1 className="text-5xl font-black tracking-tighter uppercase mt-2">Active<br />Vendors</h1>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-ferro-orange">{open.length}</p>
          <p className="text-[9px] font-bold text-ferro-black/40 uppercase">Online_Nodes</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((vendor, idx) => (
          <Link key={vendor._id} to={`/student/vendor/${vendor._id}`} className={`group relative p-8 border transition-colors ${
            vendor.isOpen ? 'bg-white border-ferro-black/10 hover:border-ferro-orange' : 'bg-ferro-mint/20 border-transparent opacity-50'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-black text-ferro-black/20">NODE / 0{idx + 1}</span>
              {vendor.isOpen ? (
                <div className="flex items-center gap-1.5 bg-ferro-orange/10 text-ferro-orange px-2 py-1">
                  <div className="w-1 h-1 bg-ferro-orange animate-pulse" />
                  <span className="text-[9px] font-black uppercase">Online</span>
                </div>
              ) : (
                <span className="text-[9px] font-black uppercase text-ferro-black/40">Offline</span>
              )}
            </div>

            <h3 className="text-2xl font-black tracking-tight uppercase group-hover:text-ferro-orange transition-colors">
              {vendor.shopName}
            </h3>
            <p className="text-[10px] font-bold text-ferro-black/40 mt-1 uppercase tracking-widest">{vendor.location}</p>

            <div className="mt-8 flex gap-4 border-t border-ferro-black/5 pt-6">
              <div>
                <p className="text-[8px] font-black text-ferro-black/30 uppercase">Avg_Prep</p>
                <p className="text-xs font-black">{vendor.avgPrepTimeMinutes}M</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-ferro-black/30 uppercase">Load_Depth</p>
                <p className="text-xs font-black">{vendor.currentLoad?.queueDepth || 0}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}