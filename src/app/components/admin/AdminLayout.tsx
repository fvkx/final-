import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, LogOut, FileText, ExternalLink } from 'lucide-react';
import { authApi } from '../../lib/adminApi';
import { NotificationProvider } from '../../context/NotificationContext';

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/admin/login');
  };

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
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
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
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
}
