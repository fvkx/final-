import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, FileText, Layout, ChevronRight, Search, Filter } from 'lucide-react';
import { contentApi } from '../../lib/adminApi';
import { Link } from 'react-router-dom';
import { AdminSkeletonList } from '../../components/SkeletonCard';

const categories = [
  { id: 'tourist-spot', name: 'Tourist Spots', icon: Globe, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'culture', name: 'Culture & Heritage', icon: FileText, color: 'text-amber-600 bg-amber-50' },
  { id: 'event', name: 'Events', icon: Layout, color: 'text-purple-600 bg-purple-50' },
  { id: 'travel-guide', name: 'Travel Guide', icon: FileText, color: 'text-blue-600 bg-blue-50' },
];

import { useNotifications } from '../../context/NotificationContext';

export function ContentManager() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { confirm, toast } = useNotifications();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await contentApi.getAll();
      if (response.success) {
        setPages(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm(
      'Delete Page',
      'Are you sure you want to delete this page? This action cannot be undone.'
    );
    if (!confirmed) return;
    try {
      const response = await contentApi.delete(id);
      if (response.success) {
        setPages(pages.filter(p => p.id !== id));
        toast('Page deleted successfully!', 'success');
      }
    } catch (error) {
      toast('Failed to delete page', 'error');
      console.error('Failed to delete page:', error);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase());
    // Backend returns category_slug from the JOIN
    const pageCategory = page.category_slug || page.category;
    const matchesCategory = activeCategory === 'all' || pageCategory === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Content Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your website pages and modular content</p>
        </div>
        <Link
          to="/admin/content/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md self-start font-medium"
        >
          <Plus className="w-4 h-4" /> Create New Page
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 outline-none appearance-none transition-all"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Page List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <AdminSkeletonList count={5} />
        ) : filteredPages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No pages found matching your filters.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredPages.map((page) => {
              const pageCategory = page.category_slug || page.category;
              const category = categories.find(c => c.id === pageCategory);
              const Icon = category?.icon || Globe;
              return (
                <div key={page.id} className="p-5 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${category?.color || 'text-gray-600 bg-gray-50'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{page.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{page.slug}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className={`flex items-center gap-1.5 font-medium ${page.status === 'published' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {page.status}
                        </span>
                        {page.featured && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-purple-600 font-semibold uppercase tracking-wider text-[10px]">Featured</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <Link
                      to={`/admin/content/edit/${page.id}`}
                      className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      title="Edit Content"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Delete Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-100 mx-2" />
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
