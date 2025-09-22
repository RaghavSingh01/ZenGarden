import { useEffect, useState } from 'react';
import { subscribeAuth, getAuth, logout as storeLogout } from '../store/authStore.js';
import { ROLES } from '../config/roles.js';

export function useAuth() {
  const [auth, setAuth] = useState(getAuth());

  useEffect(() => {
    const unsub = subscribeAuth(setAuth);
    return () => unsub();
  }, []);

  const isAuthenticated = Boolean(auth?.token && auth?.user);
  const role = auth?.user?.role || null;

  const isAdmin = role === ROLES.ADMIN;
  const isChef = role === ROLES.CHEF;
  const isUser = role === ROLES.USER;

  const logout = () => storeLogout();

  return { auth, user: auth?.user || null, token: auth?.token || null, isAuthenticated, role, isAdmin, isChef, isUser, logout };
}