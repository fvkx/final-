import { MapPin } from 'lucide-react';
import { mapLocations } from '../data/mapLocations';

export function InteractiveMap() {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-700 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Explore Destinations</h2>
          <p className="text-xl text-blue-100">Click on any location to discover more</p>
        </div>

        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 overflow-hidden">
          <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-100 to-green-100 rounded-xl overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>

            {mapLocations.map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ top: location.position.top, left: location.position.left }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 animate-pulse"></div>
                  <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg group-hover:scale-125 transition-transform duration-300 fill-red-500" />

                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                    <p className="font-bold text-gray-900 text-sm">{location.name}</p>
                    <p className="text-xs text-gray-600">{location.region}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {mapLocations.map((location) => (
              <div key={location.id} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{location.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
