import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../lib/adminApi';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ username, password });
      if (response.success && response.token) {
        localStorage.setItem('balingasag_admin_auth', JSON.stringify({
          token: response.token,
          user: response.user
        }));
        navigate('/admin');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-50/40">
      
      {/* Centered Minimalist Instagram-like Modal Card */}
      <div className="max-w-[390px] w-full bg-white border border-gray-200/70 rounded-2xl p-10 shadow-sm space-y-8 animate-modal">
        
        {/* Clean & Balanced Brand Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1.5">
            <span className="text-lg font-black tracking-tight text-gray-900">Balingasag Tourism</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase font-bold mt-1.5">Command Dashboard</p>
        </div>

        {error && (
          <div className="bg-rose-50/50 border border-rose-100 text-rose-600 p-3 rounded-xl text-[11px] leading-relaxed text-center animate-in fade-in duration-205">
            {error}
          </div>
        )}

        {/* Minimalist Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-3">
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-xs"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-xs"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 text-xs font-bold rounded-xl text-white transition-all ${
                loading 
                  ? 'bg-emerald-400 cursor-not-allowed shadow-none' 
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
              }`}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>

        {/* Minimal Footer Panel */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span>© 2026</span>
          <a href="/" className="hover:text-emerald-600 transition-colors font-semibold uppercase tracking-wider">Back to Site</a>
        </div>

      </div>
    </div>
  );
}
