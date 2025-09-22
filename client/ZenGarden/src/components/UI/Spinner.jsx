import React from 'react';

export default function Spinner({ size = 20, color = 'var(--zg-color-primary)', style = {} }) {
  const s = size;
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ display: 'inline-block', width: s, height: s, ...style }}
    >
      <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%' }}>
        <circle
          cx="25" cy="25" r="20"
          fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray="31.4 31.4"
        >
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </span>
  );
}