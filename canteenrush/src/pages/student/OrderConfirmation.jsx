import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) return <Navigate to="/student/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-green-600/5 to-transparent"></div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10">
        {/* Success icon */}
        <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-green-400 text-3xl">✓</span>
        </div>

        <h2 className="text-2xl font-black text-white text-center">Order Placed!</h2>

        {/* Token */}
        <div className="mt-6 bg-gray-900 border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest text-center">Pickup Token</p>
          <p className="text-4xl font-mono font-black tracking-[0.3em] mt-2 text-center text-white">{order.token}</p>
        </div>

        {/* Prediction */}
        <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
          <p className="text-xs text-blue-400 text-center">AI Predicted Ready Time</p>
          <p className="text-3xl font-black text-blue-300 text-center mt-1">
            {new Date(order.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <div className="flex justify-center gap-3 mt-2 text-xs text-blue-400/70">
            <span>~{order.prediction.estimatedMinutes} min</span>
            <span>•</span>
            <span>Queue #{order.queuePosition}</span>
            <span>•</span>
            <span>{Math.round(order.prediction.confidence * 100)}%</span>
          </div>
        </div>

        {/* Reasoning */}
        {order.prediction.reasoning && (
          <p className="mt-3 text-xs text-gray-500 italic text-center px-4">
            🤖 {order.prediction.reasoning}
          </p>
        )}

        {/* Breakdown */}
        {order.prediction.breakdown && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Queue', value: `${order.prediction.breakdown.queue_wait_minutes}m` },
              { label: 'Prep', value: `${order.prediction.breakdown.active_prep_minutes}m` },
              { label: 'Buffer', value: `${order.prediction.breakdown.buffer_minutes}m` },
            ].map((b) => (
              <div key={b.label} className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-gray-500">{b.label}</p>
                <p className="font-bold text-white text-sm">{b.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Method badge */}
        <div className="mt-4 flex justify-center">
          <span className={`text-xs px-3 py-1 rounded-full ${
            order.prediction.method === 'hybrid' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' :
            order.prediction.method === 'gemini' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
            'bg-white/5 text-gray-400 border border-white/10'
          }`}>
            {order.prediction.method === 'hybrid' ? '🤖 AI + Rules' :
             order.prediction.method === 'gemini' ? '🤖 AI Predicted' : '📐 Rule-based'}
          </span>
        </div>

        {/* Items */}
        <div className="mt-6 bg-white/5 border border-white/5 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Summary</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span className="text-gray-300">{item.quantity}× {item.menuItem?.name}</span>
              <span className="text-gray-500">₹{(item.menuItem?.price || 0) * item.quantity}</span>
            </div>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2 flex justify-between font-bold text-sm">
            <span className="text-white">Total</span>
            <span className="text-white">₹{order.totalPrice}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <Link to="/student/orders"
            className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold text-center hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-600/30 transition-all">
            View My Orders
          </Link>
          <Link to="/student/vendors"
            className="block w-full border border-white/10 text-gray-300 py-3 rounded-xl font-medium text-center hover:bg-white/5 transition">
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}