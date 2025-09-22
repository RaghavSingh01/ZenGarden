import React, { useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import { login } from '../../services/authService.js';
import { useToast } from '../../hooks/useToast.js';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../config/roles.js';
import { ROUTES } from '../../config/routes.js';
import { setAuth } from '../../store/authStore.js'; // implement setAuth({ token, user })

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await login(form);
      const { token, user } = res || {};
      if (!token || !user) throw new Error('Invalid login response');
      setAuth({ token, user });
      toast.show('Logged in', 'success');

      // Role-based redirect
      if (user.role === ROLES.ADMIN) navigate(ROUTES.ADMIN_ANALYTICS, { replace: true });
      else if (user.role === ROLES.CHEF) navigate(ROUTES.CHEF_HOME, { replace: true });
      else navigate(ROUTES.MENU, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
      toast.show('Login failed', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="zg-card" onSubmit={onSubmit} style={{ maxWidth: 420, margin: '0 auto' }}>
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">Sign in</h3>
        </div>

        <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} required />

        {error && <p className="zg-card-desc" style={{ color: 'var(--zg-color-danger)' }}>{error}</p>}

        <div className="zg-card-actions" style={{ justifyContent: 'space-between' }}>
          <Button variant="outline" type="button" onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}>
            Forgot Password
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </div>
    </form>
  );
}