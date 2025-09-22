import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav/Navbar.jsx';
import Sidebar from '../components/Nav/Sidebar.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../config/routes.js';

export default function AdminLayout({ variant = 'admin' }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  // Top-level nav (kept minimal; most navigation via sidebar)
  const topLinks = [
    { to: variant === 'chef' ? ROUTES.CHEF_HOME : ROUTES.ADMIN_ANALYTICS, label: variant === 'chef' ? 'dashboard' : 'analytics', roles: [variant] }
  ];

  // Sidebar items vary by role (admin vs chef)
  const sideItems = variant === 'chef'
    ? [
        { to: ROUTES.CHEF_RESERVATIONS, label: 'reservations', icon: '📅', roles: ['chef'] },
        { to: ROUTES.CHEF_INVENTORY, label: 'inventory', icon: '📦', roles: ['chef'] }
      ]
    : [
        { to: ROUTES.ADMIN_ANALYTICS, label: 'analytics', icon: '📈', roles: ['admin'] },
        { to: ROUTES.ADMIN_USERS, label: 'users', icon: '👤', roles: ['admin'] },
        { to: ROUTES.ADMIN_RESERVATIONS, label: 'reservations', icon: '📅', roles: ['admin'] },
        { to: ROUTES.ADMIN_INVENTORY, label: 'inventory', icon: '📦', roles: ['admin'] }
      ];

  return (
    <>
      <Navbar
        role={role || (variant === 'chef' ? 'chef' : 'admin')}
        user={user}
        links={topLinks}
        onLogout={() => { logout(); navigate(ROUTES.LOGIN, { replace: true }); }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - var(--zg-navbar-height))' }}>
        <Sidebar items={sideItems} role={variant} header={variant === 'chef' ? 'Chef' : 'Admin'} />
        <main className="container" style={{ padding: 16 }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}