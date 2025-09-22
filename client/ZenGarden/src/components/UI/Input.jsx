import React from 'react';

/**
 * Props:
 * - label, name, value, onChange, type='text', placeholder
 * - error: string (optional)
 */
export default function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
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
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="zg-input"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className="muted" role="alert" style={{ color: 'var(--zg-color-danger)' }}>
          {error}
        </span>
      )}
    </div>
  );
}