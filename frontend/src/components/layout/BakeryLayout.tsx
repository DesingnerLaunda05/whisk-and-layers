import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SafeImage } from '../ui/SafeImage';
import {
  LayoutDashboard,
  Package,
  Cake,
  PlusCircle,
  MessageSquare,
  Store,
  ExternalLink,
} from 'lucide-react';

export const BakeryLayout: React.FC = () => {
  const { bakery } = useAuth();

  const navItems = [
    { to: '/bakery/dashboard', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    { to: '/bakery/orders', label: 'Orders & Fulfillment', Icon: Package },
    { to: '/bakery/cakes', label: 'Cake Catalog', Icon: Cake },
    { to: '/bakery/cakes/new', label: 'Add New Cake', Icon: PlusCircle },
    { to: '/bakery/reviews', label: 'Customer Reviews', Icon: MessageSquare },
    { to: '/bakery/profile', label: 'Storefront Profile', Icon: Store },
  ];

  return (
    <div style={{ backgroundColor: '#F8F4EE', minHeight: 'calc(100vh - 120px)', padding: '2rem 0' }}>
      <div className="container">
        {/* Bakery Header Banner */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <SafeImage
              src={bakery?.logo_url}
              alt={bakery?.name || 'Bakery'}
              fallbackType="bakery-logo"
              style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
                  {bakery?.name || 'My Bakery Portal'}
                </h2>
                <span className="badge" style={{ backgroundColor: '#EAF5EE', color: '#2C5E43' }}>
                  Active Partner
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {bakery?.city ? `${bakery.city}, ${bakery.state}` : 'Artisan Bakery Management'} · {bakery?.minimum_lead_days || 2} Days Minimum Lead Time
              </p>
            </div>
          </div>

          {bakery && (
            <Link
              to={`/bakeries/${bakery.slug}`}
              target="_blank"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>View Public Storefront</span>
              <ExternalLink size={14} />
            </Link>
          )}
        </div>

        {/* Tab / Sidebar Navigation and Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }} className="bakery-grid">
          {/* Navigation Sidebar */}
          <div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              {navItems.map((item) => {
                const Icon = item.Icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#FFFFFF' : 'var(--text-main)',
                      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                      transition: 'var(--transition)',
                    })}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Main Area */}
          <div>
            <Outlet />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .bakery-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
