import { useEffect } from "react";
import { MapPin, Navigation, Clock, Info } from "lucide-react";
import { Link } from "react-router-dom";

const landmarks = [
  {
    name: "Sta. Rita de Cascia Parish Church",
    desc: "As a designated Jubilee Church for the 500 Years of Christianity in the Philippines, it serves as a major spiritual and cultural anchor for the region",
    type: "Heritage",
  },
  {
    name: "Vega Ancestral House",
    desc: "Estimated to be around 200 years old, this is Balingasag's most famous heritage structure.",
    type: "Heritage",
  },
  {
    name: "Macajalar Bay View Deck",
    desc: "Scenic coastal overlook with panoramic bay views",
    type: "Nature",
  },
  {
    name: "Balingasag Marine Sanctuary",
    desc: "Protected reef area for snorkeling and marine conservation",
    type: "Nature",
  },
  {
    name: "Balingasag Public Market",
    desc: "Vibrant market for fresh seafood, produce, and local specialties",
    type: "Culture",
  },
  {
    name: "Kibanban Landmark",
    desc: "Notable local landmark in Barangay Kibanban — a unique Balingasag point of interest",
    type: "Culture",
  },
];

export function MapPage() {
  useEffect(() => {
    document.title = "Map & Directions | Balingasag Tourism Guide";
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-sky-800 py-20 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-sky-400 to-blue-900" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-sky-300 font-semibold text-sm uppercase tracking-widest">
            Navigation
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            Map & How to Get There
          </h1>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto">
            Find Balingasag on the map and check the travel guide for the best
            routes, tips, and local advice for your visit.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
        {/* Interactive Map */}
        <section>
          <div className="mb-5">
            <span className="text-sky-600 text-sm font-semibold uppercase tracking-widest">
              Location
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              Balingasag on the Map
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Balingasag, Misamis Oriental — Northern Mindanao, Philippines
            </p>
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
              Balingasag is located along the northern coast of Mindanao,
              approximately <strong>60 km east of Cagayan de Oro City</strong>,
              fronting Macajalar Bay. Coordinates: approximately{" "}
              <strong>8.69°N, 124.79°E</strong>.
            </p>
          </div>
        </section>

        {/* Key Landmarks */}
        <section>
          <div className="mb-5">
            <span className="text-sky-600 text-sm font-semibold uppercase tracking-widest">
              Orientation
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              Key Landmarks in Balingasag
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landmarks.map((lm) => (
              <div
                key={lm.name}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-sky-100">
                  <MapPin className="w-4 h-4 text-sky-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {lm.name}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{lm.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Guide CTA */}
        <section>
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-7 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
                Want a full travel guide for Balingasag?
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                Skip the step-by-step directions here and open the travel guide for complete routes, local tips, and visitor information.
              </p>
              <Link
                to="/travel-guide"
                className="inline-flex items-center justify-center rounded-xl bg-white text-sky-900 px-8 py-3 font-bold shadow-sm hover:bg-slate-100 transition-all"
              >
                View Travel Guide
              </Link>
            </div>
          </div>
        </section>

        {/* Local Transport Note */}
        <section>
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-7">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-sky-200 rounded-xl flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-sky-800" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Getting Around Balingasag
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  Once in Balingasag, the most common modes of local
                  transportation are <strong>tricycles</strong> (for short
                  distances within the poblacion) and{" "}
                  <strong>habal-habal</strong> (single-motorcycle taxis) for
                  reaching more distant barangays, waterfalls, and highland
                  areas. Rates are typically negotiable and affordable.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4 text-sky-600" />
                    Tricycle: ₱15–₱40 per trip within town
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4 text-sky-600" />
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
