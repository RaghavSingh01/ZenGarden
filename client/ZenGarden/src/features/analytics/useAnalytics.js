// src/features/analytics/useAnalytics.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchKPIs,
  fetchPopularDishes,
  fetchOrderVolume,
  fetchDailyRevenue
} from '../../services/analyticsService.js';

export function useAnalytics() {
  const [kpis, setKpis] = useState(null);
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
        fetchKPIs(),
        fetchPopularDishes({ limit: 10 }),
        fetchOrderVolume({ range: '30d' }),
        fetchDailyRevenue({ range: '30d' })
      ]);

      setKpis(kpiRes?.data || kpiRes || null);
      setPopular(popRes?.data || popRes || []);
      setVolume(volRes?.data || volRes || []);
      setRevenue(revRes?.data || revRes || []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const charts = useMemo(() => {
    // Adapt raw arrays into chart.js-friendly data if needed by PopularDishesChart or others
    const popularLabels = (popular || []).map(d => d.name || d.label || '—');
    const popularValues = (popular || []).map(d => Number(d.count || d.orders || 0));

    const volumeLabels = (volume || []).map(d => d.date || d.label || '—');
    const volumeValues = (volume || []).map(d => Number(d.count || d.orders || 0));

    const revenueLabels = (revenue || []).map(d => d.date || d.label || '—');
    const revenueValues = (revenue || []).map(d => Number(d.amount || d.total || 0));

    return {
      popular: { labels: popularLabels, values: popularValues },
      volume: { labels: volumeLabels, values: volumeValues },
      revenue: { labels: revenueLabels, values: revenueValues }
    };
  }, [popular, volume, revenue]);

  return { kpis, popular, volume, revenue, charts, loading, error, reload: load };
}