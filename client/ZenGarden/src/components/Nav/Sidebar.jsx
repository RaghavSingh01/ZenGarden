import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar for Chef/Admin layouts.
 * Props:
 * - items: [{ to, label, icon?, roles?: string[] }]
 * - role: current role
 * - header?: string
 * - footer?: ReactNode
 * - width?: number (px)
 */
export default function Sidebar({
  items = [],
  role = 'admin',
  header = 'Navigation',
  footer = null,
  width = 240
}) {
  const filtered = items.filter(i => !i.roles || i.roles.includes(role));

  return (
    <aside
      aria-label="Sidebar"
      style={{
        width,
        borderRight: '1px solid var(--zg-color-border)',
        background: 'var(--zg-color-surface)',
        minHeight: '100vh',
        position: 'sticky',
        top: 'var(--zg-navbar-height)'
      }}
    >
      <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--zg-color-border)' }}>
        <strong style={{ color: 'var(--zg-color-text)' }}>{header}</strong>
      </div>

      <nav className="stack" style={{ padding: 12 }}>
        {filtered.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `row ${isActive ? 'active' : ''}`
            }
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              color: 'var(--zg-color-text)',
              border: '1px solid transparent'
            }}
          >
            <span aria-hidden="true">{item.icon || '•'}</span>
            <span style={{ textTransform: 'capitalize' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {footer && (
        <div style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid var(--zg-color-border)' }}>
          {footer}
        </div>
      )}
    </aside>
  );
}