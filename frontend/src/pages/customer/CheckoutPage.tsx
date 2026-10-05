import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderApi } from '../../services/orderApi';
import {
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User as UserIcon,
  CreditCard,
  Banknote,
  AlertCircle,
  ArrowRight,
  Store,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, activeBakeryId, activeBakeryName, subtotal, deliveryFee, taxAmount, total, maxLeadDays, clearCart } = useCart();
  const { user } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();

  // Earliest delivery date calculated from lead days
  const getMinDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + (maxLeadDays || 2));
    return d.toISOString().split('T')[0];
  };

  const [customerName, setCustomerName] = useState<string>(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>(getMinDeliveryDate());
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>('Morning (09:00 AM - 12:00 PM)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'PAY_ON_DELIVERY' | 'CARD_PAYMENT'>('PAY_ON_DELIVERY');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.full_name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      error('Please sign in or create an account to place your order.');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim() || !deliveryDate) {
      error('Please complete all required customer and delivery fields.');
      return;
    }

    // Lead days check
    const minDate = getMinDeliveryDate();
    if (deliveryDate < minDate) {
      error(`The earliest delivery date for this bakery is ${minDate} (${maxLeadDays} days lead time).`);
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        bakeryId: activeBakeryId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryDate,
        deliveryTimeSlot,
        specialInstructions: specialInstructions.trim() || undefined,
        paymentMethod,
        items: items.map((it) => ({
          cakeId: it.cakeId || null,
          cakeName: it.cakeName,
          cakeImage: it.cakeImage,
          basePrice: it.basePrice,
          quantity: it.quantity,
          subtotal: it.subtotal,
          isCustom: it.isCustom,
          customMessage: it.customMessage || null,
          selectedOptions: it.selectedOptions || null,
        })),
      };

      const createdOrder = await orderApi.create(orderPayload);
      clearCart();
      success('Order submitted to bakery successfully!');
      navigate(`/order-confirmation/${createdOrder.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container container-narrow">
        <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Delivery & Order Placement
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Your order will be directly transmitted to <strong>{activeBakeryName}</strong> for acceptance and scheduling.
        </p>

        {!user && (
          <div
            style={{
              backgroundColor: '#FEF6E6',
              border: '1px solid #FCD34D',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B26A00', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>You are checking out as a guest. Please sign in to track your order seamlessly.</span>
            </div>
            <Link to="/login?redirect=/checkout" className="btn btn-secondary btn-sm">
              Sign In Now
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Customer Details */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserIcon size={18} color="var(--primary)" />
                <span>1. Customer Information</span>
              </h3>

              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Elena Vance"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    placeholder="e.g. +1 (555) 234-5678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address & Scheduling */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--primary)" />
                <span>2. Delivery Address & Scheduled Date</span>
              </h3>

              <div className="form-group">
                <label className="form-label">Street Address & Unit / Apartment *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B, San Francisco, CA"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Delivery Date * (Min {maxLeadDays} days lead time)
                  </label>
                  <input
                    type="date"
                    required
                    min={getMinDeliveryDate()}
                    className="form-control"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Delivery Window Slot *</label>
                  <select
                    className="form-control"
                    value={deliveryTimeSlot}
                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  >
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                    <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
                <label className="form-label">Delivery Instructions for Courier / Concierge (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Leave with building doorman; gate code #4412"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* 3. Payment Method & Architecture Notice */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Banknote size={18} color="var(--primary)" />
                <span>3. Payment Architecture & Settlement</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: paymentMethod === 'PAY_ON_DELIVERY' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: paymentMethod === 'PAY_ON_DELIVERY' ? 'var(--primary-light)' : '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAY_ON_DELIVERY"
                    checked={paymentMethod === 'PAY_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('PAY_ON_DELIVERY')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      Pay Upon Hand Delivery
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Pay contactless via card or cash upon receiving your cake from the courier.
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: paymentMethod === 'CARD_PAYMENT' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: paymentMethod === 'CARD_PAYMENT' ? 'var(--primary-light)' : '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD_PAYMENT"
                    checked={paymentMethod === 'CARD_PAYMENT'}
                    onChange={() => setPaymentMethod('CARD_PAYMENT')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      Direct Bakery Invoice (Card Payment)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      The bakery will send an electronic invoice upon reviewing and accepting your order.
                    </div>
                  </div>
                </label>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                }}
              >
                <strong>Order Lifecycle:</strong> Placed orders remain in <span className="badge badge-pending">PENDING</span> until the bakery accepts your date and specifications. You will receive live status updates.
              </div>
            </div>

            {/* 4. Final Review & Submit Button */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Total ({items.length} items)</span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                    ${total.toFixed(2)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '220px' }}
                >
                  <span>{submitting ? 'Transmitting Order...' : 'Place Cake Order'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', textAlign: 'center' }}>
                By clicking "Place Cake Order", you confirm your delivery date and authorize the bakery to prepare your custom bake.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
