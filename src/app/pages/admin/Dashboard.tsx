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
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Content Pages', value: stats?.totalPages || 0, icon: FileText, color: 'bg-emerald-500' },
    { title: 'Total Inquiries', value: stats?.totalInquiries || 0, icon: Mail, color: 'bg-purple-500' },
    { title: 'Unread Inquiries', value: stats?.unreadInquiries || 0, icon: Bell, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
            <div className={`p-4 rounded-lg ${stat.color} text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Welcome to Balingasag CMS</h2>
        <p className="text-gray-600">
          Use the sidebar to navigate through the different management modules.
          Ensure that you maintain the content regularly to keep the Balingasag Tourism website up to date.
        </p>
      </div>
    </div>
  );
}
