import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Store, User as UserIcon, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../../components/ui/BrandLogo';
import {
  INDIAN_STATES,
  INDIAN_CITIES,
  validateIndianPhone,
  validateIndianPin,
  normalizeIndianPhone,
} from '../../utils/indiaConstants';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'BAKERY' ? 'BAKERY' : 'CUSTOMER';

  const { register } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState<'CUSTOMER' | 'BAKERY'>(initialRole);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Bakery-specific fields (Indian defaults)
  const [bakeryName, setBakeryName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Ahmedabad');
  const [state, setState] = useState<string>('Gujarat');
  const [postalCode, setPostalCode] = useState<string>('380015');

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      error('Password must be at least 8 characters long.');
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone && !validateIndianPhone(cleanPhone)) {
      error('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    if (role === 'BAKERY') {
      if (!validateIndianPin(postalCode)) {
        error('Please enter a valid 6-digit Indian PIN Code for your bakery.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: any = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: cleanPhone ? normalizeIndianPhone(cleanPhone) : undefined,
        role,
      };

      if (role === 'BAKERY') {
        payload.bakeryName = bakeryName.trim() || `${fullName.trim()}'s Bakery`;
        payload.tagline = tagline.trim() || undefined;
        payload.description = description.trim() || 'Artisanal celebration cakes handcrafted fresh on order.';
        payload.address = address.trim() || 'Local Bakery Kitchen';
        payload.city = city.trim();
        payload.state = state.trim();
        payload.postalCode = postalCode.trim();
      }

      await register(payload);
      navigate(role === 'BAKERY' ? '/bakery/dashboard' : '/');
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '580px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <BrandLogo size="md" />
            </div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Create Your Account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Join Whisk & Layers to order custom celebration cakes or list your bakery storefront across India.
            </p>
          </div>

          {/* Role Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-muted)',
              borderRadius: '12px',
              padding: '0.35rem',
              marginBottom: '2rem',
            }}
          >
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.65rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: role === 'CUSTOMER' ? '#FFFFFF' : 'transparent',
                color: role === 'CUSTOMER' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: role === 'CUSTOMER' ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition)',
              }}
            >
              <UserIcon size={16} />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('BAKERY')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.65rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: role === 'BAKERY' ? '#FFFFFF' : 'transparent',
                color: role === 'BAKERY' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: role === 'BAKERY' ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition)',
              }}
            >
              <Store size={16} />
              <span>Bakery Owner</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Diya Patel"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password * (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '0.75rem 0.9rem',
                      backgroundColor: 'var(--bg-muted)',
                      border: '1px solid var(--border-medium)',
                      borderRight: 'none',
                      borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    className="form-control"
                    style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
              </div>
            </div>

            {/* If Bakery Role Selected: Show Bakery Details */}
            {role === 'BAKERY' && (
              <div
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  marginTop: '0.75rem',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-medium)',
                }}
              >
                <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Store size={16} color="var(--primary)" />
                  <span>Bakery Storefront Profile (India)</span>
                </h3>

                <div className="form-group">
                  <label className="form-label">Bakery Business Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. The Cake Story"
                    value={bakeryName}
                    onChange={(e) => setBakeryName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address & Landmark *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. 102 Sindhu Bhavan Road, Bodakdev"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 md-grid-cols-1" style={{ gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">City *</label>
                    <select
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      {INDIAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">State / UT *</label>
                    <select
                      className="form-control"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      className="form-control"
                      placeholder="e.g. 380054"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg btn-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}
            >
              <span>{submitting ? 'Creating Account...' : `Register as ${role === 'BAKERY' ? 'Bakery Partner' : 'Customer'}`}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
