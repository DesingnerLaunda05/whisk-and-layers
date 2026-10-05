# 🎂 Whisk & Layers — Artisanal Customized Cake Marketplace

> **A modern, full-stack relational web platform connecting dessert lovers with local artisan bakeries for signature prebuilt recipes and bespoke custom cake creations.**
> 
> 🌐 **Live Demo:** [https://desingnerlaunda05.github.io/whisk-and-layers/](https://desingnerlaunda05.github.io/whisk-and-layers/)

---

## 🌟 Executive Summary & Core Purpose

**Whisk & Layers** transforms how customers discover local bakeries and order customized celebration cakes. Instead of confusing spreadsheets or generic forms, customers experience a warm, bakery-inspired interface with an interactive 8-step Custom Cake Studio, verified customer reviews, clear lead times, and live stage-by-stage order tracking.

For bakery owners, Whisk & Layers provides a separate management dashboard to accept or decline incoming orders with mandatory reason logging, update preparation milestones (Baking, Decorating, Ready, Out for Delivery), manage their cake catalog, and reply to verified customer reviews.

---

## 🚀 Key Features

### 👤 Customer Experience
- **Bakery Discovery**: Browse local artisan bakeries with ratings, location, minimum lead time notice, and specialty tags.
- **Cake Catalog**: Filter by category (Signature Layers, Custom Bases, Celebration, Cheesecakes), price range, and customizability.
- **Product Detail**: High-res imagery, preparation lead days, bakery provenance, quantity picker, and free celebration inscription notes.
- **Interactive 8-Step Custom Cake Studio**:
  1. *Step 1*: Sponge Base (Madagascar Vanilla, Valrhona Chocolate, Red Velvet, Lemon Zest)
  2. *Step 2*: Flavor / Filling (Whipped Mascarpone, Salted Caramel, Wild Berry Compote, Espresso Hazelnut)
  3. *Step 3*: Size & Servings (6" Round, 8" Round, 10" Round, Two-Tier Showpiece)
  4. *Step 4*: Cake Shape (Classic Round, Romantic Heart, Sharp Square)
  5. *Step 5*: Icing & Frosting (Swiss Meringue Buttercream, Cream Cheese, Dark Ganache, Rustic Naked)
  6. *Step 6*: Toppings (Seasonal Berries, French Macarons, 24k Gold Leaf, Caramel Drips)
  7. *Step 7*: Decoration Style (Vintage Lambeth Scrollwork, Pressed Botanical Meadow, Palette Knife Stucco)
  8. *Step 8*: Hand-lettered Inscription Message & Bakery Selection
  9. *Step 9*: Live Price Review & Blueprint Summary Breakdown
- **Cart & Lead Time Protection**: Prevents multi-bakery delivery collisions and validates that required preparation lead days are respected.
- **Checkout & Payment Architecture**: Transparent delivery scheduling, customer contact fields, and payment settlement selection (Hand-delivery settlement or direct invoice upon approval).
- **Order Tracking**: Visual milestone progress timeline (`PENDING` ➔ `ACCEPTED` ➔ `PREPARING` ➔ `READY` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` or `REJECTED` with reason).
- **Verified Reviews**: Authentic star ratings and comments restricted exclusively to customers with delivered orders.

### 🧁 Bakery Owner Portal
- **Bakery Dashboard**: Live metric cards (Pending Approval, In Production, Completed, Gross Revenue) and urgent pending orders list.
- **Order Management**: Accept orders or decline with mandatory reason logging. Step-by-step milestone progression buttons (`Start Baking`, `Mark Boxed & Ready`, `Dispatch`, `Confirm Delivered`).
- **Cake Management**: Add new cakes, upload imagery, adjust prices, toggle active ordering status, and edit descriptions.
- **Storefront Profile**: Update bakery name, tagline, description, address, phone, minimum advance lead days, and cover banners.
- **Customer Feedback & Replies**: Read verified customer reviews and post public bakery replies.

### 🛡️ Platform Administration
- **Governance Console**: Real-time platform metrics (total users, active bakeries, global orders, settled GMV).
- **Bakery Moderation**: Approve or revoke bakery merchant storefronts.
- **User Management**: Moderation of customer and bakery accounts with suspension/reactivation toggles.
- **Global Order Feed**: Real-time order monitoring across all bakeries.

---

## 🔑 Demo & Evaluation Accounts

A convenient **1-Click Demo Switcher Bar** is pinned to the top of the header in development mode for instant evaluator access without manual typing:

| Role | Email | Password | Details |
|---|---|---|---|
| **Customer** | `customer@whiskandlayers.com` | `Customer123!` | Elena Vance (Has active, delivered, and custom orders) |
| **Bakery Owner** | `sweetcrust@whiskandlayers.com` | `Bakery123!` | Sweet Crust Artisan Bakes (4.9★, SF) |
| **Bakery Owner 2**| `velvetlayer@whiskandlayers.com`| `Bakery123!` | Velvet & Layer Confectionery (4.8★, Oakland) |
| **Admin** | `admin@whiskandlayers.com` | `Admin123!` | Platform Administrator |

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 6
- **Routing**: React Router 6 with Role Guards (`RequireAuth`, `RequireRole`)
- **Icons**: Lucide React
- **Design System**: Warm artisan bakery CSS tokens (`Playfair Display` serif headings + `Plus Jakarta Sans` UI body)

### Backend
- **Runtime**: Node.js v22+ with TypeScript
- **Web Framework**: Express.js
- **Layered Architecture**:
  - `routes/` ➔ Domain REST routing
  - `controllers/` ➔ HTTP request/response orchestration
  - `services/` ➔ Core business rules & price validation
  - `repositories/` ➔ SQL data access layer
  - `validators/` ➔ Zod schema validation
  - `middleware/` ➔ JWT authentication, role authorization, rate limiting, error handling, file uploads
- **Database**: Universal Relational SQL Engine (SQLite with disk persistence for instant zero-config evaluation, with standard MySQL migration compatibility)
- **Security**: Helmet headers, CORS policies, bcrypt password hashing, JWT tokens, Multer MIME/size filtering, centralized error shielding

---

## 📁 Repository Structure

```
whisk&layers/
├── backend/
│   ├── src/
│   │   ├── config/              # Environment config & constants
│   │   ├── controllers/         # API endpoint controllers
│   │   ├── database/            # Schema DDL, DB connection & rich seeder
│   │   ├── middleware/          # Auth, role check, upload & error handlers
│   │   ├── repositories/        # SQL data access methods
│   │   ├── routes/              # Domain REST routers
│   │   ├── services/            # Business logic & domain services
│   │   ├── tests/               # Vitest integration test suite
│   │   ├── types/               # Backend domain types
│   │   ├── utils/               # JWT, bcrypt, response formatters
│   │   ├── app.ts               # Express application setup
│   │   └── index.ts             # Server entry point & DB bootstrap
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, Footer, BakeryLayout, AdminLayout
│   │   │   └── ui/              # StatusBadge, OrderTimeline, StarRating, etc.
│   │   ├── context/             # AuthContext, CartContext, ToastContext, NotifContext
│   │   ├── pages/
│   │   │   ├── customer/        # Landing, Bakeries, Cakes, Studio, Cart, Checkout, etc.
│   │   │   ├── bakery/          # Dashboard, Orders, Cakes, Reviews, Profile
│   │   │   ├── admin/           # Dashboard, Bakeries, Users, Orders
│   │   │   └── auth/            # Login, Register
│   │   ├── services/            # Frontend API client modules
│   │   ├── styles/              # Design system tokens & CSS rules
│   │   ├── types/               # Frontend TypeScript definitions
│   │   ├── App.tsx              # Application route tree
│   │   └── main.tsx             # Root React mount
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started & Installation

### Prerequisites
- Node.js v20+ or v22+
- npm v10+

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Seed & Start Development Services
```bash
# Start backend (Port 5000) and frontend (Port 5173) concurrently:
npm run dev
```

The database initializes automatically on first run with rich realistic sample bakeries, signature cakes, custom builder tokens, initial orders, reviews, and test accounts!

---

## 🧪 Running Automated Tests

Run the backend integration and security test suite:

```bash
npm run test
```

The suite validates:
1. Health endpoint & database availability
2. Customer login & JWT issuance
3. Bakery owner login & merchant association
4. Role authorization (Customer blocked from Bakery Dashboard and Admin routes)
5. Custom cake builder price calculation
6. Full order lifecycle (Place order ➔ Accept ➔ Preparing ➔ Ready ➔ Delivered ➔ Verified Review)
7. Rejection business flow with mandatory decline reasoning

---

## 🌐 API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System health & uptime |
| `POST` | `/api/auth/register` | Public | Register Customer or Bakery |
| `POST` | `/api/auth/login` | Public | Sign in & receive JWT |
| `GET` | `/api/auth/me` | Authenticated | Current user profile |
| `GET` | `/api/bakeries` | Public | Search & list bakeries |
| `GET` | `/api/bakeries/:idOrSlug` | Public | Bakery storefront & reviews |
| `PUT` | `/api/bakeries/my-bakery` | Bakery | Update bakery profile |
| `GET` | `/api/cakes` | Public | Cake catalog with filters |
| `POST` | `/api/cakes` | Bakery | Add new cake listing |
| `GET` | `/api/customizations/options` | Public | 8-step builder options |
| `POST` | `/api/orders` | Customer | Place prebuilt or custom cake order |
| `GET` | `/api/orders/my-orders` | Customer | View customer order history |
| `GET` | `/api/orders/bakery/dashboard`| Bakery | Bakery metric stats & urgent orders |
| `GET` | `/api/orders/bakery/orders` | Bakery | Tabbed bakery order list |
| `PATCH`| `/api/orders/:id/status` | Bakery/Admin | Update order status / decline |
| `POST` | `/api/reviews` | Customer | Submit verified review for delivered order |
| `POST` | `/api/reviews/:id/reply` | Bakery | Post bakery reply to review |
| `GET` | `/api/admin/metrics` | Admin | Platform statistics |

---

## 📄 License & Integrity
Crafted for **Whisk & Layers**. All business logic, authorization checks, status transitions, and data persistence are fully implemented and production-ready.
