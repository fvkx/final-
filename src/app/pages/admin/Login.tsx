import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../lib/adminApi';
import { Lock, User, Globe, Sparkles, MapPin, Hotel, Utensils, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Pane: Brand & Status */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background blur structures */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        {/* Top Brand Header */}
        <div className="flex items-center space-x-3.5 z-10">
          <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-lg">
            <Globe className="w-5.5 h-5.5 text-emerald-300" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Admin Control</span>
            <h1 className="text-lg font-black tracking-tight text-white">Balingasag Tourism</h1>
          </div>
        </div>

        {/* Bold Brand Welcoming Section */}
        <div className="my-auto max-w-md z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-400/20 text-xs font-semibold text-emerald-250">
            <Sparkles className="w-3.5 h-3.5 text-emerald-350" />
            <span>CMS Control Panel</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            Welcome back to the Balingasag Command Center.
          </h2>
          <p className="text-emerald-100/70 text-sm leading-relaxed">
            Manage public tourist spots, accommodation updates, food place listings, travel guides, and monitor guest inquiries in real time.
          </p>
        </div>

        {/* Live Status Indicator Dashboard */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 z-10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-255">System Live Status</span>
            </div>
            <span className="text-[9px] bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/20 text-emerald-300 font-bold uppercase">Online</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <MapPin className="w-5 h-5 text-emerald-300" />
              <div>
                <div className="text-[9px] text-emerald-200/50 uppercase font-bold tracking-wider">Tourist Spots</div>
                <div className="text-xs font-black text-white">18+ Active</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <Hotel className="w-5 h-5 text-emerald-300" />
              <div>
                <div className="text-[9px] text-emerald-200/50 uppercase font-bold tracking-wider">Stay Places</div>
                <div className="text-xs font-black text-white">12 Registered</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <Utensils className="w-5 h-5 text-emerald-300" />
              <div>
                <div className="text-[9px] text-emerald-200/50 uppercase font-bold tracking-wider">Food Places</div>
                <div className="text-xs font-black text-white">15 Listings</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <div>
                <div className="text-[9px] text-emerald-200/50 uppercase font-bold tracking-wider">Security</div>
                <div className="text-xs font-black text-white">256-bit SSL</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-white relative animate-in fade-in duration-300">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="lg:hidden flex items-center space-x-2.5 mb-8 animate-in fade-in duration-300">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-sm shadow-emerald-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-gray-900 tracking-tight text-lg">Balingasag Tourism</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-gray-550 leading-relaxed">
              Please enter your municipal administration credentials to access the CMS command dashboard.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-xs leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4.5 w-4.5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-3.5 py-3 pl-10.5 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm"
                    placeholder="e.g. admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-3.5 py-3 pl-10.5 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm"
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
                className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-extrabold rounded-xl text-white shadow-md transition-all ${
                  loading 
                    ? 'bg-emerald-400 cursor-not-allowed shadow-none' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.995]'
                } focus:outline-none`}
              >
                {loading ? 'Signing in...' : 'Sign in to Command Center'}
              </button>
            </div>
          </form>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>© 2026 Balingasag Government</span>
            <a href="/" className="hover:text-emerald-600 transition-colors font-bold uppercase tracking-wider text-[10px]">Back to Public Site</a>
          </div>
        </div>
      </div>
    </div>
  );
}
