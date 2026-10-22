import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Compass, 
  Ship, 
  Home, 
  Car, 
  Anchor, 
  ChevronDown, 
  Plus, 
  Minus, 
  Check, 
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

const CATEGORIES = [
  { id: 'excursions', name: 'Excursions & Tours', path: '/excursions', icon: Compass },
  { id: 'nile-cruises', name: 'Nile Cruises', path: '/nile-cruises', icon: Ship },
  { id: 'vacation-rentals', name: 'Hotels & Rentals', path: '/vacation-rentals', icon: Home },
  { id: 'car-rentals', name: 'Car & Chauffeur', path: '/car-rentals', icon: Car },
  { id: 'ferry-crossings', name: 'Ferry Crossings', path: '/ferry-crossings', icon: Anchor },
];

const POPULAR_DESTINATIONS = [
  { slug: 'cairo-giza', name: 'Cairo & Giza', desc: 'Pyramids, Sphinx, Museums' },
  { slug: 'luxor', name: 'Luxor', desc: 'Valley of Kings, Karnak, Balloons' },
  { slug: 'aswan', name: 'Aswan', desc: 'Philae, Abu Simbel, Nile Feluccas' },
  { slug: 'hurghada', name: 'Hurghada', desc: 'Red Sea, Coral Reefs, Desert Safari' },
  { slug: 'sharm-el-sheikh', name: 'Sharm El Sheikh', desc: 'Ras Mohammed, Diving, Sinai' },
  { slug: 'alexandria', name: 'Alexandria', desc: 'Mediterranean Coast, Citadel' },
  { slug: 'dahab', name: 'Dahab', desc: 'Blue Hole, Canyon, Bohemian Sinai' },
];

const QUICK_TAGS = [
  { label: 'Pyramids of Giza', slug: 'cairo-giza', category: 'excursions' },
  { label: 'Luxor Temples', slug: 'luxor', category: 'excursions' },
  { label: '5-Star Nile Cruise', slug: 'luxor', category: 'nile-cruises' },
  { label: 'Red Sea Diving', slug: 'hurghada', category: 'excursions' },
  { label: 'Cairo Airport Transfer', slug: 'cairo-giza', category: 'car-rentals' },
];

