import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../lib/adminApi';
import { Lock, User, Globe } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Sign In | Balingasag CMS';
  }, []);

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-gray-50 to-teal-50/50 relative overflow-hidden">
      {/* Soft background glow decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      {/* Floating Centered Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-150/80 flex overflow-hidden min-h-[520px] animate-modal">

        {/* Left Pane: Elegant Brand Card (Spacious, No Bloated Text) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-800 via-emerald-750 to-teal-900 text-white p-12 flex-col justify-between relative overflow-hidden border-r border-white/5">
          {/* Decorative subtle light blob */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          {/* Clean Brand Header */}
          <div className="flex items-center space-x-3 z-10">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-sm">
              <Globe className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-none">Balingasag</h1>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">Administrative Portal</span>
            </div>
          </div>

          {/* Clean Welcome Message */}
          <div className="my-auto max-w-xs z-10 space-y-3 pt-6">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
              Welcome back.
            </h2>
            <div className="h-0.5 w-10 bg-emerald-400 rounded-full" />
          </div>

          {/* Simple Live Pulse Status (Minimalist Indicator) */}
          <div className="z-10 flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-emerald-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
            <span>CMS Connection Secured</span>
          </div>
        </div>

        {/* Right Pane: Centered Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="max-w-sm w-full space-y-7">
            <div>
              {/* Mobile Branding Header */}
              <div className="lg:hidden flex items-center space-x-2.5 mb-8">
                <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-sm shadow-emerald-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-gray-900 tracking-tight text-lg">Balingasag Tourism</span>
              </div>

              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Sign in
              </h2>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl text-xs leading-relaxed text-center animate-in fade-in duration-200">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full px-3 py-2.5 pl-9 border border-gray-200 rounded-xl placeholder-gray-405 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-xs"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-3 py-2.5 pl-9 border border-gray-200 rounded-xl placeholder-gray-405 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-xs"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-xs font-bold rounded-xl text-white shadow-md transition-all ${loading
                      ? 'bg-emerald-400 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.995]'
                    } focus:outline-none`}
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="pt-5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
              <a href="/" className="hover:text-emerald-600 transition-colors font-bold uppercase tracking-wider text-[9px]">Back to Site</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
