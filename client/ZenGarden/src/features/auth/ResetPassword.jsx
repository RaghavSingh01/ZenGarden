import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import { resetPassword } from '../../services/authService.js';
import { useToast } from '../../hooks/useToast.js';
import { ROUTES } from '../../config/routes.js';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await resetPassword(token, { password: form.password });
      toast.show('Password reset successful', 'success');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Reset failed');
      toast.show('Reset failed', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="zg-card" onSubmit={onSubmit} style={{ maxWidth: 420, margin: '0 auto' }}>
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">Reset Password</h3>
        </div>

        <Input label="New Password" name="password" type="password" value={form.password} onChange={onChange} required />
        <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} required />

        {error && <p className="zg-card-desc" style={{ color: 'var(--zg-color-danger)' }}>{error}</p>}

        <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </div>
    </form>
  );
}