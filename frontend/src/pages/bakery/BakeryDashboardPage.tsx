import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../services/orderApi';
import { Order } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Clock,
  ChefHat,
  PackageCheck,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  XCircle,
  IndianRupee,
} from 'lucide-react';
import { formatINR, formatIndianDate } from '../../utils/indiaConstants';

export const BakeryDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<{
    pendingOrders: number;
    activeOrders: number;
    completedOrders: number;
    totalRevenue: number;
    urgentOrders: Order[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getBakeryDashboard();
      setStats(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-4 md-grid-cols-2 sm-grid-cols-1" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} height="110px" borderRadius="16px" />
          ))}
        </div>
        <Skeleton height="250px" borderRadius="16px" />
      </div>
    );
  }

  return (
    <div>
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-4 md-grid-cols-2 sm-grid-cols-1" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Pending Orders */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Approval</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FEF6E6', color: '#B26A00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#B26A00', fontFamily: 'var(--font-serif)' }}>
            {stats?.pendingOrders || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            Requires baker review
          </div>
        </div>

        {/* Active Orders */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>In Production</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
            {stats?.activeOrders || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            Baking, styling & delivery
          </div>
        </div>

        {/* Completed Orders */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fulfilled Orders</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#EAF5EE', color: '#2C5E43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PackageCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2C5E43', fontFamily: 'var(--font-serif)' }}>
            {stats?.completedOrders || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            Delivered successfully
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Settled Revenue</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FAF5FF', color: '#7E22CE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>
            {formatINR(stats?.totalRevenue || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            Delivered cake revenue
          </div>
        </div>
      </div>

      {/* Action Required: Urgent Pending Orders */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
              Orders Requiring Attention
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Incoming customer requests awaiting your schedule confirmation or review.
            </p>
          </div>

          <Link to="/bakery/orders" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {!stats?.urgentOrders || stats.urgentOrders.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <CheckCircle2 size={32} color="#2C5E43" style={{ margin: '0 auto 0.75rem auto' }} />
            <div>All caught up! No orders currently pending review.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.urgentOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid var(--border-medium)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  backgroundColor: 'var(--bg-app)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      #{order.order_number}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatINR(order.total_amount)}</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Customer: <strong>{order.customer_name}</strong> · Delivery Date: <strong>{formatIndianDate(order.delivery_date)}</strong>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    {order.items?.map((it) => `${it.quantity}x ${it.cake_name}`).join(', ')}
                  </div>
                </div>

                <Link to={`/bakery/orders?orderId=${order.id}`} className="btn btn-primary btn-sm">
                  Review & Accept
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
