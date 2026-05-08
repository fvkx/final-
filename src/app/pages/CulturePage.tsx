import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ChevronRight, Landmark } from 'lucide-react';
import { contentApi } from '../lib/adminApi';
import { Link } from 'react-router-dom';
import { DynamicModal } from '../components/DynamicModal';

export function CulturePage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await contentApi.getAll('culture');
      if (response.success) {
        setPages(response.data.filter((p: any) => p.status === 'published'));
      }
    } catch (error) {
      console.error('Failed to fetch culture pages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-amber-800 py-24 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1599302994569-6fd86e9529e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwaW5kaWdlbm91cyUyMGN1bHR1cmUlMjB3ZWF2aW5nJTIwY3JhZnRzfGVufDF8fHx8MTc3Nzk2NTkwMHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Balingasag culture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <Landmark className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Traditions & Identity</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Local Culture & Heritage</h1>
          <p className="text-amber-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Explore the living traditions, indigenous heritage, and vibrant cultural identity that define the soul of Balingasag.
          </p>
        </div>
      </div>

      {/* Content List */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic">
            Cultural heritage content is being prepared. Please check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {pages.map((page, idx) => (
              <div
                key={page.id}
                onClick={() => setSelectedSlug(page.slug)}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer"
              >
                <div className="relative h-72 overflow-hidden">
                  <ImageWithFallback
                    src={page.image_url || 'https://images.unsplash.com/photo-1599302994569-6fd86e9529e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                    alt={page.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-3">
                    {page.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {page.description || `Discover the rich history and traditions associated with ${page.title}. Click to explore detailed highlights and media.`}
                  </p>
                  <span className="text-amber-700 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Heritage <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cultural Respect Note */}
      <div className="bg-amber-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Visiting Indigenous Communities</h3>
          <p className="text-amber-100 text-lg leading-relaxed mb-8">
            When visiting indigenous Higaonon communities in Balingasag's upland barangays, please show respect for their customs, ask permission before photography, and engage only through officially arranged community tours.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-amber-700 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold transition-all border border-amber-600"
          >
            Arrange a Guided Visit
          </Link>
        </div>
      </div>

      {/* Detail Modal */}
      <DynamicModal 
        slug={selectedSlug || ''} 
        isOpen={!!selectedSlug} 
        onClose={() => setSelectedSlug(null)} 
      />
    </div>
  );
}
