import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Minus, Search, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

export default function Menu() {
  const { vendorId } = useParams();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    api.get(`/vendors/${vendorId}`).then(r => setVendor(r.data.vendor));
    api.get(`/menu/vendor/${vendorId}`).then(r => setItems(r.data.items || []));
  }, [vendorId]);

  const cartCount = state.cart.reduce((s, c) => s + (c.qty || 0), 0);
  const cartTotal = state.cart.reduce((s, c) => s + (c.price || 0) * (c.qty || 0), 0);
  const getQty = (id) => state.cart.find(c => c._id === id)?.qty || 0;

  if (!vendor) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-12 pb-32">
      <div className="bg-ferro-black text-white p-10 mb-10">
        <span className="text-[10px] font-bold text-white/40 tracking-[0.4em] uppercase">Service_Provider</span>
        <h1 className="text-5xl font-black tracking-tighter uppercase mt-2">{vendor.shopName}</h1>
        <div className="flex gap-8 mt-8 border-t border-white/10 pt-8">
          <div>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Base_Wait</p>
            <p className="text-xl font-black">{vendor.avgPrepTimeMinutes} MIN</p>
          </div>
          <div>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Active_Queue</p>
            <p className="text-xl font-black text-ferro-orange">{vendor.currentLoad?.queueDepth || 0} UNITS</p>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-ferro-black/10 border border-ferro-black/10">
        {items.map((item) => {
          const qty = getQty(item._id);
          return (
            <div key={item._id} className="bg-white p-6 flex items-center justify-between group hover:bg-ferro-offwhite transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-black text-sm uppercase tracking-tight">{item.name}</h3>
                  <span className={`text-[8px] font-black px-2 py-0.5 border ${
                    item.complexity === 'high' ? 'border-ferro-orange text-ferro-orange' : 'border-ferro-black/20 text-ferro-black/40'
                  }`}>
                    CX_{item.complexity?.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-ferro-black/40 mt-1 uppercase">Unit_Price / ₹{item.price}</p>
              </div>

              <div className="flex items-center gap-4">
                {qty === 0 ? (
                  <button onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
                    className="bg-ferro-black text-white text-[10px] font-black px-6 py-2 hover:bg-ferro-orange transition-colors">
                    ADD_ITEM [+]
                  </button>
                ) : (
                  <div className="flex items-center bg-ferro-black text-white">
                    <button onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item._id })} className="p-2 hover:bg-ferro-orange">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-xs font-black">{qty}</span>
                    <button onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })} className="p-2 hover:bg-ferro-orange">
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-ferro-black/10 z-50">
          <div onClick={() => navigate('/student/cart')} 
            className="max-w-5xl mx-auto bg-ferro-orange text-white p-5 flex justify-between items-center cursor-pointer hover:bg-ferro-black transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black border border-white/20 px-2 py-1">{cartCount} UNITS</span>
              <p className="font-black uppercase tracking-tighter">Initialize Checkout / Total: ₹{cartTotal}</p>
            </div>
            <ArrowRight size={20} />
          </div>
        </div>
      )}
    </div>
  );
}