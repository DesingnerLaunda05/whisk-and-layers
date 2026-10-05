import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Palette, Clock, CheckCircle2, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container container-narrow">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Seamless Ordering
          </span>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginTop: '0.4rem', marginBottom: '0.75rem' }}>
            How Whisk & Layers Works
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            The transparent bridge connecting cake lovers with passionate local pastry artists for prebuilt signatures and bespoke custom masterpieces.
          </p>
        </div>

        {/* 4 Pillars Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Step 1 */}
          <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Store size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Step 1
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
                Explore Local Bakeries & Reviews
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Every bakery on Whisk & Layers is independently verified. Review their kitchen location, specialty styles (such as Vintage Lambeth, botanical buttercreams, or tiered wedding towers), and read verified customer ratings.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Palette size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Step 2
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
                Order Signature Prebuilt or Launch Custom Studio
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Choose between instant ordering of famous house signatures or stepping into our 8-stage Custom Cake Studio. Personalize your sponge crumb, fruit filling reductions, multi-tier servings, exterior frosting finishes, toppings, and hand-lettered celebration inscriptions with live price transparency.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Clock size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Step 3
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
                Bakery Approval & Scheduled Preparation
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Once submitted, your order is reviewed by the master baker to guarantee schedule availability. You'll receive instant notification when accepted, followed by live status milestone tracking through Baking, Decorating, and Out for Delivery.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HeartHandshake size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Step 4
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
                Fresh Delivery & Verified Feedback
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Receive your freshly completed cake right on schedule. Settle payment via hand-delivery settlement or direct invoice, and post a verified customer review to support your local bakery community.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div
          style={{
            marginTop: '3.5rem',
            textAlign: 'center',
            backgroundColor: '#20130D',
            color: '#FFF',
            borderRadius: '20px',
            padding: '2.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.85rem', color: '#FFF', marginBottom: '0.75rem' }}>
            Ready to Celebrate with Fresh Artisan Cake?
          </h2>
          <p style={{ color: '#A08E84', fontSize: '0.95rem', marginBottom: '1.75rem', maxWidth: '480px', margin: '0 auto 1.75rem auto' }}>
            Browse local bakery catalogs or begin designing your custom creation now.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/bakeries" className="btn btn-primary">
              <span>Explore Bakeries</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/custom-builder" className="btn btn-secondary">
              <span>Custom Cake Studio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
