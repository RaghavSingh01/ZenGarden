import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function RevenueChart({
  title = 'Revenue (Daily)',
  points = [],   // [{ date: '2025-09-15', revenue: 1250 }, ...]
  color = '#2c5530',
  fill = true,
  height = 280,
  options = {}
}) {
  const labels = points.map(p => p.date);
  const values = points.map(p => p.revenue);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: values,
        borderColor: color,
        backgroundColor: fill ? `${color}22` : color,
        tension: 0.3,
        fill
      }
    ]
  }), [labels, values, color, fill]);

  const baseOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: !!title, text: title }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => `₹${v}` }
      }
    }
  }), [title]);

  return (
    <div className="zg-card">
      <div className="zg-card-body">
        <div style={{ height }}>
          <Line data={data} options={{ ...baseOptions, ...options }} />
        </div>
      </div>
    </div>
  );
}