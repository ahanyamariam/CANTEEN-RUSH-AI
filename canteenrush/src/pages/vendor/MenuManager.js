import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useManageMenu } from '../../hooks/useVendors';

export default function MenuManager() {
  const { user } = useAuth();
  const { items, fetchMenu, toggleAvailability } = useManageMenu();
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (user?.vendorProfile) {
      fetchMenu(user.vendorProfile);
    }
  }, [user, fetchMenu]);

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 pb-24">
      <header className="flex justify-between items-end mb-16 border-b border-ferro-black/10 pb-8">
        <div>
          <span className="text-[10px] font-black tracking-[0.4em] text-ferro-black/40 uppercase">Provisioning_Module</span>
          <h1 className="text-5xl font-black tracking-tighter uppercase mt-2">Inventory</h1>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className={`px-10 py-3 text-[10px] font-black tracking-widest uppercase transition-colors ${showAdd ? 'bg-ferro-black text-white' : 'bg-ferro-orange text-white'
            }`}>
          {showAdd ? 'CLOSE_MANIFEST' : 'ADD_NEW_UNIT [+]'}
        </button>
      </header>

      {/* Grid-based Item List */}
      <div className="grid gap-px bg-ferro-black/10 border border-ferro-black/10">
        {items.map((item) => (
          <div key={item._id} className={`bg-white p-8 flex justify-between items-center group ${!item.isAvailable ? 'opacity-30' : ''}`}>
            <div>
              <p className="text-2xl font-black uppercase tracking-tight text-ferro-black group-hover:text-ferro-orange transition-colors">{item.name}</p>
              <div className="flex gap-6 mt-3 text-[9px] font-black text-ferro-black/40 uppercase tracking-widest">
                <span>PRICE / ₹{item.price}</span>
                <span>LATENCY / {item.basePrepTimeMinutes}M</span>
                <span className={`px-2 py-0.5 border ${item.complexity === 'complex' ? 'border-ferro-orange text-ferro-orange' : 'border-ferro-black/20'}`}>
                  CX_{item.complexity?.toUpperCase()}
                </span>
              </div>
            </div>
            <button onClick={() => toggleAvailability(item._id)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-colors ${item.isAvailable ? 'border-ferro-black text-ferro-black hover:bg-ferro-black hover:text-white' : 'border-ferro-orange text-ferro-orange'
                }`}>
              {item.isAvailable ? 'OFFLINE_MODE' : 'ONLINE_MODE'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}