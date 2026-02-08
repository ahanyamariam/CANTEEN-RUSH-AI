import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VENDOR_ILLUSTRATIONS = [
  { emoji: '🍛', name: "Raj's South Indian", items: 'Dosa · Idli · Filter Coffee', color: 'from-orange-400 to-red-500' },
  { emoji: '🥘', name: "Sharma Ji's Chaat", items: 'Samosa · Pani Puri · Pav Bhaji', color: 'from-yellow-400 to-orange-500' },
  { emoji: '🥡', name: 'Dragon Wok', items: 'Fried Rice · Noodles · Manchurian', color: 'from-red-400 to-pink-500' },
  { emoji: '🥤', name: 'Juice Junction', items: 'Shakes · Fresh Juice · Smoothies', color: 'from-green-400 to-emerald-500' },
  { emoji: '🍗', name: 'Biryani House', items: 'Veg Biryani · Chicken Biryani · Thali', color: 'from-amber-400 to-yellow-600' },
];

const STATS = [
  { value: '0', label: 'Queue Time', suffix: 'min' },
  { value: '3', label: 'Accuracy', suffix: 'min' },
  { value: '500+', label: 'Students', suffix: '' },
  { value: '5', label: 'Vendors', suffix: '+' },
];

const STEPS = [
  { icon: '📱', title: 'Order in Class', desc: 'Browse menus & place orders during lectures', color: 'bg-blue-500' },
  { icon: '🤖', title: 'AI Predicts Time', desc: 'Get exact pickup time powered by Gemini AI', color: 'bg-purple-500' },
  { icon: '👨‍🍳', title: 'Vendor Prepares', desc: 'Kitchen starts before you even arrive', color: 'bg-orange-500' },
  { icon: '✅', title: 'Walk & Collect', desc: 'Show token, grab food, zero waiting', color: 'bg-green-500' },
];

