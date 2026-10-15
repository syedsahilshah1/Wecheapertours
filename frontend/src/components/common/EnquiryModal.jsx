import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageCircle, AlertCircle, Calendar, Users, Info } from 'lucide-react';
import { publicApi } from '../../services/publicApi';
import { useSettings } from '../../context/SettingsContext';

const EnquiryModal = ({ isOpen, onClose, initialData = {} }) => {
  const { getWhatsAppLink } = useSettings();

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    service_category_id: initialData.category_id || '',
    listing_id: initialData.listing_id || '',
    destination_id: initialData.destination_id || '',
    travel_date: '',
    guests: '2',
    driver_needed: 'yes',
    message: initialData.defaultMessage || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        service_category_id: formData.service_category_id || undefined,
        listing_id: formData.listing_id || undefined,
        destination_id: formData.destination_id || undefined,
        message: formData.message,
        preferences: {
          travel_date: formData.travel_date || undefined,
          guests: formData.guests || undefined,
          driver_needed: formData.driver_needed || undefined,
          listing_title: initialData.listing_title || undefined,
          service_name: initialData.service_name || undefined,
        },
      };

      const res = await publicApi.submitEnquiry(payload);
      if (res.data.success) {
        setSuccessData(res.data.data);
      } else {
        setError(res.data.message || 'Failed to submit enquiry.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMsgs = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsgs);
      } else {
        setError(err.response?.data?.message || 'Network error. Please try again or message us on WhatsApp.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessData(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d2238] to-[#16365a] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-400">
              Personalized Travel Consultation
            </span>
            <h3 className="text-xl font-bold font-serif">
              {initialData.listing_title ? `Enquire: ${initialData.listing_title}` : 'Plan Your Egypt Journey'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 font-serif">
                Enquiry Received!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you! Your request has been assigned reference:
              </p>
              <div className="inline-block px-5 py-2.5 bg-amber-50 border border-amber-300 rounded-xl font-mono font-bold text-amber-900 text-lg">
                {successData.reference}
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Our local Egypt travel coordinator will review availability and message you promptly via WhatsApp or email with tailored options and quotation.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={getWhatsAppLink(`Hello WeCheaperTours, I just submitted enquiry reference ${successData.reference}. I would like to discuss it.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  Speed Up on WhatsApp
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Important Policy Pill */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Informational Enquiry:</strong> Submitting this request is 100% free with no commitment. All itinerary dates, vehicles, and rates are confirmed directly by our team.
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555 0192"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Approx. Travel Date
                  </label>
                  <input
                    type="date"
                    value={formData.travel_date}
                    onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Guests
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    <option value="1">Solo Traveler (1)</option>
                    <option value="2">Couple / 2 Guests</option>
                    <option value="3-4">Small Group (3-4)</option>
                    <option value="5-8">Family / Group (5-8)</option>
                    <option value="9+">Large Party (9+)</option>
                  </select>
                </div>
              </div>

              {initialData.showDriverOption && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Driver Preference
                  </label>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="driver_needed"
                        value="yes"
                        checked={formData.driver_needed === 'yes'}
                        onChange={(e) => setFormData({ ...formData, driver_needed: e.target.value })}
                      />
                      <span>With Licensed Chauffeur (Recommended)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="driver_needed"
                        value="no"
                        checked={formData.driver_needed === 'no'}
                        onChange={(e) => setFormData({ ...formData, driver_needed: e.target.value })}
                      />
                      <span>Self-Drive Enquiry</span>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Requirements & Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you would like to experience, preferred times, pickup hotel, or any specific requests..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default EnquiryModal;
