import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { useSettings } from '../context/SettingsContext';

const ContactPage = () => {
  const { settings, getWhatsAppLink } = useSettings();

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await publicApi.submitEnquiry({
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      if (res.data.success) {
        setSubmittedReference(res.data.data.reference);
      } else {
        setError(res.data.message || 'Submission failed.');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(', '));
      } else {
        setError(err.response?.data?.message || 'Error sending message. Try contacting us on WhatsApp.');
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
            Local Egypt Travel Concierge
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Contact WeCheaperTours
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Our local teams in Cairo, Luxor, Aswan, and Hurghada are here to answer your questions and customize your dream Egyptian holiday.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Left Info Column (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-serif mb-2">
                Get in Touch
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reach out anytime for free itinerary consultations, private tour customizations, or immediate on-ground support in Egypt.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Cairo Head Office</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {settings.address || 'Tahrir Square, Downtown, Cairo, Egypt'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Direct Phone Support</h4>
                  <a href={`tel:${settings.phone}`} className="text-xs text-amber-700 font-semibold hover:underline mt-0.5 block">
                    {settings.phone}
                  </a>
                  <span className="text-[10px] text-slate-400">Daily 8:00 AM – 10:00 PM (Cairo Time)</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Email Enquiries</h4>
                  <a href={`mailto:${settings.email}`} className="text-xs text-amber-700 font-semibold hover:underline mt-0.5 block">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={getWhatsAppLink('Hello WeCheaperTours, I would like to enquire about traveling to Egypt.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Directly on WhatsApp
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Licensed Tourism Partners
              </span>
              <p>Registered travel coordination services in accordance with Egyptian Tourism Authority regulations.</p>
            </div>
          </div>

          {/* Right Form Column (7 cols) */}
          <div className="md:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  General Consultation
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Send Us a Message
                </h3>
              </div>

              {submittedReference ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-9 h-9" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 font-serif">
                    Message Delivered!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Your customer reference number is:
                  </p>
                  <div className="inline-block px-5 py-2.5 bg-amber-50 border border-amber-300 rounded-xl font-mono font-bold text-amber-900 text-lg">
                    {submittedReference}
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    A dedicated travel coordinator has received your enquiry and will respond via WhatsApp or email promptly.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <a
                      href={getWhatsAppLink(`Hello WeCheaperTours, I submitted contact enquiry ${submittedReference}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Speed Up on WhatsApp
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
                      placeholder="e.g. Robert Langdon"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="robert@example.com"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 555 0123"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      How Can We Help You? *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us your travel dates, destinations of interest, hotel preferences, or any specific questions..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:bg-amber-900 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? 'Sending Request...' : 'Send Travel Enquiry'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactPage;
