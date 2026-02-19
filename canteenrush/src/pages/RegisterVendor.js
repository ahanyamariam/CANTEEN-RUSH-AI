import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterVendor() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', shopName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('[ERR] CODE_MISMATCH');
    if (!form.shopName.trim()) return setError('[ERR] SHOP_IDENTIFIER_MISSING');

    setLoading(true);
    try {
      await register({ ...form, role: 'vendor' });
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(`[ERR] REGISTRY_FAILED: ${err.response?.data?.error || 'INTERNAL_ERROR'}`);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Operator_Name' },
    { key: 'shopName', label: 'Store_Identifier / Name' },
    { key: 'email', label: 'Registry_Email' },
    { key: 'phone', label: 'Comms_Link / Phone' },
    { key: 'password', label: 'Secret_Key' },
    { key: 'confirmPassword', label: 'Verify_Key' },
  ];

  return (
    <div className="min-h-screen bg-ferro-mint flex items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-ferro-black/40 hover:text-ferro-black mb-12 transition-colors">
          [ ← ] TERMINATE_REGISTRY
        </Link>

        <div className="bg-white border border-ferro-black/10 p-10 lg:p-16 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-ferro-black flex items-center justify-center mx-auto mb-6 text-white text-xs font-black">VN</div>
            <h1 className="text-4xl font-black text-ferro-black uppercase tracking-tighter">Vendor_Registry</h1>
            <p className="text-[10px] font-bold text-ferro-black/40 uppercase tracking-widest mt-2">Create Node Instance</p>
          </div>

          {error && (
            <div className="bg-ferro-orange/10 border border-ferro-orange/20 text-ferro-orange text-[10px] font-black uppercase tracking-widest p-4 mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-[9px] font-black text-ferro-black/40 uppercase tracking-[0.2em] mb-1">{f.label}</label>
                <input
                  type={f.key.includes('password') ? 'password' : 'text'} 
                  value={form[f.key]} onChange={update(f.key)}
                  required={f.key !== 'phone'}
                  className="w-full px-0 py-2.5 bg-transparent border-b border-ferro-black/10 rounded-none text-ferro-black font-bold focus:border-ferro-orange outline-none transition-colors"
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-ferro-orange text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-ferro-black transition-colors mt-8">
              {loading ? 'REGISTERING...' : 'CONFIRM_REGISTRATION [ → ]'}
            </button>
          </form>

          <p className="text-center text-[10px] font-bold text-ferro-black/40 uppercase tracking-widest mt-10">
            Node already exists?{' '}
            <Link to="/login?role=vendor" className="text-ferro-black underline underline-offset-4 hover:text-ferro-orange">SIGN_IN</Link>
          </p>
        </div>
      </div>
    </div>
  );
}