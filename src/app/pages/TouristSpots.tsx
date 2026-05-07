import { useState } from 'react';
import { Search, X, MapPin, Clock, Star, ChevronRight } from 'lucide-react';
import { destinations, type Destination } from '../data/destinations';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const categories = ['All', 'Beach', 'Waterfalls', 'Heritage', 'Nature', 'Religious', 'Cultural'] as const;

const categoryColors: Record<string, string> = {
  Beach: 'bg-cyan-100 text-cyan-800',
  Waterfalls: 'bg-blue-100 text-blue-800',
  Heritage: 'bg-amber-100 text-amber-800',
  Nature: 'bg-emerald-100 text-emerald-800',
  Religious: 'bg-purple-100 text-purple-800',
  Cultural: 'bg-rose-100 text-rose-800',
};

function SpotModal({ spot, onClose }: { spot: Destination; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-72">
          <ImageWithFallback
            src={spot.imageUrl}
            alt={spot.name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[spot.category]}`}>
              {spot.category}
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">{spot.name}</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {spot.location}
          </div>

          <p className="text-gray-700 leading-relaxed mb-5">{spot.longDescription}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1">
                <Clock className="w-4 h-4" />
                Best Time to Visit
              </div>
              <p className="text-gray-700 text-sm">{spot.bestTime}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
                <Star className="w-4 h-4" />
                Why Visit
              </div>
              <p className="text-gray-700 text-sm">{spot.whyVisit}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Highlights</h4>
            <div className="flex flex-wrap gap-2">
              {spot.highlights.map((h) => (
                <span key={h} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{h}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TouristSpots() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<Destination | null>(null);

  const filtered = destinations.filter((d) => {
    const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="relative bg-emerald-800 py-20 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758782551912-80cf4c578220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGlzbGFuZCUyMGJheSUyMFBoaWxpcHBpbmVzJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3Nzc5NjU5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Balingasag"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-emerald-300 font-semibold text-sm uppercase tracking-widest">Explore</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">Tourist Spots Gallery</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Discover the natural wonders, heritage sites, and cultural treasures of Balingasag, Misamis Oriental.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search spots by name or category..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-gray-800"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-6">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> spot{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' && <> in <span className="font-semibold text-emerald-700">{activeCategory}</span></>}
          {search && <> matching "<span className="font-semibold text-gray-800">{search}</span>"</>}
        </p>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No spots found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((spot) => (
              <div
                key={spot.id}
                onClick={() => setSelectedSpot(spot)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={spot.imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[spot.category]}`}>
                      {spot.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {spot.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    {spot.location}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{spot.description}</p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {spot.bestTime}
                    </div>
                    <span className="text-emerald-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSpot && (
        <SpotModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </div>
  );
}
