import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowDown, Waves, Landmark, TreePine, Calendar, Map, BookOpen, Phone, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { contentApi } from '../lib/adminApi';
import { API_BASE_URL } from '../lib/apiConfig';
import { DynamicModal } from '../components/DynamicModal';

const categoryCards = [
  {
    title: 'Tourist Spots',
    description: 'Beaches, waterfalls, and nature parks',
    icon: Waves,
    path: '/tourist-spots',
    color: 'from-cyan-500 to-blue-600',
    category: 'tourist_spot',
    image: 'https://images.unsplash.com/photo-1758782551916-1723a9cd00eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwdHJvcGljYWwlMjBiZWFjaCUyMGNvYXN0bGluZXxlbnwxfHx8fDE3Nzc5NjU4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'About Balingasag',
    description: 'History, geography, and community',
    icon: BookOpen,
    path: '/about',
    color: 'from-emerald-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1758782551912-80cf4c578220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGlzbGFuZCUyMGJheSUyMFBoaWxpcHBpbmVzJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3Nzc5NjU5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Culture & Heritage',
    description: 'Traditions, crafts, and local identity',
    icon: Landmark,
    path: '/culture',
    category: 'culture',
    color: 'from-amber-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1599302994569-6fd86e9529e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwaW5kaWdlbm91cyUyMGN1bHR1cmUlMjB3ZWF2aW5nJTIwY3JhZnRzfGVufDF8fHx8MTc3Nzk2NTkwMHww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Events & Festivals',
    description: 'Fiestas, festivals & celebrations',
    icon: Calendar,
    path: '/events',
    category: 'event',
    color: 'from-purple-500 to-pink-600',
    image: 'https://images.unsplash.com/photo-1581513118044-696c147c1a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwZmVzdGl2YWwlMjBjb2xvcmZ1bCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc3Nzk2NTg5NXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Travel Guide',
    description: 'Tips, transport & accommodation',
    icon: TreePine,
    path: '/travel-guide',
    category: 'travel_guide',
    color: 'from-lime-500 to-green-600',
    image: 'https://images.unsplash.com/photo-1739769234606-6ca9c9ecc925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMG1vdW50YWluJTIwaGlraW5nJTIwbmF0dXJlJTIwdHJhaWx8ZW58MXx8fHwxNzc3OTY1ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Map & Directions',
    description: 'How to get to Balingasag',
    icon: Map,
    path: '/map',
    color: 'from-sky-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1646821198791-a3e16385a689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0JTIwUGhpbGlwcGluZXMlMjBpc2xhbmR8ZW58MXx8fHwxNzc3OTY1ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export function Home() {
  const [featuredPages, setFeaturedPages] = useState<any[]>([]);
  const [stats, setStats] = useState({
    spots: 0,
    events: 0,
    traditions: 0
  });
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await contentApi.getAll();
      if (response.success) {
        const allPages = response.data;
        setFeaturedPages(allPages.filter((p: any) => p.featured && p.status === 'published').slice(0, 3));
        
        // Calculate counts
        setStats({
          spots: allPages.filter((p: any) => p.category === 'tourist_spot').length,
          events: allPages.filter((p: any) => p.category === 'event').length,
          traditions: allPages.filter((p: any) => p.category === 'culture').length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch home content:', error);
    }
  };

  const highlights = [
    { label: 'Tourist Spots', value: `${stats.spots}+`, desc: 'Natural & heritage sites' },
    { label: 'Festivals', value: `${stats.events}+`, desc: 'Annual celebrations' },
    { label: 'Barangays', value: '26', desc: 'Vibrant communities' },
    { label: 'Culture', value: `${stats.traditions}+`, desc: 'Living traditions' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758782551916-1723a9cd00eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwdHJvcGljYWwlMjBiZWFjaCUyMGNvYXN0bGluZXxlbnwxfHx8fDE3Nzc5NjU4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Balingasag coastline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium">Misamis Oriental, Philippines</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight drop-shadow-lg">
            Discover<br />
            <span className="text-emerald-400">Balingasag</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90 font-medium">
            Where the mountains meet the sea
          </p>
          <p className="text-base md:text-lg mb-10 text-white/75 max-w-2xl mx-auto">
            Explore pristine beaches, lush waterfalls, rich cultural heritage, and the warm hospitality of a community shaped by nature and tradition.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/tourist-spots"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg"
            >
              Explore Now
            </Link>
            <Link
              to="/travel-guide"
              className="bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/30 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce">
          <ArrowDown className="w-6 h-6" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-emerald-700 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {highlights.map((h) => (
            <div key={h.label}>
              <div className="text-3xl font-extrabold text-emerald-200">{h.value}</div>
              <div className="font-semibold mt-0.5">{h.label}</div>
              <div className="text-emerald-300 text-xs mt-0.5">{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Content from CMS */}
      {featuredPages.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Handpicked for you</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Featured Destinations</h2>
              </div>
              <Link to="/tourist-spots" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                View all destinations <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPages.map((page) => (
                <div 
                  key={page.id} 
                  onClick={() => setSelectedSlug(page.slug)} 
                  className="group bg-gray-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={page.image_url || 'https://images.unsplash.com/photo-1758782551916-1723a9cd00eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                      alt={page.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {page.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                      {page.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {page.description || 'Discover the unique beauty and heritage of this featured Balingasag location.'}
                    </p>
                    <span className="text-emerald-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore Experience <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Cards */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Explore Balingasag</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              From tranquil beaches to living indigenous cultures — discover everything Balingasag has to offer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.path}
                  to={card.path}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 aspect-[4/3]"
                >
                  <ImageWithFallback
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold leading-tight">{card.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{card.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Visit Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Why Balingasag?</span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-5 leading-tight">
                A Hidden Gem of<br />Misamis Oriental
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Nestled along the shores of Macajalar Bay and backed by the Balatukan mountain range, Balingasag offers a rare combination of coastal and highland natural beauty, alongside a vibrant cultural heritage that has endured for centuries.
              </p>
              <ul className="space-y-3">
                {[
                  'Crystal-clear waters and white sand beaches on Macajalar Bay',
                  'Multi-tiered jungle waterfalls and mountain trails',
                  'Centuries-old Spanish colonial heritage and parish church',
                  'Living Higaonon indigenous culture and traditions',
                  'Vibrant annual festivals and community celebrations',
                  'Fresh seafood, tropical fruits, and authentic local cuisine'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="inline-block mt-8 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl font-semibold transition-colors"
              >
                Learn More About Balingasag
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1739045969692-f694965be10c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMHdhdGVyZmFsbCUyMG5hdHVyZXxlbnwxfHx8fDE3Nzc5NjU4OTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Waterfall"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4 mt-6">
                <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1599302994569-6fd86e9529e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwaW5kaWdlbm91cyUyMGN1bHR1cmUlMjB3ZWF2aW5nJTIwY3JhZnRzfGVufDF8fHx8MTc3Nzk2NTkwMHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Culture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1771767643385-0d329fc614a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMG1hbmdyb3ZlJTIwZm9yZXN0JTIwbmF0dXJlfGVufDF8fHx8MTc3Nzk2NTg5Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Mangrove"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-emerald-700 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h2 className="text-3xl font-extrabold mb-3">Ready to Visit Balingasag?</h2>
          <p className="text-emerald-100 text-lg mb-8">
            Get inspired, plan your route, and discover the beauty of this coastal gem in Misamis Oriental.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/travel-guide"
              className="bg-white text-emerald-700 px-7 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              View Travel Guide
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white/60 text-white px-7 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Contact the MTO
            </Link>
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
