import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const defaultColors = ['#2c5530', '#f4d03f', '#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function PieChart({
  title = 'Popular Dishes',
  labels = [],           // e.g., ['Salmon','Salad','Latte']
  values = [],           // e.g., [45, 38, 67]
  colors = defaultColors,
  height = 280,
  options = {}
}) {
  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 1
      }
    ]
  }), [labels, values, colors, title]);

  const baseOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: !!title, text: title },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed} orders`
        }
      }
    }
  }), [title]);

  return (
    <div style={{ height }}>
      <Pie data={data} options={{ ...baseOptions, ...options }} />
    </div>
  );
}