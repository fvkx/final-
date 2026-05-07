import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, MapPin } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Tourist Spots', path: '/tourist-spots' },
  { label: 'About', path: '/about' },
  { label: 'Culture & Heritage', path: '/culture' },
  { label: 'Events', path: '/events' },
  { label: 'Travel Guide', path: '/travel-guide' },
  { label: 'Map', path: '/map' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-lg leading-none block">Balingasag</span>
            <span className="text-emerald-600 text-xs leading-none">Tourism Guide</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                isActive(link.path)
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-md text-sm transition-colors ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
