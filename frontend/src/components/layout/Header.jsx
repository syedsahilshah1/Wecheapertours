import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Menu, 
  X, 
  Compass, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Header = ({ onOpenEnquiry }) => {
  const { settings, getWhatsAppLink } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      {/* Top Bar */}
      <div className="bg-[#0b1d30] text-slate-200 text-xs py-2 px-4 sm:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Licensed Egypt Tour Operators
            </span>
            <a 
              href={`tel:${settings.phone}`} 
              className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              {settings.phone}
            </a>
            <a 
              href={`mailto:${settings.email}`} 
              className="hidden lg:flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              {settings.email}
            </a>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="hidden sm:inline-block bg-slate-800 px-2.5 py-0.5 rounded text-[11px] text-amber-300 font-medium border border-amber-500/20">
              Direct Local Prices in USD / EGP
            </span>
            <a 
              href={getWhatsAppLink('Hello WeCheaperTours, I would like to enquire about traveling in Egypt.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>
            <Link 
              to="/admin/login" 
              className="text-slate-400 hover:text-white transition-colors text-[11px] border-l border-slate-700 pl-3"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1 font-serif">
              <span>WeCheaper</span>
              <span className="text-amber-600">Tours</span>
            </div>
            <div className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">
              Egypt Travel & Experiences
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-amber-700 bg-amber-50 font-semibold'
                    : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onOpenEnquiry && onOpenEnquiry()}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-lg shadow-sm shadow-amber-600/30 hover:shadow-md transition-all cursor-pointer"
          >
            Request a Quote
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'text-amber-700 bg-amber-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
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
              className="w-full py-2.5 text-center text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg flex items-center justify-center gap-2"
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
