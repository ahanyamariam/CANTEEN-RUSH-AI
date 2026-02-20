import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterStudent() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('[ERR] CODE_MISMATCH');
    if (form.password.length < 6) return setError('[ERR] BIT_LENGTH_INSUFFICIENT');

    setLoading(true);
    try {
      await register({ ...form, role: 'student' });
      navigate('/student/dashboard');
    } catch (err) {
      setError(`[ERR] PROVISIONING_FAILED: ${err.response?.data?.error || 'NETWORK_FAILURE'}`);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full_Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone Number', type: 'tel' },
    { key: 'password', label: 'Password', type: 'password' },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password' },
  ];

  return (
    <div className="min-h-screen bg-ferro-mint flex items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-ferro-black/40 hover:text-ferro-black mb-12 transition-colors">
          [ ← ] ABORT_PROCEDURE
        </Link>

        <div className="bg-white border border-ferro-black/10 p-10 lg:p-16 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-ferro-black uppercase tracking-tighter">Student_Profile</h1>
            <p className="text-[10px] font-bold text-ferro-black/40 uppercase tracking-widest mt-2">Initialize User Instance</p>
          </div>

          {error && (
            <div className="bg-ferro-orange/10 border border-ferro-orange/20 text-ferro-orange text-[10px] font-black uppercase tracking-widest p-4 mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-[9px] font-black text-ferro-black/40 uppercase tracking-[0.2em] mb-1">{f.label}</label>
                <input
                  type={f.type} value={form[f.key]} onChange={update(f.key)}
                  required={f.key !== 'phone'}
                  className="w-full px-0 py-2.5 bg-transparent border-b border-ferro-black/10 rounded-none text-ferro-black font-bold focus:border-ferro-orange outline-none transition-colors"
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-ferro-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-ferro-orange transition-colors mt-6">
              {loading ? 'DEPLOYING...' : 'INITIALIZE_ACCOUNT [ → ]'}
            </button>
          </form>

          <p className="text-center text-[10px] font-bold text-ferro-black/40 uppercase tracking-widest mt-10">
            Existing instance?{' '}
            <Link to="/login?role=student" className="text-ferro-black underline underline-offset-4 hover:text-ferro-orange">LOGIN_NOW</Link>
          </p>
        </div>
      </div>
    </div>
  );
}