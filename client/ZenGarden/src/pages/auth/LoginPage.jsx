import React from 'react';
import LoginForm from '../../features/auth/LoginForm.jsx';

export default function LoginPage() {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Sign in</h2>
      <LoginForm />
    </div>
  );
}