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
  QrCode,
  CheckCircle2,
  Lock,
  RefreshCw,
  X,
  Sparkles,
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
  const [paymentMethod, setPaymentMethod] = useState<'PAY_ON_DELIVERY' | 'UPI' | 'CARD_PAYMENT' | 'NET_BANKING'>('UPI');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Saved addresses parse
  const savedAddresses = React.useMemo(() => {
    if (!user?.saved_addresses) return [];
    try {
      return typeof user.saved_addresses === 'string' ? JSON.parse(user.saved_addresses) : user.saved_addresses;
    } catch {
      return [];
    }
  }, [user]);

  // Payment states
  // 1. UPI State
  const [upiId, setUpiId] = useState<string>('');
  const [upiVerified, setUpiVerified] = useState<boolean>(false);
  const [upiSimulating, setUpiSimulating] = useState<boolean>(false);

  // 2. Card Payment State
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>(user?.full_name || '');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(45);
  const [otpSubmitting, setOtpSubmitting] = useState<boolean>(false);
  const [cardAuthorized, setCardAuthorized] = useState<boolean>(false);

  // 3. Net Banking State
  const [selectedBank, setSelectedBank] = useState<string>('HDFC');
  const [netbankingAuthorized, setNetbankingAuthorized] = useState<boolean>(false);
  const [bankProcessing, setBankProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.full_name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone.replace('+91', '').trim());
      if (!cardHolder && user.full_name) setCardHolder(user.full_name);
    }
  }, [user]);

  // Handle saved address auto-fill
  const handleApplySavedAddress = (addr: any) => {
    setFlatNo(addr.flat_no || addr.flatNo || '');
    setStreetArea(addr.street_area || addr.streetArea || '');
    setLandmark(addr.landmark || '');
    if (addr.city) setCity(addr.city);
    if (addr.state) setState(addr.state);
    if (addr.pin_code || addr.pinCode) setPinCode(addr.pin_code || addr.pinCode);
    success(`Applied saved address: ${addr.label || 'Saved'}`);
  };

  // Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // Detect card network
  const getCardNetwork = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard';
    if (/^(60|65|81|82)/.test(clean)) return 'RuPay';
    return 'Card';
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  // Pre-validate common order fields
  const validateCommonDetails = (): boolean => {
    if (!user) {
      error('Please sign in or create an account to place your order.');
      navigate('/login?redirect=/checkout');
      return false;
    }

    if (!customerName.trim()) {
      error('Please enter your full name.');
      return false;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!validateIndianPhone(cleanPhone)) {
      error('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return false;
    }

    if (!flatNo.trim() || !streetArea.trim() || !city.trim() || !state.trim()) {
      error('Please fill in House/Flat No, Street/Area, City, and State.');
      return false;
    }

    if (!validateIndianPin(pinCode)) {
      error('Please enter a valid 6-digit Indian PIN Code (e.g. 380015).');
      return false;
    }

    if (!deliveryDate) {
      error('Please choose a delivery date.');
      return false;
    }

    const minDate = getMinDeliveryDate();
    if (deliveryDate < minDate) {
      error(`The earliest delivery date for this bakery is ${minDate} (${maxLeadDays} days lead time).`);
      return false;
    }

    return true;
  };

  // Perform actual order placement API request
  const executeOrderPlacement = async (paymentDetails: {
    status: 'PAID' | 'PENDING';
    transactionId?: string;
    details?: string;
  }) => {
    setSubmitting(true);
    try {
      const cleanPhone = customerPhone.replace(/\D/g, '');
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
        paymentStatus: paymentDetails.status,
        transactionId: paymentDetails.transactionId,
        paymentDetails: paymentDetails.details,
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
      success(
        paymentDetails.status === 'PAID'
          ? `Payment verified! Order #${createdOrder.order_number} confirmed.`
          : 'Order submitted to bakery successfully!'
      );
      navigate(`/order-confirmation/${createdOrder.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  // Main submission handler
  const handleCheckoutClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCommonDetails()) return;

    if (paymentMethod === 'PAY_ON_DELIVERY') {
      await executeOrderPlacement({
        status: 'PENDING',
        details: 'Payment upon delivery handover (Cash / Handover UPI)',
      });
      return;
    }

    if (paymentMethod === 'UPI') {
      if (!upiVerified) {
        // Run UPI verification simulation
        setUpiSimulating(true);
        setTimeout(() => {
          setUpiSimulating(false);
          setUpiVerified(true);
          const txnId = `UPI-NPCI-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
          executeOrderPlacement({
            status: 'PAID',
            transactionId: txnId,
            details: `Instant UPI Autopay approved (${upiId || 'customer@upi'})`,
          });
        }, 1800);
        return;
      }
      const txnId = `UPI-NPCI-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      await executeOrderPlacement({
        status: 'PAID',
        transactionId: txnId,
        details: `UPI Autopay (${upiId || 'verified@upi'})`,
      });
      return;
    }

    if (paymentMethod === 'CARD_PAYMENT') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        error('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        error('Please enter card expiry date (MM/YY).');
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        error('Please enter valid 3-digit CVV.');
        return;
      }

      // Open 3D Secure OTP verification modal
      setShowOtpModal(true);
      setOtpTimer(45);
      return;
    }

    if (paymentMethod === 'NET_BANKING') {
      setBankProcessing(true);
      setTimeout(() => {
        setBankProcessing(false);
        setNetbankingAuthorized(true);
        const txnId = `NB-${selectedBank}-${Math.floor(10000000 + Math.random() * 90000000)}`;
        executeOrderPlacement({
          status: 'PAID',
          transactionId: txnId,
          details: `Net Banking debit via ${selectedBank} Corporate Gateway`,
        });
      }, 1500);
    }
  };

  // Verify Card OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < 4) {
      error('Please enter the 6-digit OTP received via SMS.');
      return;
    }

    setOtpSubmitting(true);
    setTimeout(async () => {
      setOtpSubmitting(false);
      setShowOtpModal(false);
      setCardAuthorized(true);
      const network = getCardNetwork();
      const last4 = cardNumber.slice(-4);
      const txnId = `TXN-${network.toUpperCase()}-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      await executeOrderPlacement({
        status: 'PAID',
        transactionId: txnId,
        details: `${network} ending in ${last4} (3D Secure Verified)`,
      });
    }, 1200);
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

        <form onSubmit={handleCheckoutClick}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--primary)" />
                  <span>2. Delivery Address & Scheduled Date (India)</span>
                </h3>

                {savedAddresses.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick Fill:</span>
                    {savedAddresses.map((sa: any, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplySavedAddress(sa)}
                        className="badge"
                        style={{
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          border: '1px solid var(--primary)',
                          cursor: 'pointer',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        📍 {sa.label || `Address ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
                  placeholder="e.g. Call upon reaching society security gate; carry fragile cake box upright"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* 3. Fully Functional Payment Architecture */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Banknote size={18} color="var(--primary)" />
                  <span>3. Functional Payment Methods (Instant Verification)</span>
                </h3>
                <span className="badge" style={{ backgroundColor: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={14} /> 256-Bit SSL Encrypted
                </span>
              </div>

              {/* Payment Method Selector Radio Tabs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {/* Method 1: Instant UPI */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '1.1rem',
                    borderRadius: '14px',
                    border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: paymentMethod === 'UPI' ? '#FDF9F6' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    style={{ marginTop: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Smartphone size={18} color="var(--primary)" />
                        <span>Instant UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                      </div>
                      <span className="badge" style={{ backgroundColor: '#DEF7EC', color: '#03543F' }}>Zero Convenience Fee</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Scan QR or enter UPI ID for immediate payment settlement with instant bakery notification.
                    </div>
                  </div>
                </label>

                {/* Sub-panel for Instant UPI */}
                {paymentMethod === 'UPI' && (
                  <div
                    style={{
                      marginLeft: '1.5rem',
                      padding: '1.25rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid var(--border-medium)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1.5rem', alignItems: 'center' }}>
                      {/* Left: Dynamic QR Code */}
                      <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-muted)', borderRadius: '12px' }}>
                        <div
                          style={{
                            width: '140px',
                            height: '140px',
                            margin: '0 auto',
                            backgroundColor: '#FFFFFF',
                            padding: '10px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #E5E7EB',
                          }}
                        >
                          {/* Stylized high-res QR representation */}
                          <svg viewBox="0 0 100 100" width="120" height="120">
                            {/* Position Detection Squares */}
                            <rect x="5" y="5" width="28" height="28" fill="#1E293B" rx="3" />
                            <rect x="9" y="9" width="20" height="20" fill="#FFFFFF" rx="2" />
                            <rect x="13" y="13" width="12" height="12" fill="#7C2D12" rx="1" />

                            <rect x="67" y="5" width="28" height="28" fill="#1E293B" rx="3" />
                            <rect x="71" y="9" width="20" height="20" fill="#FFFFFF" rx="2" />
                            <rect x="75" y="13" width="12" height="12" fill="#7C2D12" rx="1" />

                            <rect x="5" y="67" width="28" height="28" fill="#1E293B" rx="3" />
                            <rect x="9" y="71" width="20" height="20" fill="#FFFFFF" rx="2" />
                            <rect x="13" y="75" width="12" height="12" fill="#7C2D12" rx="1" />

                            {/* Center Logo Cake Accent */}
                            <circle cx="50" cy="50" r="10" fill="#7C2D12" />
                            <text x="50" y="54" fontSize="9" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">₹</text>

                            {/* Data grid patterns */}
                            <rect x="38" y="8" width="6" height="6" fill="#1E293B" />
                            <rect x="48" y="18" width="6" height="6" fill="#1E293B" />
                            <rect x="58" y="8" width="6" height="6" fill="#1E293B" />
                            <rect x="8" y="38" width="6" height="6" fill="#1E293B" />
                            <rect x="18" y="48" width="6" height="6" fill="#1E293B" />
                            <rect x="38" y="68" width="6" height="6" fill="#1E293B" />
                            <rect x="48" y="78" width="6" height="6" fill="#1E293B" />
                            <rect x="68" y="38" width="6" height="6" fill="#1E293B" />
                            <rect x="78" y="48" width="6" height="6" fill="#1E293B" />
                            <rect x="68" y="68" width="6" height="6" fill="#1E293B" />
                            <rect x="78" y="78" width="6" height="6" fill="#1E293B" />
                            <rect x="88" y="68" width="6" height="6" fill="#1E293B" />
                          </svg>
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>
                          Scan to Pay {formatINR(total)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                          VPA: whisklayers@okaxis (BHIM UPI NPCI)
                        </div>
                      </div>

                      {/* Right: Enter UPI ID or Quick Apps */}
                      <div>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Or Enter Your UPI ID / VPA</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. mobile@oksbi / name@paytm"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiVerified(false);
                            }}
                          />
                        </div>

                        {/* Quick UPI Suffix Pills */}
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {['@oksbi', '@okhdfcbank', '@paytm', '@ybl'].map((suf) => (
                            <button
                              key={suf}
                              type="button"
                              onClick={() => {
                                const prefix = (customerPhone || '9876543210');
                                setUpiId(`${prefix}${suf}`);
                              }}
                              className="badge"
                              style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-medium)', cursor: 'pointer', padding: '0.3rem 0.55rem' }}
                            >
                              {suf}
                            </button>
                          ))}
                        </div>

                        {/* App Quick Launch simulation */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Supported Apps:</span>
                          <span className="badge" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>GPay</span>
                          <span className="badge" style={{ backgroundColor: '#F3E8FF', color: '#6B21A8' }}>PhonePe</span>
                          <span className="badge" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>Paytm</span>
                          <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>BHIM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 2: Credit / Debit Card */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '1.1rem',
                    borderRadius: '14px',
                    border: paymentMethod === 'CARD_PAYMENT' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: paymentMethod === 'CARD_PAYMENT' ? '#FDF9F6' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD_PAYMENT"
                    checked={paymentMethod === 'CARD_PAYMENT'}
                    onChange={() => setPaymentMethod('CARD_PAYMENT')}
                    style={{ marginTop: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CreditCard size={18} color="var(--primary)" />
                        <span>Credit / Debit Card (RuPay, Visa, Mastercard)</span>
                      </div>
                      <span className="badge" style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}>3D Secure OTP</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Pay securely with any domestic or international debit / credit card with bank OTP verification.
                    </div>
                  </div>
                </label>

                {/* Sub-panel for Card Input */}
                {paymentMethod === 'CARD_PAYMENT' && (
                  <div
                    style={{
                      marginLeft: '1.5rem',
                      padding: '1.25rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid var(--border-medium)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <label className="form-label" style={{ margin: 0 }}>Card Number</label>
                          <span className="badge" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-main)', fontSize: '0.72rem' }}>
                            {getCardNetwork()}
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="4532 8901 2345 6789"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Name on Card</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. PRIYA SHARMA"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          />
                        </div>

                        <div className="grid grid-cols-2" style={{ gap: '0.75rem' }}>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              maxLength={5}
                              className="form-control"
                              placeholder="12/28"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                            />
                          </div>

                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">CVV / CVC</label>
                            <input
                              type="password"
                              maxLength={4}
                              className="form-control"
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Demo Card Helper */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Demo Indian RuPay/Visa Test Card:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCardNumber('4532 8901 2345 6789');
                            setCardExpiry('12/28');
                            setCardCvv('789');
                            if (!cardHolder) setCardHolder('DEMO PATRON');
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                        >
                          Auto Fill Card
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 3: Net Banking */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '1.1rem',
                    borderRadius: '14px',
                    border: paymentMethod === 'NET_BANKING' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: paymentMethod === 'NET_BANKING' ? '#FDF9F6' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="NET_BANKING"
                    checked={paymentMethod === 'NET_BANKING'}
                    onChange={() => setPaymentMethod('NET_BANKING')}
                    style={{ marginTop: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LandmarkIcon size={18} color="var(--primary)" />
                        <span>Net Banking (Indian Retail & Corporate)</span>
                      </div>
                      <span className="badge" style={{ backgroundColor: '#F3E8FF', color: '#6B21A8' }}>Direct Debit</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Instant secure debit from State Bank of India, HDFC, ICICI, Axis Bank & 40+ banks.
                    </div>
                  </div>
                </label>

                {/* Sub-panel for Net Banking */}
                {paymentMethod === 'NET_BANKING' && (
                  <div
                    style={{
                      marginLeft: '1.5rem',
                      padding: '1.25rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid var(--border-medium)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div className="grid grid-cols-3 md-grid-cols-2" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
                      {[
                        { id: 'HDFC', name: 'HDFC Bank' },
                        { id: 'SBI', name: 'State Bank of India' },
                        { id: 'ICICI', name: 'ICICI Bank' },
                        { id: 'AXIS', name: 'Axis Bank' },
                        { id: 'KOTAK', name: 'Kotak Mahindra' },
                        { id: 'PNB', name: 'Punjab National Bank' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBank(b.id)}
                          style={{
                            padding: '0.75rem 0.5rem',
                            borderRadius: '8px',
                            border: selectedBank === b.id ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                            backgroundColor: selectedBank === b.id ? 'var(--primary-light)' : '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Selected Bank Portal: <strong>{selectedBank} NetBanking Online Gateway</strong>
                    </div>
                  </div>
                )}

                {/* Method 4: Pay on Delivery */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '1.1rem',
                    borderRadius: '14px',
                    border: paymentMethod === 'PAY_ON_DELIVERY' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: paymentMethod === 'PAY_ON_DELIVERY' ? '#FDF9F6' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAY_ON_DELIVERY"
                    checked={paymentMethod === 'PAY_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('PAY_ON_DELIVERY')}
                    style={{ marginTop: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Banknote size={18} color="var(--primary)" />
                        <span>Pay on Delivery (Cash or UPI at Doorstep)</span>
                      </div>
                      <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>Doorstep Payment</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Inspect your bespoke cake upon handover and pay the delivery partner via cash or UPI scan.
                    </div>
                  </div>
                </label>
              </div>

              {/* Status note */}
              <div
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Lock size={15} color="var(--primary)" />
                <span>
                  All payments are processed with bank-level encryption. For online payments, transaction IDs are recorded directly in your invoice.
                </span>
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                    Payment Mode: <strong>{paymentMethod.replace(/_/g, ' ')}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || upiSimulating || bankProcessing}
                  className="btn btn-primary btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '240px', justifyContent: 'center' }}
                >
                  {submitting || upiSimulating || bankProcessing ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>{upiSimulating ? 'Processing UPI Autopay...' : bankProcessing ? 'Contacting Bank Gateway...' : 'Submitting Order...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{paymentMethod === 'PAY_ON_DELIVERY' ? 'Place Cake Order' : `Pay ${formatINR(total)} & Order`}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', textAlign: 'center' }}>
                By clicking pay/order, you authorize the artisan bakery to craft your order and reserve baking capacity.
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 3D Secure / OTP Simulation Modal */}
      {showOtpModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>
                  3D Secure Bank Verification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Merchant:</span>
                <strong>Whisk & Layers India</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Amount:</span>
                <strong style={{ color: 'var(--primary)' }}>{formatINR(total)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Card:</span>
                <strong>{getCardNetwork()} ending in {cardNumber.slice(-4) || '6789'}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Enter the 6-digit One Time Password (OTP) sent to your registered mobile number ending in <strong>••••{customerPhone.slice(-4) || '4321'}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  className="form-control"
                  style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.4rem', fontWeight: 700 }}
                  placeholder="123456"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>

              {/* Demo Helper */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  Demo Sandbox OTP: <strong>123456</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtpValue('123456')}
                  className="badge"
                  style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
                >
                  Auto-Fill 123456
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  {otpSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <span>Confirm & Pay {formatINR(total)}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
