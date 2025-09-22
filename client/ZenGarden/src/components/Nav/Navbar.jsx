import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Navbar with role-aware links.
 * Props:
 * - role: 'user' | 'chef' | 'admin'
 * - user: { name, email }
 * - onLogout: function
 * - links: [{ to, label, roles?: string[] }]
 * - brand: { name?: string, to?: string }
 * - rightContent?: ReactNode  (e.g., cart icon)
 */
export default function Navbar({
  role = 'user',
  user,
  onLogout,
  links = [],
  brand = { name: 'ZenGarden', to: '/' },
  rightContent
}) {
  const filtered = links.filter(l => !l.roles || l.roles.includes(role));

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="row" style={{ gap: 10 }}>
          <Link to={brand.to} className="brand" aria-label="Home">
            🌿 {brand.name}
          </Link>
        </div>

        <nav className="row" aria-label="Primary">
          {filtered.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `zg-btn zg-btn-outline ${isActive ? 'active' : ''}`}
              style={{ textTransform: 'capitalize' }}
              end={item.exact}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="row" style={{ gap: 8 }}>
          {rightContent}

          {user ? (
            <>
              <span className="zg-chip" title={user.email}>
                {user.name || 'Account'}
              </span>
              <button className="zg-btn zg-btn-danger" onClick={onLogout} aria-label="Logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="zg-btn zg-btn-primary">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}