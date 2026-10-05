import React from 'react';
import { OrderStatus } from '../../types';
import { Clock, CheckCircle2, ChefHat, Sparkles, Truck, PackageCheck, XCircle, Ban } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configMap: Record<OrderStatus, { label: string; className: string; Icon: any }> = {
    PENDING: {
      label: 'Pending Bakery Approval',
      className: 'badge-pending',
      Icon: Clock,
    },
    ACCEPTED: {
      label: 'Accepted by Bakery',
      className: 'badge-accepted',
      Icon: CheckCircle2,
    },
    PREPARING: {
      label: 'Baking & Decorating',
      className: 'badge-preparing',
      Icon: ChefHat,
    },
    READY: {
      label: 'Ready for Dispatch',
      className: 'badge-ready',
      Icon: Sparkles,
    },
    OUT_FOR_DELIVERY: {
      label: 'Out for Delivery',
      className: 'badge-out_for_delivery',
      Icon: Truck,
    },
    DELIVERED: {
      label: 'Delivered',
      className: 'badge-delivered',
      Icon: PackageCheck,
    },
    REJECTED: {
      label: 'Declined by Bakery',
      className: 'badge-rejected',
      Icon: XCircle,
    },
    CANCELLED: {
      label: 'Cancelled',
      className: 'badge-cancelled',
      Icon: Ban,
    },
  };

  const current = configMap[status] || configMap.PENDING;
  const Icon = current.Icon;

  return (
    <span
      className={`badge ${current.className}`}
      style={{
        fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
        padding: size === 'sm' ? '0.2rem 0.5rem' : '0.3rem 0.7rem',
      }}
    >
      <Icon size={size === 'sm' ? 12 : 14} />
      <span>{current.label}</span>
    </span>
  );
};
