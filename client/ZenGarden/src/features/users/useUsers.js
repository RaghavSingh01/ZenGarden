// src/features/users/useUsers.js
import { useCallback, useEffect, useState } from 'react';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  setUserRole,
  setUserStatus
} from '../../services/usersService.js';

export function useUsers(initial = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    status: '',
    ...initial
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (override = {}) => {
    setLoading(true);
    setError(null);
    try {
      const q = { ...query, ...override };
      const res = await listUsers(q);
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

  const create = useCallback(async (payload) => {
    const res = await createUser(payload);
    await load();
    return res;
  }, [load]);

  const update = useCallback(async (id, payload) => {
    const res = await updateUser(id, payload);
    await load();
    return res;
  }, [load]);

  const remove = useCallback(async (id) => {
    const res = await deleteUser(id);
    await load();
    return res;
  }, [load]);

  const changeRole = useCallback(async (id, role) => {
    const res = await setUserRole(id, role);
    await load();
    return res;
  }, [load]);

  const changeStatus = useCallback(async (id, status) => {
    const res = await setUserStatus(id, status);
    await load();
    return res;
  }, [load]);

  return {
    items, total, query, setQuery, loading, error,
    load, getUser, create, update, remove, changeRole, changeStatus
  };
}