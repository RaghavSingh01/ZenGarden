import React, { useMemo, useState } from 'react';
import Button from '../../components/UI/Button.jsx';
import Badge from '../../components/UI/Badge.jsx';
import {
  subscribe as subscribeCart,
  getState as getCartState,
  setQuantity,
  removeItem,
  cartTotal,
  clearCart
} from '../../store/cartStore.js';
import CheckoutForm from './CheckoutForm.jsx';

function CartItemRow({ item }) {
  const [qty, setQty] = useState(item.quantity);

  const onUpdate = () => {
    const q = Math.max(1, Number(qty));
    setQuantity(item.id, q);
  };

  return (
    <div className="zg-card" style={{ padding: 0 }}>
      <div className="row" style={{ gap: 12, padding: 12 }}>
        <img src={item.image} alt={item.name} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
        <div className="stack" style={{ gap: 6, flex: 1 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>{item.name}</strong>
            <Badge variant="accent">₹{Number(item.price || 0).toFixed(2)}</Badge>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              onBlur={onUpdate}
              className="zg-input"
              style={{ width: 96 }}
            />
            <Button variant="outline" onClick={() => removeItem(item.id)}>Remove</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPageFeature() {
  const [cart, setCart] = useState(getCartState());
  React.useEffect(() => {
    const un = subscribeCart(setCart);
    return () => un();
  }, []);

  const total = useMemo(() => cartTotal(), [cart]);

  return (
    <div className="stack" style={{ gap: 16 }}>
      {cart.items.length === 0 ? (
        <p className="muted">Cart is empty.</p>
      ) : (
        <>
          <div className="stack" style={{ gap: 12 }}>
            {cart.items.map((it) => (
              <CartItemRow key={it.id} item={it} />
            ))}
          </div>

          <div className="zg-card">
            <div className="zg-card-body">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>Subtotal</strong>
                <strong>₹{total.toFixed(2)}</strong>
              </div>
              <div className="row" style={{ gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <Button variant="outline" onClick={() => clearCart()}>Clear Cart</Button>
              </div>
            </div>
          </div>

          <CheckoutForm />
        </>
      )}
    </div>
  );
}