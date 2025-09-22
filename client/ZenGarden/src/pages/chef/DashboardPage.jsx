import React, { useMemo } from 'react';
import { useReservations } from '../../features/reservations/useReservations.js';
import { useInventory } from '../../features/inventory/useInventory.js';
import Badge from '../../components/UI/Badge.jsx';
import Button from '../../components/UI/Button.jsx';
import Spinner from '../../components/UI/Spinner.jsx';
import { confirmReservation, completeReservation } from '../../services/reservationsService.js';

export default function DashboardPage() {
  const R = useReservations({ scope: 'all', initial: { limit: 5 } });
  const I = useInventory({ limit: 5 });

  const today = new Date().toISOString().slice(0, 10);
  const todaysReservations = useMemo(
    () => (R.items || []).filter(r => (r.date || '').slice(0,10) === today),
    [R.items, today]
  );
  const lowStock = useMemo(
    () => (I.items || []).filter(x => typeof x.lowStockAlert === 'number' && Number(x.quantity) <= Number(x.lowStockAlert)),
    [I.items]
  );

  return (
    <div className="stack" style={{ gap: 16 }}>
      <h2>Chef Dashboard</h2>

      <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
        <div className="zg-card" style={{ flex: 1, minWidth: 320 }}>
          <div className="zg-card-body">
            <div className="zg-card-header">
              <span className="zg-card-title">Today’s Reservations</span>
              <Badge variant="accent">{todaysReservations.length}</Badge>
            </div>
            {R.loading ? (
              <div className="center" style={{ height: 120 }}><Spinner /></div>
            ) : todaysReservations.length === 0 ? (
              <p className="muted">No reservations today.</p>
            ) : (
              <div className="stack" style={{ gap: 10 }}>
                {todaysReservations.slice(0, 8).map(r => (
                  <div key={r._id || r.id} className="row" style={{ gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="row" style={{ gap: 8 }}>
                      <Badge variant="info">{r.slot}</Badge>
                      <span>{r.user?.name || r.userName || 'Guest'}</span>
                      <span className="muted">({r.guests} guests)</span>
                    </div>
                    <div className="row" style={{ gap: 6 }}>
                      {r.status === 'pending' && <Button variant="primary" onClick={async()=>{ await confirmReservation(r._id||r.id); R.load(); }}>Confirm</Button>}
                      {r.status === 'confirmed' && <Button variant="secondary" onClick={async()=>{ await completeReservation(r._id||r.id); R.load(); }}>Complete</Button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="zg-card" style={{ flex: 1, minWidth: 320 }}>
          <div className="zg-card-body">
            <div className="zg-card-header">
              <span className="zg-card-title">Low Stock</span>
              <Badge variant="warn">{lowStock.length}</Badge>
            </div>
            {I.loading ? (
              <div className="center" style={{ height: 120 }}><Spinner /></div>
            ) : lowStock.length === 0 ? (
              <p className="muted">All good on stock.</p>
            ) : (
              <div className="stack" style={{ gap: 10 }}>
                {lowStock.slice(0, 8).map(x => (
                  <div key={x._id || x.id} className="row" style={{ gap: 8, justifyContent: 'space-between' }}>
                    <div className="row" style={{ gap: 8 }}>
                      <strong>{x.ingredient}</strong>
                      <span className="muted">{x.quantity} {x.unit}</span>
                    </div>
                    <Badge variant="warn">Low</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}