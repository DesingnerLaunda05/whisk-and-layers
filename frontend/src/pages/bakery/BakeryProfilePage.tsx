import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bakeryApi } from '../../services/bakeryApi';
import { useToast } from '../../context/ToastContext';
import { Store, MapPin, Phone, Mail, Clock, Save, Image as ImageIcon } from 'lucide-react';

export const BakeryProfilePage: React.FC = () => {
  const { bakery, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [specialties, setSpecialties] = useState<string>('');
  const [minimumLeadDays, setMinimumLeadDays] = useState<number>(2);

  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (bakery) {
      setName(bakery.name || '');
      setTagline(bakery.tagline || '');
      setDescription(bakery.description || '');
      setAddress(bakery.address || '');
      setCity(bakery.city || '');
      setState(bakery.state || '');
      setPostalCode(bakery.postal_code || '');
      setPhone(bakery.phone || '');
      setEmail(bakery.email || '');
      setLogoUrl(bakery.logo_url || '');
      setBannerUrl(bakery.banner_url || '');
      setSpecialties(bakery.specialties || '');
      setMinimumLeadDays(bakery.minimum_lead_days || 2);
    }
  }, [bakery]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !address.trim()) {
      error('Please complete all required storefront fields.');
      return;
    }

    setSaving(true);
    try {
      await bakeryApi.updateMyBakery({
        name: name.trim(),
        tagline: tagline.trim() || null,
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        postal_code: postalCode.trim(),
        phone: phone.trim(),
        email: email.trim(),
        logo_url: logoUrl.trim() || null,
        banner_url: bannerUrl.trim() || null,
        specialties: specialties.trim() || null,
        minimum_lead_days: minimumLeadDays,
      });
      await refreshProfile();
      success('Bakery storefront profile updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update bakery profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '780px' }}>
      <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
        Bakery Storefront Profile
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Configure how your bakery appears on Whisk & Layers public discovery and cake product pages.
      </p>

      <form onSubmit={handleSave}>
        {/* Bakery Name */}
        <div className="form-group">
          <label className="form-label">Bakery Brand Name *</label>
          <input
            type="text"
            required
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Tagline */}
        <div className="form-group">
          <label className="form-label">Catchy Tagline</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. French-inspired layered confectionery & bespoke wedding towers"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">About the Bakery / Story *</label>
          <textarea
            required
            rows={4}
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label className="form-label">Street Address *</label>
          <input
            type="text"
            required
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 md-grid-cols-1" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">City *</label>
            <input
              type="text"
              required
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">State *</label>
            <input
              type="text"
              required
              className="form-control"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Postal Code *</label>
            <input
              type="text"
              required
              className="form-control"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Contact Phone *</label>
            <input
              type="tel"
              required
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Public Inquiries Email *</label>
            <input
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Minimum Lead Time */}
        <div className="form-group">
          <label className="form-label">Minimum Lead Time for Advance Orders (Days) *</label>
          <input
            type="number"
            min="1"
            max="14"
            required
            className="form-control"
            value={minimumLeadDays}
            onChange={(e) => setMinimumLeadDays(parseInt(e.target.value, 10) || 2)}
          />
        </div>

        {/* Specialties */}
        <div className="form-group">
          <label className="form-label">Specialties (Comma Separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Vintage Lambeth, Wedding Towers, Organic Sponges, Gluten-Friendly"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
          />
        </div>

        {/* Imagery */}
        <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Logo Image URL</label>
            <input
              type="url"
              className="form-control"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Banner URL</label>
            <input
              type="url"
              className="form-control"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
