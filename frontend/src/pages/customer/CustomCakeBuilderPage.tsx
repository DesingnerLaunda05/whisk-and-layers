import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CustomizationOption, CustomOptionType, Bakery, Cake } from '../../types';
import { customizationApi } from '../../services/customizationApi';
import { bakeryApi } from '../../services/bakeryApi';
import { cakeApi } from '../../services/cakeApi';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { SafeImage } from '../../components/ui/SafeImage';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  ShoppingBag,
  Store,
  Palette,
  Layers,
  Heart,
  Calendar,
} from 'lucide-react';
import { formatINR } from '../../utils/indiaConstants';

export const CustomCakeBuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { success, error } = useToast();

  const preselectedBakeryId = searchParams.get('bakeryId') ? parseInt(searchParams.get('bakeryId')!, 10) : null;
  const preselectedCakeId = searchParams.get('cakeId') ? parseInt(searchParams.get('cakeId')!, 10) : null;

  const [loading, setLoading] = useState<boolean>(true);
  const [groupedOptions, setGroupedOptions] = useState<Record<CustomOptionType, CustomizationOption[]>>({
    BASE: [],
    FLAVOR: [],
    SIZE: [],
    SHAPE: [],
    ICING: [],
    TOPPING: [],
    DECORATION: [],
  });
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [selectedBakery, setSelectedBakery] = useState<Bakery | null>(null);

  // Wizard Step (1 to 9)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedBase, setSelectedBase] = useState<CustomizationOption | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<CustomizationOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<CustomizationOption | null>(null);
  const [selectedShape, setSelectedShape] = useState<CustomizationOption | null>(null);
  const [selectedIcing, setSelectedIcing] = useState<CustomizationOption | null>(null);
  const [selectedTopping, setSelectedTopping] = useState<CustomizationOption | null>(null);
  const [selectedDecoration, setSelectedDecoration] = useState<CustomizationOption | null>(null);
  const [customMessage, setCustomMessage] = useState<string>('Happy Birthday & Celebrations!');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const baseStartingPrice = 650.0; // Artisan Custom Base baseline in INR

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [optRes, bakeryRes] = await Promise.all([
          customizationApi.getOptions(),
          bakeryApi.getAll({ limit: 10 }),
        ]);

        setGroupedOptions(optRes.grouped);
        setBakeries(bakeryRes.bakeries);

        // Preselect defaults
        if (optRes.grouped.BASE.length > 0) setSelectedBase(optRes.grouped.BASE[0]);
        if (optRes.grouped.FLAVOR.length > 0) setSelectedFlavor(optRes.grouped.FLAVOR[0]);
        if (optRes.grouped.SIZE.length > 0) setSelectedSize(optRes.grouped.SIZE[0]);
        if (optRes.grouped.SHAPE.length > 0) setSelectedShape(optRes.grouped.SHAPE[0]);
        if (optRes.grouped.ICING.length > 0) setSelectedIcing(optRes.grouped.ICING[0]);
        if (optRes.grouped.TOPPING.length > 0) setSelectedTopping(optRes.grouped.TOPPING[0]);
        if (optRes.grouped.DECORATION.length > 0) setSelectedDecoration(optRes.grouped.DECORATION[0]);

        // Select initial bakery
        if (preselectedBakeryId) {
          const match = bakeryRes.bakeries.find((b) => b.id === preselectedBakeryId);
          if (match) setSelectedBakery(match);
        } else if (bakeryRes.bakeries.length > 0) {
          setSelectedBakery(bakeryRes.bakeries[0]);
        }
      } catch (err) {
        console.error('Failed to load customization data', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [preselectedBakeryId]);

  // Compute live price
  const calculateTotal = (): number => {
    let total = baseStartingPrice;
    if (selectedBase) total += selectedBase.extra_price;
    if (selectedFlavor) total += selectedFlavor.extra_price;
    if (selectedSize) total += selectedSize.extra_price;
    if (selectedShape) total += selectedShape.extra_price;
    if (selectedIcing) total += selectedIcing.extra_price;
    if (selectedTopping) total += selectedTopping.extra_price;
    if (selectedDecoration) total += selectedDecoration.extra_price;
    return Math.round(total * 100) / 100;
  };

  const stepsMeta = [
    { number: 1, title: 'Cake Base', subtitle: 'Choose your sponge crumb' },
    { number: 2, title: 'Flavor & Filling', subtitle: 'Select fruit compote or cream' },
    { number: 3, title: 'Size & Servings', subtitle: 'From intimate to 2-tier showpiece' },
    { number: 4, title: 'Cake Shape', subtitle: 'Round, heart, or modern square' },
    { number: 5, title: 'Icing & Frosting', subtitle: 'Swiss meringue, ganache, or cream cheese' },
    { number: 6, title: 'Toppings', subtitle: 'Fresh berries, macarons, or gold leaf' },
    { number: 7, title: 'Decoration Style', subtitle: 'Vintage Lambeth or floral styling' },
    { number: 8, title: 'Message & Bakery', subtitle: 'Hand-lettered celebration inscription' },
    { number: 9, title: 'Review & Order', subtitle: 'Verify your bespoke creation' },
  ];

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleFinishAndAddToCart = () => {
    if (!selectedBakery) {
      error('Please choose an artisan bakery to craft your cake.');
      setCurrentStep(8);
      return;
    }

    const price = calculateTotal();
    const customSnapshot = {
      base: `${selectedBase?.label}${selectedBase?.extra_price ? ` (+${formatINR(selectedBase.extra_price)})` : ''}`,
      flavor: `${selectedFlavor?.label}${selectedFlavor?.extra_price ? ` (+${formatINR(selectedFlavor.extra_price)})` : ''}`,
      size: `${selectedSize?.label}${selectedSize?.extra_price ? ` (+${formatINR(selectedSize.extra_price)})` : ''}`,
      shape: `${selectedShape?.label}${selectedShape?.extra_price ? ` (+${formatINR(selectedShape.extra_price)})` : ''}`,
      icing: `${selectedIcing?.label}${selectedIcing?.extra_price ? ` (+${formatINR(selectedIcing.extra_price)})` : ''}`,
      topping: `${selectedTopping?.label}${selectedTopping?.extra_price ? ` (+${formatINR(selectedTopping.extra_price)})` : ''}`,
      decoration: `${selectedDecoration?.label}${selectedDecoration?.extra_price ? ` (+${formatINR(selectedDecoration.extra_price)})` : ''}`,
      specialInstructions: specialInstructions.trim() || undefined,
    };

    addItem({
      bakeryId: selectedBakery.id,
      bakeryName: selectedBakery.name,
      cakeName: `Bespoke Custom Cake (${selectedSize?.label.split(' ')[0] || 'Artisan'})`,
      cakeImage: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
      basePrice: baseStartingPrice,
      unitPrice: price,
      quantity: 1,
      isCustom: true,
      customMessage: customMessage.trim() || undefined,
      selectedOptions: customSnapshot as any,
      leadDays: Math.max(selectedBakery.minimum_lead_days, 2),
    });

    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Custom Cake Studio...</p>
      </div>
    );
  }

  const currentStepMeta = stepsMeta[currentStep - 1];

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Studio Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.8rem',
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={14} />
            <span>Interactive Custom Cake Studio</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Design Your Bespoke Cake
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Follow our 8 guided steps to configure your flavors, size, styling, and personal celebratory message.
          </p>
        </div>

        {/* Progress Stepper Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '2rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            overflowX: 'auto',
            gap: '0.5rem',
          }}
        >
          {stepsMeta.map((s) => {
            const isDone = currentStep > s.number;
            const isCurrent = currentStep === s.number;

            return (
              <button
                key={s.number}
                onClick={() => setCurrentStep(s.number)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  background: isCurrent ? 'var(--primary)' : isDone ? 'var(--bg-muted)' : 'transparent',
                  color: isCurrent ? '#FFFFFF' : isDone ? 'var(--text-main)' : 'var(--text-light)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                }}
              >
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? '#FFFFFF' : isDone ? 'var(--success)' : '#EAE2D7',
                    color: isCurrent ? 'var(--primary)' : isDone ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {isDone ? <Check size={12} /> : s.number}
                </span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Builder Grid: Studio Options + Live Summary Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 0.75fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="builder-grid"
        >
          {/* Left: Step Interactive Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-light)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Step {currentStepMeta.number} of 9
              </div>
              <h2 style={{ fontSize: '1.65rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {currentStepMeta.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {currentStepMeta.subtitle}
              </p>
            </div>

            {/* STEP 1: CAKE BASE */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                {groupedOptions.BASE.map((opt) => {
                  const selected = selectedBase?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedBase(opt)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: selected ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{opt.label}</h4>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          {opt.extra_price === 0 ? 'Included' : `+${formatINR(opt.extra_price)}`}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 2: FLAVOR / FILLING */}
            {currentStep === 2 && (
              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                {groupedOptions.FLAVOR.map((opt) => {
                  const selected = selectedFlavor?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedFlavor(opt)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: selected ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{opt.label}</h4>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          {opt.extra_price === 0 ? 'Included' : `+${formatINR(opt.extra_price)}`}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 3: SIZE & SERVINGS */}
            {currentStep === 3 && (
              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                {groupedOptions.SIZE.map((opt) => {
                  const selected = selectedSize?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedSize(opt)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: selected ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{opt.label}</h4>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          {opt.extra_price === 0 ? 'Included' : `+${formatINR(opt.extra_price)}`}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 4: SHAPE */}
            {currentStep === 4 && (
              <div className="grid grid-cols-3 sm-grid-cols-1" style={{ gap: '1rem' }}>
                {groupedOptions.SHAPE.map((opt) => {
                  const selected = selectedShape?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedShape(opt)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: selected ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                        {opt.extra_price === 0 ? 'Standard' : `+${formatINR(opt.extra_price)}`}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 5: ICING */}
            {currentStep === 5 && (
              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                {groupedOptions.ICING.map((opt) => {
                  const selected = selectedIcing?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedIcing(opt)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: selected ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{opt.label}</h4>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          {opt.extra_price === 0 ? 'Included' : `+${formatINR(opt.extra_price)}`}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 6: TOPPINGS */}
            {currentStep === 6 && (
              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                {groupedOptions.TOPPING.map((opt) => {
                  const selected = selectedTopping?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedTopping(opt)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: selected ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{opt.label}</h4>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          {opt.extra_price === 0 ? 'Included' : `+${formatINR(opt.extra_price)}`}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 7: DECORATION STYLE */}
            {currentStep === 7 && (
              <div className="grid grid-cols-2 md-grid-cols-1" style={{ gap: '1rem' }}>
                {groupedOptions.DECORATION.map((opt) => {
                  const selected = selectedDecoration?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedDecoration(opt)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: selected ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{opt.label}</h4>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          {opt.extra_price === 0 ? 'Included' : `+${formatINR(opt.extra_price)}`}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 8: MESSAGE & BAKERY SELECTION */}
            {currentStep === 8 && (
              <div>
                {/* Bakery Picker */}
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Select Bakery to Handcraft This Cake
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {bakeries.map((b) => {
                      const isSelected = selectedBakery?.id === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBakery(b)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                            backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                            cursor: 'pointer',
                          }}
                        >
                          <SafeImage
                            src={b.logo_url}
                            alt={b.name}
                            fallbackType="bakery-logo"
                            style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                              {b.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {b.city}, {b.state} · Min {b.minimum_lead_days} Days Lead Time
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 size={20} color="var(--primary)" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hand-lettered Inscription */}
                <div className="form-group">
                  <label className="form-label">
                    Hand-piped Celebration Inscription (Free)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 'Happy 30th Birthday Elena!'"
                    value={customMessage}
                    maxLength={70}
                    onChange={(e) => setCustomMessage(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
                    Hand-piped on cake crown or cake board in coordinating script.
                  </span>
                </div>

                {/* Special Instructions */}
                <div className="form-group">
                  <label className="form-label">
                    Special Chef Notes / Color Palettes (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Pastel peach and ivory colors preferred; no nuts in kitchen."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* STEP 9: FINAL REVIEW */}
            {currentStep === 9 && (
              <div>
                <div
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--border-medium)', paddingBottom: '0.5rem' }}>
                    Your Custom Cake Blueprint
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Artisan Bakery:</span>
                      <strong>{selectedBakery?.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Cake Base:</span>
                      <strong>{selectedBase?.label}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Flavor / Compote:</span>
                      <strong>{selectedFlavor?.label}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Size & Servings:</span>
                      <strong>{selectedSize?.label}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Cake Shape:</span>
                      <strong>{selectedShape?.label}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Icing / Frosting:</span>
                      <strong>{selectedIcing?.label}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Toppings:</span>
                      <strong>{selectedTopping?.label}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Decoration Style:</span>
                      <strong>{selectedDecoration?.label}</strong>
                    </div>
                    {customMessage && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-medium)', paddingTop: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Celebration Message:</span>
                        <strong style={{ color: 'var(--primary)' }}>"{customMessage}"</strong>
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Clicking "Add Bespoke Cake to Cart" will place this custom configuration into your cart ready for checkout.
                </p>
              </div>
            )}

            {/* Stepper Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              {currentStep < 9 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>Continue to Step {currentStep + 1}</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishAndAddToCart}
                  className="btn btn-primary btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                >
                  <ShoppingBag size={20} />
                  <span>Add Bespoke Cake to Cart — {formatINR(calculateTotal())}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Live Interactive Price & Summary Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-light)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '120px',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={18} color="var(--primary)" />
              <span>Live Price Counter</span>
            </h3>

            {/* Price Total Hero */}
            <div
              style={{
                backgroundColor: 'var(--primary-light)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Estimated Total
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
                {formatINR(calculateTotal())}
              </div>
            </div>

            {/* Selected Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Artisan Base:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatINR(baseStartingPrice)}</span>
              </div>
              {selectedBase && selectedBase.extra_price > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>{selectedBase.name}:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>+{formatINR(selectedBase.extra_price)}</span>
                </div>
              )}
              {selectedFlavor && selectedFlavor.extra_price > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>{selectedFlavor.name}:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>+{formatINR(selectedFlavor.extra_price)}</span>
                </div>
              )}
              {selectedSize && selectedSize.extra_price > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>{selectedSize.name}:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>+{formatINR(selectedSize.extra_price)}</span>
                </div>
              )}
              {selectedShape && selectedShape.extra_price > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>{selectedShape.name}:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>+{formatINR(selectedShape.extra_price)}</span>
                </div>
              )}
              {selectedIcing && selectedIcing.extra_price > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>{selectedIcing.name}:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>+{formatINR(selectedIcing.extra_price)}</span>
                </div>
              )}
              {selectedTopping && selectedTopping.extra_price > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>{selectedTopping.name}:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>+{formatINR(selectedTopping.extra_price)}</span>
                </div>
              )}
              {selectedDecoration && selectedDecoration.extra_price > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>{selectedDecoration.name}:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>+{formatINR(selectedDecoration.extra_price)}</span>
                </div>
              )}
            </div>

            {selectedBakery && (
              <div
                style={{
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  <Store size={14} color="var(--primary)" />
                  <span>{selectedBakery.name}</span>
                </div>
                <div>Required Lead Time: {selectedBakery.minimum_lead_days} days</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .builder-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
