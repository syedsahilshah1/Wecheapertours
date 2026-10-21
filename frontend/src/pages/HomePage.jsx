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

const defaultServices = [
  {
    slug: 'excursions',
    name: 'Excursions & Day Tours',
    shortName: 'Excursions',
    icon: 'Compass',
    description: 'Guided day tours, historical pharaonic excursions, and cultural experiences across Egypt.',
    listings_count: 12,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'nile-cruises',
    name: 'Classic Nile Cruises',
    shortName: 'Nile Cruises',
    icon: 'Ship',
    description: 'Unforgettable 5-star river cruises between Luxor and Aswan with full guided sightseeing.',
    listings_count: 5,
    image: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'car-rentals',
    name: 'Car Rentals & Chauffeurs',
    shortName: 'Car Rentals',
    icon: 'Car',
    description: 'Chauffeured VIP sedans, family tourist vans, airport transfers, and intercity private travel.',
    listings_count: 6,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'ferry-crossings',
    name: 'Ferry Crossings',
    shortName: 'Ferry Crossings',
    icon: 'Anchor',
    description: 'Red Sea and Gulf of Aqaba maritime ferry route assistance and private crossing coordination.',
    listings_count: 2,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'vacation-rentals',
    name: 'Hotels & Vacation Rentals',
    shortName: 'Vacation Rentals',
    icon: 'Home',
    description: 'Handpicked sea-view villas, boutique hotel suites, lagoon residences, and luxury apartments.',
    listings_count: 8,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'concierge',
    name: 'Personal Concierge',
    shortName: 'Concierge',
    icon: 'Bell',
    description: 'Bespoke grocery delivery, traditional meal prep, shopping escort, and local errand handling.',
    listings_count: 9,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'events',
    name: 'Event Planning',
    shortName: 'Event Planning',
    icon: 'CalendarHeart',
    description: 'Romantic proposals, Nile celebrations, pyramid dinners, and memorable gatherings in Egypt.',
    listings_count: 4,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  },
];

const defaultDestinations = [
  {
    slug: 'cairo-giza',
    name: 'Cairo & Giza',
    category: 'nile',
    regionTag: 'Pharaonic Heritage',
    tagline: 'Pyramids of Giza, the Great Sphinx & Grand Egyptian Museum',
    main_image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
    listings_count: 24,
  },
  {
    slug: 'luxor',
    name: 'Luxor',
    category: 'nile',
    regionTag: 'Ancient Thebes',
    tagline: 'Valley of the Kings, Karnak Temple & Sunrise Hot Air Balloons',
    main_image: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
    listings_count: 18,
  },
  {
    slug: 'aswan-abu-simbel',
    name: 'Aswan & Abu Simbel',
    category: 'nile',
    regionTag: 'Nubian Jewel',
    tagline: 'Philae Temple, Nile Feluccas & Abu Simbel Rock Temples',
    main_image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    listings_count: 14,
  },
  {
    slug: 'alexandria',
    name: 'Alexandria',
    category: 'nile',
    regionTag: 'Mediterranean Pearl',
    tagline: 'Citadel of Qaitbay, Roman Catacombs & Seaside Corniche',
    main_image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
    listings_count: 10,
  },
  {
    slug: 'sharm-el-sheikh',
    name: 'Sharm El-Sheikh',
    category: 'red-sea',
    regionTag: 'Sinai Peninsula',
    tagline: 'Ras Mohammed Marine Park, Desert Safaris & Luxury Resorts',
    main_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    listings_count: 16,
  },
  {
    slug: 'hurghada',
    name: 'Hurghada',
    category: 'red-sea',
    regionTag: 'Red Sea Riviera',
    tagline: 'Giftun Island White Sands, Dolphin Dives & Marina Promenade',
    main_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    listings_count: 20,
  },
  {
    slug: 'marsa-alam',
    name: 'Marsa Alam',
    category: 'red-sea',
    regionTag: 'Pristine South',
    tagline: 'Dolphin House, Sea Turtle Sanctuary & Untouched Reefs',
    main_image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80',
    listings_count: 8,
  },
];

