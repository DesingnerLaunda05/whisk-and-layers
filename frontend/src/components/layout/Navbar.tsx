import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { SafeImage } from '../ui/SafeImage';
import {
  ShoppingBag,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Cake,
  Store,
  ShieldCheck,
  Check,
  Package,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, bakery, logout, switchDemoRole } = useAuth();
  const { itemCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'var(--bg-app)' }}>
      {/* 1. Quick Demo Switcher Bar for instant tester evaluation */}
      <div className="demo-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.75rem' }}>
            ⚡ EVALUATION DEMO SWITCHER:
          </span>
          <span style={{ color: '#DDD', fontSize: '0.75rem' }}>
            {user ? (
              <>
                Logged in as: <strong>{user.full_name}</strong> ({user.role})
              </>
            ) : (
              'Browse as Guest or Click below to switch active role:'
            )}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            className="demo-btn"
            onClick={() => switchDemoRole('CUSTOMER')}
            title="Switch to Elena Vance (Customer with active orders)"
          >
            👤 Customer Demo
          </button>
          <button
            className="demo-btn"
            onClick={() => switchDemoRole('BAKERY')}
            title="Switch to Sweet Crust Bakery Owner"
          >
            🧁 Bakery Owner Demo
          </button>
          <button
            className="demo-btn"
            onClick={() => switchDemoRole('ADMIN')}
            title="Switch to Platform Administrator"
          >
            🛡️ Admin Demo
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav
        style={{
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: '#FFFFFF',
          padding: '0.75rem 0',
        }}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cake size={22} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Whisk & Layers
              </div>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', fontWeight: 700 }}>
                Artisan Cake Marketplace
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: 'none',
              gap: '1.75rem',
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            <NavLink
              to="/bakeries"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
              })}
            >
              Discover Bakeries
            </NavLink>
            <NavLink
              to="/cakes"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
              })}
            >
              Cakes Catalog
            </NavLink>
            <NavLink
              to="/custom-builder"
              style={({ isActive }) => ({
                fontWeight: 700,
                fontSize: '0.92rem',
                color: isActive ? 'var(--primary)' : 'var(--primary)',
                backgroundColor: 'var(--primary-light)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              })}
            >
              ✨ Custom Cake Studio
            </NavLink>
            <NavLink
              to="/how-it-works"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              })}
            >
              How It Works
            </NavLink>
          </div>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Cart Button */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-main)',
                transition: 'var(--transition)',
              }}
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(200,90,23,0.4)',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown (If authenticated) */}
            {user && (
              <div style={{ position: 'relative' }} ref={notifMenuRef}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--text-main)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        backgroundColor: '#B92525',
                        color: '#FFF',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '52px',
                      width: '320px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--border-light)',
                      padding: '1rem',
                      zIndex: 1000,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.link_url) {
                                navigate(n.link_url);
                                setNotifDropdownOpen(false);
                              }
                            }}
                            style={{
                              padding: '0.6rem 0.5rem',
                              borderRadius: '8px',
                              backgroundColor: n.is_read ? 'transparent' : 'var(--primary-light)',
                              cursor: 'pointer',
                              marginBottom: '0.35rem',
                              transition: 'background 0.15s ease',
                            }}
                          >
                            <div style={{ fontWeight: n.is_read ? 600 : 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {n.message}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px' }}>
                              {new Date(n.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Account / Auth Menu */}
            {user ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.3rem 0.75rem 0.3rem 0.4rem',
                    cursor: 'pointer',
                  }}
                >
                  <SafeImage
                    src={user.avatar_url}
                    alt={user.full_name}
                    fallbackType="avatar"
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.full_name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '48px',
                      width: '230px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--border-light)',
                      padding: '0.5rem 0',
                      zIndex: 1000,
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      <span className="badge" style={{ marginTop: '0.4rem', backgroundColor: 'var(--bg-muted)', color: 'var(--text-main)' }}>
                        {user.role}
                      </span>
                    </div>

                    <div style={{ padding: '0.4rem 0' }}>
                      {user.role === 'CUSTOMER' && (
                        <Link
                          to="/my-orders"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'var(--text-main)' }}
                        >
                          <Package size={16} color="var(--primary)" />
                          My Orders
                        </Link>
                      )}

                      {user.role === 'BAKERY' && (
                        <>
                          <Link
                            to="/bakery/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}
                          >
                            <Store size={16} color="var(--primary)" />
                            Bakery Dashboard
                          </Link>
                          <Link
                            to="/bakery/orders"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'var(--text-main)' }}
                          >
                            <Package size={16} color="var(--text-muted)" />
                            Manage Orders
                          </Link>
                          <Link
                            to="/bakery/cakes"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'var(--text-main)' }}
                          >
                            <Cake size={16} color="var(--text-muted)" />
                            Manage Cakes
                          </Link>
                        </>
                      )}

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}
                        >
                          <ShieldCheck size={16} color="var(--primary)" />
                          Admin Console
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'var(--text-main)' }}
                      >
                        <UserIcon size={16} color="var(--text-muted)" />
                        Account Profile
                      </Link>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 1rem',
                          fontSize: '0.875rem',
                          color: 'var(--error)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <Link to="/bakeries" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>
              Discover Bakeries
            </Link>
            <Link to="/cakes" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>
              Cakes Catalog
            </Link>
            <Link
              to="/custom-builder"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', fontWeight: 700, color: 'var(--primary)' }}
            >
              ✨ Custom Cake Studio
            </Link>
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>
              How It Works
            </Link>
            {user && (
              <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>
                My Orders
              </Link>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 819px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
