import { useEffect, useState } from 'react';
import { Users, Mail, Bell, FileText, ExternalLink } from 'lucide-react';
import { dashboardApi } from '../../lib/adminApi';

interface DashboardStats {
  totalUsers: number;
  totalPages: number;
  totalInquiries: number;
  unreadInquiries: number;
  drafts?: Array<{
    id: number;
    title: string;
    slug: string;
    category: string;
    status: string;
    created_at: string;
  }>;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | Balingasag CMS';
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

  const draftItems = stats?.drafts ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, here's what's happening with your site.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/10 hover:scale-[1.02] active:scale-[0.99]"
        >
          <span>View Main Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Drafts</h2>
            <p className="text-sm text-gray-500 mt-1">Latest draft content pages for quick review and edit.</p>
          </div>
          <a
            href="/admin/content?status=draft"
            className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
          >
            View all drafts
          </a>
        </div>
        <div className="divide-y divide-gray-100">
          {draftItems.length > 0 ? (
            draftItems.map((draft) => (
              <a
                key={draft.id}
                href={`/admin/content/edit/${draft.id}`}
                className="block px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{draft.title || draft.slug}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {draft.category || 'Uncategorized'} · {new Date(draft.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    {draft.status}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-sm text-gray-500">No draft items available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
