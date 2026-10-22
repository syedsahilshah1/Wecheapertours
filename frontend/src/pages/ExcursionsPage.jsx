import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import EnquiryModal from '../components/common/EnquiryModal';

const ExcursionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentDest = searchParams.get('dest') || searchParams.get('destination') || '';
  const urlSearch = searchParams.get('search') || '';

  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  // Enquiry Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  useEffect(() => {
    publicApi.getDestinations().then((res) => {
      if (res.data.success) {
        setDestinations(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (currentDest) params.destination = currentDest;
    if (searchQuery) params.search = searchQuery;

    publicApi.getTours(params)
      .then((res) => {
        if (res.data.success) {
          setTours(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, [currentDest, searchQuery]);

  const handleDestChange = (slug) => {
    if (slug === currentDest) {
      searchParams.delete('dest');
    } else {
      searchParams.set('dest', slug);
    }
    setSearchParams(searchParams);
  };

  const openEnquiry = (tour) => {
    setSelectedTour(tour);
    setModalOpen(true);
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Header */}
      <section className="bg-[#0b1d30] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Certified Egyptologists & Private Transport
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Excursions & Day Tours
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Discover Egypt’s monumental wonders with private air-conditioned vehicles and top-rated local Egyptologists.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Search & Filter Bar (No Scrollbar Slider) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            {/* Search Box */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search excursions (e.g. Pyramids, Luxor, Snorkeling)..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            {/* Destination Dropdown Filter */}
            <div className="relative w-full sm:w-64">
              <Filter className="w-4 h-4 text-amber-600 absolute left-3.5 top-3 pointer-events-none" />
              <select
                value={currentDest}
                onChange={(e) => handleDestChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium text-slate-700 cursor-pointer appearance-none transition-colors"
              >
                <option value="">All Destinations ({tours.length})</option>
                {destinations.map((dest) => (
                  <option key={dest.slug} value={dest.slug}>
                    {dest.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Quick Filter Tag Pills - flex-wrap with NO slider */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-600" /> Destination:
            </span>
            <button
              onClick={() => handleDestChange('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                !currentDest ? 'bg-amber-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Regions
            </button>
            {destinations.map((dest) => (
              <button
                key={dest.slug}
                onClick={() => handleDestChange(dest.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  currentDest === dest.slug
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading excursions...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <Compass className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No excursions found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or select another destination region.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover-lift transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={tour.main_image || 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80'}
                      alt={tour.title}
                      className="w-full h-full object-cover img-zoom"
                    />
                    {tour.destination && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#0a1829]/80 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-md">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {tour.destination.name}
                      </span>
                    )}
                    {tour.price_amount && (
                      <span className="absolute bottom-3 right-3 px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-lg">
                        From ${tour.price_amount} {tour.price_currency}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{tour.duration || 'Full Day'}</span>
                      </div>
                      <span className="text-amber-600 font-bold text-[11px] flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                        ★ 4.9 (Certified Guide)
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-serif line-clamp-2 group-hover:text-amber-700 transition-colors">
                      {tour.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {tour.summary}
                    </p>

                    {tour.highlights && tour.highlights.length > 0 && (
                      <div className="pt-2 space-y-1">
                        {tour.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/excursions/${tour.slug}`}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => openEnquiry(tour)}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Enquire Now
                  </button>
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
        initialData={selectedTour ? {
          listing_id: selectedTour.id,
          listing_title: selectedTour.title,
          category_id: selectedTour.category_id,
          destination_id: selectedTour.destination_id,
          defaultMessage: `I am interested in "${selectedTour.title}". Please send pricing and availability.`,
        } : {}}
      />

    </div>
  );
};

export default ExcursionsPage;
