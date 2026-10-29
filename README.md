# 🎂 Whisk & Layers — India-First Artisanal Customized Cake Marketplace

> **A modern, full-stack relational marketplace connecting dessert lovers with local artisan bakeries across India for signature gourmet recipes and bespoke customized celebration cakes.**
> 
> 🌐 **Live Demo:** [https://desingnerlaunda05.github.io/whisk-and-layers/](https://desingnerlaunda05.github.io/whisk-and-layers/)
> 
> 📄 **Product Requirements Document (PRD):** [📖 Read Online (Markdown)](./Whisk_and_Layers_PRD_Final.md) &nbsp;|&nbsp; [📑 View PDF (15 Pages)](./Whisk_and_Layers_PRD_Final.pdf) &nbsp;|&nbsp; [📥 Download (.docx)](./Whisk_and_Layers_PRD_Final.docx)

---

## 🌟 Executive Summary & Core Purpose

**Whisk & Layers** transforms how customers in India discover verified local bakeries and order handcrafted celebration cakes. Instead of confusing spreadsheets or generic forms, customers experience a warm, bakery-inspired interface with an interactive 8-step Custom Cake Studio, verified customer reviews, clear lead times, and live stage-by-stage order tracking.

For bakery owners across Ahmedabad, Vadodara, Rajkot, Surat, Mumbai, Pune, Bengaluru, New Delhi, Hyderabad, and top Indian cities, Whisk & Layers provides a separate management dashboard to accept or decline incoming orders with mandatory reason logging, update preparation milestones (Baking, Decorating, Ready, Out for Delivery), manage their cake catalog, and reply to verified customer reviews.

---

## 🚀 Key Features

### 👤 Customer Experience
- **Bakery Discovery**: Browse local artisan bakeries in Gujarat, Maharashtra, Karnataka, Delhi-NCR & more with ratings, location, minimum lead time notice, and specialty tags.
- **Cake Catalog**: Filter by category (Signature Celebration, Custom Bases, Indian Fusion Specials, Cheesecakes & Tortes), INR price range, and customizability.
- **Product Detail**: High-res imagery, preparation lead days, bakery kitchen provenance, quantity picker, eggless badges, and free celebration inscription notes.
- **Interactive Custom Cake Studio with 3D Structure Viewer**:
  - Free-Hand Studio & Step-by-Step Guided Wizard modes.
  - Inspiration Photo Uploader (upload custom cake images from Instagram/Pinterest for the chef).
  - Real-time 3D cake visualizer built with Three.js (1 to 4 tiers, Round/Heart/Square/Hexagon geometries, 10+ frosting colors, 3D toppings like macarons, berries, gold leaf, and lit birthday candle).
- **Cart & Lead Time Protection**: Prevents multi-bakery delivery collisions and validates that required preparation lead days are respected.
- **Functional Checkout & Payment Methods**:
  - Instant UPI (GPay, PhonePe, Paytm, BHIM) with dynamic QR code & NPCI transaction reference generation.
  - Credit / Debit Card with 3D Secure OTP verification modal simulation.
  - Net Banking authorization with top Indian banks (SBI, HDFC, ICICI, Axis, Kotak, PNB).
  - Pay on Delivery (Cash or UPI at doorstep).
  - 1-click Quick-Fill from saved addresses.
- **Order Tracking**: Visual milestone progress timeline (`PENDING` ➔ `ACCEPTED` ➔ `PREPARING` ➔ `READY` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` or `REJECTED` with reason).
- **Verified Reviews**: Authentic star ratings and comments restricted exclusively to customers with delivered orders.
- **User Profile Customization**: Change profile picture via local file upload or 8 artisan avatar presets, configure dietary preferences (100% Eggless, Vegan, Gluten-Free, Nut-Safe), manage address book, and set celebration reminders.

### 🧁 Bakery Owner Portal
- **Bakery Dashboard**: Live metric cards (Pending Approval, In Production, Completed, Settled Revenue in ₹) and urgent pending orders list.
- **Order Management**: Accept orders or decline with mandatory reason logging. Milestone buttons (`Start Baking`, `Mark Boxed & Ready`, `Dispatch`, `Confirm Delivered`).
- **Cake Management**: Add new cakes, upload imagery, adjust INR prices, toggle active ordering status, and edit recipe descriptions.
- **Storefront Profile**: Update bakery brand, tagline, description, Indian address, PIN code, contact mobile, minimum lead days, and cover banners.
- **Customer Feedback & Replies**: Read verified customer reviews and post public bakery replies.

### 🛡️ Platform Administration
- **Governance Console**: Real-time platform metrics (total users, active bakeries, global orders, settled GMV in ₹).
- **Bakery Moderation**: Approve or revoke bakery merchant storefronts.
- **User Management**: Moderation of customer and bakery accounts with suspension/reactivation toggles.
- **Global Order Feed**: Real-time order monitoring across all bakeries.

---

## 📄 Product Requirements Document (PRD)

The complete recruiter-facing and engineering-defensible **Product Requirements Document (PRD)** for Whisk & Layers is included directly in this repository:

| Format | Access Link | Description |
|---|---|---|
| 📖 **Online Markdown** | [**Whisk_and_Layers_PRD_Final.md**](./Whisk_and_Layers_PRD_Final.md) | Full in-browser reading on GitHub with interactive tables & navigation |
| 📑 **Executive PDF** | [**Whisk_and_Layers_PRD_Final.pdf**](./Whisk_and_Layers_PRD_Final.pdf) | 15-page formatted PDF with executive typography & printable layout |
| 📝 **Editable Word Doc** | [**Whisk_and_Layers_PRD_Final.docx**](./Whisk_and_Layers_PRD_Final.docx) | Source `.docx` file for offline review |
| 🗂️ **PRD Directory** | [**prd/**](./prd/) | Contains complete PRD assets, versions, and Technical Appendix |

### Key PRD Highlights
- **12 Comprehensive Sections**: Executive Summary, Problem Framing, Proto-Personas & JTBD, Product Vision & Metrics, End-to-End User Journeys, Scope Boundaries, Functional Requirements & Acceptance Criteria, Order State Machine, Non-Functional Requirements, Operational Policies, Roadmap, and Reference Traceability.
- **Evidence-Led Governance**: Strictly distinguishes verified code implementations and local automated test passes from simulated prototype behaviors and unvalidated hypotheses.
- **Relational Data Specs & State Machine**: Full specification for 8-state order progression (`PENDING` ➔ `DELIVERED`), single-bakery cart isolation rules, advance lead-time protections, and mandatory rejection logging.

---

## 🔑 Demo & Evaluation Accounts

A convenient **1-Click Demo Switcher Bar** is pinned to the top of the header in development mode for instant evaluator access without manual typing:

| Role | Email | Password | Details |
|---|---|---|---|
| **Customer** | `customer@whiskandlayers.com` | `Customer123!` | Aditya Nair (Has active, delivered, and custom orders) |
| **Bakery Owner** | `sweetcrust@whiskandlayers.com` | `Bakery123!` | The Whisk House (5.0★, Ahmedabad) |
| **Bakery Owner 2**| `cocoabloom@whiskandlayers.com`| `Bakery123!` | Cocoa & Bloom Studio (4.9★, Mumbai) |
| **Admin** | `admin@whiskandlayers.com` | `Admin123!` | Platform Administrator |

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 6
- **3D Graphics Engine**: Three.js (WebGL OrbitControls, multi-tier geometry, lighting, particle candle flames)
- **Routing**: React Router 6 with Role Guards (`RequireAuth`, `RequireRole`)
- **Icons**: Lucide React
- **Design System**: Warm artisan bakery CSS tokens (`Playfair Display` serif headings + `Plus Jakarta Sans` UI body)

### Backend
- **Runtime**: Node.js v20+ with TypeScript
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
│   │   │   ├── layout/          # Navbar, Footer, ScrollToTop, Layouts
│   │   │   └── ui/              # Cake3DViewer, StatusBadge, OrderTimeline, StarRating
│   │   ├── context/             # AuthContext, CartContext, ToastContext, NotifContext
│   │   ├── pages/
│   │   │   ├── customer/        # Landing, Bakeries, Cakes, Studio, Cart, Checkout, Profile
│   │   │   ├── bakery/          # Dashboard, Orders, Cakes, Reviews, Profile
│   │   │   ├── admin/           # Dashboard, Bakeries, Users, Orders
│   │   │   └── auth/            # Login, Register
│   │   ├── services/            # Frontend API client & MockDataStore
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
# Seed 18+ Indian artisan bakeries and 24 users:
npm run seed --workspace=backend

# Start backend (Port 5000) and frontend (Port 5173) concurrently:
npm run dev
```

---

## 🧪 Running Automated Tests

Run the backend integration and security test suite:

```bash
npm run test
```

---

## 🌐 API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System health & uptime |
| `POST` | `/api/auth/register` | Public | Register Customer or Bakery |
| `POST` | `/api/auth/login` | Public | Sign in & receive JWT |
| `GET` | `/api/auth/me` | Authenticated | Current user profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update user profile, photo, bio, addresses, celebrations |
| `GET` | `/api/bakeries` | Public | Search & list 18+ artisan bakeries |
| `GET` | `/api/bakeries/:idOrSlug` | Public | Bakery storefront & reviews |
| `PUT` | `/api/bakeries/my-bakery` | Bakery | Update bakery profile |
| `GET` | `/api/cakes` | Public | Cake catalog with filters |
| `POST` | `/api/cakes` | Bakery | Add new cake listing |
| `GET` | `/api/customizations/options` | Public | Custom studio options |
| `POST` | `/api/orders` | Customer | Place order with functional payments (UPI/Card/NetBanking/COD) |
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
