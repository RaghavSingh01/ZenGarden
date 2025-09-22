import React, { useEffect } from 'react';
import Button from './Button.jsx';

/**
 * Accessible modal using portal-less overlay.
 * Props:
 * - open: boolean
 * - title: string | node
 * - onClose: fn
 * - primaryAction: { label, onClick, variant? }
 * - secondaryAction: { label, onClick, variant? }
 * - children: content
 */
export default function Modal({
  open,
  title = 'Dialog',
  onClose,
  primaryAction,
  secondaryAction,
  children
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Dialog'}
      onClick={(e) => { if (e.currentTarget === e.target) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
        display: 'grid', placeItems: 'center', zIndex: 50
      }}
    >
      <div
        className="zg-card"
        style={{ width: 'min(560px, 92vw)' }}
      >
        <div className="zg-card-body">
          <div className="zg-card-header">
            <h3 className="zg-card-title">{title}</h3>
            <button className="zg-btn zg-btn-outline" onClick={onClose} aria-label="Close">Close</button>
          </div>

          <div>{children}</div>

          <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
            {secondaryAction && (
              <Button variant={secondaryAction.variant || 'outline'} onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button variant={primaryAction.variant || 'primary'} onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}