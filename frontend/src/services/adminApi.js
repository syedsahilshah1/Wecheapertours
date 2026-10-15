import apiClient from './apiClient';

export const adminApi = {
  login: (credentials) => apiClient.post('/admin/login', credentials),
  logout: () => apiClient.post('/admin/logout'),
  getMe: () => apiClient.get('/admin/me'),
  getDashboardStats: () => apiClient.get('/admin/dashboard'),

  // Services
  getServices: () => apiClient.get('/admin/services'),
  getService: (id) => apiClient.get(`/admin/services/${id}`),
  createService: (data) => apiClient.post('/admin/services', data),
  updateService: (id, data) => apiClient.put(`/admin/services/${id}`, data),
  deleteService: (id) => apiClient.delete(`/admin/services/${id}`),

  // Destinations
  getDestinations: () => apiClient.get('/admin/destinations'),
  getDestination: (id) => apiClient.get(`/admin/destinations/${id}`),
  createDestination: (data) => apiClient.post('/admin/destinations', data),
  updateDestination: (id, data) => apiClient.put(`/admin/destinations/${id}`, data),
  deleteDestination: (id) => apiClient.delete(`/admin/destinations/${id}`),

  // Listings (Tours, Cruises, Rentals, Ferry, Concierge, Events)
  getListings: (params) => apiClient.get('/admin/listings', { params }),
  getListing: (id) => apiClient.get(`/admin/listings/${id}`),
  createListing: (data) => apiClient.post('/admin/listings', data),
  updateListing: (id, data) => apiClient.put(`/admin/listings/${id}`, data),
  deleteListing: (id) => apiClient.delete(`/admin/listings/${id}`),

  // Enquiries
  getEnquiries: (params) => apiClient.get('/admin/enquiries', { params }),
  getEnquiry: (id) => apiClient.get(`/admin/enquiries/${id}`),
  updateEnquiry: (id, data) => apiClient.patch(`/admin/enquiries/${id}`, data),
  addEnquiryNote: (id, data) => apiClient.post(`/admin/enquiries/${id}/notes`, data),
  deleteEnquiry: (id) => apiClient.delete(`/admin/enquiries/${id}`),

  // Settings
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (data) => apiClient.put('/admin/settings', { settings: data }),

  // Media
  getMedia: (page = 1) => apiClient.get(`/admin/media?page=${page}`),
  uploadMedia: (formData) => apiClient.post('/admin/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteMedia: (id) => apiClient.delete(`/admin/media/${id}`),

  // Users
  getUsers: () => apiClient.get('/admin/users'),
};
