import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ShieldCheck, 
  MessageCircle, 
  ArrowLeft,
  Share2,
  Info
} from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { useSettings } from '../context/SettingsContext';
import EnquiryModal from '../components/common/EnquiryModal';

const ExcursionDetailPage = () => {
  const { slug } = useParams();
  const { getWhatsAppLink } = useSettings();

  const [tour, setTour] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    publicApi.getTourBySlug(slug)
      .then((res) => {
        if (res.data.success) {
          setTour(res.data.data);
          setActivePhoto(res.data.data.main_image);
          // Set page SEO title
          if (res.data.data.seo_title) {
            document.title = res.data.data.seo_title;
          }
        }
      })
      .catch(() => setError('Excursion not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading tour details...</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">Excursion Not Found</h2>
        <p className="text-sm text-slate-500">The requested tour itinerary may have been updated or moved.</p>
        <Link
          to="/excursions"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all excursions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link to="/excursions" className="hover:text-amber-600">Excursions</Link>
          <span>/</span>
          {tour.destination && (
            <>
              <Link to={`/excursions?dest=${tour.destination.slug}`} className="hover:text-amber-600">
                {tour.destination.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-800 font-medium truncate">{tour.title}</span>
        </div>
      </div>

      {/* Hero Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content - 2 Cols */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              {tour.destination && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-900 rounded-full text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {tour.destination.name}
                </div>
              )}
              
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif leading-tight">
                {tour.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 border-y border-slate-200 py-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <strong>Duration:</strong> {tour.duration || 'Full Day Experience'}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <strong>Tour Type:</strong> Private Guided Tour
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <strong>Availability:</strong> Daily Departure
                </span>
              </div>
            </div>

            {/* Interactive Image Gallery */}
            {(() => {
              const galleryPhotos = Array.from(new Set([
                tour.main_image,
                ...(Array.isArray(tour.images) ? tour.images : []),
                ...(Array.isArray(tour.gallery) ? tour.gallery : []),
                ...(Array.isArray(tour.destination?.gallery) ? tour.destination.gallery : []),
                'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80'
              ])).filter(Boolean).slice(0, 5);

              const currentDisplayPhoto = activePhoto || tour.main_image || galleryPhotos[0];

              return (
                <div className="space-y-3">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 h-[420px] bg-slate-900 group">
                    <img
                      key={currentDisplayPhoto}
                      src={currentDisplayPhoto}
                      alt={tour.title}
                      className="w-full h-full object-cover animate-fade-in transition-all duration-500"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full">
                        Photo {galleryPhotos.indexOf(currentDisplayPhoto) + 1} of {galleryPhotos.length}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {galleryPhotos.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {galleryPhotos.map((photo, pIdx) => {
                        const isCurrent = currentDisplayPhoto === photo;
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setActivePhoto(photo)}
                            className={`relative w-24 h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                              isCurrent
                                ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105'
                                : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={photo}
                              alt={`Thumbnail ${pIdx + 1}`}
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

            {/* Tour Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/80 space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Tour Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 font-serif">
                Full Itinerary & Overview
              </h3>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {tour.description || tour.summary}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  What Is Included
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {tour.inclusions && tour.inclusions.length > 0 ? (
                    tour.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li>• Private air-conditioned vehicle transfers</li>
                      <li>• Licensed Egyptologist tour guide</li>
                      <li>• Chilled bottled mineral water</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  What Is Not Included
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {tour.exclusions && tour.exclusions.length > 0 ? (
                    tour.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li>• Entrance tickets to interior chambers (optional)</li>
                      <li>• Personal dining and gratuities</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

          </div>

          {/* Sidebar Enquiry Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Starting Price</span>
                <div className="flex items-baseline gap-2 mt-1">
                  {tour.price_amount ? (
                    <>
                      <span className="text-3xl font-extrabold text-slate-900 font-serif">
                        ${tour.price_amount}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {tour.price_currency} / per person
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-amber-700">
                      Enquire for Custom Quote
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * Final quote based on party size and preferred inclusions.
                </p>
              </div>

              {/* Informational Disclaimer Box */}
              <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Free Quote Request:</strong> Submitting an enquiry does not charge you or claim an unconfirmed booking. Our team will verify guide availability and contact you.
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-600/30 transition-all cursor-pointer"
                >
                  Request Itinerary & Quote
                </button>

                <a
                  href={getWhatsAppLink(`Hello WeCheaperTours, I would like to enquire about: "${tour.title}"`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Ask Guide on WhatsApp
                </a>
              </div>

              {/* Trust Features */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Licensed private transport & driver</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Certified English-speaking Egyptologist</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Flexible hotel pickup & drop-off</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={{
          listing_id: tour.id,
          listing_title: tour.title,
          category_id: tour.category_id,
          destination_id: tour.destination_id,
          defaultMessage: `I am interested in "${tour.title}". Please send pricing and availability for our dates.`,
        }}
      />

    </div>
  );
};

export default ExcursionDetailPage;
