import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass,
  Calendar as CalendarIcon, 
  User, 
  ChevronDown, 
  Plus, 
  Minus, 
  X,
  Search
} from 'lucide-react';

const POPULAR_DESTINATIONS = [
  { slug: 'cairo-giza', name: 'Cairo & Giza', desc: 'Pyramids, Sphinx, Museums' },
  { slug: 'luxor', name: 'Luxor', desc: 'Valley of the Kings, Karnak, Balloons' },
  { slug: 'aswan', name: 'Aswan', desc: 'Philae, Abu Simbel, Feluccas' },
  { slug: 'hurghada', name: 'Hurghada', desc: 'Red Sea, Diving, Desert Safari' },
  { slug: 'sharm-el-sheikh', name: 'Sharm El Sheikh', desc: 'Ras Mohammed, Sinai' },
  { slug: 'alexandria', name: 'Alexandria', desc: 'Mediterranean Coast, Citadel' },
  { slug: 'dahab', name: 'Dahab', desc: 'Blue Hole, Canyon' },
];

export default function HeroBookingFilter({ destinations = [] }) {
  const navigate = useNavigate();

  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState('');
  
  // Dates
  const today = new Date();
  const next3Days = new Date();
  next3Days.setDate(today.getDate() + 3);

  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(next3Days.toISOString().split('T')[0]);
  const [datesSelected, setDatesSelected] = useState(false);

  // Guests
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // Dropdowns
  const [destOpen, setDestOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  // Checkbox option
  const [freeCancel, setFreeCancel] = useState(false);

  // Refs
  const destRef = useRef(null);
  const datesRef = useRef(null);
  const guestsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (destRef.current && !destRef.current.contains(event.target)) setDestOpen(false);
      if (datesRef.current && !datesRef.current.contains(event.target)) setDatesOpen(false);
      if (guestsRef.current && !guestsRef.current.contains(event.target)) setGuestsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allDestinations = destinations.length > 0 ? destinations : POPULAR_DESTINATIONS;
  const filteredDests = allDestinations.filter(d => 
    d.name?.toLowerCase().includes(destinationQuery.toLowerCase()) ||
    (d.desc && d.desc.toLowerCase().includes(destinationQuery.toLowerCase()))
  );

  const formatShortDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleSelectDest = (dest) => {
    setDestinationQuery(dest.name);
    setSelectedDestinationSlug(dest.slug || '');
    setDestOpen(false);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();

    if (selectedDestinationSlug) {
      params.set('dest', selectedDestinationSlug);
      params.set('destination', selectedDestinationSlug);
    } else if (destinationQuery) {
      params.set('search', destinationQuery);
    }

    if (datesSelected && startDate) params.set('from', startDate);
    if (datesSelected && endDate) params.set('to', endDate);
    
    const totalGuests = adults + children;
    if (totalGuests > 1) params.set('guests', totalGuests.toString());
    if (rooms > 1) params.set('rooms', rooms.toString());
    if (freeCancel) params.set('freeCancel', 'true');

    navigate(`/excursions?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 z-30">
      
      {/* Booking.com style frame with site luxury amber gold */}
      <form 
        onSubmit={handleSearch}
        className="bg-amber-500 p-1 rounded-xl shadow-2xl flex flex-col lg:flex-row items-stretch gap-1"
      >

        {/* 1. Destination Box */}
        <div 
          ref={destRef} 
          className="relative flex-1 bg-white p-2 sm:p-2.5 rounded flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setDestOpen(true)}
        >
          <div className="text-amber-500 shrink-0">
            <Compass className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[11px] text-slate-500 font-normal leading-tight">
              Enter destination
            </div>
            <input
              type="text"
              value={destinationQuery}
              onChange={(e) => {
                setDestinationQuery(e.target.value);
                setSelectedDestinationSlug('');
                setDestOpen(true);
              }}
              onFocus={() => setDestOpen(true)}
              placeholder="Where are you going?"
              className="w-full text-slate-900 font-bold text-sm sm:text-[15px] placeholder-slate-700 bg-transparent border-0 outline-none p-0 truncate cursor-text"
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

          {/* Destination Dropdown */}
          {destOpen && (
            <div 
              className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-2xl border border-slate-200 py-2 z-50 max-h-64 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredDests.map((dest) => (
                <button
                  key={dest.slug || dest.id || dest.name}
                  type="button"
                  onClick={() => handleSelectDest(dest)}
                  className="w-full px-4 py-2 text-left hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{dest.name}</div>
                    {dest.desc && <div className="text-xs text-slate-500">{dest.desc}</div>}
                  </div>
                  <span className="text-[11px] text-slate-400">Egypt</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Select Dates Box */}
        <div 
          ref={datesRef} 
          className="relative flex-1 bg-white p-2 sm:p-2.5 rounded flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setDatesOpen(prev => !prev)}
        >
          <div className="text-amber-500 shrink-0">
            <CalendarIcon className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[11px] text-slate-500 font-normal leading-tight">
              Select dates
            </div>
            <div className="text-slate-900 font-bold text-sm sm:text-[15px] truncate">
              {datesSelected ? (
                `${formatShortDate(startDate)} — ${formatShortDate(endDate)}`
              ) : (
                <span className="font-semibold text-slate-800">Check-in date — Check-out date</span>
              )}
            </div>
          </div>

          {/* Dates Popover */}
          {datesOpen && (
            <div 
              className="absolute left-0 right-0 sm:left-auto sm:w-72 top-full mt-1.5 bg-white rounded-lg shadow-2xl border border-slate-200 p-3.5 z-50 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs font-bold text-slate-800 border-b pb-1.5">Select Travel Dates</div>
              <div className="grid grid-cols-2 gap-2 text-left">
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-1">Check-in</label>
                  <input
                    type="date"
                    min={today.toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDatesSelected(true);
                    }}
                    className="w-full text-xs p-1.5 border border-slate-300 rounded font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-1">Check-out</label>
                  <input
                    type="date"
                    min={startDate || today.toISOString().split('T')[0]}
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDatesSelected(true);
                    }}
                    className="w-full text-xs p-1.5 border border-slate-300 rounded font-semibold text-slate-800"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDatesSelected(true);
                  setDatesOpen(false);
                }}
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded text-xs font-bold transition"
              >
                Apply dates
              </button>
            </div>
          )}
        </div>

        {/* 3. Occupancy Box */}
        <div 
          ref={guestsRef} 
          className="relative flex-1 bg-white p-2 sm:p-2.5 rounded flex items-center justify-between gap-3 cursor-pointer select-none"
          onClick={() => setGuestsOpen(prev => !prev)}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="text-amber-500 shrink-0">
              <User className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[11px] text-slate-500 font-normal leading-tight">
                Select occupancy
              </div>
              <div className="text-slate-900 font-bold text-sm sm:text-[15px] truncate">
                {adults} adults · {children} children · {rooms} room
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />

          {/* Occupancy Counter Popover */}
          {guestsOpen && (
            <div 
              className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-lg shadow-2xl border border-slate-200 p-4 z-50 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Adults */}
              <div className="flex items-center justify-between text-left">
                <div>
                  <div className="text-sm font-bold text-slate-900">Adults</div>
                  <div className="text-[11px] text-slate-500">Age 18+</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded border border-amber-500 text-amber-700 flex items-center justify-center font-bold disabled:border-slate-300 disabled:text-slate-300 hover:bg-amber-50 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-4 text-center font-bold text-slate-900 text-sm">{adults}</span>
                  <button
                    type="button"
                    disabled={adults >= 20}
                    onClick={() => setAdults(prev => prev + 1)}
                    className="w-8 h-8 rounded border border-amber-500 text-amber-700 flex items-center justify-center font-bold disabled:border-slate-300 disabled:text-slate-300 hover:bg-amber-50 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between text-left pt-2 border-t border-slate-100">
                <div>
                  <div className="text-sm font-bold text-slate-900">Children</div>
                  <div className="text-[11px] text-slate-500">Age 0 – 17</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={children <= 0}
                    onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded border border-amber-500 text-amber-700 flex items-center justify-center font-bold disabled:border-slate-300 disabled:text-slate-300 hover:bg-amber-50 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-4 text-center font-bold text-slate-900 text-sm">{children}</span>
                  <button
                    type="button"
                    disabled={children >= 15}
                    onClick={() => setChildren(prev => prev + 1)}
                    className="w-8 h-8 rounded border border-amber-500 text-amber-700 flex items-center justify-center font-bold disabled:border-slate-300 disabled:text-slate-300 hover:bg-amber-50 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between text-left pt-2 border-t border-slate-100">
                <div>
                  <div className="text-sm font-bold text-slate-900">Rooms</div>
                  <div className="text-[11px] text-slate-500">Number of rooms</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={rooms <= 1}
                    onClick={() => setRooms(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded border border-amber-500 text-amber-700 flex items-center justify-center font-bold disabled:border-slate-300 disabled:text-slate-300 hover:bg-amber-50 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-4 text-center font-bold text-slate-900 text-sm">{rooms}</span>
                  <button
                    type="button"
                    disabled={rooms >= 10}
                    onClick={() => setRooms(prev => prev + 1)}
                    className="w-8 h-8 rounded border border-amber-500 text-amber-700 flex items-center justify-center font-bold disabled:border-slate-300 disabled:text-slate-300 hover:bg-amber-50 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGuestsOpen(false)}
                className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* 4. Luxury Gold Amber Search Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 active:scale-95 text-slate-950 font-extrabold text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded flex items-center justify-center gap-2 transition cursor-pointer select-none shadow-md shadow-amber-500/20"
        >
          <span>Search</span>
        </button>

      </form>

      {/* Simple Checkbox under the bar */}
      <div className="mt-1 text-left">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none text-slate-200 hover:text-white">
          <input
            type="checkbox"
            checked={freeCancel}
            onChange={(e) => setFreeCancel(e.target.checked)}
            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-white border-slate-300 cursor-pointer"
          />
          <span className="text-xs font-medium text-slate-200">
            I'm looking for tours with free cancellation
          </span>
        </label>
      </div>

    </div>
  );
}
