import { Bakery, Cake, CakeCategory, CustomizationOption, Notification, Order, Review, User } from '../types';

// Initial Demo Seed Users (Indian Demo Users)
const INITIAL_USERS: User[] = [
  {
    id: 1,
    email: 'customer@whiskandlayers.com',
    full_name: 'Aditya Nair',
    phone: '+91 9876543210',
    role: 'CUSTOMER',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-09-01 10:00:00',
  },
  {
    id: 2,
    email: 'diya.patel@example.com',
    full_name: 'Diya Patel',
    phone: '+91 9825012345',
    role: 'CUSTOMER',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-09-10 12:00:00',
  },
  {
    id: 3,
    email: 'sweetcrust@whiskandlayers.com',
    full_name: 'Priya & Rohan Joshi',
    phone: '+91 9825123456',
    role: 'BAKERY',
    avatar_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-08-15 08:30:00',
  },
  {
    id: 4,
    email: 'velvetlayer@whiskandlayers.com',
    full_name: 'Ananya Desai',
    phone: '+91 9909988776',
    role: 'BAKERY',
    avatar_url: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-08-20 09:00:00',
  },
  {
    id: 5,
    email: 'goldenwhisk@whiskandlayers.com',
    full_name: 'Rahul Shah',
    phone: '+91 9898123456',
    role: 'BAKERY',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-08-22 10:15:00',
  },
  {
    id: 6,
    email: 'admin@whiskandlayers.com',
    full_name: 'Platform Administrator',
    phone: '+91 9800011223',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-08-01 00:00:00',
  },
];

// Initial Demo Bakeries (Fictional Indian Bakeries)
const INITIAL_BAKERIES: Bakery[] = [
  {
    id: 1,
    user_id: 3,
    name: 'Whisk House',
    slug: 'whisk-house',
    tagline: 'French-inspired layered confectionery & bespoke celebration cakes',
    description: 'Founded in Bodakdev, Ahmedabad, Whisk House specializes in pure Belgian chocolate truffle creations, royal rasmalai celebration tiers, and 100% eggless gourmet patisserie made fresh daily.',
    address: '402 Bodakdev Galleria, Sindhu Bhavan Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postal_code: '380054',
    phone: '+91 9825123456',
    email: 'whiskhouse@whiskandlayers.com',
    logo_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&auto=format&fit=crop&q=80',
    specialties: '100% Eggless Specials, Belgian Truffle, Rasmalai Tiers, Botanical Buttercream',
    rating_avg: 4.9,
    review_count: 58,
    is_approved: 1,
    is_active: 1,
    minimum_lead_days: 2,
    created_at: '2026-08-15 08:30:00',
    updated_at: '2026-08-15 08:30:00',
  },
  {
    id: 2,
    user_id: 4,
    name: 'The Cake Story',
    slug: 'the-cake-story',
    tagline: 'Sculpted celebration cakes, decadent cheesecakes & fusion delights',
    description: 'Located near Vastrapur Lake in Ahmedabad, The Cake Story creates bespoke celebration centerpieces blending international confectionery trends with rich Indian tastes like Lotus Biscoff, Alphonso Mango, and Gulab Jamun.',
    address: 'Shop 14, Vastrapur Lake Arcade, Vastrapur',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postal_code: '380015',
    phone: '+91 9909988776',
    email: 'thecakestory@whiskandlayers.com',
    logo_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&auto=format&fit=crop&q=80',
    specialties: 'Biscoff Cheesecakes, Indian Fusion, Birthday Showstoppers, Custom Sugar Art',
    rating_avg: 4.8,
    review_count: 42,
    is_approved: 1,
    is_active: 1,
    minimum_lead_days: 2,
    created_at: '2026-08-20 09:00:00',
    updated_at: '2026-08-20 09:00:00',
  },
  {
    id: 3,
    user_id: 5,
    name: 'Sweet Oven',
    slug: 'sweet-oven',
    tagline: 'Farm-fresh organic dairy bakes, vintage lambeth piping & fresh fruit cakes',
    description: 'Situated in Pali Hill, Bandra West, Mumbai, Sweet Oven crafts heirloom celebration cakes using rich A2 dairy, fresh seasonal Indian orchard fruits, and delicate Victorian Lambeth piping techniques.',
    address: '104 Pali Hill Promenade, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400050',
    phone: '+91 9898123456',
    email: 'sweetoven@whiskandlayers.com',
    logo_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=1200&auto=format&fit=crop&q=80',
    specialties: 'Vintage Lambeth Piping, Fresh Mango Gateaux, Organic Dairy, Floral Styling',
    rating_avg: 5.0,
    review_count: 34,
    is_approved: 1,
    is_active: 1,
    minimum_lead_days: 2,
    created_at: '2026-08-22 10:15:00',
    updated_at: '2026-08-22 10:15:00',
  },
  {
    id: 4,
    user_id: 3,
    name: 'Sugar & Crumbs',
    slug: 'sugar-and-crumbs',
    tagline: 'Contemporary dessert studio & artisanal celebration tortes',
    description: 'Based in Vesu, Surat, Sugar & Crumbs crafts modern tiered masterpieces, delicate French macarons, and decadent chocolate ganache gateaux.',
    address: '21 Silver Stone Hub, VIP Road, Vesu',
    city: 'Surat',
    state: 'Gujarat',
    postal_code: '395007',
    phone: '+91 9825456789',
    email: 'sugarcrumbs@whiskandlayers.com',
    logo_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80',
    specialties: 'Macaron Cakes, Contemporary Tortes, Eggless Delights',
    rating_avg: 4.9,
    review_count: 27,
    is_approved: 1,
    is_active: 1,
    minimum_lead_days: 2,
    created_at: '2026-08-25 10:00:00',
    updated_at: '2026-08-25 10:00:00',
  },
  {
    id: 5,
    user_id: 4,
    name: 'Cocoa Lane',
    slug: 'cocoa-lane',
    tagline: 'Gourmet handcrafted chocolate creations & custom tiers',
    description: 'Rajkot’s beloved destination for premium custom celebration cakes, Belgian chocolate delicacies, and fusion dessert cups.',
    address: '150 Feet Ring Road, Near Nana Mava Circle',
    city: 'Rajkot',
    state: 'Gujarat',
    postal_code: '360005',
    phone: '+91 9879123456',
    email: 'cocoalane@whiskandlayers.com',
    logo_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&auto=format&fit=crop&q=80',
    specialties: 'Belgian Chocolate Truffle, Rasmalai Cakes, Custom Birthday Cakes',
    rating_avg: 4.8,
    review_count: 31,
    is_approved: 1,
    is_active: 1,
    minimum_lead_days: 1,
    created_at: '2026-08-28 11:30:00',
    updated_at: '2026-08-28 11:30:00',
  },
  {
    id: 6,
    user_id: 5,
    name: 'Bake & Bloom',
    slug: 'bake-and-bloom',
    tagline: 'Botanical florals, hand-piped bakes & luxury tiered cakes',
    description: 'Alkapuri, Vadodara’s boutique studio for pressed edible flower cakes, vintage European piping, and organic fruit fillings.',
    address: '8 Alkapuri Heights, RC Dutt Road, Alkapuri',
    city: 'Vadodara',
    state: 'Gujarat',
    postal_code: '390007',
    phone: '+91 9824987654',
    email: 'bakebloom@whiskandlayers.com',
    logo_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=1200&auto=format&fit=crop&q=80',
    specialties: 'Pressed Flowers, Vintage Lambeth, Tea Cakes, Eggless Gateaux',
    rating_avg: 5.0,
    review_count: 22,
    is_approved: 1,
    is_active: 1,
    minimum_lead_days: 2,
    created_at: '2026-09-01 09:15:00',
    updated_at: '2026-09-01 09:15:00',
  },
];

