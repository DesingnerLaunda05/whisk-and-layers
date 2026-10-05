import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
import { useToast } from '../../context/ToastContext';
import { SafeImage } from '../../components/ui/SafeImage';
import { Link } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Package, Save, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [fullName, setFullName] = useState<string>(user?.full_name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || '');
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      error('Full name is required.');
      return;
    }

    setSaving(true);
    try {
      await authApi.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
      });
      await refreshProfile();
      success('Account profile updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Please sign in to view your profile</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container container-narrow">
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
            <SafeImage
              src={avatarUrl}
              alt={user.full_name}
              fallbackType="avatar"
              style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-medium)' }}
            />
            <div>
              <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', margin: 0 }}>
                {user.full_name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</span>
                <span className="badge" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-main)' }}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Immutable)</label>
              <input
                type="email"
                disabled
                className="form-control"
                value={user.email}
                style={{ backgroundColor: 'var(--bg-muted)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Image URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
              {user.role === 'CUSTOMER' && (
                <Link to="/my-orders" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Package size={16} />
                  <span>View My Orders</span>
                </Link>
              )}
              {user.role === 'BAKERY' && (
                <Link to="/bakery/dashboard" className="btn btn-secondary">
                  Bakery Portal
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin/dashboard" className="btn btn-secondary">
                  Admin Console
                </Link>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
