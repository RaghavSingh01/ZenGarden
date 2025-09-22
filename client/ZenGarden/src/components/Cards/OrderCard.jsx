import React from 'react';

const statusColors = {
  placed: 'zg-badge-info',
  confirmed: 'zg-badge-info',
  preparing: 'zg-badge-warn',
  ready: 'zg-badge-success',
  delivered: 'zg-badge-success',
  cancelled: 'zg-badge-muted'
};

export default function OrderCard({
  id,
  orderNumber,
  items = [],
  total = 0,
  status = 'placed',
  orderTime,
  onTrack,
  onReorder
}) {
  const itemSummary = items
    .map((i) => `${i.name} ×${i.quantity}`)
    .join(', ');

  return (
    <div className="zg-card">
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">Order #{orderNumber || id}</h3>
          <span className={`zg-badge ${statusColors[status] || 'zg-badge-info'}`}>
            {status}
          </span>
        </div>

        <p className="zg-card-desc" title={itemSummary}>
          {itemSummary || 'No items'}
        </p>

        <div className="zg-card-meta">
          <span className="zg-chip">Total: ₹{total.toFixed(2)}</span>
          {orderTime && (
            <span className="zg-chip">
              Placed: {new Date(orderTime).toLocaleString()}
            </span>
          )}
        </div>

        <div className="zg-card-actions">
          <button
            className="zg-btn zg-btn-outline"
            onClick={() => onTrack?.(id)}
            aria-label={`Track order ${orderNumber || id}`}
          >
            Track
          </button>
          <button
            className="zg-btn zg-btn-primary"
            onClick={() => onReorder?.(id)}
            aria-label={`Reorder order ${orderNumber || id}`}
          >
            Reorder
          </button>
        </div>
      </div>
    </div>
  );
}