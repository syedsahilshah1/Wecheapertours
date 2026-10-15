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
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Clock, 
  MessageCircle,
  MapPin,
  Sparkles,
  Users,
  Bed,
  Calendar,
  Flame,
  Award
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

const HomePage = () => {
  const { settings, getWhatsAppLink } = useSettings();
  const [services, setServices] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredRentals, setFeaturedRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});

  useEffect(() => {
    Promise.all([
      publicApi.getServices(),
      publicApi.getDestinations(),
      publicApi.getTours(),
      publicApi.getCarRentals(),
      publicApi.getVacationRentals(),
    ]).then(([sRes, dRes, tRes, cRes, rRes]) => {
      if (sRes.data.success) setServices(sRes.data.data);
      if (dRes.data.success) setDestinations(dRes.data.data);
      if (tRes.data.success) setFeaturedTours(tRes.data.data.slice(0, 3));
      if (cRes.data.success) setFeaturedCars(cRes.data.data.slice(0, 3));
      if (rRes.data.success) setFeaturedRentals(rRes.data.data.slice(0, 3));
    }).catch((err) => {
      console.error('Failed to load home data', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const openEnquiry = (listing = null, service = null) => {
    if (listing) {
      setModalInitialData({
        listing_id: listing.id,
        listing_title: listing.title,
        category_id: listing.category_id,
        destination_id: listing.destination_id,
        defaultMessage: `I am interested in "${listing.title}". Please provide more details and a quote.`,
      });
    } else if (service) {
      setModalInitialData({
        category_id: service.id,
        service_name: service.name,
        defaultMessage: `I would like to enquire about ${service.name}.`,
      });
    } else {
      setModalInitialData({
        defaultMessage: 'I am planning a trip to Egypt and would love assistance.',
      });
    }
    setEnquiryModalOpen(true);
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION WITH ANIMATED BADGES & VISUALS */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1829] via-[#0a1829]/75 to-[#0a1829]/50" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-24 text-center space-y-7 z-10">
          
          {/* Animated floating pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md animate-float">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Direct Local Rates in Egypt • Licensed Tour Operators</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-serif leading-[1.1]">
            Experience The Soul Of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              Timeless Egypt
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-light">
            Private Giza pyramid excursions, 5-star deluxe Nile cruises, chauffeured airport transfers, luxury Red Sea vacation stays, and bespoke 24/7 personal concierge.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/excursions"
              className="px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Day Tours</span>
            </Link>

            <Link
              to="/nile-cruises"
              className="px-8 py-4 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Ship className="w-4 h-4 text-amber-400" />
              <span>Nile Cruise Itineraries</span>
            </Link>

            <button
              onClick={() => openEnquiry()}
              className="px-8 py-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Free Custom Quote</span>
            </button>
          </div>

          {/* Animated Trust Indicators */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover-lift">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Award className="w-5 h-5" />
                <span className="font-bold text-lg">100%</span>
              </div>
              <span className="text-xs text-slate-300 font-medium">Licensed Egyptologists</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover-lift">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold text-lg">Direct</span>
              </div>
              <span className="text-xs text-slate-300 font-medium">Zero Commission Markups</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover-lift">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-lg">Free</span>
              </div>
              <span className="text-xs text-slate-300 font-medium">No-Commitment Enquiries</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover-lift">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <MessageCircle className="w-5 h-5" />
                <span className="font-bold text-lg">24/7</span>
              </div>
              <span className="text-xs text-slate-300 font-medium">Direct WhatsApp Support</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE 7 CORE ACTIVE SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Carefully Tailored Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
            Our 7 Core Travel Services
          </h2>
          <p className="text-sm text-slate-600">
            From iconic ancient temples to Red Sea coastal retreats and bespoke personal assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Compass;
            return (
              <div 
                key={service.slug}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 hover-lift flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif group-hover:text-amber-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {service.listings_count} active offerings
                  </span>
                  <Link
                    to={`/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED DAY EXCURSIONS */}
      <section className="bg-slate-50/80 py-20 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Top Rated Tours
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
                Popular Day Excursions
              </h2>
            </div>
            <Link
              to="/excursions"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800"
            >
              Browse All Excursions ({featuredTours.length}+)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <div 
                key={tour.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover-lift flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.main_image || 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80'}
                    alt={tour.title}
                    className="w-full h-full object-cover img-zoom"
                  />
                  {tour.destination && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#0a1829]/80 backdrop-blur-md text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-md">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {tour.destination.name}
                    </span>
                  )}
                  {tour.price_amount && (
                    <span className="absolute bottom-4 right-4 px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-lg">
                      From ${tour.price_amount} {tour.price_currency}
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {tour.duration || 'Full Day'}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        5.0 (Certified)
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif line-clamp-2 group-hover:text-amber-700 transition-colors">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {tour.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <Link
                      to={`/excursions/${tour.slug}`}
                      className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      View Itinerary
                    </Link>
                    <button
                      onClick={() => openEnquiry(tour)}
                      className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CHAUFFEURED CAR RENTALS SPOTLIGHT (Added cars showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Private Transportation
            </span>
            <h2 className="text-3xl font-bold text-slate-900 font-serif">
              Chauffeured Cars & Tourist Vans
            </h2>
          </div>
          <Link
            to="/car-rentals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            Explore Complete Fleet
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover-lift flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={car.main_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                    alt={car.title}
                    className="w-full h-full object-cover img-zoom"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-[#0b1d30]/80 backdrop-blur-md text-white text-[11px] font-bold rounded-full">
                      Chauffeured Option
                    </span>
                  </div>
                  {car.price_amount && (
                    <span className="absolute bottom-3 right-3 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-md">
                      From ${car.price_amount} / day
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Up to {car.capacity} passengers</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-serif group-hover:text-amber-700 transition-colors">
                    {car.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {car.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/car-rentals"
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  Book Chauffeur <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => openEnquiry(car)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Enquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOTELS & VACATION VILLAS SPOTLIGHT (Added hotels & villas showcase) */}
      <section className="bg-amber-50/50 py-20 border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Residences & Suites
              </span>
              <h2 className="text-3xl font-bold text-slate-900 font-serif">
                Featured Villas & Boutique Stays
              </h2>
            </div>
            <Link
              to="/vacation-rentals"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              Browse All Stays
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover-lift flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={rental.main_image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'}
                      alt={rental.title}
                      className="w-full h-full object-cover img-zoom"
                    />
                    {rental.destination && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#0a1829]/80 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {rental.destination.name}
                      </span>
                    )}
                    {rental.price_amount && (
                      <span className="absolute bottom-3 right-3 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-md">
                        From ${rental.price_amount} / night
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-2">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {rental.capacity} Guests
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        {rental.bedrooms} Bedrooms
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-serif group-hover:text-amber-700 transition-colors">
                      {rental.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {rental.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700">Verified Host</span>
                  <button
                    onClick={() => openEnquiry(rental)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Check Availability
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NILE CRUISES SECTION (Section 4.2: 3 Itineraries) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-[#0c233c] via-[#091b2e] to-[#050f1a] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          
          {/* Subtle animated glowing circle in corner */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl animate-pulse-glow" />

          <div className="max-w-2xl space-y-5 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Classic River Journeys
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif">
              Legendary Nile Cruises
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Drift between Luxor and Aswan in 5-star elegance. Admire sunset over ancient temples, enjoy full-board dining, and experience guided sightseeing with an English-speaking licensed Egyptologist.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 hover-lift">
                <span className="block font-bold text-amber-400 text-sm">Luxor → Aswan</span>
                <span className="text-xs text-slate-300">4 Nights / 5 Days</span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 hover-lift">
                <span className="block font-bold text-amber-400 text-sm">Aswan → Luxor</span>
                <span className="text-xs text-slate-300">3 Nights / 4 Days</span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 hover-lift">
                <span className="block font-bold text-amber-400 text-sm">Roundtrip Complete</span>
                <span className="text-xs text-slate-300">7 Nights / 8 Days</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/nile-cruises"
                className="px-7 py-3.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg hover:scale-105 transition-all"
              >
                View Cruise Itineraries
              </Link>
              <button
                onClick={() => openEnquiry(null, { id: 2, name: 'Classic Nile Cruises' })}
                className="px-7 py-3.5 rounded-xl font-bold text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer"
              >
                Enquire Cabin Rates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SEVEN DESTINATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Iconic Regions
          </span>
          <h2 className="text-3xl font-bold text-slate-900 font-serif">
            Explore Egypt By Destination
          </h2>
          <p className="text-sm text-slate-600">
            Our local teams are based across all seven key destinations in Egypt.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              to={`/excursions?dest=${dest.slug}`}
              className="group relative h-52 rounded-2xl overflow-hidden shadow-xs hover-lift"
            >
              <img
                src={dest.main_image}
                alt={dest.name}
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                <span className="block font-bold text-xs sm:text-sm font-serif group-hover:text-amber-300 transition-colors">
                  {dest.name}
                </span>
                <span className="text-[10px] text-slate-300 font-medium">
                  {dest.listings_count} active experiences
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. SERVICES UNDER PREPARATION (Section 4.8) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-amber-50/70 rounded-3xl p-8 sm:p-12 border border-amber-200/70">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="px-3 py-1 bg-amber-200/80 text-amber-900 rounded-full text-[11px] font-bold tracking-wider uppercase">
                Under Preparation & Coming Soon
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                Expanding Our Egypt Offerings
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To guarantee top safety and quality, certain specialty experiences are being prepared with certified operators before public availability:
              </p>
              <ul className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-2 font-medium">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  All-Inclusive Egypt Package Tours
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Dahabiya Luxury Sailboats
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Traditional Felucca Sunset Trips
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Scuba Diving & PADI Certifications
                </li>
              </ul>
            </div>

            <div className="bg-white p-7 rounded-2xl shadow-md border border-amber-200 max-w-xs text-center space-y-4">
              <h4 className="font-bold text-slate-900 text-sm font-serif">
                Need a Custom Itinerary?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chat directly with our bilingual Cairo and Red Sea coordinators. We arrange tailored private requests across all Egyptian governorates.
              </p>
              <a
                href={getWhatsAppLink('Hello WeCheaperTours, I have a custom itinerary request for Egypt.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Message Local Guide
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        initialData={modalInitialData}
      />

    </div>
  );
};

export default HomePage;
