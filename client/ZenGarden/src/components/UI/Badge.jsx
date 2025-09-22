
import React from 'react';

export default function Badge({ children, variant = 'info', className = '' }) {
  const cls = {
    success: 'zg-badge zg-badge-success',
    info: 'zg-badge zg-badge-info',
    warn: 'zg-badge zg-badge-warn',
    muted: 'zg-badge zg-badge-muted',
    accent: 'zg-badge zg-badge-accent'
  }[variant] || 'zg-badge zg-badge-info';

  return <span className={`${cls} ${className}`}>{children}</span>;
}