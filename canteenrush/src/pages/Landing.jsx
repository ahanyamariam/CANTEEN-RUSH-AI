import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/student/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-ferro-offwhite">
      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <section className="flex flex-col lg:flex-row min-h-[90vh]">
        {/* Left Side: Massive Typography */}
        <div className="flex-1 bg-ferro-mint p-10 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-ferro-black/10">
          <div className="flex justify-between items-start">
            <span className="font-bold tracking-tighter text-xl">CANTEENRUSH / 01</span>
            <nav className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-ferro-black/40">
              <Link to="/login" className="hover:text-ferro-black transition-colors">Login</Link>
              <Link to="/register/student" className="hover:text-ferro-black transition-colors">Join</Link>
            </nav>
          </div>

          <div className="mt-20">
            <h1 className="text-7xl lg:text-[10rem] font-black leading-[0.8] tracking-tighter mb-12">
              ZERO <br /> WAIT <br /> <span className="text-ferro-orange">2026</span>
            </h1>
            <p className="max-w-md text-lg font-medium leading-tight text-ferro-black/60">
              CanteenRush AI is the campus standard for predictive dining. 
              Integrated Gemini intelligence for ±3m precision.
            </p>
          </div>

          <div className="mt-12">
            <Link to="/register/student" className="inline-flex items-center gap-4 bg-ferro-black text-white px-8 py-4 font-bold text-sm hover:bg-ferro-orange transition-colors">
              START ORDERING [ → ]
            </Link>
          </div>
        </div>

        {/* Right Side: Data & Auth Grid */}
        <div className="w-full lg:w-[450px] flex flex-col">
          {/* Orange Status Block */}
          <div className="bg-ferro-orange p-10 text-white flex flex-col justify-between h-1/3">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">System Status</span>
            <div>
              <p className="text-4xl font-black">98.2%</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-2">Prediction Accuracy</p>
            </div>
          </div>

          {/* Data Tiles */}
          <div className="flex-1 grid grid-cols-1 divide-y divide-ferro-black/10">
            <div className="p-10 flex flex-col justify-between hover:bg-white transition-colors">
              <h2 className="text-4xl font-black">2500+</h2>
              <p className="text-xs font-bold text-ferro-black/40 uppercase tracking-widest">Orders Processed Today</p>
            </div>
            <div className="p-10 flex flex-col justify-between hover:bg-white transition-colors">
              <h2 className="text-4xl font-black">0.0 MIN</h2>
              <p className="text-xs font-bold text-ferro-black/40 uppercase tracking-widest">Average Counter Wait</p>
            </div>
            <Link to="/track" className="p-10 bg-ferro-black text-white flex justify-between items-center group">
              <span className="font-bold text-xs uppercase tracking-[0.3em]">Track Live Order</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (FERRO STYLE GRID) ────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-ferro-black/10">
        {[
          { title: 'Order', desc: 'Browse live menus in-class.', color: 'bg-white' },
          { title: 'Predict', desc: 'AI calculates prep windows.', color: 'bg-ferro-mint' },
          { title: 'Prepare', desc: 'Vendors receive auto-alerts.', color: 'bg-white' },
          { title: 'Collect', desc: 'Scan token. Zero wait time.', color: 'bg-ferro-mint' }
        ].map((step, i) => (
          <div key={i} className={`${step.color} p-12 border-r border-ferro-black/10 last:border-r-0`}>
            <span className="text-[10px] font-bold text-ferro-black/30">STEP / 0{i+1}</span>
            <h3 className="text-2xl font-black mt-4 mb-2 uppercase">{step.title}</h3>
            <p className="text-sm text-ferro-black/60 font-medium">{step.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}