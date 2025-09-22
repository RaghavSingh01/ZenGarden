// Central route path constants to avoid typos across app

export const ROUTES = Object.freeze({
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // User
  ROOT: '/',
  USER_DASHBOARD: '/dashboard',
  MENU: '/menu',
  CART: '/cart',
  CHECKOUT: '/checkout',
  RESERVATIONS: '/reservations',
  RESERVATION_CREATE: '/reservations/create',
  ORDER_TRACKING: '/orders/:id',
  PROFILE: '/profile',

  // Chef
  CHEF_HOME: '/chef',
  CHEF_RESERVATIONS: '/chef/reservations',
  CHEF_INVENTORY: '/chef/inventory',

  // Admin
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_USERS: '/admin/users',
  ADMIN_RESERVATIONS: '/admin/reservations',
  ADMIN_INVENTORY: '/admin/inventory'
});

// Helper to build route with params, e.g. buildRoute(ROUTES.ORDER_TRACKING, { id: 123 })
export function buildRoute(pattern, params = {}) {
  return Object.entries(params).reduce((acc, [k, v]) => acc.replace(`:${k}`, encodeURIComponent(String(v))), pattern);
}