const HomePage = () => {
  const { settings, getWhatsAppLink } = useSettings();
  const [services, setServices] = useState([]);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [featuredTours, setFeaturedTours] = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredRentals, setFeaturedRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayServices = defaultServices.map((def) => {
    const match = services.find((s) => s.slug === def.slug);
    return {
      ...def,
      ...(match || {}),
      image: (match && match.image) || def.image,
      listings_count: match && match.listings_count !== undefined ? match.listings_count : def.listings_count,
    };
  });

  const displayDestinations = defaultDestinations.map((def) => {
    const match = destinations.find((d) => d.slug === def.slug);
    return {
      ...def,
      ...(match || {}),
      main_image: def.main_image || (match && match.main_image),
      listings_count: (match && match.listings_count !== undefined) ? match.listings_count : def.listings_count,
    };
  }).filter((dest) => {
    if (destinationFilter === 'all') return true;
    return dest.category === destinationFilter;
  });

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
      <section className="relative h-[calc(100vh-96px)] min-h-[500px] max-h-[900px] flex flex-col justify-between items-center text-white overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1829] via-[#0a1829]/75 to-[#0a1829]/50" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-full w-full flex flex-col justify-between items-center py-4 sm:py-5 text-center z-10">
          
          {/* Animated floating pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-semibold backdrop-blur-md animate-float">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Direct Local Rates in Egypt • Licensed Tour Operators</span>
          </div>

          {/* Core Hero Content */}
          <div className="my-auto py-2 flex flex-col items-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-serif leading-tight">
              Experience The Soul Of <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                Timeless Egypt
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-200/90 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-light">
              Private Giza pyramid excursions, 5-star deluxe Nile cruises, chauffeured airport transfers, luxury Red Sea vacation stays, and bespoke 24/7 personal concierge.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
              <Link
                to="/excursions"
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Day Tours</span>
              </Link>

              <Link
                to="/nile-cruises"
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Ship className="w-4 h-4 text-amber-400" />
                <span>Nile Cruise Itineraries</span>
              </Link>

              <button
                onClick={() => openEnquiry()}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Free Custom Quote</span>
              </button>
            </div>
          </div>

          {/* Animated Trust Indicators (Compact Horizontal Glass Cards) */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-left pb-1">
            <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 flex items-center gap-2.5 hover-lift">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-white leading-tight">100%</div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate">Licensed Egyptologists</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 flex items-center gap-2.5 hover-lift">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-white leading-tight">Direct</div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate">Zero Commission Markups</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 flex items-center gap-2.5 hover-lift">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-white leading-tight">Free</div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate">No-Commitment Enquiries</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 flex items-center gap-2.5 hover-lift">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-white leading-tight">24/7</div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate">Direct WhatsApp Support</div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 2. FEATURED DAY EXCURSIONS */}
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

      {/* 6. SEVEN DESTINATIONS SHOWCASE - REDESIGNED LUXURY BENTO & CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Iconic Regions & Gateways
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
              Explore Egypt By Destination
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              From millennium-old temples along the Nile to world-class Red Sea coral waters.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1 self-start md:self-auto shadow-xs">
            <button
              type="button"
              onClick={() => setDestinationFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                destinationFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Destinations
            </button>
            <button
              type="button"
              onClick={() => setDestinationFilter('nile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                destinationFilter === 'nile'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nile Valley & Antiquities
            </button>
            <button
              type="button"
              onClick={() => setDestinationFilter('red-sea')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                destinationFilter === 'red-sea'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Red Sea Coast
            </button>
          </div>
        </div>

        {/* Dynamic Responsive Luxury Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayDestinations.map((dest, idx) => {
            const isFeatured = destinationFilter === 'all' && (idx === 0 || idx === 1);
            return (
              <Link
                key={dest.slug}
                to={`/excursions?dest=${dest.slug}`}
                className={`group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-200/80 hover:border-amber-400/50 transition-all duration-500 flex flex-col justify-between p-6 sm:p-7 ${
                  isFeatured
                    ? 'sm:col-span-2 h-[380px] sm:h-[420px]'
                    : 'col-span-1 h-[380px] sm:h-[420px]'
                }`}
              >
                {/* Background Image with Zoom Effect */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${dest.main_image})` }}
                />

                {/* Rich Multi-Stop Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20 group-hover:from-black/90 group-hover:via-black/35 transition-colors duration-500" />

                {/* Top Glassmorphism Badges */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="px-3.5 py-1.5 bg-black/45 backdrop-blur-md border border-white/20 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{dest.regionTag || 'Egypt'}</span>
                  </span>

                  <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-full shadow-md">
                    {dest.listings_count} Tours
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide group-hover:text-amber-300 transition-colors drop-shadow-md">
                    {dest.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed drop-shadow">
                    {dest.tagline || dest.summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                      <span>Explore Experiences</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>

                    <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-amber-500 group-hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xs">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 7. THE 7 CORE ACTIVE SERVICES SHOWCASE - EXPANDING SLIDER ACCORDION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
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

        {/* Expanding Accordion Panels */}
        <div className="w-full h-[520px] sm:h-[550px] lg:h-[580px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-800/40 bg-slate-950 flex flex-col md:flex-row select-none">
          {displayServices.map((service, index) => {
            const isActive = activeServiceIndex === index;
            const Icon = iconMap[service.icon] || Compass;

            return (
              <div
                key={service.slug}
                onMouseEnter={() => setActiveServiceIndex(index)}
                onClick={() => setActiveServiceIndex(index)}
                className={`relative overflow-hidden cursor-pointer transition-all duration-500 ease-in-out border-b md:border-b-0 md:border-r border-white/10 last:border-0 group ${
                  isActive
                    ? 'flex-[4] md:flex-[3.5] lg:flex-[4]'
                    : 'flex-1 md:flex-1'
                }`}
              >
                {/* Background Image */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${
                    isActive ? 'scale-105' : 'scale-100 group-hover:scale-105'
                  }`}
                  style={{ backgroundImage: `url(${service.image})` }}
                />

                {/* Dark Gradient Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? 'bg-gradient-to-t from-black/95 via-black/55 to-black/25'
                      : 'bg-black/65 group-hover:bg-black/45'
                  }`}
                />

                {/* ACTIVE SLICE CONTENT */}
                {isActive ? (
                  <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 md:p-10 z-10 animate-fadeIn">
                    {/* Offering Badge & Icon */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-400 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-amber-300 tracking-wide uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/20">
                        {service.listings_count} Active Offerings
                      </span>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-white tracking-wide mb-2 drop-shadow-md">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-6 max-w-xl drop-shadow">
                      {service.description}
                    </p>

                    {/* Reference Style Action Button (Crimson / Burgundy Pill) */}
                    <div>
                      <Link
                        to={`/${service.slug}`}
                        className="inline-flex items-center gap-2 bg-[#6b1426] hover:bg-[#83192f] active:bg-[#4f0e1c] text-white px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl hover:shadow-rose-950/60 hover:scale-105 border border-rose-400/20"
                      >
                        <span>EXPLORE SERVICE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* INACTIVE SLICE LABEL */
                  <div className="relative h-full w-full flex items-end p-4 md:p-6 z-10">
                    <div className="w-full">
                      {/* Mobile view */}
                      <div className="flex items-center gap-1.5 md:hidden text-white/90 font-serif font-bold text-sm truncate">
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">{service.shortName || service.name}</span>
                      </div>
                      {/* Desktop slice label (matches image style) */}
                      <div className="hidden md:block">
                        <p className="text-white/90 font-serif font-bold text-sm lg:text-base tracking-wide truncate drop-shadow-md group-hover:text-amber-300 transition-colors">
                          {service.shortName || service.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
