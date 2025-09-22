// src/features/reservations/MyReservationsTable.jsx
import React from 'react';
import DataTable from '../../components/UI/DataTable.jsx';
import Button from '../../components/UI/Button.jsx';
import Badge from '../../components/UI/Badge.jsx';

export default function MyReservationsTable({ items = [], page = 1, pageSize = 10, total = 0, onPageChange, onCancel }) {
  const columns = [
    { key: 'date', header: 'Date', render: r => r.date ? new Date(r.date).toLocaleDateString() : '—' },
    { key: 'slot', header: 'Time' },
    { key: 'guests', header: 'Guests' },
    {
      key: 'status',
      header: 'Status',
      render: r => {
        const variant = r.status === 'confirmed' ? 'success' : r.status === 'cancelled' ? 'muted' : 'info';
        return <Badge variant={variant}>{r.status}</Badge>;
      }
    },
    { key: 'specialRequests', header: 'Notes', render: r => r.specialRequests || '—' },
    {
      key: 'actions',
      header: 'Actions',
      render: r => (
        <div className="row" style={{ gap: 8 }}>
          {(r.status === 'pending' || r.status === 'confirmed') && (
            <Button variant="danger" onClick={() => onCancel?.(r._id || r.id)}>Cancel</Button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
    />
  );
}