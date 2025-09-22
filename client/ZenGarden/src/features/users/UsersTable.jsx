// src/features/users/UsersTable.jsx
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/UI/DataTable.jsx';
import Input from '../../components/UI/Input.jsx';
import Select from '../../components/UI/Select.jsx';
import Button from '../../components/UI/Button.jsx';
import Badge from '../../components/UI/Badge.jsx';

const ROLE_OPTS = [
  { value: '', label: 'All roles' },
  { value: 'user', label: 'User' },
  { value: 'chef', label: 'Chef' },
  { value: 'admin', label: 'Admin' }
];

const STATUS_OPTS = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' }
];

export default function UsersTable({
  items = [],
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onFilter,
  onChangeRole,
  onChangeStatus,
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  // Ensure rows is always an array
  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const safeTotal = Number.isFinite(total) ? total : rows.length;

  // Debounced filter
  useEffect(() => {
    const id = setTimeout(() => onFilter?.({ search, role, status, page: 1 }), 300);
    return () => clearTimeout(id);
  }, [search, role, status, onFilter]);

  const columns = useMemo(() => ([
    { key: 'name', header: 'Name', render: r => r?.name || '—' },
    { key: 'email', header: 'Email', render: r => r?.email || '—' },
    {
      key: 'role',
      header: 'Role',
      render: r => {
        const roleLabel = r?.role || 'user';
        const variant = roleLabel === 'admin' ? 'accent' : roleLabel === 'chef' ? 'info' : 'success';
        return <Badge variant={variant}>{roleLabel}</Badge>;
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: r => {
        const st = r?.status || 'active';
        return <Badge variant={st === 'disabled' ? 'muted' : 'success'}>{st}</Badge>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: r => (
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={() => onEdit?.(r)}>Edit</Button>
          <Select
            name="role"
            value=""
            onChange={(e) => onChangeRole?.(r?._id || r?.id, e.target.value)}
            options={[{ value: '', label: 'Set role...' }, ...ROLE_OPTS.slice(1)]}
          />
          <Select
            name="status"
            value=""
            onChange={(e) => onChangeStatus?.(r?._id || r?.id, e.target.value)}
            options={[
              { value: '', label: 'Set status...' },
              { value: 'active', label: 'Activate' },
              { value: 'disabled', label: 'Disable' }
            ]}
          />
          <Button variant="danger" onClick={() => onDelete?.(r?._id || r?.id)}>Delete</Button>
        </div>
      )
    }
  ]), [onEdit, onChangeRole, onChangeStatus, onDelete]);

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
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={ROLE_OPTS}
        />
        <Select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={STATUS_OPTS}
        />
        <Button
          variant="outline"
          onClick={() => {
            setSearch('');
            setRole('');
            setStatus('');
            onFilter?.({ search: '', role: '', status: '', page: 1 });
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
        total={safeTotal}
        onPageChange={onPageChange}
      />
    </div>
  );
}