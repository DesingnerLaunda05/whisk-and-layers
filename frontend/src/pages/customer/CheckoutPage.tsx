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
  Smartphone,
  Landmark as LandmarkIcon,
} from 'lucide-react';
import {
  INDIAN_STATES,
  INDIAN_CITIES,
  validateIndianPhone,
  validateIndianPin,
  formatINR,
  normalizeIndianPhone,
} from '../../utils/indiaConstants';

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
  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    if (user?.phone) {
      return user.phone.replace('+91', '').trim();
    }
    return '';
  });

  // Structured Indian Address fields
  const [flatNo, setFlatNo] = useState<string>('');
  const [streetArea, setStreetArea] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [city, setCity] = useState<string>('Ahmedabad');
  const [state, setState] = useState<string>('Gujarat');
  const [pinCode, setPinCode] = useState<string>('');

  const [deliveryDate, setDeliveryDate] = useState<string>(getMinDeliveryDate());
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>('Morning (09:00 AM - 12:00 PM)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'PAY_ON_DELIVERY' | 'UPI' | 'CARD_PAYMENT' | 'NET_BANKING'>('PAY_ON_DELIVERY');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.full_name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone.replace('+91', '').trim());
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

    if (!customerName.trim()) {
      error('Please enter your full name.');
      return;
    }

    // Phone validation (10-digit Indian mobile)
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!validateIndianPhone(cleanPhone)) {
      error('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    // Address validation
    if (!flatNo.trim() || !streetArea.trim() || !city.trim() || !state.trim()) {
      error('Please fill in House/Flat No, Street/Area, City, and State.');
      return;
    }

    if (!validateIndianPin(pinCode)) {
      error('Please enter a valid 6-digit Indian PIN Code (e.g. 380015).');
      return;
    }

    if (!deliveryDate) {
      error('Please choose a delivery date.');
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
      // Assemble structured Indian address
      const fullAddress = [
        flatNo.trim(),
        streetArea.trim(),
        landmark.trim() ? `Near ${landmark.trim()}` : null,
        city.trim(),
        `${state.trim()} - ${pinCode.trim()}`,
      ].filter(Boolean).join(', ');

      const orderPayload = {
        bakeryId: activeBakeryId,
        customerName: customerName.trim(),
        customerPhone: normalizeIndianPhone(cleanPhone),
        deliveryAddress: fullAddress,
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

              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Aditya Nair"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Contact Mobile Number *</label>
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
                      required
                      maxLength={10}
                      className="form-control"
                      style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}
                      placeholder="9876543210"
                      value={customerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setCustomerPhone(val);
                      }}
                    />
                  </div>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>
                    10-digit Indian mobile number for delivery updates
                  </small>
                </div>
              </div>
            </div>

            {/* 2. Indian Delivery Address & Scheduling */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--primary)" />
                <span>2. Delivery Address & Scheduled Date (India)</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">House / Flat / Building No. *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Flat 204, Shree Residency"
                      value={flatNo}
                      onChange={(e) => setFlatNo(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Street / Area / Colony *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. 150 Feet Ring Road, Nana Mava"
                      value={streetArea}
                      onChange={(e) => setStreetArea(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 md-grid-cols-1" style={{ gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Landmark (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Near Nana Mava Circle"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">City *</label>
                    <select
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      {INDIAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">State / UT *</label>
                    <select
                      className="form-control"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0, maxWidth: '280px' }}>
                  <label className="form-label">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="form-control"
                    placeholder="e.g. 360005"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>
                    Valid 6-digit Indian Postal PIN Code
                  </small>
                </div>
              </div>

              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
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
                <label className="form-label">Special Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Call upon reaching society security gate; carry fragile cake box with care"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* 3. Indian Payment Methods & Architecture */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Banknote size={18} color="var(--primary)" />
                <span>3. Payment Options (India-Ready)</span>
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
                      Pay on Delivery (Cash or UPI at doorstep)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Inspect your bespoke cake upon handover and pay the delivery partner via cash or instant UPI scan.
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
                    border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: paymentMethod === 'UPI' ? 'var(--primary-light)' : '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Instant UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                      <span className="badge" style={{ backgroundColor: '#DEF7EC', color: '#03543F' }}>Popular in India</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Pay directly via any UPI app upon bakery confirmation with zero gateway convenience charge.
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
                      Credit / Debit Card (RuPay, Visa, Mastercard)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Bakery will generate an online secure payment link upon review and order acceptance.
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
                    border: paymentMethod === 'NET_BANKING' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: paymentMethod === 'NET_BANKING' ? 'var(--primary-light)' : '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="NET_BANKING"
                    checked={paymentMethod === 'NET_BANKING'}
                    onChange={() => setPaymentMethod('NET_BANKING')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      Net Banking (All Indian Major Banks)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      SBI, HDFC, ICICI, Axis Bank, Bank of Baroda, Kotak Mahindra Bank & more.
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
                <strong>Order Lifecycle in India:</strong> Orders remain in <span className="badge badge-pending">PENDING</span> until the bakery chef verifies your specifications and schedule. You will receive live WhatsApp/SMS and app updates.
              </div>
            </div>

            {/* 4. Final Review & Submit Button */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Total ({items.length} items, incl. 5% GST & Hand Delivery)</span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                    {formatINR(total)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '220px' }}
                >
                  <span>{submitting ? 'Submitting to Bakery...' : 'Place Cake Order'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', textAlign: 'center' }}>
                By clicking "Place Cake Order", you confirm your delivery date and authorize the artisan bakery to craft your order.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
