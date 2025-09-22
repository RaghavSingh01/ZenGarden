// src/features/inventory/useInventory.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from '../../services/inventoryService.js';

const toArray = (val) =>
  Array.isArray(val) ? val
  : Array.isArray(val?.data) ? val.data
  : Array.isArray(val?.items) ? val.items
  : Array.isArray(val?.data?.items) ? val.data.items
  : [];

const getTotal = (res, data) =>
  Number(
    res?.meta?.total ??
    res?.total ??
    res?.data?.pagination?.total ??
    data.length ??
    0
  );

export function useInventory(initialQuery = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    page: 1,
    limit: 20,
    search: '',
    unit: '',
    lowOnly: false,
    ...initialQuery
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (override = {}) => {
    setLoading(true);
    setError(null);
    try {
      const q = { ...query, ...override };
      const res = await listInventory(q);
      const data = toArray(res);
      setItems(data);
      setTotal(getTotal(res, data));
      setQuery(q);
    } catch (e) {
      setError(e);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  const lowStockItems = useMemo(
    () => (items || []).filter(x =>
      typeof x?.lowStockAlert === 'number' &&
      Number(x?.quantity) <= Number(x?.lowStockAlert)
    ),
    [items]
  );

  const createItem = useCallback(async (payload) => {
    const res = await createInventoryItem(payload);
    await load();
    return res;
  }, [load]);

  const updateItem = useCallback(async (id, payload) => {
    const res = await updateInventoryItem(id, payload);
    await load();
    return res;
  }, [load]);

  const removeItem = useCallback(async (id) => {
    const res = await deleteInventoryItem(id);
    await load();
    return res;
  }, [load]);

  return {
    items,
    total,
    query,
    setQuery,
    loading,
    error,
    lowStockItems,
    load,
    createItem,
    updateItem,
    removeItem,
    getItem: getInventoryItem
  };
}