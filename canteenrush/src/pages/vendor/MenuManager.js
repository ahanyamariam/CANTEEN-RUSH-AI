import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useManageMenu } from '../../hooks/useVendors';

export default function MenuManager() {
  const { user } = useAuth();
  const { items, loading, fetchMenu, addItem, toggleAvailability } = useManageMenu();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', basePrepTimeMinutes: '', category: 'snack', complexity: 'simple' });

  useEffect(() => { if (user?.vendorProfile) fetchMenu(user.vendorProfile); }, [user, fetchMenu]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addItem({ ...form, price: Number(form.price), basePrepTimeMinutes: Number(form.basePrepTimeMinutes) });
    setForm({ name: '', price: '', basePrepTimeMinutes: '', category: 'snack', complexity: 'simple' });
    setShowAdd(false);
  };

  if (loading) return <div className="p-8 text-center"><div className="w-10 h-10 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6 pt-2">
        <h1 className="text-3xl font-black text-white">Menu</h1>
        <button onClick={() => setShowAdd(!showAdd)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            showAdd ? 'bg-white/10 text-gray-300 border border-white/10' : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-600/20'
          }`}>
          {showAdd ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          <input type="text" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm outline-none focus:ring-2 focus:ring-green-500/50" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm outline-none focus:ring-2 focus:ring-green-500/50" />
            <input type="number" placeholder="Prep time (min)" value={form.basePrepTimeMinutes} onChange={(e) => setForm({ ...form, basePrepTimeMinutes: e.target.value })} required
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm outline-none focus:ring-2 focus:ring-green-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm outline-none">
              {['snack', 'beverage', 'meal', 'dessert', 'combo'].map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
            </select>
            <select value={form.complexity} onChange={(e) => setForm({ ...form, complexity: e.target.value })}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm outline-none">
              {['simple', 'medium', 'complex'].map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-green-600/20">
            Add Item
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item._id} className={`bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center transition ${!item.isAvailable ? 'opacity-40' : ''}`}>
            <div>
              <p className="font-medium text-white">{item.name}</p>
              <div className="flex gap-2 mt-1 text-xs text-gray-500">
                <span>₹{item.price}</span>
                <span>· {item.basePrepTimeMinutes}m</span>
                <span>· {item.category}</span>
                <span className={`px-1.5 rounded ${
                  item.complexity === 'complex' ? 'bg-red-500/10 text-red-400' :
                  item.complexity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-green-500/10 text-green-400'
                }`}>{item.complexity}</span>
              </div>
            </div>
            <button onClick={() => toggleAvailability(item._id)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${
                item.isAvailable ? 'bg-green-500/20 text-green-400 border border-green-500/20 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30'
              }`}>
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}