import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  Award, 
  Compass, 
  CheckCircle, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import EnquiryModal from '../components/common/EnquiryModal';

const AboutPage = () => {
  const { settings, getWhatsAppLink } = useSettings();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const values = [
    {
      title: '100% Certified Egyptologists',
      desc: 'Our historical guides are licensed by the Egyptian Ministry of Tourism and Antiquities, offering genuine academic depth rather than tourist cliches.',
      icon: Award,
    },
    {
      title: 'Direct Local Pricing',
      desc: 'By working directly with local boat captains, drivers, and boutique operators, we offer transparent rates without third-party commission stacking.',
      icon: ShieldCheck,
    },
    {
      title: 'Personalized Flexibility',
      desc: 'Every traveler has unique interests. We customize pace, pickup times, and itineraries to suit your family, group, or solo journey.',
      icon: Compass,
    },
    {
      title: 'Local On-Ground Team',
      desc: 'We are physically based in Cairo, Luxor, Aswan, and Hurghada. You have direct WhatsApp support before and throughout your stay.',
      icon: Users,
    },
  ];

  const faqs = [
    {
      q: 'How does booking through WeCheaperTours work?',
      a: 'We operate as an informational and enquiry-based local provider. You submit a free enquiry through the website or message us on WhatsApp. Our coordinators check exact real-time availability, confirm customized details with you, and send a transparent quote before any commitment.',
    },
    {
      q: 'Are tour entrance tickets included in excursion prices?',
      a: 'Monument ticket policies vary. To provide maximum flexibility (e.g., student discounts or optional interior tomb visits), standard excursions cover private transport and licensed Egyptologist guides, with optional ticket prepayment upon request.',
    },
    {
      q: 'Is it safe to travel in Egypt?',
      a: 'Egypt is a warm, welcoming destination visited by millions of tourists annually. Our tours utilize licensed professional drivers, tourist-police cleared vehicles, and certified guides across all seven destinations.',
    },
    {
      q: 'What currency is accepted for tours and services?',
      a: 'Quotations are provided in USD, EUR, or GBP for international convenience, and Egyptian Pounds (EGP) are accepted locally.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero */}
      <section className="relative py-24 bg-[#0a1829] text-white overflow-hidden text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            About WeCheaperTours
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif">
            Egypt Travel by Locals, for World Explorers
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            {settings.about_story || 'WeCheaperTours was founded to bring transparent, honest local pricing and authentic Egyptian hospitality to international travelers.'}
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Our Philosophy
            </span>
            <h2 className="text-3xl font-bold text-slate-900 font-serif">
              Why We Founded WeCheaperTours
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              For years, travelers visiting Egypt paid substantial markups to middle-tier international agencies while local Egyptian guides and drivers received only a fraction. 
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              WeCheaperTours bridges that gap. We connect you directly with experienced, English-speaking Egyptologists, modern climate-controlled private vehicles, certified Nile cruise ships, and verified holiday apartments.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                Plan a Trip With Us
              </button>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80"
              alt="Luxor Egypt Tour"
              className="rounded-3xl shadow-xl w-full object-cover h-96"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden sm:block">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-lg font-serif">
                <span>7 Key Regions</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Cairo, Luxor, Aswan, Hurghada, Sharm El-Sheikh, Alexandria, and Marsa Alam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              The WeCheaper Difference
            </span>
            <h2 className="text-3xl font-bold text-slate-900 font-serif">
              Our Core Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    {val.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-bold text-slate-900 font-serif">
            Planning Your Egypt Travel
          </h2>
        </div>

        <div className="space-y-4 pt-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        initialData={{ defaultMessage: 'Hello, I would like to plan my trip to Egypt with WeCheaperTours.' }}
      />
    </div>
  );
};

export default AboutPage;
