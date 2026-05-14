import React, { useEffect, useState } from 'react';
import { placesApi } from '../../lib/adminApi';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../lib/apiConfig';

interface Place {
  id: number;
  name: string;
  category: string;
  description: string;
  image_url: string;
  status: string;
}

export function Places() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'tourist-spot', description: '', status: 'active' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await placesApi.getAll();
      if (res.success) setPlaces(res.data);
    } catch (error) {
      console.error('Failed to fetch places', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this place?')) {
      try {
        await placesApi.delete(id);
        fetchPlaces();
      } catch (error) {
        alert('Failed to delete place');
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('status', formData.status);
      if (imageFile) {
        data.append('image', imageFile);
      }

      await placesApi.create(data);
      setShowModal(false);
      setFormData({ name: '', category: 'tourist-spot', description: '', status: 'active' });
      setImageFile(null);
      fetchPlaces();
    } catch (error: any) {
      alert(error.message || 'Failed to create place');
    }
  };

  // Helper to resolve image url since we use a separate backend
  const resolveImageUrl = (url: string) => {
    if (!url) return '';
    // If backend is on another port/host, adjust URL
    const baseUrl = API_BASE_URL.replace('/api/admin', '');
    return baseUrl + url;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Places Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Place</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <div key={place.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {place.image_url ? (
                <img 
                  src={resolveImageUrl(place.image_url)} 
                  alt={place.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  place.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {place.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-emerald-600 font-semibold mb-1 uppercase tracking-wider">
                {place.category.replace('_', ' ')}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{place.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{place.description}</p>
              
              <div className="flex justify-end pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleDelete(place.id)}
                  className="text-red-500 hover:text-red-700 p-2 transition-colors"
                  title="Delete Place"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Create New Place</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="tourist-spot">Tourist Spot</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Save Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
