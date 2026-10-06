import React from 'react';
import logoImg from '../../assets/whisk-and-layers-logo.jpeg';

interface BrandLogoProps {
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Whisk & Layers Brand Logo Component
 * Uses the official brand emblem with exact aspect ratio and boutique typography.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 42,
  showText = true,
  textColor = 'var(--text-main)',
  subtextColor = 'var(--primary)',
  className = '',
  style = {},
}) => {
  const numSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 42;

  return (
    <div
      className={`brand-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        textDecoration: 'none',
        ...style,
      }}
    >
      <div
        style={{
          width: `${numSize}px`,
          height: `${numSize}px`,
          minWidth: `${numSize}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF8F1',
          boxShadow: '0 2px 8px rgba(201, 59, 103, 0.15)',
          border: '1.5px solid rgba(201, 59, 103, 0.25)',
          flexShrink: 0,
        }}
      >
        <img
          src={logoImg}
          alt="Whisk & Layers"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          loading="eager"
        />
      </div>

      {showText && (
        <div style={{ lineHeight: 1.15, display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: numSize >= 48 ? '1.5rem' : numSize >= 36 ? '1.25rem' : '1.05rem',
              fontWeight: 800,
              color: textColor,
              letterSpacing: '-0.02em',
            }}
          >
            Whisk & Layers
          </span>
          <span
            style={{
              fontSize: numSize >= 48 ? '0.72rem' : '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: subtextColor,
              fontWeight: 700,
              marginTop: '1px',
            }}
          >
            India's Artisan Bakeries
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
