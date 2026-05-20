import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SectionProps {
  section: {
    type: string;
    data: any;
  };
}

export function SectionRenderer({ section }: SectionProps) {
  const { type, data } = section;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const images = data.images || [];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  let content;
  switch (type) {
    case 'banner':
      content = (
        <div className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src={data.imageUrl}
              alt={data.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 text-center max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">{data.title}</h1>
            {data.subtitle && (
              <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">{data.subtitle}</p>
            )}
          </div>
        </div>
      );
      break;

    case 'text':
    case 'rich_text':
      content = (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.body}
          </div>
        </div>
      );
      break;

    case 'gallery':
      const currentImages = data.images || [];
      if (data.layout === 'bento') {
        content = (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
              {currentImages.slice(0, 4).map((img: string, i: number) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                    i === 0 ? 'md:col-span-2 md:row-span-2' : 
                    i === 1 ? 'md:col-span-2 md:row-span-1' : 
                    'md:col-span-1 md:row-span-1'
                  }`}
                >
                  <ImageWithFallback src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg">
                      <ChevronRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        content = (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentImages.map((img: string, i: number) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImageIndex(i)}
                  className="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative"
                >
                  <ImageWithFallback src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full shadow-lg">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      break;

    case 'facts':
      content = (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
            <h3 className="text-2xl font-bold text-emerald-900 mb-6">{data.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data.items || []).map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      break;

    case 'travel_hero':
      content = (
        <div className="relative min-h-[50vh] flex items-center justify-center text-white overflow-hidden bg-emerald-950">
          <div className="absolute inset-0 z-0">
            {data.imageUrl && (
              <ImageWithFallback
                src={data.imageUrl}
                alt={data.title}
                className="w-full h-full object-cover opacity-45 scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-emerald-950/70 to-emerald-950" />
          </div>
          <div className="relative z-10 text-center max-w-4xl px-6 py-16 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-emerald-800/40 backdrop-blur-md border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6 text-emerald-300 font-bold uppercase tracking-wider text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Official Visitor Guide
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md leading-tight">
              {data.title || 'Untitled Travel Guide'}
            </h1>
            {data.subtitle && (
              <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                {data.subtitle}
              </p>
            )}
            
            {/* Author Info Card */}
            {(data.authorName || data.readTime) && (
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mt-2">
                {data.authorAvatar ? (
                  <img src={data.authorAvatar} alt={data.authorName} className="w-12 h-12 rounded-full border border-emerald-500/30 object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center font-bold text-emerald-200">
                    {(data.authorName || 'TG')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Written by</p>
                  <h4 className="text-base font-bold text-white leading-tight">{data.authorName || 'Balingasag Tourism Office'}</h4>
                  <p className="text-xs text-emerald-300/80 mt-0.5">
                    {data.authorRole || 'Tourism Specialist'} • {data.readTime || '5 min read'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
      break;

    case 'travel_planner':
      content = (
        <div className="max-w-5xl mx-auto px-6 py-4 -mt-10 relative z-20">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-3 bg-emerald-50/30 rounded-2xl border border-emerald-100/10">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Est. Budget</span>
              <span className="text-sm font-bold text-emerald-950 mt-0.5">{data.budget || 'Affordable'}</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-emerald-50/30 rounded-2xl border border-emerald-100/10">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m12.02 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Best Season</span>
              <span className="text-sm font-bold text-emerald-950 mt-0.5">{data.season || 'Nov to May'}</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-emerald-50/30 rounded-2xl border border-emerald-100/10">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
              <span className="text-sm font-bold text-emerald-950 mt-0.5">{data.duration || '2 Days, 1 Night'}</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-emerald-50/30 rounded-2xl border border-emerald-100/10">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ideal For</span>
              <span className="text-sm font-bold text-emerald-950 mt-0.5">{data.idealFor || 'Families & Friends'}</span>
            </div>
          </div>
        </div>
      );
      break;

    case 'travel_transport':
      content = (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Transportation Details</span>
            <h3 className="text-3xl font-extrabold text-emerald-950 mt-3">How to Get to Balingasag</h3>
            <p className="text-gray-500 text-sm mt-1">Reliable transit routes and travel times</p>
          </div>
          <div className="space-y-6">
            {(data.options || []).map((opt: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-700">
                  {opt.icon === 'bus' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7a3 3 0 100-6 3 3 0 000 6zM8 11a5 5 0 00-5 5v2a1 1 0 001 1h8a1 1 0 001-1v-2a5 5 0 00-5-5zM17 11a3 3 0 100-6 3 3 0 000 6zM17 14a4 4 0 00-4 4v2a1 1 0 001 1h6a1 1 0 001-1v-2a4 4 0 00-4-4z" />
                    </svg>
                  )}
                  {opt.icon === 'car' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16v-4a2 2 0 00-2-2h-3l-2.5-3.5A1 1 0 0012.7 6H11v10h10z" />
                    </svg>
                  )}
                  {opt.icon === 'plane' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                  {!['bus', 'car', 'plane'].includes(opt.icon) && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 w-full">
                    <h4 className="text-lg font-bold text-gray-900">From {opt.from || 'Origin'}</h4>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-100">
                      <span>{opt.method || 'Transit'}</span>
                      <span className="text-emerald-300">•</span>
                      <span>{opt.duration || 'Duration'}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{opt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      break;

    case 'travel_directory':
      content = (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Accommodations */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-3 border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-950">Recommended Lodging</h3>
              </div>
              <div className="space-y-4">
                {(data.accommodations || []).map((place: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <span className="text-[9px] font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100/50">{place.type || 'Hotel'}</span>
                    <h4 className="text-base font-bold text-gray-900 mt-1.5 mb-1">{place.name}</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">{place.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dining */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-3 border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-950">Where to Eat</h3>
              </div>
              <div className="space-y-4">
                {(data.restaurants || []).map((place: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <span className="text-[9px] font-bold text-orange-700 uppercase tracking-widest bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100/50">{place.specialty || 'Specialty'}</span>
                    <h4 className="text-base font-bold text-gray-900 mt-1.5 mb-1">{place.name}</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">{place.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
      break;

    case 'travel_tips':
      content = (
        <div className="max-w-5xl mx-auto px-6 py-12 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-3xl border border-emerald-100/50">
          <div className="text-center mb-10">
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Local Secrets</span>
            <h3 className="text-3xl font-extrabold text-emerald-950 mt-3">Essential Travel Tips</h3>
            <p className="text-gray-500 text-sm mt-1">Make your journey seamless and respectful</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data.tips || []).map((tip: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 shrink-0">
                  {tip.icon === 'cloudSun' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m12.02 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                    </svg>
                  )}
                  {tip.icon === 'shirt' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                  {tip.icon === 'dollarSign' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {tip.icon === 'heart' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                  {tip.icon === 'leaf' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                  {tip.icon === 'shield' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  {!['cloudSun', 'shirt', 'dollarSign', 'heart', 'leaf', 'shield'].includes(tip.icon) && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">{tip.category || 'General'}</span>
                  <h4 className="text-base font-bold text-gray-900 mt-2 mb-1">{tip.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      break;

    default:
      content = null;
  }

  return (
    <>
      {content}

      {/* Fullscreen Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 z-[210] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-xl"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-6 z-[210] p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hidden md:block shadow-xl"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                className="absolute right-6 z-[210] p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hidden md:block shadow-xl"
                onClick={handleNext}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20">
            <img 
              src={images[selectedImageIndex]} 
              alt="Fullscreen Preview" 
              className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in duration-300 select-none"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Counter */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
