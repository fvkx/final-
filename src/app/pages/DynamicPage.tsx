import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug } from '../lib/cms';
import { SectionRenderer } from '../components/SectionRenderer';

export function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPage();
    }
  }, [slug]);

  const fetchPage = async () => {
    setLoading(true);
    const data = await getPageBySlug(slug as string);
    setPage(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6">The content you're looking for doesn't exist or hasn't been published yet.</p>
        <a href="/" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold">Back to Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {page.sections?.map((section: any, idx: number) => (
        <SectionRenderer key={idx} section={section} />
      ))}
    </div>
  );
}
