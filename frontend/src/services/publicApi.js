import apiClient from './apiClient';

export const publicApi = {
  getServices: () => apiClient.get('/services'),
  getServiceBySlug: (slug) => apiClient.get(`/services/${slug}`),
  getDestinations: () => apiClient.get('/destinations'),
  getDestinationBySlug: (slug) => apiClient.get(`/destinations/${slug}`),
  getTours: (params) => apiClient.get('/tours', { params }),
  getTourBySlug: (slug) => apiClient.get(`/tours/${slug}`),
  getCruises: () => apiClient.get('/cruises'),
  getCarRentals: () => apiClient.get('/car-rentals'),
  getFerryRoutes: () => apiClient.get('/ferry-routes'),
  getVacationRentals: (params) => apiClient.get('/vacation-rentals', { params }),
  getConciergeServices: () => apiClient.get('/concierge-services'),
  getEvents: () => apiClient.get('/events'),
  getPublicSettings: () => apiClient.get('/settings/public'),
  submitEnquiry: (data) => apiClient.post('/enquiries', data),
};
