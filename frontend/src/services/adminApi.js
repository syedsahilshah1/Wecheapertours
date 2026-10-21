import apiClient from './apiClient';
import {
  mockServices,
  mockDestinations,
  mockTours,
  mockCruises,
  mockCars,
  mockVacationRentals,
  mockConcierge,
  mockEvents,
  mockEnquiries,
  mockSettings,
} from '../data/mockData';

const wrapData = (data) => ({
  data: {
    success: true,
    data,
  },
});

// Helper to get local enquiries
const getLocalEnquiries = () => {
  try {
    const local = JSON.parse(localStorage.getItem('wecheaper_enquiries') || '[]');
    return [...local, ...mockEnquiries];
  } catch (e) {
    return mockEnquiries;
  }
};

export const adminApi = {
  login: async (credentials) => {
    try {
      const res = await apiClient.post('/admin/login', credentials);
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend offline. Using offline admin login validation for Vercel.');
    }

    // Offline admin login credentials check
    if (
      credentials.email === 'admin@wecheapertours.com' &&
      credentials.password === 'admin123456'
    ) {
      return {
        data: {
          success: true,
          message: 'Admin login successful (Demo/Offline Mode)',
          data: {
            token: 'demo-admin-token-' + Date.now(),
            user: {
              id: 1,
              name: 'WeCheaperTours Admin',
              email: 'admin@wecheapertours.com',
              role: 'admin',
            },
          },
        },
      };
    }

    return {
      data: {
        success: false,
        message: 'Invalid credentials. Use admin@wecheapertours.com / admin123456',
      },
    };
  },

  logout: async () => {
    try {
      return await apiClient.post('/admin/logout');
    } catch (e) {
      return wrapData({ message: 'Logged out' });
    }
  },

  getMe: async () => {
    try {
      const res = await apiClient.get('/admin/me');
      if (res.data && res.data.success) return res;
    } catch (e) {
      // fallback
    }
    const saved = localStorage.getItem('admin_user');
    return wrapData(
      saved
        ? JSON.parse(saved)
        : { id: 1, name: 'WeCheaperTours Admin', email: 'admin@wecheapertours.com', role: 'admin' }
    );
  },

  getDashboardStats: async () => {
    try {
      const res = await apiClient.get('/admin/dashboard');
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.info('Backend offline. Computing stats from local data.');
    }

    const allEnquiries = getLocalEnquiries();
    const allListings = [
      ...mockTours,
      ...mockCruises,
      ...mockCars,
      ...mockVacationRentals,
      ...mockConcierge,
      ...mockEvents,
    ];

    return wrapData({
      total_enquiries: allEnquiries.length,
      new_enquiries: allEnquiries.filter((e) => e.status === 'new').length,
      in_progress_enquiries: allEnquiries.filter((e) => e.status === 'in_progress').length,
      resolved_enquiries: allEnquiries.filter((e) => e.status === 'resolved').length,
      published_listings: allListings.length,
      published_destinations: mockDestinations.length,
      recent_enquiries: allEnquiries.slice(0, 5),
    });
  },

  // Services
  getServices: async () => {
    try {
      const res = await apiClient.get('/admin/services');
      if (res.data && res.data.success) return res;
    } catch (e) {
      // fallback
    }
    return wrapData(mockServices);
  },

  getService: async (id) => {
    try {
      const res = await apiClient.get(`/admin/services/${id}`);
      if (res.data && res.data.success) return res;
    } catch (e) {}
    const s = mockServices.find((item) => item.id === Number(id));
    return wrapData(s || null);
  },

  createService: async (data) => wrapData({ id: Date.now(), ...data }),
  updateService: async (id, data) => wrapData({ id, ...data }),
  deleteService: async (id) => wrapData({ message: 'Deleted' }),

  // Destinations
  getDestinations: async () => {
    try {
      const res = await apiClient.get('/admin/destinations');
      if (res.data && res.data.success) return res;
    } catch (e) {}
    return wrapData(mockDestinations);
  },

  getDestination: async (id) => {
    try {
      const res = await apiClient.get(`/admin/destinations/${id}`);
      if (res.data && res.data.success) return res;
    } catch (e) {}
    const d = mockDestinations.find((item) => item.id === Number(id));
    return wrapData(d || null);
  },

  createDestination: async (data) => wrapData({ id: Date.now(), ...data }),
  updateDestination: async (id, data) => wrapData({ id, ...data }),
  deleteDestination: async (id) => wrapData({ message: 'Deleted' }),

  // Listings
  getListings: async (params = {}) => {
    try {
      const res = await apiClient.get('/admin/listings', { params });
      if (res.data && res.data.success) {
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data || []);
        return { ...res, data: { ...res.data, data: list } };
      }
    } catch (e) {}

    let all = [
      ...mockTours,
      ...mockCruises,
      ...mockCars,
      ...mockVacationRentals,
      ...mockConcierge,
      ...mockEvents,
    ];

    if (params.category_id) {
      all = all.filter((l) => l.category_id === Number(params.category_id));
    }
    if (params.category_slug) {
      all = all.filter((l) => l.category?.slug === params.category_slug);
    }
    return wrapData(all);
  },

  getListing: async (id) => {
    try {
      const res = await apiClient.get(`/admin/listings/${id}`);
      if (res.data && res.data.success) return res;
    } catch (e) {}
    const all = [
      ...mockTours,
      ...mockCruises,
      ...mockCars,
      ...mockVacationRentals,
      ...mockConcierge,
      ...mockEvents,
    ];
    return wrapData(all.find((l) => l.id === Number(id)) || null);
  },

  createListing: async (data) => wrapData({ id: Date.now(), ...data }),
  updateListing: async (id, data) => wrapData({ id, ...data }),
  deleteListing: async (id) => wrapData({ message: 'Deleted' }),

  // Enquiries
  getEnquiries: async (params = {}) => {
    try {
      const res = await apiClient.get('/admin/enquiries', { params });
      if (res.data && res.data.success) {
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data || []);
        return { ...res, data: { ...res.data, data: list } };
      }
    } catch (e) {}

    let all = getLocalEnquiries();
    if (params.status) {
      all = all.filter((e) => e.status === params.status);
    }
    return wrapData(all);
  },

  getEnquiry: async (id) => {
    try {
      const res = await apiClient.get(`/admin/enquiries/${id}`);
      if (res.data && res.data.success) return res;
    } catch (e) {}
    const all = getLocalEnquiries();
    return wrapData(all.find((e) => e.id === Number(id) || e.reference === id) || null);
  },

  updateEnquiry: async (id, data) => {
    try {
      const res = await apiClient.patch(`/admin/enquiries/${id}`, data);
      if (res.data && res.data.success) return res;
    } catch (e) {}
    return wrapData({ id, ...data });
  },

  addEnquiryNote: async (id, data) => wrapData({ id: Date.now(), enquiry_id: id, ...data }),
  deleteEnquiry: async (id) => wrapData({ message: 'Deleted' }),

  // Settings
  getSettings: async () => {
    try {
      const res = await apiClient.get('/admin/settings');
      if (res.data && res.data.success) return res;
    } catch (e) {}
    return wrapData(mockSettings);
  },

  updateSettings: async (data) => {
    try {
      const res = await apiClient.put('/admin/settings', { settings: data });
      if (res.data && res.data.success) return res;
    } catch (e) {}
    return wrapData(data);
  },

  // Media
  getMedia: async (page = 1) => {
    try {
      const res = await apiClient.get(`/admin/media?page=${page}`);
      if (res.data && res.data.success) {
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data || []);
        return { ...res, data: { ...res.data, data: list } };
      }
    } catch (e) {}
    return wrapData([
      { id: 1, file_path: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80', original_name: 'giza-pyramids.jpg', created_at: new Date().toISOString() },
      { id: 2, file_path: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80', original_name: 'nile-cruise.jpg', created_at: new Date().toISOString() },
      { id: 3, file_path: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', original_name: 'mercedes-e-class.jpg', created_at: new Date().toISOString() },
      { id: 4, file_path: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', original_name: 'el-gouna-villa.jpg', created_at: new Date().toISOString() },
    ]);
  },

  uploadMedia: async (formData) => wrapData({ message: 'Uploaded' }),
  deleteMedia: async (id) => wrapData({ message: 'Deleted' }),

  // Users (Multi-role support: Admin, Manager, Customer)
  getUsers: async () => {
    try {
      const res = await apiClient.get('/admin/users');
      if (res.data && res.data.success) {
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data || []);
        return { ...res, data: { ...res.data, data: list } };
      }
    } catch (e) {}

    // Load from localStorage or initialize with rich realistic sample users
    try {
      const stored = localStorage.getItem('wecheaper_admin_users');
      if (stored) {
        return wrapData(JSON.parse(stored));
      }
    } catch (e) {}

    const initialUsers = [
      {
        id: 1,
        name: 'WeCheaperTours Admin',
        email: 'admin@wecheapertours.com',
        role: 'admin',
        is_active: true,
        phone: '+20 10 1234 5678',
        created_at: '2026-01-15T10:00:00.000Z',
        orders_count: 0
      },
      {
        id: 2,
        name: 'Ahmed Mansoor',
        email: 'ahmed.operations@wecheapertours.com',
        role: 'manager',
        is_active: true,
        phone: '+20 10 9876 5432',
        created_at: '2026-02-01T12:30:00.000Z',
        orders_count: 0
      },
      {
        id: 3,
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@example.com',
        role: 'customer',
        is_active: true,
        phone: '+44 7700 900077',
        created_at: '2026-03-10T14:15:00.000Z',
        orders_count: 2
      },
      {
        id: 4,
        name: 'David Miller',
        email: 'david.miller@example.com',
        role: 'customer',
        is_active: true,
        phone: '+1 202 555 0192',
        created_at: '2026-03-18T09:45:00.000Z',
        orders_count: 1
      },
      {
        id: 5,
        name: 'Fatima El-Sayed',
        email: 'fatima.booking@wecheapertours.com',
        role: 'manager',
        is_active: true,
        phone: '+20 11 2345 6789',
        created_at: '2026-03-25T16:20:00.000Z',
        orders_count: 0
      }
    ];

    try {
      localStorage.setItem('wecheaper_admin_users', JSON.stringify(initialUsers));
    } catch (e) {}

    return wrapData(initialUsers);
  },

  createUser: async (userData) => {
    try {
      const res = await apiClient.post('/admin/users', userData);
      if (res.data && res.data.success) return res;
    } catch (e) {}

    let current = [];
    try {
      const stored = localStorage.getItem('wecheaper_admin_users');
      current = stored ? JSON.parse(stored) : [];
    } catch (e) {}

    const newUser = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      is_active: true,
      orders_count: userData.role === 'customer' ? 0 : undefined,
      ...userData
    };

    current.unshift(newUser);
    try {
      localStorage.setItem('wecheaper_admin_users', JSON.stringify(current));
    } catch (e) {}

    return wrapData(newUser);
  },

  updateUser: async (id, userData) => {
    try {
      const res = await apiClient.put(`/admin/users/${id}`, userData);
      if (res.data && res.data.success) return res;
    } catch (e) {}

    let current = [];
    try {
      const stored = localStorage.getItem('wecheaper_admin_users');
      current = stored ? JSON.parse(stored) : [];
      const idx = current.findIndex(u => u.id === Number(id));
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...userData };
        localStorage.setItem('wecheaper_admin_users', JSON.stringify(current));
        return wrapData(current[idx]);
      }
    } catch (e) {}

    return wrapData(userData);
  },

  deleteUser: async (id) => {
    try {
      const res = await apiClient.delete(`/admin/users/${id}`);
      if (res.data && res.data.success) return res;
    } catch (e) {}

    try {
      const stored = localStorage.getItem('wecheaper_admin_users');
      if (stored) {
        const filtered = JSON.parse(stored).filter(u => u.id !== Number(id));
        localStorage.setItem('wecheaper_admin_users', JSON.stringify(filtered));
      }
    } catch (e) {}

    return wrapData({ message: 'User deleted' });
  },
};

export default adminApi;
