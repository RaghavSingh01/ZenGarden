// src/features/users/UserForm.jsx
import React, { useEffect, useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Select from '../../components/UI/Select.jsx';
import Button from '../../components/UI/Button.jsx';

const ROLE_OPTS = [
  { value: 'user', label: 'User' },
  { value: 'chef', label: 'Chef' },
  { value: 'admin', label: 'Admin' }
];

const STATUS_OPTS = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' }
];

/**
 * Props:
 * - initial?: { name, email, role, status }
 * - mode: 'create' | 'edit'
 * - onSubmit: async (payload) => void
 * - onCancel: () => void
 * - allowRoleStatus?: boolean
 */
export default function UserForm({ initial, mode = 'create', onSubmit, onCancel, allowRoleStatus = true }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        email: initial.email || '',
        password: '',
        role: initial.role || 'user',
        status: initial.status || 'active'
      });
    }
  }, [initial]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Name is required');
    if (!form.email.trim()) return setError('Email is required');
    if (mode === 'create' && !form.password) return setError('Password is required');

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        ...(mode === 'create' ? { password: form.password } : {}),
        ...(allowRoleStatus ? { role: form.role, status: form.status } : {})
      };
      await onSubmit?.(payload);
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
          <h3 className="zg-card-title">{mode === 'edit' ? 'Edit User' : 'Create User'}</h3>
        </div>

        <Input label="Name" name="name" value={form.name} onChange={onChange} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
        {mode === 'create' && <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} required />}

        {allowRoleStatus && (
          <div className="row" style={{ gap: 12 }}>
            <Select label="Role" name="role" value={form.role} onChange={onChange} options={ROLE_OPTS} />
            <Select label="Status" name="status" value={form.status} onChange={onChange} options={STATUS_OPTS} />
          </div>
        )}

        {error && <p className="zg-card-desc" style={{ color: 'var(--zg-color-danger)' }}>{error}</p>}

        <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
          <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>
    </form>
  );
}