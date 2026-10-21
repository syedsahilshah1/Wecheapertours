import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Menu, 
  X, 
  Compass, 
  ShieldCheck
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Header = ({ onOpenEnquiry }) => {
  const { settings, getWhatsAppLink } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Track if page is scrolled
      setIsScrolled(currentScrollY > 20);

      // Always show near the very top of page
      if (currentScrollY <= 40) {
        setIsVisible(true);
      } else {
        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 8) {
          setIsVisible(false);
          setMobileMenuOpen(false);
        } else if (lastScrollY.current - currentScrollY > 8) {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Excursions', path: '/excursions' },
    { name: 'Nile Cruises', path: '/nile-cruises' },
    { name: 'Car Rentals', path: '/car-rentals' },
    { name: 'Ferry Crossings', path: '/ferry-crossings' },
    { name: 'Vacation Rentals', path: '/vacation-rentals' },
    { name: 'Concierge', path: '/concierge' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/50' 
          : 'bg-white/70 backdrop-blur-md shadow-xs border-b border-white/30'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-[#0b1d30]/95 backdrop-blur-md text-slate-200 text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5" />
              Licensed Egypt Tour Operators
            </span>
            <a 
              href={`tel:${settings.phone}`} 
              className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              {settings.phone}
            </a>
            <a 
              href={`mailto:${settings.email}`} 
              className="hidden lg:flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              {settings.email}
            </a>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="hidden sm:inline-block bg-slate-800/80 px-2.5 py-0.5 rounded text-[11px] text-amber-300 font-medium border border-amber-500/20 whitespace-nowrap">
              Direct Local Prices in USD / EGP
            </span>
            <a 
              href={getWhatsAppLink('Hello WeCheaperTours, I would like to enquire about traveling in Egypt.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>
            <Link 
              to="/admin/login" 
              className="text-slate-400 hover:text-white transition-colors text-[11px] border-l border-slate-700 pl-3 whitespace-nowrap"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 lg:gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1 font-serif whitespace-nowrap">
              <span>WeCheaper</span>
              <span className="text-amber-600">Tours</span>
            </div>
            <div className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 whitespace-nowrap">
              Egypt Travel & Experiences
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 shrink-0">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs 2xl:text-sm font-medium whitespace-nowrap inline-flex items-center transition-all duration-150 ${
                  isActive
                    ? 'text-amber-800 bg-amber-500/15 border border-amber-500/30 shadow-xs font-semibold backdrop-blur-xs'
                    : 'text-slate-700 hover:text-amber-600 hover:bg-slate-900/5'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenEnquiry && onOpenEnquiry()}
            className="px-3.5 2xl:px-4 py-2 text-xs 2xl:text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-lg shadow-sm shadow-amber-600/30 hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Request a Quote
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100/70"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap truncate ${
                    isActive
                      ? 'text-amber-800 bg-amber-500/15 font-bold border border-amber-500/20'
                      : 'text-slate-700 hover:bg-slate-100/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenEnquiry) onOpenEnquiry();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              Plan Your Trip / Request Quote
            </button>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-center text-sm font-semibold text-emerald-700 bg-emerald-50/80 border border-emerald-200 hover:bg-emerald-100 rounded-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
