// src/features/reservations/AllReservationsTable.jsx
import React, { useState } from 'react';
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

export default function AllReservationsTable({ items = [], total = 0, page = 1, pageSize = 10, onPageChange, onConfirm, onCancel, onComplete, onFilter }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const columns = [
    { key: 'user', header: 'Customer', render: r => r.user?.name || r.userName || '—' },
    { key: 'date', header: 'Date', render: r => r.date ? new Date(r.date).toLocaleDateString() : '—' },
    { key: 'slot', header: 'Time' },
    { key: 'guests', header: 'Guests' },
    {
      key: 'status',
      header: 'Status',
      render: r => {
        const variant = r.status === 'confirmed' ? 'success' : r.status === 'cancelled' ? 'muted' : r.status === 'completed' ? 'success' : 'info';
        return <Badge variant={variant}>{r.status}</Badge>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: r => (
        <div className="row" style={{ gap: 8 }}>
          {r.status === 'pending' && <Button variant="primary" onClick={() => onConfirm?.(r._id || r.id)}>Confirm</Button>}
          {(r.status === 'pending' || r.status === 'confirmed') && <Button variant="danger" onClick={() => onCancel?.(r._id || r.id)}>Cancel</Button>}
          {r.status === 'confirmed' && <Button variant="secondary" onClick={() => onComplete?.(r._id || r.id)}>Complete</Button>}
        </div>
      )
    }
  ];

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Input name="search" placeholder="Search name/email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select name="status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTS} />
        <Button variant="outline" onClick={() => onFilter?.({ search, status, page: 1 })}>Filter</Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  );
}