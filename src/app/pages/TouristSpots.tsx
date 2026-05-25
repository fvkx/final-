import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, HelpCircle, Info, Waves, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { contentApi } from '../lib/adminApi';
import { SkeletonGrid } from '../components/SkeletonCard';

import { DynamicModal } from '../components/DynamicModal';

export function TouristSpots() {
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = 'Tourist Spots | Balingasag Nature & Attractions';
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const response = await contentApi.getAll('tourist-spot');
      if (response.success) {
        const publishedSpots = response.data.filter((p: any) => p.status === 'published');
        // Sort featured spots first
        const sortedSpots = publishedSpots.sort((a: any, b: any) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        setSpots(sortedSpots);
        setFetchError(null);
      } else {
        setFetchError('Unable to load tourist spots. Please refresh the page or try again later.');
      }
    } catch (error) {
      console.error('Failed to fetch spots:', error);
      setFetchError('Unable to load tourist spots. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredSpots = spots.filter(spot =>
    !normalizedSearch || spot.title.toLowerCase().includes(normalizedSearch)
  );

  const autocompleteSuggestions = normalizedSearch
    ? spots
        .filter(spot => spot.title.toLowerCase().includes(normalizedSearch))
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

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
            ref={searchInputRef}
            type="text"
            placeholder="Search destinations..."
            className="w-full pl-12 pr-12 py-3 rounded-xl text-gray-900 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search tourist spots"
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

          {searchFocused && autocompleteSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden z-50">
              {autocompleteSuggestions.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setSearchTerm(spot.title);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors"
                >
                  {spot.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Spots Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : fetchError ? (
          <div className="text-center py-20 bg-rose-50 rounded-3xl border border-rose-200">
            <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <X className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-rose-900">Unable to load spots</h3>
            <p className="text-rose-600 mt-2 max-w-md mx-auto">{fetchError}</p>
            <button
              onClick={fetchSpots}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-all"
            >
              Retry loading spots
            </button>
          </div>
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

      {/* Floating Help Button */}
      <button
        type="button"
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all"
        title="Help & FAQs"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowHelp(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-emerald-300" />
                <h2 className="font-bold text-lg">Tourist Spots Help</h2>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-lg hover:bg-emerald-700 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />Quick tips
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Use the search box to discover tourist spots quickly. This guide helps you find places faster and recover from errors.
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <div className="font-bold text-xs text-gray-900 mb-2">Search shortcuts</div>
                  <ul className="list-disc list-inside text-xs text-gray-700 space-y-2">
                    <li>Press <kbd className="rounded bg-white px-1.5 py-0.5 text-[11px] font-mono">/</kbd> or <kbd className="rounded bg-white px-1.5 py-0.5 text-[11px] font-mono">Ctrl+K</kbd> to focus search.</li>
                    <li>Type a destination name to reveal autocomplete suggestions immediately.</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <div className="font-bold text-xs text-gray-900 mb-2">Troubleshooting</div>
                  <ul className="list-disc list-inside text-xs text-gray-700 space-y-2">
                    <li>If spots fail to load, press the retry button shown in the error panel.</li>
                    <li>Clear search by clicking the X icon in the search field.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <DynamicModal 
        slug={selectedSlug || ''} 
        isOpen={!!selectedSlug} 
        onClose={() => setSelectedSlug(null)} 
      />
    </div>
  );
}
