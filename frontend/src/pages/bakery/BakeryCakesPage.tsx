import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cakeApi } from '../../services/cakeApi';
import { Cake } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { SafeImage } from '../../components/ui/SafeImage';
import {
  Plus,
  Edit2,
  Trash2,
  Cake as CakeIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '../../utils/indiaConstants';

export const BakeryCakesPage: React.FC = () => {
  const { bakery } = useAuth();
  const { success, error } = useToast();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCakes = async () => {
    if (!bakery) return;
    setLoading(true);
    try {
      const res = await cakeApi.getAll({ bakeryId: bakery.id, available: undefined });
      setCakes(res.cakes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, [bakery]);

  const handleToggleAvailability = async (cake: Cake) => {
    try {
      const updated = await cakeApi.update(cake.id, { isAvailable: cake.is_available !== 1 });
      setCakes((prev) => prev.map((c) => (c.id === cake.id ? { ...c, is_available: cake.is_available === 1 ? 0 : 1 } : c)));
      success(`Updated "${cake.name}" availability.`);
    } catch (err: any) {
      error(err.message || 'Failed to update cake.');
    }
  };

  const handleDelete = async (cake: Cake) => {
    if (!window.confirm(`Are you sure you want to deactivate "${cake.name}"? Existing historical orders will be preserved.`)) {
      return;
    }
    try {
      await cakeApi.delete(cake.id);
      setCakes((prev) => prev.filter((c) => c.id !== cake.id));
      success(`"${cake.name}" deactivated.`);
    } catch (err: any) {
      error(err.message || 'Failed to delete cake.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)' }}>Bakery Cake Listings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage your signature cakes, prices, preparation lead times, and custom base offerings.
          </p>
        </div>

        <Link to="/bakery/cakes/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={18} />
          <span>Add New Cake</span>
        </Link>
      </div>

      {/* Cakes Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} height="90px" borderRadius="12px" />
          ))}
        </div>
      ) : cakes.length === 0 ? (
        <EmptyState
          title="No Cakes Listed Yet"
          description="Add your first signature prebuilt or customizable cake canvas to start receiving customer orders."
          actionText="Create New Cake"
          actionLink="/bakery/cakes/new"
          icon="cake"
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Cake</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Base Price</th>
                  <th style={{ padding: '1rem' }}>Prep Time</th>
                  <th style={{ padding: '1rem' }}>Customizable</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cakes.map((cake) => (
                  <tr key={cake.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    {/* Cake Image & Name */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <SafeImage
                          src={cake.image_url}
                          alt={cake.name}
                          fallbackType="cake"
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cake.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>/{cake.slug}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {cake.category_name || 'Signature'}
                    </td>

                    {/* Base Price */}
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                      {formatINR(cake.base_price)}
                    </td>

                    {/* Prep Time */}
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {cake.preparation_days} days
                    </td>

                    {/* Customizable */}
                    <td style={{ padding: '1rem' }}>
                      {cake.is_customizable === 1 ? (
                        <span className="badge" style={{ backgroundColor: '#FAF5FF', color: '#7E22CE' }}>
                          Custom Base
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Prebuilt</span>
                      )}
                    </td>

                    {/* Availability Toggle */}
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleToggleAvailability(cake)}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: cake.is_available === 1 ? '#2C5E43' : '#B92525',
                        }}
                      >
                        {cake.is_available === 1 ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        <span>{cake.is_available === 1 ? 'Available' : 'Paused'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link
                          to={`/bakery/cakes/edit/${cake.id}`}
                          className="btn btn-secondary btn-sm"
                          title="Edit Cake"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(cake)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--error)' }}
                          title="Deactivate Cake"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
