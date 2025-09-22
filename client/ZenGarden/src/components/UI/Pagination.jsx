import React from 'react';
import Button from './Button.jsx';

/**
 * Props:
 * - page: number
 * - totalPages: number
 * - onChange: (page) => void
 */
export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7);

  return (
    <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
      <Button variant="outline" disabled={!canPrev} onClick={() => onChange?.(page - 1)}>Prev</Button>
      {pages.map(p => (
        <Button
          key={p}
          variant={p === page ? 'primary' : 'outline'}
          onClick={() => onChange?.(p)}
        >
          {p}
        </Button>
      ))}
      <Button variant="outline" disabled={!canNext} onClick={() => onChange?.(page + 1)}>Next</Button>
    </div>
  );
}