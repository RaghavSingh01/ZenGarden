// src/features/reservations/ReservationForm.jsx
import React, { useEffect, useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Select from '../../components/UI/Select.jsx';
import Button from '../../components/UI/Button.jsx';

const DEFAULT_SLOTS = [
  '12:00', '12:30', '13:00', '13:30',
  '19:00', '19:30', '20:00', '20:30'
];

/**
 * Props:
 * - onSubmit: async (payload) => void
 * - onCancel: () => void
 * - fetchSlots?: async (dateStr) => [slotStr]
 * - initial?: { date, slot, guests, specialRequests }
 */
export default function ReservationForm({ onSubmit, onCancel, fetchSlots, initial }) {
  const [form, setForm] = useState({
    date: '',
    slot: '',
    guests: 2,
    specialRequests: ''
  });
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        date: initial.date ? initial.date.slice(0, 10) : '',
        slot: initial.slot || '',
        guests: initial.guests || 2,
        specialRequests: initial.specialRequests || ''
      });
    }
  }, [initial]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (fetchSlots && form.date) {
        const next = await fetchSlots(form.date);
        if (active) setSlots(next.length ? next : DEFAULT_SLOTS);
      }
    };
    load();
    return () => { active = false; };
  }, [form.date, fetchSlots]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'guests' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.date) return setError('Please choose a date');
    if (!form.slot) return setError('Please choose a time slot');
    if (!form.guests || form.guests < 1) return setError('Guests must be at least 1');

    setSubmitting(true);
    try {
      await onSubmit?.(form);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Reservation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="zg-card" onSubmit={handleSubmit}>
      <div className="zg-card-body">
        <div className="zg-card-header">
          <h3 className="zg-card-title">Reserve a Table</h3>
        </div>

        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Input label="Date" name="date" type="date" value={form.date} onChange={onChange} required />
          <Select
            label="Time Slot"
            name="slot"
            value={form.slot}
            onChange={onChange}
            options={[{ value: '', label: 'Select time' }, ...slots.map(s => ({ value: s, label: s }))]}
            required
          />
          <Input label="Guests" name="guests" type="number" min={1} value={form.guests} onChange={onChange} required />
        </div>

        <Input
          label="Special Requests"
          name="specialRequests"
          value={form.specialRequests}
          onChange={onChange}
          placeholder="Allergies, occasion, seating preference..."
        />

        {error && <p className="zg-card-desc" style={{ color: 'var(--zg-color-danger)' }}>{error}</p>}

        <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
          <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? 'Booking...' : 'Book'}</Button>
        </div>
      </div>
    </form>
  );
}