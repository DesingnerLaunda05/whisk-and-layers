import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, Sparkles, ArrowUp, Store, Cake, User, ShoppingBag } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#1E120B',
        color: '#FFFFFF',
        marginTop: 'auto',
        borderTop: '1px solid #362217',
      }}
    >
      {/* Guarantees Bar */}
      <div
        id="guarantees"
        style={{
          borderBottom: '1px solid #362217',
          padding: '2.5rem 0',
          backgroundColor: '#160C07',
        }}
      >
        <div className="container">
          <div
            className="grid grid-cols-3 md-grid-cols-1"
            style={{ gap: '2rem', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201, 59, 103, 0.2)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <Sparkles size={22} />
              </div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                100% Artisan Crafted
              </h4>
              <p style={{ color: '#A08E84', fontSize: '0.85rem', maxWidth: '280px' }}>
                Every cake is made from scratch by vetted local pastry chefs across India using premium ingredients.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201, 59, 103, 0.2)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <Truck size={22} />
              </div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                Guaranteed Lead Time & Delivery
              </h4>
              <p style={{ color: '#A08E84', fontSize: '0.85rem', maxWidth: '280px' }}>
                Clear preparation days, scheduled delivery slots, and live stage-by-stage status tracking.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201, 59, 103, 0.2)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                Bakery Verified Reviews
              </h4>
              <p style={{ color: '#A08E84', fontSize: '0.85rem', maxWidth: '280px' }}>
                Authentic reviews submitted only by customers with confirmed delivered orders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{ padding: '3.5rem 0 2.5rem 0' }}>
        <div className="container">
          <div
            className="grid grid-cols-4 md-grid-cols-2 sm-grid-cols-1"
            style={{ gap: '2.5rem' }}
          >
            {/* Col 1: Brand Info */}
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <BrandLogo size={40} showText={true} textColor="#FFF" subtextColor="#E57399" />
              </div>
              <p style={{ color: '#A08E84', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                India's premier artisan bakery marketplace connecting discerning dessert lovers with passionate pastry artists for custom celebration tiers & signature bakes.
              </p>
              <button
                type="button"
                onClick={scrollToTop}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  backgroundColor: '#2A1A11',
                  color: '#D4AF37',
                  border: '1px solid #432A1C',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowUp size={14} />
                <span>Back to Top</span>
              </button>
            </div>

            {/* Col 2: Marketplace Navigation */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '0.95rem', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Artisan Marketplace
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', padding: 0, margin: 0 }}>
                <li>
                  <Link to="/bakeries" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    🏪 Discover All 18+ Bakeries
                  </Link>
                </li>
                <li>
                  <Link to="/cakes" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    🎂 Artisan Cakes Catalog
                  </Link>
                </li>
                <li>
                  <Link to="/custom-builder" onClick={handleLinkClick} style={{ color: '#E57399', fontWeight: 700, textDecoration: 'none' }}>
                    ✨ 3D Custom Cake Studio
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    ℹ️ How Ordering Works
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Account & Orders */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '0.95rem', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Customer Account
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', padding: 0, margin: 0 }}>
                <li>
                  <Link to="/profile" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    👤 Profile & Customization
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    📦 Track My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/cart" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    🛍️ Shopping Cart & Bag
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    🔑 Customer Login & Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: For Bakeries & Administrators */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '0.95rem', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                For Bakers & Partners
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', padding: 0, margin: 0 }}>
                <li>
                  <Link to="/register?role=BAKERY" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    🧁 Register Your Bakery
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    🚪 Bakery Partner Portal
                  </Link>
                </li>
                <li>
                  <Link to="/bakery/dashboard" onClick={handleLinkClick} style={{ color: '#B5A49B', transition: 'color 0.2s', textDecoration: 'none' }}>
                    📊 Baker Management Console
                  </Link>
                </li>
                <li>
                  <Link to="/admin/dashboard" onClick={handleLinkClick} style={{ color: '#8A7B72', transition: 'color 0.2s', textDecoration: 'none' }}>
                    🛡️ Platform Administration
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid #362217',
              marginTop: '3rem',
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.8rem',
              color: '#806E65',
            }}
          >
            <div>
              © {new Date().getFullYear()} Whisk & Layers India. Pan-India Artisan Confectionery Network.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Handcrafted with <Heart size={14} color="var(--primary)" fill="var(--primary)" /> for dessert lovers and artisan bakers.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
