import { useEffect } from 'react';
import { MapPin, Users, Mountain, Waves, Calendar, Globe } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const factCards = [
  { icon: Globe, label: 'Province', value: 'Misamis Oriental' },
  { icon: MapPin, label: 'Region', value: 'Northern Mindanao (Region X)' },
  { icon: Users, label: 'Population', value: '~75,000 residents' },
  { icon: Calendar, label: 'Patron Saint', value: 'Señor Santo Niño & Santa Rita' },
  { icon: Mountain, label: 'Terrain', value: 'Coastal & Rugged Mountains' },
  { icon: Waves, label: 'Waterfront', value: 'Macajalar Bay coastline' },
];

const sections = [
  {
    title: '📍Geography & Location',
    content: [
      'Balingasag is a coastal municipality located in the province of Misamis Oriental, Philippines. It sits along the shores of Macajalar Bay, approximately 52 kilometers northeast of the regional capital, Cagayan de Oro City. The town is bordered by the municipality of Lagonglong to the north, Jasaan to the south, and a rugged mountainous interior to the east. It serves as a vital economic hub for neighboring towns due to its flat coastal plains and strategic location along the major national highway.'
    ],
    image: '/uploads/about_geography.png',
    imageAlt: 'Geography & Location of Balingasag'
  },
  {
    title: '📜A Brief History',
    content: [
      'Founded as a mission station by Jesuit priests in 1744, Balingasag is one of the oldest settlements in Misamis Oriental. The town\'s early center developed around the Sta. Rita de Cascia Parish. During the Spanish colonial era, it was established as a formal pueblo due to its growing population and economic importance. The town survived structural burnings during the Philippine-American War and occupation during World War II, transitioning after the wars into a peaceful agricultural and fishing community.'
    ],
    image: '/uploads/vega_ancestral_house.jpg',
    imageAlt: 'A Brief History of Balingasag'
  },
  {
    title: '👥 Population & Community',
    content: [
      'Balingasag is classified as a 1st class municipality, with a population hovering around 75,000 residents distributed across 30 barangays. The community is predominantly Cebuano-speaking, and the local culture is deeply anchored in Roman Catholicism. Agriculture and fishing form the economic backbone of the community, creating a tight-knit, hospitable, and culturally vibrant society that takes great pride in its shared heritage.'
    ],
    image: '/uploads/about_population.jpg',
    imageAlt: 'Population & Community in Balingasag'
  },
  {
    title: '🏝️Tourism Overview',
    content: [
      'The town blends historical charm with natural coastal beauty. Its tourism landscape features Spanish-era ancestral homes and the landmark Sta. Rita de Cascia Parish Church. Nature lovers frequently visit the White Shoal reef for diving and the scenic Balingasag Riverboardwalk park for sunsets. The town experiences its highest peak in tourism during the annual Sinulog sa Balingasag festival in January and the feast of Santa Rita in May.'
    ],
    image: '/uploads/white_shoal_reef.jpg',
    imageAlt: 'Tourism Overview in Balingasag'
  }
];

export function AboutPage() {
  useEffect(() => {
    document.title = 'About Balingasag | History, Geography & Tourism';
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-emerald-800 py-20 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758782551916-1723a9cd00eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwdHJvcGljYWwlMjBiZWFjaCUyMGNvYXN0bGluZXxlbnwxfHx8fDE3Nzc5NjU4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Balingasag"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-emerald-300 font-semibold text-sm uppercase tracking-widest">Learn More</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">About Balingasag</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            A coastal municipality in Misamis Oriental where centuries of history, natural beauty, and community spirit converge.
          </p>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {factCards.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors">
                <Icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-gray-900 text-sm">{value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {sections.map((section, idx) => (
          <div
            key={section.title}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-5">{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
            <div className={`rounded-2xl overflow-hidden shadow-xl aspect-[4/3] ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <ImageWithFallback
                src={section.image}
                alt={section.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
