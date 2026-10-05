import { Bakery, Cake, CakeCategory, CustomizationOption, Notification, Order, Review, User } from '../types';

// Initial Demo Seed Users
const INITIAL_USERS: User[] = [
  {
    id: 1,
    email: 'customer@whiskandlayers.com',
    full_name: 'Elena Vance',
    phone: '+1 (555) 234-5678',
    role: 'CUSTOMER',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-09-01 10:00:00',
  },
  {
    id: 2,
    email: 'sarah.chen@example.com',
    full_name: 'Sarah Chen',
    phone: '+1 (555) 876-5432',
    role: 'CUSTOMER',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-09-10 12:00:00',
  },
  {
    id: 3,
    email: 'sweetcrust@whiskandlayers.com',
    full_name: 'Marcus & Chloe Laurent',
    phone: '+1 (555) 345-6789',
    role: 'BAKERY',
    avatar_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-08-15 08:30:00',
  },
  {
    id: 4,
    email: 'velvetlayer@whiskandlayers.com',
    full_name: 'Amara Okafor',
    phone: '+1 (555) 456-7890',
    role: 'BAKERY',
    avatar_url: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-08-20 09:00:00',
  },
  {
    id: 5,
    email: 'goldenwhisk@whiskandlayers.com',
    full_name: 'Julian Moreau',
    phone: '+1 (555) 567-8901',
    role: 'BAKERY',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-08-22 10:15:00',
  },
  {
    id: 6,
    email: 'admin@whiskandlayers.com',
    full_name: 'Platform Administrator',
    phone: '+1 (555) 000-1122',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: '2026-08-01 00:00:00',
  },
];

// Initial Demo Bakeries
const INITIAL_BAKERIES: Bakery[] = [
  {
    id: 1,
    user_id: 3,
    name: 'Sweet Crust Artisan Bakes',
    slug: 'sweet-crust-artisan-bakes',
    tagline: 'French-inspired layered confectionery & bespoke wedding towers',
    description: 'Founded by pastry chef Marcus Laurent in 2018, Sweet Crust specializes in botanical buttercream styling, multi-tier wedding cakes, and all-natural fruit compote fillings made fresh daily.',
    address: '442 Patisserie Row, Suite B',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94107',
    phone: '+1 (555) 345-6789',
    email: 'sweetcrust@whiskandlayers.com',
    logo_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&auto=format&fit=crop&q=80',
    specialties: 'Layer Cakes, Wedding Towers, Botanical Buttercream, Gluten-Friendly',
    rating_avg: 4.9,
    review_count: 48,
    is_approved: 1,
    is_active: 1,
    minimum_lead_days: 2,
    created_at: '2026-08-15 08:30:00',
    updated_at: '2026-08-15 08:30:00',
  },
  {
    id: 2,
    user_id: 4,
    name: 'Velvet & Layer Confectionery',
    slug: 'velvet-and-layer',
    tagline: 'Sculpted celebration cakes & decadent chocolate artistry',
    description: 'Velvet & Layer blends contemporary sculptural cake art with heritage flavor profiles. Renowned for rich Belgian chocolate ganaches, whimsical birthday showpieces, and hand-piped edible pearls.',
    address: '780 Kensington Blvd',
    city: 'Oakland',
    state: 'CA',
    postal_code: '94612',
    phone: '+1 (555) 456-7890',
    email: 'velvetlayer@whiskandlayers.com',
    logo_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&auto=format&fit=crop&q=80',
    specialties: 'Chocolate Artistry, Birthday Showstoppers, Custom Sculptures, Macaron Cakes',
    rating_avg: 4.8,
    review_count: 36,
    is_approved: 1,
    is_active: 1,
    minimum_lead_days: 3,
    created_at: '2026-08-20 09:00:00',
    updated_at: '2026-08-20 09:00:00',
  },
  {
    id: 3,
    user_id: 5,
    name: 'The Golden Whisk Patisserie',
    slug: 'golden-whisk-patisserie',
    tagline: 'Organic rustic bakes, vintage lambeth piping & bespoke sponge',
    description: 'The Golden Whisk is dedicated to farm-fresh local dairy, organic flours, and intricate vintage Victorian piping. Every cake is custom crafted with seasonal edible blossoms.',
    address: '1290 Blossom Hill Way',
    city: 'Berkeley',
    state: 'CA',
    postal_code: '94704',
    phone: '+1 (555) 567-8901',
    email: 'goldenwhisk@whiskandlayers.com',
    logo_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=1200&auto=format&fit=crop&q=80',
    specialties: 'Vintage Lambeth, Organic Sponges, Edible Flowers, Vegan Options',
    rating_avg: 5.0,
    review_count: 29,
    is_approved: 1,
    is_active: 1,
    minimum_lead_days: 2,
    created_at: '2026-08-22 10:15:00',
    updated_at: '2026-08-22 10:15:00',
  },
];