// Initial Categories
const INITIAL_CATEGORIES: CakeCategory[] = [
  {
    id: 1,
    name: 'Signature Celebration Cakes',
    slug: 'signature-celebration',
    description: 'Handcrafted multi-layered cakes with gourmet compotes and silky frostings',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
    sort_order: 1,
  },
  {
    id: 2,
    name: 'Custom Cake Bases',
    slug: 'custom-bases',
    description: 'Blank canvas artisan bases ready for step-by-step flavor, weight, and styling customization',
    image_url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop&q=80',
    sort_order: 2,
  },
  {
    id: 3,
    name: 'Indian Fusion Specials',
    slug: 'indian-fusion',
    description: 'Luxurious celebration cakes infused with Rasmalai, Gulab Jamun, Saffron, and Pistachio',
    image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&auto=format&fit=crop&q=80',
    sort_order: 3,
  },
  {
    id: 4,
    name: 'Cheesecakes & Contemporary Tortes',
    slug: 'cheesecakes-tortes',
    description: 'Velvety Lotus Biscoff cheesecakes and seasonal fresh fruit gateaux',
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80',
    sort_order: 4,
  },
];

// Initial Customization Options (in INR & Kilograms)
const INITIAL_OPTIONS: CustomizationOption[] = [
  // BASE
  { id: 1, name: 'Eggless Vanilla Chiffon', type: 'BASE', label: 'Classic Madagascar Vanilla Sponge', description: 'Light, fluffy eggless sponge infused with pure Bourbon vanilla bean extract', extra_price: 0, sort_order: 1 },
  { id: 2, name: 'Eggless Rich Dark Chocolate', type: 'BASE', label: 'Dutch Dark Chocolate Sponge', description: 'Intensely chocolatey, moist crumb with 70% dark cocoa notes', extra_price: 100, sort_order: 2 },
  { id: 3, name: 'Red Velvet Cocoa Chiffon', type: 'BASE', label: 'Ruby Cocoa Sponge', description: 'Silky cocoa sponge with delicate tang and deep ruby hue', extra_price: 120, sort_order: 3 },
  { id: 4, name: 'Cardamom & Saffron Sponge', type: 'BASE', label: 'Royal Kesar Elaichi Sponge', description: 'Aromatic sponge infused with Kashmiri saffron strands and fresh green cardamom', extra_price: 150, sort_order: 4 },

  // FLAVOR
  { id: 5, name: 'Belgian Chocolate Truffle', type: 'FLAVOR', label: 'Rich Dark Chocolate Truffle', description: 'Decadent 55% cocoa silky ganache filling', extra_price: 0, sort_order: 1 },
  { id: 6, name: 'Royal Rasmalai Cream', type: 'FLAVOR', label: 'Saffron Milk & Pistachio Rasmalai', description: 'Real soft cottage cheese dumplings simmered in rich saffron-cardamom milk', extra_price: 150, sort_order: 2 },
  { id: 7, name: 'Lotus Biscoff Spread', type: 'FLAVOR', label: 'Caramelized Spiced Speculoos Cream', description: 'Luscious Belgian Biscoff spread with crunchy biscuit crumble', extra_price: 150, sort_order: 3 },
  { id: 8, name: 'Alphonso Mango Compote', type: 'FLAVOR', label: 'Ratnagiri Alphonso Pulp', description: 'Sweet, vibrant slow-simmered pure mango reduction', extra_price: 120, sort_order: 4 },
  { id: 9, name: 'Butterscotch Praline Crunch', type: 'FLAVOR', label: 'Golden Cashew Praline & Caramel', description: 'Handmade crunchy cashew praline with creamy caramel sauce', extra_price: 100, sort_order: 5 },
  { id: 10, name: 'Fresh Strawberry Compote', type: 'FLAVOR', label: 'Mahabaleshwar Strawberry Coulis', description: 'Fresh organic strawberry reduction with balanced sweetness', extra_price: 100, sort_order: 6 },

  // SIZE (Kilograms)
  { id: 11, name: '0.5 Kg', type: 'SIZE', label: '0.5 Kg (Serves 3–4)', description: 'Ideal for intimate birthdays, dates, and cozy milestones', extra_price: 0, sort_order: 1 },
  { id: 12, name: '1.0 Kg', type: 'SIZE', label: '1.0 Kg (Serves 6–8)', description: 'Our most popular size for family celebrations and dinner parties', extra_price: 400, sort_order: 2 },
  { id: 13, name: '1.5 Kg', type: 'SIZE', label: '1.5 Kg (Serves 10–12)', description: 'Perfect for lively milestone parties and joyful gatherings', extra_price: 750, sort_order: 3 },
  { id: 14, name: '2.0 Kg', type: 'SIZE', label: '2.0 Kg (Serves 14–16)', description: 'Generous celebration cake for larger family events', extra_price: 1100, sort_order: 4 },
  { id: 15, name: '3.0 Kg (2-Tier)', type: 'SIZE', label: '3.0 Kg Two-Tier Tower (Serves 22–26)', description: 'Showstopping tiered celebration centerpiece with structural support', extra_price: 1800, sort_order: 5 },

  // SHAPE
  { id: 16, name: 'Classic Round', type: 'SHAPE', label: 'Traditional Symmetrical Round', description: 'Timeless symmetrical shape with clean vertical edges', extra_price: 0, sort_order: 1 },
  { id: 17, name: 'Romantic Heart', type: 'SHAPE', label: 'Sweetheart Contour', description: 'Charming scalloped heart contour for anniversaries and birthdays', extra_price: 100, sort_order: 2 },
  { id: 18, name: 'Contemporary Square', type: 'SHAPE', label: 'Modern Crisp Square', description: 'Contemporary crisp 90-degree corners for a modern aesthetic', extra_price: 80, sort_order: 3 },
  { id: 19, name: 'Tall Arch / Cylinder', type: 'SHAPE', label: 'Editorial Arch Profile', description: 'Dramatic tall cake profile with sleek European lines', extra_price: 150, sort_order: 4 },

  // ICING
  { id: 20, name: 'Light Whipped Cream', type: 'ICING', label: 'Whipped Dairy Cream (Fresh & Light)', description: 'Airy, silky whipped cream with balanced sweetness', extra_price: 0, sort_order: 1 },
  { id: 21, name: 'Belgian Dark Chocolate Ganache', type: 'ICING', label: 'Silky Gloss Chocolate Ganache', description: 'Decadent pourable ganache with mirror gloss and deep cocoa finish', extra_price: 150, sort_order: 2 },
  { id: 22, name: 'Cream Cheese Frosting', type: 'ICING', label: 'Whipped Cream Cheese Frosting', description: 'Tangy, luscious frosting whipped to silky perfection', extra_price: 180, sort_order: 3 },
  { id: 23, name: 'Swiss Meringue Buttercream', type: 'ICING', label: 'Silky Velvet Buttercream', description: 'Ultra-smooth, velvet frosting ideal for sharp edges and vintage piping', extra_price: 120, sort_order: 4 },

  // TOPPINGS
  { id: 24, name: 'Roasted Almond & Pistachio Flakes', type: 'TOPPING', label: 'Shaved Dry Fruits & Saffron', description: 'Premium hand-sliced Mamra almonds and Iranian green pistachios', extra_price: 80, sort_order: 1 },
  { id: 25, name: 'Exotic Fresh Fruits', type: 'TOPPING', label: 'Fresh Kiwi, Berries & Dragon Fruit', description: 'Handpicked colorful tropical fruits cut fresh on delivery day', extra_price: 150, sort_order: 2 },
  { id: 26, name: 'Belgian Chocolate Curls', type: 'TOPPING', label: 'Dual Milk & Dark Chocolate Curls', description: 'Artisan chocolate bark shavings layered across the crown', extra_price: 100, sort_order: 3 },
  { id: 27, name: 'Crushed Lotus Biscoff Crumbs', type: 'TOPPING', label: 'Caramelized Biscuit Crumble', description: 'Crunchy Biscoff cookies crushed over silky spread drip', extra_price: 120, sort_order: 4 },
  { id: 28, name: 'Ferrero Rocher & Macaron Trio', type: 'TOPPING', label: 'Gold-Dusted Chocolates & Macarons', description: 'Whole Ferrero Rocher pralines paired with almond French macarons', extra_price: 250, sort_order: 5 },
  { id: 29, name: 'No Extra Toppings', type: 'TOPPING', label: 'Clean Minimalist Crown', description: 'Clean top finish ready for custom hand-piped messages or candles', extra_price: 0, sort_order: 6 },

  // DECORATION
  { id: 30, name: 'Vintage Lambeth Borders', type: 'DECORATION', label: 'Victorian Vintage Lambeth Scrollwork', description: 'Intricate multi-tier ruffled piping with sugar pearl embellishments', extra_price: 150, sort_order: 1 },
  { id: 31, name: '24K Edible Gold Leaf & Rose Petals', type: 'DECORATION', label: 'Pure Gold Leaf & Organic Dried Roses', description: 'Artfully placed 24k edible gold foil with fragrant dried red rose petals', extra_price: 200, sort_order: 2 },
  { id: 32, name: 'Minimalist Floral Piping', type: 'DECORATION', label: 'Delicate Buttercream Blossoms', description: 'Understated pastel buttercream rosettes and delicate foliage', extra_price: 100, sort_order: 3 },
  { id: 33, name: 'Artisan Chocolate Drip & Pearls', type: 'DECORATION', label: 'Glossy Drip with Shimmer Pearls', description: 'Slow cocoa drip along the borders with edible pearlescent beads', extra_price: 120, sort_order: 4 },
];

