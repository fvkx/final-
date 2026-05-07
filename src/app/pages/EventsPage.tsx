import { Calendar, Tag, Star } from 'lucide-react';
import { events, type Event } from '../data/events';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const categoryColors: Record<Event['category'], string> = {
  Festival: 'bg-purple-100 text-purple-800',
  Religious: 'bg-blue-100 text-blue-800',
  Cultural: 'bg-amber-100 text-amber-800',
  Civic: 'bg-emerald-100 text-emerald-800',
};

const CURRENT_MONTH = 9; // September — near St. Michael's feast

function EventCard({ event, featured = false }: { event: Event; featured?: boolean }) {
  const isUpcoming = event.month >= CURRENT_MONTH;

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden border transition-all hover:shadow-xl ${featured ? 'border-amber-300 ring-2 ring-amber-200' : 'border-gray-100'}`}>
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
          {isUpcoming && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Upcoming
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[event.category]}`}>
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          {event.date}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{event.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}

export function EventsPage() {
  const featured = events.filter((e) => e.featured);
  const other = events.filter((e) => !e.featured);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-purple-800 py-20 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1581513118044-696c147c1a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwZmVzdGl2YWwlMjBjb2xvcmZ1bCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc3Nzk2NTg5NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Festival"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-purple-300 font-semibold text-sm uppercase tracking-widest">Celebrate With Us</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">Events & Festivals</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Experience the vibrant fiestas, cultural celebrations, and annual festivals that make Balingasag come alive throughout the year.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Events */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Featured Events</h2>
              <p className="text-gray-500 text-sm">Balingasag's most celebrated occasions</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} featured />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Tag className="w-4 h-4" />
            All Events
          </div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* All Other Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {other.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Calendar Note */}
      <div className="bg-purple-50 border-t border-purple-100 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Around the Fiestas</h3>
          <p className="text-gray-600">
            Visiting Balingasag during a festival is one of the most memorable experiences you can have. The Town Fiesta in late September is particularly recommended for its combination of religious solemnity and joyful community celebration.
          </p>
          <p className="text-gray-500 text-sm mt-3">
            For exact dates and event schedules, contact the <strong>Municipal Tourism Office</strong> at (088) 856-1234.
          </p>
        </div>
      </div>
    </div>
  );
}
