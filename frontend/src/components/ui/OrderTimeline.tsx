import React from 'react';
import { OrderStatus } from '../../types';
import { Check, Clock, ChefHat, Sparkles, Truck, PackageCheck, XCircle } from 'lucide-react';

interface OrderTimelineProps {
  status: OrderStatus;
  rejectionReason?: string | null;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, rejectionReason }) => {
  if (status === 'REJECTED') {
    return (
      <div
        style={{
          backgroundColor: '#FDE8E8',
          border: '1px solid #FECACA',
          borderRadius: '12px',
          padding: '1.25rem',
          margin: '1.5rem 0',
          color: '#9E1F1F',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>
          <XCircle size={20} />
          <span>Order Declined by Bakery</span>
        </div>
        <p style={{ color: '#771818', fontSize: '0.9rem', lineHeight: 1.5 }}>
          <strong>Reason:</strong> {rejectionReason || 'Bakery is at peak capacity and unable to fulfill this custom order.'}
        </p>
      </div>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <div
        style={{
          backgroundColor: '#F3F4F6',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '1.25rem',
          margin: '1.5rem 0',
          color: '#4B5563',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '1rem' }}>Order Cancelled</div>
        <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>This order was cancelled.</p>
      </div>
    );
  }

  const steps = [
    { key: 'PENDING', label: 'Order Placed', Icon: Clock },
    { key: 'ACCEPTED', label: 'Bakery Accepted', Icon: Check },
    { key: 'PREPARING', label: 'Baking & Styling', Icon: ChefHat },
    { key: 'READY', label: 'Boxed & Ready', Icon: Sparkles },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', Icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', Icon: PackageCheck },
  ];

  const statusRank: Record<OrderStatus, number> = {
    PENDING: 0,
    ACCEPTED: 1,
    PREPARING: 2,
    READY: 3,
    OUT_FOR_DELIVERY: 4,
    DELIVERED: 5,
    REJECTED: -1,
    CANCELLED: -1,
  };

  const currentRank = statusRank[status] ?? 0;

  return (
    <div style={{ margin: '2rem 0', padding: '1rem 0' }}>
      <div className="timeline-stepper">
        {steps.map((step, idx) => {
          const isCompleted = currentRank > idx;
          const isActive = currentRank === idx;
          const Icon = step.Icon;

          return (
            <React.Fragment key={step.key}>
              <div className="timeline-step">
                <div
                  className={`step-circle ${
                    isCompleted ? 'completed' : isActive ? 'active' : ''
                  }`}
                  title={step.label}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <div className={`step-label ${isActive ? 'active' : ''}`}>
                  {step.label}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`step-line ${
                    currentRank > idx ? 'completed' : ''
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
