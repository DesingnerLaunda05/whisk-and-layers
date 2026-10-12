import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CustomizationOption, CustomOptionType, Bakery } from '../../types';
import { customizationApi } from '../../services/customizationApi';
import { bakeryApi } from '../../services/bakeryApi';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { SafeImage } from '../../components/ui/SafeImage';
import { Cake3DViewer } from '../../components/ui/Cake3DViewer';
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
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  Sliders,
  HelpCircle,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { formatINR } from '../../utils/indiaConstants';

// Default Fallback Customization Options if API is slow or offline
const FALLBACK_OPTIONS: Record<CustomOptionType, CustomizationOption[]> = {
  BASE: [
    { id: 1, name: 'Eggless Vanilla Chiffon', type: 'BASE', label: 'Classic Madagascar Vanilla Sponge', description: 'Light, fluffy eggless sponge infused with pure Bourbon vanilla bean extract', extra_price: 0, sort_order: 1 },
    { id: 2, name: 'Eggless Rich Dark Chocolate', type: 'BASE', label: 'Dutch Dark Chocolate Sponge', description: 'Intensely chocolatey, moist crumb with 70% dark cocoa notes', extra_price: 100, sort_order: 2 },
    { id: 3, name: 'Red Velvet Cocoa Chiffon', type: 'BASE', label: 'Ruby Cocoa Sponge', description: 'Silky cocoa sponge with delicate tang and deep ruby hue', extra_price: 120, sort_order: 3 },
    { id: 4, name: 'Cardamom & Saffron Sponge', type: 'BASE', label: 'Royal Kesar Elaichi Sponge', description: 'Aromatic sponge infused with Kashmiri saffron strands and fresh green cardamom', extra_price: 150, sort_order: 4 },
  ],
  FLAVOR: [
    { id: 5, name: 'Belgian Chocolate Truffle', type: 'FLAVOR', label: 'Rich Dark Chocolate Truffle', description: 'Decadent 55% cocoa silky ganache filling', extra_price: 0, sort_order: 1 },
    { id: 6, name: 'Royal Rasmalai Cream', type: 'FLAVOR', label: 'Saffron Milk & Pistachio Rasmalai', description: 'Real soft cottage cheese dumplings simmered in rich saffron-cardamom milk', extra_price: 150, sort_order: 2 },
    { id: 7, name: 'Lotus Biscoff Spread', type: 'FLAVOR', label: 'Caramelized Spiced Speculoos Cream', description: 'Luscious Belgian Biscoff spread with crunchy biscuit crumble', extra_price: 150, sort_order: 3 },
    { id: 8, name: 'Alphonso Mango Compote', type: 'FLAVOR', label: 'Ratnagiri Alphonso Pulp', description: 'Sweet, vibrant slow-simmered pure mango reduction', extra_price: 120, sort_order: 4 },
    { id: 9, name: 'Butterscotch Praline Crunch', type: 'FLAVOR', label: 'Golden Cashew Praline & Caramel', description: 'Handmade crunchy cashew praline with creamy caramel sauce', extra_price: 100, sort_order: 5 },
    { id: 10, name: 'Fresh Strawberry Compote', type: 'FLAVOR', label: 'Mahabaleshwar Strawberry Coulis', description: 'Fresh organic strawberry reduction with balanced sweetness', extra_price: 100, sort_order: 6 },
  ],
  SIZE: [
    { id: 11, name: '0.5 Kg', type: 'SIZE', label: '0.5 Kg (Serves 3–4)', description: 'Ideal for intimate birthdays, dates, and cozy milestones', extra_price: 0, sort_order: 1 },
    { id: 12, name: '1.0 Kg', type: 'SIZE', label: '1.0 Kg (Serves 6–8)', description: 'Our most popular size for family celebrations and dinner parties', extra_price: 400, sort_order: 2 },
    { id: 13, name: '1.5 Kg', type: 'SIZE', label: '1.5 Kg (Serves 10–12)', description: 'Perfect for lively milestone parties and joyful gatherings', extra_price: 750, sort_order: 3 },
    { id: 14, name: '2.0 Kg', type: 'SIZE', label: '2.0 Kg (Serves 14–16)', description: 'Generous celebration cake for larger family events', extra_price: 1100, sort_order: 4 },
    { id: 15, name: '3.0 Kg (2-Tier)', type: 'SIZE', label: '3.0 Kg Two-Tier Tower (Serves 22–26)', description: 'Showstopping tiered celebration centerpiece with structural support', extra_price: 1800, sort_order: 5 },
  ],
  SHAPE: [
    { id: 16, name: 'Classic Round', type: 'SHAPE', label: 'Traditional Symmetrical Round', description: 'Timeless symmetrical shape with clean vertical edges', extra_price: 0, sort_order: 1 },
    { id: 17, name: 'Romantic Heart', type: 'SHAPE', label: 'Sweetheart Contour', description: 'Charming scalloped heart contour for anniversaries and birthdays', extra_price: 100, sort_order: 2 },
    { id: 18, name: 'Contemporary Square', type: 'SHAPE', label: 'Modern Crisp Square', description: 'Contemporary crisp 90-degree corners for a modern aesthetic', extra_price: 80, sort_order: 3 },
    { id: 19, name: 'Regal Hexagon', type: 'SHAPE', label: 'Architectural Hexagon Profile', description: 'Dramatic geometric 6-sided cake profile with sleek European lines', extra_price: 150, sort_order: 4 },
  ],
  ICING: [
    { id: 20, name: 'Light Whipped Cream', type: 'ICING', label: 'Whipped Dairy Cream (Fresh & Light)', description: 'Airy, silky whipped cream with balanced sweetness', extra_price: 0, sort_order: 1 },
    { id: 21, name: 'Belgian Dark Chocolate Ganache', type: 'ICING', label: 'Silky Gloss Chocolate Ganache', description: 'Decadent pourable ganache with mirror gloss and deep cocoa finish', extra_price: 150, sort_order: 2 },
    { id: 22, name: 'Cream Cheese Frosting', type: 'ICING', label: 'Whipped Cream Cheese Frosting', description: 'Tangy, luscious frosting whipped to silky perfection', extra_price: 180, sort_order: 3 },
    { id: 23, name: 'Swiss Meringue Buttercream', type: 'ICING', label: 'Silky Velvet Buttercream', description: 'Ultra-smooth, velvet frosting ideal for sharp edges and vintage piping', extra_price: 120, sort_order: 4 },
  ],
  TOPPING: [
    { id: 24, name: 'Roasted Almond & Pistachio Flakes', type: 'TOPPING', label: 'Shaved Dry Fruits & Saffron', description: 'Premium hand-sliced Mamra almonds and Iranian green pistachios', extra_price: 80, sort_order: 1 },
    { id: 25, name: 'Exotic Fresh Fruits', type: 'TOPPING', label: 'Fresh Kiwi, Berries & Dragon Fruit', description: 'Handpicked colorful tropical fruits cut fresh on delivery day', extra_price: 150, sort_order: 2 },
    { id: 26, name: 'Belgian Chocolate Curls', type: 'TOPPING', label: 'Dual Milk & Dark Chocolate Curls', description: 'Artisan chocolate bark shavings layered across the crown', extra_price: 100, sort_order: 3 },
    { id: 27, name: 'Crushed Lotus Biscoff Crumbs', type: 'TOPPING', label: 'Caramelized Biscuit Crumble', description: 'Crunchy Biscoff cookies crushed over silky spread drip', extra_price: 120, sort_order: 4 },
    { id: 28, name: 'Ferrero Rocher & Macaron Trio', type: 'TOPPING', label: 'Gold-Dusted Chocolates & Macarons', description: 'Whole Ferrero Rocher pralines paired with almond French macarons', extra_price: 250, sort_order: 5 },
    { id: 29, name: 'No Extra Toppings', type: 'TOPPING', label: 'Clean Minimalist Crown', description: 'Clean top finish ready for custom hand-piped messages or candles', extra_price: 0, sort_order: 6 },
  ],
  DECORATION: [
    { id: 30, name: 'Vintage Lambeth Borders', type: 'DECORATION', label: 'Victorian Vintage Lambeth Scrollwork', description: 'Intricate multi-tier ruffled piping with sugar pearl embellishments', extra_price: 150, sort_order: 1 },
    { id: 31, name: '24K Edible Gold Leaf & Rose Petals', type: 'DECORATION', label: 'Pure Gold Leaf & Organic Dried Roses', description: 'Artfully placed 24k edible gold foil with fragrant dried red rose petals', extra_price: 200, sort_order: 2 },
    { id: 32, name: 'Minimalist Floral Piping', type: 'DECORATION', label: 'Delicate Buttercream Blossoms', description: 'Understated pastel buttercream rosettes and delicate foliage', extra_price: 100, sort_order: 3 },
    { id: 33, name: 'Artisan Chocolate Drip & Pearls', type: 'DECORATION', label: 'Glossy Drip with Shimmer Pearls', description: 'Slow cocoa drip along the borders with edible pearlescent beads', extra_price: 120, sort_order: 4 },
  ],
};