// Initial Categories
const INITIAL_CATEGORIES: CakeCategory[] = [
  {
    id: 1,
    name: 'Signature Layer Cakes',
    slug: 'signature-layers',
    description: 'Handcrafted multi-layered cakes with house compotes and silky frostings',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
    sort_order: 1,
  },
  {
    id: 2,
    name: 'Custom Cake Bases',
    slug: 'custom-bases',
    description: 'Blank canvas artisan bases ready for step-by-step flavor, size, and styling customization',
    image_url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop&q=80',
    sort_order: 2,
  },
  {
    id: 3,
    name: 'Celebration & Birthdays',
    slug: 'celebration-birthdays',
    description: 'Vibrant party centrepieces with playful toppings, drips, and sparkler toppers',
    image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&auto=format&fit=crop&q=80',
    sort_order: 3,
  },
  {
    id: 4,
    name: 'Artisan Cheesecakes & Tarts',
    slug: 'cheesecakes-tarts',
    description: 'Velvety baked cheesecakes and seasonal fruit custard tarts',
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80',
    sort_order: 4,
  },
];

// Initial Customization Options
const INITIAL_OPTIONS: CustomizationOption[] = [
  // BASE
  { id: 1, name: 'Vanilla Bean Sponge', type: 'BASE', label: 'Classic Madagascar Vanilla Sponge', description: 'Light, fluffy sponge infused with real Bourbon vanilla bean seeds', extra_price: 0, sort_order: 1 },
  { id: 2, name: 'Rich Valrhona Chocolate', type: 'BASE', label: 'Valrhona Dark Chocolate Sponge', description: 'Intensely chocolatey, moist crumb with 70% dark cocoa notes', extra_price: 5, sort_order: 2 },
  { id: 3, name: 'Red Velvet Chiffon', type: 'BASE', label: 'Southern Red Velvet Sponge', description: 'Silky cocoa sponge with subtle buttermilk tang and deep ruby hue', extra_price: 6, sort_order: 3 },
  { id: 4, name: 'Lemon Zest Sponge', type: 'BASE', label: 'Meyer Lemon & Olive Oil Sponge', description: 'Zesty citrus infused crumb with cold-pressed olive oil for ultimate moisture', extra_price: 6, sort_order: 4 },

  // FLAVOR
  { id: 5, name: 'Madagascar Vanilla Cream', type: 'FLAVOR', label: 'Whipped Vanilla Mascarpone', description: 'Subtle, cloud-like filling with real vanilla bean flecks', extra_price: 0, sort_order: 1 },
  { id: 6, name: 'Salted Caramel Ganache', type: 'FLAVOR', label: 'Fleur de Sel Caramel Cream', description: 'Handmade caramel with Maldon sea salt crystals and white chocolate ganache', extra_price: 8, sort_order: 2 },
  { id: 7, name: 'Wild Berry Compote', type: 'FLAVOR', label: 'Raspberry & Blackberry Reduction', description: 'Tart, vibrant slow-simmered forest berry reduction', extra_price: 7, sort_order: 3 },
  { id: 8, name: 'Espresso Hazelnut Praline', type: 'FLAVOR', label: 'Roasted Hazelnut & Espresso Ganache', description: 'Crunchy caramelized hazelnut praline folded into espresso cream', extra_price: 9, sort_order: 4 },

  // SIZE
  { id: 9, name: 'Small (6 inch)', type: 'SIZE', label: '6" Round (Serves 6–8)', description: 'Perfect for intimate gatherings, dinner parties, and milestones', extra_price: 0, sort_order: 1 },
  { id: 10, name: 'Medium (8 inch)', type: 'SIZE', label: '8" Round (Serves 12–16)', description: 'Our most popular size for birthday parties and family celebrations', extra_price: 20, sort_order: 2 },
  { id: 11, name: 'Large (10 inch)', type: 'SIZE', label: '10" Round (Serves 22–28)', description: 'Generous crowd-pleaser for corporate events and larger parties', extra_price: 45, sort_order: 3 },
  { id: 12, name: 'Two-Tier (6" + 8")', type: 'SIZE', label: 'Two-Tiered Tower (Serves 30–40)', description: 'Showstopping celebration cake with structural dowels and elegance', extra_price: 85, sort_order: 4 },

  // SHAPE
  { id: 13, name: 'Classic Round', type: 'SHAPE', label: 'Traditional Round', description: 'Timeless symmetrical shape with clean vertical edges', extra_price: 0, sort_order: 1 },
  { id: 14, name: 'Vintage Heart', type: 'SHAPE', label: 'Romantic Sweetheart', description: 'Charming scalloped heart contour inspired by Parisian tea rooms', extra_price: 8, sort_order: 2 },
  { id: 15, name: 'Square Architectural', type: 'SHAPE', label: 'Modern Sharp Square', description: 'Contemporary crisp 90-degree corners for an editorial look', extra_price: 10, sort_order: 3 },

  // ICING
  { id: 16, name: 'Swiss Meringue Buttercream', type: 'ICING', label: 'Silky Swiss Meringue (Ivory)', description: 'Ultra-smooth, velvety buttercream with balanced sweetness', extra_price: 0, sort_order: 1 },
  { id: 17, name: 'Cream Cheese Frosting', type: 'ICING', label: 'Whipped Cream Cheese Frosting', description: 'Lightly tangy, luscious frosting whipped to silky perfection', extra_price: 5, sort_order: 2 },
  { id: 18, name: 'Belgian Dark Chocolate Ganache', type: 'ICING', label: 'Fudge Gloss Chocolate Ganache', description: 'Decadent pourable ganache with mirror shine and rich cocoa finish', extra_price: 8, sort_order: 3 },
  { id: 19, name: 'Rustic Naked Frosting', type: 'ICING', label: 'Semi-Naked Crumb Coat', description: 'Subtle frosting wash exposing the organic cake sponge texture', extra_price: 0, sort_order: 4 },

  // TOPPING
  { id: 20, name: 'Fresh Seasonal Berries', type: 'TOPPING', label: 'Fresh Organic Berries & Figs', description: 'Hand-selected raspberries, blackberries, blueberries, and figs', extra_price: 12, sort_order: 1 },
  { id: 21, name: 'French Macaron Assortment', type: 'TOPPING', label: 'Crisp French Macarons (6 pcs)', description: 'Color-coordinated almond macarons with delicate ganache centers', extra_price: 14, sort_order: 2 },
  { id: 22, name: 'Gold Leaf Accents', type: 'TOPPING', label: '24k Edible Gold Leaf Flakes', description: 'Hand-applied edible gold leaf across the cake crown and borders', extra_price: 15, sort_order: 3 },
  { id: 23, name: 'Caramel Drip & Pretzels', type: 'TOPPING', label: 'Salted Butter Caramel Drip', description: 'Dramatic slow drizzle down the sides with chocolate covered pretzels', extra_price: 9, sort_order: 4 },
  { id: 24, name: 'No Extra Toppings', type: 'TOPPING', label: 'Clean Minimalist Crown', description: 'Clean top finish ready for custom piped messages or candles', extra_price: 0, sort_order: 5 },

  // DECORATION
  { id: 25, name: 'Victorian Vintage Lambeth', type: 'DECORATION', label: 'Vintage Lambeth Scrollwork & Pearls', description: 'Intricate multi-tier ruffled piping with sugar pearl embellishments', extra_price: 15, sort_order: 1 },
  { id: 26, name: 'Botanical Meadow', type: 'DECORATION', label: 'Organic Pressed Edible Flowers', description: 'Artfully arranged pansies, cornflowers, and seasonal dried botanicals', extra_price: 12, sort_order: 2 },
  { id: 27, name: 'Modern Textured Palette Knife', type: 'DECORATION', label: 'Abstract Textured Stucco', description: 'Contemporary artistic swipes of tinted buttercream with modern edge', extra_price: 8, sort_order: 3 },
  { id: 28, name: 'Minimalist Clean Border', type: 'DECORATION', label: 'Clean Tailored Border', description: 'Refined single beaded base and top border with understated elegance', extra_price: 0, sort_order: 4 },
];

