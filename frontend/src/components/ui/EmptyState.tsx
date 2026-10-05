import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, ShoppingBag, Store, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: 'cake' | 'cart' | 'bakery' | 'alert';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  onAction,
  icon = 'cake',
}) => {
  const IconComponent =
    icon === 'cart'
      ? ShoppingBag
      : icon === 'bakery'
      ? Store
      : icon === 'alert'
      ? AlertCircle
      : Cake;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px dashed #DACFC2',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#FDF3EB',
          color: '#C85A17',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <IconComponent size={32} />
      </div>
      <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#2C1810' }}>
        {title}
      </h3>
      <p style={{ maxWidth: '440px', color: '#6B5B53', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};
