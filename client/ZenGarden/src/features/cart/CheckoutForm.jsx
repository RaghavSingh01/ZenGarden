// src/features/cart/CheckoutForm.jsx
import React, { useMemo, useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import { getState, cartTotal, clearCart } from '../../store/cartStore.js';
import { placeOrder } from '../../services/cartService.js';
import { useToast } from '../../hooks/useToast.js';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.js';

export default function CheckoutForm() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    specialInstructions: '',
    paymentMethod: 'cod'
  });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const cart = useMemo(() => getState(), []);
  const total = cartTotal();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!cart.items.length) return;

    setSubmitting(true);
    try {
      const payload = {
        items: cart.items.map((it) => ({ dishId: it.id, quantity: it.quantity })),
        address: form.address,
        specialInstructions: form.specialInstructions,
        paymentMethod: form.paymentMethod
      };
      await placeOrder(payload);
      clearCart();
      toast.show('Order placed successfully', 'success');
      navigate(ROUTES.ORDER_TRACKING.replace(':id', 'latest'), { replace: true });
    } catch (err) {
      toast.show(err?.response?.data?.message || err.message || 'Checkout failed', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="zg-card" onSubmit={onSubmit}>
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">Checkout</h3>
          <strong>Total: ₹{total.toFixed(2)}</strong>
        </div>

        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <Input label="Full Name" name="fullName" value={form.fullName} onChange={onChange} required />
          </div>
          <div style={{ width: 220 }}>
            <Input label="Phone" name="phone" value={form.phone} onChange={onChange} required />
          </div>
        </div>

        <Input label="Delivery Address" name="address" value={form.address} onChange={onChange} required />
        <Input label="Special Instructions" name="specialInstructions" value={form.specialInstructions} onChange={onChange} placeholder="Optional" />

        <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
          <Button type="submit" disabled={submitting || !cart.items.length}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </form>
  );
}