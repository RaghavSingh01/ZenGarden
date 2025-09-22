import React from 'react';
import Pagination from './Pagination.jsx';

/**
 * Generic table.
 * Props:
 * - columns: [{ key, header, render?: (row) => node }]
 * - data: array
 * - page, pageSize, total, onPageChange
 */
export default function DataTable({
  columns = [],
  data = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange
}) {
  const rows = Array.isArray(data) ? data : [];
  const totalPages = Math.max(1, Math.ceil((Number(total) || rows.length) / pageSize));

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="zg-card">
        <div className="zg-card-body" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} style={{ textAlign: 'left', padding: '12px 14px', borderBottom: '1px solid var(--zg-color-border)', background: 'var(--zg-color-surface)' }}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ padding: 16, color: 'var(--zg-color-text-muted)' }}>
                    No data
                  </td>
                </tr>
              ) : rows.map((row, i) => (
                <tr key={row.id || row._id || i}>
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '12px 14px', borderBottom: '1px solid var(--zg-color-border)' }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </div>
  );
}