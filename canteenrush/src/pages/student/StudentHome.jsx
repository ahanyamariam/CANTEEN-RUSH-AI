import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, useAuth } from '../../context/AppContext';

export default function StudentHome() {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredVendors = state.vendors.filter(v => {
    const shopName = v.shopName || '';
    const location = v.location || '';
    return shopName.toLowerCase().includes(search.toLowerCase()) ||
           location.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelectVendor = (vendorId) => {
    dispatch({ type: 'SELECT_VENDOR', payload: vendorId });
    navigate(`/student/menu/${vendorId}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-12 pb-24">
      <header className="mb-12 border-b border-ferro-black/10 pb-8">
        <span className="text-[10px] font-black tracking-[0.4em] text-ferro-black/40 uppercase">Network_Protocol</span>
        <h1 className="text-5xl font-black tracking-tighter uppercase mt-2">Service<br />Nodes</h1>
      </header>

      <div className="mb-10">
        <input
          type="text"
          placeholder="SEARCH_FOR_LOCATION_OR_PROVIDER..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-b-2 border-ferro-black py-4 text-2xl font-black outline-none placeholder:text-ferro-black/10 uppercase tracking-tighter"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map((vendor, i) => {
          const queueDepth = vendor.currentLoad?.queueDepth || 0;
          const maxConcurrent = vendor.maxConcurrentOrders || 5;
          const busyLevel = queueDepth >= maxConcurrent ? 'HIGH_WAIT' : 'LOW_WAIT';

          return (
            <button
              key={vendor._id}
              onClick={() => vendor.isOpen && handleSelectVendor(vendor._id)}
              disabled={!vendor.isOpen}
              className={`bg-white border border-ferro-black/10 p-8 text-left transition-colors hover:border-ferro-orange group ${!vendor.isOpen ? 'opacity-30' : ''}`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-black text-ferro-black/20 uppercase tracking-widest">NODE / 0{i + 1}</span>
                <span className={`text-[9px] font-black px-2 py-1 uppercase tracking-widest ${
                  busyLevel === 'HIGH_WAIT' ? 'bg-ferro-orange text-white' : 'bg-ferro-black text-white'
                }`}>{busyLevel}</span>
              </div>

              <h3 className="text-2xl font-black tracking-tight uppercase group-hover:text-ferro-orange transition-colors">
                {vendor.shopName}
              </h3>
              <p className="text-[10px] font-bold text-ferro-black/40 mt-1 uppercase tracking-widest">{vendor.location}</p>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-ferro-black/5">
                <div>
                  <p className="text-[8px] font-black text-ferro-black/30 uppercase">Queue_Load</p>
                  <p className="text-xs font-black">{queueDepth} UNITS</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-ferro-black/30 uppercase">Avg_Latency</p>
                  <p className="text-xs font-black">{vendor.avgPrepTimeMinutes} MIN</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}