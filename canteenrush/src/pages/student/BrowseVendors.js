import React from 'react';
import { Link } from 'react-router-dom';
import { useVendors } from '../../hooks/useVendors';

const VENDOR_COLORS = [
  'from-orange-500 to-red-500',
  'from-yellow-500 to-orange-500',
  'from-red-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-amber-500 to-yellow-600',
  'from-blue-500 to-purple-500',
  'from-pink-500 to-rose-500',
];

export default function BrowseVendors() {
  const { vendors, loading } = useVendors(true);

  const openVendors = vendors.filter((v) => v.isOpen);
  const closedVendors = vendors.filter((v) => !v.isOpen);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-2xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="mb-6 pt-2">
        <h1 className="text-3xl font-black text-white">Vendors</h1>
        <p className="text-gray-500 text-sm mt-1">
          <span className="text-green-400 font-medium">{openVendors.length} open</span> right now
        </p>
      </div>

      {/* Open */}
      <div className="space-y-3 mb-8">
        {openVendors.map((vendor, idx) => (
          <Link
            key={vendor._id}
            to={`/student/vendor/${vendor._id}`}
            className="block group"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-white/20 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${VENDOR_COLORS[idx % VENDOR_COLORS.length]} rounded-xl flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
                  {['🍛', '🥘', '🥡', '🥤', '🍗', '🍕', '🥗'][idx % 7]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition">{vendor.shopName}</h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400 font-medium">Open</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{vendor.location}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full">
                      ⏱ ~{vendor.avgPrepTimeMinutes}m avg
                    </span>
                    <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full">
                      📋 {vendor.currentLoad?.queueDepth || 0} in queue
                    </span>
                    <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full">
                      🕐 {vendor.operatingHours?.open}-{vendor.operatingHours?.close}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Closed */}
      {closedVendors.length > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Currently Closed</p>
          <div className="space-y-2">
            {closedVendors.map((vendor, idx) => (
              <div key={vendor._id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-lg">
                    {['🍛', '🥘', '🥡', '🥤', '🍗'][idx % 5]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-500 text-sm">{vendor.shopName}</h3>
                    <p className="text-xs text-gray-600">Opens at {vendor.operatingHours?.open}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}