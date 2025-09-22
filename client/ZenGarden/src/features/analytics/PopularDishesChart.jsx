import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const defaultColors = ['#2c5530', '#f4d03f', '#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function PopularDishesChart({
  title = 'Most Sold Dishes',
  items = [], // [{ name, orders }]
  colors = defaultColors,
  height = 300,
  options = {}
}) {
  const labels = items.map(d => d.name);
  const values = items.map(d => d.orders);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Orders',
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 1
      }
    ]
  }), [labels, values, colors]);

  const baseOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: !!title, text: title },
      tooltip: {
        callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed} orders` }
      }
    }
  }), [title]);

  return (
    <div className="zg-card" style={{ minWidth: 320 }}>
      <div className="zg-card-body">
        <div style={{ height }}>
          <Pie data={data} options={{ ...baseOptions, ...options }} />
        </div>
      </div>
    </div>
  );
}