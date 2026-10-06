import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bakery, Cake, Review } from '../../types';
import { bakeryApi } from '../../services/bakeryApi';
import { StarRating } from '../../components/ui/StarRating';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { SafeImage } from '../../components/ui/SafeImage';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Palette,
  MessageSquare,
  Cake as CakeIcon,
  ChevronRight,
} from 'lucide-react';
import { formatINR, formatIndianDate } from '../../utils/indiaConstants';

export const BakeryDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [bakery, setBakery] = useState<Bakery | null>(null);
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'cakes' | 'reviews'>('cakes');

  useEffect(() => {
    const fetchBakery = async () => {
      if (!idOrSlug) return;
      setLoading(true);
      try {
        const res = await bakeryApi.getOne(idOrSlug);
        setBakery(res.bakery);
        setCakes(res.cakes);
        setReviews(res.reviews);
      } catch (err) {
        console.error('Failed to load bakery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBakery();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <Skeleton height="280px" borderRadius="16px" style={{ marginBottom: '2rem' }} />
        <Skeleton height="40px" width="40%" style={{ marginBottom: '1rem' }} />
        <Skeleton height="20px" width="70%" style={{ marginBottom: '2rem' }} />
      </div>
    );
  }

  if (!bakery) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <EmptyState
          title="Bakery Not Found"
          description="The bakery you are looking for may have been deactivated or the URL is incorrect."
          actionText="Browse All Bakeries"
          actionLink="/bakeries"
          icon="bakery"
        />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* 1. Bakery Hero Banner */}
      <div style={{ position: 'relative', backgroundColor: 'var(--bg-dark)', color: '#FFF' }}>
        <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
          <SafeImage
            src={bakery.banner_url}
            alt={bakery.name}
            fallbackType="bakery-banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(32,19,13,0.95) 0%, rgba(32,19,13,0.3) 100%)',
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', marginTop: '-120px', zIndex: 10, paddingBottom: '2rem' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '2rem',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Bakery Logo */}
              <SafeImage
                src={bakery.logo_url}
                alt={bakery.name}
                fallbackType="bakery-logo"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '3px solid #FFF',
                  boxShadow: 'var(--shadow-md)',
                }}
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', margin: 0 }}>
                    {bakery.name}
                  </h1>
                  <span className="badge" style={{ backgroundColor: '#EAF5EE', color: '#2C5E43' }}>
                    Verified Partner
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <StarRating rating={bakery.rating_avg} count={bakery.review_count} size={16} />
                  <span style={{ color: 'var(--text-light)' }}>·</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{bakery.address}, {bakery.city}, {bakery.state}</span>
                  </div>
                  <span style={{ color: 'var(--text-light)' }}>·</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Clock size={15} color="var(--primary)" />
                    <span>Min {bakery.minimum_lead_days} Days Lead</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '780px' }}>
                  {bakery.description}
                </p>

                {/* Specialties */}
                {bakery.specialties && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {bakery.specialties.split(',').map((s, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: 'var(--bg-muted)',
                          color: 'var(--text-main)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Order Callout Box */}
              <div
                style={{
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid #FCD3B6',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  minWidth: '240px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '0.35rem' }}>
                  Want something bespoke?
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Design sponge, flavors, and styling directly for this bakery.
                </p>
                <Link
                  to={`/custom-builder?bakeryId=${bakery.id}`}
                  className="btn btn-primary btn-sm btn-full"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Palette size={14} />
                  <span>Custom Cake Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="container" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-light)', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('cakes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              fontSize: '1rem',
              fontWeight: 700,
              color: activeTab === 'cakes' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'cakes' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <CakeIcon size={18} />
            <span>Cake Catalog ({cakes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              fontSize: '1rem',
              fontWeight: 700,
              color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'reviews' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <MessageSquare size={18} />
            <span>Customer Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* Tab 1: Cake Catalog */}
        {activeTab === 'cakes' && (
          <div>
            {cakes.length === 0 ? (
              <EmptyState
                title="No Cakes Currently Listed"
                description="This bakery has not added any cakes to their catalog yet."
                icon="cake"
              />
            ) : (
              <div className="grid grid-cols-3 md-grid-cols-2 sm-grid-cols-1" style={{ gap: '2rem' }}>
                {cakes.map((cake) => (
                  <div
                    key={cake.id}
                    className="card card-interactive"
                    style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ position: 'relative', height: '220px' }}>
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
                          }}
                        >
                          Customizable
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {cake.category_name || 'Signature Cake'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Prep: {cake.preparation_days} days
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        {cake.name}
                      </h3>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                        {cake.description.slice(0, 120)}...
                      </p>

                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Base Price</span>
                          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                            {formatINR(cake.base_price)}
                          </span>
                        </div>
                        <Link to={`/cakes/${cake.slug}`} className="btn btn-primary btn-sm">
                          View & Order
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div style={{ maxWidth: '800px' }}>
            {reviews.length === 0 ? (
              <EmptyState
                title="No Reviews Yet"
                description="Be the first customer to order from this bakery and share your sweet experience!"
                icon="cake"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.map((rev) => (
                  <div key={rev.id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SafeImage
                          src={rev.customer_avatar}
                          alt={rev.customer_name || 'Customer'}
                          fallbackType="avatar"
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                            {rev.customer_name}
                          </div>
                          <span className="badge" style={{ backgroundColor: '#EAF5EE', color: '#2C5E43', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                            Verified Purchase
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <StarRating rating={rev.rating} size={15} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                          {formatIndianDate(rev.created_at)}
                        </div>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: rev.reply_comment ? '1rem' : 0 }}>
                      "{rev.comment}"
                    </p>

                    {/* Bakery Owner Reply */}
                    {rev.reply_comment && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-muted)',
                          borderLeft: '3px solid var(--primary)',
                          borderRadius: '0 8px 8px 0',
                          padding: '0.9rem 1rem',
                          marginTop: '0.75rem',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>
                          Reply from {bakery.name}:
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          {rev.reply_comment}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
