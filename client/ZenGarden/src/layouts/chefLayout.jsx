import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav/Navbar.jsx';
import Sidebar from '../components/Nav/Sidebar.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../config/routes.js';

export default function ChefLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const topLinks = [
    { to: ROUTES.CHEF_HOME, label: 'dashboard', roles: ['chef'] }
  ];

  const sideItems = [
    { to: ROUTES.CHEF_HOME, label: 'dashboard', icon: '📊', roles: ['chef'] },
    { to: ROUTES.CHEF_RESERVATIONS, label: 'reservations', icon: '📅', roles: ['chef'] },
    { to: ROUTES.CHEF_INVENTORY, label: 'inventory', icon: '📦', roles: ['chef'] }
  ];

  return (
    <>
      <Navbar
        role={role || 'chef'}
        user={user}
        links={topLinks}
        onLogout={() => { logout(); navigate(ROUTES.LOGIN, { replace: true }); }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - var(--zg-navbar-height))' }}>
        <Sidebar items={sideItems} role="chef" header="Chef" />
        <main className="container" style={{ padding: 16 }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}