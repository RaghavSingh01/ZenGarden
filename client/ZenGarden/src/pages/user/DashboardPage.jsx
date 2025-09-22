import React, { useEffect, useState } from 'react';
import Spinner from '../../components/UI/Spinner.jsx';
import Badge from '../../components/UI/Badge.jsx';
import Button from '../../components/UI/Button.jsx';
import http from '../../services/http.js';
import { apiUrl } from '../../config/env.js';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.js';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [o, r] = await Promise.all([
          http.get(apiUrl('/api/orders/my?limit=5')),
          http.get(apiUrl('/api/reservations/myReservations?limit=5'))
        ]);
        if (!cancelled) {
          setOrders(o.data?.data || o.data || []);
          setReservations(r.data?.data || r.data || []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="center" style={{ height: 240 }}><Spinner size={28} /></div>;

  return (
    <div className="stack" style={{ gap: 16 }}>
      <h2>Welcome back</h2>

      <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
        <div className="zg-card" style={{ flex: 1, minWidth: 320 }}>
          <div className="zg-card-body">
            <div className="zg-card-header">
              <span className="zg-card-title">Recent Orders</span>
              <Button variant="outline" onClick={() => navigate(ROUTES.ORDER_TRACKING.replace(':id','latest'))}>Track latest</Button>
            </div>
            {orders.length === 0 ? <p className="muted">No recent orders.</p> : (
              <div className="stack" style={{ gap: 8 }}>
                {orders.map(o => (
                  <div key={o._id || o.id} className="row" style={{ justifyContent: 'space-between' }}>
                    <span>#{o._id || o.id} • ₹{Number(o.total || 0).toFixed(2)}</span>
                    <Badge variant={o.status === 'delivered' ? 'success' : 'info'}>{o.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="zg-card" style={{ flex: 1, minWidth: 320 }}>
          <div className="zg-card-body">
            <div className="zg-card-header">
              <span className="zg-card-title">Upcoming Reservations</span>
              <Button variant="outline" onClick={() => navigate(ROUTES.RESERVATIONS)}>View all</Button>
            </div>
            {reservations.length === 0 ? <p className="muted">No upcoming reservations.</p> : (
              <div className="stack" style={{ gap: 8 }}>
                {reservations.map(r => (
                  <div key={r._id || r.id} className="row" style={{ justifyContent: 'space-between' }}>
                    <span>{r.date?.slice(0,10)} • {r.slot} • {r.guests} guests</span>
                    <Badge variant={r.status === 'confirmed' ? 'success' : 'info'}>{r.status}</Badge>
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