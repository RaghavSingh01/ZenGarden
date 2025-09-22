import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function LineChart({
  title = 'Revenue',
  labels = [],            // e.g., ['Mon','Tue',...]
  values = [],            // e.g., [1200, 1180, ...]
  color = '#2c5530',      // brand green
  fill = false,
  height = 260,
  options = {}
}) {
  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: color,
        backgroundColor: fill ? `${color}22` : color,
        tension: 0.3,
        fill
      }
    ]
  }), [labels, values, color, fill, title]);

  const baseOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: !!title, text: title }
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => `₹${v}` } }
    }
  }), [title]);

  return (
    <div style={{ height }}>
      <Line data={data} options={{ ...baseOptions, ...options }} />
    </div>
  );
}