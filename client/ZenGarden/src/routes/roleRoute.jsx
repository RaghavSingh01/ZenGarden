import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../config/routes.js';

export default function RoleRoute({ allow = [] }) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (allow.length && !allow.includes(role)) return <Navigate to={ROUTES.ROOT} replace />;

  return <Outlet />;
}