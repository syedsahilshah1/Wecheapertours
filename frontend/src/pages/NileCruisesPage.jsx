import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle,
  Info,
  ShieldCheck,
  Utensils,
  Sparkles
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { useSettings } from '../context/SettingsContext';
import EnquiryModal from '../components/common/EnquiryModal';

const NileCruisesPage = () => {
  const { getWhatsAppLink } = useSettings();
  const [cruises, setCruises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState({});

  const [activeCruisePhotos, setActiveCruisePhotos] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCruise, setSelectedCruise] = useState(null);

  const handleCruisePhotoChange = (cruiseId, photo) => {
    setActiveCruisePhotos((prev) => ({ ...prev, [cruiseId]: photo }));
  };

  useEffect(() => {
    publicApi.getCruises().then((res) => {
      if (res.data.success) {
        setCruises(res.data.data);
      }
    }).finally(() => setLoading(false));
  }, []);

  const toggleDay = (cruiseId, dayIndex) => {
    const key = `${cruiseId}-${dayIndex}`;
    setActiveAccordion((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openEnquiry = (cruise) => {
    setSelectedCruise(cruise);
    setModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-24">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0c233c] to-[#071320] text-white py-20 text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            5-Star River Journeys Between Luxor & Aswan
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif">
            Classic Nile Cruises
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sail along the eternal river past fertile date palm banks and pharaonic monuments. Choose between our three classic itineraries with full board and certified guided temple tours.
          </p>
        </div>
      </section>

      {/* Scope Disclaimer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Manual Cabin Allocation & Seasonal Scheduling Notice:</span>
            <p>
              In accordance with Nile navigation lock schedules and seasonal river water levels, cruise departure dates and cabin availability are confirmed directly by our operations team. Submitting an enquiry allows our coordinators to hold your preferred cabin category at direct local rates.
            </p>
          </div>
        </div>
      </section>

      {/* The 3 Itineraries List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Loading cruise itineraries...</p>
          </div>
        ) : (
          cruises.map((cruise) => (
            <div 
              key={cruise.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Image Section - 5 Cols */}
                {(() => {
                  const cruisePhotos = Array.from(new Set([
                    cruise.main_image,
                    ...(Array.isArray(cruise.images) ? cruise.images : []),
                    'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=800&q=80'
                  ])).filter(Boolean).slice(0, 3);

                  const activePhoto = activeCruisePhotos[cruise.id] || cruise.main_image || cruisePhotos[0];

                  return (
                    <div className="lg:col-span-5 relative h-80 lg:h-auto min-h-[360px] bg-slate-950 flex flex-col justify-between p-4 group">
                      <img
                        key={activePhoto}
                        src={activePhoto}
                        alt={cruise.title}
                        className="absolute inset-0 w-full h-full object-cover animate-fade-in transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-lg">
                          {cruise.duration}
                        </span>
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full">
                          ★ 5-Star Deluxe Ship
                        </span>
                      </div>

                      {/* Interactive Thumbnail Previews */}
                      {cruisePhotos.length > 1 && (
                        <div className="relative z-10 flex items-center gap-2 pt-4">
                          {cruisePhotos.map((photo, pIdx) => {
                            const isCurrent = activePhoto === photo;
                            return (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => handleCruisePhotoChange(cruise.id, photo)}
                                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                                    : 'border-white/50 opacity-70 hover:opacity-100'
                                }`}
                              >
                                <img
                                  src={photo}
                                  alt={`Preview ${pIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Details Section - 7 Cols */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <Ship className="w-3.5 h-3.5 text-amber-600" />
                        5-Star Deluxe Nile Cruiser Itinerary
                      </span>
                      {cruise.price_amount && (
                        <span className="text-lg font-extrabold text-slate-900 font-serif">
                          From ${cruise.price_amount} {cruise.price_currency} <span className="text-xs font-normal text-slate-500">/ person</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mb-3">
                      {cruise.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {cruise.description || cruise.summary}
                    </p>

                    {/* Features row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-amber-600" />
                        <span>Full Board (3 Meals Daily)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Licensed Egyptologist</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Sun Deck & Pool</span>
                      </div>
                    </div>

                    {/* Day-by-Day Accordion */}
                    {cruise.itinerary && cruise.itinerary.length > 0 && (
                      <div className="space-y-2 border-t border-slate-100 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Day-by-Day Schedule Highlights:
                        </h4>
                        <div className="space-y-2">
                          {cruise.itinerary.map((dayItem, dIdx) => {
                            const isExpanded = activeAccordion[`${cruise.id}-${dIdx}`];
                            return (
                              <div key={dIdx} className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                                <button
                                  onClick={() => toggleDay(cruise.id, dIdx)}
                                  className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left font-semibold text-slate-800 transition-colors"
                                >
                                  <span>Day {dayItem.day}: {dayItem.title}</span>
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                {isExpanded && (
                                  <div className="p-4 bg-white text-slate-600 text-[11px] leading-relaxed border-t border-slate-100">
                                    {dayItem.details}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => openEnquiry(cruise)}
                      className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      Enquire for Dates & Cabin Availability
                    </button>
                    <a
                      href={getWhatsAppLink(`Hello WeCheaperTours, I would like to check dates for "${cruise.title}"`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      Ask on WhatsApp
                    </a>
                  </div>

                </div>

              </div>
            </div>
          ))
        )}
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedCruise ? {
          listing_id: selectedCruise.id,
          listing_title: selectedCruise.title,
          category_id: selectedCruise.category_id,
          defaultMessage: `I am interested in "${selectedCruise.title}". Please send available sailing dates, ship options, and cabin rates.`,
        } : {}}
      />

    </div>
  );
};

export default NileCruisesPage;
