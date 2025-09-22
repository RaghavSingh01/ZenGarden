
import React, { useState } from 'react';

/**
 * Controlled or uncontrolled tabs.
 * Props:
 * - tabs: [{ key, label, content }]
 * - value?: key
 * - onChange?: (key) => void
 * - fitted?: boolean (full width tabs)
 */
export default function Tabs({ tabs = [], value, onChange, fitted = false }) {
  const [internal, setInternal] = useState(tabs[0]?.key);
  const active = value ?? internal;

  const select = (k) => {
    setInternal(k);
    onChange?.(k);
  };

  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="row" role="tablist" aria-label="Tabs" style={{ gap: 8 }}>
        {tabs.map(t => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              className={`zg-btn ${isActive ? 'zg-btn-primary' : 'zg-btn-outline'}`}
              onClick={() => select(t.key)}
              style={fitted ? { flex: 1 } : {}}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="zg-card">
        <div className="zg-card-body">
          {tabs.find(t => t.key === active)?.content}
        </div>
      </div>
    </div>
  );
}