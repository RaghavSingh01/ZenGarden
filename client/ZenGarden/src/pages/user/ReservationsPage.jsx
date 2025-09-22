import React, { useState } from 'react';
import MyReservationsTable from '../../features/reservations/MyReservationsTable.jsx';
import ReservationForm from '../../features/reservations/ReservationForm.jsx';
import Modal from '../../components/UI/Modal.jsx';
import Button from '../../components/UI/Button.jsx';
import { useReservations } from '../../features/reservations/useReservations.js';

export default function ReservationsPage() {
  const R = useReservations({ scope: 'mine' });
  const [open, setOpen] = useState(false);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Reservations</h2>
        <Button onClick={() => setOpen(true)}>Reserve a Table</Button>
      </div>

      <MyReservationsTable
        items={R.items}
        page={R.query.page}
        pageSize={R.query.limit}
        total={R.total}
        onPageChange={(p) => R.load({ page: p })}
        onCancel={(id) => R.cancel(id)}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="New Reservation">
        <ReservationForm
          onSubmit={async (payload) => { await R.create(payload); setOpen(false); }}
          onCancel={() => setOpen(false)}
          fetchSlots={R.fetchSlots}
        />
      </Modal>
    </div>
  );
}