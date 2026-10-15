import React, { createContext, useContext, useState, useEffect } from 'react';
import { publicApi } from '../services/publicApi';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    company_name: 'WeCheaperTours',
    tagline: 'Explore Egypt’s Wonders with Trusted Local Experts',
    whatsapp_number: '+201012345678',
    phone: '+20 10 1234 5678',
    email: 'info@wecheapertours.com',
    address: 'Tahrir Square, Downtown, Cairo, Egypt',
    facebook_url: 'https://facebook.com/wecheapertours',
    instagram_url: 'https://instagram.com/wecheapertours',
    currency: 'USD',
    enquiry_disclaimer: 'Important: Car rentals, ferry crossings, vacation rentals, concierge services, and event planning are informational and enquiry-based. Submitting an enquiry does not constitute a confirmed booking. Our travel coordinators confirm all details directly with you.',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getPublicSettings()
      .then((res) => {
        if (res.data.success && res.data.data) {
          setSettings((prev) => ({ ...prev, ...res.data.data }));
        }
      })
      .catch((err) => {
        console.warn('Could not load remote settings, using defaults', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getWhatsAppLink = (customMessage = '') => {
    const rawNumber = (settings.whatsapp_number || '+201012345678').replace(/[^0-9]/g, '');
    const message = customMessage || `Hello WeCheaperTours, I would like to enquire about your Egypt travel services.`;
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, getWhatsAppLink }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
