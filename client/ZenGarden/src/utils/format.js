// src/utils/format.js

// Currency
export function formatINR(value, fraction = 0) {
  const n = Number(value);
  if (Number.isNaN(n)) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fraction
  }).format(n);
}

// Numbers
export function formatNumber(n, locale = 'en-IN') {
  const num = Number(n);
  if (Number.isNaN(num)) return '';
  return new Intl.NumberFormat(locale).format(num);
}

// Dates
export function formatDateISO(date) {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}
export function formatDateTimeLocal(date) {
  const d = new Date(date);
  return Number.isNaN(d.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
}
export function timeAgo(date) {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  if (Number.isNaN(diff)) return '';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Strings
export function truncate(str, max = 80) {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}
export function titleCase(str) {
  return (str || '')
    .toLowerCase()
    .split(' ')
    .map(s => (s ? s[0].toUpperCase() + s.slice(1) : ''))
    .join(' ');
}