const COLOR_PALETTES = [
  { name: 'Ivory Cream', hex: '#FAF5EF', text: '#3E2723' },
  { name: 'Blush Pink', hex: '#F7D6D9', text: '#4A1521' },
  { name: 'Champagne Gold', hex: '#F3E5AB', text: '#4E3A09' },
  { name: 'Sage Green', hex: '#D2E3C8', text: '#1E3A1A' },
  { name: 'Lavender Mist', hex: '#E2D9F3', text: '#2E1A47' },
  { name: 'Sky Cerulean', hex: '#D0E8F2', text: '#0B2545' },
  { name: 'Belgian Mocha', hex: '#5D4037', text: '#FFFFFF' },
  { name: 'Midnight Navy', hex: '#1E293B', text: '#FFFFFF' },
  { name: 'Sunset Terracotta', hex: '#E78878', text: '#FFFFFF' },
  { name: 'Pure Snow White', hex: '#FFFFFF', text: '#222222' },
];

const ACCENT_COLORS = [
  { name: '24K Gold Accent', hex: '#D4AF37' },
  { name: 'Pure White Frost', hex: '#FFFFFF' },
  { name: 'Rose Petal', hex: '#E57399' },
  { name: 'Belgian Dark Ganache', hex: '#361E14' },
  { name: 'Royal Emerald', hex: '#145A32' },
  { name: 'Silver Shimmer', hex: '#BDC3C7' },
];

