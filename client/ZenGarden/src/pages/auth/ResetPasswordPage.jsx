import React from 'react';
import ResetPassword from '../../features/auth/ResetPassword.jsx';

export default function ResetPasswordPage() {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Reset Password</h2>
      <ResetPassword />
    </div>
  );
}