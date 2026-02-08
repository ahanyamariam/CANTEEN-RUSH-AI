import { useState } from 'react';
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

  // Cart items now have price directly (not menuItem.price)
  const cartTotal = state.cart.reduce((s, c) => s + (c.price || 0) * (c.qty || 0), 0);
  const cartCount = state.cart.reduce((s, c) => s + (c.qty || 0), 0);

  const handlePlaceOrder = async () => {
    if (state.cart.length === 0 || !state.selectedVendorId) return;

    if (!user) {
      navigate('/');
      return;
    }

    setPlacing(true);
    setError(null);

    try {
      const orderItems = state.cart.map(c => ({
        menuItem: c._id,
        quantity: c.qty,
      }));

      const { data } = await api.post('/orders', {
        vendorId: state.selectedVendorId,
        items: orderItems,
      });

      dispatch({ type: 'CLEAR_CART' });
      navigate(`/student/order/${data.order.id}`);
    } catch (err) {
      console.error('Order error:', err);
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Browse vendors and add items to get started</p>
        <button
          onClick={() => navigate('/student')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          Browse Vendors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-40">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Your Order</h1>
      <p className="text-sm text-gray-500 mb-6">{cartCount} items</p>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 mb-6">
        {state.cart.map((item) => (
          <div key={item._id} className="p-4 flex items-center gap-4">
            <div className="text-2xl w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              {item.category === 'beverage' ? '☕' :
                item.category === 'snack' ? '🍟' :
                  item.category === 'meal' ? '🍛' : '🍽️'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
              <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item._id })}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors text-gray-600"
                >
                  {item.qty === 1 ? <Trash2 size={14} className="text-red-400" /> : <Minus size={14} />}
                </button>
                <span className="text-sm font-bold w-5 text-center text-gray-900">{item.qty}</span>
                <button
                  onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors text-gray-600"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-sm font-bold text-gray-900 w-16 text-right">
                ₹{(item.price || 0) * (item.qty || 0)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Platform Fee</span>
            <span className="text-green-600">Free</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-40">
        <button
          onClick={handlePlaceOrder}
          disabled={placing || !user}
          className="max-w-5xl mx-auto w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {placing ? 'Placing Order...' : `Place Order · ₹${cartTotal}`}
          <ArrowRight size={20} />
        </button>
        {!user && (
          <p className="text-center text-xs text-gray-500 mt-2">Please login to place order</p>
        )}
      </div>
    </div>
  );
}