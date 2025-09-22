import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Simple breadcrumbs for secondary navigation.
 * Props:
 * - items: [{ label, to? }] last item without "to" is current.
 * - separator?: string | ReactNode (default '›')
 * - ariaLabel?: string
 */
export default function Breadcrumbs({
  items = [],
  separator = '›',
  ariaLabel = 'Breadcrumb'
}) {
  if (!items.length) return null;

  return (
    <nav aria-label={ariaLabel} style={{ padding: '8px 0' }}>
      <ol style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        listStyle: 'none',
        padding: 0,
        margin: 0,
        color: 'var(--zg-color-text-muted)'
      }}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="row" style={{ gap: 8 }}>
              {isLast || !item.to ? (
                <span aria-current="page" style={{ color: 'var(--zg-color-text)' }}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="zg-btn zg-btn-outline" style={{ padding: '4px 8px', minHeight: 'unset' }}>
                  {item.label}
                </Link>
              )}
              {!isLast && <span aria-hidden="true">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}