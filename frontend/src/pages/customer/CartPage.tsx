import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { EmptyState } from '../../components/ui/EmptyState';
import { SafeImage } from '../../components/ui/SafeImage';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Store,
  Clock,
  ShieldCheck,
  Cake,
  Palette,
} from 'lucide-react';
import { formatINR } from '../../utils/indiaConstants';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    taxAmount,
    total,
    activeBakeryName,
    maxLeadDays,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <EmptyState
          title="Your Cart is Empty"
          description="Explore our artisan bakeries or design your bespoke cake in our custom studio to get started."
          actionText="Discover Artisan Cakes"
          actionLink="/cakes"
          icon="cart"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)' }}>Your Cake Cart</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Review your selected artisan bakes and custom configurations ({itemCount} {itemCount === 1 ? 'item' : 'items'}).
            </p>
          </div>

          <button
            onClick={clearCart}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--error)', borderColor: 'var(--border-medium)' }}
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Bakery Fulfillment Banner */}
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid #FCD3B6',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Store size={20} color="var(--primary)" />
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Fulfilling Bakery: {activeBakeryName}
              </span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Freshly baked directly in this artisan partner's kitchen.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <Clock size={16} color="var(--primary)" />
            <span>Minimum {maxLeadDays} Days Preparation Lead</span>
          </div>
        </div>

        {/* Layout: Items List + Order Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 0.7fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="cart-grid"
        >
          {/* Left: Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  padding: '1.5rem',
                  position: 'relative',
                  flexWrap: 'wrap',
                }}
              >
                {/* Thumbnail */}
                <SafeImage
                  src={item.cakeImage}
                  alt={item.cakeName}
                  fallbackType="cake"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }}
                />

                {/* Details */}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
                          {item.cakeName}
                        </h3>
                        {item.isCustom && (
                          <span className="badge" style={{ backgroundColor: '#FAF5FF', color: '#7E22CE' }}>
                            Custom Build
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {item.bakeryName}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                        {formatINR(item.subtotal)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        {formatINR(item.unitPrice)} each
                      </div>
                    </div>
                  </div>

                  {/* Custom Configuration Snapshot */}
                  {item.selectedOptions && (
                    <div
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.75rem',
                        marginTop: '0.75rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                      }}
                    >
                      {Object.entries(item.selectedOptions).map(([key, val]) => (
                        <div key={key}>
                          <strong style={{ textTransform: 'capitalize' }}>{key}:</strong> {String(val)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inscription Message */}
                  {item.customMessage && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                      Inscription: "{item.customMessage}"
                    </div>
                  )}

                  {/* Quantity & Delete Controls */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-light)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#FFF',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '0.35rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ width: '28px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '0.35rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--error)',
                        fontSize: '0.8rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              position: 'sticky',
              top: '120px',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatINR(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Hand Delivery Fee</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatINR(deliveryFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>GST (5%)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatINR(taxAmount)}</span>
              </div>

              <div
                style={{
                  borderTop: '2px solid var(--border-medium)',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Estimated Total</span>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                  {formatINR(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg btn-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-light)', textAlign: 'center' }}>
              <ShieldCheck size={14} color="var(--primary)" />
              <span>Direct communication with bakery staff</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
