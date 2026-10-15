import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Ship, 
  Car, 
  Anchor, 
  Home, 
  Bell, 
  CalendarHeart, 
  ArrowRight, 
  Lock,
  Clock,
  MessageCircle,
  ShieldAlert
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { useSettings } from '../context/SettingsContext';
import EnquiryModal from '../components/common/EnquiryModal';

const iconMap = {
  Compass: Compass,
  Ship: Ship,
  Car: Car,
  Anchor: Anchor,
  Home: Home,
  Bell: Bell,
  CalendarHeart: CalendarHeart,
};

const ServicesPage = () => {
  const { getWhatsAppLink } = useSettings();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    publicApi.getServices().then((res) => {
      if (res.data.success) {
        setServices(res.data.data);
      }
    }).finally(() => setLoading(false));
  }, []);

  const comingSoonServices = [
    {
      title: 'Comprehensive Egypt Package Tours',
      desc: 'All-inclusive 10 to 14-day multi-destination vacation itineraries covering Cairo, Nile cruise, and Red Sea resorts with internal flights.',
      tag: 'Under Operator Finalization',
    },
    {
      title: 'Dahabiya Luxury Private Sailboats',
      desc: 'Intimate boutique river sailing between Esna and Aswan with only 6 to 10 private suites, private chef, and unhurried temple visits.',
      tag: 'Coming Winter Season',
    },
    {
      title: 'Traditional Nile Felucca Expeditions',
      desc: 'Authentic canvas-sail sleeping journeys on the open Nile under the stars, accompanied by traditional Nubian crews.',
      tag: 'In Preparation',
    },
    {
      title: 'Scuba Diving & PADI Certification Packages',
      desc: 'Red Sea liveaboards, wreck dives at the SS Thistlegorm, and certified PADI Open Water courses in Dahab and Sharm El-Sheikh.',
      tag: 'Marine Safety Certification',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header */}
      <section className="bg-[#0b1d30] text-white py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Transparent Egypt Travel Offerings
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif">
            All Active Travel Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            WeCheaperTours provides seven active, administrator-managed service categories designed to make exploring Egypt seamless, authentic, and affordable.
          </p>
        </div>
      </section>

      {/* Active Services List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Active Travel Services (Ready for Enquiry)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse our seven active categories. Click any service to view current options or submit a consultation request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Compass;
            return (
              <div
                key={service.slug}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    to={`/${service.slug}`}
                    className="flex-1 py-2.5 px-4 text-center rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
                  >
                    Explore {service.name}
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setModalOpen(true);
                    }}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Under Preparation (Section 4.8) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
              <Clock className="w-3.5 h-3.5" />
              Not Available for Online Booking in Current Scope
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Services Under Preparation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In accordance with our strict quality and licensing policy, the following travel programs are currently undergoing field verification and are not yet active for live customer reservation:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonServices.map((item) => (
              <div 
                key={item.title} 
                className="bg-white/80 p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 opacity-90"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 font-serif">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-100/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Important Scope Notice:</strong> Transportation ticketing, live flight availability, automated hotel reservation systems, and active diving certifications are strictly excluded from the current website version.
            </p>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedService ? {
          category_id: selectedService.id,
          service_name: selectedService.name,
          defaultMessage: `I am interested in learning more about ${selectedService.name}.`,
        } : {}}
      />

    </div>
  );
};

export default ServicesPage;
