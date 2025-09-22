// src/features/reservations/MyReservationsTable.jsx
import React, { useMemo } from 'react';
import DataTable from '../../components/UI/DataTable.jsx';
import Button from '../../components/UI/Button.jsx';
import Badge from '../../components/UI/Badge.jsx';

export default function MyReservationsTable({
  items = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onCancel
}) {
  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const safeTotal = Number.isFinite(total) ? total : rows.length;

  const columns = [
    {
      key: 'reservationTime',
      header: 'Date',
      render: r => r?.reservationTime ? new Date(r.reservationTime).toLocaleDateString() : '—'
    },
    {
      key: 'time',
      header: 'Time',
      render: r => r?.reservationTime
        ? new Date(r.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '—'
    },
    { key: 'guests', header: 'Guests', render: r => r?.guests ?? '—' },
    {
      key: 'status',
      header: 'Status',
      render: r => {
        const st = r?.status || 'pending';
        const variant =
          st === 'confirmed' ? 'success' :
          st === 'completed' ? 'success' :
          st === 'cancelled' ? 'muted' : 'info';
        return <Badge variant={variant}>{st}</Badge>;
      }
    },
    { key: 'specialRequests', header: 'Notes', render: r => r?.specialRequests || '—' },
    {
      key: 'actions',
      header: 'Actions',
      render: r => (
        <div className="row" style={{ gap: 8 }}>
          {(r?.status === 'pending' || r?.status === 'confirmed') && (
            <Button variant="danger" onClick={() => onCancel?.(r?._id || r?.id)}>
              Cancel
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      page={page}
      pageSize={pageSize}
      total={safeTotal}
      onPageChange={onPageChange}
    />
  );
}