// Initial Cakes
const INITIAL_CAKES: Cake[] = [
  {
    id: 1,
    bakery_id: 1,
    category_id: 1,
    name: 'Raspberry Pistachio Velvet Cake',
    slug: 'raspberry-pistachio-velvet',
    description: 'Four layers of moist Sicilian pistachio sponge layered with tart homemade raspberry compote and coated with Madagascar vanilla Swiss meringue buttercream. Finished with fresh raspberries and crushed emerald pistachios.',
    base_price: 68.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-01 10:00:00',
    updated_at: '2026-09-01 10:00:00',
    bakery_name: 'Sweet Crust Artisan Bakes',
    bakery_slug: 'sweet-crust-artisan-bakes',
    bakery_city: 'San Francisco',
    category_name: 'Signature Layer Cakes',
  },
  {
    id: 2,
    bakery_id: 1,
    category_id: 1,
    name: 'Earl Grey & Lavender Honey Cake',
    slug: 'earl-grey-lavender-honey',
    description: 'Infused with fragrant Bergamot Earl Grey tea leaves, filled with raw wildflower honey buttercream, and topped with delicate French lavender buds.',
    base_price: 64.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-02 10:00:00',
    updated_at: '2026-09-02 10:00:00',
    bakery_name: 'Sweet Crust Artisan Bakes',
    bakery_slug: 'sweet-crust-artisan-bakes',
    bakery_city: 'San Francisco',
    category_name: 'Signature Layer Cakes',
  },
  {
    id: 3,
    bakery_id: 1,
    category_id: 2,
    name: 'Bespoke Artisan Canvas (Build Your Own)',
    slug: 'sweet-crust-bespoke-canvas',
    description: 'Start with our award-winning sponge foundation and customize every detail: sponges, fillings, size, Lambeth piping, botanical decor, and custom hand-lettered message.',
    base_price: 55.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-03 10:00:00',
    updated_at: '2026-09-03 10:00:00',
    bakery_name: 'Sweet Crust Artisan Bakes',
    bakery_slug: 'sweet-crust-artisan-bakes',
    bakery_city: 'San Francisco',
    category_name: 'Custom Cake Bases',
  },
  {
    id: 4,
    bakery_id: 1,
    category_id: 4,
    name: 'Burnt Basque Honey Fig Cheesecake',
    slug: 'burnt-basque-fig-cheesecake',
    description: 'Caramelized Spanish-style baked cheesecake with an unctuous molten center, drizzled with clover honey and crowned with sliced Mission figs.',
    base_price: 52.0,
    preparation_days: 1,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 0,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-04 10:00:00',
    updated_at: '2026-09-04 10:00:00',
    bakery_name: 'Sweet Crust Artisan Bakes',
    bakery_slug: 'sweet-crust-artisan-bakes',
    bakery_city: 'San Francisco',
    category_name: 'Artisan Cheesecakes & Tarts',
  },
  {
    id: 5,
    bakery_id: 2,
    category_id: 1,
    name: 'Belgian Triple Chocolate Fudge Showstopper',
    slug: 'belgian-triple-chocolate-fudge',
    description: 'Decadent dark chocolate sponge layered with 70% Callebaut dark ganache and milk chocolate mousse, coated in silky chocolate mirror glaze and topped with handmade cocoa truffles.',
    base_price: 72.0,
    preparation_days: 3,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-05 10:00:00',
    updated_at: '2026-09-05 10:00:00',
    bakery_name: 'Velvet & Layer Confectionery',
    bakery_slug: 'velvet-and-layer',
    bakery_city: 'Oakland',
    category_name: 'Signature Layer Cakes',
  },
  {
    id: 6,
    bakery_id: 2,
    category_id: 3,
    name: 'Salted Caramel Pretzel Birthday Tower',
    slug: 'salted-caramel-pretzel-tower',
    description: 'Fluffy brown sugar sponge filled with salted caramel buttercream, crowned with crisp caramel macarons, crunchy chocolate-dipped pretzels, and an amber caramel drip.',
    base_price: 76.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-06 10:00:00',
    updated_at: '2026-09-06 10:00:00',
    bakery_name: 'Velvet & Layer Confectionery',
    bakery_slug: 'velvet-and-layer',
    bakery_city: 'Oakland',
    category_name: 'Celebration & Birthdays',
  },
  {
    id: 7,
    bakery_id: 2,
    category_id: 2,
    name: 'Velvet Sculptural Custom Base',
    slug: 'velvet-sculptural-custom-base',
    description: 'Our signature structural canvas engineered for intricate tiered styling, modern geometry, rich ganache coatings, and custom celebratory lettering.',
    base_price: 58.0,
    preparation_days: 3,
    image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-07 10:00:00',
    updated_at: '2026-09-07 10:00:00',
    bakery_name: 'Velvet & Layer Confectionery',
    bakery_slug: 'velvet-and-layer',
    bakery_city: 'Oakland',
    category_name: 'Custom Cake Bases',
  },
  {
    id: 8,
    bakery_id: 2,
    category_id: 3,
    name: 'Confetti Berry Funfetti Celebration',
    slug: 'confetti-berry-funfetti-celebration',
    description: 'A joyful vanilla buttermilk cake loaded with natural rainbow sprinkles, filled with strawberry mousse, and coated with pastel pink buttercream.',
    base_price: 59.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-08 10:00:00',
    updated_at: '2026-09-08 10:00:00',
    bakery_name: 'Velvet & Layer Confectionery',
    bakery_slug: 'velvet-and-layer',
    bakery_city: 'Oakland',
    category_name: 'Celebration & Birthdays',
  },
  {
    id: 9,
    bakery_id: 3,
    category_id: 1,
    name: 'Vintage Victorian Strawberry Shortcake',
    slug: 'vintage-victorian-strawberry-shortcake',
    description: 'Delicate golden sponge soaked in vanilla syrup, layered with Chantilly cream and fresh organic strawberries, finished with ornate Lambeth piping and edible rose petals.',
    base_price: 66.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-09 10:00:00',
    updated_at: '2026-09-09 10:00:00',
    bakery_name: 'The Golden Whisk Patisserie',
    bakery_slug: 'golden-whisk-patisserie',
    bakery_city: 'Berkeley',
    category_name: 'Signature Layer Cakes',
  },
  {
    id: 10,
    bakery_id: 3,
    category_id: 1,
    name: 'Meyer Lemon & Blackberry Thyme Cake',
    slug: 'lemon-blackberry-thyme',
    description: 'Moist olive oil sponge scented with Meyer lemon zest, filled with tart blackberry coulis and frosted in lemon-thyme cream cheese frosting.',
    base_price: 62.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-10 10:00:00',
    updated_at: '2026-09-10 10:00:00',
    bakery_name: 'The Golden Whisk Patisserie',
    bakery_slug: 'golden-whisk-patisserie',
    bakery_city: 'Berkeley',
    category_name: 'Signature Layer Cakes',
  },
  {
    id: 11,
    bakery_id: 3,
    category_id: 2,
    name: 'Organic Farmstead Custom Canvas',
    slug: 'golden-whisk-custom-canvas',
    description: 'Crafted with 100% organic pasture-raised dairy and heritage flours. Customize your cake size, flavors, pressed flowers, and handcrafted message.',
    base_price: 60.0,
    preparation_days: 2,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    gallery_urls: null,
    is_customizable: 1,
    is_available: 1,
    is_active: 1,
    created_at: '2026-09-11 10:00:00',
    updated_at: '2026-09-11 10:00:00',
    bakery_name: 'The Golden Whisk Patisserie',
    bakery_slug: 'golden-whisk-patisserie',
    bakery_city: 'Berkeley',
    category_name: 'Custom Cake Bases',
  },
];

