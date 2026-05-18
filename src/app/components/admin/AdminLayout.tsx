import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Mail, LogOut, FileText, 
  ExternalLink, HelpCircle, X, BookOpen 
} from 'lucide-react';
import { authApi } from '../../lib/adminApi';
import { NotificationProvider } from '../../context/NotificationContext';

export function AdminLayout() {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  const handleLogout = () => {
    authApi.logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelp]);

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/inquiries', icon: Mail, label: 'Inquiries' },
    { to: '/admin/content', icon: FileText, label: 'Content' },
    { to: '/admin/users', icon: Users, label: 'Users' },
  ];

  return (
    <NotificationProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-6">
            <h1 className="text-xl font-bold text-emerald-600 tracking-tight">
              Balingasag CMS
            </h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className={`w-5 h-5 transition-colors ${item.end ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-1.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-4 py-2.5 w-full text-left text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-bold"
            >
              <ExternalLink className="w-5 h-5 text-emerald-600" />
              <span className="text-sm">View Main Site</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2.5 w-full text-left text-gray-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative">
          <div className="p-8 pb-24">
            <Outlet />
          </div>

          {/* Floating Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all"
            title="Help & Documentation"
          >
            <HelpCircle className="w-6 h-6 animate-pulse" />
          </button>
        </main>
      </div>

      {/* Help Drawer Overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowHelp(false)} 
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-300" />
                <h2 className="font-bold text-lg">Balingasag CMS Help Guide</h2>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-lg hover:bg-emerald-700 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Overview */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Overview
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Welcome to the Balingasag Tourism Guide CMS. This administration portal allows you to manage travel content, moderate inquiries, and seed user accounts.
                </p>
              </div>

              {/* Page Building Sections */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Modular Content Block Types
                </h3>
                <div className="space-y-2.5">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="font-bold text-xs text-gray-800">1. Hero Banner</div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      A visual header with a big title, subheadline, and high-quality background picture. Perfect for top-of-page introductions.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="font-bold text-xs text-gray-800">2. Rich Text Block</div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Prose paragraph block supporting general text, historical descriptions, local folklore, or travel directions.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="font-bold text-xs text-gray-800">3. Bento / Grid Gallery</div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Display stunning travel photography. Supports standard symmetrical square grids or dynamic Bento asymmetric layouts.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="font-bold text-xs text-gray-800">4. Highlights (Facts)</div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Structured bullet lists. Perfect for travel expenses, operational hours, fees, contact numbers, and guidelines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Keyboard Shortcuts
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Save Changes</span>
                    <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono font-bold shadow-xs">Ctrl + S</kbd>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Close Drawer</span>
                    <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono font-bold shadow-xs">ESC</kbd>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-[11px] text-emerald-800 leading-relaxed">
                <div className="font-bold mb-1">💡 Professional Tips:</div>
                <ul className="list-disc pl-4 space-y-1 text-emerald-700">
                  <li>Slugs are automatically sanitized into lower-case alphanumeric-hyphen form in real time.</li>
                  <li>Clicking dark backdrops or pressing <code>ESC</code> instantly dismisses help menus and popups.</li>
                  <li>Make sure to save changes before navigating away to avoid dirty form warnings.</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400 font-medium">
              Balingasag CMS Help Desk &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}
    </NotificationProvider>
  );
}
