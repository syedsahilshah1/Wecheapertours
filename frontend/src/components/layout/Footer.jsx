import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  Heart,
  ArrowRight
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
  const { settings, getWhatsAppLink } = useSettings();

  const services = [
    { name: 'Excursions & Day Tours', path: '/excursions' },
    { name: 'Classic Nile Cruises', path: '/nile-cruises' },
    { name: 'Private Car Rentals', path: '/car-rentals' },
    { name: 'Ferry Crossings', path: '/ferry-crossings' },
    { name: 'Vacation Rentals', path: '/vacation-rentals' },
    { name: 'Personal Concierge', path: '/concierge' },
    { name: 'Event Planning', path: '/events' },
  ];

  const destinations = [
    { name: 'Cairo & Giza', path: '/excursions?dest=cairo-giza' },
    { name: 'Alexandria', path: '/excursions?dest=alexandria' },
    { name: 'Luxor', path: '/excursions?dest=luxor' },
    { name: 'Aswan & Abu Simbel', path: '/excursions?dest=aswan-abu-simbel' },
    { name: 'Sharm El-Sheikh', path: '/excursions?dest=sharm-el-sheikh' },
    { name: 'Hurghada & El Gouna', path: '/excursions?dest=hurghada' },
    { name: 'Marsa Alam', path: '/excursions?dest=marsa-alam' },
  ];

  return (
    <footer className="bg-[#0a1829] text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white font-serif">
                  WeCheaper<span className="text-amber-500">Tours</span>
                </span>
                <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
                  Authentic Egypt Experiences
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              WeCheaperTours connects curious travelers directly with licensed Egyptologists, vetted drivers, luxury Nile cruises, and boutique local concierge services across Egypt. No inflated commissions, transparent quotations.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with local team on WhatsApp
              </a>
            </div>
          </div>

          {/* Travel Services */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 font-serif">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 font-serif">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs">
              {destinations.map((dest) => (
                <li key={dest.name}>
                  <Link
                    to={dest.path}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 font-serif">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.address || 'Tahrir Square, Cairo, Egypt'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-amber-400 transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Egyptian Ministry of Tourism Compliant</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Business Rule Disclaimer Box */}
        <div className="my-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-amber-400/90 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Important Booking & Enquiry Notice:
          </p>
          <p>
            Car rentals, ferry crossings, vacation rentals, concierge services, and event planning operate on an informational and enquiry basis. Submitting an enquiry through this website does not constitute an instant or automatic booking confirmation. Every itinerary, vehicle model, departure schedule, and rental option is personally verified and confirmed by our local operations team prior to receipt of deposit.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-4">
          <p>© {new Date().getFullYear()} WeCheaperTours. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="hover:text-amber-400 transition-colors">Admin Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
