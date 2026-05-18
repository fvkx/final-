import { useEffect } from 'react';
import { Landmark } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';

const curatedSections = [
  {
    title: '🛖 Tribal Roots and Etymology',
    content: [
      'The Name: The word "Balingasag" comes from the Cebuano words baling (fishing net) and kasag (crab), honoring its traditional livelihood as a coastal fishing village.',
      'Pre-Hispanic Rule: Long before Spanish arrival, the settlement was governed by two powerful native Datus who represented the Valmores and Madroño clans. They peacefully divided the town—a dual family heritage that local history still recognizes today.',
      'Indigenous Culture: Beyond the town center, the mountains of Balingasag shelter indigenous Higaonon communities that continue to perform colorful ritual dances and preserve ancestral farming styles.'
    ],
    image: '/uploads/balingasag_river.jpg',
    imageAlt: 'Tribal Roots & Weaving Crafts'
  },
  {
    title: '🏛️ Colonial Architecture & Heritage Houses',
    content: [
      'Balingasag is famous across Northern Mindanao for its high concentration of intact 19th-century Bahay na Bato structures.',
      'The Vega Ancestral House: This 200-year-old landmark is the crown jewel of the town\'s heritage. Built using rare Philippine hardwoods like molave (tugas) and tindalo, its unique feature is the carved wooden figures called oti-ot. These sculptures resemble the Greek titan Atlas and look as if they are carrying the weight of the second floor on their shoulders. Historically, national figures like Emilio Aguinaldo and Sergio Osmeña stayed here.',
      'Other Ancestral Mansions: Structures like the Ramon Neri Ludeña House and the Moreno-Almendrala House give the town center a living-history museum atmosphere.'
    ],
    image: '/uploads/vega_ancestral_house.jpg',
    imageAlt: 'Colonial Heritage & Vega Ancestral House'
  },
  {
    title: '⛪ Religious Devotion & Festivals',
    content: [
      'Faith Center: The Sta. Rita de Cascia Parish Church stands as a symbol of the town\'s resilience. Its brick facade links the community directly to the early Jesuit mission established in 1744.',
      'The Santo Niño Legacy: Cebuano merchant Ignacio Juan Vega introduced the deep devotion to the Señor Santo Niño in the 1800s. This eventually blossomed into the Sinulog sa Balingasag, the town\'s grandest annual cultural dance festival celebrated every January.'
    ],
    image: 'https://images.unsplash.com/photo-1581513118044-696c147c1a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwZmVzdGl2YWwlMjBjb2xvcmZ1bCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc3Nzk2NTg5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Religious Devotions & Sinulog sa Balingasag'
  },
  {
    title: '🍛 Culinary Heritage',
    content: [
      'Kakanin Traditions: Local food culture is anchored in sweet sticky rice treats.',
      'Bibingka: The town is locally celebrated for its native Bibingka (baked rice cakes), a popular comfort food and souvenir for travelers passing through the national highway.'
    ],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxpcGlubyUyMGZvb2QlMjBkZXNzZXJ0JTIwYmliaW5na2F8ZW58MXx8fHwxNzc3OTY1ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Balingasag Culinary Heritage & Bibingka'
  }
];

export function CulturePage() {
  useEffect(() => {
    document.title = 'Culture & Heritage | Balingasag Tourism Guide';
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-amber-800 py-20 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1599302994569-6fd86e9529e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwaW5kaWdlbm91cyUyMGN1bHR1cmUlMjB3ZWF2aW5nJTIwY3JhZnRzfGVufDF8fHx8MTc3Nzk2NTkwMHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Balingasag culture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <Landmark className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Traditions & Identity</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4 leading-tight">
            Local Culture & Heritage of Balingasag
          </h1>
          <p className="text-amber-100 text-lg max-w-3xl mx-auto leading-relaxed">
            The local culture and heritage of Balingasag blend pre-Hispanic tribal rules, deep-rooted Catholic faith, and remarkably intact Spanish-colonial architecture. Local advocates are pushing for the town's inclusion in the UNESCO World Heritage list due to its well-preserved historical structures.
          </p>
        </div>
      </div>

      {/* Curated Content Sections (Alternating standard layout) */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {curatedSections.map((section, idx) => (
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
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Cultural Respect Note */}
      <div className="bg-amber-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Visiting Indigenous Communities</h3>
          <p className="text-amber-100 text-lg leading-relaxed mb-8">
            When visiting indigenous Higaonon communities in Balingasag's upland barangays, please show respect for their customs, ask permission before photography, and engage only through officially arranged community tours.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-amber-700 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold transition-all border border-amber-600"
          >
            Arrange a Guided Visit
          </Link>
        </div>
      </div>
    </div>
  );
}
