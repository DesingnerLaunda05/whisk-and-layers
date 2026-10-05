import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, Review } from '../../types';
import { orderApi } from '../../services/orderApi';
import { reviewApi } from '../../services/reviewApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { OrderTimeline } from '../../components/ui/OrderTimeline';
import { StarRating } from '../../components/ui/StarRating';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { SafeImage } from '../../components/ui/SafeImage';
import {
  Calendar,
  MapPin,
  Phone,
  Store,
  MessageSquare,
  Star,
  ChevronLeft,
  Clock,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await orderApi.getOne(parseInt(id, 10));
      setOrder(res);
      if (res.review) {
        setExistingReview(res.review);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (!comment.trim() || comment.trim().length < 5) {
      error('Please provide a review comment of at least 5 characters.');
      return;
    }

    setSubmittingReview(true);
    try {
      const rev = await reviewApi.create({
        orderId: order.id,
        rating,
        comment: comment.trim(),
      });
      setExistingReview(rev);
      setShowReviewModal(false);
      success('Thank you! Your verified review has been posted.');
    } catch (err: any) {
      error(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <Skeleton height="160px" style={{ marginBottom: '2rem' }} />
        <Skeleton height="350px" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <EmptyState
          title="Order Not Found"
          description="We couldn't retrieve the details for this order."
          actionText="Back to My Orders"
          actionLink="/my-orders"
          icon="cake"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to={user?.role === 'BAKERY' ? '/bakery/orders' : '/my-orders'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <ChevronLeft size={16} />
            <span>{user?.role === 'BAKERY' ? 'Back to Bakery Orders' : 'Back to My Orders'}</span>
          </Link>
        </div>

        {/* Top Order Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-light)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', margin: 0 }}>
                  Order #{order.order_number}
                </h1>
                <StatusBadge status={order.status} />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Placed on {new Date(order.created_at).toLocaleString()}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                ${order.total_amount.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                Payment: {order.payment_method === 'PAY_ON_DELIVERY' ? 'Pay on Delivery' : 'Direct Invoice'} ({order.payment_status})
              </div>
            </div>
          </div>

          {/* Visual Order Lifecycle Timeline */}
          <OrderTimeline status={order.status} rejectionReason={order.rejection_reason} />

          {/* If DELIVERED and customer hasn't reviewed yet, show verified review CTA */}
          {order.status === 'DELIVERED' && user?.role === 'CUSTOMER' && !existingReview && (
            <div
              style={{
                backgroundColor: '#EAF5EE',
                border: '1px solid #BBF7D0',
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2C5E43', marginBottom: '0.2rem' }}>
                  How was your custom cake experience?
                </div>
                <div style={{ fontSize: '0.82rem', color: '#2C5E43' }}>
                  Share your verified feedback to help other dessert lovers discover great local bakers!
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#2C5E43', borderColor: '#2C5E43' }}
              >
                Write Verified Review
              </button>
            </div>
          )}

          {/* If review already exists */}
          {existingReview && (
            <div
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginTop: '1.5rem',
                border: '1px solid var(--border-light)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>Your Submitted Review</span>
                <StarRating rating={existingReview.rating} size={15} />
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                "{existingReview.comment}"
              </p>
              {existingReview.reply_comment && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#FFF', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)' }}>Bakery Reply:</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{existingReview.reply_comment}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Details Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="order-detail-split"
        >
          {/* Left: Items Snapshot */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              Cake Configuration ({order.items?.length} items)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {order.items?.map((item) => {
                let parsedOptions: Record<string, string> | null = null;
                if (item.selected_options) {
                  try {
                    parsedOptions = typeof item.selected_options === 'string' ? JSON.parse(item.selected_options) : item.selected_options;
                  } catch {}
                }

                return (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
                    <SafeImage
                      src={item.cake_image}
                      alt={item.cake_name}
                      fallbackType="cake"
                      style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{item.cake_name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Qty: {item.quantity}</span>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>

                      {parsedOptions && (
                        <div
                          style={{
                            backgroundColor: 'var(--bg-muted)',
                            borderRadius: '8px',
                            padding: '0.6rem',
                            marginTop: '0.6rem',
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.2rem',
                          }}
                        >
                          {Object.entries(parsedOptions).map(([k, v]) => (
                            <div key={k}>
                              <strong style={{ textTransform: 'capitalize' }}>{k}:</strong> {String(v)}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.custom_message && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.4rem' }}>
                          Inscription: "{item.custom_message}"
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Table */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Delivery Fee:</span>
                <span>${order.delivery_fee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Tax:</span>
                <span>${order.tax_amount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-medium)', paddingTop: '0.75rem', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right: Delivery & Bakery Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Delivery Info */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                Delivery Schedule
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Delivery Date:</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="var(--primary)" />
                    <span>{order.delivery_date} ({order.delivery_time_slot || 'Standard'})</span>
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Address:</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{order.delivery_address}</span>
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Customer Contact:</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={15} color="var(--primary)" />
                    <span>{order.customer_name} ({order.customer_phone})</span>
                  </div>
                </div>

                {order.special_instructions && (
                  <div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Special Instructions:</div>
                    <div style={{ color: 'var(--text-muted)' }}>{order.special_instructions}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bakery Info */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                Artisan Bakery
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                <Store size={18} color="var(--primary)" />
                <span>{order.bakery_name}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {order.bakery_address}
              </p>
              {order.bakery_phone && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Phone: {order.bakery_phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Write a Verified Review
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your feedback for order #{order.order_number} by <strong>{order.bakery_name}</strong>.
            </p>

            <form onSubmit={handleSubmitReview}>
              <div className="form-group" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem' }}>Select Star Rating</label>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <StarRating rating={rating} interactive size={28} onChange={(r) => setRating(r)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review Comment *</label>
                <textarea
                  required
                  rows={4}
                  className="form-control"
                  placeholder="Tell us about the flavor, presentation, delivery timing, and texture..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn btn-primary"
                >
                  {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .order-detail-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
