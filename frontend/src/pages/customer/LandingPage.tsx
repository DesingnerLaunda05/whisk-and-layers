import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bakery, Cake } from '../../types';
import { bakeryApi } from '../../services/bakeryApi';
import { cakeApi } from '../../services/cakeApi';
import { StarRating } from '../../components/ui/StarRating';
import { SafeImage } from '../../components/ui/SafeImage';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
  Store,
  MapPin,
  Clock,
  ChevronRight,
  Palette,
  CheckCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [popularCakes, setPopularCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bakeryRes, cakeRes] = await Promise.all([
          bakeryApi.getAll({ limit: 3, sortBy: 'rating' }),
          cakeApi.getAll({ limit: 4, available: true }),
        ]);
        setBakeries(bakeryRes.bakeries);
        setPopularCakes(cakeRes.cakes);
      } catch (err) {
        console.error('Failed to load landing page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          padding: '4.5rem 0 4rem 0',
          backgroundColor: '#FDFBF7',
          borderBottom: '1px solid var(--border-light)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 0.85fr',
              gap: '3.5rem',
              alignItems: 'center',
            }}
            className="hero-grid"
          >
            {/* Left Hero Text */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={14} />
                <span>The Artisan Bakery Marketplace</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem',
                  color: 'var(--text-main)',
                }}
              >
                Your cake. <br />
                <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Your way.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.65,
                  marginBottom: '2rem',
                  maxWidth: '540px',
                }}
              >
                Discover local pastry chefs, explore signature handcrafted recipes, or design your bespoke celebratory cake from sponge to floral piping.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link to="/bakeries" className="btn btn-primary btn-lg">
                  <span>Explore Bakeries</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/custom-builder" className="btn btn-secondary btn-lg">
                  <Palette size={18} color="var(--primary)" />
                  <span>Create Your Cake</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div
                style={{
                  display: 'flex',
                  gap: '1.75rem',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-medium)',
                  paddingTop: '1.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  <CheckCircle size={16} color="var(--primary)" />
                  <span>Vetted Pastry Chefs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  <CheckCircle size={16} color="var(--primary)" />
                  <span>Direct Bakery Confirmation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  <CheckCircle size={16} color="var(--primary)" />
                  <span>Guaranteed Freshness</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  position: 'relative',
                }}
              >
                <SafeImage
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&auto=format&fit=crop&q=80"
                  alt="Artisan cake with rich ganache"
                  fallbackType="cake"
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(32,19,13,0.85) 0%, transparent 60%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    left: '1.5rem',
                    right: '1.5rem',
                    color: '#FFFFFF',
                  }}
                >
                  <span className="badge" style={{ backgroundColor: '#D4AF37', color: '#20130D', marginBottom: '0.5rem' }}>
                    Featured Creation
                  </span>
                  <h3 style={{ color: '#FFF', fontSize: '1.3rem', marginBottom: '0.25rem' }}>
                    Belgian Triple Chocolate Fudge Showstopper
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#EBE3D8' }}>By Velvet & Layer Confectionery</span>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#FFF' }}>$72.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 860px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
              gap: 2.5rem !important;
            }
          }
        `}</style>
      </section>

      {/* 2. HOW ORDERING WORKS */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Simple & Transparent
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.4rem', color: 'var(--text-main)' }}>
              How Whisk & Layers Works
            </h2>
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
              We eliminate the guesswork from ordering custom cakes with clear timelines and direct baker coordination.
            </p>
          </div>

          <div className="grid grid-cols-3 md-grid-cols-1" style={{ gap: '2rem' }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Discover Local Bakeries</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Browse verified artisan bakeries in your city, read genuine customer reviews, and view their signature catalog.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid var(--primary)' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Choose or Customize</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Select a ready-to-order signature cake or use our guided studio to choose sponge bases, icings, fillings, size, and message.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Track Fresh Delivery</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Receive instant confirmation, track preparation milestones, and enjoy hand-delivered freshness for your celebration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED BAKERIES */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#F8F4EE' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Handpicked Partners
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.35rem', color: 'var(--text-main)' }}>
                Featured Artisan Bakeries
              </h2>
            </div>
            <Link to="/bakeries" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>View All Bakeries</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-3 md-grid-cols-1" style={{ gap: '2rem' }}>
            {bakeries.map((bakery) => (
              <div key={bakery.id} className="card card-interactive" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '180px' }}>
                  <SafeImage
                    src={bakery.banner_url}
                    alt={bakery.name}
                    fallbackType="bakery-banner"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <StarRating rating={bakery.rating_avg} count={bakery.review_count} size={14} />
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span>{bakery.city}, {bakery.state}</span>
                    <span>·</span>
                    <Clock size={14} />
                    <span>{bakery.minimum_lead_days} Days Lead</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                    {bakery.name}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                    {bakery.tagline || bakery.description.slice(0, 110) + '...'}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      Specialties: {bakery.specialties ? bakery.specialties.split(',')[0] : 'Custom Cakes'}
                    </span>
                    <Link to={`/bakeries/${bakery.slug}`} className="btn btn-primary btn-sm">
                      View Bakery
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR SIGNATURE CAKES */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Bestsellers & Showpieces
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.35rem', color: 'var(--text-main)' }}>
                Popular Signature Cakes
              </h2>
            </div>
            <Link to="/cakes" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Browse All Cakes</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-4 md-grid-cols-2 sm-grid-cols-1" style={{ gap: '1.75rem' }}>
            {popularCakes.map((cake) => (
              <div key={cake.id} className="card card-interactive" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '210px' }}>
                  <SafeImage
                    src={cake.image_url}
                    alt={cake.name}
                    fallbackType="cake"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {cake.is_customizable === 1 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        backgroundColor: '#D97736',
                        color: '#FFF',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Customizable
                    </span>
                  )}
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                    {cake.bakery_name}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                    {cake.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1, lineHeight: 1.4 }}>
                    {cake.description.slice(0, 75)}...
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>From</span>
                      <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
                        ${cake.base_price.toFixed(2)}
                      </span>
                    </div>
                    <Link to={`/cakes/${cake.slug}`} className="btn btn-secondary btn-sm">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CUSTOM CAKE STUDIO BANNER */}
      <section style={{ padding: '4rem 0', backgroundColor: '#20130D', color: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '3rem',
              alignItems: 'center',
            }}
            className="custom-banner-grid"
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(212,175,55,0.2)',
                  color: '#D4AF37',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}
              >
                <Palette size={14} />
                <span>Interactive 8-Step Studio</span>
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#FFF', lineHeight: 1.2, marginBottom: '1rem' }}>
                Design Your Dream Cake, Layer by Layer
              </h2>
              <p style={{ color: '#A08E84', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '520px' }}>
                Choose your sponge base, decadent fillings, size tiers, artisanal icings, handcrafted toppings, Lambeth scrollwork, and custom celebration inscription with instant transparent pricing.
              </p>
              <Link to="/custom-builder" className="btn btn-primary btn-lg">
                Launch Custom Cake Studio
              </Link>
            </div>

            <div
              style={{
                backgroundColor: '#2E1D15',
                borderRadius: '20px',
                border: '1px solid #442C20',
                padding: '1.75rem',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#D4AF37', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Studio Step Highlights
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EBE3D8' }}>
                  <CheckCircle size={16} color="#D4AF37" />
                  <span>Step 1 & 2: Artisan Sponge & Slow-Simmered Compotes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EBE3D8' }}>
                  <CheckCircle size={16} color="#D4AF37" />
                  <span>Step 3 & 4: Size Servings (6" to Tiered) & Heart/Square Contours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EBE3D8' }}>
                  <CheckCircle size={16} color="#D4AF37" />
                  <span>Step 5 & 6: Swiss Meringue Buttercream, Ganache & Fresh Figs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EBE3D8' }}>
                  <CheckCircle size={16} color="#D4AF37" />
                  <span>Step 7 & 8: Vintage Lambeth Piping & Free Inscription Lettering</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 860px) {
            .custom-banner-grid {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
};
