// src/components/ui/ToastProvider.jsx
import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  useEffect
} from 'react';

// import { useToast } from '../../hooks/useToast';


export const ToastContext = createContext(null);

const badgeClass = (type) => ({
  success: 'zg-badge-success',
  info: 'zg-badge-info',
  warn: 'zg-badge-warn',
  danger: 'zg-badge-danger'
}[type] || 'zg-badge-info');

const iconFor = (type) => ({
  success: '✅',
  info: 'ℹ',
  warn: '⚠',
  danger: '⛔'
}[type] || 'ℹ');

function ToastProvider({ children, max = 5, duration = 3000 }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type = 'info') => {
      setToasts((list) => {
        const id = Date.now() + Math.random();
        const next = [...list, { id, message, type }];
        return next.slice(-max);
      });
    },
    [max]
  );

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(() => dismiss(t.id), duration)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss, duration]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 60,
          display: 'grid',
          gap: 8,
          maxWidth: 360
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`zg-badge ${badgeClass(t.type)}`}
            style={{
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>
              {iconFor(t.type)} {t.message}
            </span>
            <button
              className="zg-btn zg-btn-outline"
              onClick={() => dismiss(t.id)}
              style={{ padding: '2px 6px', minHeight: 'unset' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;

// ✅ Export helper hook instead of context directly
// export const useToast = () => {
//   const ctx = useContext(ToastContext);
//   if (!ctx) throw new Error('useToast must be used within a ToastProvider');
//   return ctx;
// };