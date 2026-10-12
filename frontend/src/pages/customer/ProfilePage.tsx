import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
import { useToast } from '../../context/ToastContext';
import { SafeImage } from '../../components/ui/SafeImage';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Phone,
  Package,
  Save,
  ShieldCheck,
  Camera,
  Upload,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  Heart,
  Sparkles,
  Check,
  Home,
  Briefcase,
  Cake,
  RefreshCw,
  Bell,
} from 'lucide-react';
import {
  INDIAN_STATES,
  INDIAN_CITIES,
  validateIndianPhone,
  normalizeIndianPhone,
  validateIndianPin,
} from '../../utils/indiaConstants';
import { SavedAddress, CelebrationDate } from '../../types';

// Curated Artisan Avatars Gallery
const AVATAR_PRESETS = [
  {
    id: 'chef-master',
    label: 'Master Pastry Chef',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'confectioner-fem',
    label: 'Chocolatier',
    url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'patron-cake',
    label: 'Cake Connoisseur',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'truffle-lover',
    label: 'Belgian Truffle Lover',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'berry-tart',
    label: 'Berry Tart Artisan',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'sourdough-baker',
    label: 'Rustic Baker',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'macaron-artist',
    label: 'Parisian Macaron Artist',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'floral-decorator',
    label: 'Botanical Decorator',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
  },
];

