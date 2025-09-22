// src/features/inventory/InventoryForm.jsx
import React, { useEffect, useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Select from '../../components/UI/Select.jsx';
import Button from '../../components/UI/Button.jsx';

const UNIT_OPTIONS = [
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'liters', label: 'liters' },
  { value: 'ml', label: 'ml' },
  { value: 'pcs', label: 'pcs' }
];

/**
 * Props:
 * - initial?: { ingredient, quantity, unit, lowStockAlert }
 * - mode: 'create' | 'edit'
 * - onSubmit: async (payload) => void
 * - onCancel: () => void
 */
export default function InventoryForm({ initial, mode = 'create', onSubmit, onCancel }) {
  const [form, setForm] = useState({
    ingredient: '',
    quantity: 0,
    unit: 'kg',
    lowStockAlert: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        ingredient: initial.ingredient ?? '',
        quantity: Number(initial.quantity ?? 0),
        unit: initial.unit ?? 'kg',
        lowStockAlert: Number(initial.lowStockAlert ?? 5)
      });
    }
  }, [initial]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: ['quantity', 'lowStockAlert'].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (!form.ingredient.trim()) throw new Error('Ingredient is required');
      if (form.quantity < 0) throw new Error('Quantity cannot be negative');
      await onSubmit?.(form);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="zg-card" onSubmit={handleSubmit}>
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">{mode === 'edit' ? 'Edit Item' : 'New Item'}</h3>
        </div>

        <Input label="Ingredient" name="ingredient" value={form.ingredient} onChange={onChange} required />
        <div className="row" style={{ gap: 12 }}>
          <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={onChange} min={0} required />
          <Select label="Unit" name="unit" value={form.unit} onChange={onChange} options={UNIT_OPTIONS} />
          <Input label="Low Stock Alert" name="lowStockAlert" type="number" value={form.lowStockAlert} onChange={onChange} min={0} />
        </div>

        {error && <p className="zg-card-desc" style={{ color: 'var(--zg-color-danger)' }}>{error}</p>}

        <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
          <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>
    </form>
  );
}

