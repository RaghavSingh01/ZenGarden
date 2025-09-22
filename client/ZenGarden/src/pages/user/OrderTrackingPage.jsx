import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/UI/Spinner.jsx';
import Badge from '../../components/UI/Badge.jsx';
import Button from '../../components/UI/Button.jsx';
import http from '../../services/http.js';
import { apiUrl } from '../../config/env.js';

const STATUS_COLOR = {
  pending: 'info',
  confirmed: 'accent',
  preparing: 'info',
  dispatched: 'info',
  delivered: 'success',
  cancelled: 'muted',
  failed: 'danger'
};

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusVariant = useMemo(
    () => STATUS_COLOR[order?.status] || 'info',
    [order?.status]
  );

  useEffect(() => {
    let timer;
    let cancelled = false;

    async function load() {
      try {
        const res = await http.get(apiUrl(`/api/orders/${id}`));
        if (!cancelled) setOrder(res.data?.data || res.data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    // Poll every 5s; consider upgrading to WebSockets (Socket.IO/Pusher) when backend emits status updates
    timer = setInterval(load, 5000);

    return () => { cancelled = true; clearInterval(timer); };
  }, [id]);

  if (loading && !order) return <div className="center" style={{ height: 200 }}><Spinner size={28} /></div>;

  if (!order) return <p className="muted">Order not found.</p>;

  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Order Tracking</h2>

      <div className="zg-card">
        <div className="zg-card-body">
          <div className="zg-card-header">
            <span className="zg-card-title">Order #{order._id || order.id}</span>
            <Badge variant={statusVariant}>{order.status}</Badge>
          </div>

          <div className="stack" style={{ gap: 6 }}>
            <div><strong>Placed:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}</div>
            <div><strong>Total:</strong> ₹{Number(order.total || 0).toFixed(2)}</div>
            <div><strong>Items:</strong> {(order.items || []).map(i => `${i.name}×${i.quantity}`).join(', ')}</div>
            {order.etaMinutes ? <div><strong>ETA:</strong> ~{order.etaMinutes} min</div> : null}
          </div>

          <div className="zg-card-actions" style={{ justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        </div>
      </div>
    </div>
  );
}