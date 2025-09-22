import React from 'react';
import RegisterForm from '../../features/auth/RegisterForm.jsx';

export default function RegisterPage() {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Create account</h2>
      <RegisterForm allowRoleChoice={false} />
    </div>
  );
}