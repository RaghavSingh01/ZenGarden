import React, { useEffect, useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import Spinner from '../../components/UI/Spinner.jsx';
import { getProfile } from '../../services/authService.js';

export default function ProfilePage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then((res) => {
      const u = res?.data || res || {};
      setForm({ name: u.name || '', email: u.email || '' });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="center" style={{ height: 180 }}><Spinner /></div>;
  if (!form) return <p className="muted">Unable to load profile.</p>;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    // Optional: POST to profile update endpoint if available
  };

  return (
    <form className="zg-card" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">Profile</h3>
        </div>
        <Input label="Name" name="name" value={form.name} onChange={onChange} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} />
        <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
}