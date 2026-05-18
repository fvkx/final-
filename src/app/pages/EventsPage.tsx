import { useState, useEffect } from 'react';
import { Calendar, Star, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { contentApi } from '../lib/adminApi';
import { Link } from 'react-router-dom';
import { DynamicModal } from '../components/DynamicModal';
import { SkeletonGrid } from '../components/SkeletonCard';

export function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Events & Festivals | Balingasag Tourism Guide';
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await contentApi.getAll('event');
      if (response.success) {
        setEvents(response.data.filter((p: any) => p.status === 'published'));
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const featured = events.filter((e) => e.featured);
  const other = events.filter((e) => !e.featured);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-purple-800 py-24 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1581513118044-696c147c1a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwZmVzdGl2YWwlMjBjb2xvcmZ1bCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc3Nzk2NTg5NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Festival"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <Calendar className="w-4 h-4 text-purple-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Celebrate With Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Events & Festivals</h1>
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto">
            Experience the vibrant fiestas, cultural celebrations, and annual festivals that make Balingasag come alive.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {loading ? (
          <SkeletonGrid count={3} />
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            Event schedules are currently being finalized. Please check back later.
          </div>
        ) : (
          <div className="space-y-20">
            {/* Featured Events */}
            {featured.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  <h2 className="text-3xl font-extrabold text-gray-900">Featured Events</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featured.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedSlug(event.slug)}
                      className="group relative h-96 rounded-3xl overflow-hidden shadow-lg cursor-pointer"
                    >
                      <ImageWithFallback
                        src={event.image_url || 'https://images.unsplash.com/photo-1581513118044-696c147c1a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-3xl font-bold text-white mb-2">{event.title}</h3>
                        <p className="text-white/80 text-sm mb-4 line-clamp-2">
                          {event.description || 'Learn more about this major Balingasag celebration.'}
                        </p>
                        <span className="inline-flex items-center gap-2 text-white font-bold bg-purple-600 px-4 py-2 rounded-xl text-sm group-hover:bg-purple-500 transition-colors">
                          View Event Details <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Events */}
            {other.length > 0 && (
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Other Celebrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {other.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedSlug(event.slug)}
                      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 cursor-pointer"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <ImageWithFallback
                          src={event.image_url || 'https://images.unsplash.com/photo-1581513118044-696c147c1a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">{event.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {event.description || 'Discover the details of this Balingasag event.'}
                        </p>
                        <span className="text-purple-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Event <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calendar Note */}
      <div className="bg-purple-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Calendar className="w-10 h-10 text-purple-300 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Plan Around the Fiestas</h3>
          <p className="text-purple-100 text-lg leading-relaxed mb-8">
            Visiting Balingasag during a festival is one of the most memorable experiences you can have. The Town Fiesta in late September is particularly recommended.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-purple-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all"
          >
            Inquire About Festival Dates
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
