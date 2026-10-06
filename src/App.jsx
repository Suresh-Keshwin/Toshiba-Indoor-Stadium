import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import PublicLayout from './layouts/PublicLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'

import HomePage from './pages/public/HomePage'
import StadiumPage from './pages/public/StadiumPage'
import AvailabilityPage from './pages/public/AvailabilityPage'
import PricingPage from './pages/public/PricingPage'
import GalleryPage from './pages/public/GalleryPage'
import ContactPage from './pages/public/ContactPage'
import { BookPage, BookingSuccessPage } from './pages/public/BookingPages'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

import {
  DashboardPage,
  MyBookingsPage,
  BookingHistoryPage,
  NotificationsPage,
  ProfilePage,
} from './pages/customer/CustomerPages'

import {
  AdminDashboardPage,
  AdminCalendarPage,
  AdminBookingsPage,
  AdminCustomersPage,
  AdminAvailabilityPage,
  AdminPricingPage,
  AdminEventsPage,
  AdminAnnouncementsPage,
  AdminReviewsPage,
  AdminSettingsPage,
} from './pages/admin/AdminPages'

import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="stadium" element={<StadiumPage />} />
              <Route path="availability" element={<AvailabilityPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="book" element={<BookPage />} />
              <Route path="booking-success" element={<BookingSuccessPage />} />
            </Route>

            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="my-bookings" element={<MyBookingsPage />} />
              <Route path="booking-history" element={<BookingHistoryPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="calendar" element={<AdminCalendarPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="availability" element={<AdminAvailabilityPage />} />
              <Route path="pricing" element={<AdminPricingPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
