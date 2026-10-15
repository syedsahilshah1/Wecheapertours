import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Image as ImageIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminDestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    summary: '',
    description: '',
    main_image: '',
    seo_title: '',
    seo_description: '',
    display_order: 0,
    is_published: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchDestinations = () => {
    setLoading(true);
    adminApi.getDestinations()
      .then((res) => {
        if (res.data.success) setDestinations(res.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const openCreate = () => {
    setEditingDest(null);
    setFormData({
      name: '',
      slug: '',
      summary: '',
      description: '',
      main_image: '',
      seo_title: '',
      seo_description: '',
      display_order: destinations.length + 1,
      is_published: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (dest) => {
    setEditingDest(dest);
    setFormData({
      name: dest.name,
      slug: dest.slug,
      summary: dest.summary || '',
      description: dest.description || '',
      main_image: dest.main_image || '',
      seo_title: dest.seo_title || '',
      seo_description: dest.seo_description || '',
      display_order: dest.display_order || 0,
      is_published: dest.is_published,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingDest) {
        await adminApi.updateDestination(editingDest.id, formData);
      } else {
        await adminApi.createDestination(formData);
      }
      setModalOpen(false);
      fetchDestinations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save destination.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    try {
      await adminApi.deleteDestination(id);
      fetchDestinations();
    } catch (err) {
      alert('Failed to delete destination.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Destinations Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the seven core Egyptian tourism regions, images, and SEO descriptions.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading destinations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.main_image || 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80'}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                      dest.is_published ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200'
                    }`}>
                      {dest.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold rounded-lg">
                      {dest.listings_count} active listings
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    {dest.name}
                  </h3>
                  <span className="text-[11px] text-amber-700 font-mono block">
                    /{dest.slug}
                  </span>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEdit(dest)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dest.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#0b1d30] text-white p-6 flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif">
                {editingDest ? `Edit Destination: ${editingDest.name}` : 'Create New Destination'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated if empty"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Main Image URL</label>
                <input
                  type="text"
                  value={formData.main_image}
                  onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Summary</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Status</label>
                  <select
                    value={formData.is_published ? '1' : '0'}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.value === '1' })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="1">Published (Visible on site)</option>
                    <option value="0">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-3">
                <span className="text-xs font-bold text-slate-800">SEO Settings</span>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Description</label>
                  <textarea
                    rows={2}
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDestinationsPage;
