import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, 
  Image as ImageIcon, Type, LayoutGrid, ListChecks, 
  Settings, Eye, Upload, X
} from 'lucide-react';
import { contentApi, mediaApi } from '../../lib/adminApi';
import { SectionRenderer } from '../../components/SectionRenderer';

const SECTION_TYPES = [
  { id: 'banner', name: 'Banner', icon: ImageIcon, description: 'Hero section with background image' },
  { id: 'text', name: 'Rich Text', icon: Type, description: 'Standard content block' },
  { id: 'gallery', name: 'Gallery', icon: LayoutGrid, description: 'Images in Grid or Bento layout' },
  { id: 'facts', name: 'Facts/List', icon: ListChecks, description: 'Highlights or key information' },
];

export function PageEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState<any>({
    title: '',
    slug: '',
    category: 'tourist-spot',
    status: 'draft',
    featured: false
  });
  const [sections, setSections] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    const pageId = Number(id);
    if (isNaN(pageId)) {
      setLoading(false);
      return;
    }

    try {
      const response = await contentApi.getById(pageId);
      if (response.success) {
        setPage(response.data);
        setSections(response.data.sections || []);
      }
    } catch (error) {
      console.error('Failed to fetch page:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSection = (type: string) => {
    const newData: any = { type, data: {} };
    if (type === 'banner') newData.data = { title: '', subtitle: '', imageUrl: '' };
    if (type === 'text') newData.data = { body: '' };
    if (type === 'gallery') newData.data = { layout: 'grid', images: [] };
    if (type === 'facts') newData.data = { title: 'Highlights', items: [] };
    
    setSections([...sections, newData]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
  };

  const updateSectionData = (index: number, newData: any) => {
    const newSections = [...sections];
    newSections[index].data = { ...newSections[index].data, ...newData };
    setSections(newSections);
  };

  const handleFileUpload = async (index: number, file: File, field: string = 'imageUrl') => {
    try {
      const response = await mediaApi.upload(file);
      if (response.success) {
        if (field === 'images') {
          const currentImages = sections[index].data.images || [];
          updateSectionData(index, { images: [...currentImages, response.url] });
        } else {
          updateSectionData(index, { [field]: response.url });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleSave = async () => {
    if (!page.title.trim() || !page.slug.trim()) {
      alert('Please provide both a title and a unique slug for the page.');
      return;
    }

    setSaving(true);
    try {
      // 1. Save Page Meta
      const pageRes = await contentApi.savePage(page);
      if (pageRes.success) {
        const newId = pageRes.id;
        // 2. Save Sections
        await contentApi.saveSections(newId, sections);
        if (isNew) navigate(`/admin/content/edit/${newId}`);
        else alert('Page saved successfully!');
      } else {
        alert('Error saving page: ' + (pageRes.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Failed to save:', error);
      alert('Failed to save page: ' + (error.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading editor...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50 py-4 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/content')} className="p-2 hover:bg-white rounded-lg transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isNew ? 'New Page' : 'Edit Page'}</h1>
            <p className="text-sm text-gray-500">Design your modular tourism content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-all"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Editor */}
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              {/* Section Header */}
              <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded shadow-sm">
                    {(() => {
                      const Icon = SECTION_TYPES.find(t => t.id === section.type)?.icon || Type;
                      return <Icon className="w-4 h-4 text-emerald-600" />;
                    })()}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{section.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1} className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeSection(idx)} className="p-1 text-gray-400 hover:text-red-600 ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section Content */}
              <div className="p-5">
                {section.type === 'banner' && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-4">
                        <input
                          type="text"
                          placeholder="Headline (Title)"
                          className="w-full text-lg font-bold border-b focus:border-teal-500 outline-none pb-1"
                          value={section.data.title || ''}
                          onChange={(e) => updateSectionData(idx, { title: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Subheadline"
                          className="w-full text-gray-500 border-b focus:border-teal-500 outline-none pb-1"
                          value={section.data.subtitle || ''}
                          onChange={(e) => updateSectionData(idx, { subtitle: e.target.value })}
                        />
                      </div>
                      <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden relative group">
                        {section.data.imageUrl ? (
                          <img src={section.data.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon className="w-6 h-6" /></div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                          <Upload className="w-5 h-5 text-white" />
                          <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(idx, e.target.files[0])} />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {(section.type === 'text' || section.type === 'rich_text') && (
                  <textarea
                    rows={6}
                    placeholder="Write your content here..."
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-teal-100 border border-transparent focus:border-teal-100 transition-all resize-none"
                    value={section.data.body || ''}
                    onChange={(e) => updateSectionData(idx, { body: e.target.value })}
                  />
                )}

                {section.type === 'gallery' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <span className="font-semibold">Layout:</span>
                      <button 
                        onClick={() => updateSectionData(idx, { layout: 'grid' })}
                        className={`px-3 py-1 rounded-full border ${section.data.layout === 'grid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-gray-200 text-gray-500'}`}
                      >Standard Grid</button>
                      <button 
                        onClick={() => updateSectionData(idx, { layout: 'bento' })}
                        className={`px-3 py-1 rounded-full border ${section.data.layout === 'bento' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-gray-200 text-gray-500'}`}
                      >Bento Layout</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(section.data.images || []).map((img: string, imgIdx: number) => (
                        <div key={imgIdx} className="w-20 h-20 rounded-lg overflow-hidden relative group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => {
                              const imgs = [...section.data.images];
                              imgs.splice(imgIdx, 1);
                              updateSectionData(idx, { images: imgs });
                            }}
                            className="absolute inset-0 bg-red-600/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          ><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all">
                        <Plus className="w-5 h-5 text-gray-400" />
                        <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(idx, e.target.files[0], 'images')} />
                      </label>
                    </div>
                  </div>
                )}

                {section.type === 'facts' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Title (e.g. Highlights)"
                      className="w-full font-bold border-b outline-none pb-1"
                      value={section.data.title || ''}
                      onChange={(e) => updateSectionData(idx, { title: e.target.value })}
                    />
                    <div className="space-y-2">
                      {(section.data.items || []).map((item: string, itemIdx: number) => (
                        <div key={itemIdx} className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 p-2 bg-gray-50 rounded-lg text-sm"
                            value={item}
                            onChange={(e) => {
                              const items = [...section.data.items];
                              items[itemIdx] = e.target.value;
                              updateSectionData(idx, { items });
                            }}
                          />
                          <button onClick={() => {
                            const items = [...section.data.items];
                            items.splice(itemIdx, 1);
                            updateSectionData(idx, { items });
                          }} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button 
                        onClick={() => updateSectionData(idx, { items: [...(section.data.items || []), ''] })}
                        className="text-xs font-semibold text-teal-600 flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add Highlight
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Section Buttons */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50">
            <h3 className="font-bold text-gray-500 mb-4">Add a New Section</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SECTION_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => addSection(type.id)}
                    className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-teal-500 hover:shadow-md transition-all group"
                  >
                    <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                      <Icon className="w-6 h-6 text-gray-400 group-hover:text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-900">
              <Settings className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold">Page Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
                  value={page.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const newSlug = newTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    setPage({ 
                      ...page, 
                      title: newTitle, 
                      slug: page.slug === '' || page.slug === page.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') ? newSlug : page.slug 
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Slug (URL)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 font-mono text-sm"
                  value={page.slug}
                  onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Short Description</label>
                <textarea
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-sm resize-none"
                  rows={3}
                  placeholder="A brief summary for cards and search results..."
                  value={page.description || ''}
                  onChange={(e) => setPage({ ...page, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-100"
                  value={page.category}
                  onChange={(e) => setPage({ ...page, category: e.target.value })}
                >
                  <option value="tourist-spot">Tourist Spot</option>
                  <option value="culture">Culture & Heritage</option>
                  <option value="event">Event</option>
                  <option value="travel-guide">Travel Guide</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-100"
                  value={page.status}
                  onChange={(e) => setPage({ ...page, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main Thumbnail Image</label>
                <div className="relative group aspect-video bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  {page.image_url ? (
                    <img src={page.image_url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-[10px] font-bold uppercase">No Image Set</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white gap-2">
                    <Upload className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase">Change Image</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          try {
                            const res = await mediaApi.upload(e.target.files[0]);
                            if (res.success) setPage({ ...page, image_url: res.url });
                          } catch (err) {
                            console.error('Main image upload failed:', err);
                          }
                        }
                      }} 
                    />
                  </label>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 leading-tight">
                  This image appears as the thumbnail on the landing pages and category grids.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={page.featured}
                  onChange={(e) => setPage({ ...page, featured: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-gray-700">Feature this page</label>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-lg shadow-emerald-900/20">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-emerald-300" />
              <h3 className="font-bold">Live Preview</h3>
            </div>
            <p className="text-emerald-100 text-xs leading-relaxed mb-4">
              Preview how your page will look to visitors once published. Ensure all images and text flows correctly.
            </p>
            <button 
              onClick={() => setShowPreview(true)}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 rounded-xl text-sm font-bold transition-all border border-emerald-700 shadow-sm flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Live Modal Preview
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowPreview(false)} 
          />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-6 right-6 z-50 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="overflow-y-auto flex-1">
              <div className="pb-12">
                {sections && sections.length > 0 ? (
                  sections.map((section: any, i: number) => (
                    <SectionRenderer key={i} section={section} />
                  ))
                ) : (
                  <div className="py-20 text-center text-gray-400">
                    No content sections defined for this page yet. Add some sections to preview!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
