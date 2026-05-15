import { MapPin, Navigation, Bus, Car, Clock, Info } from 'lucide-react';

const landmarks = [
  { name: 'Balingasag Town Center', desc: 'Municipal Hall, Parish Church, Public Market', type: 'Civic' },
  { name: 'Balingasag Beach', desc: 'White sand beach along Macajalar Bay', type: 'Tourism' },
  { name: 'Binaliw Falls', desc: 'Multi-tiered waterfall in Brgy. Binaliw', type: 'Tourism' },
  { name: 'Marine Sanctuary', desc: 'Coral reef snorkeling area', type: 'Tourism' },
  { name: 'Mangrove Eco-Park', desc: 'Coastal mangrove forest boat tours', type: 'Tourism' },
  { name: 'Balatukan Mountain Trail', desc: 'Highland hiking trail entrance', type: 'Tourism' },
];

const directions = [
  {
    from: 'From Cagayan de Oro City (via Bus)',
    icon: Bus,
    steps: [
      'Go to the Agora Bus Terminal in Cagayan de Oro City.',
      'Board a Cagayan de Oro to Gingoog or Davao-bound bus.',
      'Tell the conductor you are disembarking at Balingasag.',
      'The journey takes approximately 1.5 to 2 hours depending on traffic.',
      'Fare: approx. ₱80–₱120 per person.',
      'From the Balingasag bus stop, tricycles and habal-habals (motorcycle taxis) are available to take you to your destination within the municipality.'
    ]
  },
  {
    from: 'From Cagayan de Oro City (via Private Vehicle)',
    icon: Car,
    steps: [
      'From CDO, take the Cagayan-Iligan City Highway (N1) heading east.',
      'Pass through Opol, then El Salvador City.',
      'Continue past Alubijid, then Laguindingan.',
      'Proceed to Gitagum, then turn right at the Balingasag junction.',
      'Follow the road to Balingasag town proper.',
      'Total drive time: approximately 1 hour in light traffic.',
      'Google Maps: Search "Balingasag, Misamis Oriental"'
    ]
  },
  {
    from: 'From Gingoog City',
    icon: Bus,
    steps: [
      'From Gingoog City Bus Terminal, board a bus or jeepney heading west toward CDO.',
      'Balingasag is approximately 30–40 km west of Gingoog City.',
      'The journey takes approximately 45 minutes to 1 hour.',
      'Fare: approx. ₱40–₱70 per person.',
      'Tricycles and habal-habal are available at the Balingasag stop.'
    ]
  },
  {
    from: 'From Laguindingan Airport (CGY)',
    icon: Car,
    steps: [
      'The Laguindingan Airport (CGY) serves Cagayan de Oro and nearby areas.',
      'From the airport, take a taxi or Grab to CDO Agora Bus Terminal (approx. 30 min, ₱300–₱500).',
      'Then board a bus to Balingasag from Agora Terminal (1.5 hours).',
      'Alternatively, hire a private van or multicab directly from the airport to Balingasag.',
      'Pre-arranged vehicle hire (airport to Balingasag): approx. ₱800–₱1,500.'
    ]
  }
];

export function MapPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-sky-800 py-20 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-sky-400 to-blue-900" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-sky-300 font-semibold text-sm uppercase tracking-widest">Navigation</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">Map & How to Get There</h1>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto">
            Find Balingasag on the map and follow our step-by-step directions from major nearby cities and transit points.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">

        {/* Interactive Map */}
        <section>
          <div className="mb-5">
            <span className="text-sky-600 text-sm font-semibold uppercase tracking-widest">Location</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Balingasag on the Map</h2>
            <p className="text-gray-500 mt-1 text-sm">Balingasag, Misamis Oriental — Northern Mindanao, Philippines</p>
          </div>

          {/* Google Maps Embed */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-96 md:h-[480px]">
            <iframe
              title="Balingasag, Misamis Oriental Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63397.4623786174!2d124.71888435820312!3d8.686480999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff7f72a600001%3A0x5a1b7c89e7b7e7b7!2sBalingasag%2C%20Misamis%20Oriental!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-4 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
            <Info className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
            <p>
              Balingasag is located along the northern coast of Mindanao, approximately <strong>60 km east of Cagayan de Oro City</strong>, fronting Macajalar Bay. Coordinates: approximately <strong>8.69°N, 124.79°E</strong>.
            </p>
          </div>
        </section>

        {/* Key Landmarks */}
        <section>
          <div className="mb-5">
            <span className="text-emerald-600 text-sm font-semibold uppercase tracking-widest">Orientation</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Key Landmarks in Balingasag</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landmarks.map((lm) => (
              <div key={lm.name} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${lm.type === 'Tourism' ? 'bg-emerald-100' : 'bg-sky-100'}`}>
                  <MapPin className={`w-4 h-4 ${lm.type === 'Tourism' ? 'text-emerald-700' : 'text-sky-700'}`} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{lm.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{lm.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Directions */}
        <section>
          <div className="mb-7">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Directions</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Step-by-Step Directions</h2>
            <p className="text-gray-500 mt-1">How to reach Balingasag from major nearby cities and transit hubs.</p>
          </div>

          <div className="space-y-6">
            {directions.map((dir) => {
              const Icon = dir.icon;
              return (
                <div key={dir.from} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-sky-50 border-b border-sky-100 px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-sky-200 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-sky-800" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{dir.from}</div>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <ol className="space-y-3">
                      {dir.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="w-5 h-5 bg-sky-100 text-sky-700 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Local Transport Note */}
        <section>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-7">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-200 rounded-xl flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Getting Around Balingasag</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  Once in Balingasag, the most common modes of local transportation are <strong>tricycles</strong> (for short distances within the poblacion) and <strong>habal-habal</strong> (single-motorcycle taxis) for reaching more distant barangays, waterfalls, and highland areas. Rates are typically negotiable and affordable.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Tricycle: ₱15–₱40 per trip within town
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Habal-habal: ₱50–₱150 to upland barangays
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
