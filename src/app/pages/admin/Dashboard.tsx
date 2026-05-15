import { useEffect, useState } from 'react';
import { Users, Mail, Bell, FileText } from 'lucide-react';
import { dashboardApi } from '../../lib/adminApi';

interface DashboardStats {
  totalUsers: number;
  totalPages: number;
  totalInquiries: number;
  unreadInquiries: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { title: 'Content Pages', value: stats?.totalPages || 0, icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Total Inquiries', value: stats?.totalInquiries || 0, icon: Mail, color: 'text-purple-600 bg-purple-50' },
    { title: 'Unread Inquiries', value: stats?.unreadInquiries || 0, icon: Bell, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, here's what's happening with your site.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
