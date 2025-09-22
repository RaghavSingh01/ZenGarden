import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav/Navbar.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../config/routes.js';

export default function UserLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: ROUTES.MENU, label: 'menu', roles: ['user'] },
    { to: ROUTES.RESERVATIONS, label: 'reservations', roles: ['user'] },
    { to: ROUTES.CART, label: 'cart', roles: ['user'] },
    { to: ROUTES.PROFILE, label: 'profile', roles: ['user'] }
  ];

  return (
    <>
      <Navbar
        role={role || 'user'}
        user={user}
        links={links}
        onLogout={() => { logout(); navigate(ROUTES.LOGIN, { replace: true }); }}
      />
      <main className="container" style={{ padding: 16 }}>
        <Outlet />
      </main>
    </>
  );
}