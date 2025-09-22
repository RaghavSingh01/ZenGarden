import React from 'react';
import KPICards from '../../features/analytics/KPICards.jsx';
import PopularDishesChart from '../../features/analytics/PopularDishesChart.jsx';
import RevenueChart from '../../features/analytics/RevenueChart.jsx';
import BarChart from '../../components/Charts/BarChart.jsx';
import { useAnalytics } from '../../features/analytics/useAnalytics.js';
import Spinner from '../../components/UI/Spinner.jsx';
import Button from '../../components/UI/Button.jsx';

export default function AnalyticsPage() {
  const { loading, error, reload, kpis, revenueSeries, popularSeries, volumeSeries } = useAnalytics({ popularLimit: 5 });

  if (error) {
    return (
      <div className="stack" style={{ gap: 12 }}>
        <div className="zg-card">
          <div className="zg-card-body">
            <div className="zg-card-header">
              <h3 className="zg-card-title">Analytics Error</h3>
              <Button variant="outline" onClick={reload}>Retry</Button>
            </div>
            <p className="zg-card-desc">{String(error.message || error)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Analytics Overview</h2>
        <Button variant="outline" onClick={reload}>{loading ? <Spinner /> : 'Refresh'}</Button>
      </div>

      <KPICards loading={loading} kpis={kpis} />

      <div className="zg-card">
        <div className="zg-card-body">
          {loading ? <div className="center" style={{ height: 260 }}><Spinner size={28} /></div>
            : <RevenueChart points={revenueSeries.labels.map((d, i) => ({ date: d, revenue: revenueSeries.values[i] }))} />}
        </div>
      </div>

      <div className="row" style={{ gap: 16 }}>
        <div className="zg-card" style={{ flex: 1, minWidth: 320 }}>
          <div className="zg-card-body">
            {loading ? <div className="center" style={{ height: 280 }}><Spinner size={28} /></div>
              : <PopularDishesChart items={popularSeries.labels.map((n, i) => ({ name: n, orders: popularSeries.values[i] }))} />}
          </div>
        </div>

        <div className="zg-card" style={{ flex: 1, minWidth: 320 }}>
          <div className="zg-card-body">
            {loading ? <div className="center" style={{ height: 260 }}><Spinner size={28} /></div>
              : <BarChart title="Orders per Day" labels={volumeSeries.labels} values={volumeSeries.values} />}
          </div>
        </div>
      </div>
    </div>
  );
}