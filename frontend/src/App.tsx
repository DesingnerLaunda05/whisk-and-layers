import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BakeryLayout } from './components/layout/BakeryLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Customer & Public Pages
import { LandingPage } from './pages/customer/LandingPage';
import { BakeriesPage } from './pages/customer/BakeriesPage';
import { BakeryDetailPage } from './pages/customer/BakeryDetailPage';
import { CakesPage } from './pages/customer/CakesPage';
import { CakeDetailPage } from './pages/customer/CakeDetailPage';
import { CustomCakeBuilderPage } from './pages/customer/CustomCakeBuilderPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { HowItWorksPage } from './pages/customer/HowItWorksPage';
import { ProfilePage } from './pages/customer/ProfilePage';

// Bakery Pages
import { BakeryDashboardPage } from './pages/bakery/BakeryDashboardPage';
import { BakeryOrdersPage } from './pages/bakery/BakeryOrdersPage';
import { BakeryCakesPage } from './pages/bakery/BakeryCakesPage';
import { BakeryCakeEditPage } from './pages/bakery/BakeryCakeEditPage';
import { BakeryReviewsPage } from './pages/bakery/BakeryReviewsPage';
import { BakeryProfilePage } from './pages/bakery/BakeryProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBakeriesPage } from './pages/admin/AdminBakeriesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Protected Route Guard Helpers
const RequireAuth: React.FC<{ children: JSX.Element; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Authenticating session...</div>;
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public & Customer Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/bakeries" element={<BakeriesPage />} />
          <Route path="/bakeries/:idOrSlug" element={<BakeryDetailPage />} />
          <Route path="/cakes" element={<CakesPage />} />
          <Route path="/cakes/:idOrSlug" element={<CakeDetailPage />} />
          <Route path="/custom-builder" element={<CustomCakeBuilderPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer Authenticated Routes */}
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/order-confirmation/:id"
            element={
              <RequireAuth>
                <OrderConfirmationPage />
              </RequireAuth>
            }
          />
          <Route
            path="/my-orders"
            element={
              <RequireAuth>
                <MyOrdersPage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <RequireAuth>
                <OrderDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />

          {/* Bakery Owner Portal Routes */}
          <Route
            path="/bakery"
            element={
              <RequireAuth allowedRoles={['BAKERY']}>
                <BakeryLayout />
              </RequireAuth>
            }
          >
            <Route path="dashboard" element={<BakeryDashboardPage />} />
            <Route path="orders" element={<BakeryOrdersPage />} />
            <Route path="cakes" element={<BakeryCakesPage />} />
            <Route path="cakes/new" element={<BakeryCakeEditPage />} />
            <Route path="cakes/edit/:id" element={<BakeryCakeEditPage />} />
            <Route path="reviews" element={<BakeryReviewsPage />} />
            <Route path="profile" element={<BakeryProfilePage />} />
          </Route>

          {/* Admin Platform Console Routes */}
          <Route
            path="/admin"
            element={
              <RequireAuth allowedRoles={['ADMIN']}>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="bakeries" element={<AdminBakeriesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
