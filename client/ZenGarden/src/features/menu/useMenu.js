// src/features/menu/useMenu.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listMenu, getDish } from '../../services/menuService.js';
import { addItem as addToCartStore } from '../../store/cartStore.js'; // adjust relative path if needed

export const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'starter', label: 'Starter' },
  { value: 'main course', label: 'Main Course' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'beverage', label: 'Beverage' }
];

export function useMenu(initial = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    page: 1,
    limit: 12,
    category: '',
    isAvailable: true,
    search: '',
    sort: 'popular', // or '-createdAt'
    ...initial
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);

  const load = useCallback(async (override = {}) => {
    setLoading(true);
    setError(null);
    try {
      const q = { ...query, ...override };
      const res = await listMenu({
        page: q.page,
        limit: q.limit,
        category: q.category || undefined,
        isAvailable: q.isAvailable,
        search: q.search || undefined,
        sort: q.sort
      });
      const data = res?.data || res?.items || [];
      const meta = res?.meta || {};
      setItems(data);
      setTotal(meta.total || res?.total || data.length);
      setQuery(q);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { load(); }, [load]); // initial load

  const addToCart = useCallback((dish) => {
    if (!dish) return;
    addToCartStore({
      id: dish._id || dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image
    }, 1);
  }, []);

  const openDetails = useCallback(async (id) => {
    try {
      const res = await getDish(id);
      const dish = res?.data || res;
      setSelectedDish(dish);
    } catch (e) {
        console.warn('getDish failed', e);
      setSelectedDish(null);
    }
  }, []);

  const closeDetails = useCallback(() => setSelectedDish(null), []);

  const categories = useMemo(() => CATEGORIES, []);

  return {
    // state
    items, total, query, loading, error, selectedDish,
    // actions
    setQuery, load, addToCart, openDetails, closeDetails, categories
  };
}