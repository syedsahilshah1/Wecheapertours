import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Home, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users, 
  Bed, 
  X
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminRentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, car, vacation

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category_id: 3, // 3: Car Rentals, 5: Vacation Rentals
    destination_id: '',
    title: '',
    slug: '',
    rental_type: 'car', // car or vacation
    capacity: 4,
    bedrooms: 2,
    price_amount: '',
    price_currency: 'USD',
    status: 'published',
    summary: '',
    description: '',
    main_image: '',
    amenities: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      adminApi.getListings(),
      adminApi.getDestinations(),
    ]).then(([lRes, dRes]) => {
      if (lRes.data.success) {
        const raw = Array.isArray(lRes.data.data) ? lRes.data.data : (lRes.data.data?.data || []);
        // filter down to car rentals (category 3) & vacation rentals (category 5)
        const relevant = raw.filter(item => [3, 5].includes(item.category_id));
        setRentals(relevant);
      }
      if (dRes.data.success) {
        const rawDest = Array.isArray(dRes.data.data) ? dRes.data.data : (dRes.data.data?.data || []);
        setDestinations(rawDest);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = (type = 'car') => {
    setEditingItem(null);
    setFormData({
      category_id: type === 'car' ? 3 : 5,
      destination_id: destinations[0]?.id || '',
      title: '',
      slug: '',
      rental_type: type,
      capacity: type === 'car' ? 4 : 6,
      bedrooms: type === 'car' ? 0 : 3,
      price_amount: type === 'car' ? '70.00' : '180.00',
      price_currency: 'USD',
      status: 'published',
      summary: '',
      description: '',
      main_image: '',
      amenities: type === 'car' ? 'Chauffeur, Air Conditioning, Fuel Included' : 'Private Pool, WiFi, Air Conditioning, Sea View',
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
      rental_type: item.rental_type || (item.category_id === 3 ? 'car' : 'vacation'),
      capacity: item.capacity || 4,
      bedrooms: item.bedrooms || 0,
      price_amount: item.price_amount ? String(item.price_amount) : '',
      price_currency: item.price_currency || 'USD',
      status: item.status || 'published',
      summary: item.summary || '',
      description: item.description || '',
      main_image: item.main_image || '',
      amenities: Array.isArray(item.amenities) ? item.amenities.join(', ') : '',
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
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        price_amount: formData.price_amount ? parseFloat(formData.price_amount) : null,
        amenities: formData.amenities ? formData.amenities.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (editingItem) {
        await adminApi.updateListing(editingItem.id, payload);
      } else {
        await adminApi.createListing(payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rental option.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this rental option?')) return;
    try {
      await adminApi.deleteListing(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete rental.');
    }
  };

  const filtered = rentals.filter((r) => {
    if (activeTab === 'car') return r.category_id === 3;
    if (activeTab === 'vacation') return r.category_id === 5;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Rental Options Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage chauffeured car fleet options and vacation rental villas/apartments.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openCreate('car')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <Car className="w-3.5 h-3.5 text-amber-400" />
            + Car Option
          </button>
          <button
            onClick={() => openCreate('vacation')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            + Vacation Home
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
            activeTab === 'all' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600'
          }`}
        >
          All Rental Options ({rentals.length})
        </button>
        <button
          onClick={() => setActiveTab('car')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
            activeTab === 'car' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600'
          }`}
        >
          Car Fleet Only
        </button>
        <button
          onClick={() => setActiveTab('vacation')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
            activeTab === 'vacation' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600'
          }`}
        >
          Vacation Rentals Only
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading rental options...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.main_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0b1d30]/80 text-white backdrop-blur-md">
                      {item.category_id === 3 ? 'Car Rental' : 'Vacation Rental'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {item.capacity && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {item.capacity} guests
                      </span>
                    )}
                    {item.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3" /> {item.bedrooms} beds
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {item.price_amount ? `$${item.price_amount} ${item.price_currency}` : 'Quote on request'}
                </span>
                <div className="space-x-1">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#0b1d30] text-white p-6 flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif">
                {editingItem ? `Edit: ${editingItem.title}` : 'Create Rental Listing'}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rental Type *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => {
                      const cid = parseInt(e.target.value);
                      setFormData({
                        ...formData,
                        category_id: cid,
                        rental_type: cid === 3 ? 'car' : 'vacation',
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="3">Car Rental Fleet Option</option>
                    <option value="5">Vacation Home / Villa Option</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Region</label>
                  <select
                    value={formData.destination_id}
                    onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="">Any Egyptian Destination...</option>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Guests)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_amount}
                    onChange={(e) => setFormData({ ...formData, price_amount: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Summary</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities / Features (Comma separated)</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="e.g. Lagoon Access, WiFi, Air Conditioning, Chauffeur"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
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
                  {saving ? 'Saving...' : 'Save Rental Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminRentalsPage;
