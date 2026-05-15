import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DestinationCardProps {
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  bestTime: string;
  whyVisit: string;
  highlights: string[];
}

export function DestinationCard({ name, location, description, imageUrl, bestTime, whyVisit, highlights }: DestinationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
          <div className="flex items-center gap-2 text-white/90 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-700 mb-4">{description}</p>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-900 mb-1">Why Visit?</p>
          <p className="text-sm text-gray-700">{whyVisit}</p>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Best Time: {bestTime}</span>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">Top Experiences:</p>
          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
