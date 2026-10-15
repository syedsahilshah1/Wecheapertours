import React, { useState, useEffect } from 'react';
import { 
  Anchor, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  MessageCircle, 
  Info,
  Send,
  Check
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { useSettings } from '../context/SettingsContext';

const FerryCrossingsPage = () => {
  const { getWhatsAppLink } = useSettings();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enquiry form state
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    selected_route: 'Taba ⇄ Aqaba',
    travel_date: '',
    passengers: '2',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    publicApi.getFerryRoutes().then((res) => {
      if (res.data.success) {
        setRoutes(res.data.data);
      }
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
        service_category_id: 4, // Ferry category ID
        message: formData.message || `Ferry enquiry for route: ${formData.selected_route}`,
        preferences: {
          route: formData.selected_route,
          travel_date: formData.travel_date,
          passengers: formData.passengers,
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
        setError(err.response?.data?.message || 'Error sending request.');
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
            Red Sea & Gulf of Aqaba Maritime Routes
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Ferry Crossings & Assistance
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Guidance, schedule verification, and transfer linkages for Red Sea maritime transit between Egypt and Jordan, and across the Gulf of Suez.
          </p>
        </div>
      </section>

      {/* Mandatory Scope & Safety Alert */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-300/80 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            Official Maritime Notice (No Fabricated Schedules)
          </div>
          <p className="leading-relaxed">
            Red Sea ferry operators frequently adjust crossing timetables and seasonal operating permits based on maritime weather and port authority clearances. 
            WeCheaperTours strictly refuses to publish fabricated departure times or unverified fares. All ferry inquiries are personally reviewed with port authorities to provide you with verified schedules and combined terminal transfers.
          </p>
        </div>
      </section>

      {/* Main Content: The Two Routes + Enquiry Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: The Two Supported Routes (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-serif mb-2">
                Supported Maritime Routes
              </h2>
              <p className="text-xs text-slate-500">
                Contact our coordinators for verified seasonal sailings, vehicle transport policies, and port entry documents.
              </p>
            </div>

            <div className="space-y-6">
              {routes.map((route) => {
                const isSelected = formData.selected_route === route.title;
                return (
                  <div
                    key={route.id}
                    className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover-lift transition-all p-6 sm:p-7 flex flex-col md:flex-row gap-6 group ${
                      isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="relative w-full md:w-56 h-44 rounded-2xl overflow-hidden shrink-0 bg-slate-900">
                      <img
                        src={route.main_image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
                        alt={route.title}
                        className="w-full h-full object-cover img-zoom"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 bg-[#0a1829]/80 backdrop-blur-md text-amber-300 font-bold text-[10px] uppercase rounded-full flex items-center gap-1">
                          <Anchor className="w-3 h-3 text-amber-400" />
                          Maritime Crossing
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {route.duration || 'Fast Boat Connection'}
                        </span>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                          Verified Route
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 font-serif group-hover:text-amber-700 transition-colors">
                        {route.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {route.description || route.summary}
                      </p>

                      {route.highlights && (
                        <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                          {route.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, selected_route: route.title });
                            const formEl = document.getElementById('ferry-enquiry-form');
                            if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                          {isSelected ? 'Selected in Form' : 'Select Route'}
                        </button>

                        <a
                          href={getWhatsAppLink(`Hello WeCheaperTours, I would like to enquire about ferry route: "${route.title}".`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs transition-colors"
                          title="Chat about this route on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Travel Advisory Guide */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs text-slate-600 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm font-serif">
                Jordan & Red Sea Border Formalities
              </h4>
              <p>
                • <strong>Taba ⇄ Aqaba:</strong> Passengers traveling to Jordan to visit Petra generally require passport validity of at least 6 months and appropriate Jordan exit/entry documentation.
              </p>
              <p>
                • <strong>Hurghada ⇄ Sharm El-Sheikh:</strong> High-speed catamarans operate subject to Red Sea wind and wave clearances. Our ground transport backup option ensures you never miss a connecting flight.
              </p>
            </div>
          </div>

          {/* Right: Ferry Enquiry Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Route Verification
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Ferry Crossing Enquiry
                </h3>
              </div>

              {submittedReference ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 font-serif">
                    Enquiry Received!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Your ferry enquiry reference number is:
                  </p>
                  <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-300 rounded-xl font-mono font-bold text-amber-900 text-base">
                    {submittedReference}
                  </div>
                  <p className="text-xs text-slate-500">
                    We will inspect the harbor manifest and send current timetable details to your WhatsApp or email.
                  </p>
                  <div className="pt-2">
                    <a
                      href={getWhatsAppLink(`Hello WeCheaperTours, I submitted ferry enquiry reference ${submittedReference}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire on WhatsApp
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
                      placeholder="e.g. Liam Anderson"
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
                        placeholder="liam@example.com"
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
                        placeholder="+44 7700 900000"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Selected Ferry Route *
                    </label>
                    <select
                      value={formData.selected_route}
                      onChange={(e) => setFormData({ ...formData, selected_route: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
                    >
                      <option value="Taba ⇄ Aqaba">Taba (Egypt) ⇄ Aqaba (Jordan)</option>
                      <option value="Hurghada ⇄ Sharm El-Sheikh">Hurghada ⇄ Sharm El-Sheikh (Red Sea)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Travel Date
                      </label>
                      <input
                        type="date"
                        value={formData.travel_date}
                        onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Passengers
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.passengers}
                        onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Luggage or Connecting Transfer Details
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Do you need taxi transfer from Sharm airport to Taba terminal or luggage assistance?"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    {submitting ? 'Checking Routes...' : 'Check Verified Ferry Availability'}
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

export default FerryCrossingsPage;
