import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function BarChart({
  title = 'Order Volume',
  labels = [],            // e.g., dates or categories
  values = [],            // counts per label
  color = '#2c5530',
  height = 260,
  options = {}
}) {
  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: `${color}AA`,
        borderColor: color,
        borderWidth: 1
      }
    ]
  }), [labels, values, color, title]);

  const baseOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: !!title, text: title }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }), [title]);

  return (
    <div style={{ height }}>
      <Bar data={data} options={{ ...baseOptions, ...options }} />
    </div>
  );
}