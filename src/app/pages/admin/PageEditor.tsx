import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, 
  Image as ImageIcon, Type, LayoutGrid, ListChecks, 
  Settings, Eye, Upload, X, Loader2
} from 'lucide-react';
import { contentApi, mediaApi } from '../../lib/adminApi';
import { SectionRenderer } from '../../components/SectionRenderer';

const SECTION_TYPES = [
  { id: 'banner', name: 'Banner', icon: ImageIcon, description: 'Hero section with background image' },
  { id: 'text', name: 'Rich Text', icon: Type, description: 'Standard content block' },
  { id: 'gallery', name: 'Gallery', icon: LayoutGrid, description: 'Images in Grid or Bento layout' },
  { id: 'facts', name: 'Facts/List', icon: ListChecks, description: 'Highlights or key information' },
];

import { useNotifications } from '../../context/NotificationContext';

export function PageEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { toast, confirm } = useNotifications();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [uploadingSectionIdx, setUploadingSectionIdx] = useState<number | null>(null);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
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
    document.title = isNew ? 'Create New Page | Balingasag CMS' : 'Edit Page | Balingasag CMS';
    if (!isNew) {
      fetchPage();
    }
  }, [id, isNew]);

  const ensureTravelGuideSections = (currentSections: any[], pageTitle: string = '') => {
    const finalSections = [...currentSections];
    const requiredTypes = ['travel_hero', 'travel_planner', 'travel_transport', 'travel_directory', 'travel_tips', 'rich_text'];
    
    let changed = false;
    requiredTypes.forEach(type => {
      if (!finalSections.some(s => s.type === type)) {
        changed = true;
        const newSec: any = { type, data: {} };
        if (type === 'travel_hero') {
          newSec.data = { 
            title: pageTitle || page.title || '', 
            subtitle: page.description || '', 
            imageUrl: page.image_url || '', 
            authorName: 'Balingasag Tourism Office', 
            authorRole: 'Tourism Specialist', 
            authorAvatar: '', 
            readTime: '5 min read' 
          };
        } else if (type === 'travel_planner') {
          newSec.data = { 
            budget: '₱500 - ₱1,500 / day', 
            season: 'November to May', 
            duration: '2 Days, 1 Night', 
            idealFor: 'Families & Friends' 
          };
        } else if (type === 'travel_transport') {
          newSec.data = { 
            options: [
              { method: 'Bus', from: 'Cagayan de Oro (Agora)', duration: '1.5 - 2 hours', description: 'Take a CDO-Gingoog bus at Agora terminal. Alight at Balingasag town center.', icon: 'bus' }
            ] 
          };
        } else if (type === 'travel_directory') {
          newSec.data = {
            accommodations: [
              { name: 'Balingasag Guesthouse', type: 'Guesthouse', description: 'Affordable, clean rooms near the municipal plaza.' }
            ],
            restaurants: [
              { name: 'Macajalar Seafoods', specialty: 'Sutukil (Sugba, Tuwa, Kilaw)', description: 'Fresh open-air dining along the bay.' }
            ]
          };
        } else if (type === 'travel_tips') {
          newSec.data = {
            tips: [
              { category: 'Best Season', title: 'Plan for Sunny Weather', tip: 'November to May is the dry season, perfect for beaching and mountain trekking.', icon: 'cloudSun' },
              { category: 'Budget', title: 'Bring Philippine Cash (PHP)', tip: 'Local markets and jeepney drivers only accept cash. ATMs are available in town.', icon: 'dollarSign' }
            ]
          };
        } else if (type === 'rich_text') {
          newSec.data = { 
            body: 'Welcome to Balingasag! This is where you can write custom detailed information, local history, or specific guidelines for visitors.' 
          };
        }
        finalSections.push(newSec);
      }
    });

    if (changed) {
      // Sort them in the standard reading sequence for travel guides
      const sorted = finalSections.sort((a, b) => {
        const orderA = requiredTypes.indexOf(a.type);
        const orderB = requiredTypes.indexOf(b.type);
        return (orderA !== -1 ? orderA : 99) - (orderB !== -1 ? orderB : 99);
      });
      return { sections: sorted, changed: true };
    }
    return { sections: finalSections, changed: false };
  };

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
        let loadedSections = response.data.sections || [];
        if (response.data.category === 'travel-guide') {
          const res = ensureTravelGuideSections(loadedSections, response.data.title);
          loadedSections = res.sections;
        }
        setSections(loadedSections);
        document.title = `Edit Page: ${response.data.title} | Balingasag CMS`;
      }
    } catch (error) {
      console.error('Failed to fetch page:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionIndex = (type: string) => sections.findIndex(s => s.type === type);

  const updateTravelHero = (newData: any) => {
    const idx = getSectionIndex('travel_hero');
    if (idx !== -1) {
      updateSectionData(idx, newData);
    }
  };

  const updateTravelPlanner = (newData: any) => {
    const idx = getSectionIndex('travel_planner');
    if (idx !== -1) {
      updateSectionData(idx, newData);
    }
  };

  const updateTravelTransport = (newData: any) => {
    const idx = getSectionIndex('travel_transport');
    if (idx !== -1) {
      updateSectionData(idx, newData);
    }
  };

  const updateTravelDirectory = (newData: any) => {
    const idx = getSectionIndex('travel_directory');
    if (idx !== -1) {
      updateSectionData(idx, newData);
    }
  };

  const updateTravelTips = (newData: any) => {
    const idx = getSectionIndex('travel_tips');
    if (idx !== -1) {
      updateSectionData(idx, newData);
    }
  };

  const updateTravelRichText = (newData: any) => {
    const idx = getSectionIndex('rich_text');
    if (idx !== -1) {
      updateSectionData(idx, newData);
    }
  };

  const addSection = (type: string) => {
    const newData: any = { type, data: {} };
    if (type === 'banner') newData.data = { title: '', subtitle: '', imageUrl: '' };
    if (type === 'text') newData.data = { body: '' };
    if (type === 'gallery') newData.data = { layout: 'grid', images: [] };
    if (type === 'facts') newData.data = { title: 'Highlights', items: [] };
    
    setSections([...sections, newData]);
    setIsDirty(true);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
    setIsDirty(true);
  };

  const updateSectionData = (index: number, newData: any) => {
    const newSections = [...sections];
    newSections[index].data = { ...newSections[index].data, ...newData };
    setSections(newSections);
    setIsDirty(true);
  };

  const handleFileUpload = async (index: number, file: File, field: string = 'imageUrl') => {
    setUploadingSectionIdx(index);
    setIsDirty(true);
    try {
      const response = await mediaApi.upload(file);
      if (response.success) {
        if (field === 'images') {
          const currentImages = sections[index].data.images || [];
          updateSectionData(index, { images: [...currentImages, response.url] });
        } else {
          updateSectionData(index, { [field]: response.url });
        }
      } else {
        toast('Failed to upload image: ' + (response.message || 'Server error'), 'error');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast('Failed to upload image: ' + (error.message || 'Network error'), 'error');
    } finally {
      setUploadingSectionIdx(null);
    }
  };

  const handleSave = async () => {
    if (!page.title.trim() || !page.slug.trim()) {
      toast('Please provide both a title and a unique slug for the page.', 'error');
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
        toast(isNew ? 'Page created successfully!' : 'Page saved successfully!', 'success');
        setIsDirty(false);
        navigate('/admin/content');
      } else {
        toast('Error saving page: ' + (pageRes.message || 'Unknown error'), 'error');
      }
    } catch (error: any) {
      console.error('Failed to save:', error);
      toast('Failed to save page: ' + (error.message || 'Server error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = async () => {
    if (isDirty) {
      const confirmed = await confirm(
        'Discard Unsaved Changes?',
        'You have unsaved changes in your editor. Are you sure you want to go back and discard them?'
      );
      if (!confirmed) return;
    }
    navigate('/admin/content');
  };

  // Keyboard shortcut Ctrl + S to save page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, sections, isNew]);

  if (loading) return <div className="p-12 text-center text-gray-400">Loading editor...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50 py-4 z-10">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-white rounded-lg transition-all" title="Go back to list">
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
          {page.category === 'travel-guide' ? (
            <div className="space-y-6">
              {/* Premium Mode Notification Banner */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                    <span className="text-xl">✨</span> Premium Travel Guide Builder
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Design a premium, structured travel guide. Fill in the custom details below.
                  </p>
                </div>
                <div className="hidden md:flex px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-emerald-100/50">
                  Active
                </div>
              </div>

              {/* 1. Hero & Author Card */}
              {(() => {
                const idx = getSectionIndex('travel_hero');
                if (idx === -1) return null;
                const section = sections[idx];
                const data = section.data || {};
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-gray-800">1. Guide Cover & Author Info</h3>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Headline / Banner Title</label>
                          <input 
                            type="text" 
                            className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                            placeholder="e.g. Balingasag Practical Visitor Info"
                            value={data.title || ''}
                            onChange={(e) => updateTravelHero({ title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subheadline / Intro Text</label>
                          <input 
                            type="text" 
                            className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                            placeholder="e.g. Everything you need to plan a smooth trip"
                            value={data.subtitle || ''}
                            onChange={(e) => updateTravelHero({ subtitle: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Author Name</label>
                          <input 
                            type="text" 
                            className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                            value={data.authorName || ''}
                            onChange={(e) => updateTravelHero({ authorName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Author Title / Role</label>
                          <input 
                            type="text" 
                            className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                            value={data.authorRole || ''}
                            onChange={(e) => updateTravelHero({ authorRole: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Read Time Estimate</label>
                          <input 
                            type="text" 
                            className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                            placeholder="e.g. 5 min read"
                            value={data.readTime || ''}
                            onChange={(e) => updateTravelHero({ readTime: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Image Upload for Hero Cover */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Background Image</label>
                          <div className="flex gap-4 items-center">
                            <div className="w-24 h-16 bg-gray-50 border rounded-xl overflow-hidden shrink-0 relative group">
                              {uploadingSectionIdx === idx ? (
                                <div className="absolute inset-0 bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                              ) : data.imageUrl ? (
                                <img src={data.imageUrl} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-5 h-5" /></div>
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg cursor-pointer transition-all border border-emerald-100/50">
                                <Upload className="w-3.5 h-3.5" /> Upload Cover Image
                                <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(idx, e.target.files[0])} />
                              </label>
                              <p className="text-[10px] text-gray-400 leading-none">Landscape layout recommended.</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Author Avatar (Optional)</label>
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-gray-50 border rounded-full overflow-hidden shrink-0 relative group">
                              {uploadingSectionIdx === 9999 ? (
                                <div className="absolute inset-0 bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                              ) : data.authorAvatar ? (
                                <img src={data.authorAvatar} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-lg">
                                  {(data.authorName || 'T')[0].toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg cursor-pointer transition-all border border-emerald-100/50">
                                <Upload className="w-3.5 h-3.5" /> Upload Avatar
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                      setUploadingSectionIdx(9999);
                                      setIsDirty(true);
                                      try {
                                        const res = await mediaApi.upload(e.target.files[0]);
                                        if (res.success) {
                                          updateTravelHero({ authorAvatar: res.url });
                                        } else {
                                          toast('Avatar upload failed: ' + res.message, 'error');
                                        }
                                      } catch (err: any) {
                                        toast('Avatar upload failed: ' + err.message, 'error');
                                      } finally {
                                        setUploadingSectionIdx(null);
                                      }
                                    }
                                  }} 
                                />
                              </label>
                              <p className="text-[10px] text-gray-400 leading-none">Square layout recommended.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 2. Quick Travel Planner Specs */}
              {(() => {
                const idx = getSectionIndex('travel_planner');
                if (idx === -1) return null;
                const section = sections[idx];
                const data = section.data || {};
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                        <Settings className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-gray-800">2. Quick Travel Planner Specs</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Budget</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                          placeholder="e.g. ₱500 - ₱1,500 / day"
                          value={data.budget || ''}
                          onChange={(e) => updateTravelPlanner({ budget: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Best Season / Time to Visit</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                          placeholder="e.g. November to May"
                          value={data.season || ''}
                          onChange={(e) => updateTravelPlanner({ season: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Recommended Duration</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                          placeholder="e.g. 2 Days, 1 Night"
                          value={data.duration || ''}
                          onChange={(e) => updateTravelPlanner({ duration: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ideal For</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                          placeholder="e.g. Families, Friends, Couples"
                          value={data.idealFor || ''}
                          onChange={(e) => updateTravelPlanner({ idealFor: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 3. Transportation Guide */}
              {(() => {
                const idx = getSectionIndex('travel_transport');
                if (idx === -1) return null;
                const section = sections[idx];
                const data = section.data || {};
                const options = data.options || [];
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h.01M17 16h.01" /></svg>
                        </div>
                        <h3 className="font-bold text-gray-800">3. Transportation & Routes</h3>
                      </div>
                      <button 
                        onClick={() => {
                          const newOpts = [...options, { method: 'Bus', from: '', duration: '', description: '', icon: 'bus' }];
                          updateTravelTransport({ options: newOpts });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Route
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      {options.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No transportation routes added. Click "Add Route" to begin.</p>
                      ) : (
                        options.map((opt: any, optIdx: number) => (
                          <div key={optIdx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group space-y-3">
                            <button 
                              onClick={() => {
                                const newOpts = [...options];
                                newOpts.splice(optIdx, 1);
                                updateTravelTransport({ options: newOpts });
                              }}
                              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete route"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">From / Starting Location</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white" 
                                  placeholder="e.g. Cagayan de Oro City"
                                  value={opt.from || ''}
                                  onChange={(e) => {
                                    const newOpts = [...options];
                                    newOpts[optIdx] = { ...newOpts[optIdx], from: e.target.value };
                                    updateTravelTransport({ options: newOpts });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Transit Method & Icon</label>
                                <select 
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white"
                                  value={`${opt.method || 'Bus / Minibus'}|${opt.icon || 'bus'}`}
                                  onChange={(e) => {
                                    const [method, icon] = e.target.value.split('|');
                                    const newOpts = [...options];
                                    newOpts[optIdx] = { ...newOpts[optIdx], method, icon };
                                    updateTravelTransport({ options: newOpts });
                                  }}
                                >
                                  <option value="Bus / Minibus|bus">🚌 Bus / Minibus</option>
                                  <option value="Private Vehicle / Car|car">🚗 Private Vehicle / Car</option>
                                  <option value="Taxi / Grab|car">🚕 Taxi / Grab</option>
                                  <option value="Airplane / Flight|plane">✈️ Airplane / Flight</option>
                                  <option value="Ferry / Boat|other">⛴️ Ferry / Boat</option>
                                  <option value="Jeepney / Tricycle|other">🛺 Jeepney / Tricycle</option>
                                  <option value="Other Transit|other">ℹ️ Other Transit</option>
                                </select>
                              </div>
                              <div className="w-full">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Trip Duration</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white" 
                                  placeholder="e.g. 1.5 – 2 hours"
                                  value={opt.duration || ''}
                                  onChange={(e) => {
                                    const newOpts = [...options];
                                    newOpts[optIdx] = { ...newOpts[optIdx], duration: e.target.value };
                                    updateTravelTransport({ options: newOpts });
                                  }}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Detailed Description & Cost Details</label>
                              <textarea 
                                rows={2}
                                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-gray-50 focus:bg-white resize-none" 
                                placeholder="Describe transit steps, fare costs, departure frequencies, and drop-off points..."
                                value={opt.description || ''}
                                onChange={(e) => {
                                  const newOpts = [...options];
                                  newOpts[optIdx] = { ...newOpts[optIdx], description: e.target.value };
                                  updateTravelTransport({ options: newOpts });
                                }}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 4. Directory Lodging & Dining */}
              {(() => {
                const idx = getSectionIndex('travel_directory');
                if (idx === -1) return null;
                const section = sections[idx];
                const data = section.data || {};
                const accommodations = data.accommodations || [];
                const restaurants = data.restaurants || [];
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-gray-800">4. Lodging & Dining Directory</h3>
                    </div>
                    <div className="p-5 space-y-6">
                      
                      {/* Accommodations */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b pb-2 border-gray-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">🏢 Recommended Places to Stay</h4>
                          <button 
                            onClick={() => {
                              const newAccs = [...accommodations, { name: '', type: 'Hotel', description: '' }];
                              updateTravelDirectory({ accommodations: newAccs, restaurants });
                            }}
                            className="inline-flex items-center gap-0.5 text-[10px] font-bold text-teal-600 hover:text-teal-700 hover:underline"
                          >
                            <Plus className="w-3 h-3" /> Add Lodging
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {accommodations.map((acc: any, accIdx: number) => (
                            <div key={accIdx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl relative space-y-3 hover:border-gray-200 transition-all">
                              <button 
                                onClick={() => {
                                  const newAccs = [...accommodations];
                                  newAccs.splice(accIdx, 1);
                                  updateTravelDirectory({ accommodations: newAccs, restaurants });
                                }}
                                className="absolute top-2 right-2 text-teal-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="w-[85%] md:w-full">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Place Name</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white" 
                                  placeholder="e.g. Balingasag Beach Resort"
                                  value={acc.name || ''}
                                  onChange={(e) => {
                                    const newAccs = [...accommodations];
                                    newAccs[accIdx] = { ...newAccs[accIdx], name: e.target.value };
                                    updateTravelDirectory({ accommodations: newAccs, restaurants });
                                  }}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lodging Type</label>
                                  <input 
                                    type="text" 
                                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white" 
                                    placeholder="e.g. Resort / Guesthouse"
                                    value={acc.type || ''}
                                    onChange={(e) => {
                                      const newAccs = [...accommodations];
                                      newAccs[accIdx] = { ...newAccs[accIdx], type: e.target.value };
                                      updateTravelDirectory({ accommodations: newAccs, restaurants });
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Quick Description & Amenities</label>
                                <textarea 
                                  rows={2}
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white resize-none" 
                                  placeholder="Describe room rates, pool, beachfront access, contact info..."
                                  value={acc.description || ''}
                                  onChange={(e) => {
                                    const newAccs = [...accommodations];
                                    newAccs[accIdx] = { ...newAccs[accIdx], description: e.target.value };
                                    updateTravelDirectory({ accommodations: newAccs, restaurants });
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dining */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b pb-2 border-gray-100 pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">🍽️ Recommended Dining Options</h4>
                          <button 
                            onClick={() => {
                              const newRests = [...restaurants, { name: '', specialty: 'Local Dishes', description: '' }];
                              updateTravelDirectory({ accommodations, restaurants: newRests });
                            }}
                            className="inline-flex items-center gap-0.5 text-[10px] font-bold text-orange-600 hover:text-orange-700 hover:underline"
                          >
                            <Plus className="w-3 h-3" /> Add Dining
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {restaurants.map((rest: any, restIdx: number) => (
                            <div key={restIdx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl relative space-y-3 hover:border-gray-200 transition-all">
                              <button 
                                onClick={() => {
                                  const newRests = [...restaurants];
                                  newRests.splice(restIdx, 1);
                                  updateTravelDirectory({ accommodations, restaurants: newRests });
                                }}
                                className="absolute top-2 right-2 text-orange-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="w-[85%] md:w-full">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Diner Name</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white" 
                                  placeholder="e.g. Bayside Seafood Eateries"
                                  value={rest.name || ''}
                                  onChange={(e) => {
                                    const newRests = [...restaurants];
                                    newRests[restIdx] = { ...newRests[restIdx], name: e.target.value };
                                    updateTravelDirectory({ accommodations, restaurants: newRests });
                                  }}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Specialty Dish / Vibe</label>
                                  <input 
                                    type="text" 
                                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white" 
                                    placeholder="e.g. Fresh Grilled Seafood"
                                    value={rest.specialty || ''}
                                    onChange={(e) => {
                                      const newRests = [...restaurants];
                                      newRests[restIdx] = { ...newRests[restIdx], specialty: e.target.value };
                                      updateTravelDirectory({ accommodations, restaurants: newRests });
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Food Description & Price</label>
                                <textarea 
                                  rows={2}
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white resize-none" 
                                  placeholder="Describe native delicacies, pricing, location, opening hours..."
                                  value={rest.description || ''}
                                  onChange={(e) => {
                                    const newRests = [...restaurants];
                                    newRests[restIdx] = { ...newRests[restIdx], description: e.target.value };
                                    updateTravelDirectory({ accommodations, restaurants: newRests });
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}

              {/* 5. Essential Local Travel Tips */}
              {(() => {
                const idx = getSectionIndex('travel_tips');
                if (idx === -1) return null;
                const section = sections[idx];
                const data = section.data || {};
                const tips = data.tips || [];
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                          <ListChecks className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-gray-800">5. Essential Tips & Guidelines</h3>
                      </div>
                      <button 
                        onClick={() => {
                          const newTips = [...tips, { category: 'Safety', title: '', tip: '', icon: 'shield' }];
                          updateTravelTips({ tips: newTips });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Tip
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      {tips.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No travel tips added yet. Click "Add Tip" to create one.</p>
                      ) : (
                        tips.map((tip: any, tipIdx: number) => (
                          <div key={tipIdx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group space-y-3">
                            <button 
                              onClick={() => {
                                const newTips = [...tips];
                                newTips.splice(tipIdx, 1);
                                updateTravelTips({ tips: newTips });
                              }}
                              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tip Category / Badge</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white" 
                                  placeholder="e.g. Eco-Tourism"
                                  value={tip.category || ''}
                                  onChange={(e) => {
                                    const newTips = [...tips];
                                    newTips[tipIdx] = { ...newTips[tipIdx], category: e.target.value };
                                    updateTravelTips({ tips: newTips });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Headline Title</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white" 
                                  placeholder="e.g. Keep local areas clean"
                                  value={tip.title || ''}
                                  onChange={(e) => {
                                    const newTips = [...tips];
                                    newTips[tipIdx] = { ...newTips[tipIdx], title: e.target.value };
                                    updateTravelTips({ tips: newTips });
                                  }}
                                />
                              </div>
                              <div className="w-[85%] md:w-full">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tip Icon Theme</label>
                                <select 
                                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white"
                                  value={tip.icon || 'info'}
                                  onChange={(e) => {
                                    const newTips = [...tips];
                                    newTips[tipIdx] = { ...newTips[tipIdx], icon: e.target.value };
                                    updateTravelTips({ tips: newTips });
                                  }}
                                >
                                  <option value="cloudSun">Sun & Cloud (Season)</option>
                                  <option value="shirt">Clothes (What to bring)</option>
                                  <option value="dollarSign">Dollar/Cash (Budget)</option>
                                  <option value="heart">Heart (Respect/Culture)</option>
                                  <option value="leaf">Leaf (Eco/Nature)</option>
                                  <option value="shield">Shield (Safety)</option>
                                  <option value="info">Info Circle (General)</option>
                                </select>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tip Body Paragraph</label>
                              <textarea 
                                rows={2}
                                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm transition-all bg-white resize-none" 
                                placeholder="Explain this custom recommendation in detail..."
                                value={tip.tip || ''}
                                onChange={(e) => {
                                  const newTips = [...tips];
                                  newTips[tipIdx] = { ...newTips[tipIdx], tip: e.target.value };
                                  updateTravelTips({ tips: newTips });
                                }}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 6. Itinerary & General Content */}
              {(() => {
                const idx = getSectionIndex('rich_text');
                if (idx === -1) return null;
                const section = sections[idx];
                const data = section.data || {};
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                        <Type className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-gray-800">6. Detailed Itinerary & Notes</h3>
                    </div>
                    <div className="p-5">
                      <textarea
                        rows={10}
                        placeholder="Write your custom detailed itinerary or other paragraphs here..."
                        className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 border border-gray-200 focus:border-emerald-500 transition-all resize-y text-sm leading-relaxed focus:bg-white"
                        value={data.body || ''}
                        onChange={(e) => updateTravelRichText({ body: e.target.value })}
                      />
                      <p className="text-[10px] text-gray-400 mt-1">This uses markdown paragraphs or standard rich-text lines.</p>
                    </div>
                  </div>
                );
              })()}

            </div>
          ) : (
            <div className="space-y-6">
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
                            {uploadingSectionIdx === idx ? (
                              <div className="flex flex-col items-center justify-center h-full bg-emerald-50 text-emerald-600">
                                <Loader2 className="w-6 h-6 animate-spin mb-1" />
                                <span className="text-[9px] font-bold uppercase tracking-wider animate-pulse">Uploading</span>
                              </div>
                            ) : (
                              <>
                                {section.data.imageUrl ? (
                                  <img src={section.data.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon className="w-6 h-6" /></div>
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                  <Upload className="w-5 h-5 text-white" />
                                  <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(idx, e.target.files[0])} />
                                </label>
                              </>
                            )}
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
                          {uploadingSectionIdx === idx ? (
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-lg border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center">
                              <Loader2 className="w-5 h-5 animate-spin mb-1" />
                              <span className="text-[8px] font-bold uppercase tracking-wider animate-pulse">Uploading</span>
                            </div>
                          ) : (
                            <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all">
                              <Plus className="w-5 h-5 text-gray-400" />
                              <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(idx, e.target.files[0], 'images')} />
                            </label>
                          )}
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
          )}
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
                    setIsDirty(true);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Web Address (Slug URL)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 font-mono text-sm"
                  placeholder="e.g. falls-adventure"
                  value={page.slug}
                  onChange={(e) => {
                    const sanitizedVal = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
                    setPage({ ...page, slug: sanitizedVal });
                    setIsDirty(true);
                  }}
                  onBlur={(e) => {
                    // Remove leading/trailing hyphens and multiple consecutive hyphens on blur
                    const blurredVal = e.target.value.replace(/^-+|-+$/g, '').replace(/-+/g, '-');
                    setPage({ ...page, slug: blurredVal });
                  }}
                />
                <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                  This forms the web address of your page, e.g. <code>balingasag.com/p/<strong>{page.slug || 'slug'}</strong></code>. Only lowercase letters, numbers, and hyphens allowed.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Short Description</label>
                <textarea
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-sm resize-none"
                  rows={3}
                  placeholder="A brief summary for cards and search results..."
                  value={page.description || ''}
                  onChange={(e) => {
                    setPage({ ...page, description: e.target.value });
                    setIsDirty(true);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-100"
                  value={page.category}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    let updatedSections = [...sections];
                    if (newCategory === 'travel-guide') {
                      const res = ensureTravelGuideSections(sections, page.title);
                      if (res.changed) {
                        updatedSections = res.sections;
                        setSections(res.sections);
                      }
                    }
                    setPage({ ...page, category: newCategory });
                    setIsDirty(true);
                  }}
                >
                  <option value="tourist-spot">Tourist Spot</option>
                  <option value="event">Event</option>
                  <option value="travel-guide">Travel Guide</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-100"
                  value={page.status}
                  onChange={(e) => {
                    setPage({ ...page, status: e.target.value });
                    setIsDirty(true);
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main Thumbnail Image</label>
                <div className="relative group aspect-video bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  {uploadingMainImage ? (
                    <div className="flex flex-col items-center justify-center h-full bg-emerald-50 text-emerald-600 gap-2">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-wider animate-pulse">Uploading Image...</span>
                    </div>
                  ) : page.image_url ? (
                    <img src={page.image_url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-[10px] font-bold uppercase">No Image Set</span>
                    </div>
                  )}
                  {!uploadingMainImage && (
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white gap-2">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase">Change Image</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            setUploadingMainImage(true);
                            setIsDirty(true);
                            try {
                              const res = await mediaApi.upload(e.target.files[0]);
                              if (res.success) {
                                setPage({ ...page, image_url: res.url });
                              } else {
                                toast('Upload failed: ' + (res.message || 'Server error'), 'error');
                              }
                            } catch (err: any) {
                              console.error('Main image upload failed:', err);
                              toast('Upload failed: ' + (err.message || 'Network error'), 'error');
                            } finally {
                              setUploadingMainImage(false);
                            }
                          }
                        }} 
                      />
                    </label>
                  )}
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
                  onChange={(e) => {
                    setPage({ ...page, featured: e.target.checked });
                    setIsDirty(true);
                  }}
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
  );
}
