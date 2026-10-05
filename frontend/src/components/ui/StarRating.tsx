import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  count,
  interactive = false,
  onChange,
  size = 16,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'flex', gap: '0.15rem' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(rating);
          return (
            <Star
              key={star}
              size={size}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                fill: isFilled ? '#D4AF37' : 'none',
                color: isFilled ? '#D4AF37' : '#DACFC2',
                transition: 'all 0.15s ease',
              }}
              onClick={() => interactive && onChange && onChange(star)}
            />
          );
        })}
      </div>
      {rating > 0 && !interactive && (
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2C1810' }}>
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span style={{ fontSize: '0.8rem', color: '#6B5B53' }}>
          ({count})
        </span>
      )}
    </div>
  );
};
