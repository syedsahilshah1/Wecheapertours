import React, { useState, useEffect } from 'react';
import { 
  CalendarHeart, 
  MapPin, 
  Users, 
  Sparkles, 
  MessageCircle, 
  Info,
  CheckCircle2,
  Calendar,
  Send,
  Check
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { useSettings } from '../context/SettingsContext';

const EventsPage = () => {
  const { getWhatsAppLink } = useSettings();
  const [offerings, setOfferings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    event_type: 'Pyramid-View Private Dinner',
    destination_id: '',
    event_date: '',
    guest_count: '2',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      publicApi.getEvents(),
      publicApi.getDestinations(),
    ]).then(([eRes, dRes]) => {
      if (eRes.data.success) setOfferings(eRes.data.data);
      if (dRes.data.success) setDestinations(dRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        service_category_id: 7, // Events category ID
        destination_id: formData.destination_id ? parseInt(formData.destination_id) : undefined,
        message: formData.message || `Event planning request for ${formData.event_type}`,
        preferences: {
          event_type: formData.event_type,
          event_date: formData.event_date,
          guest_count: formData.guest_count,
        },
      };

      const res = await publicApi.submitEnquiry(payload);
      if (res.data.success) {
        setSubmittedReference(res.data.data.reference);
      } else {
        setError(res.data.message || 'Submission failed.');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(', '));
      } else {
        setError(err.response?.data?.message || 'Error submitting event request.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      
      {/* Header */}
      <section className="bg-[#0b1d30] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Unforgettable Celebrations in Egypt
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Event Planning & Special Occasions
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            From candlelit dinners overlooking the illuminated Giza Pyramids to private Nile party boats and milestone birthday gatherings.
          </p>
        </div>
      </section>

      {/* Scope Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Manual Venue Confirmation Notice:</strong> All restaurant reservations, rooftop permits, cruise charters, and entertainment vendors are confirmed manually by our event production team to ensure quality and privacy.
          </span>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: 6 Event Offerings (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-serif mb-2">
                The 6 Event Planning Offerings
              </h2>
              <p className="text-xs text-slate-500">
                Custom décor, floral arrangements, acoustic musicians, photography, and catering coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {offerings.map((item) => {
                const isSelected = formData.event_type === item.title;
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl overflow-hidden border shadow-xs hover-lift transition-all flex flex-col justify-between group ${
                      isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-slate-900">
                        <img
                          src={item.main_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover img-zoom"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-1 bg-[#0a1829]/80 backdrop-blur-md text-amber-300 font-bold text-[10px] uppercase rounded-full">
                            Private Arrangement
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="text-base font-bold text-slate-900 font-serif group-hover:text-amber-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {item.description || item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, event_type: item.title });
                          const formEl = document.getElementById('event-enquiry-form');
                          if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        {isSelected ? 'Selected in Form' : 'Select Offering'}
                      </button>

                      <a
                        href={getWhatsAppLink(`Hello WeCheaperTours, I would like to enquire about: "${item.title}".`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs transition-colors"
                        title="Chat about this event on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Event Enquiry Form (5 cols) */}
          <div className="lg:col-span-5">
            <div id="event-enquiry-form" className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Custom Event Consultation
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Plan Your Event in Egypt
                </h3>
              </div>

              {submittedReference ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 font-serif">
                    Event Enquiry Submitted!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Your request reference code is:
                  </p>
                  <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-300 rounded-xl font-mono font-bold text-amber-900 text-base">
                    {submittedReference}
                  </div>
                  <p className="text-xs text-slate-500">
                    Our lead event coordinator will review venue options and contact you with design proposals and quotations.
                  </p>
                  <div className="pt-2">
                    <a
                      href={getWhatsAppLink(`Hello WeCheaperTours, I submitted event planning request ${submittedReference}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="e.g. Jessica Sterling"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jessica@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 555 9876"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Event Offering Type *
                    </label>
                    <select
                      value={formData.event_type}
                      onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
                    >
                      <option value="Birthday Celebrations & Private Parties">Birthday Celebrations & Private Parties</option>
                      <option value="Valentine's Day & Romantic Anniversaries">Valentine's Day & Romantic Anniversaries</option>
                      <option value="Custom Private & Family Events">Custom Private & Family Events</option>
                      <option value="Private Nile Cruise Event Arrangements">Private Nile Cruise Event Arrangements</option>
                      <option value="Pyramid-View Venue & Dinner Arrangements">Pyramid-View Venue & Dinner Arrangements</option>
                      <option value="Restaurant & Boutique Café Gatherings">Restaurant & Boutique Café Gatherings</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Requested Date
                      </label>
                      <input
                        type="date"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Approx. Guests
                      </label>
                      <select
                        value={formData.guest_count}
                        onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      >
                        <option value="2">Romantic Duo (2)</option>
                        <option value="3-6">Intimate Group (3-6)</option>
                        <option value="7-15">Party (7-15)</option>
                        <option value="16-30">Medium Gathering (16-30)</option>
                        <option value="30+">Large Reception (30+)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location Preference
                    </label>
                    <select
                      value={formData.destination_id}
                      onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    >
                      <option value="">Any Preferred Egyptian City...</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Event Concept, Budget & Special Wishes
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Surprise proposal overlooking pyramids, red roses, violinist, dinner menu preferences..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    {submitting ? 'Submitting Request...' : 'Request Event Proposal'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default EventsPage;
