import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Cake } from '../../types';
import { cakeApi } from '../../services/cakeApi';
import { useCart } from '../../context/CartContext';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { SafeImage } from '../../components/ui/SafeImage';
import {
  ShoppingBag,
  Palette,
  Clock,
  Store,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';

export const CakeDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [cake, setCake] = useState<Cake | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [customMessage, setCustomMessage] = useState<string>('');

  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCake = async () => {
      if (!idOrSlug) return;
      setLoading(true);
      try {
        const res = await cakeApi.getOne(idOrSlug);
        setCake(res);
      } catch (err) {
        console.error('Failed to load cake details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCake();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <Skeleton height="450px" borderRadius="16px" />
          <div>
            <Skeleton height="36px" width="70%" style={{ marginBottom: '1rem' }} />
            <Skeleton height="24px" width="30%" style={{ marginBottom: '1.5rem' }} />
            <Skeleton height="100px" style={{ marginBottom: '2rem' }} />
            <Skeleton height="50px" width="50%" />
          </div>
        </div>
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <EmptyState
          title="Cake Listing Not Found"
          description="The cake listing you are trying to view is unavailable or has been removed."
          actionText="Browse Cakes Catalog"
          actionLink="/cakes"
          icon="cake"
        />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      cakeId: cake.id,
      bakeryId: cake.bakery_id,
      bakeryName: cake.bakery_name || 'Artisan Bakery',
      cakeName: cake.name,
      cakeImage: cake.image_url,
      basePrice: cake.base_price,
      unitPrice: cake.base_price,
      quantity,
      isCustom: false,
      customMessage: customMessage.trim() || undefined,
      leadDays: cake.preparation_days,
    });
    navigate('/cart');
  };

  const handleCustomize = () => {
    navigate(`/custom-builder?cakeId=${cake.id}&bakeryId=${cake.bakery_id}`);
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/cakes" style={{ color: 'var(--text-muted)' }}>Cakes</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{cake.name}</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '3.5rem',
            alignItems: 'start',
          }}
          className="cake-detail-grid"
        >
          {/* Left: Image Showcase */}
          <div>
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-light)',
                backgroundColor: '#FFF',
                position: 'relative',
              }}
            >
              <SafeImage
                src={cake.image_url}
                alt={cake.name}
                fallbackType="cake"
                style={{ width: '100%', height: '480px', objectFit: 'cover' }}
              />
              {cake.is_customizable === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '1.25rem',
                    backgroundColor: 'var(--primary)',
                    color: '#FFF',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  Customizable Design Available
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Ordering Details */}
          <div>
            {/* Category & Bakery link */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {cake.category_name || 'Signature Cake'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Clock size={16} color="var(--primary)" />
                <span>{cake.preparation_days} Days Lead Time</span>
              </div>
            </div>

            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
              {cake.name}
            </h1>

            {/* Bakery Link Card */}
            <Link
              to={`/bakeries/${cake.bakery_id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-muted)',
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                fontWeight: 600,
                marginBottom: '1.5rem',
              }}
            >
              <Store size={15} color="var(--primary)" />
              <span>Baked by {cake.bakery_name || 'Local Artisan Bakery'}</span>
              <ChevronRight size={14} color="var(--text-light)" />
            </Link>

            {/* Price */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Starting Price</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                ${cake.base_price.toFixed(2)}
              </div>
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Artisan Recipe Description
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {cake.description}
              </p>
            </div>

            {/* Optional Free Hand-piped Inscription */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Free Celebration Inscription (Optional)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>e.g. "Happy 30th Elena!"</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Message piped on cake board or crown..."
                value={customMessage}
                maxLength={60}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Quantity:</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FFF',
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.5rem 0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ width: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '0.5rem 0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
              >
                <ShoppingBag size={20} />
                <span>Add Prebuilt Cake to Cart — ${(cake.base_price * quantity).toFixed(2)}</span>
              </button>

              {cake.is_customizable === 1 && (
                <button
                  onClick={handleCustomize}
                  className="btn btn-secondary btn-lg"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
                >
                  <Palette size={20} color="var(--primary)" />
                  <span>Customize Flavors, Size & Styling in Studio</span>
                </button>
              )}
            </div>

            {/* Reassurance */}
            <div
              style={{
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                gap: '1.5rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Freshly Baked to Order</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Bakery Acceptance Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cake-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};