// Initial Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    order_number: 'WL-2026-8801',
    customer_id: 1,
    bakery_id: 1,
    total_amount: 87.5,
    subtotal: 76.0,
    delivery_fee: 5.0,
    tax_amount: 6.5,
    status: 'DELIVERED',
    rejection_reason: null,
    customer_name: 'Elena Vance',
    customer_phone: '+1 (555) 234-5678',
    delivery_address: '742 Evergreen Terrace, Apt 4B, San Francisco, CA 94107',
    delivery_date: '2026-10-01',
    delivery_time_slot: 'Morning (09:00 AM - 12:00 PM)',
    special_instructions: 'Please leave at concierge desk if no answer.',
    payment_method: 'PAY_ON_DELIVERY',
    payment_status: 'PAID',
    created_at: '2026-09-28 10:15:00',
    bakery_name: 'Sweet Crust Artisan Bakes',
    bakery_phone: '+1 (555) 345-6789',
    bakery_address: '442 Patisserie Row, Suite B',
    items: [
      {
        id: 1,
        order_id: 1,
        cake_id: 1,
        cake_name: 'Raspberry Pistachio Velvet Cake',
        cake_image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
        base_price: 68.0,
        quantity: 1,
        subtotal: 76.0,
        is_custom: 1,
        custom_message: 'Happy 30th Birthday Elena!',
        selected_options: JSON.stringify({
          base: 'Vanilla Bean Sponge',
          flavor: 'Wild Berry Compote (+$7.00)',
          size: 'Small (6 inch)',
          shape: 'Classic Round',
          icing: 'Swiss Meringue Buttercream',
          topping: 'Fresh Seasonal Berries (+$12.00)',
          decoration: 'Botanical Meadow (+$12.00)',
        }),
      },
    ],
  },
  {
    id: 2,
    order_number: 'WL-2026-8802',
    customer_id: 1,
    bakery_id: 1,
    total_amount: 74.0,
    subtotal: 64.0,
    delivery_fee: 5.0,
    tax_amount: 5.0,
    status: 'PREPARING',
    rejection_reason: null,
    customer_name: 'Elena Vance',
    customer_phone: '+1 (555) 234-5678',
    delivery_address: '742 Evergreen Terrace, Apt 4B, San Francisco, CA 94107',
    delivery_date: '2026-10-06',
    delivery_time_slot: 'Afternoon (01:00 PM - 04:00 PM)',
    special_instructions: 'Ring doorbell twice.',
    payment_method: 'PAY_ON_DELIVERY',
    payment_status: 'PENDING',
    created_at: '2026-10-03 14:30:00',
    bakery_name: 'Sweet Crust Artisan Bakes',
    bakery_phone: '+1 (555) 345-6789',
    bakery_address: '442 Patisserie Row, Suite B',
    items: [
      {
        id: 2,
        order_id: 2,
        cake_id: null,
        cake_name: 'Bespoke Custom Cake Creation',
        cake_image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
        base_price: 55.0,
        quantity: 1,
        subtotal: 64.0,
        is_custom: 1,
        custom_message: 'Congratulations on the New Home!',
        selected_options: JSON.stringify({
          base: 'Lemon Zest Sponge (+$6.00)',
          flavor: 'Madagascar Vanilla Cream',
          size: 'Small (6 inch)',
          shape: 'Vintage Heart (+$8.00)',
          icing: 'Cream Cheese Frosting (+$5.00)',
          topping: 'French Macaron Assortment (+$14.00)',
          decoration: 'Victorian Vintage Lambeth (+$15.00)',
        }),
      },
    ],
  },
  {
    id: 3,
    order_number: 'WL-2026-8803',
    customer_id: 2,
    bakery_id: 2,
    total_amount: 85.0,
    subtotal: 72.0,
    delivery_fee: 7.0,
    tax_amount: 6.0,
    status: 'PENDING',
    rejection_reason: null,
    customer_name: 'Sarah Chen',
    customer_phone: '+1 (555) 876-5432',
    delivery_address: '120 Grand Ave, Suite 300, Oakland, CA 94612',
    delivery_date: '2026-10-08',
    delivery_time_slot: 'Morning (10:00 AM - 01:00 PM)',
    special_instructions: 'Fragile packaging requested.',
    payment_method: 'PAY_ON_DELIVERY',
    payment_status: 'PENDING',
    created_at: '2026-10-04 09:00:00',
    bakery_name: 'Velvet & Layer Confectionery',
    bakery_phone: '+1 (555) 456-7890',
    bakery_address: '780 Kensington Blvd',
    items: [
      {
        id: 3,
        order_id: 3,
        cake_id: 5,
        cake_name: 'Belgian Triple Chocolate Fudge Showstopper',
        cake_image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
        base_price: 72.0,
        quantity: 1,
        subtotal: 72.0,
        is_custom: 0,
        custom_message: 'Happy Anniversary Mom & Dad!',
        selected_options: null,
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
    comment: 'The Raspberry Pistachio cake was breathtaking! Not only was the presentation museum-worthy with fresh berries and edible flowers, but the pistachio sponge was exceptionally moist and balanced. All our guests were asking where we ordered it!',
    reply_comment: 'Thank you so much Elena! It was an absolute joy baking this for your 30th birthday celebration. — Marcus & Chloe',
    created_at: '2026-10-02 11:00:00',
    customer_name: 'Elena Vance',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bakery_name: 'Sweet Crust Artisan Bakes',
  },
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    user_id: 1,
    type: 'ORDER_STATUS',
    title: 'Your order is now being prepared! 🧁',
    message: 'Sweet Crust Artisan Bakes has begun crafting your custom cake (Order #WL-2026-8802).',
    link_url: '/orders/2',
    is_read: 0,
    created_at: '2026-10-03 15:00:00',
  },
  {
    id: 2,
    user_id: 4,
    type: 'NEW_ORDER',
    title: 'New Order Received! 🍰',
    message: 'Sarah Chen placed order #WL-2026-8803 for Belgian Triple Chocolate Fudge Showstopper ($85.00).',
    link_url: '/bakery/orders',
    is_read: 0,
    created_at: '2026-10-04 09:00:00',
  },
];

