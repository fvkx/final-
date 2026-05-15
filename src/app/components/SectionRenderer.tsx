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
