import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bakery } from '../../types';
import { bakeryApi } from '../../services/bakeryApi';
import { StarRating } from '../../components/ui/StarRating';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { SafeImage } from '../../components/ui/SafeImage';
import { Search, MapPin, Clock, Filter, ArrowUpDown } from 'lucide-react';

export const BakeriesPage: React.FC = () => {
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rating');

  const fetchBakeries = async () => {
    setLoading(true);
    try {
      const res = await bakeryApi.getAll({
        search: search.trim() || undefined,
        city: city || undefined,
        sortBy: sortBy as any,
        limit: 20,
      });
      setBakeries(res.bakeries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBakeries();
  }, [city, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBakeries();
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Artisan Partners
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--text-main)', marginTop: '0.35rem' }}>
            Explore Verified Bakeries
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.35rem' }}>
            Discover passionate local confectionery chefs and pastry houses in your area.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            padding: '1.25rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flex: 1,
              minWidth: '260px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.85rem',
            }}
          >
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by bakery name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* City Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="var(--text-muted)" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
                style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="">All Locations</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Oakland">Oakland, CA</option>
                <option value="Berkeley">Berkeley, CA</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowUpDown size={16} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control"
                style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="name">Bakery Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-3 md-grid-cols-1" style={{ gap: '2rem' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <Skeleton height="190px" borderRadius="0" />
                <div style={{ padding: '1.5rem' }}>
                  <Skeleton height="24px" width="70%" style={{ marginBottom: '0.75rem' }} />
                  <Skeleton height="16px" width="90%" style={{ marginBottom: '0.5rem' }} />
                  <Skeleton height="16px" width="50%" />
                </div>
              </div>
            ))}
          </div>
        ) : bakeries.length === 0 ? (
          <EmptyState
            title="No Bakeries Found"
            description="We couldn't find any bakeries matching your filter criteria. Try clearing the search query or location filter."
            actionText="Clear Filters"
            onAction={() => {
              setSearch('');
              setCity('');
              setSortBy('rating');
            }}
            icon="bakery"
          />
        ) : (
          <div className="grid grid-cols-3 md-grid-cols-1" style={{ gap: '2rem' }}>
            {bakeries.map((bakery) => (
              <div
                key={bakery.id}
                className="card card-interactive"
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', height: '200px' }}>
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
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <StarRating rating={bakery.rating_avg} count={bakery.review_count} size={14} />
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span>{bakery.city}, {bakery.state}</span>
                    <span>·</span>
                    <Clock size={14} />
                    <span>Min {bakery.minimum_lead_days} Days Lead</span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    {bakery.name}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                    {bakery.tagline || bakery.description.slice(0, 110) + '...'}
                  </p>

                  <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {bakery.specialties?.split(',').map((spec, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: 'var(--bg-muted)',
                          color: 'var(--text-muted)',
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      {bakery.address}
                    </span>
                    <Link to={`/bakeries/${bakery.slug}`} className="btn btn-primary btn-sm">
                      View Storefront
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
