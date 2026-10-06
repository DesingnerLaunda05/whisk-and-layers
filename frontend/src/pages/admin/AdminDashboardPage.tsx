import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Users,
  Store,
  Cake,
  Package,
  IndianRupee,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { formatINR } from '../../utils/indiaConstants';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await adminApi.getMetrics();
        setMetrics(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 md-grid-cols-2 sm-grid-cols-1" style={{ gap: '1.25rem' }}>
        {[1, 2, 3, 4].map((n) => (
          <Skeleton key={n} height="110px" borderRadius="16px" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Metric Cards */}
      <div className="grid grid-cols-4 md-grid-cols-2 sm-grid-cols-1" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Total Users */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Registered Users</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--info-bg)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>
            {metrics?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            Customer accounts
          </div>
        </div>

        {/* Total Bakeries */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Bakeries</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
            {metrics?.totalBakeries || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            Verified storefronts
          </div>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Platform Orders</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#EAF5EE', color: '#2C5E43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2C5E43', fontFamily: 'var(--font-serif)' }}>
            {metrics?.totalOrders || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            {metrics?.completedOrders || 0} delivered orders
          </div>
        </div>

        {/* Gross Revenue */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gross GMV</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FAF5FF', color: '#7E22CE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>
            {formatINR(metrics?.totalGrossRevenue || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            Settled volume
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--primary)" />
          <span>Real-time Platform Activity</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {metrics?.recentActivity?.map((act: any, idx: number) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-muted)',
                fontSize: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge" style={{ backgroundColor: act.type === 'ORDER' ? 'var(--primary-light)' : 'var(--info-bg)', color: act.type === 'ORDER' ? 'var(--primary)' : 'var(--info)' }}>
                  {act.type}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{act.title}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                {new Date(act.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
