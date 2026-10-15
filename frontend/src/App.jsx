import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ExcursionsPage from './pages/ExcursionsPage';
import ExcursionDetailPage from './pages/ExcursionDetailPage';
import NileCruisesPage from './pages/NileCruisesPage';
import CarRentalsPage from './pages/CarRentalsPage';
import FerryCrossingsPage from './pages/FerryCrossingsPage';
import VacationRentalsPage from './pages/VacationRentalsPage';
import ConciergePage from './pages/ConciergePage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardOverview from './pages/admin/AdminDashboardOverview';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminDestinationsPage from './pages/admin/AdminDestinationsPage';
import AdminToursPage from './pages/admin/AdminToursPage';
import AdminRentalsPage from './pages/admin/AdminRentalsPage';
import AdminConciergePage from './pages/admin/AdminConciergePage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            
            {/* Public Website Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="excursions" element={<ExcursionsPage />} />
              <Route path="excursions/:slug" element={<ExcursionDetailPage />} />
              <Route path="nile-cruises" element={<NileCruisesPage />} />
              <Route path="car-rentals" element={<CarRentalsPage />} />
              <Route path="ferry-crossings" element={<FerryCrossingsPage />} />
              <Route path="vacation-rentals" element={<VacationRentalsPage />} />
              <Route path="concierge" element={<ConciergePage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardOverview />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="destinations" element={<AdminDestinationsPage />} />
              <Route path="tours" element={<AdminToursPage />} />
              <Route path="rental-options" element={<AdminRentalsPage />} />
              <Route path="concierge" element={<AdminConciergePage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="media" element={<AdminMediaPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
