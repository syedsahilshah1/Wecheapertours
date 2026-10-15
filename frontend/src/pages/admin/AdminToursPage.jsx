import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Ship
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminToursPage = () => {
  const [listings, setListings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category_id: 1, // Excursions default
    destination_id: '',
    title: '',
    slug: '',
    summary: '',
    description: '',
    duration: 'Full Day',
    price_amount: '',
    price_currency: 'USD',
    status: 'published',
    display_order: 0,
    featured: false,
    main_image: '',
    highlights: '',
    inclusions: '',
    exclusions: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    const params = {};
    if (categoryFilter) params.category_id = categoryFilter;
    if (destinationFilter) params.destination_id = destinationFilter;
    if (searchQuery) params.search = searchQuery;

    Promise.all([
      adminApi.getListings(params),
      adminApi.getDestinations(),
      adminApi.getServices(),
    ]).then(([lRes, dRes, sRes]) => {
      if (lRes.data.success) {
        // filter down to excursions (1) & nile cruises (2)
        const relevant = lRes.data.data.filter(item => [1, 2].includes(item.category_id));
        setListings(relevant);
      }
      if (dRes.data.success) setDestinations(dRes.data.data);
      if (sRes.data.success) setCategories(sRes.data.data.filter(c => [1, 2].includes(c.id)));
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [categoryFilter, destinationFilter, searchQuery]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      category_id: 1,
      destination_id: destinations[0]?.id || '',
      title: '',
      slug: '',
      summary: '',
      description: '',
      duration: 'Full Day',
      price_amount: '50.00',
      price_currency: 'USD',
      status: 'published',
      display_order: listings.length + 1,
      featured: false,
      main_image: '',
      highlights: 'Private air-conditioned vehicle\nLicensed Egyptologist guide\nHotel pickup & return',
      inclusions: 'Private transfers\nGuide fees\nBottled mineral water',
      exclusions: 'Monument entrance fees\nGratuities for staff',
    });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      category_id: item.category_id,
      destination_id: item.destination_id || '',
      title: item.title,
      slug: item.slug,
      summary: item.summary || '',
      description: item.description || '',
      duration: item.duration || '',
      price_amount: item.price_amount ? String(item.price_amount) : '',
      price_currency: item.price_currency || 'USD',
      status: item.status || 'published',
      display_order: item.display_order || 0,
      featured: !!item.featured,
      main_image: item.main_image || '',
      highlights: Array.isArray(item.highlights) ? item.highlights.join('\n') : '',
      inclusions: Array.isArray(item.inclusions) ? item.inclusions.join('\n') : '',
      exclusions: Array.isArray(item.exclusions) ? item.exclusions.join('\n') : '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
        destination_id: formData.destination_id ? parseInt(formData.destination_id) : null,
        price_amount: formData.price_amount ? parseFloat(formData.price_amount) : null,
        highlights: formData.highlights ? formData.highlights.split('\n').filter(Boolean) : [],
        inclusions: formData.inclusions ? formData.inclusions.split('\n').filter(Boolean) : [],
        exclusions: formData.exclusions ? formData.exclusions.split('\n').filter(Boolean) : [],
      };

      if (editingItem) {
        await adminApi.updateListing(editingItem.id, payload);
      } else {
        await adminApi.createListing(payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save listing.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await adminApi.deleteListing(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete listing.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Tours & Nile Cruises Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add and update excursion day trips and classic Nile cruise itineraries without touching React code.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Tour / Cruise
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tours or cruises..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
          >
            <option value="">All Categories (Tours & Cruises)</option>
            <option value="1">Excursions & Day Tours</option>
            <option value="2">Classic Nile Cruises</option>
          </select>

          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
          >
            <option value="">All Destinations</option>
            {destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Compass className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs">No listings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Listing Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Destination</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                        {item.category?.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {item.destination?.name || 'Multiple'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {item.duration || '—'}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {item.price_amount ? `$${item.price_amount} ${item.price_currency}` : 'Enquiry quote'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#0b1d30] text-white p-6 flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif">
                {editingItem ? `Edit: ${editingItem.title}` : 'Create Tour or Cruise Listing'}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="1">Excursions & Day Tours</option>
                    <option value="2">Classic Nile Cruises</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Region</label>
                  <select
                    value={formData.destination_id}
                    onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="">Select destination...</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 7 hours / 4N 5D"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price Amount (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_amount}
                    onChange={(e) => setFormData({ ...formData, price_amount: e.target.value })}
                    placeholder="e.g. 65.00"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Main Image URL</label>
                <input
                  type="text"
                  value={formData.main_image}
                  onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Summary</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Description / Itinerary</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Highlights (One per line)</label>
                  <textarea
                    rows={3}
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inclusions (One per line)</label>
                  <textarea
                    rows={3}
                    value={formData.inclusions}
                    onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
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
                  {saving ? 'Saving...' : 'Save Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminToursPage;
