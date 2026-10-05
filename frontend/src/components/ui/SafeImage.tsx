import React, { useState, useEffect } from 'react';
import { Cake, Store, User, Image as ImageIcon } from 'lucide-react';

export type FallbackType = 'cake' | 'bakery-banner' | 'bakery-logo' | 'avatar' | 'generic';

const FALLBACK_URLS: Record<FallbackType, string> = {
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
  'bakery-banner': 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&auto=format&fit=crop&q=80',
  'bakery-logo': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  generic: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
};

export interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackType?: FallbackType;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  fallbackType = 'generic',
  fallbackSrc,
  style,
  className = '',
  onError,
  ...rest
}) => {
  const targetFallback = fallbackSrc || FALLBACK_URLS[fallbackType] || FALLBACK_URLS.generic;
  const initialSrc = src && typeof src === 'string' && src.trim() !== '' ? src : targetFallback;

  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [fallbackFailed, setFallbackFailed] = useState<boolean>(false);

  useEffect(() => {
    const nextSrc = src && typeof src === 'string' && src.trim() !== '' ? src : targetFallback;
    setCurrentSrc(nextSrc);
    setHasError(false);
    setFallbackFailed(false);
  }, [src, targetFallback]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && currentSrc !== targetFallback) {
      setHasError(true);
      setCurrentSrc(targetFallback);
    } else {
      setFallbackFailed(true);
    }

    if (onError) {
      onError(e);
    }
  };

  if (fallbackFailed) {
    // Ultimate fallback if both source and remote fallback fail (e.g. offline)
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8F5F1',
          color: '#8C7B70',
          border: '1px solid #EAE3D9',
          ...style,
        }}
        role="img"
        aria-label={alt || 'Image'}
      >
        {fallbackType === 'cake' && <Cake size={28} opacity={0.6} />}
        {(fallbackType === 'bakery-banner' || fallbackType === 'bakery-logo') && <Store size={28} opacity={0.6} />}
        {fallbackType === 'avatar' && <User size={24} opacity={0.6} />}
        {fallbackType === 'generic' && <ImageIcon size={26} opacity={0.6} />}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      style={{
        ...style,
      }}
      className={className}
      onError={handleError}
      loading="lazy"
      {...rest}
    />
  );
};
