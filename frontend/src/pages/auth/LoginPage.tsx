import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Cake, Sparkles, ArrowRight, UserCheck, ShieldCheck, Store, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(redirectPath);
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (role: 'CUSTOMER' | 'BAKERY' | 'ADMIN') => {
    setSubmitting(true);
    try {
      await switchDemoRole(role);
      navigate(role === 'BAKERY' ? '/bakery/dashboard' : role === 'ADMIN' ? '/admin/dashboard' : redirectPath);
    } catch {
      // Error handled by toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        {/* Quick Demo Logins Helper Card */}
        <div
          style={{
            backgroundColor: '#20130D',
            color: '#FFF',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            border: '1px solid #362217',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#D4AF37', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <Sparkles size={14} />
            <span>EXAMINER / DEMO 1-CLICK INSTANT LOGIN</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#A08E84', marginBottom: '0.75rem' }}>
            Click any account role below to immediately test the platform with realistic seeded data:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('CUSTOMER')}
              className="btn btn-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', justifyContent: 'flex-start', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <UserCheck size={14} color="#D4AF37" />
              <span>Customer: Elena Vance (customer@whiskandlayers.com)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('BAKERY')}
              className="btn btn-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', justifyContent: 'flex-start', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Store size={14} color="#D97736" />
              <span>Bakery Owner: Sweet Crust (sweetcrust@whiskandlayers.com)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="btn btn-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', justifyContent: 'flex-start', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <ShieldCheck size={14} color="#60A5FA" />
              <span>Administrator: Platform Admin (admin@whiskandlayers.com)</span>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="card" style={{ padding: '2.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto',
              }}
            >
              <Cake size={26} />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Sign in to manage your cake orders, customizations, or bakery storefront.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">Password *</label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg btn-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <span>{submitting ? 'Signing In...' : 'Sign In to Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Create Account Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
