import React from 'react';
import Badge from '../../components/UI/Badge.jsx';
import Spinner from '../../components/UI/Spinner.jsx';

function KPI({ label, value, hint, variant = 'accent' }) {
  return (
    <div className="zg-card" style={{ minWidth: 220 }}>
      <div className="zg-card-body">
        <div className="zg-card-header">
          <span className="zg-card-title">{label}</span>
          {hint ? <Badge variant={variant}>{hint}</Badge> : null}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--zg-color-text)' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function KPICards({ loading, kpis }) {
  if (loading) {
    return (
      <div className="row" style={{ gap: 12 }}>
        <Spinner /><Spinner /><Spinner /><Spinner />
      </div>
    );
  }
  const {
    totalRevenue = 0,
    avgOrderValue = 0,
    totalOrders = 0,
    repeatCustomerRate = 0
  } = kpis || {};

  return (
    <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
      <KPI label="Total Revenue" value={`₹${Number(totalRevenue).toLocaleString()}`} hint="7d" />
      <KPI label="Avg Order Value" value={`₹${Number(avgOrderValue).toFixed(2)}`} hint="AOV" variant="info" />
      <KPI label="Total Orders" value={Number(totalOrders).toLocaleString()} hint="Count" variant="success" />
      <KPI label="Repeat Rate" value={`${Number(repeatCustomerRate).toFixed(1)}%`} hint="Loyalty" variant="warn" />
    </div>
  );
}