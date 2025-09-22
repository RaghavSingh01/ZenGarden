import React from 'react';
import CartPageFeature from '../../features/cart/cartPage.jsx';

export default function CartPage() {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>My Cart</h2>
      <CartPageFeature />
    </div>
  );
}