import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Minus, ShoppingCart, Clock, ChevronRight, Users } from 'lucide-react';
import api from '../../api/axios';

export default function Menu() {
  const { vendorId } = useParams();
  const { state, dispatch, loadVendorMenu } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);

  // Load vendor and menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vendor info
        const vendorRes = await api.get(`/vendors/${vendorId}`);
        setVendor(vendorRes.data.vendor);

        // Fetch menu items
        const menuRes = await api.get(`/menu/vendor/${vendorId}`);
        setItems(menuRes.data.items || []);
      } catch (err) {
        console.error('Error loading menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [vendorId]);

  const categories = ['All', ...new Set(items.map(i => i.category))];

  const filtered = activeCategory === 'All'
    ? items
    : items.filter(i => i.category === activeCategory);

  const cartTotal = state.cart.reduce((s, c) => s + (c.price || 0) * (c.qty || 0), 0);
  const cartCount = state.cart.reduce((s, c) => s + (c.qty || 0), 0);

  const getQty = (itemId) => state.cart.find(c => c._id === itemId)?.qty || 0;

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-3">🍽️</div>
        <p>Loading menu...</p>
      </div>
    );
  }

  if (!vendor) {
    return <div className="p-8 text-center text-gray-500">Vendor not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-32">
      {/* Vendor header */}
      <div className="bg-gradient-to-br from-primary/5 to-purple-50 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            🍽️
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{vendor.shopName}</h1>
            <p className="text-sm text-gray-500">{vendor.location || 'Campus'}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                ~{vendor.avgPrepTimeMinutes || 10} min avg
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {vendor.currentLoad?.queueDepth || 0} in queue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/30'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div className="grid gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">No items available</div>
        )}
        {filtered.map((item, i) => {
          const qty = getQty(item._id);
          const complexityColor =
            item.complexity === 'simple' ? 'bg-green-100 text-green-700' :
              item.complexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700';

          return (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 animate-slide-up hover:shadow-sm transition-shadow"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="text-3xl w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                {item.category === 'beverage' ? '☕' :
                  item.category === 'snack' ? '🍟' :
                    item.category === 'meal' ? '🍛' :
                      item.category === 'dessert' ? '🍰' : '🍽️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${complexityColor}`}>
                    {item.complexity}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {item.basePrepTimeMinutes}m
                  </span>
                  <span className="font-semibold text-gray-900">₹{item.price}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {qty === 0 ? (
                  <button
                    onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
                  >
                    ADD
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-primary rounded-xl px-1 py-1">
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item._id })}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-white font-bold text-sm w-4 text-center">{qty}</span>
                    <button
                      onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart floating bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 animate-slide-up">
          <div
            onClick={() => navigate('/student/cart')}
            className="max-w-5xl mx-auto bg-primary text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer shadow-2xl shadow-primary/40 hover:bg-primary-dark transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <div>
                <div className="font-bold text-sm">{cartCount} item{cartCount > 1 ? 's' : ''} · ₹{cartTotal}</div>
              </div>
            </div>
            <span className="font-bold text-sm flex items-center gap-1">
              View Cart <ChevronRight size={16} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}