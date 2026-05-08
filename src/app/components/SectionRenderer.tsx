import { ImageWithFallback } from './figma/ImageWithFallback';
import { CheckCircle2 } from 'lucide-react';

interface SectionProps {
  section: {
    type: string;
    data: any;
  };
}

export function SectionRenderer({ section }: SectionProps) {
  const { type, data } = section;

  switch (type) {
    case 'banner':
      return (
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

    case 'rich_text':
      return (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.body}
          </div>
        </div>
      );

    case 'gallery':
      const images = data.images || [];
      if (data.layout === 'bento') {
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
              {images.slice(0, 4).map((img: string, i: number) => (
                <div 
                  key={i} 
                  className={`relative overflow-hidden rounded-2xl ${
                    i === 0 ? 'md:col-span-2 md:row-span-2' : 
                    i === 1 ? 'md:col-span-2 md:row-span-1' : 
                    'md:col-span-1 md:row-span-1'
                  }`}
                >
                  <ImageWithFallback src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img: string, i: number) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                <ImageWithFallback src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'facts':
      return (
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

    default:
      return null;
  }
}
