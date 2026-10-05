import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Heart, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#20130D',
        color: '#FFFFFF',
        marginTop: 'auto',
        borderTop: '1px solid #362217',
      }}
    >
      {/* Guarantees Bar */}
      <div
        style={{
          borderBottom: '1px solid #362217',
          padding: '2.5rem 0',
          backgroundColor: '#190E09',
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
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(200, 90, 23, 0.2)',
                  color: '#D97736',
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
                Every cake is made from scratch by vetted local pastry chefs using premium ingredients.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(200, 90, 23, 0.2)',
                  color: '#D97736',
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
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(200, 90, 23, 0.2)',
                  color: '#D97736',
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
            {/* Col 1 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Cake size={18} />
                </div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                  Whisk & Layers
                </span>
              </div>
              <p style={{ color: '#A08E84', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Connecting discerning dessert lovers with passionate local pastry artists for signature prebuilt bakes and bespoke custom creations.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Explore Marketplace
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <li><Link to="/bakeries" style={{ color: '#A08E84' }}>Discover All Bakeries</Link></li>
                <li><Link to="/cakes" style={{ color: '#A08E84' }}>Artisan Cakes Catalog</Link></li>
                <li><Link to="/custom-builder" style={{ color: '#D97736', fontWeight: 600 }}>Custom Cake Studio</Link></li>
                <li><Link to="/how-it-works" style={{ color: '#A08E84' }}>How Ordering Works</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                For Bakeries & Partners
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <li><Link to="/register?role=BAKERY" style={{ color: '#A08E84' }}>Register Your Bakery</Link></li>
                <li><Link to="/login" style={{ color: '#A08E84' }}>Bakery Partner Portal</Link></li>
                <li><Link to="/how-it-works" style={{ color: '#A08E84' }}>Custom Order Fulfillment</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Whisk & Layers Promise
              </h4>
              <p style={{ color: '#A08E84', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Every order is protected by our freshness guarantee and directly coordinated with master pastry chefs in your neighborhood.
              </p>
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
              © {new Date().getFullYear()} Whisk & Layers Technologies Inc. All rights reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Crafted with <Heart size={14} color="#D97736" fill="#D97736" /> for dessert lovers and artisan bakers.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
