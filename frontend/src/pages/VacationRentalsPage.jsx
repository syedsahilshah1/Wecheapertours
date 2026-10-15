import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MapPin, 
  Users, 
  Bed, 
  Check, 
  Search, 
  Filter, 
  Info, 
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { useSettings } from '../context/SettingsContext';
import EnquiryModal from '../components/common/EnquiryModal';

const VacationRentalsPage = () => {
  const { getWhatsAppLink } = useSettings();
  const [rentals, setRentals] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDest, setSelectedDest] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    publicApi.getDestinations().then((res) => {
      if (res.data.success) setDestinations(res.data.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = selectedDest ? { destination: selectedDest } : {};
    publicApi.getVacationRentals(params)
      .then((res) => {
        if (res.data.success) setRentals(res.data.data);
      })
      .finally(() => setLoading(false));
  }, [selectedDest]);

  const openEnquiry = (rental) => {
    setSelectedRental(rental);
    setModalOpen(true);
  };

  const [propertyType, setPropertyType] = useState('all');

  const filteredRentals = rentals.filter((r) => {
    if (propertyType === 'all') return true;
    const title = (r.title + ' ' + (r.summary || '')).toLowerCase();
    if (propertyType === 'villa') return title.includes('villa');
    if (propertyType === 'penthouse') return title.includes('penthouse');
    if (propertyType === 'suite') return title.includes('suite') || title.includes('apartment');
    if (propertyType === 'ecolodge') return title.includes('lodge') || title.includes('bungalow') || title.includes('duplex');
    return true;
  });

  return (
    <div className="space-y-16 pb-24">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-[#071424] via-[#0b1d30] to-[#071424] text-white py-20 text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest uppercase border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Handpicked Villas, Suites & Boutique Stays
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Hotels & Vacation Rentals in Egypt
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Stay in lagoon-front El Gouna villas, direct pyramid-view Giza penthouses, Nile island eco-lodges, and Mediterranean suites across Egypt's most desirable locations.
          </p>
        </div>
      </section>

      {/* Scope Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Informational Accommodation Listings:</strong> Every residence is vetted locally for cleanliness, WiFi speed, and security. Submitting an enquiry allows our local hosts to confirm private dates directly with you without automated fees or deposits.
          </span>
        </div>
      </section>

      {/* Filter Bar: Destinations & Property Types */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
        
        {/* Destination Filter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-2">
            <MapPin className="w-3.5 h-3.5 text-amber-600" /> Destination:
          </span>
          <button
            onClick={() => setSelectedDest('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              !selectedDest ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Destinations
          </button>
          {destinations.map((d) => (
            <button
              key={d.slug}
              onClick={() => setSelectedDest(d.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                selectedDest === d.slug ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Property Type Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Property Type:
          </span>
          <button
            onClick={() => setPropertyType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              propertyType === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Properties ({rentals.length})
          </button>
          <button
            onClick={() => setPropertyType('villa')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              propertyType === 'villa' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Private Villas
          </button>
          <button
            onClick={() => setPropertyType('penthouse')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              propertyType === 'penthouse' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pyramid-View Penthouses
          </button>
          <button
            onClick={() => setPropertyType('suite')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              propertyType === 'suite' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Boutique Suites
          </button>
          <button
            onClick={() => setPropertyType('ecolodge')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              propertyType === 'ecolodge' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Eco-Lodges & Bungalows
          </button>
        </div>

      </section>

      {/* Rentals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading accommodations...</p>
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
            <Home className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No properties matching this filter currently.</p>
            <p className="text-xs text-slate-500">Contact our concierge for custom off-market villas and boutique hotel suites.</p>
            <button
              onClick={() => { setSelectedDest(''); setPropertyType('all'); }}
              className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover-lift transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={rental.main_image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'}
                      alt={rental.title}
                      className="w-full h-full object-cover img-zoom"
                    />
                    {rental.destination && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#0a1829]/80 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-md">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {rental.destination.name}
                      </span>
                    )}
                    {rental.price_amount && (
                      <span className="absolute bottom-3 right-3 px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-lg">
                        Indicative: ${rental.price_amount} {rental.price_currency} / night
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        {rental.capacity && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {rental.capacity} Guests
                          </span>
                        )}
                        {rental.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-slate-400" />
                            {rental.bedrooms} Bedrooms
                          </span>
                        )}
                      </div>
                      <span className="text-amber-600 font-bold text-[11px] flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                        ★ 5.0 Vetted
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-serif group-hover:text-amber-700 transition-colors">
                      {rental.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {rental.summary || rental.description}
                    </p>

                    {rental.amenities && rental.amenities.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {rental.amenities.slice(0, 4).map((a, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => openEnquiry(rental)}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Enquire for Dates
                  </button>
                  <a
                    href={getWhatsAppLink(`Hello WeCheaperTours, I would like to check availability for "${rental.title}".`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl transition-colors"
                    title="Ask on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
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
        initialData={selectedRental ? {
          listing_id: selectedRental.id,
          listing_title: selectedRental.title,
          category_id: selectedRental.category_id,
          destination_id: selectedRental.destination_id,
          defaultMessage: `I am interested in "${selectedRental.title}". Please confirm date availability and rates.`,
        } : {}}
      />

    </div>
  );
};

export default VacationRentalsPage;
