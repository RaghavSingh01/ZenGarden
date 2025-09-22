import React from 'react';

/**
 * Props:
 * - variant: 'primary' | 'outline' | 'secondary' | 'danger'
 * - type: 'button' | 'submit' | 'reset'
 * - disabled: boolean
 * - onClick: fn
 * - children: node
 * - className: extra classes
 */
export default function Button({
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  children,
  ...rest
}) {
  const variantClass = {
    primary: 'zg-btn zg-btn-primary',
    outline: 'zg-btn zg-btn-outline',
    secondary: 'zg-btn zg-btn-secondary',
    danger: 'zg-btn zg-btn-danger'
  }[variant];

  return (
    <button
      type={type}
      className={`${variantClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}