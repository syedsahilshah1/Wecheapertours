import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShoppingBag, 
  UtensilsCrossed, 
  Sparkles, 
  Shirt, 
  Coffee, 
  Gem, 
  HelpCircle,
  MessageCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { useSettings } from '../context/SettingsContext';
import EnquiryModal from '../components/common/EnquiryModal';

const ConciergePage = () => {
  const { getWhatsAppLink } = useSettings();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    publicApi.getConciergeServices().then((res) => {
      if (res.data.success) {
        setServices(res.data.data);
      }
    }).finally(() => setLoading(false));
  }, []);

  const openEnquiry = (srv) => {
    setSelectedService(srv);
    setModalOpen(true);
  };

  const [conciergeFilter, setConciergeFilter] = useState('all');

  const filteredServices = services.filter((srv) => {
    if (conciergeFilter === 'all') return true;
    const title = (srv.title + ' ' + (srv.summary || '')).toLowerCase();
    if (conciergeFilter === 'food') return title.includes('meal') || title.includes('food') || title.includes('seafood') || title.includes('groceries') || title.includes('sweets');
    if (conciergeFilter === 'shopping') return title.includes('cotton') || title.includes('jewellery') || title.includes('souvenir') || title.includes('shopping');
    if (conciergeFilter === 'errands') return title.includes('laundry') || title.includes('emergency') || title.includes('request') || title.includes('errand');
    return true;
  });

  return (
    <div className="space-y-16 pb-24">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-[#071526] via-[#0b1d30] to-[#071526] text-white py-20 text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest uppercase border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            24/7 On-Demand Assistance Across Egypt
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Personal Concierge Services
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            From villa grocery stocking and private chef home-cooked meals to authentic Egyptian cotton shopping escorts and emergency errand handling.
          </p>
        </div>
      </section>

      {/* Scope Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Bespoke On-Demand Support:</strong> All concierge services are coordinated on an individual basis. Simply submit a request or click the WhatsApp button to chat directly with our bilingual Cairo and Red Sea concierge team.
          </span>
        </div>
      </section>

      {/* 9 Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              The 9 Concierge Specializations
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose any service to request delivery, local escort, or personalized quotation.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              type="button"
              onClick={() => setConciergeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                conciergeFilter === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({services.length})
            </button>
            <button
              type="button"
              onClick={() => setConciergeFilter('food')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                conciergeFilter === 'food'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Food & Dining
            </button>
            <button
              type="button"
              onClick={() => setConciergeFilter('shopping')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                conciergeFilter === 'shopping'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shopping & Souvenirs
            </button>
            <button
              type="button"
              onClick={() => setConciergeFilter('errands')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                conciergeFilter === 'errands'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Errands & Care
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading concierge services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover-lift transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={srv.main_image || 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80'}
                      alt={srv.title}
                      className="w-full h-full object-cover img-zoom"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-[#0a1829]/80 backdrop-blur-md text-amber-300 font-bold text-[10px] uppercase rounded-full">
                        Concierge Escort
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2.5">
                    <h3 className="text-lg font-bold text-slate-900 font-serif group-hover:text-amber-700 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {srv.description || srv.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => openEnquiry(srv)}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Request Service
                  </button>
                  <a
                    href={getWhatsAppLink(`Hello WeCheaperTours Concierge, I need assistance with: "${srv.title}".`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedService ? {
          listing_id: selectedService.id,
          listing_title: selectedService.title,
          category_id: selectedService.category_id,
          defaultMessage: `I need concierge assistance with: "${selectedService.title}".`,
        } : {}}
      />

    </div>
  );
};

export default ConciergePage;
