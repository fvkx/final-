import type { ElementType } from 'react';
import { Bus, Car, Plane, Leaf, Shield, CloudSun, DollarSign, Heart, Shirt, Home, UtensilsCrossed, Info, CheckCircle2 } from 'lucide-react';
import { travelTips, transportOptions, accommodations, restaurants } from '../data/travelTips';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const iconMap: Record<string, ElementType> = {
  cloudSun: CloudSun,
  shirt: Shirt,
  dollarSign: DollarSign,
  heart: Heart,
  leaf: Leaf,
  shield: Shield,
  bus: Bus,
  car: Car,
  plane: Plane,
  info: Info,
};

const packingList = [
  'Lightweight, breathable clothing (cotton or moisture-wicking)',
  'Swimwear and beach towel',
  'Sturdy sandals or water shoes',
  'Hiking shoes or trail shoes for upland visits',
  'Sunscreen (SPF 50+ recommended)',
  'Wide-brim hat or cap',
  'Insect repellent (DEET or natural)',
  'Reusable water bottle',
  'Waterproof bag or dry sack',
  'Basic first aid kit and personal medications',
  'Camera or phone with extra storage',
  'Cash (Philippine Pesos — local stalls prefer cash)',
  'Modest clothing for church visits',
  'Snacks for mountain/waterfall treks'
];

export function TravelGuidePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-emerald-900 py-20 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1739769234606-6ca9c9ecc925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMG1vdW50YWluJTIwaGlraW5nJTIwbmF0dXJlJTIwdHJhaWx8ZW58MXx8fHwxNzc3OTY1ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Travel"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-emerald-300 font-semibold text-sm uppercase tracking-widest">Practical Information</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">Travel Guide & Tips</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Everything you need to know to plan a smooth and memorable trip to Balingasag, Misamis Oriental.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-16">

        {/* Essential Tips */}
        <section>
          <div className="mb-7">
            <span className="text-emerald-600 text-sm font-semibold uppercase tracking-widest">Tips</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Essential Travel Tips</h2>
            <p className="text-gray-500 mt-2">Key things to know before and during your visit.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {travelTips.map((tip) => {
              const Icon = iconMap[tip.icon] || Info;
              return (
                <div key={tip.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">{tip.category}</span>
                      <h3 className="font-bold text-gray-900 mt-0.5 mb-1.5">{tip.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{tip.tip}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How to Get There */}
        <section>
          <div className="mb-7">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Getting Here</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">How to Get to Balingasag</h2>
            <p className="text-gray-500 mt-2">Step-by-step directions from major nearby cities and transport hubs.</p>
          </div>
          <div className="space-y-4">
            {transportOptions.map((opt, idx) => {
              const Icon = iconMap[opt.icon] || Bus;
              return (
                <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-5 items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">From {opt.from}</h3>
                      <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">{opt.method}</span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">{opt.duration}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{opt.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map embed hint */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
            <p className="text-blue-800 text-sm">
              For interactive directions, visit our <a href="/map" className="font-semibold underline hover:text-blue-900">Map & Directions page</a> with an embedded Google Maps view of Balingasag.
            </p>
          </div>
        </section>

        {/* Where to Stay */}
        <section>
          <div className="mb-7">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">Accommodation</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Where to Stay</h2>
            <p className="text-gray-500 mt-2">Lodging options for every budget and travel style.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {accommodations.map((acc) => (
              <div key={acc.name} className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <div className="w-9 h-9 bg-amber-200 rounded-lg flex items-center justify-center mb-3">
                  <Home className="w-5 h-5 text-amber-800" />
                </div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{acc.type}</span>
                <h3 className="font-bold text-gray-900 mt-1 mb-2">{acc.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{acc.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Where to Eat */}
        <section>
          <div className="mb-7">
            <span className="text-rose-600 text-sm font-semibold uppercase tracking-widest">Dining</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Where to Eat</h2>
            <p className="text-gray-500 mt-2">Authentic local flavors and dining experiences in Balingasag.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {restaurants.map((res) => (
              <div key={res.name} className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
                <div className="w-9 h-9 bg-rose-200 rounded-lg flex items-center justify-center mb-3">
                  <UtensilsCrossed className="w-5 h-5 text-rose-800" />
                </div>
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">{res.specialty}</span>
                <h3 className="font-bold text-gray-900 mt-1 mb-2">{res.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{res.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to Bring */}
        <section>
          <div className="mb-7">
            <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest">Packing List</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">What to Bring</h2>
            <p className="text-gray-500 mt-2">A comprehensive packing checklist for your Balingasag visit.</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {packingList.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}