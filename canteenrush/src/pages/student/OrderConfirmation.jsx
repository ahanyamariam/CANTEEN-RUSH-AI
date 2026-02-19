import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) return <Navigate to="/student/dashboard" replace />;

  // Logic: Handles the professional NODE_0X formatting
  const nodeLabel = `NODE_${String(order.queuePosition || 1).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6 lg:p-12 flex flex-col items-center font-sans">
      <div className="max-w-4xl w-full bg-white border border-black/10 p-8 md:p-16">
        
        {/* Protocol Header */}
        <div className="flex justify-between items-start mb-24">
          <span className="text-[10px] font-black tracking-[0.4em] text-black/20 uppercase italic">STATUS / SUCCESS</span>
          <span className="text-[10px] font-black text-[#FF6B00] tracking-[0.1em] uppercase">ORDER_DEPLOYED</span>
        </div>

        {/* Technical Token - Blue highlight removed */}
        <div className="mb-16 flex flex-col items-center">
          <p className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] mb-6">TECHNICAL_PICKUP_TOKEN</p>
          <div className="bg-[#1A1A1A] w-full py-16 flex items-center justify-center">
            <div className="relative inline-flex">
              {/* The blue div was removed from this section */}
              <h2 className="relative z-10 text-6xl md:text-8xl font-black text-white tracking-[0.25em] leading-none uppercase font-mono">
                {order.token}
              </h2>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {/* Arrival Metric */}
          <div className="bg-[#e2e8e4] p-10 border-l-[3px] border-black relative">
            <div className="absolute top-4 right-6 text-[9px] font-black text-black/20 tracking-widest">[ V ]</div>
            <span className="text-[9px] font-black tracking-[0.2em] text-black/40 uppercase">ESTIMATED_READY</span>
            <div className="mt-6">
              <p className="text-6xl font-black text-black tracking-tighter leading-none">
                {new Date(order.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
            </div>
          </div>

          {/* Load Metric - Keeps the fixed NODE_0X padding */}
          <div className="bg-[#e2e8e4] p-10 border-l-[3px] border-black relative">
            <div className="absolute top-4 right-6 text-[9px] font-black text-black/20 tracking-widest">[ V ]</div>
            <span className="text-[9px] font-black tracking-[0.2em] text-black/40 uppercase">QUEUE_POS</span>
            <div className="mt-6">
              <p className="text-6xl font-black text-[#FF6B00] tracking-tighter leading-none">
                {nodeLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Deployment Report */}
        {order.prediction?.reasoning && (
          <div className="mb-20">
            <span className="text-[8px] font-black text-black/20 uppercase tracking-[0.4em] ml-2">NEURAL_REPORT</span>
            <div className="mt-2 p-10 border-l-[12px] border-black bg-[#f8f9f8] min-h-[100px] flex items-center">
              <p className="italic text-[12px] font-bold text-black/60 uppercase leading-relaxed tracking-wider">
                {order.prediction.reasoning}
              </p>
            </div>
          </div>
        )}

        <div className="w-full">
          <Link to="/student/orders" className="block w-full bg-[#1A1A1A] text-white py-6 font-black text-[11px] text-center uppercase tracking-[0.5em] transition-all hover:bg-[#FF6B00] active:scale-[0.99]">
            ACCESS TRANSACTION LOG
          </Link>
        </div>
      </div>
    </div>
  );
}