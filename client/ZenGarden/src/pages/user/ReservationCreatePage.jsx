import React, { useState } from 'react';
import ReservationForm from '../../features/reservations/ReservationForm.jsx';
import { useReservations } from '../../features/reservations/useReservations.js';
import Modal from '../../components/UI/Modal.jsx';
import Button from '../../components/UI/Button.jsx';

export default function ReservationCreatePage() {
  const R = useReservations({ scope: 'mine' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(null);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Reserve a Table</h2>

      <ReservationForm
        fetchSlots={R.fetchSlots}
        onSubmit={async (payload) => {
          setPending(payload);
          setConfirmOpen(true);
        }}
        onCancel={() => history.back()}
      />

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Reservation">
        <div className="stack" style={{ gap: 12 }}>
          <p className="zg-card-desc">
            Date: {pending?.date} • Time: {pending?.slot} • Guests: {pending?.guests}
          </p>
          <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Edit</Button>
            <Button onClick={async () => { await R.create(pending); setConfirmOpen(false); }}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}