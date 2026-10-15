import React from 'react';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Legal Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">Terms & Conditions</h1>
        <p className="text-xs text-slate-500">Last Updated: October 2026 | WeCheaperTours Egypt</p>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Crucial Business Scope Clause:</span>
          <p className="mt-0.5 leading-relaxed">
            All services on this website—including car rentals, ferry crossings, vacation rentals, concierge requests, event planning, excursions, and Nile cruises—operate on an informational and enquiry basis. Submitting an enquiry does not constitute a confirmed booking.
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">1. Informational & Enquiry Nature of Services</h2>
          <p>
            WeCheaperTours provides detailed information, sample itineraries, indicative pricing, and direct enquiry channels. The website does not operate an automated instant booking engine or process credit card payments online.
          </p>
          <p>
            No travel service, vehicle rental, boat ticket, villa reservation, or tour booking is finalized until our operations team manually verifies availability, sends an agreed written quotation, and receives client confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">2. Excursions, Tours & Local Regulations</h2>
          <p>
            Historical monument sites, ancient tombs, and archaeological areas in Egypt are subject to opening hours, regulations, and ticketing rules set by the Egyptian Supreme Council of Antiquities. WeCheaperTours arranges certified Egyptologist guides and licensed tourist transport in strict compliance with local law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">3. Nile Cruises & Maritime Weather</h2>
          <p>
            River cruise itineraries and ferry crossings are subject to navigational lock operations (such as the Esna Lock), water levels, and port authority weather clearances. In rare events of navigation delays, equivalent ground sightseeing or itinerary adjustments are coordinated.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">4. Customer Responsibilities</h2>
          <p>
            Travelers are responsible for holding valid passports with at least 6 months validity from departure date, obtaining necessary Egypt entry visas (e-Visa or visa-on-arrival where eligible), and securing appropriate international travel insurance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">5. Changes & Cancellations</h2>
          <p>
            Because quotations are finalized individually with each traveler, specific deposit and cancellation terms are clearly detailed in your personalized quotation before any payment is collected.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
