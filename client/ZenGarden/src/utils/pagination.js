// src/utils/pagination.js

export function totalPages(total, pageSize) {
  return Math.max(1, Math.ceil(Number(total || 0) / Math.max(1, Number(pageSize || 1))));
}

export function clampPage(page, totalPagesNum) {
  const p = Math.max(1, Number(page || 1));
  return Math.min(p, Math.max(1, Number(totalPagesNum || 1)));
}

export function toOffset(page, limit) {
  const p = Math.max(1, Number(page || 1));
  const l = Math.max(1, Number(limit || 1));
  return (p - 1) * l;
}

export function buildPageArray(current, total, siblingCount = 1, boundaryCount = 1) {
  // Generates arrays like: [1, '…', 5, 6, 7, '…', 20]
  const pages = [];
  const start = Math.max(2, current - siblingCount);
  const end = Math.min(total - 1, current + siblingCount);

  pages.push(1);
  if (start > boundaryCount + 1) pages.push('…');

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < total - boundaryCount) pages.push('…');
  if (total > 1) pages.push(total);

  return Array.from(new Set(pages.filter(Boolean)));
}

export function applyServerParams({ page = 1, limit = 10, search, sort, extra = {} }) {
  // Standardize query params for services: page/limit/search/sort + extras
  const params = { page, limit, ...extra };
  if (search) params.search = search;
  if (sort) params.sort = sort;
  return params;
}