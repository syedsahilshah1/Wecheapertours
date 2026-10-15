import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Legal Information</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: October 2026 | WeCheaperTours Egypt</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">1. Overview</h2>
          <p>
            WeCheaperTours ("we", "us", "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, store, and utilize data when you browse our travel website and submit consultation enquiries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">2. Information We Collect</h2>
          <p>
            We only collect personal information that you voluntarily submit through our contact and service enquiry forms, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your full name and contact information (email address and WhatsApp / phone number).</li>
            <li>Travel preferences (dates of travel, preferred destinations, party size, and vehicle preferences).</li>
            <li>Custom notes and requests for tours, concierge services, or event planning.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">3. How We Use Your Information</h2>
          <p>
            Submitted information is strictly utilized to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Review and respond to your travel enquiries with accurate quotations and availability.</li>
            <li>Coordinate with licensed Egyptologist guides, vetted chauffeurs, and cruise operators on your behalf.</li>
            <li>Deliver responsive customer care via WhatsApp or email during your stay in Egypt.</li>
          </ul>
          <p>
            We never sell, rent, or trade your personal information to third-party advertisers or external marketing networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">4. Data Security & Storage</h2>
          <p>
            Enquiry data is stored securely in our protected database behind tokenized backend access controls. We apply industry-standard measures to prevent unauthorized data loss, tampering, or disclosure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">5. Contact Us Regarding Your Data</h2>
          <p>
            If you wish to update or delete any enquiry information previously submitted, please contact us at <a href="mailto:info@wecheapertours.com" className="text-amber-700 font-semibold underline">info@wecheapertours.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
