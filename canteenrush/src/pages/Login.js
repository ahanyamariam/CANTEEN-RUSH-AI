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
      setError(`[AUTH_ERR] ${err.response?.data?.error || 'INVALID_CREDENTIALS'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ferro-mint flex items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-ferro-black/40 hover:text-ferro-black mb-12 transition-colors">
          [ ← ] RETURN_TO_HOME
        </Link>

        <div className="bg-white border border-ferro-black/10 p-10 lg:p-16 shadow-2xl">
          <div className="text-center mb-12">
            <div className="w-12 h-12 bg-ferro-black flex items-center justify-center mx-auto mb-6 text-white text-xs font-black">
              {isVendor ? 'VN' : 'ST'}
            </div>
            <h1 className="text-4xl font-black text-ferro-black uppercase tracking-tighter">
              {isVendor ? 'Vendor_Portal' : 'Student_Login'}
            </h1>
            <p className="text-[10px] font-bold text-ferro-black/40 uppercase tracking-widest mt-2">
              Authentication Required / v2.6
            </p>
          </div>

          {error && (
            <div className="bg-ferro-orange/10 border border-ferro-orange/20 text-ferro-orange text-[10px] font-black uppercase tracking-widest p-4 mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[9px] font-black text-ferro-black/40 uppercase tracking-[0.2em] mb-2">Network_ID / Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-0 py-3 bg-transparent border-b-2 border-ferro-black/10 rounded-none text-ferro-black font-bold focus:border-ferro-orange outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-ferro-black/40 uppercase tracking-[0.2em] mb-2">Security_Code / Pass</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-0 py-3 bg-transparent border-b-2 border-ferro-black/10 rounded-none text-ferro-black font-bold focus:border-ferro-orange outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-ferro-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-ferro-orange transition-colors disabled:opacity-50"
            >
              {loading ? 'INITIALIZING_SESSION...' : 'GRANT_ACCESS [ → ]'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-ferro-black/5 text-center">
            <p className="text-[10px] font-bold text-ferro-black/40 uppercase tracking-widest">
              No account?{' '}
              <Link
                to={isVendor ? '/register/vendor' : '/register/student'}
                className="text-ferro-black underline underline-offset-4 hover:text-ferro-orange"
              >
                DEPLOY_NEW_PROFILE
              </Link>
            </p>

            <Link 
              to={`/login?role=${isVendor ? 'student' : 'vendor'}`} 
              className="block mt-6 text-[9px] font-black text-ferro-orange uppercase tracking-widest hover:underline"
            >
              Switch_Role / {isVendor ? 'Student' : 'Vendor'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}