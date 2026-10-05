import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { initializeSchema } from './schema.js';

export async function seedDatabase() {
  console.log('[Seed] Starting database seed...');
  await initializeSchema();

  // Check if already seeded
  const userCount = db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM users');
  if (userCount && userCount.count > 0) {
    console.log('[Seed] Database already contains data. Skipping seed.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const customerPassword = await bcrypt.hash('Customer123!', salt);
  const bakeryPassword = await bcrypt.hash('Bakery123!', salt);
  const adminPassword = await bcrypt.hash('Admin123!', salt);

  db.transaction(() => {
    // 1. Insert Users
    const customer1 = db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'customer@whiskandlayers.com',
      customerPassword,
      'Elena Vance',
      '+1 (555) 234-5678',
      'CUSTOMER',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    ]);
    const customer1Id = customer1.lastInsertRowid;

    const customer2 = db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'sarah.chen@example.com',
      customerPassword,
      'Sarah Chen',
      '+1 (555) 876-5432',
      'CUSTOMER',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    ]);
    const customer2Id = customer2.lastInsertRowid;

    // Bakery Owners
    const bakeryOwner1 = db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'sweetcrust@whiskandlayers.com',
      bakeryPassword,
      'Marcus & Chloe Laurent',
      '+1 (555) 345-6789',
      'BAKERY',
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'
    ]);
    const bakeryOwner1Id = bakeryOwner1.lastInsertRowid;

    const bakeryOwner2 = db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'velvetlayer@whiskandlayers.com',
      bakeryPassword,
      'Amara Okafor',
      '+1 (555) 456-7890',
      'BAKERY',
      'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=150&auto=format&fit=crop&q=80'
    ]);
    const bakeryOwner2Id = bakeryOwner2.lastInsertRowid;

    const bakeryOwner3 = db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'goldenwhisk@whiskandlayers.com',
      bakeryPassword,
      'Julian Moreau',
      '+1 (555) 567-8901',
      'BAKERY',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    ]);
    const bakeryOwner3Id = bakeryOwner3.lastInsertRowid;

    // Admin
    db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'admin@whiskandlayers.com',
      adminPassword,
      'Platform Administrator',
      '+1 (555) 000-1122',
      'ADMIN',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    ]);

    // 2. Insert Bakeries
    const bakery1 = db.execute(`
      INSERT INTO bakeries (user_id, name, slug, tagline, description, address, city, state, postal_code, phone, email, logo_url, banner_url, specialties, rating_avg, review_count, is_approved, is_active, minimum_lead_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `, [
      bakeryOwner1Id,
      'Sweet Crust Artisan Bakes',
      'sweet-crust-artisan-bakes',
      'French-inspired layered confectionery & bespoke wedding towers',
      'Founded by pastry chef Marcus Laurent in 2018, Sweet Crust specializes in botanical buttercream styling, multi-tier wedding cakes, and all-natural fruit compote fillings made fresh daily.',
      '442 Patisserie Row, Suite B',
      'San Francisco',
      'CA',
      '94107',
      '+1 (555) 345-6789',
      'sweetcrust@whiskandlayers.com',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&auto=format&fit=crop&q=80',
      'Layer Cakes, Wedding Towers, Botanical Buttercream, Gluten-Friendly',
      4.9,
      48,
      2
    ]);
    const bakery1Id = bakery1.lastInsertRowid;

    const bakery2 = db.execute(`
      INSERT INTO bakeries (user_id, name, slug, tagline, description, address, city, state, postal_code, phone, email, logo_url, banner_url, specialties, rating_avg, review_count, is_approved, is_active, minimum_lead_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `, [
      bakeryOwner2Id,
      'Velvet & Layer Confectionery',
      'velvet-and-layer',
      'Sculpted celebration cakes & decadent chocolate artistry',
      'Velvet & Layer blends contemporary sculptural cake art with heritage flavor profiles. Renowned for rich Belgian chocolate ganaches, whimsical birthday showpieces, and hand-piped edible pearls.',
      '780 Kensington Blvd',
      'Oakland',
      'CA',
      '94612',
      '+1 (555) 456-7890',
      'velvetlayer@whiskandlayers.com',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&auto=format&fit=crop&q=80',
      'Chocolate Artistry, Birthday Showstoppers, Custom Sculptures, Macaron Cakes',
      4.8,
      36,
      3
    ]);
    const bakery2Id = bakery2.lastInsertRowid;

    const bakery3 = db.execute(`
      INSERT INTO bakeries (user_id, name, slug, tagline, description, address, city, state, postal_code, phone, email, logo_url, banner_url, specialties, rating_avg, review_count, is_approved, is_active, minimum_lead_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `, [
      bakeryOwner3Id,
      'The Golden Whisk Patisserie',
      'golden-whisk-patisserie',
      'Organic rustic bakes, vintage lambeth piping & bespoke sponge',
      'The Golden Whisk is dedicated to farm-fresh local dairy, organic flours, and intricate vintage Victorian piping. Every cake is custom crafted with seasonal edible blossoms.',
      '1290 Blossom Hill Way',
      'Berkeley',
      'CA',
      '94704',
      '+1 (555) 567-8901',
      'goldenwhisk@whiskandlayers.com',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=1200&auto=format&fit=crop&q=80',
      'Vintage Lambeth, Organic Sponges, Edible Flowers, Vegan Options',
      5.0,
      29,
      2
    ]);
    const bakery3Id = bakery3.lastInsertRowid;

    // 3. Cake Categories
    const cat1 = db.execute(`
      INSERT INTO cake_categories (name, slug, description, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, ['Signature Layer Cakes', 'signature-layers', 'Handcrafted multi-layered cakes with house compotes and silky frostings', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80', 1]);
    const cat1Id = cat1.lastInsertRowid;

    const cat2 = db.execute(`
      INSERT INTO cake_categories (name, slug, description, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, ['Custom Cake Bases', 'custom-bases', 'Blank canvas artisan bases ready for step-by-step flavor, size, and styling customization', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop&q=80', 2]);
    const cat2Id = cat2.lastInsertRowid;

    const cat3 = db.execute(`
      INSERT INTO cake_categories (name, slug, description, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, ['Celebration & Birthdays', 'celebration-birthdays', 'Vibrant party centrepieces with playful toppings, drips, and sparkler toppers', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&auto=format&fit=crop&q=80', 3]);
    const cat3Id = cat3.lastInsertRowid;

    const cat4 = db.execute(`
      INSERT INTO cake_categories (name, slug, description, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, ['Artisan Cheesecakes & Tarts', 'cheesecakes-tarts', 'Velvety baked cheesecakes and seasonal fruit custard tarts', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80', 4]);
    const cat4Id = cat4.lastInsertRowid;

    // 4. Customization Options (8-step builder tokens)
    const options = [
      // BASE
      ['Vanilla Bean Sponge', 'BASE', 'Classic Madagascar Vanilla Sponge', 'Light, fluffy sponge infused with real Bourbon vanilla bean seeds', 0.0, 1],
      ['Rich Valrhona Chocolate', 'BASE', 'Valrhona Dark Chocolate Sponge', 'Intensely chocolatey, moist crumb with 70% dark cocoa notes', 5.0, 2],
      ['Red Velvet Chiffon', 'BASE', 'Southern Red Velvet Sponge', 'Silky cocoa sponge with subtle buttermilk tang and deep ruby hue', 6.0, 3],
      ['Lemon Zest Sponge', 'BASE', 'Meyer Lemon & Olive Oil Sponge', 'Zesty citrus infused crumb with cold-pressed olive oil for ultimate moisture', 6.0, 4],

      // FLAVOR / FILLING
      ['Madagascar Vanilla Cream', 'FLAVOR', 'Whipped Vanilla Mascarpone', 'Subtle, cloud-like filling with real vanilla bean flecks', 0.0, 1],
      ['Salted Caramel Ganache', 'FLAVOR', 'Fleur de Sel Caramel Cream', 'Handmade caramel with Maldon sea salt crystals and white chocolate ganache', 8.0, 2],
      ['Wild Berry Compote', 'FLAVOR', 'Raspberry & Blackberry Reduction', 'Tart, vibrant slow-simmered forest berry reduction', 7.0, 3],
      ['Espresso Hazelnut Praline', 'FLAVOR', 'Roasted Hazelnut & Espresso Ganache', 'Crunchy caramelized hazelnut praline folded into espresso cream', 9.0, 4],

      // SIZE
      ['Small (6 inch)', 'SIZE', '6" Round (Serves 6–8)', 'Perfect for intimate gatherings, dinner parties, and milestones', 0.0, 1],
      ['Medium (8 inch)', 'SIZE', '8" Round (Serves 12–16)', 'Our most popular size for birthday parties and family celebrations', 20.0, 2],
      ['Large (10 inch)', 'SIZE', '10" Round (Serves 22–28)', 'Generous crowd-pleaser for corporate events and larger parties', 45.0, 3],
      ['Two-Tier (6" + 8")', 'SIZE', 'Two-Tiered Tower (Serves 30–40)', 'Showstopping celebration cake with structural dowels and elegance', 85.0, 4],

      // SHAPE
      ['Classic Round', 'SHAPE', 'Traditional Round', 'Timeless symmetrical shape with clean vertical edges', 0.0, 1],
      ['Vintage Heart', 'SHAPE', 'Romantic Sweetheart', 'Charming scalloped heart contour inspired by Parisian tea rooms', 8.0, 2],
      ['Square Architectural', 'SHAPE', 'Modern Sharp Square', 'Contemporary crisp 90-degree corners for an editorial look', 10.0, 3],

      // ICING / FROSTING
      ['Swiss Meringue Buttercream', 'ICING', 'Silky Swiss Meringue (Ivory)', 'Ultra-smooth, velvety buttercream with balanced sweetness', 0.0, 1],
      ['Cream Cheese Frosting', 'ICING', 'Whipped Cream Cheese Frosting', 'Lightly tangy, luscious frosting whipped to silky perfection', 5.0, 2],
      ['Belgian Dark Chocolate Ganache', 'ICING', 'Fudge Gloss Chocolate Ganache', 'Decadent pourable ganache with mirror shine and rich cocoa finish', 8.0, 3],
      ['Rustic Naked Frosting', 'ICING', 'Semi-Naked Crumb Coat', 'Subtle frosting wash exposing the organic cake sponge texture', 0.0, 4],

      // TOPPINGS
      ['Fresh Seasonal Berries', 'TOPPING', 'Fresh Organic Berries & Figs', 'Hand-selected raspberries, blackberries, blueberries, and figs', 12.0, 1],
      ['French Macaron Assortment', 'TOPPING', 'Crisp French Macarons (6 pcs)', 'Color-coordinated almond macarons with delicate ganache centers', 14.0, 2],
      ['Gold Leaf Accents', 'TOPPING', '24k Edible Gold Leaf Flakes', 'Hand-applied edible gold leaf across the cake crown and borders', 15.0, 3],
      ['Caramel Drip & Pretzels', 'TOPPING', 'Salted Butter Caramel Drip', 'Dramatic slow drizzle down the sides with chocolate covered pretzels', 9.0, 4],
      ['No Extra Toppings', 'TOPPING', 'Clean Minimalist Crown', 'Clean top finish ready for custom piped messages or candles', 0.0, 5],

      // DECORATION STYLE
      ['Victorian Vintage Lambeth', 'DECORATION', 'Vintage Lambeth Scrollwork & Pearls', 'Intricate multi-tier ruffled piping with sugar pearl embellishments', 15.0, 1],
      ['Botanical Meadow', 'DECORATION', 'Organic Pressed Edible Flowers', 'Artfully arranged pansies, cornflowers, and seasonal dried botanicals', 12.0, 2],
      ['Modern Textured Palette Knife', 'DECORATION', 'Abstract Textured Stucco', 'Contemporary artistic swipes of tinted buttercream with modern edge', 8.0, 3],
      ['Minimalist Clean Border', 'DECORATION', 'Clean Tailored Border', 'Refined single beaded base and top border with understated elegance', 0.0, 4],
    ];

    for (const opt of options) {
      db.execute(`
        INSERT INTO customization_options (name, type, label, description, extra_price, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `, opt);
    }

    // 5. Cakes
    const cake1 = db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery1Id,
      cat1Id,
      'Raspberry Pistachio Velvet Cake',
      'raspberry-pistachio-velvet',
      'Four layers of moist Sicilian pistachio sponge layered with tart homemade raspberry compote and coated with Madagascar vanilla Swiss meringue buttercream. Finished with fresh raspberries and crushed emerald pistachios.',
      68.0,
      2,
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
      JSON.stringify([
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80'
      ]),
      1
    ]);
    const cake1Id = cake1.lastInsertRowid;

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery1Id,
      cat1Id,
      'Earl Grey & Lavender Honey Cake',
      'earl-grey-lavender-honey',
      'Infused with fragrant Bergamot Earl Grey tea leaves, filled with raw wildflower honey buttercream, and topped with delicate French lavender buds.',
      64.0,
      2,
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery1Id,
      cat2Id,
      'Bespoke Artisan Canvas (Build Your Own)',
      'sweet-crust-bespoke-canvas',
      'Start with our award-winning sponge foundation and customize every detail: sponges, fillings, size, Lambeth piping, botanical decor, and custom hand-lettered message.',
      55.0,
      2,
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery1Id,
      cat4Id,
      'Burnt Basque Honey Fig Cheesecake',
      'burnt-basque-fig-cheesecake',
      'Caramelized Spanish-style baked cheesecake with an unctuous molten center, drizzled with clover honey and crowned with sliced Mission figs.',
      52.0,
      1,
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
      null,
      0
    ]);

    // Bakery 2 Cakes (Velvet & Layer)
    const cake5 = db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery2Id,
      cat1Id,
      'Belgian Triple Chocolate Fudge Showstopper',
      'belgian-triple-chocolate-fudge',
      'Decadent dark chocolate sponge layered with 70% Callebaut dark ganache and milk chocolate mousse, coated in silky chocolate mirror glaze and topped with handmade cocoa truffles.',
      72.0,
      3,
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);
    const cake5Id = cake5.lastInsertRowid;

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery2Id,
      cat3Id,
      'Salted Caramel Pretzel Birthday Tower',
      'salted-caramel-pretzel-tower',
      'Fluffy brown sugar sponge filled with salted caramel buttercream, crowned with crisp caramel macarons, crunchy chocolate-dipped pretzels, and an amber caramel drip.',
      76.0,
      2,
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery2Id,
      cat2Id,
      'Velvet Sculptural Custom Base',
      'velvet-sculptural-custom-base',
      'Our signature structural canvas engineered for intricate tiered styling, modern geometry, rich ganache coatings, and custom celebratory lettering.',
      58.0,
      3,
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery2Id,
      cat3Id,
      'Confetti Berry Funfetti Celebration',
      'confetti-berry-funfetti-celebration',
      'A joyful vanilla buttermilk cake loaded with natural rainbow sprinkles, filled with strawberry mousse, and coated with pastel pink buttercream.',
      59.0,
      2,
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    // Bakery 3 Cakes (The Golden Whisk)
    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery3Id,
      cat1Id,
      'Vintage Victorian Strawberry Shortcake',
      'vintage-victorian-strawberry-shortcake',
      'Delicate golden sponge soaked in vanilla syrup, layered with Chantilly cream and fresh organic strawberries, finished with ornate Lambeth piping and edible rose petals.',
      66.0,
      2,
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery3Id,
      cat1Id,
      'Meyer Lemon & Blackberry Thyme Cake',
      'lemon-blackberry-thyme',
      'Moist olive oil sponge scented with Meyer lemon zest, filled with tart blackberry coulis and frosted in lemon-thyme cream cheese frosting.',
      62.0,
      2,
      'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery3Id,
      cat2Id,
      'Organic Farmstead Custom Canvas',
      'golden-whisk-custom-canvas',
      'Crafted with 100% organic pasture-raised dairy and heritage flours. Customize your cake size, flavors, pressed flowers, and handcrafted message.',
      60.0,
      2,
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    // 6. Orders
    // Order 1: DELIVERED (Sweet Crust -> Elena)
    const ord1 = db.execute(`
      INSERT INTO orders (order_number, customer_id, bakery_id, total_amount, subtotal, delivery_fee, tax_amount, status, rejection_reason, customer_name, customer_phone, delivery_address, delivery_date, delivery_time_slot, special_instructions, payment_method, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'WL-2026-8801',
      customer1Id,
      bakery1Id,
      87.50,
      76.00,
      5.00,
      6.50,
      'DELIVERED',
      null,
      'Elena Vance',
      '+1 (555) 234-5678',
      '742 Evergreen Terrace, Apt 4B, San Francisco, CA 94107',
      '2026-10-01',
      'Morning (09:00 AM - 12:00 PM)',
      'Please leave at concierge desk if no answer.',
      'PAY_ON_DELIVERY',
      'PAID',
      '2026-09-28 10:15:00'
    ]);
    const ord1Id = ord1.lastInsertRowid;

    db.execute(`
      INSERT INTO order_items (order_id, cake_id, cake_name, cake_image, base_price, quantity, subtotal, is_custom, custom_message, selected_options)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ord1Id,
      cake1Id,
      'Raspberry Pistachio Velvet Cake',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
      68.0,
      1,
      76.0,
      1,
      'Happy 30th Birthday Elena!',
      JSON.stringify({
        base: 'Vanilla Bean Sponge',
        flavor: 'Wild Berry Compote (+$7.00)',
        size: 'Small (6 inch)',
        shape: 'Classic Round',
        icing: 'Swiss Meringue Buttercream',
        topping: 'Fresh Seasonal Berries (+$12.00)',
        decoration: 'Botanical Meadow (+$12.00)'
      })
    ]);

    // Order 2: PREPARING (Sweet Crust -> Elena)
    const ord2 = db.execute(`
      INSERT INTO orders (order_number, customer_id, bakery_id, total_amount, subtotal, delivery_fee, tax_amount, status, rejection_reason, customer_name, customer_phone, delivery_address, delivery_date, delivery_time_slot, special_instructions, payment_method, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'WL-2026-8802',
      customer1Id,
      bakery1Id,
      74.00,
      64.00,
      5.00,
      5.00,
      'PREPARING',
      null,
      'Elena Vance',
      '+1 (555) 234-5678',
      '742 Evergreen Terrace, Apt 4B, San Francisco, CA 94107',
      '2026-10-06',
      'Afternoon (01:00 PM - 04:00 PM)',
      'Ring doorbell twice.',
      'PAY_ON_DELIVERY',
      'PENDING',
      '2026-10-03 14:30:00'
    ]);
    const ord2Id = ord2.lastInsertRowid;

    db.execute(`
      INSERT INTO order_items (order_id, cake_id, cake_name, cake_image, base_price, quantity, subtotal, is_custom, custom_message, selected_options)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ord2Id,
      null,
      'Bespoke Custom Cake Creation',
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
      55.0,
      1,
      64.0,
      1,
      'Congratulations on the New Home!',
      JSON.stringify({
        base: 'Lemon Zest Sponge (+$6.00)',
        flavor: 'Madagascar Vanilla Cream',
        size: 'Small (6 inch)',
        shape: 'Vintage Heart (+$8.00)',
        icing: 'Cream Cheese Frosting (+$5.00)',
        topping: 'French Macaron Assortment (+$14.00)',
        decoration: 'Victorian Vintage Lambeth (+$15.00)'
      })
    ]);

    // Order 3: PENDING (Velvet & Layer -> Sarah)
    const ord3 = db.execute(`
      INSERT INTO orders (order_number, customer_id, bakery_id, total_amount, subtotal, delivery_fee, tax_amount, status, rejection_reason, customer_name, customer_phone, delivery_address, delivery_date, delivery_time_slot, special_instructions, payment_method, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'WL-2026-8803',
      customer2Id,
      bakery2Id,
      85.00,
      72.00,
      7.00,
      6.00,
      'PENDING',
      null,
      'Sarah Chen',
      '+1 (555) 876-5432',
      '120 Grand Ave, Suite 300, Oakland, CA 94612',
      '2026-10-08',
      'Morning (10:00 AM - 01:00 PM)',
      'Fragile packaging requested.',
      'PAY_ON_DELIVERY',
      'PENDING',
      '2026-10-04 09:00:00'
    ]);
    const ord3Id = ord3.lastInsertRowid;

    db.execute(`
      INSERT INTO order_items (order_id, cake_id, cake_name, cake_image, base_price, quantity, subtotal, is_custom, custom_message, selected_options)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ord3Id,
      cake5Id,
      'Belgian Triple Chocolate Fudge Showstopper',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      72.0,
      1,
      72.0,
      0,
      'Happy Anniversary Mom & Dad!',
      null
    ]);

    // Order 4: REJECTED (demonstrates rejection flow)
    const ord4 = db.execute(`
      INSERT INTO orders (order_number, customer_id, bakery_id, total_amount, subtotal, delivery_fee, tax_amount, status, rejection_reason, customer_name, customer_phone, delivery_address, delivery_date, delivery_time_slot, special_instructions, payment_method, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'WL-2026-8804',
      customer2Id,
      bakery1Id,
      95.00,
      82.00,
      6.00,
      7.00,
      'REJECTED',
      'High workload due to 3 weekend weddings. Unable to take additional complex tiered orders on this date.',
      'Sarah Chen',
      '+1 (555) 876-5432',
      '120 Grand Ave, Oakland, CA 94612',
      '2026-09-30',
      'Evening (04:00 PM - 07:00 PM)',
      null,
      'PAY_ON_DELIVERY',
      'UNPAID',
      '2026-09-27 11:20:00'
    ]);
    const ord4Id = ord4.lastInsertRowid;

    db.execute(`
      INSERT INTO order_items (order_id, cake_id, cake_name, cake_image, base_price, quantity, subtotal, is_custom, custom_message, selected_options)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ord4Id,
      null,
      'Two-Tiered Bespoke Celebration Cake',
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&auto=format&fit=crop&q=80',
      85.0,
      1,
      82.0,
      1,
      'Annual Company Gala 2026',
      JSON.stringify({
        base: 'Rich Valrhona Chocolate (+$5.00)',
        flavor: 'Espresso Hazelnut Praline (+$9.00)',
        size: 'Two-Tier (6" + 8") (+$85.00)',
        shape: 'Classic Round',
        icing: 'Belgian Dark Chocolate Ganache (+$8.00)',
        topping: 'Gold Leaf Accents (+$15.00)',
        decoration: 'Modern Textured Palette Knife (+$8.00)'
      })
    ]);

    // 7. Reviews
    db.execute(`
      INSERT INTO reviews (order_id, customer_id, bakery_id, rating, comment, reply_comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      ord1Id,
      customer1Id,
      bakery1Id,
      5,
      'The Raspberry Pistachio cake was breathtaking! Not only was the presentation museum-worthy with fresh berries and edible flowers, but the pistachio sponge was exceptionally moist and balanced. All our guests were asking where we ordered it!',
      'Thank you so much Elena! It was an absolute joy baking this for your 30th birthday celebration. — Marcus & Chloe',
      '2026-10-02 11:00:00'
    ]);

    // 8. Notifications
    db.execute(`
      INSERT INTO notifications (user_id, type, title, message, link_url, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `, [
      customer1Id,
      'ORDER_STATUS',
      'Your order is now being prepared! 🧁',
      'Sweet Crust Artisan Bakes has begun crafting your custom cake (Order #WL-2026-8802).',
      '/orders/2',
      '2026-10-03 15:00:00'
    ]);

    db.execute(`
      INSERT INTO notifications (user_id, type, title, message, link_url, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `, [
      bakeryOwner2Id,
      'NEW_ORDER',
      'New Order Received! 🍰',
      'Sarah Chen placed order #WL-2026-8803 for Belgian Triple Chocolate Fudge Showstopper ($85.00).',
      '/bakery/orders/3',
      '2026-10-04 09:00:00'
    ]);
  });

  console.log('[Seed] Database seeded with realistic initial records successfully!');
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase().catch((err) => {
    console.error('[Seed Error]', err);
  });
}
