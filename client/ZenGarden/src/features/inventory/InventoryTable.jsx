// src/features/inventory/InventoryTable.jsx
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/UI/DataTable.jsx';
import Button from '../../components/UI/Button.jsx';
import Input from '../../components/UI/Input.jsx';
import Select from '../../components/UI/Select.jsx';
import Badge from '../../components/UI/Badge.jsx';

const UNIT_OPTIONS = [
  { value: '', label: 'All units' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'liters', label: 'liters' },
  { value: 'ml', label: 'ml' },
  { value: 'pcs', label: 'pcs' }
];

/**
  Props expected from parent:
  - items: array
  - total: number
  - page: number
  - pageSize: number
  - loading?: boolean
  - onPageChange(page)
  - onFilter(patch)  // { search, unit, lowOnly, page }
  - onEdit(row)
  - onDelete(id)
*/
export default function InventoryTable({
  items = [],
  total = 0,
  page = 1,
  pageSize = 20,
  loading = false,
  onPageChange,
  onFilter,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true
}) {
  const [search, setSearch] = useState('');
  const [unit, setUnit] = useState('');
  const [lowOnly, setLowOnly] = useState(false);

  // Debounced search
  useEffect(() => {
    const id = setTimeout(() => onFilter?.({ search, page: 1 }), 300);
    return () => clearTimeout(id);
  }, [search, onFilter]);

  // Immediate filters
  useEffect(() => { onFilter?.({ unit, page: 1 }); }, [unit, onFilter]);
  useEffect(() => { onFilter?.({ lowOnly, page: 1 }); }, [lowOnly, onFilter]);

  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const filteredRows = useMemo(() => {
    if (!lowOnly) return rows;
    return rows.filter(x =>
      typeof x?.lowStockAlert === 'number' &&
      Number(x?.quantity) <= Number(x?.lowStockAlert)
    );
  }, [rows, lowOnly]);

  const columns = useMemo(() => ([
    { key: 'ingredient', header: 'Ingredient', render: r => r?.ingredient || '—' },
    { key: 'quantity', header: 'Qty', render: r => <strong>{r?.quantity ?? '—'}</strong> },
    { key: 'unit', header: 'Unit', render: r => r?.unit || '—' },
    {
      key: 'lowStock',
      header: 'Status',
      render: r => {
        const low = typeof r?.lowStockAlert === 'number' && Number(r?.quantity) <= Number(r?.lowStockAlert);
        return low ? <Badge variant="warn">Low</Badge> : <Badge variant="success">OK</Badge>;
      }
    },
    {
      key: 'updatedBy',
      header: 'Updated by',
      render: r => r?.updatedBy?.name || '—'
    },
    {
      key: 'lastUpdated',
      header: 'Updated',
      render: r => r?.lastUpdated ? new Date(r.lastUpdated).toLocaleString() : '—'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: r => (
        <div className="row" style={{ gap: 8 }}>
          {canEdit && <Button variant="outline" onClick={() => onEdit?.(r)}>Edit</Button>}
          {canDelete && <Button variant="danger" onClick={() => onDelete?.(r?._id || r?.id)}>Delete</Button>}
        </div>
      )
    }
  ]), [onEdit, onDelete, canEdit, canDelete]);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Input
          name="search"
          placeholder="Search ingredient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select name="unit" value={unit} onChange={(e) => setUnit(e.target.value)} options={UNIT_OPTIONS} />
        <label className="row" style={{ gap: 6 }}>
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />
          Show low stock only
        </label>
        <Button variant="outline" onClick={() => onFilter?.({})} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredRows}
        page={page}
        pageSize={pageSize}
        total={Number.isFinite(total) ? total : filteredRows.length}
        onPageChange={onPageChange}
      />
    </div>
  );
}