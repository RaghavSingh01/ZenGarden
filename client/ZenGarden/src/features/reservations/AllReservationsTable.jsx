// src/features/reservations/AllReservationsTable.jsx
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/UI/DataTable.jsx';
import Button from '../../components/UI/Button.jsx';
import Input from '../../components/UI/Input.jsx';
import Select from '../../components/UI/Select.jsx';
import Badge from '../../components/UI/Badge.jsx';

const STATUS_OPTS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' }
];

/**
  Props expected:
  - items: array (from useReservations normalized to data.reservations)
  - total: number (from data.pagination.total)
  - page: number
  - pageSize: number
  - onPageChange(page)
  - onConfirm(id)
  - onCancel(id)
  - onComplete(id)
  - onFilter({ search, status, page })
*/
export default function AllReservationsTable({
  items = [],
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onConfirm,
  onCancel,
  onComplete,
  onFilter
}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Debounced search filter
  useEffect(() => {
    const id = setTimeout(() => onFilter?.({ search, page: 1 }), 300);
    return () => clearTimeout(id);
  }, [search, onFilter]);

  // Immediate status filter
  useEffect(() => {
    onFilter?.({ status, page: 1 });
  }, [status, onFilter]);

  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const columns = useMemo(() => ([
    {
      key: 'user',
      header: 'Customer',
      render: r => r?.user?.name || r?.userName || '—'
    },
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
    {
      key: 'tableNumber',
      header: 'Table',
      render: r => r?.tableNumber ?? '—'
    },
    {
      key: 'guests',
      header: 'Guests',
      render: r => r?.guests ?? '—'
    },
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
    {
      key: 'actions',
      header: 'Actions',
      render: r => (
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          {r?.status === 'pending' && (
            <Button variant="primary" onClick={() => onConfirm?.(r?._id || r?.id)}>Confirm</Button>
          )}
          {(r?.status === 'pending' || r?.status === 'confirmed') && (
            <Button variant="danger" onClick={() => onCancel?.(r?._id || r?.id)}>Cancel</Button>
          )}
          {r?.status === 'confirmed' && (
            <Button variant="secondary" onClick={() => onComplete?.(r?._id || r?.id)}>Complete</Button>
          )}
        </div>
      )
    }
  ]), [onConfirm, onCancel, onComplete]);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Input
          name="search"
          placeholder="Search name/email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={STATUS_OPTS}
        />
        <Button variant="outline" onClick={() => onFilter?.({ search, status, page: 1 })}>
          Apply
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSearch('');
            setStatus('');
            onFilter?.({ search: '', status: '', page: 1 });
          }}
        >
          Reset
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        page={page}
        pageSize={pageSize}
        total={Number.isFinite(total) ? total : rows.length}
        onPageChange={onPageChange}
      />
    </div>
  );
}