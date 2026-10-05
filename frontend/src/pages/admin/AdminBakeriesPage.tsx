import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { Bakery } from '../../types';
import { StarRating } from '../../components/ui/StarRating';
import { Skeleton } from '../../components/ui/Skeleton';
import { SafeImage } from '../../components/ui/SafeImage';
import { useToast } from '../../context/ToastContext';
import { Store, CheckCircle2, XCircle, Search } from 'lucide-react';

export const AdminBakeriesPage: React.FC = () => {
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const { success, error } = useToast();

  const fetchBakeries = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBakeries({ search: search.trim() || undefined });
      setBakeries(res.bakeries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBakeries();
  }, []);

  const handleToggleApproval = async (b: Bakery) => {
    try {
      const nextState = b.is_approved !== 1;
      await adminApi.toggleBakeryApproval(b.id, nextState);
      setBakeries((prev) => prev.map((item) => (item.id === b.id ? { ...item, is_approved: nextState ? 1 : 0 } : item)));
      success(`Bakery "${b.name}" ${nextState ? 'approved' : 'disapproved'}.`);
    } catch (err: any) {
      error(err.message || 'Failed to update approval status.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)' }}>Manage Bakeries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Approve new bakery registrations, review ratings, and moderate merchant storefronts.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); fetchBakeries(); }} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search bakeries..."
            className="form-control"
            style={{ width: '220px', padding: '0.45rem 0.75rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => <Skeleton key={n} height="80px" borderRadius="12px" />)}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Bakery</th>
                  <th style={{ padding: '1rem' }}>Location</th>
                  <th style={{ padding: '1rem' }}>Contact</th>
                  <th style={{ padding: '1rem' }}>Rating</th>
                  <th style={{ padding: '1rem' }}>Lead Days</th>
                  <th style={{ padding: '1rem' }}>Approval Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bakeries.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SafeImage
                          src={b.logo_url}
                          alt={b.name}
                          fallbackType="bakery-logo"
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{b.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>/{b.slug}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {b.city}, {b.state}
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <div>{b.email}</div>
                      <div>{b.phone}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <StarRating rating={b.rating_avg} count={b.review_count} size={14} />
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {b.minimum_lead_days} days
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span className="badge" style={{ backgroundColor: b.is_approved === 1 ? '#EAF5EE' : '#FEF6E6', color: b.is_approved === 1 ? '#2C5E43' : '#B26A00' }}>
                        {b.is_approved === 1 ? 'Approved' : 'Pending Approval'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleApproval(b)}
                        className={`btn btn-sm ${b.is_approved === 1 ? 'btn-secondary' : 'btn-primary'}`}
                      >
                        {b.is_approved === 1 ? 'Revoke Approval' : 'Approve Bakery'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
