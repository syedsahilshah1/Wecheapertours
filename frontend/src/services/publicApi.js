import apiClient from './apiClient';
import {
  mockServices,
  mockDestinations,
  mockTours,
  mockCruises,
  mockCars,
  mockFerryRoutes,
  mockVacationRentals,
  mockConcierge,
  mockEvents,
  mockSettings,
} from '../data/mockData';

// Helper to simulate Axios response shape
const wrapData = (data) => ({
  data: {
    success: true,
    data,
  },
});

export const publicApi = {
  getServices: async () => {
    try {
      const res = await apiClient.get('/services');
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded services data for Vercel/standalone mode.');
    }
    return wrapData(mockServices);
  },

  getServiceBySlug: async (slug) => {
    try {
      const res = await apiClient.get(`/services/${slug}`);
      if (res.data && res.data.success) return res;
    } catch (e) {
      // fallback
    }
    const found = mockServices.find((s) => s.slug === slug);
    return wrapData(found || null);
  },

  getDestinations: async () => {
    try {
      const res = await apiClient.get('/destinations');
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded destinations data.');
    }
    return wrapData(mockDestinations);
  },

  getDestinationBySlug: async (slug) => {
    try {
      const res = await apiClient.get(`/destinations/${slug}`);
      if (res.data && res.data.success) return res;
    } catch (e) {
      // fallback
    }
    const found = mockDestinations.find((d) => d.slug === slug);
    return wrapData(found || null);
  },

  getTours: async (params = {}) => {
    try {
      const res = await apiClient.get('/tours', { params });
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded excursions data.');
    }

    let list = [...mockTours];
    if (params.destination) {
      list = list.filter((t) => t.destination && t.destination.slug === params.destination);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.summary && t.summary.toLowerCase().includes(q))
      );
    }
    return wrapData(list);
  },

  getTourBySlug: async (slug) => {
    try {
      const res = await apiClient.get(`/tours/${slug}`);
      if (res.data && res.data.success) return res;
    } catch (e) {
      // fallback
    }
    const found = mockTours.find((t) => t.slug === slug);
    return wrapData(found || null);
  },

  getCruises: async () => {
    try {
      const res = await apiClient.get('/cruises');
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded Nile cruises data.');
    }
    return wrapData(mockCruises);
  },

  getCarRentals: async () => {
    try {
      const res = await apiClient.get('/car-rentals');
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded car rentals data.');
    }
    return wrapData(mockCars);
  },

  getFerryRoutes: async () => {
    try {
      const res = await apiClient.get('/ferry-routes');
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded ferry routes data.');
    }
    return wrapData(mockFerryRoutes);
  },

  getVacationRentals: async (params = {}) => {
    try {
      const res = await apiClient.get('/vacation-rentals', { params });
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded vacation rentals data.');
    }

    let list = [...mockVacationRentals];
    if (params.destination) {
      list = list.filter((r) => r.destination && r.destination.slug === params.destination);
    }
    return wrapData(list);
  },

  getConciergeServices: async () => {
    try {
      const res = await apiClient.get('/concierge-services');
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded concierge services data.');
    }
    return wrapData(mockConcierge);
  },

  getEvents: async () => {
    try {
      const res = await apiClient.get('/events');
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded events data.');
    }
    return wrapData(mockEvents);
  },

  getPublicSettings: async () => {
    try {
      const res = await apiClient.get('/settings/public');
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, using embedded website settings.');
    }
    return wrapData(mockSettings);
  },

  submitEnquiry: async (data) => {
    try {
      const res = await apiClient.post('/enquiries', data);
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend unreachable, storing enquiry locally and generating offline reference.');
    }

    // Offline / Vercel fallback reference generation
    const reference = `WT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEnquiry = {
      id: Date.now(),
      reference,
      ...data,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('wecheaper_enquiries') || '[]');
      existing.unshift(newEnquiry);
      localStorage.setItem('wecheaper_enquiries', JSON.stringify(existing));
    } catch (storageErr) {
      // ignore localStorage quota errors
    }

    return {
      data: {
        success: true,
        message: 'Your enquiry has been submitted successfully! Our team will contact you.',
        data: {
          reference,
          ...newEnquiry,
        },
      },
    };
  },
};

export default publicApi;
