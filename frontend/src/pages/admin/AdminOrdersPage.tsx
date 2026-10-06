import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { Order } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Search, Calendar } from 'lucide-react';
import { formatINR, formatIndianDate } from '../../utils/indiaConstants';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      });
      setOrders(res.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)' }}>Global Platform Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            System-wide order log across all registered bakery storefronts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="REJECTED">Declined</option>
          </select>

          <form onSubmit={(e) => { e.preventDefault(); fetchOrders(); }} style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="text"
              placeholder="Search order #, customer, or bakery..."
              className="form-control"
              style={{ width: '240px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              Search
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => <Skeleton key={n} height="70px" borderRadius="12px" />)}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Order #</th>
                  <th style={{ padding: '1rem' }}>Bakery</th>
                  <th style={{ padding: '1rem' }}>Customer</th>
                  <th style={{ padding: '1rem' }}>Delivery Date</th>
                  <th style={{ padding: '1rem' }}>Amount</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>
                      #{o.order_number}
                    </td>

                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {o.bakery_name}
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {o.customer_name}
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatIndianDate(o.delivery_date)}
                    </td>

                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {formatINR(o.total_amount)}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={o.status} size="sm" />
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-light)', fontSize: '0.8rem' }}>
                      {formatIndianDate(o.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
