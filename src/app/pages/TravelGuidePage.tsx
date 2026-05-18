import { useState, useEffect } from 'react';
import { Bus, TreePine, ChevronRight, Info } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { contentApi } from '../lib/adminApi';
import { Link } from 'react-router-dom';
import { DynamicModal } from '../components/DynamicModal';

export function TravelGuidePage() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Travel Guide | Balingasag Practical Visitor Info';
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await contentApi.getAll('travel-guide');
      if (response.success) {
        setGuides(response.data.filter((p: any) => p.status === 'published'));
      }
    } catch (error) {
      console.error('Failed to fetch travel guides:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-emerald-900 py-24 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1739769234606-6ca9c9ecc925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMG1vdW50YWluJTIwaGlraW5nJTIwbmF0dXJlJTIwdHJhaWx8ZW58MXx8fHwxNzc3OTY1ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Travel"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <TreePine className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Practical Information</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Travel Guide & Tips</h1>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to know to plan a smooth and memorable trip to Balingasag, Misamis Oriental.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Bus className="w-8 h-8 text-emerald-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Travel guides are on their way</h3>
            <p className="text-gray-500 mt-2">We're compiling the latest travel tips, routes, and local secrets for you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setSelectedSlug(guide.slug)}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={guide.image_url || 'https://images.unsplash.com/photo-1739769234606-6ca9c9ecc925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-3">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                    {guide.description || `Essential tips and information regarding ${guide.title}. View our comprehensive guide for a better trip.`}
                  </p>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Full Guide <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Help */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-emerald-900 text-white rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="w-20 h-20 bg-emerald-800 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-700">
            <Info className="w-10 h-10 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">Need personalized assistance?</h3>
            <p className="text-emerald-100 leading-relaxed mb-6">
              If you have specific questions about transportation, group bookings, or local regulations, our team at the Municipal Tourism Office is here to help.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-emerald-900 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all"
            >
              Contact Local Experts
            </Link>
          </div>
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