export default function HeroBookingFilter({ destinations = [] }) {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('excursions');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState('');
  
  // Date State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 3);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);

  // Guests State
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // Popover Toggles
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [guestsPopoverOpen, setGuestsPopoverOpen] = useState(false);

  // Filter options
  const [privateOnly, setPrivateOnly] = useState(false);
  const [freeCancel, setFreeCancel] = useState(true);

  // Refs for outside click
  const destRef = useRef(null);
  const guestsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (destRef.current && !destRef.current.contains(event.target)) {
        setDestDropdownOpen(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setGuestsPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter destination options based on user typing
  const allDestinations = destinations.length > 0 ? destinations : POPULAR_DESTINATIONS;
  const filteredDests = allDestinations.filter(d => 
    d.name.toLowerCase().includes(destinationQuery.toLowerCase()) ||
    (d.desc && d.desc.toLowerCase().includes(destinationQuery.toLowerCase()))
  );

  const handleSelectDestination = (dest) => {
    setDestinationQuery(dest.name);
    setSelectedDestinationSlug(dest.slug || '');
    setDestDropdownOpen(false);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const selectedCatObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];
    const params = new URLSearchParams();

    if (selectedDestinationSlug) {
      params.set('dest', selectedDestinationSlug);
      params.set('destination', selectedDestinationSlug);
    } else if (destinationQuery) {
      params.set('search', destinationQuery);
    }

    if (startDate) params.set('from', startDate);
    if (endDate) params.set('to', endDate);
    
    const totalGuests = adults + children;
    if (totalGuests > 1) params.set('guests', totalGuests.toString());
    if (rooms > 1) params.set('rooms', rooms.toString());
    if (privateOnly) params.set('private', 'true');
    if (freeCancel) params.set('freeCancel', 'true');

    navigate(`${selectedCatObj.path}?${params.toString()}`);
  };

  const handleQuickTagClick = (tag) => {
    setActiveCategory(tag.category);
    setSelectedDestinationSlug(tag.slug);
    setDestinationQuery(tag.label);
    
    const selectedCatObj = CATEGORIES.find(c => c.id === tag.category) || CATEGORIES[0];
    const params = new URLSearchParams();
    params.set('dest', tag.slug);
    params.set('destination', tag.slug);
    params.set('search', tag.label);
    navigate(`${selectedCatObj.path}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 mt-2 sm:mt-4 z-30">
      
      {/* 1. Category Switcher Tabs (Booking.com style) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20 translate-y-0.5'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 hover:text-white backdrop-blur-md'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Main Booking.com Search Bar Frame (Iconic yellow/amber border container) */}
      <div className="relative bg-amber-400 p-1 sm:p-1.5 rounded-2xl rounded-tl-none shadow-2xl shadow-black/50">
        <form 
          onSubmit={handleSearch}
          className="bg-white rounded-xl grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 shadow-inner"
        >

          {/* SECTION A: Destination Input */}
          <div ref={destRef} className="relative md:col-span-4 p-2.5 sm:p-3 text-left">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setDestDropdownOpen(prev => !prev)}
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
                <MapPin className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Where to in Egypt?
                </label>
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => {
                    setDestinationQuery(e.target.value);
                    setSelectedDestinationSlug('');
                    setDestDropdownOpen(true);
                  }}
                  onFocus={() => setDestDropdownOpen(true)}
                  placeholder="Cairo, Luxor, Hurghada..."
                  className="w-full text-slate-900 font-semibold text-sm sm:text-base placeholder-slate-400 bg-transparent border-0 outline-none p-0 truncate cursor-text"
                />
              </div>
              {destinationQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDestinationQuery('');
                    setSelectedDestinationSlug('');
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Destination Autocomplete Dropdown */}
            {destDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 max-h-64 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Popular Egyptian Destinations</span>
                </div>
                {filteredDests.length > 0 ? (
                  filteredDests.map((dest) => (
                    <button
                      key={dest.slug || dest.id || dest.name}
                      type="button"
                      onClick={() => handleSelectDestination(dest)}
                      className="w-full px-3 py-2 text-left hover:bg-amber-50 flex items-center gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 text-sm group-hover:text-amber-700">
                          {dest.name}
                        </div>
                        {dest.desc && (
                          <div className="text-xs text-slate-500 truncate">
                            {dest.desc}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-500 text-center">
                    No matching Egyptian destination found. Press search to look across all tours.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION B: Dates (Check-in / Check-out) */}
          <div className="md:col-span-4 p-2.5 sm:p-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    From
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-slate-900 font-semibold text-xs sm:text-sm bg-transparent border-0 outline-none p-0 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    To
                  </label>
                  <input
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-slate-900 font-semibold text-xs sm:text-sm bg-transparent border-0 outline-none p-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: Guests & Rooms Popover */}
          <div ref={guestsRef} className="relative md:col-span-3 p-2.5 sm:p-3 text-left">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setGuestsPopoverOpen(prev => !prev)}
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
                <Users className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Travelers
                </label>
                <div className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                  {adults} adults · {children} kids · {rooms} room{rooms > 1 ? 's' : ''}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Guests Counter Popover */}
            {guestsPopoverOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 space-y-4">
                
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Adults</div>
                    <div className="text-xs text-slate-500">Age 18 and older</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 text-sm">{adults}</span>
                    <button
                      type="button"
                      disabled={adults >= 20}
                      onClick={() => setAdults(prev => prev + 1)}
                      className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Children</div>
                    <div className="text-xs text-slate-500">Age 0 – 17</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                      className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 text-sm">{children}</span>
                    <button
                      type="button"
                      disabled={children >= 15}
                      onClick={() => setChildren(prev => prev + 1)}
                      className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                  </div>
                </div>

                {/* Rooms */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Rooms / Vehicles</div>
                    <div className="text-xs text-slate-500">For booking capacity</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={rooms <= 1}
                      onClick={() => setRooms(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 text-sm">{rooms}</span>
                    <button
                      type="button"
                      disabled={rooms >= 10}
                      onClick={() => setRooms(prev => prev + 1)}
                      className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setGuestsPopoverOpen(false)}
                  className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* SECTION D: Search Action Button (Booking.com large blue/amber button) */}
          <div className="md:col-span-1 p-1.5 sm:p-2 flex items-center justify-center">
            <button
              type="submit"
              className="w-full h-full min-h-[46px] md:min-h-[50px] px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/30 cursor-pointer"
            >
              <Search className="w-5 h-5 text-slate-950 shrink-0 stroke-[2.5]" />
              <span className="md:hidden">Search Deals</span>
            </button>
          </div>

        </form>
      </div>

      {/* 3. Bottom Filter Bar / Trust & Quick Picks */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        
        {/* Quick Checkbox Options (Booking.com style) */}
        <div className="flex flex-wrap items-center gap-3 text-slate-200">
          <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-white transition">
            <input
              type="checkbox"
              checked={privateOnly}
              onChange={(e) => setPrivateOnly(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-600 cursor-pointer"
            />
            <span className="font-medium text-[11px] sm:text-xs">Private guided tours only</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-white transition">
            <input
              type="checkbox"
              checked={freeCancel}
              onChange={(e) => setFreeCancel(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-600 cursor-pointer"
            />
            <span className="font-medium text-[11px] sm:text-xs">Free cancellation</span>
          </label>
        </div>

        {/* Quick Search Chips */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium">Popular:</span>
          {QUICK_TAGS.slice(0, 3).map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickTagClick(tag)}
              className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 text-[10px] sm:text-[11px] font-medium border border-white/10 hover:border-amber-400/40 transition cursor-pointer"
            >
              {tag.label}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
