import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, useAuth } from '../../context/AppContext';
import { MapPin, Clock, ChevronRight, Search, Zap, Users } from 'lucide-react';

export default function StudentHome() {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Filter vendors based on search
  const filteredVendors = state.vendors.filter(v => {
    const shopName = v.shopName || '';
    const location = v.location || '';
    const searchLower = search.toLowerCase();
    return shopName.toLowerCase().includes(searchLower) ||
      location.toLowerCase().includes(searchLower);
  });

  const handleSelectVendor = (vendorId) => {
    dispatch({ type: 'SELECT_VENDOR', payload: vendorId });
    navigate(`/student/menu/${vendorId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hey, {user?.name || 'there'} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Pre-order now, skip the queue later</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search vendors or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
        />
      </div>

      {/* Loading state */}
      {state.vendors.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🍽️</div>
          <p>Loading vendors...</p>
        </div>
      )}

      {/* Vendor grid */}
      <div className="grid gap-4">
        {filteredVendors.map((vendor, i) => {
          const queueDepth = vendor.currentLoad?.queueDepth || 0;
          const maxConcurrent = vendor.maxConcurrentOrders || 5;
          const busyLevel = queueDepth >= maxConcurrent ? 'busy'
            : queueDepth >= maxConcurrent * 0.6 ? 'moderate'
              : 'free';

          return (
            <button
              key={vendor._id}
              onClick={() => vendor.isOpen && handleSelectVendor(vendor._id)}
              disabled={!vendor.isOpen}
              className={`group bg-white rounded-2xl p-4 border border-gray-100 text-left transition-all animate-slide-up hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 active:scale-[0.99] ${!vendor.isOpen ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  🍽️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {vendor.shopName}
                    </h3>
                    {!vendor.isOpen && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Closed</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{vendor.location || 'Campus'}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      ~{vendor.avgPrepTimeMinutes || 10} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {queueDepth} in queue
                    </span>
                    {vendor.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {vendor.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${busyLevel === 'busy' ? 'bg-red-50 text-red-600'
                      : busyLevel === 'moderate' ? 'bg-amber-50 text-amber-600'
                        : 'bg-green-50 text-green-600'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${busyLevel === 'busy' ? 'bg-red-500' : busyLevel === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                    {busyLevel === 'busy' ? 'Busy' : busyLevel === 'moderate' ? 'Moderate' : 'Low Wait'}
                  </span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}