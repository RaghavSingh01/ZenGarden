// src/features/inventory/InventoryTable.jsx
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/UI/DataTable.jsx';
import Button from '../../components/UI/Button.jsx';
import Input from '../../components/UI/Input.jsx';
import Select from '../../components/UI/Select.jsx';
import Badge from '../../components/UI/Badge.jsx';
import Pagination from '../../components/UI/Pagination.jsx';
import { useInventory } from './useInventory.js';

const UNIT_OPTIONS = [
  { value: '', label: 'All units' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'liters', label: 'liters' },
  { value: 'ml', label: 'ml' },
  { value: 'pcs', label: 'pcs' }
];

export default function InventoryTable({ onEdit, canEdit = true, canDelete = true }) {
  const { items, total, query, setQuery, lowStockItems, removeItem, load } = useInventory();
  const [search, setSearch] = useState(query.search || '');
  const [unit, setUnit] = useState(query.unit || '');
  const [lowOnly, setLowOnly] = useState(query.lowOnly || false);

  useEffect(() => {
    const handler = setTimeout(() => setQuery(q => ({ ...q, page: 1, search })), 300);
    return () => clearTimeout(handler);
  }, [search, setQuery]);

  useEffect(() => {
    setQuery(q => ({ ...q, page: 1, unit }));
  }, [unit, setQuery]);

  useEffect(() => {
    setQuery(q => ({ ...q, page: 1, lowOnly }));
  }, [lowOnly, setQuery]);

  const filteredItems = useMemo(() => {
    if (!lowOnly) return items;
    return items.filter(x => typeof x.lowStockAlert === 'number' && Number(x.quantity) <= Number(x.lowStockAlert));
  }, [items, lowOnly]);

  const columns = [
    { key: 'ingredient', header: 'Ingredient' },
    { key: 'quantity', header: 'Qty', render: r => <strong>{r.quantity}</strong> },
    { key: 'unit', header: 'Unit' },
    {
      key: 'lowStock',
      header: 'Status',
      render: r => {
        const low = typeof r.lowStockAlert === 'number' && Number(r.quantity) <= Number(r.lowStockAlert);
        return low ? <Badge variant="warn">Low</Badge> : <Badge variant="success">OK</Badge>;
      }
    },
    { key: 'lastUpdated', header: 'Updated', render: r => r.lastUpdated ? new Date(r.lastUpdated).toLocaleString() : '—' },
    {
      key: 'actions',
      header: 'Actions',
      render: r => (
        <div className="row" style={{ gap: 8 }}>
          {canEdit && <Button variant="outline" onClick={() => onEdit?.(r)}>Edit</Button>}
          {canDelete && <Button variant="danger" onClick={() => removeItem(r._id || r.id)}>Delete</Button>}
        </div>
      )
    }
  ];

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Input name="search" placeholder="Search ingredient..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select name="unit" value={unit} onChange={(e) => setUnit(e.target.value)} options={UNIT_OPTIONS} />
        <label className="row" style={{ gap: 6 }}>
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />
          Show low stock only
        </label>
        <Button variant="outline" onClick={() => load()}>Refresh</Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        page={query.page}
        pageSize={query.limit}
        total={total}
        onPageChange={(p) => setQuery(q => ({ ...q, page: p }))}
      />

      <div className="muted">Low stock: {lowStockItems.length}</div>
    </div>
  );
}