import React from 'react';

const reservationStatusColors = {
  pending: 'zg-badge-info',
  confirmed: 'zg-badge-success',
  cancelled: 'zg-badge-muted',
  completed: 'zg-badge-success'
};

export default function ReservationCard({
  id,
  tableNumber,
  reservationTime,
  guests,
  status = 'pending',
  specialRequests,
  canCancel = true,
  canEdit = false,
  onCancel,
  onEdit,
  onView
}) {
  const timeLabel = reservationTime
    ? new Date(reservationTime).toLocaleString()
    : '—';

  return (
    <div className="zg-card">
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">
            Table {tableNumber ?? '—'}
          </h3>
          <span className={`zg-badge ${reservationStatusColors[status] || 'zg-badge-info'}`}>
            {status}
          </span>
        </div>

        <div className="zg-card-grid">
          <div className="zg-card-col">
            <span className="zg-label">When</span>
            <span className="zg-value">{timeLabel}</span>
          </div>
          <div className="zg-card-col">
            <span className="zg-label">Guests</span>
            <span className="zg-value">{guests ?? '—'}</span>
          </div>
        </div>

        {specialRequests && (
          <p className="zg-card-desc" title={specialRequests}>
            Special: {specialRequests}
          </p>
        )}

        <div className="zg-card-actions">
          <button
            className="zg-btn zg-btn-outline"
            onClick={() => onView?.(id)}
            aria-label={`View reservation ${id}`}
          >
            View
          </button>

          {canEdit && (
            <button
              className="zg-btn zg-btn-secondary"
              onClick={() => onEdit?.(id)}
              aria-label={`Edit reservation ${id}`}
            >
              Edit
            </button>
          )}

          {canCancel && (
            <button
              className="zg-btn zg-btn-danger"
              onClick={() => onCancel?.(id)}
              aria-label={`Cancel reservation ${id}`}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}