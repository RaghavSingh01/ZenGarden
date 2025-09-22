import React from 'react';
import AllReservationsTable from '../../features/reservations/AllReservationsTable.jsx';
import { useReservations } from '../../features/reservations/useReservations.js';
import { confirmReservation, completeReservation } from '../../services/reservationsService.js';

export default function ReservationsPage() {
  const R = useReservations({ scope: 'all' });

  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Reservations</h2>

      <AllReservationsTable
        items={R.items}
        total={R.total}
        page={R.query.page}
        pageSize={R.query.limit}
        onPageChange={(p) => R.load({ page: p })}
        onFilter={(patch) => R.load(patch)}
        onConfirm={async (id) => { await confirmReservation(id); R.load(); }}
        onCancel={(id) => R.cancel(id)}
        onComplete={async (id) => { await completeReservation(id); R.load(); }}
      />
    </div>
  );
}