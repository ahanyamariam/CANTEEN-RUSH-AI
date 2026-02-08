import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const roleHint = searchParams.get('role') || 'student';
  const isVendor = roleHint === 'vendor';

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'vendor' ? '/vendor/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const accent = isVendor ? 'green' : 'blue';

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-${accent}-600 rounded-full filter blur-[200px] opacity-10`}></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600 rounded-full filter blur-[180px] opacity-10"></div>

      <div className="max-w-sm w-full relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition">
          ← Back to home
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-gradient-to-br ${isVendor ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-purple-600'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-${accent}-500/30`}>
              <span className="text-3xl">{isVendor ? '👨‍🍳' : '🎓'}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isVendor ? 'Vendor Login' : 'Student Login'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome back to CanteenRush
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={isVendor ? 'raj@vendor.com' : 'amit@student.com'}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-white font-semibold disabled:opacity-50 transition-all shadow-lg ${
                isVendor
                  ? 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 shadow-green-600/30'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-600/30'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to={isVendor ? '/register/vendor' : '/register/student'}
              className={`font-semibold ${isVendor ? 'text-green-400 hover:text-green-300' : 'text-blue-400 hover:text-blue-300'}`}
            >
              Sign up
            </Link>
          </p>

          <p className="text-center text-xs text-gray-600 mt-4">
            <Link to={`/login?role=${isVendor ? 'student' : 'vendor'}`} className="hover:text-gray-400 transition">
              Login as {isVendor ? 'student' : 'vendor'} instead →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}