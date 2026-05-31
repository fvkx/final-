import { useEffect, useState } from 'react';
import { Users, Mail, Bell, FileText, ExternalLink } from 'lucide-react';
import { dashboardApi } from '../../lib/adminApi';
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from '../../components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

  const trafficData = [
    { name: 'Mon', visitors: 420, pageViews: 880 },
    { name: 'Tue', visitors: 520, pageViews: 1020 },
    { name: 'Wed', visitors: 610, pageViews: 1170 },
    { name: 'Thu', visitors: 530, pageViews: 980 },
    { name: 'Fri', visitors: 700, pageViews: 1240 },
    { name: 'Sat', visitors: 760, pageViews: 1350 },
    { name: 'Sun', visitors: 690, pageViews: 1290 },
  ];

  const userData = [
    { name: 'Week 1', signups: 14, inquiries: 9 },
    { name: 'Week 2', signups: 18, inquiries: 12 },
    { name: 'Week 3', signups: 22, inquiries: 15 },
    { name: 'Week 4', signups: 20, inquiries: 13 },
  ];

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

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Traffic Trends</h2>
            <p className="text-sm text-gray-500 mt-1">Visitor and page view performance over the last 7 days.</p>
          </div>
          <div className="h-80 px-6 pb-6">
            <ChartContainer
              config={{
                visitors: { label: 'Visitors', color: 'rgb(34 197 94)' },
                pageViews: { label: 'Page Views', color: 'rgb(59 130 246)' },
              }}
              className="h-full"
            >
              <LineChart data={trafficData} margin={{ top: 8, right: 20, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <ChartLegendContent />
                <Line type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="pageViews" stroke="var(--color-pageViews)" strokeWidth={3} dot={false} />
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">New Users & Inquiries</h2>
            <p className="text-sm text-gray-500 mt-1">Weekly new signups compared with incoming inquiries.</p>
          </div>
          <div className="h-80 px-6 pb-6">
            <ChartContainer
              config={{
                signups: { label: 'New Signups', color: 'rgb(79 70 229)' },
                inquiries: { label: 'Inquiries', color: 'rgb(234 179 8)' },
              }}
              className="h-full"
            >
              <BarChart data={userData} margin={{ top: 8, right: 20, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <ChartLegendContent />
                <Bar dataKey="signups" fill="var(--color-signups)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="inquiries" fill="var(--color-inquiries)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
