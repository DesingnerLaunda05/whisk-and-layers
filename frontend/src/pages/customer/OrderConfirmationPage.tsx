import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../../types';
import { orderApi } from '../../services/orderApi';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { OrderTimeline } from '../../components/ui/OrderTimeline';
import { Skeleton } from '../../components/ui/Skeleton';
import { CheckCircle2, Store, Calendar, MapPin, Package, ArrowRight } from 'lucide-react';
import { formatINR, formatIndianDate } from '../../utils/indiaConstants';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await orderApi.getOne(parseInt(id, 10));
        setOrder(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container container-narrow" style={{ padding: '4rem 0' }}>
        <Skeleton height="120px" style={{ marginBottom: '2rem' }} />
        <Skeleton height="300px" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container container-narrow" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Order Confirmation</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          Order details could not be loaded. Please visit your orders page.
        </p>
        <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Go to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container container-narrow">
        {/* Success Header */}
        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-light)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EAF5EE',
              color: '#2C5E43',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Order #{order.order_number} Received!
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
            Sent to {order.bakery_name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
            The bakery team has received your order request and will review your required delivery date and recipe configuration shortly.
          </p>

          <div style={{ display: 'inline-block' }}>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Live Fulfillment Timeline
          </h3>
          <OrderTimeline status={order.status} rejectionReason={order.rejection_reason} />
        </div>

        {/* Order Details Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            Order Specification Breakdown
          </h3>

          <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Scheduled Delivery</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="var(--primary)" />
                <span>{formatIndianDate(order.delivery_date)} ({order.delivery_time_slot || 'Standard'})</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Delivery Address</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} color="var(--primary)" />
                <span>{order.delivery_address}</span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Items:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px dashed var(--border-light)' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.quantity}x {item.cake_name}</span>
                    {item.custom_message && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                        Inscription: "{item.custom_message}"
                      </div>
                    )}
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatINR(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>Total Settled / Invoiced:</span>
              <span style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                {formatINR(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/my-orders" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} />
            <span>View All My Orders</span>
          </Link>
          <Link to="/cakes" className="btn btn-secondary">
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
};
