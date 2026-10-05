import { db } from './db.js';

export async function initializeSchema(): Promise<void> {
  await db.init();

  const createTablesSql = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL CHECK(role IN ('CUSTOMER', 'BAKERY', 'ADMIN')),
      avatar_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

    -- Bakeries table
    CREATE TABLE IF NOT EXISTS bakeries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      tagline TEXT,
      description TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      logo_url TEXT,
      banner_url TEXT,
      specialties TEXT,
      rating_avg REAL DEFAULT 0.0,
      review_count INTEGER DEFAULT 0,
      is_approved INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      minimum_lead_days INTEGER NOT NULL DEFAULT 2,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_bakeries_slug ON bakeries(slug);
    CREATE INDEX IF NOT EXISTS idx_bakeries_city ON bakeries(city);

    -- Cake Categories
    CREATE TABLE IF NOT EXISTS cake_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0
    );

    -- Cakes table
    CREATE TABLE IF NOT EXISTS cakes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bakery_id INTEGER NOT NULL,
      category_id INTEGER,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT NOT NULL,
      base_price REAL NOT NULL,
      preparation_days INTEGER NOT NULL DEFAULT 2,
      image_url TEXT NOT NULL,
      gallery_urls TEXT,
      is_customizable INTEGER NOT NULL DEFAULT 0,
      is_available INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bakery_id) REFERENCES bakeries(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES cake_categories(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_cakes_bakery ON cakes(bakery_id);
    CREATE INDEX IF NOT EXISTS idx_cakes_category ON cakes(category_id);
    CREATE INDEX IF NOT EXISTS idx_cakes_slug ON cakes(slug);

    -- Customization Options
    CREATE TABLE IF NOT EXISTS customization_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('BASE', 'FLAVOR', 'SIZE', 'SHAPE', 'ICING', 'TOPPING', 'DECORATION')),
      label TEXT NOT NULL,
      description TEXT,
      extra_price REAL NOT NULL DEFAULT 0.0,
      image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_custom_opts_type ON customization_options(type);

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER NOT NULL,
      bakery_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      subtotal REAL NOT NULL,
      delivery_fee REAL NOT NULL DEFAULT 0.0,
      tax_amount REAL NOT NULL DEFAULT 0.0,
      status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED', 'CANCELLED')),
      rejection_reason TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      delivery_date TEXT NOT NULL,
      delivery_time_slot TEXT,
      special_instructions TEXT,
      payment_method TEXT NOT NULL DEFAULT 'PAY_ON_DELIVERY',
      payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(payment_status IN ('UNPAID', 'PENDING', 'PAID', 'REFUNDED')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
      FOREIGN KEY (bakery_id) REFERENCES bakeries(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_bakery ON orders(bakery_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

    -- Order Items
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      cake_id INTEGER,
      cake_name TEXT NOT NULL,
      cake_image TEXT,
      base_price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      subtotal REAL NOT NULL,
      is_custom INTEGER NOT NULL DEFAULT 0,
      custom_message TEXT,
      selected_options TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (cake_id) REFERENCES cakes(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

    -- Reviews table
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER UNIQUE NOT NULL,
      customer_id INTEGER NOT NULL,
      bakery_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      reply_comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (bakery_id) REFERENCES bakeries(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_bakery ON reviews(bakery_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);

    -- Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link_url TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notif_read ON notifications(is_read);
  `;

  db.exec(createTablesSql);
  console.log('[Database] Schema initialized successfully.');
}