// Dietary preferences list
const DIETARY_OPTIONS = [
  { id: 'EGGLESS', label: '100% Eggless', desc: 'Strict vegetarian baked goods without eggs', icon: '🌿' },
  { id: 'VEGAN', label: '100% Plant-Based / Vegan', desc: 'No animal milk, butter, or gelatin', icon: '🌱' },
  { id: 'GLUTEN_FREE', label: 'Gluten-Sensitive / Free', desc: 'Almond flour, oat, or rice flour recipes', icon: '🌾' },
  { id: 'NUT_SAFE', label: 'Nut-Free / Nut-Safe', desc: 'Prepared in peanut and tree-nut allergen safe zones', icon: '🥜' },
  { id: 'LOW_SUGAR', label: 'Sugar-Conscious / Low GI', desc: 'Sweetened with organic monk fruit or date puree', icon: '🍯' },
  { id: 'DAIRY_FREE', label: 'Lactose / Dairy-Free', desc: 'Oat or almond milk whipped creams and ganaches', icon: '🥛' },
];

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active section tab
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'DIETARY' | 'ADDRESSES' | 'CELEBRATIONS'>('DETAILS');

  // Form states
  const [fullName, setFullName] = useState<string>(user?.full_name || '');
  const [phone, setPhone] = useState<string>(() => {
    if (user?.phone) {
      return user.phone.replace('+91', '').trim();
    }
    return '';
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(() => {
    if (!user?.dietary_preferences) return ['EGGLESS'];
    try {
      return typeof user.dietary_preferences === 'string'
        ? JSON.parse(user.dietary_preferences)
        : user.dietary_preferences;
    } catch {
      return ['EGGLESS'];
    }
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    if (!user?.saved_addresses) return [];
    try {
      return typeof user.saved_addresses === 'string'
        ? JSON.parse(user.saved_addresses)
        : user.saved_addresses;
    } catch {
      return [];
    }
  });

  const [celebrations, setCelebrations] = useState<CelebrationDate[]>(() => {
    if (!user?.celebration_dates) return [];
    try {
      return typeof user.celebration_dates === 'string'
        ? JSON.parse(user.celebration_dates)
        : user.celebration_dates;
    } catch {
      return [];
    }
  });

  // Modal / Add states for addresses & celebrations
  const [showAddAddressModal, setShowAddAddressModal] = useState<boolean>(false);
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrFlat, setNewAddrFlat] = useState<string>('');
  const [newAddrStreet, setNewAddrStreet] = useState<string>('');
  const [newAddrLandmark, setNewAddrLandmark] = useState<string>('');
  const [newAddrCity, setNewAddrCity] = useState<string>('Ahmedabad');
  const [newAddrState, setNewAddrState] = useState<string>('Gujarat');
  const [newAddrPin, setNewAddrPin] = useState<string>('');

  const [showAddCelebModal, setShowAddCelebModal] = useState<boolean>(false);
  const [newCelebTitle, setNewCelebTitle] = useState<string>('');
  const [newCelebDate, setNewCelebDate] = useState<string>('');
  const [newCelebReminderDays, setNewCelebReminderDays] = useState<number>(3);

  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      if (user.phone) setPhone(user.phone.replace('+91', '').trim());
      if (user.avatar_url) setAvatarUrl(user.avatar_url);
      if (user.bio) setBio(user.bio);
    }
  }, [user]);

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      error('Image size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatarUrl(result);
      success('Profile photo updated from your computer! Click Save Changes.');
    };
    reader.readAsDataURL(file);
  };

  // Toggle dietary option
  const toggleDietaryOption = (optId: string) => {
    setDietaryPrefs((prev) =>
      prev.includes(optId) ? prev.filter((p) => p !== optId) : [...prev, optId]
    );
  };

  // Address operations
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrFlat.trim() || !newAddrStreet.trim()) {
      error('Please enter house/flat and street address.');
      return;
    }
    if (!validateIndianPin(newAddrPin)) {
      error('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      flatNo: newAddrFlat.trim(),
      streetArea: newAddrStreet.trim(),
      landmark: newAddrLandmark.trim() || undefined,
      city: newAddrCity,
      state: newAddrState,
      pinCode: newAddrPin.trim(),
      isDefault: savedAddresses.length === 0,
    };

    setSavedAddresses((prev) => [...prev, newAddr]);
    setShowAddAddressModal(false);
    setNewAddrFlat('');
    setNewAddrStreet('');
    setNewAddrLandmark('');
    setNewAddrPin('');
    success(`Added ${newAddrLabel} address! Remember to save profile.`);
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    success('Address removed from list.');
  };

  const handleSetDefaultAddress = (id: string) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    success('Default address updated.');
  };

  // Celebration operations
  const handleAddCelebration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCelebTitle.trim() || !newCelebDate) {
      error('Please provide a title and date for the celebration.');
      return;
    }

    const newCeleb: CelebrationDate = {
      id: `celeb-${Date.now()}`,
      title: newCelebTitle.trim(),
      date: newCelebDate,
      reminderDays: newCelebReminderDays,
    };

    setCelebrations((prev) => [...prev, newCeleb]);
    setShowAddCelebModal(false);
    setNewCelebTitle('');
    setNewCelebDate('');
    success('Celebration added! You will be reminded before the bakery lead time.');
  };

  const handleDeleteCelebration = (id: string) => {
    setCelebrations((prev) => prev.filter((c) => c.id !== id));
    success('Celebration removed.');
  };

  // Save full profile
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fullName.trim()) {
      error('Full name is required.');
      return;
    }

    let normalizedPhone: string | null = null;
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone) {
      if (!validateIndianPhone(cleanPhone)) {
        error('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
        return;
      }
      normalizedPhone = normalizeIndianPhone(cleanPhone);
    }

    setSaving(true);
    try {
      await authApi.updateProfile({
        fullName: fullName.trim(),
        phone: normalizedPhone,
        avatarUrl: avatarUrl.trim() || null,
        bio: bio.trim() || null,
        dietaryPreferences: dietaryPrefs,
        savedAddresses: savedAddresses,
        celebrationDates: celebrations,
      });
      await refreshProfile();
      success('Your profile & preferences have been successfully updated!');
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
      <div className="container">
        {/* Profile Header Hero */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-light)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <SafeImage
                src={avatarUrl}
                alt={user.full_name}
                fallbackType="avatar"
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: '0 4px 12px rgba(124, 45, 18, 0.15)',
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change Photo"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                  {user.full_name}
                </h1>
                <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 }}>
                  {user.role}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.25rem 0 0 0' }}>
                {user.email} • {user.phone || 'No phone added'}
              </p>
              {bio && (
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic', maxWidth: '600px' }}>
                  "{bio}"
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {user.role === 'CUSTOMER' && (
              <Link to="/my-orders" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={17} />
                <span>My Orders</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => handleSaveProfile()}
              disabled={saving}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {saving ? <RefreshCw size={17} className="animate-spin" /> : <Save size={17} />}
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid var(--border-medium)',
            paddingBottom: '0.75rem',
            overflowX: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('DETAILS')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'DETAILS' ? 'var(--primary)' : 'var(--bg-muted)',
              color: activeTab === 'DETAILS' ? '#FFFFFF' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <UserIcon size={16} />
            <span>Personal Details & Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DIETARY')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'DIETARY' ? 'var(--primary)' : 'var(--bg-muted)',
              color: activeTab === 'DIETARY' ? '#FFFFFF' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <Heart size={16} />
            <span>Dietary & Taste Preferences ({dietaryPrefs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ADDRESSES')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'ADDRESSES' ? 'var(--primary)' : 'var(--bg-muted)',
              color: activeTab === 'ADDRESSES' ? '#FFFFFF' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <MapPin size={16} />
            <span>Saved Addresses ({savedAddresses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CELEBRATIONS')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'CELEBRATIONS' ? 'var(--primary)' : 'var(--bg-muted)',
              color: activeTab === 'CELEBRATIONS' ? '#FFFFFF' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <Calendar size={16} />
            <span>Celebrations Calendar ({celebrations.length})</span>
          </button>
        </div>

        {/* TAB 1: Personal Details & Photo */}
        {activeTab === 'DETAILS' && (
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserIcon size={20} color="var(--primary)" />
              <span>Personal Information & Avatar Customization</span>
            </h3>

            {/* Avatar Selection Section */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-muted)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Choose an Artisan Avatar Preset</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Or upload any custom photo above</p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Upload size={14} />
                  <span>Upload from Device</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.85rem' }}>
                {AVATAR_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => setAvatarUrl(preset.url)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '12px',
                      padding: '0.5rem',
                      textAlign: 'center',
                      backgroundColor: avatarUrl === preset.url ? '#FFFFFF' : 'transparent',
                      border: avatarUrl === preset.url ? '2px solid var(--primary)' : '1px solid transparent',
                      boxShadow: avatarUrl === preset.url ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.4rem auto', display: 'block' }}
                    />
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {preset.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email Address (Primary Login)</label>
                  <input
                    type="email"
                    disabled
                    className="form-control"
                    value={user.email}
                    style={{ backgroundColor: 'var(--bg-muted)', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Contact Mobile Number</label>
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
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>
                    Used for SMS and WhatsApp delivery coordination
                  </small>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Direct Avatar Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Personal Bio / Connoisseur Note</label>
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Tell bakeries about your cake taste, favorite flavor combinations, or special dessert milestones..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: '160px' }}>
                  {saving ? 'Updating...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Dietary & Allergen Profile */}
        {activeTab === 'DIETARY' && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={20} color="var(--primary)" />
                  <span>Dietary & Allergen Preferences</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.35rem 0 0 0' }}>
                  Bakeries on Whisk & Layers will automatically prioritize and verify these requirements for your bespoke cakes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSaveProfile()}
                disabled={saving}
                className="btn btn-primary btn-sm"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>

            <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
              {DIETARY_OPTIONS.map((opt) => {
                const isSelected = dietaryPrefs.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleDietaryOption(opt.id)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                      backgroundColor: isSelected ? '#FDF9F6' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>{opt.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                          {opt.label}
                        </div>
                        {isSelected && (
                          <span
                            style={{
                              backgroundColor: 'var(--primary)',
                              color: '#FFFFFF',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {opt.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ backgroundColor: 'var(--bg-muted)', padding: '1rem', borderRadius: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <strong>Bespoke Safety Guarantee:</strong> All partner bakeries enforce strict sanitization and segregated prep counters for 100% Eggless and Nut-Safe orders.
            </div>
          </div>
        )}

        {/* TAB 3: Saved Delivery Addresses */}
        {activeTab === 'ADDRESSES' && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} color="var(--primary)" />
                  <span>Delivery Address Book ({savedAddresses.length})</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.35rem 0 0 0' }}>
                  Manage your home, studio, and gifting addresses for fast 1-click checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddAddressModal(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Plus size={16} />
                <span>Add New Address</span>
              </button>
            </div>

            {savedAddresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'var(--bg-muted)', borderRadius: '16px' }}>
                <MapPin size={40} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
                <h4 style={{ color: 'var(--text-main)', margin: '0 0 0.4rem 0' }}>No Saved Addresses Yet</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
                  Add your primary delivery address to speed up cake checkout and lead-time calculations.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  Add Primary Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1.25rem', marginBottom: '1.5rem' }}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '14px',
                      border: addr.isDefault ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                      backgroundColor: addr.isDefault ? '#FDF9F6' : '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {addr.label === 'Home' ? <Home size={16} color="var(--primary)" /> : <Briefcase size={16} color="var(--primary)" />}
                          <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{addr.label}</strong>
                          {addr.isDefault && (
                            <span className="badge" style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '0.7rem' }}>
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}
                          title="Delete Address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        <div>{addr.flatNo}, {addr.streetArea}</div>
                        {addr.landmark && <div style={{ color: 'var(--text-muted)' }}>Near {addr.landmark}</div>}
                        <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                          {addr.city}, {addr.state} - {addr.pinCode}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {savedAddresses.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Addresses to Profile'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Celebrations Calendar */}
        {activeTab === 'CELEBRATIONS' && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={20} color="var(--primary)" />
                  <span>Celebration Calendar & Lead-Time Reminders</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.35rem 0 0 0' }}>
                  Never miss an anniversary or birthday. We'll remind you in advance so your baker has ample lead time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCelebModal(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Plus size={16} />
                <span>Add Celebration</span>
              </button>
            </div>

            {celebrations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'var(--bg-muted)', borderRadius: '16px' }}>
                <Cake size={40} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
                <h4 style={{ color: 'var(--text-main)', margin: '0 0 0.4rem 0' }}>No Celebrations Tracked</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
                  Save your loved ones' birthdays or anniversaries to get proactive cake pre-ordering alerts!
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddCelebModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  Track an Occasion
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1.25rem', marginBottom: '1.5rem' }}>
                {celebrations.map((celeb) => {
                  // Calculate days until celebration
                  const now = new Date();
                  const celebDate = new Date(celeb.date);
                  celebDate.setFullYear(now.getFullYear());
                  if (celebDate < now) {
                    celebDate.setFullYear(now.getFullYear() + 1);
                  }
                  const diffDays = Math.ceil((celebDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div
                      key={celeb.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: '1px solid var(--border-medium)',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--primary-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                          }}
                        >
                          <Cake size={24} />
                        </div>

                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                            {celeb.title}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                            <Calendar size={13} />
                            <span>{new Date(celeb.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                            <span className="badge" style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', fontSize: '0.72rem' }}>
                              In {diffDays} days
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link
                          to="/studio"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                        >
                          Design Cake
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteCelebration(celeb.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}
                          title="Delete Celebration"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {celebrations.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Celebrations to Profile'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add Address */}
      {showAddAddressModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Add Delivery Address
            </h3>

            <form onSubmit={handleAddAddress}>
              <div className="form-group">
                <label className="form-label">Address Tag / Label</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['Home', 'Work', 'Other'] as const).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewAddrLabel(tag)}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
                        borderRadius: '8px',
                        border: newAddrLabel === tag ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: newAddrLabel === tag ? 'var(--primary-light)' : '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">House / Flat / Building No. *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Flat 402, Royal Palms"
                  value={newAddrFlat}
                  onChange={(e) => setNewAddrFlat(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street / Area / Colony *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Sindhu Bhavan Marg, Bodakdev"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Landmark (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Opposite Taj Skyline"
                  value={newAddrLandmark}
                  onChange={(e) => setNewAddrLandmark(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <select
                    className="form-control"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">State / UT *</label>
                  <select
                    className="form-control"
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="form-control"
                  placeholder="e.g. 380054"
                  value={newAddrPin}
                  onChange={(e) => setNewAddrPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Celebration */}
      {showAddCelebModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Add Milestone Celebration
            </h3>

            <form onSubmit={handleAddCelebration}>
              <div className="form-group">
                <label className="form-label">Occasion Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Mom's 50th Birthday or Wedding Anniversary"
                  value={newCelebTitle}
                  onChange={(e) => setNewCelebTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Celebration Date *</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={newCelebDate}
                  onChange={(e) => setNewCelebDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Advance Reminder (Days)</label>
                <select
                  className="form-control"
                  value={newCelebReminderDays}
                  onChange={(e) => setNewCelebReminderDays(parseInt(e.target.value, 10))}
                >
                  <option value={2}>2 Days in Advance</option>
                  <option value={3}>3 Days in Advance (Recommended)</option>
                  <option value={5}>5 Days in Advance</option>
                  <option value={7}>1 Week in Advance</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddCelebModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Celebration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
