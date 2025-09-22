import React from 'react';
import ForgotPassword from '../../features/auth/ForgotPassword.jsx';

export default function ForgotPasswordPage() {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Forgot Password</h2>
      <ForgotPassword />
    </div>
  );
}