import { MockDataStore } from '../../services/mockDataStore';

export const CustomCakeBuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { success, error } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const preselectedBakeryId = searchParams.get('bakeryId') ? parseInt(searchParams.get('bakeryId')!, 10) : null;

  // Immediate synchronous initialization from MockDataStore & Fallbacks - 0ms delay!
  const [loading, setLoading] = useState<boolean>(false);
  const [groupedOptions, setGroupedOptions] = useState<Record<CustomOptionType, CustomizationOption[]>>(FALLBACK_OPTIONS);
  const [bakeries, setBakeries] = useState<Bakery[]>(() => {
    try {
      return MockDataStore.getBakeries();
    } catch {
      return [];
    }
  });
  const [selectedBakery, setSelectedBakery] = useState<Bakery | null>(() => {
    try {
      const allB = MockDataStore.getBakeries();
      if (preselectedBakeryId) {
        return allB.find((b) => b.id === preselectedBakeryId) || allB[0] || null;
      }
      return allB[0] || null;
    } catch {
      return null;
    }
  });

  // Studio Mode: 'FREE_HAND' (complete freedom) vs 'GUIDED' (step-by-step)
  const [studioMode, setStudioMode] = useState<'FREE_HAND' | 'GUIDED'>('FREE_HAND');
  const [guidedStep, setGuidedStep] = useState<number>(1);

  // Architecture & Structure
  const [tierCount, setTierCount] = useState<number>(2); // 1, 2, 3, 4
  const [selectedShape, setSelectedShape] = useState<'ROUND' | 'SQUARE' | 'HEART' | 'HEXAGON'>('ROUND');

  // Palette & Styling
  const [frostingColor, setFrostingColor] = useState<string>('#FAF5EF');
  const [accentColor, setAccentColor] = useState<string>('#D4AF37');
  const [selected3DToppings, setSelected3DToppings] = useState<string[]>(['macarons', 'berries', 'gold_leaf']);

  // Traditional Selections - instant non-null defaults!
  const [selectedBase, setSelectedBase] = useState<CustomizationOption | null>(FALLBACK_OPTIONS.BASE[0]);
  const [selectedFlavor, setSelectedFlavor] = useState<CustomizationOption | null>(FALLBACK_OPTIONS.FLAVOR[0]);
  const [selectedSize, setSelectedSize] = useState<CustomizationOption | null>(FALLBACK_OPTIONS.SIZE[1] || FALLBACK_OPTIONS.SIZE[0]);
  const [selectedIcing, setSelectedIcing] = useState<CustomizationOption | null>(FALLBACK_OPTIONS.ICING[0]);
  const [selectedTopping, setSelectedTopping] = useState<CustomizationOption | null>(FALLBACK_OPTIONS.TOPPING[0]);
  const [selectedDecoration, setSelectedDecoration] = useState<CustomizationOption | null>(FALLBACK_OPTIONS.DECORATION[0]);

  // Personalization & Notes
  const [customCakeTitle, setCustomCakeTitle] = useState<string>('My Bespoke Celebration Cake');
  const [customMessage, setCustomMessage] = useState<string>('Happy Birthday & Celebrations!');
  const [dietaryChoice, setDietaryChoice] = useState<string>('100% Eggless (Vegetarian)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Inspiration / Reference Image Upload
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>('');
  const [referenceNotes, setReferenceNotes] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // Base starting baseline in INR
  const baseStartingPrice = 650.0;

  useEffect(() => {
    const initData = async () => {
      try {
        const [optRes, bakeryRes] = await Promise.all([
          customizationApi.getOptions().catch(() => null),
          bakeryApi.getAll({ limit: 20 }).catch(() => null),
        ]);

        if (optRes?.grouped && Object.keys(optRes.grouped).length > 0) {
          setGroupedOptions((prev) => ({ ...prev, ...optRes.grouped }));
        }

        if (bakeryRes?.bakeries && bakeryRes.bakeries.length > 0) {
          setBakeries(bakeryRes.bakeries);
          if (preselectedBakeryId) {
            const match = bakeryRes.bakeries.find((b) => b.id === preselectedBakeryId);
            if (match) setSelectedBakery(match);
          } else {
            setSelectedBakery((prev) => prev || bakeryRes.bakeries[0]);
          }
        }
      } catch (err) {
        console.warn('Background sync customization data error:', err);
      }
    };
    initData();
  }, [preselectedBakeryId]);

  // Adjust 3D tiers when size changes
  useEffect(() => {
    if (selectedSize) {
      if (selectedSize.name.includes('2-Tier') || selectedSize.name.includes('3.0 Kg')) {
        setTierCount(2);
      } else if (selectedSize.name.includes('0.5 Kg')) {
        setTierCount(1);
      } else if (selectedSize.name.includes('2.0 Kg')) {
        setTierCount(2);
      }
    }
  }, [selectedSize]);

  // Handle local image file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      error('Please select an image smaller than 8MB.');
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImageUrl(reader.result as string);
      setIsUploadingImage(false);
      success('Inspiration cake photo uploaded successfully! Our artisan bakers will replicate its styling.');
    };
    reader.onerror = () => {
      setIsUploadingImage(false);
      error('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Toggle 3D topping elements
  const toggle3DTopping = (toppingKey: string) => {
    if (selected3DToppings.includes(toppingKey)) {
      setSelected3DToppings(selected3DToppings.filter((t) => t !== toppingKey));
    } else {
      setSelected3DToppings([...selected3DToppings, toppingKey]);
    }
  };

  // Compute live price
  const calculateTotal = (): number => {
    let total = baseStartingPrice;
    // Tier surcharge
    if (tierCount === 2) total += 350;
    if (tierCount === 3) total += 750;
    if (tierCount === 4) total += 1400;

    if (selectedBase) total += selectedBase.extra_price;
    if (selectedFlavor) total += selectedFlavor.extra_price;
    if (selectedSize) total += selectedSize.extra_price;
    if (selectedIcing) total += selectedIcing.extra_price;
    if (selectedTopping) total += selectedTopping.extra_price;
    if (selectedDecoration) total += selectedDecoration.extra_price;
    return Math.round(total * 100) / 100;
  };

  // Add custom cake to cart
  const handleAddToCart = () => {
    if (!selectedBakery) {
      error('Please select an artisan bakery to craft your bespoke cake.');
      return;
    }

    const price = calculateTotal();
    const customSnapshot: Record<string, string> = {
      tiers: `${tierCount} Tier${tierCount > 1 ? 's' : ''}`,
      shape: selectedShape,
      frostingColor: frostingColor,
      accentColor: accentColor,
      baseSponge: selectedBase ? `${selectedBase.label} (+₹${selectedBase.extra_price})` : 'Classic Vanilla',
      flavorFilling: selectedFlavor ? `${selectedFlavor.label} (+₹${selectedFlavor.extra_price})` : 'Chocolate Truffle',
      weightSize: selectedSize ? `${selectedSize.label}` : '1.0 Kg',
      frostingType: selectedIcing ? `${selectedIcing.label}` : 'Swiss Buttercream',
      toppings3D: selected3DToppings.join(', '),
      dietaryPreference: dietaryChoice,
      inscription: customMessage.trim() || 'No message',
    };

    if (referenceImageUrl) {
      customSnapshot.hasInspirationPhoto = 'Yes (Customer Reference Upload Attached)';
      if (referenceNotes.trim()) {
        customSnapshot.referenceNotes = referenceNotes.trim();
      }
    }

    if (specialInstructions.trim()) {
      customSnapshot.specialInstructions = specialInstructions.trim();
    }

    addItem({
      bakeryId: selectedBakery.id,
      bakeryName: selectedBakery.name,
      cakeName: customCakeTitle.trim() || `Bespoke Custom Cake (${tierCount} Tier)`,
      cakeImage: referenceImageUrl || 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
      basePrice: baseStartingPrice,
      unitPrice: price,
      quantity: 1,
      isCustom: true,
      customMessage: customMessage.trim() || undefined,
      selectedOptions: customSnapshot,
      leadDays: Math.max(selectedBakery.minimum_lead_days, tierCount > 2 ? 3 : 2),
      referenceImage: referenceImageUrl || undefined,
      referenceNotes: referenceNotes.trim() || undefined,
    });

    success('Bespoke custom cake added to cart successfully!');
    navigate('/cart');
  };

  return (
    <div style={{ padding: '2rem 0 5rem 0', backgroundColor: '#FDFBF7' }}>
      <div className="container">
        {/* Studio Title Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.8rem',
              marginBottom: '0.85rem',
            }}
          >
            <Sparkles size={15} />
            <span>Artisan 3D Bespoke Studio & Visualizer</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            Design Your Custom Cake With Complete Creative Freedom
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Choose your stacked tiers, colors, sponges, and toppings in live interactive 3D.
            Upload an inspiration photo you saw online and our vetted pastry chefs will handcraft it for you.
          </p>

          {/* Mode Switcher Buttons */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              padding: '0.35rem',
              borderRadius: '30px',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-sm)',
              marginTop: '1.25rem',
              gap: '0.35rem',
            }}
          >
            <button
              type="button"
              onClick={() => setStudioMode('FREE_HAND')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: studioMode === 'FREE_HAND' ? 'var(--primary)' : 'transparent',
                color: studioMode === 'FREE_HAND' ? '#FFFFFF' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Palette size={16} />
              <span>Complete Free-Hand Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setStudioMode('GUIDED')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: studioMode === 'GUIDED' ? 'var(--primary)' : 'transparent',
                color: studioMode === 'GUIDED' ? '#FFFFFF' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Sliders size={16} />
              <span>Guided Step-by-Step Wizard</span>
            </button>
          </div>
        </div>

        {/* Studio Main Grid: Controls (Left) + 3D Visualizer & Summary (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="studio-grid"
        >
          {/* LEFT COLUMN: CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Inspiration Photo Upload Box */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '2px dashed #E0CFBF',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>
                    Upload Inspiration Photo (Saw online or on Instagram?)
                  </h3>
                </div>
                {referenceImageUrl && (
                  <button
                    type="button"
                    onClick={() => setReferenceImageUrl('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={14} /> Remove Photo
                  </button>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Upload any picture of a cake you loved from Pinterest, Instagram, or a party. Our artisan baker will match the styling, colors, and piping!
              </p>

              {referenceImageUrl ? (
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', width: '130px', height: '130px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                    <img
                      src={referenceImageUrl}
                      alt="Inspiration reference"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      <CheckCircle2 size={16} /> Reference Image Attached to Order
                    </div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>
                      Chef Re-creation Notes
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Please replicate the pastel ombre and Lambeth ruffled piping from this photo"
                      value={referenceNotes}
                      onChange={(e) => setReferenceNotes(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: '#FCFAF6',
                      border: '1px solid #ECE0D1',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Upload size={28} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {isUploadingImage ? 'Processing Image...' : 'Click or Drag & Drop to Upload Cake Photo'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                      Supports PNG, JPG, JPEG, WEBP up to 8MB
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>Or paste an image URL:</span>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/dream-cake.jpg"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                      onBlur={(e) => {
                        if (e.target.value.trim().startsWith('http')) {
                          setReferenceImageUrl(e.target.value.trim());
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Cake Architecture (Tiers & Shape) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid var(--border-light)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={20} color="var(--primary)" />
                <span>1. Cake Architecture & Stacked Tiers</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Select how many tiers your cake should have and its architectural geometry.
              </p>

              {/* Tiers Selector */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Number of Stacked Tiers
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {[
                    { count: 1, label: '1 Tier', subtitle: 'Intimate (1.0 Kg)' },
                    { count: 2, label: '2 Tiers', subtitle: 'Party (2.0 Kg)' },
                    { count: 3, label: '3 Tiers', subtitle: 'Grand (3.5 Kg)' },
                    { count: 4, label: '4 Tiers', subtitle: 'Showpiece (5 Kg+)' },
                  ].map((t) => (
                    <button
                      key={t.count}
                      type="button"
                      onClick={() => setTierCount(t.count)}
                      style={{
                        padding: '1rem 0.5rem',
                        borderRadius: '12px',
                        border: tierCount === t.count ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: tierCount === t.count ? 'var(--primary-light)' : '#FFFFFF',
                        color: tierCount === t.count ? 'var(--primary)' : 'var(--text-main)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{t.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shape Selector */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Cake Geometry / Shape
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {[
                    { id: 'ROUND', label: 'Classic Round', icon: '⭕' },
                    { id: 'HEART', label: 'Sweetheart', icon: '💖' },
                    { id: 'SQUARE', label: 'Crisp Square', icon: '⬛' },
                    { id: 'HEXAGON', label: 'Regal Hexagon', icon: '⬡' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedShape(s.id as any)}
                      style={{
                        padding: '0.85rem 0.5rem',
                        borderRadius: '12px',
                        border: selectedShape === s.id ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: selectedShape === s.id ? 'var(--primary-light)' : '#FFFFFF',
                        color: selectedShape === s.id ? 'var(--primary)' : 'var(--text-main)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Frosting Colors & Piping Accents */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid var(--border-light)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={20} color="var(--primary)" />
                <span>2. Frosting Palette & Accent Piping Colors</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Your 3D cake visualizer updates instantly to match your color choices.
              </p>

              {/* Primary Frosting Color */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, margin: 0 }}>
                    Primary Frosting Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Selected:</span>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: frostingColor, border: '1px solid #999' }} />
                    <span style={{ fontWeight: 600 }}>{frostingColor}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {COLOR_PALETTES.map((p) => {
                    const isSelected = frostingColor.toLowerCase() === p.hex.toLowerCase();
                    return (
                      <button
                        key={p.hex}
                        type="button"
                        onClick={() => setFrostingColor(p.hex)}
                        title={p.name}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: p.hex,
                          border: isSelected ? '3px solid var(--primary)' : '2px solid #E0D5C7',
                          boxShadow: isSelected ? '0 0 0 2px rgba(201, 59, 103, 0.3)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.15s ease',
                          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        }}
                      >
                        {isSelected && <Check size={16} color={p.text} />}
                      </button>
                    );
                  })}

                  {/* Native Custom Color Picker */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem' }}>
                    <input
                      type="color"
                      value={frostingColor}
                      onChange={(e) => setFrostingColor(e.target.value)}
                      style={{
                        width: '38px',
                        height: '38px',
                        padding: '2px',
                        borderRadius: '50%',
                        border: '2px solid var(--border-medium)',
                        cursor: 'pointer',
                      }}
                      title="Custom HEX Color Picker"
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Custom</span>
                  </div>
                </div>
              </div>

              {/* Accent Piping / Drip Color */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Accent Border Piping & Drip Color
                </label>
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {ACCENT_COLORS.map((a) => {
                    const isSelected = accentColor.toLowerCase() === a.hex.toLowerCase();
                    return (
                      <button
                        key={a.hex}
                        type="button"
                        onClick={() => setAccentColor(a.hex)}
                        title={a.name}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '20px',
                          backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                        }}
                      >
                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: a.hex, border: '1px solid #CCC' }} />
                        <span>{a.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. 3D Toppings & Garnishes */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid var(--border-light)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="var(--primary)" />
                <span>3. 3D Garnishes & Crown Accents</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Toggle top decorations to render them onto the 3D model crown in real-time.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  { id: 'macarons', label: 'French Macarons', desc: '4 Pastel almond shells' },
                  { id: 'berries', label: 'Exotic Berries', desc: 'Strawberries & blackberries' },
                  { id: 'gold_leaf', label: '24K Gold Flecks', desc: 'Edible golden accents' },
                  { id: 'candle', label: 'Celebration Candle', desc: 'With glowing warm flame' },
                  { id: 'flowers', label: 'Botanical Petals', desc: 'Edible garden blossoms' },
                ].map((top) => {
                  const active = selected3DToppings.includes(top.id);
                  return (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => toggle3DTopping(top.id)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: active ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: active ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{top.label}</span>
                        {active && <CheckCircle2 size={16} color="var(--primary)" />}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{top.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Sponge, Compote & Frosting Flavors */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid var(--border-light)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={20} color="var(--primary)" />
                <span>4. Sponge Crumb & Gourmet Fillings</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Crafted from scratch using high-grade organic dairy, Belgian cocoa, and Indian orchard fruits.
              </p>

              {/* Cake Sponge Base */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Cake Sponge Crumb
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {(groupedOptions?.BASE || FALLBACK_OPTIONS.BASE).map((opt) => {
                    const isSelected = selectedBase?.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedBase(opt)}
                        style={{
                          padding: '1rem',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                          backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{opt.label}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {opt.extra_price === 0 ? 'Included' : `+${formatINR(opt.extra_price)}`}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{opt.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flavor / Filling */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Gourmet Filling & Fruit Compote
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {(groupedOptions?.FLAVOR || FALLBACK_OPTIONS.FLAVOR).map((opt) => {
                    const isSelected = selectedFlavor?.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedFlavor(opt)}
                        style={{
                          padding: '1rem',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                          backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{opt.label}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {opt.extra_price === 0 ? 'Included' : `+${formatINR(opt.extra_price)}`}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{opt.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Preferences */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Dietary Recipe Standard
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['100% Eggless (Vegetarian)', 'Gluten-Free Flour', 'Vegan Plant-Based', 'Low Sugar (Stevia Sweetened)'].map((diet) => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => setDietaryChoice(diet)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        borderRadius: '20px',
                        border: dietaryChoice === diet ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: dietaryChoice === diet ? 'var(--primary-light)' : '#FFFFFF',
                        color: dietaryChoice === diet ? 'var(--primary)' : 'var(--text-main)',
                        fontWeight: dietaryChoice === diet ? 700 : 500,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Message & Bakery Choice */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid var(--border-light)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Store size={20} color="var(--primary)" />
                <span>5. Artisan Bakery & Celebration Inscription</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Select your preferred neighborhood bakery partner and hand-lettered plaque message.
              </p>

              {/* Cake Name Title */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Give Your Custom Creation a Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={customCakeTitle}
                  onChange={(e) => setCustomCakeTitle(e.target.value)}
                  placeholder="e.g. Elena's 30th Birthday Rosewater Showpiece"
                />
              </div>

              {/* Hand-piped Inscription */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Hand-piped Celebration Inscription (Free)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={customMessage}
                  maxLength={65}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g. 'Happy 25th Birthday Rhea!'"
                />
                <small style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>
                  Hand-piped in coordinating chocolate script across the base platter or cake crown.
                </small>
              </div>

              {/* Bakery Selection */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Select Artisan Bakery Partner ({bakeries.length} Available)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {bakeries.map((b) => {
                    const isSelected = selectedBakery?.id === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBakery(b)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.9rem',
                          padding: '0.85rem 1rem',
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
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                            {b.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {b.city}, {b.state} · ⭐ {b.rating_avg} ({b.review_count} reviews) · {b.minimum_lead_days} Days Lead Time
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 size={18} color="var(--primary)" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D VISUALIZER & LIVE PRICE STICKY CARD */}
          <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Interactive 3D Canvas Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--border-light)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Eye size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>Live 3D Structure</span>
                </div>
                <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 }}>
                  {tierCount} Tier{tierCount > 1 ? 's' : ''} · {selectedShape}
                </span>
              </div>

              {/* Render Three.js 3D Viewer */}
              <Cake3DViewer
                tiers={tierCount}
                shape={selectedShape}
                frostingColor={frostingColor}
                accentColor={accentColor}
                toppings={selected3DToppings}
                inscription={customMessage}
                height={380}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>💡 Click & drag 360° to view all sides</span>
                <span>Includes Stand</span>
              </div>
            </div>

            {/* Live Price Counter & Summary */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--border-light)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--primary-light)',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Custom Creation Estimate
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
                  {formatINR(calculateTotal())}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Base + {tierCount} Tiers + Artisan Ingredients
                </div>
              </div>

              {/* Quick Summary Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Architecture:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{tierCount} Tier · {selectedShape}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Sponge Crumb:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedBase?.name || 'Vanilla'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Filling / Compote:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedFlavor?.name || 'Truffle'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Dietary:</span>
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>{dietaryChoice}</span>
                </div>
                {referenceImageUrl && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 600 }}>
                    <span>Inspiration Photo:</span>
                    <span>Attached ✓</span>
                  </div>
                )}
                {selectedBakery && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem', color: 'var(--text-muted)' }}>
                    <span>Selected Bakery:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{selectedBakery.name}</strong>
                  </div>
                )}
              </div>

              {/* Action Button: Add Bespoke Cake to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  fontSize: '1rem',
                  padding: '0.9rem',
                }}
              >
                <ShoppingBag size={20} />
                <span>Add Bespoke Cake to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .studio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomCakeBuilderPage;
