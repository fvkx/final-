import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-lg leading-none block">Balingasag</span>
              <span className="text-emerald-400 text-xs leading-none">Tourism Guide</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your visual discovery hub for the natural beauty, rich culture, and vibrant community of Balingasag, Misamis Oriental.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors" aria-label="Like">
              <Heart className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-semibold text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/tourist-spots" className="hover:text-emerald-400 transition-colors">Tourist Spots</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Balingasag</Link></li>
            <li><Link to="/culture" className="hover:text-emerald-400 transition-colors">Culture & Heritage</Link></li>
            <li><Link to="/events" className="hover:text-emerald-400 transition-colors">Events & Festivals</Link></li>
          </ul>
        </div>

        {/* Plan */}
        <div>
          <h4 className="font-semibold text-white mb-4">Plan Your Visit</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/travel-guide" className="hover:text-emerald-400 transition-colors">Travel Guide & Tips</Link></li>
            <li><Link to="/map" className="hover:text-emerald-400 transition-colors">Map & Directions</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact the MTO</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Municipal Tourism Office</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Municipal Hall, Poblacion, Balingasag, Misamis Oriental 9005</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>(088) 856-1234</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>tourism@balingasag.gov.ph</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>&copy; 2026 Balingasag Tourism Guide. A visual discovery platform — no booking required.</p>
          <p>Municipality of Balingasag, Misamis Oriental, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
