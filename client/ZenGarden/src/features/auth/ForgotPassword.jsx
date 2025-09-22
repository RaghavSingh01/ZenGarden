import React, { useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import { forgotPassword } from '../../services/authService.js';
import { useToast } from '../../hooks/useToast.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await forgotPassword({ email });
      toast.show('Reset link sent if the email exists', 'success');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to send reset link');
      toast.show('Failed to send reset link', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="zg-card" onSubmit={onSubmit} style={{ maxWidth: 420, margin: '0 auto' }}>
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">Forgot Password</h3>
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p className="zg-card-desc" style={{ color: 'var(--zg-color-danger)' }}>{error}</p>}

        <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </div>
      </div>
    </form>
  );
}