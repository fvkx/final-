import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, FileText, Layout, ChevronRight, Search, Filter } from 'lucide-react';
import { contentApi } from '../../lib/adminApi';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'tourist-spot', name: 'Tourist Spots', icon: Globe, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'culture', name: 'Culture & Heritage', icon: FileText, color: 'text-amber-600 bg-amber-50' },
  { id: 'event', name: 'Events', icon: Layout, color: 'text-purple-600 bg-purple-50' },
  { id: 'travel-guide', name: 'Travel Guide', icon: FileText, color: 'text-blue-600 bg-blue-50' },
];

export function ContentManager() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

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
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      const response = await contentApi.delete(id);
      if (response.success) {
        setPages(pages.filter(p => p.id !== id));
      }
    } catch (error) {
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
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-500">Manage your website pages and modular content</p>
        </div>
        <Link
          to="/admin/content/new"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors self-start"
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
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-100 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-100 outline-none appearance-none"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading pages...</div>
        ) : filteredPages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No pages found matching your filters.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPages.map((page) => {
              const pageCategory = page.category_slug || page.category;
              const category = categories.find(c => c.id === pageCategory);
              const Icon = category?.icon || Globe;
              return (
                <div key={page.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{page.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-mono">{page.slug}</span>
                        <span>•</span>
                        <span className={`capitalize ${page.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                          {page.status}
                        </span>
                        {page.featured && (
                          <>
                            <span>•</span>
                            <span className="text-purple-600 font-medium">Featured</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/admin/content/edit/${page.id}`}
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                      title="Edit Content"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <ChevronRight className="w-4 h-4 text-gray-300" />
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