// Initial Cakes (Realistic Indian Artisan Catalog)
const INITIAL_CAKES: Cake[] = [
  {
    id: 1,
    bakery_id: 1,
    category_id: 1,
    name: 'Dutch Chocolate Truffle Cake (100% Eggless)',
    slug: 'dutch-chocolate-truffle-cake',
    description: 'Four layers of moist Dutch chocolate sponge layered with 55% dark chocolate truffle ganache and coated in mirror cocoa glaze. 100% pure vegetarian and freshly baked on order.',
    base_price: 750.0,
    preparation_days: 1,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    gallery_urls: JSON.stringify([
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
    ]),
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-01 10:00:00',
    updated_at: '2026-09-01 10:00:00',
    bakery_name: 'Whisk House',
    bakery_slug: 'whisk-house',
    bakery_city: 'Ahmedabad',
    category_name: 'Signature Celebration Cakes',
  },
  {
    id: 2,
    bakery_id: 1,
    category_id: 3,
    name: 'Royal Rasmalai Tres Leches Cake',
    slug: 'royal-rasmalai-tres-leches',
    description: 'Soft cardamom chiffon sponge soaked in rich saffron milk (rabdi), filled with tender rasmalai chunks, and crowned with slivered pistachios and dried rose petals.',
    base_price: 950.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-02 11:00:00',
    updated_at: '2026-09-02 11:00:00',
    bakery_name: 'Whisk House',
    bakery_slug: 'whisk-house',
    bakery_city: 'Ahmedabad',
    category_name: 'Indian Fusion Specials',
  },
  {
    id: 3,
    bakery_id: 1,
    category_id: 2,
    name: 'Bespoke Artisan Canvas (Build Your Own)',
    slug: 'whisk-house-bespoke-canvas',
    description: 'Start with our signature foundation and personalize every element: sponge, gourmet filling, weight in kilograms, vintage Lambeth piping, and custom hand-lettered message.',
    base_price: 600.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-03 12:00:00',
    updated_at: '2026-09-03 12:00:00',
    bakery_name: 'Whisk House',
    bakery_slug: 'whisk-house',
    bakery_city: 'Ahmedabad',
    category_name: 'Custom Cake Bases',
  },
  {
    id: 4,
    bakery_id: 1,
    category_id: 1,
    name: 'Classic Black Forest Cake (Eggless)',
    slug: 'classic-black-forest-cake',
    description: 'Traditional chocolate sponge infused with sweet cherry reduction, whipped cream, Belgian chocolate shavings, and whole maraschino cherries.',
    base_price: 650.0,
    preparation_days: 1,
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-05 09:30:00',
    updated_at: '2026-09-05 09:30:00',
    bakery_name: 'Whisk House',
    bakery_slug: 'whisk-house',
    bakery_city: 'Ahmedabad',
    category_name: 'Signature Celebration Cakes',
  },
  {
    id: 5,
    bakery_id: 2,
    category_id: 4,
    name: 'Lotus Biscoff Baked Cheesecake (Eggless)',
    slug: 'lotus-biscoff-cheesecake',
    description: 'Velvety slow-baked cheesecake on a crunchy spiced Biscoff biscuit crust, generously topped with warm melted Biscoff spread and whole Belgian biscuits.',
    base_price: 1250.0,
    preparation_days: 1,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-06 14:00:00',
    updated_at: '2026-09-06 14:00:00',
    bakery_name: 'The Cake Story',
    bakery_slug: 'the-cake-story',
    bakery_city: 'Ahmedabad',
    category_name: 'Cheesecakes & Contemporary Tortes',
  },
  {
    id: 6,
    bakery_id: 2,
    category_id: 3,
    name: 'Gulab Jamun Fusion Celebration Cake',
    slug: 'gulab-jamun-fusion-celebration',
    description: 'Kesar-infused vanilla sponge soaked in rose water sugar syrup, layered with soft mini gulab jamuns and whipped cardamom cream.',
    base_price: 850.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-07 15:30:00',
    updated_at: '2026-09-07 15:30:00',
    bakery_name: 'The Cake Story',
    bakery_slug: 'the-cake-story',
    bakery_city: 'Ahmedabad',
    category_name: 'Indian Fusion Specials',
  },
  {
    id: 7,
    bakery_id: 2,
    category_id: 1,
    name: 'Butterscotch Caramel Crunch Cake',
    slug: 'butterscotch-caramel-crunch-cake',
    description: 'Rich golden sponge layered with house-made butterscotch crunch praline, caramel syrup, and light whipped frosting. A crowd favorite in Indian celebrations.',
    base_price: 550.0,
    preparation_days: 1,
    image_url: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-08 16:00:00',
    updated_at: '2026-09-08 16:00:00',
    bakery_name: 'The Cake Story',
    bakery_slug: 'the-cake-story',
    bakery_city: 'Ahmedabad',
    category_name: 'Signature Celebration Cakes',
  },
  {
    id: 8,
    bakery_id: 2,
    category_id: 1,
    name: 'Ferrero Rocher Hazelnut Indulgence',
    slug: 'ferrero-rocher-hazelnut-indulgence',
    description: 'Dark chocolate cocoa sponge filled with roasted hazelnut Nutella mousse, topped with crunchy toasted hazelnuts and whole Ferrero Rocher chocolates.',
    base_price: 1350.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-09 11:20:00',
    updated_at: '2026-09-09 11:20:00',
    bakery_name: 'The Cake Story',
    bakery_slug: 'the-cake-story',
    bakery_city: 'Ahmedabad',
    category_name: 'Signature Celebration Cakes',
  },
  {
    id: 9,
    bakery_id: 3,
    category_id: 1,
    name: 'Fresh Tropical Fruit Gateau (100% Eggless)',
    slug: 'fresh-tropical-fruit-gateau',
    description: 'Soft vanilla chiffon sponge drenched in natural fruit nectar, layered with freshly chopped seasonal fruits (kiwi, dragon fruit, pomegranate) and light cream.',
    base_price: 800.0,
    preparation_days: 1,
    image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-10 10:00:00',
    updated_at: '2026-09-10 10:00:00',
    bakery_name: 'Sweet Oven',
    bakery_slug: 'sweet-oven',
    bakery_city: 'Mumbai',
    category_name: 'Signature Celebration Cakes',
  },
  {
    id: 10,
    bakery_id: 3,
    category_id: 1,
    name: 'Classic Pineapple Gateau',
    slug: 'classic-pineapple-gateau',
    description: 'Evergreen Indian birthday favorite with sweet roasted pineapple chunks, cherry accents, and delicate vanilla whipped frosting.',
    base_price: 500.0,
    preparation_days: 1,
    image_url: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-11 10:00:00',
    updated_at: '2026-09-11 10:00:00',
    bakery_name: 'Sweet Oven',
    bakery_slug: 'sweet-oven',
    bakery_city: 'Mumbai',
    category_name: 'Signature Celebration Cakes',
  },
];

