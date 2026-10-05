import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { orderApi } from '../../services/orderApi';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Package,
  Calendar,
  Store,
  ChevronRight,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getMyOrders();
      setOrders(res.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') {
      return ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status);
    }
    if (statusFilter === 'COMPLETED') return o.status === 'DELIVERED';
    if (statusFilter === 'REJECTED') return o.status === 'REJECTED';
    return true;
  });

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)' }}>My Cake Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Track live preparation milestones, view order timelines, and submit verified reviews.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: '2rem',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'ALL', label: `All Orders (${orders.length})` },
            { id: 'ACTIVE', label: 'Active & In-Progress' },
            { id: 'COMPLETED', label: 'Delivered' },
            { id: 'REJECTED', label: 'Declined' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: statusFilter === tab.id ? 700 : 500,
                color: statusFilter === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: statusFilter === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: '-1px',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[1, 2].map((n) => (
              <Skeleton key={n} height="140px" borderRadius="16px" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            title="No Orders Found"
            description="You don't have any orders under this category yet."
            actionText="Discover Artisan Cakes"
            actionLink="/cakes"
            icon="cake"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="card card-interactive"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Top Order Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>
                        Order #{order.order_number}
                      </span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                      ${order.total_amount.toFixed(2)}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {order.payment_method === 'PAY_ON_DELIVERY' ? 'Pay on Delivery' : 'Invoiced'} · {order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Middle Info Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.8fr',
                    gap: '1.5rem',
                    alignItems: 'center',
                  }}
                  className="order-row-grid"
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <Store size={16} color="var(--primary)" />
                      <span>{order.bakery_name}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {order.items?.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.quantity}x</span>
                          <span>{item.cake_name}</span>
                          {item.custom_message && (
                            <span style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>
                              ("{item.custom_message}")
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Scheduled Delivery</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={15} color="var(--primary)" />
                      <span>{order.delivery_date}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {order.delivery_time_slot || 'Standard Window'}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <Link
                    to={`/orders/${order.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>View Full Order & Timeline</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .order-row-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};
