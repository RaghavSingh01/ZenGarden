// src/utils/validation.js

// Primitive validators return { valid: boolean, message?: string }
export const required = (msg = 'This field is required') => (v) =>
  v === undefined || v === null || v === '' ? { valid: false, message: msg } : { valid: true };

export const minLength = (min, msg = `Minimum ${min} characters`) => (v) =>
  (v || '').length < min ? { valid: false, message: msg } : { valid: true };

export const maxLength = (max, msg = `Maximum ${max} characters`) => (v) =>
  (v || '').length > max ? { valid: false, message: msg } : { valid: true };

export const isEmail = (msg = 'Invalid email') => (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '') ? { valid: true } : { valid: false, message: msg };

export const isNumber = (msg = 'Must be a number') => (v) =>
  Number.isFinite(Number(v)) ? { valid: true } : { valid: false, message: msg };

export const minValue = (min, msg = `Must be ≥ ${min}`) => (v) =>
  Number(v) < min ? { valid: false, message: msg } : { valid: true };

export const maxValue = (max, msg = `Must be ≤ ${max}`) => (v) =>
  Number(v) > max ? { valid: false, message: msg } : { valid: true };

export const oneOf = (arr, msg = 'Invalid value') => (v) =>
  arr.includes(v) ? { valid: true } : { valid: false, message: msg };

// Compose multiple validators for a single field
export function compose(...validators) {
  return (v) => {
    for (const fn of validators) {
      const res = fn(v);
      if (!res.valid) return res;
    }
    return { valid: true };
  };
}

// Validate a form object against rules: { field: validatorFn | [validatorFns...] }
export function validateForm(values, rules) {
  const errors = {};
  let valid = true;

  for (const key of Object.keys(rules || {})) {
    const fns = Array.isArray(rules[key]) ? rules[key] : [rules[key]];
    const combined = compose(...fns);
    const res = combined(values[key]);
    if (!res.valid) {
      valid = false;
      errors[key] = res.message;
    }
  }
  return { valid, errors };
}