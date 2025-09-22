
// import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';

// const ToastContext = createContext(null);

// /**
//  * ToastProvider wraps app; useToast exposes show/dismiss.
//  * Types: success | info | warn | danger
//  */
// export function ToastProvider({ children, max = 5, duration = 3000 }) {
//   const [toasts, setToasts] = useState([]);

//   const dismiss = useCallback((id) => {
//     setToasts((list) => list.filter(t => t.id !== id));
//   }, []);

//   const show = useCallback((message, type = 'info') => {
//     setToasts((list) => {
//       const id = Date.now() + Math.random();
//       const next = [...list, { id, message, type }];
//       return next.slice(-max);
//     });
//   }, [max]);

//   const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

//   useEffect(() => {
//     if (!toasts.length) return;
//     const timers = toasts.map(t =>
//       setTimeout(() => dismiss(t.id), duration)
//     );
//     return () => timers.forEach(clearTimeout);
//   }, [toasts, dismiss, duration]);

//   return (
//     <ToastContext.Provider value={value}>
//       {children}
//       <div
//         aria-live="polite"
//         aria-atomic="true"
//         style={{
//           position: 'fixed', right: 16, bottom: 16, zIndex: 60,
//           display: 'grid', gap: 8, maxWidth: 360
//         }}
//       >
//         {toasts.map(t => (
//           <div key={t.id} className={`zg-badge ${badgeClass(t.type)}`} style={{ padding: '10px 12px' }}>
//             <span>{iconFor(t.type)} {t.message}</span>
//             <button className="zg-btn zg-btn-outline" onClick={() => dismiss(t.id)} style={{ padding: '2px 6px', minHeight: 'unset' }}>
//               ×
//             </button>
//           </div>
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// }

// const badgeClass = (type) => ({
//   success: 'zg-badge-success',
//   info: 'zg-badge-info',
//   warn: 'zg-badge-warn',
//   danger: 'zg-badge-danger'
// }[type] || 'zg-badge-info');

// const iconFor = (type) => ({
//   success: '✅',
//   info: 'ℹ',
//   warn: '⚠',
//   danger: '⛔'
// }[type] || 'ℹ');

// export function useToast() {
//   const ctx = useContext(ToastContext);
//   if (!ctx) throw new Error('useToast must be used within ToastProvider');
//   return ctx;
// }