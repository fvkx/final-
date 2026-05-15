import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { contentApi } from '../lib/adminApi';
import { SectionRenderer } from './SectionRenderer';

interface DynamicModalProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DynamicModal({ slug, isOpen, onClose }: DynamicModalProps) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && slug) {
      fetchPage();
    }
  }, [isOpen, slug]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const response = await contentApi.getBySlug(slug);
      if (response.success) {
        setPage(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch modal content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium text-lg">Loading content...</p>
            </div>
          ) : page ? (
            <div className="pb-12">
              {page.sections && page.sections.length > 0 ? (
                page.sections.map((section: any) => (
                  <SectionRenderer key={section.id} section={section} />
                ))
              ) : (
                <div className="py-20 text-center text-gray-400">
                  No content sections defined for this page.
                </div>
              )}
            </div>
          ) : (
            <div className="py-40 text-center text-gray-500">
              <p className="text-xl font-bold">Content not found</p>
              <p>The requested page could not be loaded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
