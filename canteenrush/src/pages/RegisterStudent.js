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
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      await register({ ...form, role: 'student' });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Amit Sharma' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'amit@college.edu' },
    { key: 'phone', label: 'Phone', type: 'tel', placeholder: '9876543210' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Retype password' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full filter blur-[200px] opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600 rounded-full filter blur-[180px] opacity-10"></div>

      <div className="max-w-sm w-full relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition">← Back</Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
              <span className="text-3xl">🎓</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Student Sign Up</h1>
            <p className="text-sm text-gray-400 mt-1">Create your account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-400 mb-1">{f.label}</label>
                <input
                  type={f.type} value={form[f.key]} onChange={update(f.key)}
                  required={f.key !== 'phone'} placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none text-sm transition"
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 shadow-lg shadow-blue-600/30 transition-all mt-2">
              {loading ? 'Creating Account...' : 'Create Student Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login?role=student" className="font-semibold text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}