import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, useAuth } from '../../context/AppContext';
import { Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

export default function Cart() {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  const cartTotal = state.cart.reduce((s, c) => s + (c.price || 0) * (c.qty || 0), 0);

  const handlePlaceOrder = async () => {
    if (state.cart.length === 0 || !state.selectedVendorId) return;
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        vendorId: state.selectedVendorId,
        items: state.cart.map(c => ({ menuItem: c._id, quantity: c.qty })),
      });
      dispatch({ type: 'CLEAR_CART' });
      navigate(`/student/order-confirmation`, { state: { order: data.order } });
    } catch (err) {
      setError(`[SYNC_ERROR] ${err.response?.data?.error || 'DEPLOYMENT_FAILED'}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-12 pb-40">
      <header className="mb-10 border-b border-ferro-black/10 pb-6">
        <span className="text-[10px] font-black tracking-[0.4em] text-ferro-black/40 uppercase">Order_Manifest</span>
        <h1 className="text-4xl font-black tracking-tighter uppercase mt-2">Cart / Verification</h1>
      </header>

      <div className="grid gap-px bg-ferro-black/10 border border-ferro-black/10 mb-10">
        {state.cart.map((item) => (
          <div key={item._id} className="bg-white p-6 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-black uppercase tracking-tight text-ferro-black">{item.name}</h3>
              <p className="text-[10px] font-bold text-ferro-black/40 mt-1 uppercase">Unit_Price / ₹{item.price}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-ferro-offwhite border border-ferro-black/10 p-1">
                <button onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item._id })} className="p-2 hover:text-red-600 transition-colors">
                  {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                </button>
                <span className="w-8 text-center text-xs font-black">{item.qty}</span>
                <button onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })} className="p-2 hover:text-ferro-orange transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-sm font-black w-20 text-right">₹{item.price * item.qty}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY_BLOCK */}
      <div className="bg-ferro-black text-white p-10 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Aggregate_Total</p>
          <p className="text-5xl font-black tracking-tighter text-ferro-orange">₹{cartTotal}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Platform_Fee</p>
          <p className="text-xl font-black text-white">0.00</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-ferro-black/10 z-50">
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="max-w-5xl mx-auto w-full bg-ferro-orange text-white py-5 font-black text-lg uppercase tracking-tighter flex justify-between items-center px-10 hover:bg-ferro-black transition-colors disabled:opacity-50"
        >
          {placing ? 'INITIALIZING_DEPLOYMENT...' : 'Confirm_and_Deploy_Order [ → ]'}
          <span className="font-mono text-xl">₹{cartTotal}</span>
        </button>
      </div>
    </div>
  );
}