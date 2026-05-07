import { cultureSections } from '../data/culture';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CheckCircle2 } from 'lucide-react';

export function CulturePage() {
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
          <span className="text-amber-300 font-semibold text-sm uppercase tracking-widest">Traditions & Identity</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">Local Culture & Heritage</h1>
          <p className="text-amber-100 text-lg max-w-2xl mx-auto">
            Explore the living traditions, indigenous heritage, and vibrant cultural identity that define the soul of Balingasag.
          </p>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-amber-900 text-lg leading-relaxed">
            Balingasag's cultural identity is a rich tapestry woven from the traditions of the <strong>Higaonon indigenous peoples</strong>, centuries of <strong>Spanish colonial influence</strong>, and the everyday customs of a thriving coastal and agricultural community. Understanding this heritage is key to appreciating the depth and warmth of Balingasag's spirit.
          </p>
        </div>
      </div>

      {/* Culture Sections */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {cultureSections.map((section, idx) => (
          <div
            key={section.id}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start`}
          >
            <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
              <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">{section.subtitle}</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-5">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{section.description}</p>

              {section.facts && section.facts.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <h4 className="font-semibold text-amber-900 mb-3">Key Facts</h4>
                  <ul className="space-y-2">
                    {section.facts.map((fact) => (
                      <li key={fact} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className={`rounded-2xl overflow-hidden shadow-xl aspect-[4/3] ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <ImageWithFallback
                src={section.imageUrl}
                alt={section.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Cultural Respect Note */}
      <div className="bg-amber-700 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3">Visiting Indigenous Communities</h3>
          <p className="text-amber-100 leading-relaxed">
            When visiting indigenous Higaonon communities in Balingasag's upland barangays, please show respect for their customs, ask permission before photography, and engage only through officially arranged community tours. Your respectful engagement directly supports the preservation of living cultural heritage.
          </p>
          <p className="text-amber-200 text-sm mt-4">
            Contact the Municipal Tourism Office to arrange culturally sensitive guided visits.
          </p>
        </div>
      </div>
    </div>
  );
}
