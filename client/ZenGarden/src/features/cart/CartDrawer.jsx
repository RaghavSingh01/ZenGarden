
// src/features/cart/CartDrawer.jsx
import React, { useEffect, useState } from 'react';
import Button from '../../components/UI/Button.jsx';
import { subscribe, getState, setQuantity, removeItem, cartTotal, clearCart } from './cart.store.js';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const [cart, setCart] = useState(getState());

  useEffect(() => {
    const unsub = subscribe(setCart);
    return () => unsub();
  }, []);

  return (
    <div
      aria-hidden={!open}
      style={{
        position: 'fixed', inset: 0, zIndex: 70,
        pointerEvents: open ? 'auto' : 'none'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div style={{ position: 'absolute', inset: 0, background: open ? 'rgba(0,0,0,.35)' : 'transparent' }} />
      <aside
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 360,
          background: 'var(--zg-color-surface)',
          borderLeft: '1px solid var(--zg-color-border)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .2s ease',
          display: 'flex', flexDirection: 'column'
        }}
      >
        <header className="row" style={{ justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--zg-color-border)' }}>
          <strong>My Cart</strong>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </header>

        <div className="stack" style={{ padding: 12, gap: 12, overflow: 'auto' }}>
          {cart.items.length === 0 ? (
            <p className="muted">Cart is empty</p>
          ) : cart.items.map((it) => (
            <div key={it.id} className="row" style={{ gap: 10, alignItems: 'center' }}>
              {it.image && <img src={it.image} alt={it.name} width={56} height={56} style={{ borderRadius: 8, objectFit: 'cover' }} />}
              <div className="stack" style={{ flex: 1 }}>
                <strong>{it.name}</strong>
                <span className="muted">₹{Number(it.price).toFixed(2)}</span>
              </div>
              <input
                type="number"
                min={1}
                value={it.quantity}
                onChange={(e) => setQuantity(it.id, Number(e.target.value))}
                className="zg-input"
                style={{ width: 64 }}
                aria-label={`Quantity of ${it.name}`}
              />
              <Button variant="danger" onClick={() => removeItem(it.id)}>Remove</Button>
            </div>
          ))}
        </div>

        <footer className="stack" style={{ padding: 12, gap: 8, borderTop: '1px solid var(--zg-color-border)' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>Total</strong>
            <strong>₹{cartTotal().toFixed(2)}</strong>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <Button variant="outline" onClick={clearCart}>Clear</Button>
            <Button onClick={onCheckout} disabled={cart.items.length === 0}>Checkout</Button>
          </div>
        </footer>
      </aside>
    </div>
  );
}