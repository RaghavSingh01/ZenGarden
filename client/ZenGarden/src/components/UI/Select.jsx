
import React from 'react';

/**
 * Props:
 * - label, name, value, onChange
 * - options: [{ value, label }]
 * - error: string
 */
export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error,
  required,
  ...rest
}) {
  const id = rest.id || name;
  return (
    <div className="stack" style={{ gap: 6 }}>
      {label && (
        <label htmlFor={id} className="zg-label" style={{ fontWeight: 600 }}>
          {label} {required ? '*' : ''}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="zg-select"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...rest}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <span id={`${id}-error`} className="muted" role="alert" style={{ color: 'var(--zg-color-danger)' }}>
          {error}
        </span>
      )}
    </div>
  );
}