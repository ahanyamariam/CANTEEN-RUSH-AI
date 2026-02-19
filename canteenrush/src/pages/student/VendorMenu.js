import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendorDetails, useVendorMenu } from '../../hooks/useVendors';
import { usePlaceOrder } from '../../hooks/useOrders';

export default function VendorMenu() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { vendor } = useVendorDetails(vendorId);
  const { items } = useVendorMenu(vendorId);
  const { placeOrder, placing } = usePlaceOrder();

  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const ex = prev.find((c) => c._id === item._id);
      return ex ? prev.map((c) => c._id === item._id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const ex = prev.find((c) => c._id === id);
      return ex?.qty === 1 ? prev.filter((c) => c._id !== id) : prev.map((c) => c._id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const handleOrder = async () => {
    try {
      const order = await placeOrder(vendorId, cart.map((c) => ({ menuItem: c._id, quantity: c.qty })));
      navigate('/student/order-confirmation', { state: { order } });
    } catch (e) { /* error handled by hook */ }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-12 pb-32">
      <div className="bg-ferro-black text-white p-10 mb-10 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase">Provider_Specification</span>
          <h1 className="text-5xl font-black tracking-tighter uppercase mt-2">{vendor?.shopName}</h1>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-ferro-orange">{vendor?.avgPrepTimeMinutes}M</p>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Avg_Latency</p>
        </div>
      </div>

      <div className="grid gap-px bg-ferro-black/10 border border-ferro-black/10">
        {items.map((item) => {
          const inCart = cart.find((c) => c._id === item._id);
          return (
            <div key={item._id} className="bg-white p-8 flex justify-between items-center group hover:bg-ferro-offwhite transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="font-black text-sm uppercase tracking-tight">{item.name}</h3>
                  <span className={`text-[8px] font-black px-2 py-0.5 border ${
                    item.complexity === 'high' ? 'border-ferro-orange text-ferro-orange' : 'border-ferro-black/20 text-ferro-black/40'
                  }`}>CX_{item.complexity?.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-black text-ferro-black">₹{item.price}</span>
                  <span className="text-[9px] font-bold text-ferro-black/40 uppercase tracking-widest">Base_Prep / {item.basePrepTimeMinutes}M</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {inCart ? (
                  <div className="flex items-center bg-ferro-black text-white">
                    <button onClick={() => removeFromCart(item._id)} className="px-4 py-2 hover:bg-ferro-orange transition-colors">−</button>
                    <span className="w-8 text-center text-xs font-black font-mono">{inCart.qty}</span>
                    <button onClick={() => addToCart(item)} className="px-4 py-2 hover:bg-ferro-orange transition-colors">+</button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(item)} className="bg-ferro-black text-white text-[10px] font-black px-8 py-3 hover:bg-ferro-orange transition-colors">
                    ADD_UNIT [+]
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-ferro-black/10 z-40">
          <div className="max-w-5xl mx-auto">
            <button onClick={handleOrder} disabled={placing}
              className="w-full bg-ferro-orange text-white py-5 font-black text-lg uppercase tracking-tighter flex justify-between items-center px-10 hover:bg-ferro-black transition-colors">
              <span>{placing ? 'INITIALIZING_DEPLOYMENT...' : 'Confirm_and_Deploy_Order [ → ]'}</span>
              <span className="font-mono">₹{cartTotal}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}