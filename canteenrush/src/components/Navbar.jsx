import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isVendor = user.role === 'vendor';
  const links = isVendor 
    ? [ { to: '/vendor/dashboard', label: 'DASHBOARD' }, { to: '/vendor/queue', label: 'QUEUE' }, { to: '/vendor/menu', label: 'MENU' }, { to: '/vendor/analytics', label: 'AI_LAB' } ]
    : [ { to: '/student/dashboard', label: 'HOME' }, { to: '/student/vendors', label: 'VENDORS' }, { to: '/student/orders', label: 'HISTORY' }, { to: '/student/track', label: 'TRACK' } ];

  return (
    <nav className="bg-white border-b border-ferro-black/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Industrial Logo */}
        <Link to={isVendor ? '/vendor/dashboard' : '/student/dashboard'} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ferro-black flex items-center justify-center text-white font-black text-xs">
            CR
          </div>
          <span className="font-black text-ferro-black uppercase tracking-tighter">CanteenRush / 26</span>
        </Link>

        {/* Nav Links - Sharp Text */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.to} to={link.to} 
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                location.pathname === link.to ? 'text-ferro-orange underline underline-offset-8' : 'text-ferro-black/40 hover:text-ferro-black'
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-black text-ferro-black leading-none uppercase tracking-widest">{user.name}</p>
            <p className="text-[9px] text-ferro-orange font-bold uppercase mt-1 tracking-tighter">AUTH / {user.role}</p>
          </div>
          <button onClick={handleLogout} className="bg-ferro-black text-white text-[9px] font-black uppercase px-4 py-2 hover:bg-ferro-orange transition-colors">
            LOGOUT [X]
          </button>
        </div>
      </div>
    </nav>
  );
}