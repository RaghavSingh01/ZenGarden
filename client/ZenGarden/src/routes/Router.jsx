import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthLayout from '../layouts/authLayout.jsx';
import UserLayout from '../layouts/userLayout.jsx';
import AdminLayout from '../layouts/adminLayout.jsx';
import ChefLayout from '../layouts/chefLayout.jsx';

import ProtectedRoute from './protectedRoute.jsx';
import RoleRoute from './roleRoute.jsx';

import { ROUTES } from '../config/routes.js';
import { ROLES } from '../config/roles.js';

// Auth pages
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';

// User pages
import DashboardPage from '../pages/user/DashboardPage.jsx';
import MenuPage from '../pages/user/MenuPage.jsx';
import CartPage from '../pages/user/CartPage.jsx';
import CheckoutPage from '../pages/user/CheckoutPage.jsx';
import ReservationsPage from '../pages/user/ReservationsPage.jsx';
import ReservationCreatePage from '../pages/user/ReservationCreatePage.jsx';
import OrderTrackingPage from '../pages/user/OrderTrackingPage.jsx';
import ProfilePage from '../pages/user/ProfilePage.jsx';

// Admin pages
import AnalyticsPage from '../pages/admin/AnalyticsPage.jsx';
import UsersPage from '../pages/admin/UsersPage.jsx';
import AdminReservationsPage from '../pages/admin/ReservationsPage.jsx';
import AdminInventoryPage from '../pages/admin/InventoryPage.jsx';

// Chef pages
import ChefDashboardPage from '../pages/chef/DashboardPage.jsx';
import ChefReservationsPage from '../pages/chef/ReservationsPage.jsx';
import ChefInventoryPage from '../pages/chef/InventoryPage.jsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public/Auth */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        {/* User */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path={ROUTES.ROOT} element={<MenuPage />} />
            <Route path={ROUTES.USER_DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.MENU} element={<MenuPage />} />
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
            <Route path={ROUTES.RESERVATIONS} element={<ReservationsPage />} />
            <Route path={ROUTES.RESERVATION_CREATE} element={<ReservationCreatePage />} />
            <Route path={ROUTES.ORDER_TRACKING} element={<OrderTrackingPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allow={[ROLES.ADMIN]} />}>
            <Route element={<AdminLayout />}>
              <Route path={ROUTES.ADMIN_ANALYTICS} element={<AnalyticsPage />} />
              <Route path={ROUTES.ADMIN_USERS} element={<UsersPage />} />
              <Route path={ROUTES.ADMIN_RESERVATIONS} element={<AdminReservationsPage />} />
              <Route path={ROUTES.ADMIN_INVENTORY} element={<AdminInventoryPage />} />
            </Route>
          </Route>
        </Route>

        {/* Chef */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allow={[ROLES.CHEF]} />}>
            <Route element={<ChefLayout />}>
              <Route path={ROUTES.CHEF_HOME} element={<ChefDashboardPage />} />
              <Route path={ROUTES.CHEF_RESERVATIONS} element={<ChefReservationsPage />} />
              <Route path={ROUTES.CHEF_INVENTORY} element={<ChefInventoryPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="*" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}