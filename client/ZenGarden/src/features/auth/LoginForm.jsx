// src/features/auth/LoginForm.jsx
import React, { useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import { login } from '../../services/authService.js';
import { useToast } from '../../hooks/useToast.js';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../config/roles.js';
import { ROUTES } from '../../config/routes.js';
import { setAuth } from '../../store/authStore.js';
import http from '../../services/http.js';
import { apiUrl } from '../../config/env.js';

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
      // Call service (returns JSON body)
      const res = await login(form);

      // Accept common API shapes:
      // { token, user } or { token, data: { user } } or { accessToken, data: { user } }
      const token =
        res?.token ||
        res?.accessToken ||
        res?.data?.token;

      let user =
        res?.user ||
        res?.data?.user ||
        res?.profile;

      if (!token) {
        throw new Error('Invalid login response');
      }

      // Optionally set default Authorization for subsequent calls
      http.defaults.headers.common.Authorization = `Bearer ${token}`;

      // If user not included, fetch profile
      if (!user) {
        try {
          const me = await http.get(apiUrl('/api/auth/profile')).then(r => r.data);
          user = me?.user || me?.data?.user || me || null;
        } catch {
          // Ignore; will proceed with token only
        }
      }

      if (!user) {
        throw new Error('Profile missing in response');
      }

      // Persist auth and notify
      setAuth({ token, user });
      toast.show('Logged in', 'success');

      // Role-based redirect
      if (user.role === ROLES.ADMIN) navigate(ROUTES.ADMIN_ANALYTICS, { replace: true });
      else if (user.role === ROLES.CHEF) navigate(ROUTES.CHEF_HOME, { replace: true });
      else navigate(ROUTES.MENU, { replace: true });

    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      toast.show(msg, 'danger');
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