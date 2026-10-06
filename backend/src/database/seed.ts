import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { initializeSchema } from './schema.js';

export async function seedDatabase(force = false) {
  console.log('[Seed] Starting database seed...');
  await initializeSchema();

  if (force) {
    console.log('[Seed] Force seeding requested. Clearing existing records...');
    db.exec(`
      DELETE FROM notifications;
      DELETE FROM reviews;
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM customization_options;
      DELETE FROM cakes;
      DELETE FROM cake_categories;
      DELETE FROM bakeries;
      DELETE FROM users;
    `);
  } else {
    // Check if already seeded
    const userCount = db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM users');
    if (userCount && userCount.count > 0) {
      console.log('[Seed] Database already contains data. Skipping seed.');
      return;
    }
  }

  const salt = await bcrypt.genSalt(10);
  const customerPassword = await bcrypt.hash('Customer123!', salt);
  const bakeryPassword = await bcrypt.hash('Bakery123!', salt);
  const adminPassword = await bcrypt.hash('Admin123!', salt);

  db.transaction(() => {
    // 1. Insert Users (Indian demo users)
    const customer1 = db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'customer@whiskandlayers.com',
      customerPassword,
      'Aditya Nair',
      '+91 9876543210',
      'CUSTOMER',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    ]);
    const customer1Id = customer1.lastInsertRowid;

    const customer2 = db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'diya.patel@example.com',
      customerPassword,
      'Diya Patel',
      '+91 9825012345',
      'CUSTOMER',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    ]);
    const customer2Id = customer2.lastInsertRowid;

    const customer3 = db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'aarav.shah@example.com',
      customerPassword,
      'Aarav Shah',
      '+91 9123456789',
      'CUSTOMER',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    ]);

    // Bakery Owners (Fictional Indian Bakery Entrepreneurs)
    const bakeryOwner1 = db.execute(`
      INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [
      'sweetcrust@whiskandlayers.com',
      bakeryPassword,
      'Priya & Rohan Joshi',
      '+91 9825123456',
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
      'Ananya Desai',
      '+91 9909988776',
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
      'Rahul Shah',
      '+91 9898123456',
      'BAKERY',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
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
      '+91 9800011223',
      'ADMIN',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    ]);

    // 2. Insert Bakeries (Fictional Indian Artisan Bakeries)
    const bakery1 = db.execute(`
      INSERT INTO bakeries (user_id, name, slug, tagline, description, address, city, state, postal_code, phone, email, logo_url, banner_url, specialties, rating_avg, review_count, is_approved, is_active, minimum_lead_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `, [
      bakeryOwner1Id,
      'Whisk House',
      'whisk-house',
      'French-inspired layered confectionery & bespoke celebration cakes',
      'Founded in Bodakdev, Ahmedabad, Whisk House specializes in pure Belgian chocolate truffle creations, royal rasmalai celebration tiers, and 100% eggless gourmet patisserie made fresh daily.',
      '402 Bodakdev Galleria, Sindhu Bhavan Road',
      'Ahmedabad',
      'Gujarat',
      '380054',
      '+91 9825123456',
      'whiskhouse@whiskandlayers.com',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&auto=format&fit=crop&q=80',
      '100% Eggless Specials, Belgian Truffle, Rasmalai Tiers, Botanical Buttercream',
      4.9,
      58,
      2
    ]);
    const bakery1Id = bakery1.lastInsertRowid;

    const bakery2 = db.execute(`
      INSERT INTO bakeries (user_id, name, slug, tagline, description, address, city, state, postal_code, phone, email, logo_url, banner_url, specialties, rating_avg, review_count, is_approved, is_active, minimum_lead_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `, [
      bakeryOwner2Id,
      'The Cake Story',
      'the-cake-story',
      'Sculpted celebration cakes, decadent cheesecakes & fusion delights',
      'Located near Vastrapur Lake in Ahmedabad, The Cake Story creates bespoke celebration centerpieces blending international confectionery trends with rich Indian tastes like Lotus Biscoff, Alphonso Mango, and Gulab Jamun.',
      'Shop 14, Vastrapur Lake Arcade, Vastrapur',
      'Ahmedabad',
      'Gujarat',
      '380015',
      '+91 9909988776',
      'thecakestory@whiskandlayers.com',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&auto=format&fit=crop&q=80',
      'Biscoff Cheesecakes, Indian Fusion, Birthday Showstoppers, Custom Sugar Art',
      4.8,
      42,
      2
    ]);
    const bakery2Id = bakery2.lastInsertRowid;

    const bakery3 = db.execute(`
      INSERT INTO bakeries (user_id, name, slug, tagline, description, address, city, state, postal_code, phone, email, logo_url, banner_url, specialties, rating_avg, review_count, is_approved, is_active, minimum_lead_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `, [
      bakeryOwner3Id,
      'Sweet Oven',
      'sweet-oven',
      'Farm-fresh organic dairy bakes, vintage lambeth piping & fresh fruit cakes',
      'Situated in Pali Hill, Bandra West, Mumbai, Sweet Oven crafts heirloom celebration cakes using rich A2 dairy, fresh seasonal Indian orchard fruits, and delicate Victorian Lambeth piping techniques.',
      '104 Pali Hill Promenade, Bandra West',
      'Mumbai',
      'Maharashtra',
      '400050',
      '+91 9898123456',
      'sweetoven@whiskandlayers.com',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=1200&auto=format&fit=crop&q=80',
      'Vintage Lambeth Piping, Fresh Mango Gateaux, Organic Dairy, Floral Styling',
      5.0,
      34,
      2
    ]);
    const bakery3Id = bakery3.lastInsertRowid;

    // 3. Cake Categories
    const cat1 = db.execute(`
      INSERT INTO cake_categories (name, slug, description, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, ['Signature Celebration Cakes', 'signature-celebration', 'Handcrafted multi-layered cakes with gourmet compotes and silky frostings', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80', 1]);
    const cat1Id = cat1.lastInsertRowid;

    const cat2 = db.execute(`
      INSERT INTO cake_categories (name, slug, description, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, ['Custom Cake Bases', 'custom-bases', 'Blank canvas artisan bases ready for step-by-step flavor, weight, and styling customization', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop&q=80', 2]);
    const cat2Id = cat2.lastInsertRowid;

    const cat3 = db.execute(`
      INSERT INTO cake_categories (name, slug, description, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, ['Indian Fusion Specials', 'indian-fusion', 'Luxurious celebration cakes infused with Rasmalai, Gulab Jamun, Saffron, and Pistachio', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&auto=format&fit=crop&q=80', 3]);
    const cat3Id = cat3.lastInsertRowid;

    const cat4 = db.execute(`
      INSERT INTO cake_categories (name, slug, description, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, ['Cheesecakes & Contemporary Tortes', 'cheesecakes-tortes', 'Velvety Lotus Biscoff cheesecakes and seasonal fresh fruit gateaux', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80', 4]);
    const cat4Id = cat4.lastInsertRowid;

    // 4. Customization Options (8-step builder tokens - in INR & Kg)
    const options = [
      // BASE
      ['Eggless Vanilla Chiffon', 'BASE', 'Classic Madagascar Vanilla Sponge', 'Light, fluffy eggless sponge infused with pure Bourbon vanilla bean extract', 0.0, 1],
      ['Eggless Rich Dark Chocolate', 'BASE', 'Dutch Dark Chocolate Sponge', 'Intensely chocolatey, moist crumb with 70% dark cocoa notes', 100.0, 2],
      ['Red Velvet Cocoa Chiffon', 'BASE', 'Ruby Cocoa Sponge', 'Silky cocoa sponge with delicate tang and deep ruby hue', 120.0, 3],
      ['Cardamom & Saffron Sponge', 'BASE', 'Royal Kesar Elaichi Sponge', 'Aromatic sponge infused with Kashmiri saffron strands and fresh green cardamom', 150.0, 4],

      // FLAVOR / FILLING
      ['Belgian Chocolate Truffle', 'FLAVOR', 'Rich Dark Chocolate Truffle', 'Decadent 55% cocoa silky ganache filling', 0.0, 1],
      ['Royal Rasmalai Cream', 'FLAVOR', 'Saffron Milk & Pistachio Rasmalai', 'Real soft cottage cheese dumplings simmered in rich saffron-cardamom milk', 150.0, 2],
      ['Lotus Biscoff Spread', 'FLAVOR', 'Caramelized Spiced Speculoos Cream', 'Luscious Belgian Biscoff spread with crunchy biscuit crumble', 150.0, 3],
      ['Alphonso Mango Compote', 'FLAVOR', 'Ratnagiri Alphonso Pulp', 'Sweet, vibrant slow-simmered pure mango reduction', 120.0, 4],
      ['Butterscotch Praline Crunch', 'FLAVOR', 'Golden Cashew Praline & Caramel', 'Handmade crunchy cashew praline with creamy caramel sauce', 100.0, 5],
      ['Fresh Strawberry Compote', 'FLAVOR', 'Mahabaleshwar Strawberry Coulis', 'Fresh organic strawberry reduction with balanced sweetness', 100.0, 6],

      // SIZE (Strictly in Kilograms for Indian market)
      ['0.5 Kg', 'SIZE', '0.5 Kg (Serves 3–4)', 'Ideal for intimate birthdays, dates, and cozy milestones', 0.0, 1],
      ['1.0 Kg', 'SIZE', '1.0 Kg (Serves 6–8)', 'Our most popular size for family celebrations and dinner parties', 400.0, 2],
      ['1.5 Kg', 'SIZE', '1.5 Kg (Serves 10–12)', 'Perfect for lively milestone parties and joyful gatherings', 750.0, 3],
      ['2.0 Kg', 'SIZE', '2.0 Kg (Serves 14–16)', 'Generous celebration cake for larger family events', 1100.0, 4],
      ['3.0 Kg (2-Tier)', 'SIZE', '3.0 Kg Two-Tier Tower (Serves 22–26)', 'Showstopping tiered celebration centerpiece with structural support', 1800.0, 5],

      // SHAPE
      ['Classic Round', 'SHAPE', 'Traditional Symmetrical Round', 'Timeless symmetrical shape with clean vertical edges', 0.0, 1],
      ['Romantic Heart', 'SHAPE', 'Sweetheart Contour', 'Charming scalloped heart contour for anniversaries and birthdays', 100.0, 2],
      ['Contemporary Square', 'SHAPE', 'Modern Crisp Square', 'Contemporary crisp 90-degree corners for a modern aesthetic', 80.0, 3],
      ['Tall Arch / Cylinder', 'SHAPE', 'Editorial Arch Profile', 'Dramatic tall cake profile with sleek European lines', 150.0, 4],

      // ICING / FROSTING
      ['Light Whipped Cream', 'ICING', 'Whipped Dairy Cream (Fresh & Light)', 'Airy, silky whipped cream with balanced sweetness', 0.0, 1],
      ['Belgian Dark Chocolate Ganache', 'ICING', 'Silky Gloss Chocolate Ganache', 'Decadent pourable ganache with mirror gloss and deep cocoa finish', 150.0, 2],
      ['Cream Cheese Frosting', 'ICING', 'Whipped Cream Cheese Frosting', 'Tangy, luscious frosting whipped to silky perfection', 180.0, 3],
      ['Swiss Meringue Buttercream', 'ICING', 'Silky Velvet Buttercream', 'Ultra-smooth, velvet frosting ideal for sharp edges and vintage piping', 120.0, 4],

      // TOPPINGS
      ['Roasted Almond & Pistachio Flakes', 'TOPPING', 'Shaved Dry Fruits & Saffron', 'Premium hand-sliced Mamra almonds and Iranian green pistachios', 80.0, 1],
      ['Exotic Fresh Fruits', 'TOPPING', 'Fresh Kiwi, Berries & Dragon Fruit', 'Handpicked colorful tropical fruits cut fresh on delivery day', 150.0, 2],
      ['Belgian Chocolate Curls', 'TOPPING', 'Dual Milk & Dark Chocolate Curls', 'Artisan chocolate bark shavings layered across the crown', 100.0, 3],
      ['Crushed Lotus Biscoff Crumbs', 'TOPPING', 'Caramelized Biscuit Crumble', 'Crunchy Biscoff cookies crushed over silky spread drip', 120.0, 4],
      ['Ferrero Rocher & Macaron Trio', 'TOPPING', 'Gold-Dusted Chocolates & Macarons', 'Whole Ferrero Rocher pralines paired with almond French macarons', 250.0, 5],
      ['No Extra Toppings', 'TOPPING', 'Clean Minimalist Crown', 'Clean top finish ready for custom hand-piped messages or candles', 0.0, 6],

      // DECORATION STYLE
      ['Vintage Lambeth Borders', 'DECORATION', 'Victorian Vintage Lambeth Scrollwork', 'Intricate multi-tier ruffled piping with sugar pearl embellishments', 150.0, 1],
      ['24K Edible Gold Leaf & Rose Petals', 'DECORATION', 'Pure Gold Leaf & Organic Dried Roses', 'Artfully placed 24k edible gold foil with fragrant dried red rose petals', 200.0, 2],
      ['Minimalist Floral Piping', 'DECORATION', 'Delicate Buttercream Blossoms', 'Understated pastel buttercream rosettes and delicate foliage', 100.0, 3],
      ['Artisan Chocolate Drip & Pearls', 'DECORATION', 'Glossy Drip with Shimmer Pearls', 'Slow cocoa drip along the borders with edible pearlescent beads', 120.0, 4],
    ];

    for (const opt of options) {
      db.execute(`
        INSERT INTO customization_options (name, type, label, description, extra_price, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `, opt);
    }

    // 5. Cakes (Realistic Indian Artisan Catalog in INR)
    const cake1 = db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery1Id,
      cat1Id,
      'Dutch Chocolate Truffle Cake (100% Eggless)',
      'dutch-chocolate-truffle-cake',
      'Four layers of moist Dutch chocolate sponge layered with 55% dark chocolate truffle ganache and coated in mirror cocoa glaze. 100% pure vegetarian and freshly baked on order.',
      750.0,
      1,
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      JSON.stringify([
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80'
      ]),
      1
    ]);
    const cake1Id = cake1.lastInsertRowid;

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery1Id,
      cat3Id,
      'Royal Rasmalai Tres Leches Cake',
      'royal-rasmalai-tres-leches',
      'Soft cardamom chiffon sponge soaked in rich saffron milk (rabdi), filled with tender rasmalai chunks, and crowned with slivered pistachios and dried rose petals.',
      950.0,
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
      'whisk-house-bespoke-canvas',
      'Start with our signature foundation and personalize every element: sponge, gourmet filling, weight in kilograms, vintage Lambeth piping, and custom hand-lettered message.',
      600.0,
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
      cat1Id,
      'Classic Black Forest Cake (Eggless)',
      'classic-black-forest-cake',
      'Traditional chocolate sponge infused with sweet cherry reduction, whipped cream, Belgian chocolate shavings, and whole maraschino cherries.',
      650.0,
      1,
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    // Bakery 2 Cakes (The Cake Story)
    const cake5 = db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery2Id,
      cat4Id,
      'Lotus Biscoff Baked Cheesecake (Eggless)',
      'lotus-biscoff-cheesecake',
      'Velvety slow-baked cheesecake on a crunchy spiced Biscoff biscuit crust, generously topped with warm melted Biscoff spread and whole Belgian biscuits.',
      1250.0,
      1,
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
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
      'Gulab Jamun Fusion Celebration Cake',
      'gulab-jamun-fusion-celebration',
      'Kesar-infused vanilla sponge soaked in rose water sugar syrup, layered with soft mini gulab jamuns and whipped cardamom cream.',
      850.0,
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
      cat1Id,
      'Butterscotch Caramel Crunch Cake',
      'butterscotch-caramel-crunch-cake',
      'Rich golden sponge layered with house-made butterscotch crunch praline, caramel syrup, and light whipped frosting. A crowd favorite in Indian celebrations.',
      550.0,
      1,
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery2Id,
      cat1Id,
      'Ferrero Rocher Hazelnut Indulgence',
      'ferrero-rocher-hazelnut-indulgence',
      'Dark chocolate cocoa sponge filled with roasted hazelnut Nutella mousse, topped with crunchy toasted hazelnuts and whole Ferrero Rocher chocolates.',
      1350.0,
      2,
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    // Bakery 3 Cakes (Sweet Oven - Mumbai)
    db.execute(`
      INSERT INTO cakes (bakery_id, category_id, name, slug, description, base_price, preparation_days, image_url, gallery_urls, is_customizable, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      bakery3Id,
      cat1Id,
      'Fresh Tropical Fruit Gateau (100% Eggless)',
      'fresh-tropical-fruit-gateau',
      'Soft vanilla chiffon sponge drenched in natural fruit nectar, layered with freshly chopped seasonal fruits (kiwi, dragon fruit, pomegranate) and light cream.',
      800.0,
      1,
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
      'Classic Pineapple Gateau',
      'classic-pineapple-gateau',
      'Evergreen Indian birthday favorite with sweet roasted pineapple chunks, cherry accents, and delicate vanilla whipped frosting.',
      500.0,
      1,
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
      'Sweet Oven Bespoke Wedding Canvas',
      'sweet-oven-bespoke-canvas',
      'Crafted with 100% organic farmstead dairy from Maharashtra. Choose your custom weight, flavors, Lambeth scrollwork, and handwritten message.',
      650.0,
      2,
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      null,
      1
    ]);

    // 6. Orders (with Indian delivery addresses and INR pricing)
    // Order 1: DELIVERED (Whisk House -> Aditya)
    const ord1 = db.execute(`
      INSERT INTO orders (order_number, customer_id, bakery_id, total_amount, subtotal, delivery_fee, tax_amount, status, rejection_reason, customer_name, customer_phone, delivery_address, delivery_date, delivery_time_slot, special_instructions, payment_method, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'WL-2026-8801',
      customer1Id,
      bakery1Id,
      972.50,
      850.00,
      80.00,
      42.50,
      'DELIVERED',
      null,
      'Aditya Nair',
      '+91 9876543210',
      'Flat 402, Shree Residency, 150 Feet Ring Road, Near Nana Mava Circle, Rajkot, Gujarat 360005',
      '2026-10-01',
      'Morning (09:00 AM - 12:00 PM)',
      'Please call upon arrival at the security gate.',
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
      'Dutch Chocolate Truffle Cake (100% Eggless)',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      750.0,
      1,
      850.0,
      1,
      'Happy 30th Birthday Aditya!',
      JSON.stringify({
        base: 'Eggless Vanilla Chiffon',
        flavor: 'Belgian Chocolate Truffle',
        size: '1.0 Kg',
        shape: 'Classic Round',
        icing: 'Belgian Dark Chocolate Ganache',
        topping: 'Roasted Almond & Pistachio Flakes (+₹80.00)',
        decoration: '24K Edible Gold Leaf & Rose Petals'
      })
    ]);

    // Order 2: PREPARING (Whisk House -> Aditya)
    const ord2 = db.execute(`
      INSERT INTO orders (order_number, customer_id, bakery_id, total_amount, subtotal, delivery_fee, tax_amount, status, rejection_reason, customer_name, customer_phone, delivery_address, delivery_date, delivery_time_slot, special_instructions, payment_method, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'WL-2026-8802',
      customer1Id,
      bakery1Id,
      1130.00,
      1000.00,
      80.00,
      50.00,
      'PREPARING',
      null,
      'Aditya Nair',
      '+91 9876543210',
      'Flat 402, Shree Residency, 150 Feet Ring Road, Near Nana Mava Circle, Rajkot, Gujarat 360005',
      '2026-10-06',
      'Afternoon (01:00 PM - 04:00 PM)',
      'Keep refrigerated until evening cake cutting.',
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
      'Bespoke Artisan Cake Creation',
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
      600.0,
      1,
      1000.0,
      1,
      'Happy Griha Pravesh!',
      JSON.stringify({
        base: 'Cardamom & Saffron Sponge (+₹150.00)',
        flavor: 'Royal Rasmalai Cream (+₹150.00)',
        size: '1.0 Kg',
        shape: 'Romantic Heart (+₹100.00)',
        icing: 'Light Whipped Cream',
        topping: 'Roasted Almond & Pistachio Flakes (+₹80.00)',
        decoration: 'Vintage Lambeth Borders'
      })
    ]);

    // Order 3: PENDING (The Cake Story -> Diya)
    const ord3 = db.execute(`
      INSERT INTO orders (order_number, customer_id, bakery_id, total_amount, subtotal, delivery_fee, tax_amount, status, rejection_reason, customer_name, customer_phone, delivery_address, delivery_date, delivery_time_slot, special_instructions, payment_method, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'WL-2026-8803',
      customer2Id,
      bakery2Id,
      1392.50,
      1250.00,
      80.00,
      62.50,
      'PENDING',
      null,
      'Diya Patel',
      '+91 9825012345',
      'A-601, Shivalik Heights, Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054',
      '2026-10-08',
      'Morning (10:00 AM - 01:00 PM)',
      'Handle carefully, anniversary celebration.',
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
      'Lotus Biscoff Baked Cheesecake (Eggless)',
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
      1250.0,
      1,
      1250.0,
      0,
      'Happy 10th Anniversary Mom & Dad!',
      null
    ]);

    // Order 4: REJECTED (demonstrates rejection flow with reason)
    const ord4 = db.execute(`
      INSERT INTO orders (order_number, customer_id, bakery_id, total_amount, subtotal, delivery_fee, tax_amount, status, rejection_reason, customer_name, customer_phone, delivery_address, delivery_date, delivery_time_slot, special_instructions, payment_method, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'WL-2026-8804',
      customer2Id,
      bakery1Id,
      2580.00,
      2400.00,
      80.00,
      100.00,
      'REJECTED',
      'Fully booked for grand wedding catering orders on this auspicious date. Unable to accept additional bespoke multi-tier cakes.',
      'Diya Patel',
      '+91 9825012345',
      'A-601, Shivalik Heights, Bodakdev, Ahmedabad, Gujarat 380054',
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
      1800.0,
      1,
      2400.0,
      1,
      'Corporate Gala Celebration',
      JSON.stringify({
        base: 'Eggless Rich Dark Chocolate (+₹100.00)',
        flavor: 'Lotus Biscoff Spread (+₹150.00)',
        size: '3.0 Kg (2-Tier) (+₹1,800.00)',
        shape: 'Classic Round',
        icing: 'Belgian Dark Chocolate Ganache (+₹150.00)',
        topping: 'Ferrero Rocher & Macaron Trio (+₹250.00)',
        decoration: '24K Edible Gold Leaf & Rose Petals (+₹200.00)'
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
      'The Dutch Chocolate Truffle cake was magnificent! 100% pure eggless yet delightfully light and moist with pure cocoa aroma. Delivery in Rajkot arrived perfectly chilled and intact. Everyone asked where we ordered it from!',
      'Thank you so much Aditya! It was an absolute pleasure crafting this centerpiece for your celebration. — Priya & Rohan Joshi',
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
      'Whisk House has begun crafting your custom cake (Order #WL-2026-8802).',
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
      'Diya Patel placed order #WL-2026-8803 for Lotus Biscoff Baked Cheesecake (₹1,393).',
      '/bakery/orders/3',
      '2026-10-04 09:00:00'
    ]);
  });

  console.log('[Seed] Database seeded with realistic Indian initial records successfully!');
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase(true).catch((err) => {
    console.error('[Seed Error]', err);
  });
}
