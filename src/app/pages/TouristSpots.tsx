import { useState, useEffect } from 'react';
import { Search, ChevronRight, Info, Waves, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { contentApi } from '../lib/adminApi';
import { SkeletonGrid } from '../components/SkeletonCard';

import { DynamicModal } from '../components/DynamicModal';

export function TouristSpots() {
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Tourist Spots | Balingasag Nature & Attractions';
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const response = await contentApi.getAll('tourist-spot');
      if (response.success) {
        setSpots(response.data.filter((p: any) => p.status === 'published'));
      }
    } catch (error) {
      console.error('Failed to fetch spots:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpots = spots.filter(spot => 
    spot.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-emerald-800 pt-24 pb-16 px-4 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <Waves className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Balingasag Nature</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Explore Balingasag's Natural Wonders</h1>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto">
            From pristine beaches on Macajalar Bay to multi-tiered jungle waterfalls and lush mountain parks.
          </p>
        </div>
      </section>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full pl-12 pr-12 py-3 rounded-xl text-gray-900 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 p-1 rounded-full hover:bg-gray-100 transition-all"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="text-center text-xs text-gray-500 mt-2 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            Showing {filteredSpots.length} {filteredSpots.length === 1 ? 'destination' : 'destinations'} matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Spots Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : filteredSpots.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No destinations found</h3>
            <p className="text-gray-500 mt-2">Try searching for something else or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                onClick={() => setSelectedSlug(spot.slug)}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={spot.image_url || 'https://images.unsplash.com/photo-1758782551916-1723a9cd00eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {spot.featured && (
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      FEATURED
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                    {spot.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                    {spot.description || `Experience the natural beauty and tranquility of ${spot.title}. Click to view maps, highlights, and visitor guides.`}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-emerald-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore Experience <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Info */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-emerald-50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 border border-emerald-100">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <Info className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-1">Planning a group visit?</h3>
            <p className="text-emerald-700 text-sm leading-relaxed">
              For large groups, school trips, or official tours, please coordinate with the Municipal Tourism Office for proper assistance and safety guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <DynamicModal 
        slug={selectedSlug || ''} 
        isOpen={!!selectedSlug} 
        onClose={() => setSelectedSlug(null)} 
      />
    </div>
  );
}
