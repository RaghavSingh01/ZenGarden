// src/pages/admin/AnalyticsPage.jsx
import React from 'react';
import KPICards from '../../features/analytics/KPICards.jsx';
import PopularDishesChart from '../../features/analytics/PopularDishesChart.jsx';
import RevenueChart from '../../features/analytics/RevenueChart.jsx';
import BarChart from '../../components/Charts/BarChart.jsx';
import { useAnalytics } from '../../features/analytics/useAnalytics.js';
import Spinner from '../../components/UI/Spinner.jsx';
import Button from '../../components/UI/Button.jsx';

export default function AnalyticsPage() {
  const {
    loading,
    error,
    reload,
    kpiTiles,
    charts // { popular, volume, revenue } each with { labels, values }
  } = useAnalytics();

  if (error) {
    return (
      <div className="stack" style={{ gap: 12 }}>
        <div className="zg-card">
          <div className="zg-card-body">
            <div className="zg-card-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="zg-card-title">Analytics Error</h3>
              <Button variant="outline" onClick={reload}>Retry</Button>
            </div>
            <p className="zg-card-desc">{String(error.message || error)}</p>
          </div>
        </div>
      </div>
    );
  }

  const hasRevenue = Array.isArray(charts?.revenue?.labels) && charts.revenue.labels.length > 0;
  const hasPopular = Array.isArray(charts?.popular?.labels) && charts.popular.labels.length > 0;
  const hasVolume  = Array.isArray(charts?.volume?.labels)  && charts.volume.labels.length > 0;

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Analytics Overview</h2>
        <Button variant="outline" onClick={reload}>
          {loading ? <Spinner /> : 'Refresh'}
        </Button>
      </div>

      {/* KPI Tiles */}
      <KPICards loading={loading} kpis={kpiTiles} />

      {/* Revenue */}
      <div className="zg-card">
        <div className="zg-card-body">
          {loading ? (
            <div className="center" style={{ height: 260 }}>
              <Spinner size={28} />
            </div>
          ) : hasRevenue ? (
            <RevenueChart
              points={charts.revenue.labels.map((d, i) => ({
                date: d,
                revenue: charts.revenue.values[i]
              }))}
            />
          ) : (
            <p className="zg-card-desc">No revenue data available.</p>
          )}
        </div>
      </div>

      {/* Popular + Volume */}
      <div className="row" style={{ gap: 16 }}>
        <div className="zg-card" style={{ flex: 1, minWidth: 320 }}>
          <div className="zg-card-body">
            {loading ? (
              <div className="center" style={{ height: 280 }}>
                <Spinner size={28} />
              </div>
            ) : hasPopular ? (
              <PopularDishesChart
                items={charts.popular.labels.map((name, i) => ({
                  name,
                  orders: charts.popular.values[i]
                }))}
              />
            ) : (
              <p className="zg-card-desc">No popular dishes data.</p>
            )}
          </div>
        </div>

        <div className="zg-card" style={{ flex: 1, minWidth: 320 }}>
          <div className="zg-card-body">
            {loading ? (
              <div className="center" style={{ height: 260 }}>
                <Spinner size={28} />
              </div>
            ) : hasVolume ? (
              <BarChart
                title="Orders per Day"
                labels={charts.volume.labels}
                values={charts.volume.values}
              />
            ) : (
              <p className="zg-card-desc">No order volume data.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}