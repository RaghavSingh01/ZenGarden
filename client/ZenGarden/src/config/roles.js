// Role constants and helpers

export const ROLES = Object.freeze({
  USER: 'user',
  CHEF: 'chef',
  ADMIN: 'admin'
});

// Guards
export const canUser = (role) => role === ROLES.USER;
export const canChef = (role) => role === ROLES.CHEF;
export const canAdmin = (role) => role === ROLES.ADMIN;

// Composite checks
export const isStaff = (role) => role === ROLES.CHEF || role === ROLES.ADMIN;

// Authorization helper: returns true if role is in allowed list
export const authorize = (role, allowed = []) => allowed.includes(role);