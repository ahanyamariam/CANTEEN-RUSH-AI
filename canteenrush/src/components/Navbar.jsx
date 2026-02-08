import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const isVendor = user.role === 'vendor';

  const studentLinks = [
    { to: '/student/dashboard', label: 'Home', icon: '🏠' },
    { to: '/student/vendors', label: 'Vendors', icon: '🍽️' },
    { to: '/student/orders', label: 'Orders', icon: '📋' },
    { to: '/student/track', label: 'Track', icon: '🔍' },
  ];

  const vendorLinks = [
    { to: '/vendor/dashboard', label: 'Home', icon: '🏠' },
    { to: '/vendor/queue', label: 'Queue', icon: '📋' },
    { to: '/vendor/menu', label: 'Menu', icon: '📝' },
    { to: '/vendor/history', label: 'History', icon: '📊' },
    { to: '/vendor/analytics', label: 'AI', icon: '🤖' },
  ];

  const links = isVendor ? vendorLinks : studentLinks;
  const accentColor = isVendor ? 'green' : 'blue';

  return (
    <>
      <nav className="bg-gray-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            to={isVendor ? '/vendor/dashboard' : '/student/dashboard'}
            className="flex items-center gap-2"
          >
            <div className={`w-8 h-8 bg-gradient-to-br ${isVendor ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-purple-600'} rounded-lg flex items-center justify-center shadow-lg`}>
              <span className="text-sm">🍽️</span>
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">CanteenRush</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? `bg-${accentColor}-500/20 text-${accentColor}-400`
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${isVendor ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-purple-600'} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-red-500/10"
            >
              Logout
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-400 hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-gray-950/95 backdrop-blur-xl px-4 py-3">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? `bg-${accentColor}-500/20 text-${accentColor}-400`
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}