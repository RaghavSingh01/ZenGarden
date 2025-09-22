// src/features/analytics/useAnalytics.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchKPIs,
  fetchPopularDishes,
  fetchOrderVolume,
  fetchDailyRevenue
} from '../../services/analyticsService.js';

// Helper to safely run a promise and fallback on failure
const safe = async (promise, fallback) => {
  try {
    const res = await promise;
    return res;
  } catch {
    return fallback;
  }
};

// Normalize helpers
const asArray = (val) => {
  if (Array.isArray(val)) return val;
  if (Array.isArray(val?.data)) return val.data;
  if (val && typeof val === 'object' && Array.isArray(val.items)) return val.items;
  return [];
};

const asObject = (val) => {
  if (val && typeof val === 'object' && !Array.isArray(val)) return val;
  if (val && typeof val?.data === 'object' && !Array.isArray(val.data)) return val.data;
  return {};
};

export function useAnalytics() {
  const [kpis, setKpis] = useState({});
  const [popular, setPopular] = useState([]);
  const [volume, setVolume] = useState([]);
  const [revenue, setRevenue] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiRes, popRes, volRes, revRes] = await Promise.all([
        safe(fetchKPIs(), {}),
        safe(fetchPopularDishes({ limit: 10 }), []),
        safe(fetchOrderVolume({ range: '30d' }), []),
        safe(fetchDailyRevenue({ range: '30d' }), [])
      ]);

      setKpis(asObject(kpiRes));
      setPopular(asArray(popRes));
      setVolume(asArray(volRes));
      setRevenue(asArray(revRes));
    } catch (e) {
      setError(e);
      setKpis({});
      setPopular([]);
      setVolume([]);
      setRevenue([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Precomputed series for charts
  const charts = useMemo(() => {
    const popularLabels = popular.map(d => d.name ?? d.label ?? '—');
    const popularValues = popular.map(d => Number(d.count ?? d.orders ?? 0));

    const volumeLabels = volume.map(d => d.date ?? d.label ?? '—');
    const volumeValues = volume.map(d => Number(d.count ?? d.orders ?? 0));

    const revenueLabels = revenue.map(d => d.date ?? d.label ?? '—');
    const revenueValues = revenue.map(d => Number(d.amount ?? d.total ?? 0));

    return {
      popular: { labels: popularLabels, values: popularValues },
      volume: { labels: volumeLabels, values: volumeValues },
      revenue: { labels: revenueLabels, values: revenueValues }
    };
  }, [popular, volume, revenue]);

  // Basic table-ready data for popular dishes (id/name/count)
  const popularTable = useMemo(() => {
    return popular.map((d, i) => ({
      id: d.id ?? d._id ?? i,
      name: d.name ?? d.label ?? '—',
      orders: Number(d.count ?? d.orders ?? 0),
      revenue: Number(d.revenue ?? 0)
    }));
  }, [popular]);

  // Basic tiles for KPIs with safe defaults
  const kpiTiles = useMemo(() => {
    const k = asObject(kpis);
    return {
      orders: Number(k.orders ?? k.totalOrders ?? 0),
      revenue: Number(k.revenue ?? k.totalRevenue ?? 0),
      customers: Number(k.customers ?? k.totalCustomers ?? 0),
      avgOrderValue: Number(k.avgOrderValue ?? k.aov ?? 0)
    };
  }, [kpis]);

  return {
    kpis,
    popular,
    volume,
    revenue,
    charts,
    popularTable,
    kpiTiles,
    loading,
    error,
    reload: load
  };
}