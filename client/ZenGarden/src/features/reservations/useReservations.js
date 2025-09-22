// src/features/reservations/useReservations.js
import { useCallback, useEffect, useState } from 'react';
import {
  listMyReservations,
  listAllReservations,
  createReservation,
  cancelReservation,
  getAvailableSlots
} from '../../services/reservationsService.js';

export function useReservations({ scope = 'mine', initial = {} } = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    date: '',
    status: '',
    search: '',
    ...initial
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (override = {}) => {
    setLoading(true);
    setError(null);
    try {
      const q = { ...query, ...override };
      const svc = scope === 'all' ? listAllReservations : listMyReservations;
      const res = await svc(q);
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
  }, [query, scope]);

  useEffect(() => { load(); }, [load]); // initial load

  const create = useCallback(async (payload) => {
    const res = await createReservation(payload);
    await load();
    return res;
  }, [load]);

  const cancel = useCallback(async (id) => {
    const res = await cancelReservation(id);
    await load();
    return res;
  }, [load]);

  const fetchSlots = useCallback(async (date) => {
    if (!date) return [];
    try {
      const res = await getAvailableSlots(date);
      return res?.data || res || [];
    } catch {
      return [];
    }
  }, []);

  return { items, total, query, setQuery, loading, error, load, create, cancel, fetchSlots };
}