// Storage Helper
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`wl_demo_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`wl_demo_${key}`, JSON.stringify(val));
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
      delivery_fee: orderData.deliveryFee,
      tax_amount: orderData.taxAmount,
      total_amount: orderData.totalAmount,
      status: 'PENDING',
      rejection_reason: null,
      customer_name: orderData.customerName || customer?.full_name || 'Customer',
      customer_phone: orderData.customerPhone || customer?.phone || '',
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

  public static updateOrderStatus(orderId: number, status: any, rejectionReason?: string | null): Order {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = status;
    if (rejectionReason) order.rejection_reason = rejectionReason;
    if (status === 'DELIVERED') order.payment_status = 'PAID';

    setStored('orders', orders);
    return order;
  }

  public static addReview(reviewData: any, customerId: number): Review {
    const reviews = this.getReviews();
    const customer = this.getUsers().find((u) => u.id === customerId);
    const bakery = this.getBakeries().find((b) => b.id === reviewData.bakeryId);

    const newRev: Review = {
      id: reviews.length + 1,
      order_id: reviewData.orderId,
      customer_id: customerId,
      bakery_id: reviewData.bakeryId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      reply_comment: null,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      customer_name: customer?.full_name || 'Customer',
      customer_avatar: customer?.avatar_url,
      bakery_name: bakery?.name,
    };

    reviews.unshift(newRev);
    setStored('reviews', reviews);
    return newRev;
  }

  public static replyReview(reviewId: number, reply: string): Review {
    const reviews = this.getReviews();
    const rev = reviews.find((r) => r.id === reviewId);
    if (!rev) throw new Error('Review not found');
    rev.reply_comment = reply;
    setStored('reviews', reviews);
    return rev;
  }
}
