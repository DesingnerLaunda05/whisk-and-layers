import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Store, Users, Package, ShieldCheck } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navItems = [
    { to: '/admin/dashboard', label: 'Platform Overview', Icon: LayoutDashboard, end: true },
    { to: '/admin/bakeries', label: 'Manage Bakeries', Icon: Store },
    { to: '/admin/users', label: 'Manage Users', Icon: Users },
    { to: '/admin/orders', label: 'Global Orders', Icon: Package },
  ];

  return (
    <div style={{ backgroundColor: '#F8F4EE', minHeight: 'calc(100vh - 120px)', padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            backgroundColor: '#20130D',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={28} color="#D4AF37" />
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#FFF' }}>Platform Administration</h2>
              <p style={{ fontSize: '0.8rem', color: '#A08E84' }}>
                Whisk & Layers System Governance, Metrics & Moderation
              </p>
            </div>
          </div>
          <span className="badge" style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: '#D4AF37', border: '1px solid #D4AF37' }}>
            Super Admin
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }} className="admin-grid">
          {/* Sidebar */}
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

          <div>
            <Outlet />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
