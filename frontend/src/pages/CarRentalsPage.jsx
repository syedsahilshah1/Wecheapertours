import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  MessageCircle, 
  Info,
  Calendar,
  Clock,
  Check
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { useSettings } from '../context/SettingsContext';

const CarRentalsPage = () => {
  const { getWhatsAppLink } = useSettings();
  const [carOptions, setCarOptions] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    destination_id: '',
    pickup_date: '',
    pickup_time: '10:00',
    return_date: '',
    return_time: '18:00',
    driver_preference: 'with_driver', // with_driver, self_drive
    vehicle_preference: 'Sedan (3 Passengers)',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      publicApi.getCarRentals(),
      publicApi.getDestinations(),
    ]).then(([cRes, dRes]) => {
      if (cRes.data.success) setCarOptions(cRes.data.data);
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
        service_category_id: 3, // Car rentals category ID
        destination_id: formData.destination_id ? parseInt(formData.destination_id) : undefined,
        message: formData.message || `Car rental enquiry for ${formData.vehicle_preference} in Egypt.`,
        preferences: {
          driver_preference: formData.driver_preference,
          vehicle_preference: formData.vehicle_preference,
          pickup_date: formData.pickup_date,
          pickup_time: formData.pickup_time,
          return_date: formData.return_date,
          return_time: formData.return_time,
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
        setError(err.response?.data?.message || 'Error sending request. Please chat on WhatsApp.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const [fleetFilter, setFleetFilter] = useState('all');

  const filteredCars = carOptions.filter((car) => {
    if (fleetFilter === 'all') return true;
    const title = car.title.toLowerCase();
    if (fleetFilter === 'sedan') return title.includes('mercedes') || title.includes('sedan') || title.includes('corolla');
    if (fleetFilter === 'van') return title.includes('van') || title.includes('hiace') || title.includes('v-class');
    if (fleetFilter === 'suv') return title.includes('suv') || title.includes('prado') || title.includes('4x4') || title.includes('tucson');
    return true;
  });

  const handleSelectCar = (car) => {
    setFormData((prev) => ({
      ...prev,
      vehicle_preference: car.title,
    }));
    const formElement = document.getElementById('rental-enquiry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="space-y-16 pb-24">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-[#071526] via-[#0b1d30] to-[#071526] text-white py-20 text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest uppercase border border-amber-500/30">
            <Car className="w-3.5 h-3.5 text-amber-400" />
            Chauffeured Transfers & Private Vehicles
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Egypt Car Rentals & Chauffeurs
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Travel seamlessly between Cairo, Alexandria, Luxor, Aswan, Hurghada, Sharm El-Sheikh, and Marsa Alam with vetted professional drivers, comprehensive passenger insurance, and climate-controlled vehicles.
          </p>
        </div>
      </section>

      {/* Main Layout: Vehicle Options (Left) + Enquiry Form (Right) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Available Fleet & Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-serif">
                  Available Vehicle Categories
                </h2>
                <p className="text-xs text-slate-500">
                  All vehicles include air conditioning, luggage storage, and tourist-police route clearance.
                </p>
              </div>

              {/* Fleet Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setFleetFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    fleetFilter === 'all'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({carOptions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFleetFilter('sedan')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    fleetFilter === 'sedan'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sedans
                </button>
                <button
                  type="button"
                  onClick={() => setFleetFilter('van')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    fleetFilter === 'van'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Minivans & Vans
                </button>
                <button
                  type="button"
                  onClick={() => setFleetFilter('suv')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    fleetFilter === 'suv'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  4x4 & SUVs
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500">Loading car rental fleet...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCars.map((car) => {
                  const isSelected = formData.vehicle_preference === car.title;
                  return (
                    <div
                      key={car.id}
                      className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover-lift transition-all p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center group ${
                        isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="relative w-full sm:w-56 h-44 rounded-2xl overflow-hidden shrink-0">
                        <img
                          src={car.main_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                          alt={car.title}
                          className="w-full h-full object-cover img-zoom"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2.5 py-1 bg-[#0b1d30]/85 backdrop-blur-md text-amber-400 font-bold text-[10px] uppercase rounded-full">
                            Chauffeured
                          </span>
                        </div>
                        {car.price_amount && (
                          <div className="absolute bottom-2 right-2">
                            <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-full shadow-md">
                              From ${car.price_amount} / day
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 flex-1 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                            {car.rental_type === 'car' ? 'Private Vehicle' : 'VIP Chauffeur Service'}
                          </span>
                          {car.capacity && (
                            <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5 bg-slate-100 px-2.5 py-0.5 rounded-full">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              Up to {car.capacity} Passengers
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 font-serif group-hover:text-amber-700 transition-colors">
                          {car.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {car.summary}
                        </p>

                        {/* Badges / highlights */}
                        {car.highlights && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {car.highlights.map((h, i) => (
                              <span key={i} className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200/70 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                                {h}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-2 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleSelectCar(car)}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                          >
                            <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                            {isSelected ? 'Selected in Quote Form' : 'Select This Vehicle'}
                          </button>

                          <a
                            href={getWhatsAppLink(`Hello WeCheaperTours, I would like to inquire about renting: "${car.title}".`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs transition-colors"
                            title="Chat about this car on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* With vs Without Driver Guide */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Why We Recommend Chauffeured Rentals in Egypt
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Navigating Egyptian city traffic, desert highways, and tourist-police checkpoints requires experienced local route familiarity. Our licensed professional chauffeurs manage parking, fuel, toll gates, and route security permits so you can sit back and relax entirely.
              </p>
            </div>
          </div>

          {/* Right: Enquiry Form (5 Cols) */}
          <div className="lg:col-span-5">
            <div id="rental-enquiry-form" className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Instant Quote Request
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Car Rental Enquiry Form
                </h3>
              </div>

              {/* Informational Disclaimer Note */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Important:</strong> Car rental details submitted below are enquiry preferences only, not an instant reservation. Our coordinator verifies vehicle availability and sends a fixed quotation.
                </span>
              </div>

              {submittedReference ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 font-serif">
                    Rental Enquiry Submitted!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Your request reference number is:
                  </p>
                  <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-300 rounded-xl font-mono font-bold text-amber-900 text-base">
                    {submittedReference}
                  </div>
                  <p className="text-xs text-slate-500">
                    Our team will confirm vehicle assignment and driver dispatch with you via WhatsApp.
                  </p>
                  <div className="pt-2">
                    <a
                      href={getWhatsAppLink(`Hello WeCheaperTours, I submitted car rental enquiry ${submittedReference}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Follow Up on WhatsApp
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
                      placeholder="e.g. Michael Thorne"
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
                        placeholder="michael@example.com"
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
                        placeholder="+1 555 0199"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Destination Region *
                    </label>
                    <select
                      required
                      value={formData.destination_id}
                      onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    >
                      <option value="">Select an Egyptian destination...</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Driver option toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Driver Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, driver_preference: 'with_driver' })}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          formData.driver_preference === 'with_driver'
                            ? 'border-amber-600 bg-amber-50 font-bold text-amber-900'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        ✓ With Chauffeur (Recommended)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, driver_preference: 'self_drive' })}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          formData.driver_preference === 'self_drive'
                            ? 'border-amber-600 bg-amber-50 font-bold text-amber-900'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Self-Drive Vehicle
                      </button>
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vehicle Preference
                    </label>
                    <select
                      value={formData.vehicle_preference}
                      onChange={(e) => setFormData({ ...formData, vehicle_preference: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    >
                      <option value="Sedan (3 Passengers)">Sedan (1-3 Passengers + Luggage)</option>
                      <option value="Minivan (6-8 Passengers)">Minivan (4-8 Passengers - Family / Group)</option>
                      <option value="Executive Luxury SUV">Executive Luxury SUV (VIP)</option>
                      <option value="25-Seater Minibus">25-Seater Minibus (Large Group)</option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        value={formData.pickup_date}
                        onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Return Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.return_date}
                        onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pickup Location & Special Notes
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Cairo Airport Terminal 3 pickup to downtown hotel, child safety seat required..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    {submitting ? 'Submitting Enquiry...' : 'Submit Car Rental Enquiry'}
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

export default CarRentalsPage;