function FloatingFood({ delay, left, emoji, duration }) {
  return (
    <div
      className="absolute text-3xl animate-bounce opacity-20 pointer-events-none select-none"
      style={{
        left: `${left}%`,
        top: `${10 + Math.random() * 60}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {emoji}
    </div>
  );
}

function TickerCard({ vendor, index }) {
  return (
    <div className="flex-shrink-0 w-56">
      <div className={`bg-gradient-to-br ${vendor.color} rounded-2xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform`}>
        <div className="text-3xl mb-2">{vendor.emoji}</div>
        <h3 className="font-bold text-sm">{vendor.name}</h3>
        <p className="text-xs opacity-80 mt-1">{vendor.items}</p>
        <div className="flex items-center gap-1 mt-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-xs opacity-90">Open Now</span>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (user) {
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/student/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">

      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <section className="relative min-h-screen flex">

        {/* Floating food background */}
        <FloatingFood delay={0} left={5} emoji="🍕" duration={3} />
        <FloatingFood delay={0.5} left={15} emoji="🍔" duration={4} />
        <FloatingFood delay={1} left={25} emoji="🌮" duration={3.5} />
        <FloatingFood delay={1.5} left={35} emoji="🍜" duration={2.5} />
        <FloatingFood delay={0.3} left={50} emoji="☕" duration={3} />
        <FloatingFood delay={0.8} left={65} emoji="🧃" duration={4} />
        <FloatingFood delay={1.2} left={75} emoji="🍩" duration={3} />
        <FloatingFood delay={0.6} left={85} emoji="🥗" duration={3.5} />
        <FloatingFood delay={1.8} left={92} emoji="🍛" duration={2.8} />

        {/* Gradient blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600 rounded-full filter blur-[180px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full filter blur-[150px] opacity-20 translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-orange-500 rounded-full filter blur-[140px] opacity-10 -translate-x-1/2 -translate-y-1/2"></div>

        {/* Left Side — Content */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative z-10">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-300">AI-Powered · Real-Time</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6">
              Skip the
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Queue.
              </span>
              <span className="block text-3xl lg:text-4xl font-bold text-gray-400 mt-2">
                Not the Food.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-md">
              Order during class. AI predicts exactly when your food will be ready.
              Walk to the counter. Pick up. Done.
              <span className="text-white font-medium"> Zero waiting.</span>
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl lg:text-3xl font-black text-white">
                    {stat.value}<span className="text-sm text-gray-500">{stat.suffix}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Track Order — Public */}
            <div className="flex items-center gap-3">
              <Link
                to="/track"
                className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
              >
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                  🔍
                </span>
                Track an order
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side — Auth Panel */}
        <div className="hidden lg:flex w-[480px] items-center justify-center p-8 relative z-10">
          <div className="w-full max-w-sm">
            {/* Glass card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

              {/* Logo */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
                  <span className="text-3xl">🍽️</span>
                </div>
                <h2 className="text-xl font-bold">CanteenRush</h2>
                <p className="text-xs text-gray-400 mt-1">Smart Campus Food Ordering</p>
              </div>

              {/* Student Section */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🎓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Student</p>
                    <p className="text-xs text-gray-400">Order food, track in real-time</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/login?role=student"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-center text-sm font-semibold transition shadow-lg shadow-blue-600/30"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register/student"
                    className="flex-1 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 py-2.5 rounded-xl text-center text-sm font-semibold transition"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-xs text-gray-500">or</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Vendor Section */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-lg">👨‍🍳</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Vendor</p>
                    <p className="text-xs text-gray-400">Manage orders & kitchen queue</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/login?role=vendor"
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl text-center text-sm font-semibold transition shadow-lg shadow-green-600/30"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register/vendor"
                    className="flex-1 border border-green-500/50 text-green-400 hover:bg-green-500/10 py-2.5 rounded-xl text-center text-sm font-semibold transition"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>

              {/* Bottom note */}
              <p className="text-center text-[10px] text-gray-600 mt-6">
                Powered by Google Gemini AI · Built for campus canteens
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Auth (shown on small screens) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
          <div className="flex gap-3">
            <Link
              to="/login?role=student"
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-center text-sm font-semibold"
            >
              🎓 Student Login
            </Link>
            <Link
              to="/login?role=vendor"
              className="flex-1 bg-green-600 text-white py-3 rounded-xl text-center text-sm font-semibold"
            >
              👨‍🍳 Vendor Login
            </Link>
          </div>
          <div className="flex gap-3 mt-2">
            <Link to="/register/student" className="flex-1 text-center text-xs text-gray-400 py-2">
              Student Sign Up
            </Link>
            <Link to="/register/vendor" className="flex-1 text-center text-xs text-gray-400 py-2">
              Vendor Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VENDOR TICKER ──────────────────────────────────── */}
      <section className="py-12 border-t border-white/5 relative overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Campus Vendors</p>
        </div>

        {/* Scrolling ticker */}
        <div className="relative">
          <div className="flex gap-4 animate-scroll">
            {[...VENDOR_ILLUSTRATIONS, ...VENDOR_ILLUSTRATIONS].map((vendor, i) => (
              <TickerCard key={i} vendor={vendor} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-20 px-4 relative">
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-600 rounded-full filter blur-[120px] opacity-10"></div>
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-purple-600 rounded-full filter blur-[120px] opacity-10"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl lg:text-5xl font-black">
              Four Steps.{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Zero Queue.
              </span>
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  activeStep === i ? 'scale-105' : 'opacity-60 hover:opacity-100'
                }`}
                onClick={() => setActiveStep(i)}
              >
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent z-0"></div>
                )}

                <div className={`relative z-10 bg-white/5 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-500 ${
                  activeStep === i ? 'border-white/30 bg-white/10 shadow-xl' : 'border-white/5'
                }`}>
                  {/* Step number */}
                  <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg transition-transform ${
                    activeStep === i ? 'scale-110' : ''
                  }`}>
                    {step.icon}
                  </div>

                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>

                  {/* Active indicator */}
                  {activeStep === i && (
                    <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Step progress bar */}
          <div className="flex gap-2 justify-center mt-8">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  activeStep === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI FEATURE SPOTLIGHT ────────────────────────── */}
      <section className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">

              {/* Left — Text */}
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-1 mb-6">
                  <span className="text-xs">🤖</span>
                  <span className="text-xs font-medium text-purple-300">Powered by Gemini AI</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-black mb-4">
                  AI That Learns{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Your Campus
                  </span>
                </h2>

                <p className="text-gray-400 mb-6 leading-relaxed">
                  Our prediction engine doesn't guess — it analyzes real-time vendor load,
                  queue depth, item complexity, rush hour patterns, and historical accuracy
                  to give you a pickup time within ±3 minutes.
                </p>

                <div className="space-y-3">
                  {[
                    { icon: '🎯', text: '±3 min accuracy on pickup predictions' },
                    { icon: '📊', text: 'Learns from every completed order' },
                    { icon: '⚡', text: 'Real-time queue & vendor sync' },
                    { icon: '🧠', text: 'Rush hour pattern recognition' },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-sm text-gray-300">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Fake prediction card */}
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-30"></div>

                <div className="relative bg-gray-900 border border-white/20 rounded-2xl p-6 shadow-2xl">
                  {/* Mock order confirmation */}
                  <div className="text-center mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-400 text-lg">✓</span>
                    </div>
                    <p className="text-xs text-gray-400">Order Placed</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4 mb-4">
                    <p className="text-xs text-gray-500 text-center">Pickup Token</p>
                    <p className="text-3xl font-mono font-bold text-center tracking-[0.2em] mt-1">B7X2K9</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                    <p className="text-xs text-blue-400 text-center">AI Predicted Ready Time</p>
                    <p className="text-2xl font-bold text-blue-300 text-center mt-1">12:47 PM</p>
                    <div className="flex justify-center gap-3 mt-2 text-xs text-blue-400/70">
                      <span>~14 min</span>
                      <span>•</span>
                      <span>Queue #3</span>
                      <span>•</span>
                      <span>87% confident</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Wait</p>
                      <p className="font-bold text-sm">5m</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Prep</p>
                      <p className="font-bold text-sm">8m</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Buffer</p>
                      <p className="font-bold text-sm">1m</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-center">
                    <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                      🤖 Hybrid AI + Rules
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-600 text-center mt-3 italic">
                    "3 orders ahead, lunch rush, ~8 min for dosa + parallel coffee prep"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON SECTION ──────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black">
              Before vs{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">After</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-400">✗</span>
                </div>
                <h3 className="font-bold text-red-400">Without CanteenRush</h3>
              </div>
              <div className="space-y-3">
                {[
                  '15-25 min standing in physical queue',
                  'No idea when food will be ready',
                  'Rush to canteen, rush back to class',
                  'Entire break wasted waiting',
                  'Vendor overwhelmed, slow service',
                  'Miss the beginning of next class',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 text-sm">✗</span>
                    <span className="text-sm text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-400">✓</span>
                </div>
                <h3 className="font-bold text-green-400">With CanteenRush</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Order from your seat during class',
                  'AI tells you exact pickup time',
                  'Walk to counter at the right moment',
                  'Food is ready & waiting for you',
                  'Vendor prepares proactively, smooth flow',
                  'Full break to eat, relax, socialize',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5 text-sm">✓</span>
                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─────────────────────────────────── */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent"></div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-black mb-4">
            Ready to Skip the Queue?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join hundreds of students already saving their break time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/student"
              className="group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-blue-600/30 transition-all hover:shadow-blue-500/40 hover:scale-105"
            >
              🎓 Get Started as Student
              <span className="block text-xs font-normal opacity-70 mt-0.5">Free forever</span>
            </Link>
            <Link
              to="/register/vendor"
              className="group bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-green-600/30 transition-all hover:shadow-green-500/40 hover:scale-105"
            >
              👨‍🍳 Register Your Shop
              <span className="block text-xs font-normal opacity-70 mt-0.5">Start receiving orders</span>
            </Link>
          </div>

          <p className="text-xs text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login?role=student" className="text-blue-400 hover:text-blue-300">Student login</Link>
            {' · '}
            <Link to="/login?role=vendor" className="text-green-400 hover:text-green-300">Vendor login</Link>
          </p>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">🍽️</span>
            </div>
            <span className="font-bold">CanteenRush</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Powered by Google Gemini AI</span>
            <span>•</span>
            <span>Built for Campus Life</span>
            <span>•</span>
            <Link to="/track" className="hover:text-white transition">Track Order</Link>
          </div>
        </div>
      </footer>

      {/* ─── SCROLL ANIMATION KEYFRAMES (via Tailwind) ──── */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}