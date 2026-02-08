import React, { useState } from 'react';
import { useVendors, useVendorMenu } from '../../hooks/useVendors';
import { usePlaceOrder } from '../../hooks/useOrders';

export default function OrderPage() {
  const { vendors, loading: vl } = useVendors();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const { items, loading: ml } = useVendorMenu(selectedVendor?._id);
  const { placeOrder, placing, error } = usePlaceOrder();

  const [cart, setCart] = useState([]);
  const [result, setResult] = useState(null);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c._id === item._id);
      if (existing) {
        return prev.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cart.map(c => ({
        menuItem: c._id,
        quantity: c.qty,
      }));
      const order = await placeOrder(selectedVendor._id, orderItems);
      setResult(order);
      setCart([]);
    } catch (e) {
      // error is already in `error` state
    }
  };

  // ── Show result after ordering ──
  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>

          <div className="mt-6 bg-gray-900 text-white rounded-xl p-4">
            <p className="text-sm text-gray-400">Your Pickup Token</p>
            <p className="text-4xl font-mono font-bold tracking-widest mt-1">
              {result.token}
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-lg">
              Ready at{' '}
              <span className="font-bold text-blue-600">
                {new Date(result.predictedReadyTime).toLocaleTimeString([], {
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              ~{result.prediction.estimatedMinutes} min · Queue #{result.queuePosition} ·{' '}
              {Math.round(result.prediction.confidence * 100)}% confidence
            </p>
            <p className="text-xs text-gray-400 italic mt-2">
              {result.prediction.reasoning}
            </p>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            Prediction method: {result.prediction.method}
          </div>

          <button
            onClick={() => setResult(null)}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  // ── Main ordering UI ──
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Place Order</h1>

      {/* Vendor Selection */}
      {!selectedVendor ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Select Vendor</h2>
          {vl ? (
            <p>Loading vendors...</p>
          ) : (
            vendors.map(v => (
              <button
                key={v._id}
                onClick={() => setSelectedVendor(v)}
                className="w-full p-4 bg-white rounded-xl shadow text-left hover:ring-2 ring-blue-500"
              >
                <p className="font-bold">{v.shopName}</p>
                <p className="text-sm text-gray-500">{v.location}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${v.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {v.isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                    Queue: {v.currentLoad?.queueDepth || 0}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => { setSelectedVendor(null); setCart([]); }}
            className="text-blue-600 mb-4 text-sm"
          >
            ← Back to vendors
          </button>

          <h2 className="text-lg font-semibold mb-3">{selectedVendor.shopName} — Menu</h2>

          {/* Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {ml ? (
              <p>Loading menu...</p>
            ) : (
              items.map(item => (
                <div key={item._id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price} · {item.basePrepTimeMinutes} min</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.complexity === 'simple' ? 'bg-green-100 text-green-700' :
                      item.complexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.complexity}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-3">Your Cart</h3>
              {cart.map(c => (
                <div key={c._id} className="flex justify-between py-1">
                  <span>{c.name} × {c.qty}</span>
                  <span>₹{c.price * c.qty}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{cart.reduce((s, c) => s + c.price * c.qty, 0)}</span>
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}