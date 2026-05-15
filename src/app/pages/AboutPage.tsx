import { MapPin, Users, Mountain, Waves, Calendar, Globe } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const factCards = [
  { icon: Globe, label: 'Province', value: 'Misamis Oriental' },
  { icon: MapPin, label: 'Region', value: 'Northern Mindanao (Region X)' },
  { icon: Users, label: 'Population', value: '~65,000+' },
  { icon: Calendar, label: 'Patron Saint', value: 'St. Michael the Archangel' },
  { icon: Mountain, label: 'Terrain', value: 'Coastal & Upland' },
  { icon: Waves, label: 'Waterfront', value: 'Macajalar Bay' },
];

const sections = [
  {
    title: 'A Brief History',
    content: [
      'Balingasag is one of the oldest municipalities in Misamis Oriental, with roots stretching back to the pre-colonial era when Higaonon tribes inhabited its forested highlands and coastal communities lived along the shores of Macajalar Bay.',
      'The Spanish colonial period brought about the formal establishment of a parish and the reorganization of settlements around the Catholic church and central plaza — a pattern that persists in the town\'s urban layout today. The name "Balingasag" is believed to have origins in the local Visayan dialect, though its exact etymology remains a topic of local historical discussion.',
      'During the American colonial period, Balingasag was officially constituted as a municipality, with its boundaries, governance structure, and public institutions taking shape during this era. The municipality has grown steadily over the decades while retaining its strong sense of community and cultural identity.'
    ],
    image: 'https://images.unsplash.com/photo-1760549310131-b09d86c601e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMGhlcml0YWdlJTIwY2h1cmNoJTIwY29sb25pYWx8ZW58MXx8fHwxNzc3OTY1ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Balingasag heritage church'
  },
  {
    title: 'Geography & Location',
    content: [
      'Balingasag is strategically located along the northern coast of Mindanao, fronting the expansive Macajalar Bay. It lies approximately 60 kilometers east of Cagayan de Oro City, the regional center of Northern Mindanao. The municipality is bounded by the sea to the north and the Balatukan Mountain Range to the south, creating a dramatic landscape that transitions from coastal lowlands to forested highlands within a short distance.',
      'The municipality encompasses 26 barangays, spanning both coastal and upland areas. Its total land area includes fertile agricultural lands, forest reserves, river systems, and a significant stretch of coastline. This varied terrain supports diverse ecosystems — from coral reefs and mangrove forests along the coast to tropical forests and waterfalls in the highlands.',
      'The Balatukan Range, which forms the southern backdrop of Balingasag, is a significant natural landmark shared with neighboring municipalities and is part of the larger biodiversity corridor of Misamis Oriental.'
    ],
    image: 'https://images.unsplash.com/photo-1758782551912-80cf4c578220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGlzbGFuZCUyMGJheSUyMFBoaWxpcHBpbmVzJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3Nzc5NjU5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Macajalar Bay aerial view'
  },
  {
    title: 'Population & Community',
    content: [
      'Balingasag is home to a diverse population of approximately 65,000 residents, comprising mainly Visayan-speaking settlers (predominantly Cebuano and Binisaya speakers) alongside significant communities of Higaonon indigenous peoples in the upland barangays. This multicultural composition gives the municipality its unique social and cultural character.',
      'The local economy is driven by a combination of fishing, agriculture, trade, and a growing services sector. Fishing communities along Macajalar Bay form the backbone of the coastal economy, while inland barangays focus on tropical fruit farming — particularly bananas, pineapples, lanzones, and coconuts.',
      'The community is known for its warm hospitality and strong sense of bayanihan (communal cooperation). Residents take pride in their municipality and actively participate in local governance, religious activities, and cultural preservation efforts.'
    ],
    image: 'https://images.unsplash.com/photo-1759773533571-16c133e10ae8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMGZpc2hpbmclMjB2aWxsYWdlJTIwY29tbXVuaXR5fGVufDF8fHx8MTc3Nzk2MjE2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Balingasag community'
  },
  {
    title: 'Tourism Overview',
    content: [
      'Balingasag is an emerging tourism destination in Misamis Oriental, offering visitors an authentic and relatively undiscovered alternative to more commercialized destinations in the region. Its appeal lies in the combination of natural attractions — from pristine beaches and lush waterfalls to biodiversity-rich forests and marine sanctuaries — alongside a rich cultural heritage that spans both indigenous and colonial history.',
      'The Municipal Tourism Office actively promotes responsible and sustainable tourism, working with local communities to develop ecotourism programs, cultural tours, and visitor experiences that benefit local residents directly. Community-based tourism initiatives in upland barangays allow visitors to experience authentic rural life and indigenous culture.',
      'Infrastructure improvements, increased accessibility from Cagayan de Oro City, and growing awareness of Balingasag\'s natural and cultural assets are driving a steady increase in visitor numbers, positioning the municipality as one of Misamis Oriental\'s notable tourism destinations.'
    ],
    image: 'https://images.unsplash.com/photo-1646821198791-a3e16385a689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0JTIwUGhpbGlwcGluZXMlMjBpc2xhbmR8ZW58MXx8fHwxNzc3OTY1ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Balingasag tourism'
  }
];

export function AboutPage() {
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
