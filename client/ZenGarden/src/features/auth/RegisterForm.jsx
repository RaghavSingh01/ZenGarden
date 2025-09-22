import React, { useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Select from '../../components/UI/Select.jsx';
import Button from '../../components/UI/Button.jsx';
import { register } from '../../services/authService.js';
import { useToast } from '../../hooks/useToast.js';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../config/roles.js';
import { ROUTES } from '../../config/routes.js';

export default function RegisterForm({ allowRoleChoice = false }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: ROLES.USER });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = { name: form.name, email: form.email, password: form.password };
      if (allowRoleChoice) payload.role = form.role;
      await register(payload);
      toast.show('Registration successful', 'success');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Registration failed');
      toast.show('Registration failed', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="zg-card" onSubmit={onSubmit} style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">Create account</h3>
        </div>

        <Input label="Name" name="name" value={form.name} onChange={onChange} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} required />

        {allowRoleChoice && (
          <Select
            label="Role"
            name="role"
            value={form.role}
            onChange={onChange}
            options={[
              { value: ROLES.USER, label: 'User' },
              { value: ROLES.CHEF, label: 'Chef' },
              { value: ROLES.ADMIN, label: 'Admin' }
            ]}
          />
        )}

        {error && <p className="zg-card-desc" style={{ color: 'var(--zg-color-danger)' }}>{error}</p>}

        <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Register'}
          </Button>
        </div>
      </div>
    </form>
  );
}