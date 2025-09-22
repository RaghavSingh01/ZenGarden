import React from 'react';
import CheckoutForm from '../../features/cart/CheckoutForm.jsx';

export default function CheckoutPage() {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Checkout</h2>
      <CheckoutForm />
    </div>
  );
}