// Initial Orders (in INR with Indian delivery addresses)
const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    order_number: 'WL-2026-8801',
    customer_id: 1,
    bakery_id: 1,
    total_amount: 972.5,
    subtotal: 850.0,
    delivery_fee: 80.0,
    tax_amount: 42.5,
    status: 'DELIVERED',
    rejection_reason: null,
    customer_name: 'Aditya Nair',
    customer_phone: '+91 9876543210',
    delivery_address: 'Flat 402, Shree Residency, 150 Feet Ring Road, Near Nana Mava Circle, Rajkot, Gujarat 360005',
    delivery_date: '2026-10-01',
    delivery_time_slot: 'Morning (09:00 AM - 12:00 PM)',
    special_instructions: 'Please call upon arrival at the security gate.',
    payment_method: 'PAY_ON_DELIVERY',
    payment_status: 'PAID',
    created_at: '2026-09-28 10:15:00',
    bakery_name: 'Whisk House',
    bakery_phone: '+91 9825123456',
    bakery_address: '402 Bodakdev Galleria, Sindhu Bhavan Road, Ahmedabad',
    items: [
      {
        id: 1,
        order_id: 1,
        cake_id: 1,
        cake_name: 'Dutch Chocolate Truffle Cake (100% Eggless)',
        cake_image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
        base_price: 750.0,
        quantity: 1,
        subtotal: 850.0,
        is_custom: 1,
        custom_message: 'Happy 30th Birthday Aditya!',
        selected_options: JSON.stringify({
          base: 'Eggless Vanilla Chiffon',
          flavor: 'Belgian Chocolate Truffle',
          size: '1.0 Kg',
          shape: 'Classic Round',
          icing: 'Belgian Dark Chocolate Ganache',
          topping: 'Roasted Almond & Pistachio Flakes (+₹80.00)',
          decoration: '24K Edible Gold Leaf & Rose Petals',
        }),
      },
    ],
  },
  {
    id: 2,
    order_number: 'WL-2026-8802',
    customer_id: 1,
    bakery_id: 1,
    total_amount: 1130.0,
    subtotal: 1000.0,
    delivery_fee: 80.0,
    tax_amount: 50.0,
    status: 'PREPARING',
    rejection_reason: null,
    customer_name: 'Aditya Nair',
    customer_phone: '+91 9876543210',
    delivery_address: 'Flat 402, Shree Residency, 150 Feet Ring Road, Near Nana Mava Circle, Rajkot, Gujarat 360005',
    delivery_date: '2026-10-06',
    delivery_time_slot: 'Afternoon (01:00 PM - 04:00 PM)',
    special_instructions: 'Keep refrigerated until evening cake cutting.',
    payment_method: 'PAY_ON_DELIVERY',
    payment_status: 'PENDING',
    created_at: '2026-10-03 14:30:00',
    bakery_name: 'Whisk House',
    bakery_phone: '+91 9825123456',
    bakery_address: '402 Bodakdev Galleria, Sindhu Bhavan Road, Ahmedabad',
    items: [
      {
        id: 2,
        order_id: 2,
        cake_id: null,
        cake_name: 'Bespoke Artisan Cake Creation',
        cake_image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
        base_price: 600.0,
        quantity: 1,
        subtotal: 1000.0,
        is_custom: 1,
        custom_message: 'Happy Griha Pravesh!',
        selected_options: JSON.stringify({
          base: 'Cardamom & Saffron Sponge (+₹150.00)',
          flavor: 'Royal Rasmalai Cream (+₹150.00)',
          size: '1.0 Kg',
          shape: 'Romantic Heart (+₹100.00)',
          icing: 'Light Whipped Cream',
          topping: 'Roasted Almond & Pistachio Flakes (+₹80.00)',
          decoration: 'Vintage Lambeth Borders',
        }),
      },
    ],
  },
  {
    id: 3,
    order_number: 'WL-2026-8803',
    customer_id: 2,
    bakery_id: 2,
    total_amount: 1392.5,
    subtotal: 1250.0,
    delivery_fee: 80.0,
    tax_amount: 62.5,
    status: 'PENDING',
    rejection_reason: null,
    customer_name: 'Diya Patel',
    customer_phone: '+91 9825012345',
    delivery_address: 'A-601, Shivalik Heights, Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054',
    delivery_date: '2026-10-08',
    delivery_time_slot: 'Morning (10:00 AM - 01:00 PM)',
    special_instructions: 'Handle carefully, anniversary celebration.',
    payment_method: 'PAY_ON_DELIVERY',
    payment_status: 'PENDING',
    created_at: '2026-10-04 09:00:00',
    bakery_name: 'The Cake Story',
    bakery_phone: '+91 9909988776',
    bakery_address: 'Shop 14, Vastrapur Lake Arcade, Vastrapur, Ahmedabad',
    items: [
      {
        id: 3,
        order_id: 3,
        cake_id: 5,
        cake_name: 'Lotus Biscoff Baked Cheesecake (Eggless)',
        cake_image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
        base_price: 1250.0,
        quantity: 1,
        subtotal: 1250.0,
        is_custom: 0,
        custom_message: 'Happy 10th Anniversary Mom & Dad!',
        selected_options: null,
      },
    ],
  },
  {
    id: 4,
    order_number: 'WL-2026-8804',
    customer_id: 2,
    bakery_id: 1,
    total_amount: 2580.0,
    subtotal: 2400.0,
    delivery_fee: 80.0,
    tax_amount: 100.0,
    status: 'REJECTED',
    rejection_reason: 'Fully booked for grand wedding catering orders on this auspicious date. Unable to accept additional bespoke multi-tier cakes.',
    customer_name: 'Diya Patel',
    customer_phone: '+91 9825012345',
    delivery_address: 'A-601, Shivalik Heights, Bodakdev, Ahmedabad, Gujarat 380054',
    delivery_date: '2026-09-30',
    delivery_time_slot: 'Evening (04:00 PM - 07:00 PM)',
    special_instructions: null,
    payment_method: 'PAY_ON_DELIVERY',
    payment_status: 'UNPAID',
    created_at: '2026-09-27 11:20:00',
    bakery_name: 'Whisk House',
    bakery_phone: '+91 9825123456',
    bakery_address: '402 Bodakdev Galleria, Sindhu Bhavan Road, Ahmedabad',
    items: [
      {
        id: 4,
        order_id: 4,
        cake_id: null,
        cake_name: 'Two-Tiered Bespoke Celebration Cake',
        cake_image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&auto=format&fit=crop&q=80',
        base_price: 1800.0,
        quantity: 1,
        subtotal: 2400.0,
        is_custom: 1,
        custom_message: 'Corporate Gala Celebration',
        selected_options: JSON.stringify({
          base: 'Eggless Rich Dark Chocolate (+₹100.00)',
          flavor: 'Lotus Biscoff Spread (+₹150.00)',
          size: '3.0 Kg (2-Tier) (+₹1,800.00)',
          shape: 'Classic Round',
          icing: 'Belgian Dark Chocolate Ganache (+₹150.00)',
          topping: 'Ferrero Rocher & Macaron Trio (+₹250.00)',
          decoration: '24K Edible Gold Leaf & Rose Petals (+₹200.00)',
        }),
      },
    ],
  },
];

