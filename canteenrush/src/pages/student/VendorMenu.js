import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendorDetails, useVendorMenu } from '../../hooks/useVendors';
import { usePlaceOrder } from '../../hooks/useOrders';

export default function VendorMenu() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { vendor, loading: vl } = useVendorDetails(vendorId);
  const { items, loading: ml } = useVendorMenu(vendorId);
  const { placeOrder, placing, error } = usePlaceOrder();

  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const addToCart = (item) => {
    setCart((prev) => {
      const ex = prev.find((c) => c._id === item._id);
      if (ex) return prev.map((c) => c._id === item._id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const ex = prev.find((c) => c._id === id);
      if (ex?.qty === 1) return prev.filter((c) => c._id !== id);
      return prev.map((c) => c._id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handleOrder = async () => {
    try {
      const order = await placeOrder(vendorId, cart.map((c) => ({ menuItem: c._id, quantity: c.qty })));
      navigate('/student/order-confirmation', { state: { order } });
    } catch (e) { /* error shown via hook */ }
  };

  const categories = ['all', ...new Set(items.map((i) => i.category))];
  const filtered = activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory);

  if (vl || ml) {
    return (
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white/5 rounded-2xl h-20"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32">
      {/* Vendor Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/student/vendors')} className="text-sm text-blue-400 hover:text-blue-300 mb-3 inline-block">
          ← All vendors
        </button>
        <h1 className="text-2xl font-black text-white">{vendor?.shopName}</h1>
        <p className="text-sm text-gray-500">{vendor?.location}</p>
        <div className="flex gap-2 mt-3">
          <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full">
            ⏱ ~{vendor?.avgPrepTimeMinutes}m avg
          </span>
          <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full">
            📋 {vendor?.currentLoad?.queueDepth || 0} in queue
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
              activeCategory === cat
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const inCart = cart.find((c) => c._id === item._id);
          return (
            <div key={item._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center hover:bg-white/[0.07] transition">
              <div className="flex-1 mr-4">
                <p className="font-medium text-white">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-white">₹{item.price}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500">{item.basePrepTimeMinutes}m</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    item.complexity === 'simple' ? 'bg-green-500/10 text-green-400' :
                    item.complexity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{item.complexity}</span>
                </div>
              </div>

              {inCart ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(item._id)}
                    className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition">−</button>
                  <span className="w-6 text-center font-bold text-white">{inCart.qty}</span>
                  <button onClick={() => addToCart(item)}
                    className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition">+</button>
                </div>
              ) : (
                <button onClick={() => addToCart(item)}
                  className="px-4 py-2 border border-blue-500/50 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/10 transition">
                  Add
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <div className="max-w-2xl mx-auto">
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <button onClick={handleOrder} disabled={placing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3.5 rounded-xl font-semibold disabled:opacity-50 shadow-lg shadow-blue-600/30 flex items-center justify-between px-6 transition-all">
              <span>{placing ? 'Placing...' : `Place Order · ${cartCount} item${cartCount > 1 ? 's' : ''}`}</span>
              <span className="font-bold">₹{cartTotal}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}