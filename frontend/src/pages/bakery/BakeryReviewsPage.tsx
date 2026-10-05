import React, { useEffect, useState } from 'react';
import { reviewApi } from '../../services/reviewApi';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../types';
import { StarRating } from '../../components/ui/StarRating';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { SafeImage } from '../../components/ui/SafeImage';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Reply, CheckCircle2 } from 'lucide-react';

export const BakeryReviewsPage: React.FC = () => {
  const { bakery } = useAuth();
  const { success, error } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);

  const fetchReviews = async () => {
    if (!bakery) return;
    setLoading(true);
    try {
      const res = await reviewApi.getBakeryReviews(bakery.id);
      setReviews(res.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bakery]);

  const handleSendReply = async (reviewId: number) => {
    if (!replyText.trim() || replyText.trim().length < 2) {
      error('Please write a reply before submitting.');
      return;
    }

    setSubmittingReply(true);
    try {
      const updated = await reviewApi.reply(reviewId, replyText.trim());
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, reply_comment: replyText.trim() } : r))
      );
      setReplyingId(null);
      setReplyText('');
      success('Your reply was posted successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to submit reply.');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)' }}>Customer Reviews & Ratings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Engage directly with verified customers who ordered from your bakery.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[1, 2].map((n) => (
            <Skeleton key={n} height="130px" borderRadius="14px" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No Reviews Yet"
          description="Customer reviews will appear here once your completed orders are delivered and reviewed."
          icon="cake"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <SafeImage
                    src={rev.customer_avatar}
                    alt={rev.customer_name || 'Customer'}
                    fallbackType="avatar"
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {rev.customer_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      Order Review · {new Date(rev.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <StarRating rating={rev.rating} size={16} />
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0.75rem 0' }}>
                "{rev.comment}"
              </p>

              {/* Reply Section */}
              {rev.reply_comment ? (
                <div
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: '10px',
                    padding: '1rem',
                    borderLeft: '3px solid var(--primary)',
                    marginTop: '1rem',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>
                    Your Bakery's Public Reply:
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {rev.reply_comment}
                  </p>
                </div>
              ) : replyingId === rev.id ? (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <textarea
                    rows={3}
                    className="form-control"
                    placeholder="Write a warm, gracious response to your customer..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setReplyingId(null)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={submittingReply}
                      onClick={() => handleSendReply(rev.id)}
                      className="btn btn-primary btn-sm"
                    >
                      {submittingReply ? 'Sending...' : 'Post Reply'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setReplyingId(rev.id);
                      setReplyText('');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Reply size={14} />
                    <span>Reply to Customer</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