// Initial Reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    order_id: 1,
    customer_id: 1,
    bakery_id: 1,
    rating: 5,
    comment: 'The Dutch Chocolate Truffle cake was magnificent! 100% pure eggless yet delightfully light and moist with pure cocoa aroma. Delivery in Rajkot arrived perfectly chilled and intact. Everyone asked where we ordered it from!',
    reply_comment: 'Thank you so much Aditya! It was an absolute pleasure crafting this centerpiece for your celebration. — Priya & Rohan Joshi',
    created_at: '2026-10-02 11:00:00',
    customer_name: 'Aditya Nair',
    customer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    user_id: 1,
    type: 'ORDER_STATUS',
    title: 'Your order is now being prepared! 🧁',
    message: 'Whisk House has begun crafting your custom cake (Order #WL-2026-8802).',
    link_url: '/orders/2',
    is_read: 0,
    created_at: '2026-10-03 15:00:00',
  },
  {
    id: 2,
    user_id: 4,
    type: 'NEW_ORDER',
    title: 'New Order Received! 🍰',
    message: 'Diya Patel placed order #WL-2026-8803 for Lotus Biscoff Baked Cheesecake (₹1,393).',
    link_url: '/bakery/orders',
    is_read: 0,
    created_at: '2026-10-04 09:00:00',
  },
];

