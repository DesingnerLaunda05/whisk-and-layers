import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { cakeApi } from '../../services/cakeApi';
import { Cake, CakeCategory } from '../../types';
import { useToast } from '../../context/ToastContext';
import { SafeImage } from '../../components/ui/SafeImage';
import { ChevronLeft, Upload, Cake as CakeIcon, Image as ImageIcon } from 'lucide-react';

export const BakeryCakeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [categories, setCategories] = useState<CakeCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(isEdit);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState<string>('');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [preparationDays, setPreparationDays] = useState<number>(2);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isCustomizable, setIsCustomizable] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await cakeApi.getCategories();
        setCategories(cats);

        if (isEdit && id) {
          const cake = await cakeApi.getOne(parseInt(id, 10));
          setName(cake.name);
          setCategoryId(cake.category_id || '');
          setDescription(cake.description);
          setBasePrice(cake.base_price);
          setPreparationDays(cake.preparation_days);
          setImageUrl(cake.image_url);
          setIsCustomizable(cake.is_customizable === 1);
          setIsAvailable(cake.is_available === 1);
        }
      } catch (err) {
        console.error(err);
        error('Failed to load cake data.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !imageUrl.trim() || !basePrice) {
      error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        categoryId: categoryId ? Number(categoryId) : null,
        description: description.trim(),
        basePrice: Number(basePrice),
        preparationDays: Number(preparationDays),
        imageUrl: imageUrl.trim(),
        isCustomizable,
        isAvailable,
      };

      if (isEdit && id) {
        await cakeApi.update(parseInt(id, 10), payload);
        success('Cake listing updated successfully!');
      } else {
        await cakeApi.create(payload);
        success('New cake listing created successfully!');
      }

      navigate('/bakery/cakes');
    } catch (err: any) {
      error(err.message || 'Failed to save cake.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', color: 'var(--text-muted)' }}>
        Loading cake details...
      </div>
    );
  }

  return (
    <div>
      {/* Back Link */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to="/bakery/cakes"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ChevronLeft size={16} />
          <span>Back to Cake Listings</span>
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem', maxWidth: '720px' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Cake Listing' : 'Create New Cake Listing'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Configure pricing, recipe description, lead preparation days, and visual presentation.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Cake Name */}
          <div className="form-group">
            <label className="form-label">Cake Title *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Raspberry Pistachio Velvet Cake"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
            {/* Category */}
            <div className="form-group">
              <label className="form-label">Cake Category</label>
              <select
                className="form-control"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Select Category (Optional)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Price */}
            <div className="form-group">
              <label className="form-label">Base Price ($ USD) *</label>
              <input
                type="number"
                step="0.50"
                min="5"
                required
                className="form-control"
                placeholder="e.g. 68.00"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
          </div>

          {/* Prep Lead Days */}
          <div className="form-group">
            <label className="form-label">Preparation Time (Days Lead Time) *</label>
            <input
              type="number"
              min="1"
              max="14"
              required
              className="form-control"
              value={preparationDays}
              onChange={(e) => setPreparationDays(parseInt(e.target.value, 10) || 1)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '3px' }}>
              Minimum number of advance notice days required before customers can select delivery.
            </span>
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label">Cake Image URL *</label>
            <input
              type="url"
              required
              className="form-control"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <SafeImage
                  src={imageUrl}
                  alt="Preview"
                  fallbackType="cake"
                  style={{ width: '120px', height: '120px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Recipe & Flavor Description *</label>
            <textarea
              required
              rows={4}
              className="form-control"
              placeholder="Describe the layers, sponge ingredients, frostings, toppings, and flavor profile in mouth-watering detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', margin: '1.5rem 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) => setIsCustomizable(e.target.checked)}
              />
              <span>Allow customers to customize this cake in the Custom Studio</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
              <span>Cake is active and available for ordering immediately</span>
            </label>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
            <Link to="/bakery/cakes" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Saving Cake...' : isEdit ? 'Update Cake Listing' : 'Publish Cake Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
