import React, { useState } from 'react';
import { useVendors, useVendorMenu } from '../../hooks/useVendors';
import { usePlaceOrder } from '../../hooks/useOrders';

export default function OrderPage() {
  const { vendors, loading: vl } = useVendors();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const { items, loading: ml } = useVendorMenu(selectedVendor?._id);
  const { placeOrder, placing, error } = usePlaceOrder();
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c._id === item._id);
      return existing 
        ? prev.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { ...item, qty: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-ferro-offwhite p-6 lg:p-12">
      <header className="mb-12 border-b border-ferro-black/10 pb-8">
        <span className="text-[10px] font-black tracking-[0.4em] text-ferro-black/40 uppercase">Terminal_v2.6</span>
        <h1 className="text-5xl font-black tracking-tighter uppercase mt-2">Technical<br />Ordering</h1>
      </header>

      {!selectedVendor ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map(v => (
            <button key={v._id} onClick={() => setSelectedVendor(v)} className="bg-white p-8 border border-ferro-black/10 text-left group hover:border-ferro-orange">
              <span className="text-[10px] font-black text-ferro-black/20 uppercase">NODE_ID / {v.shopCode || 'N/A'}</span>
              <h3 className="text-2xl font-black uppercase mt-2 group-hover:text-ferro-orange transition-colors">{v.shopName}</h3>
              <p className="text-[10px] font-bold text-ferro-black/40 mt-1 uppercase tracking-widest">{v.location}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <button onClick={() => { setSelectedVendor(null); setCart([]); }} className="text-[10px] font-black uppercase text-ferro-orange mb-8 tracking-widest hover:underline">← Reset_Selection</button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* ITEM_SELECTION */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-ferro-black/40">Select_Units</h2>
              {items.map(item => (
                <div key={item._id} className="bg-white p-6 border border-ferro-black/10 flex justify-between items-center">
                  <div>
                    <p className="font-black text-sm uppercase">{item.name}</p>
                    <p className="text-[10px] font-bold text-ferro-black/40">₹{item.price} / CX_{item.complexity?.toUpperCase()}</p>
                  </div>
                  <button onClick={() => addToCart(item)} className="bg-ferro-black text-white px-4 py-2 text-[10px] font-black hover:bg-ferro-orange">ADD [+]</button>
                </div>
              ))}
            </div>

            {/* CART_PREVIEW */}
            <div className="bg-ferro-black text-white p-10 h-fit sticky top-24">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/40 underline underline-offset-8">Order_Manifest</h2>
              <div className="space-y-4 mb-8">
                {cart.map(c => (
                  <div key={c._id} className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                    <span>{c.qty}X {c.name}</span>
                    <span>₹{c.price * c.qty}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                <div>
                  <p className="text-[8px] font-bold text-white/40 uppercase">Total_Value</p>
                  <p className="text-4xl font-black text-ferro-orange">₹{cart.reduce((s, c) => s + c.price * c.qty, 0)}</p>
                </div>
                <button className="bg-ferro-orange text-white px-8 py-3 text-[10px] font-black hover:bg-white hover:text-ferro-black transition-colors">DEPLOY</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}