// Storage Helper with v2 cache key to seamlessly upgrade browser cache
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`wl_demo_in_v2_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`wl_demo_in_v2_${key}`, JSON.stringify(val));
  } catch {}
}

export class MockDataStore {
  public static getUsers(): User[] {
    return getStored('users', INITIAL_USERS);
  }

  public static getBakeries(): Bakery[] {
    return getStored('bakeries', INITIAL_BAKERIES);
  }

  public static getCategories(): CakeCategory[] {
    return getStored('categories', INITIAL_CATEGORIES);
  }

  public static getOptions(): CustomizationOption[] {
    return getStored('options', INITIAL_OPTIONS);
  }

  public static getCakes(): Cake[] {
    return getStored('cakes', INITIAL_CAKES);
  }

  public static getOrders(): Order[] {
    return getStored('orders', INITIAL_ORDERS);
  }

  public static getReviews(): Review[] {
    return getStored('reviews', INITIAL_REVIEWS);
  }

  public static getNotifications(): Notification[] {
    return getStored('notifications', INITIAL_NOTIFICATIONS);
  }

  // Mutators
  public static saveOrder(orderData: any, customerId: number): Order {
    const orders = this.getOrders();
    const bakeries = this.getBakeries();
    const bakery = bakeries.find((b) => b.id === orderData.bakeryId) || bakeries[0];
    const customer = this.getUsers().find((u) => u.id === customerId);

    const newOrder: Order = {
      id: orders.length + 1,
      order_number: `WL-2026-${8800 + orders.length + 1}`,
      customer_id: customerId,
      bakery_id: orderData.bakeryId,
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee || 80.0,
      tax_amount: orderData.taxAmount || Math.round(orderData.subtotal * 0.05 * 100) / 100,
      total_amount: orderData.totalAmount,
      status: 'PENDING',
      rejection_reason: null,
      customer_name: orderData.customerName || customer?.full_name || 'Customer',
      customer_phone: orderData.customerPhone || customer?.phone || '+91 9876543210',
      delivery_address: orderData.deliveryAddress,
      delivery_date: orderData.deliveryDate,
      delivery_time_slot: orderData.deliveryTimeSlot || null,
      special_instructions: orderData.specialInstructions || null,
      payment_method: orderData.paymentMethod || 'PAY_ON_DELIVERY',
      payment_status: 'PENDING',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      bakery_name: bakery.name,
      bakery_phone: bakery.phone,
      bakery_address: bakery.address,
      items: orderData.items.map((it: any, idx: number) => ({
        id: idx + 1,
        order_id: orders.length + 1,
        cake_id: it.cakeId || null,
        cake_name: it.cakeName,
        cake_image: it.cakeImage || 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
        base_price: it.basePrice || it.unitPrice,
        quantity: it.quantity,
        subtotal: it.subtotal || it.unitPrice * it.quantity,
        is_custom: it.isCustom ? 1 : 0,
        custom_message: it.customMessage || null,
        selected_options: it.selectedOptions ? (typeof it.selectedOptions === 'string' ? it.selectedOptions : JSON.stringify(it.selectedOptions)) : null,
      })),
    };

    orders.unshift(newOrder);
    setStored('orders', orders);

    // Notify customer
    const notifs = this.getNotifications();
    notifs.unshift({
      id: notifs.length + 1,
      user_id: customerId,
      type: 'ORDER_STATUS',
      title: 'Order Placed! 🎂',
      message: `Your order #${newOrder.order_number} has been received by ${bakery.name}.`,
      link_url: `/orders/${newOrder.id}`,
      is_read: 0,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
    setStored('notifications', notifs);

    return newOrder;
  }

  public static updateOrderStatus(orderId: number, status: string, rejectionReason?: string): Order {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    orders[idx].status = status as any;
    if (rejectionReason) {
      orders[idx].rejection_reason = rejectionReason;
    }
    setStored('orders', orders);

    // Add status notification
    const notifs = this.getNotifications();
    notifs.unshift({
      id: notifs.length + 1,
      user_id: orders[idx].customer_id,
      type: 'ORDER_STATUS',
      title: `Order Status: ${status} 🍰`,
      message: `Your order #${orders[idx].order_number} status has been updated to ${status}.`,
      link_url: `/orders/${orderId}`,
      is_read: 0,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
    setStored('notifications', notifs);

    return orders[idx];
  }

  public static addReview(reviewData: any, customerId: number): Review {
    const reviews = this.getReviews();
    const customer = this.getUsers().find((u) => u.id === customerId);

    const newRev: Review = {
      id: reviews.length + 1,
      order_id: reviewData.orderId,
      customer_id: customerId,
      bakery_id: reviewData.bakeryId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      reply_comment: null,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      customer_name: customer?.full_name || 'Verified Customer',
      customer_avatar: customer?.avatar_url || null,
    };

    reviews.unshift(newRev);
    setStored('reviews', reviews);
    return newRev;
  }

  public static replyReview(reviewId: number, replyComment: string): Review {
    const reviews = this.getReviews();
    const idx = reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) throw new Error('Review not found');

    reviews[idx].reply_comment = replyComment;
    setStored('reviews', reviews);
    return reviews[idx];
  }
}
