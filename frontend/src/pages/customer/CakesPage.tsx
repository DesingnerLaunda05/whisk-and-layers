import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cake, CakeCategory } from '../../types';
import { cakeApi } from '../../services/cakeApi';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { SafeImage } from '../../components/ui/SafeImage';
import { Search, Filter, Sparkles, Store, Clock, ArrowUpDown } from 'lucide-react';
import { formatINR } from '../../utils/indiaConstants';

export const CakesPage: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<CakeCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');
  const [customizableOnly, setCustomizableOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  const fetchCakes = async () => {
    setLoading(true);
    try {
      const [cakesRes, catRes] = await Promise.all([
        cakeApi.getAll({
          categoryId: selectedCategory || undefined,
          search: search.trim() || undefined,
          customizable: customizableOnly ? true : undefined,
          sortBy,
          limit: 30,
        }),
        cakeApi.getCategories(),
      ]);

      setCakes(cakesRes.cakes);
      setCategories(catRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, [selectedCategory, customizableOnly, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCakes();
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Artisan Confectionery
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--text-main)', marginTop: '0.35rem' }}>
            Browse Artisan Cakes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.35rem' }}>
            Explore masterfully baked signature recipes or pick customizable bases to style in our custom studio.
          </p>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.75rem',
          }}
        >
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: selectedCategory === null ? 700 : 500,
              fontSize: '0.875rem',
              backgroundColor: selectedCategory === null ? 'var(--primary)' : 'var(--bg-surface)',
              color: selectedCategory === null ? '#FFFFFF' : 'var(--text-main)',
              border: '1px solid ' + (selectedCategory === null ? 'var(--primary)' : 'var(--border-medium)'),
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)',
            }}
          >
            All Cakes
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.875rem',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  border: '1px solid ' + (isSelected ? 'var(--primary)' : 'var(--border-medium)'),
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            padding: '1rem 1.25rem',
            marginBottom: '2.5rem',
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
              placeholder="Search cakes by name or ingredient..."
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

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Customizable Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              <input
                type="checkbox"
                checked={customizableOnly}
                onChange={(e) => setCustomizableOnly(e.target.checked)}
              />
              <span>Customizable Only</span>
            </label>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowUpDown size={15} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="newest">Newest Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Cake Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cakes Grid */}
        {loading ? (
          <div className="grid grid-cols-3 md-grid-cols-2 sm-grid-cols-1" style={{ gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <Skeleton height="210px" borderRadius="0" />
                <div style={{ padding: '1.25rem' }}>
                  <Skeleton height="20px" width="80%" style={{ marginBottom: '0.5rem' }} />
                  <Skeleton height="15px" width="60%" style={{ marginBottom: '1rem' }} />
                  <Skeleton height="28px" width="40%" />
                </div>
              </div>
            ))}
          </div>
        ) : cakes.length === 0 ? (
          <EmptyState
            title="No Cakes Found"
            description="We couldn't find any cakes matching your current filters."
            actionText="Reset All Filters"
            onAction={() => {
              setSelectedCategory(null);
              setSearch('');
              setCustomizableOnly(false);
              setSortBy('newest');
            }}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <Link
                      to={`/bakeries/${cake.bakery_id}`}
                      style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}
                    >
                      {cake.bakery_name}
                    </Link>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      {cake.name.toLowerCase().includes('eggless') && (
                        <span style={{ fontSize: '0.65rem', backgroundColor: '#EAF5EE', color: '#2C5E43', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                          🟢 Eggless
                        </span>
                      )}
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {cake.preparation_days}d prep
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    {cake.name}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                    {cake.description.slice(0, 110)}...
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block' }}>Base Price</span>
                      <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                        {formatINR(cake.base_price)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link to={`/cakes/${cake.slug}`} className="btn btn-primary btn-sm">
                        View & Order
                      </Link>
                    </div>
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
