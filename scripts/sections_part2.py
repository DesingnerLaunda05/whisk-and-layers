"""
Whisk & Layers PRD - Part 2: Sections 11 through 20
Author: Aditya Nair | Senior Product Manager
"""

from docx.shared import Inches, Pt, RGBColor
from prd_builder_utils import (
    add_h1, add_h2, add_h3, add_p, add_bullet, add_callout, add_table_component,
    COLOR_PRIMARY_DARK, COLOR_ACCENT, COLOR_BG_LIGHT, COLOR_BG_ALT, COLOR_WARNING, COLOR_SUCCESS
)

def build_part2(doc):
    # =========================================================================
    # SECTION 11: END-TO-END USER JOURNEYS
    # =========================================================================
    add_h1(doc, "11. End-to-End User Journeys")
    
    add_p(doc, "To ensure cohesive cross-functional alignment between engineering, design, and merchant operations, the three primary platform user journeys are mapped below.")
    
    add_h2(doc, "11.1 Customer End-to-End Journey")
    add_p(doc, "The customer journey guides celebration planners through discovery, customized composition, validated booking, and transparent post-delivery engagement:")
    add_table_component(doc, ["Stage", "User Mindset & Actions", "System Touchpoints & Data", "Emotional Sentiment"], [
        ["1. Discovery & Search", "Visitor lands on Whisk & Layers seeking a special cake for an upcoming birthday; filters bakeries by city (Ahmedabad) or browses signature recipes.", "Landing page hero, Bakery card grid, Specialty tags, City filter pills, Star rating indicators.", "Curious, inspired, searching for quality."],
        ["2. Evaluation & Selection", "Views bakery storefront or clicks a signature cake detail page; inspects ingredients, kitchen lead time (e.g. 2 days), eggless options, and verified reviews.", "Bakery detail page (`/bakeries/:slug`), Cake detail page (`/cakes/:id`), Photo gallery, Lead-time badge.", "Reassured by kitchen credibility and ratings."],
        ["3. Custom Studio / Build", "Enters interactive 8-step builder; selects sponge base, gourmet filling, weight in Kg, shape, icing, toppings, decor style, and types custom piped inscription.", "8-step Custom Cake Studio (`/custom-builder`), Live INR price counter, Blueprint preview summary card.", "Empowered, creative, confident in upfront pricing."],
        ["4. Cart Isolation & Review", "Adds custom creation or pre-built signature to cart; reviews item subtotal, flat ₹80 delivery fee, 5% GST, and delivery date availability.", "Cart page (`/cart`), Single-bakery collision validation guard, Lead-time validation engine.", "Clarity, no hidden fees."],
        ["5. Checkout & Booking", "Enters 10-digit Indian mobile number (+91), structured street address, 6-digit PIN code, selects delivery date & time slot, chooses payment method.", "Checkout page (`/checkout`), Zod address/phone validator, Date picker enforcing `minimum_lead_days`.", "Excited, booking confirmed."],
        ["6. Kitchen Review & Decision", "Receives order confirmation (`PENDING`); waits for bakery to review order specifications against kitchen oven capacity.", "Order confirmation page (`/order-confirmation/:id`), In-app notification bell, Real-time status polling.", "Expectant, awaiting kitchen confirmation."],
        ["7. Milestone Reassurance", "Bakery accepts order; customer monitors progress as it shifts from `ACCEPTED` to `PREPARING` to `READY` to `OUT_FOR_DELIVERY`.", "Order detail page (`/orders/:id`), Visual step timeline, Direct bakery contact phone link.", "Calm, reassured, excitement building."],
        ["8. Delivery & Verified Review", "Cake arrives in temperature-controlled packaging; customer celebrates occasion and submits a verified 1-to-5 star rating with text review.", "Review modal on delivered order page, Star rating component, Backend review persistence.", "Delighted, vocal brand advocate."]
    ], col_widths=[1.2, 1.8, 2.1, 1.57])

    add_h2(doc, "11.2 Bakery Merchant End-to-End Journey")
    add_p(doc, "The bakery journey structures production scheduling, recipe management, and customer feedback into an efficient commercial hub:")
    add_table_component(doc, ["Stage", "Merchant Actions", "System Mechanism & Controls", "Business Outcome"], [
        ["1. Onboarding & Profile", "Registers bakery account; configures brand name, bio, kitchen address, PIN code, contact mobile, and default `minimum_lead_days`.", "Bakery registration form (`/register`), Merchant profile editor (`/bakery/profile`), Geolocation tags.", "Active merchant storefront live on marketplace."],
        ["2. Catalog Setup", "Adds signature cakes; uploads high-res photography, assigns categories, sets base INR prices, and toggles customizability and availability.", "Cake management portal (`/bakery/cakes`), Image upload controller (Multer/static uploads), Category mapper.", "Comprehensive, searchable digital cake menu."],
        ["3. Order Receipt & Review", "Receives real-time alert for new pending order; inspects custom blueprint, delivery date, time slot, and inscription text.", "Bakery dashboard (`/bakery/dashboard`), Urgent pending orders tab (`/bakery/orders?status=PENDING`).", "Immediate visibility of upcoming baking workload."],
        ["4. Acceptance / Rejection", "Accepts order to commit kitchen capacity, or rejects with mandatory logged reason if fully booked or out of stock.", "Status PATCH endpoint (`/api/orders/:id/status`), Mandatory reason validation (min 5 chars).", "Guaranteed kitchen capacity protection; zero false promises."],
        ["5. Milestone Execution", "Progresses order through kitchen milestones as bakers start mixing (`PREPARING`), box the finished cake (`READY`), and dispatch.", "One-click milestone advancement buttons in dashboard order card.", "Zero customer phone calls during busy baking shifts."],
        ["6. Reputation & Feedback", "Reviews customer ratings and writes public bakery replies to build customer trust and loyalty.", "Bakery reviews management portal (`/bakery/reviews`), Public reply POST API.", "Stronger search ranking and higher repeat orders."]
    ], col_widths=[1.3, 1.8, 2.0, 1.57])

    add_h2(doc, "11.3 Platform Operations Admin Journey")
    add_p(doc, "The administrator oversees platform ecosystem health, merchant catalog compliance, and user governance:")
    add_bullet(doc, "1. Merchant Moderation:", "Admin reviews newly registered bakeries in `/admin/bakeries`, verifying physical kitchen legitimacy and hygiene standards before activating storefronts.")
    add_bullet(doc, "2. Platform Ecosystem Health:", "Admin monitors high-level GMV in INR, global order volume, active customer counts, and bakery acceptance rates in `/admin/dashboard`.")
    add_bullet(doc, "3. Global Order & Dispute Monitoring:", "Admin accesses global order stream in `/admin/orders` to observe pending order turnaround times and intervene on overdue orders.")

    # =========================================================================
    # SECTION 12: INFORMATION ARCHITECTURE (IA)
    # =========================================================================
    add_h1(doc, "12. Information Architecture (IA)")
    
    add_p(doc, "Whisk & Layers is organized into three segregated routing domains protected by stateless JWT role guards (`RequireAuth` and `RequireRole`):")
    
    add_callout(doc, "Information Architecture Hierarchy Tree", [
        "WHISK & LAYERS MARKETPLACE ROOT (/)",
        "├── 1. PUBLIC & CUSTOMER DOMAIN",
        "│   ├── Landing Page (/) [Hero, Features, Top Bakeries, Signature Cakes, Categories, FAQ]",
        "│   ├── Bakery Directory (/bakeries) [Search, City Filter, Sort by Rating/Lead-Time]",
        "│   ├── Bakery Storefront (/bakeries/:slug) [Bio, Address, Lead-time Notice, Cake Grid, Reviews]",
        "│   ├── Cake Catalog (/cakes) [Search, Category Tabs, Price Range Slider, Eggless Filter]",
        "│   ├── Cake Detail (/cakes/:id) [Gallery, Ingredients, Price, Inscription Note, Add to Cart]",
        "│   ├── 8-Step Custom Studio (/custom-builder) [Sponge, Flavor, Kg, Shape, Icing, Topping, Decor, Note]",
        "│   ├── Shopping Cart (/cart) [Single-Bakery Isolation, Item Counter, Fee Breakdown, Lead Check]",
        "│   ├── Checkout (/checkout) [Indian Phone, Address, PIN, Delivery Date & Time Slot, Payment Mode]",
        "│   ├── Order Confirmation (/order-confirmation/:id) [Order Number, Summary, Tracking Link]",
        "│   ├── Order History (/my-orders) [Active vs Completed Orders, Status Badges]",
        "│   ├── Order Milestone Tracker (/orders/:id) [Progress Timeline, Snapshot Specs, Review Modal]",
        "│   └── Customer Profile (/profile) [Personal Info, Contact Phone, Saved Delivery Addresses]",
        "│",
        "├── 2. BAKERY MERCHANT DOMAIN (Guarded: Role == BAKERY)",
        "│   ├── Merchant Dashboard (/bakery/dashboard) [Pending Orders, Production Stats, Revenue in ₹]",
        "│   ├── Order Management (/bakery/orders) [Tabbed Views: Pending, Active, Completed, Cancelled]",
        "│   ├── Cake Catalog Manager (/bakery/cakes) [List, Toggle Active, Add New, Edit Recipe/Price]",
        "│   ├── Add / Edit Cake (/bakery/cakes/new, /edit/:id) [Form, Image Upload, Category, Custom Toggle]",
        "│   ├── Customer Reviews (/bakery/reviews) [Delivered Feedback, Post Merchant Reply]",
        "│   └── Storefront Settings (/bakery/profile) [Brand Name, Logo, Address, PIN, Min Lead Days]",
        "│",
        "└── 3. PLATFORM ADMIN CONSOLE (Guarded: Role == ADMIN)",
        "    ├── Executive Dashboard (/admin/dashboard) [Global GMV, User Counts, Order Volume]",
        "    ├── Merchant Governance (/admin/bakeries) [Bakery Verification, Storefront Status Toggles]",
        "    ├── User Management (/admin/users) [Customer & Merchant Accounts, Role Audit, Account Lock]",
        "    └── Global Orders Stream (/admin/orders) [Universal Order Stream, Status Auditing]"
    ])

    # =========================================================================
    # SECTION 13: CORE USER FLOWS & LOGIC SPECIFICATIONS
    # =========================================================================
    add_h1(doc, "13. Core User Flows & Logic Specifications", page_break=True)
    
    add_p(doc, "The following 12 user flows detail the step-by-step logic, validation checkpoints, and exception states executed across the application.")
    
    flows = [
        ("Flow 1: Customer Onboarding & Authentication",
         "Trigger: User clicks 'Sign In' or enters checkout unauthenticated.",
         "1. User navigates to `/login` or `/register`.\n2. Submits full name, email, password, and 10-digit Indian mobile number (+91).\n3. Frontend validates format using regex (`/^[6-9]\\d{9}$/`).\n4. Backend `AuthService` verifies email uniqueness in SQLite `users` table; returns 400 error if email exists.\n5. Hashes password using Bcrypt (salt rounds 10) and inserts user record.\n6. Signs stateless JWT payload `{ userId, role: 'CUSTOMER' }` with 7-day expiration.\n7. Frontend stores token in `localStorage` and sets React `AuthContext` state.",
         "Success: Authenticated session established; redirected to intended route or dashboard."),

        ("Flow 2: Bakery Discovery & Geospatial / Category Filtering",
         "Trigger: Customer seeks local artisan bakeries.",
         "1. User navigates to `/bakeries`.\n2. System fetches all active and approved bakeries via `GET /api/bakeries`.\n3. User applies city filter (e.g. 'Ahmedabad', 'Vadodara') or specialty tag (e.g. 'French Patisserie').\n4. Dynamic UI updates bakery cards displaying logo, tagline, rating stars, and minimum lead time notice.\n5. User clicks bakery card to navigate to `/bakeries/:slug`.",
         "Success: Targeted local bakery storefront rendered with full menu."),

        ("Flow 3: Pre-Built Signature Cake Selection",
         "Trigger: Customer browses standard signature bakery cakes.",
         "1. User navigates to `/cakes` or views cakes tab on bakery page.\n2. Filters by category ('Signature Celebration', 'Cheesecakes & Tortes', 'Indian Fusion').\n3. Clicks cake card to open `/cakes/:id`.\n4. Page displays high-resolution photography, base INR price, eggless badge, ingredients, and preparation days.\n5. User selects quantity and optionally enters celebration inscription text (e.g. 'Happy 25th Anniversary').\n6. Clicks 'Add to Cart'.",
         "Success: Item staged in CartContext; toast notification confirms addition."),

        ("Flow 4: Interactive 8-Step Custom Cake Studio",
         "Trigger: Customer wants to compose a bespoke cake from scratch.",
         "1. User navigates to `/custom-builder`.\n2. System fetches options via `GET /api/customizations/options`, grouped by category.\n3. Step 1 (Base): Chooses sponge base (Vanilla, Dutch Dark Chocolate, Ruby Cocoa, Kesar Elaichi).\n4. Step 2 (Flavor): Chooses gourmet filling (Belgian Truffle, Royal Rasmalai, Biscoff, Alphonso Mango).\n5. Step 3 (Size): Selects metric weight (0.5 Kg, 1.0 Kg, 1.5 Kg, 2.0 Kg, 3.0 Kg 2-Tier).\n6. Step 4 (Shape): Selects architectural shape (Round, Heart, Square, Arch).\n7. Step 5 (Icing): Selects frosting (Whipped Cream, Belgian Ganache, Cream Cheese, Buttercream).\n8. Step 6 (Toppings): Selects toppings (Dry Fruits & Saffron, Fresh Fruits, Belgian Curls, Macarons).\n9. Step 7 (Decor): Selects styling (Lambeth Scrollwork, 24K Edible Gold Leaf, Minimal Florals).\n10. Step 8 (Details): Types custom inscription message (max 60 chars) and selects fulfilling bakery.\n11. Step 9 (Blueprint): System computes dynamic price: Base Price + Sum(Option Extra Prices).\n12. Clicks 'Add Custom Cake to Cart'.",
         "Success: Custom item created with JSON snapshot of selected options and added to cart."),

        ("Flow 5: Cart Management & Single-Bakery Lead Enforcement",
         "Trigger: Customer reviews staged items in `/cart`.",
         "1. User navigates to `/cart`.\n2. System checks bakery provenance across cart items.\n3. If user attempts to add an item from Bakery B while cart contains items from Bakery A, modal alerts: 'Clear cart to switch bakeries?'.\n4. System computes subtotal, flat delivery fee (₹80), and GST (5%).\n5. Evaluates items' `preparation_days` and bakery's `minimum_lead_days` to determine earliest allowable delivery date.\n6. User clicks 'Proceed to Checkout'.",
         "Success: Validated cart state passed to checkout pipeline."),

        ("Flow 6: Indian Address & Date Selection Checkout",
         "Trigger: Customer initiates order placement.",
         "1. User navigates to `/checkout` (requires active authentication).\n2. Enters Recipient Name and 10-digit Mobile Number.\n3. Fills Flat/House No., Street/Area, Landmark, City, Indian State dropdown, and 6-digit PIN Code.\n4. Date picker opens with unserviceable dates disabled (min selectable date = Today + `minimum_lead_days`).\n5. Selects Delivery Time Slot (Morning 9-12, Afternoon 12-4, Evening 4-8).\n6. Selects Payment Method ('Pay on Delivery', 'Instant UPI QR', 'NetBanking / Cards').\n7. Clicks 'Place Order'.",
         "Success: Form validated via Zod schema; order payload dispatched to backend."),

        ("Flow 7: Order Placement & DB Persistence",
         "Trigger: Backend receives `POST /api/orders`.",
         "1. `OrderService` validates payload against `createOrderSchema`.\n2. Recalculates item subtotals and checks database prices to prevent client tampering.\n3. Generates unique order number: `ORD-YYYYMMDD-XXXX`.\n4. Begins SQLite transaction: inserts order header into `orders`, inserts order items into `order_items`.\n5. Creates notification record in `notifications` table for the bakery user.\n6. Commits transaction and returns 201 Created with order payload.\n7. Frontend clears cart and redirects to `/order-confirmation/:id`.",
         "Success: Order persisted in database in `PENDING` state; confirmation rendered."),

        ("Flow 8: Bakery Order Review & Acceptance Flow",
         "Trigger: Bakery merchant opens dashboard.",
         "1. Bakery navigates to `/bakery/orders?status=PENDING`.\n2. Inspects order card: customer name, delivery date, time slot, delivery address, custom blueprint options, and inscription text.\n3. Checks kitchen production capacity for the requested date.\n4. Clicks 'Accept Order'.\n5. Frontend sends `PATCH /api/orders/:id/status` with body `{ status: 'ACCEPTED' }`.\n6. Backend verifies merchant owns the order, updates status to `ACCEPTED`, logs timestamp, and notifies customer.",
         "Success: Order moves to active production queue; customer sees status updated to `ACCEPTED`."),

        ("Flow 9: Bakery Order Rejection Flow (Mandatory Reason)",
         "Trigger: Bakery cannot fulfill requested order.",
         "1. Bakery merchant clicks 'Decline Order' on pending order card.\n2. Modal prompt opens requiring mandatory rejection reason (min 5 characters).\n3. Merchant enters reason (e.g. 'Kitchen fully booked for wedding cakes on requested date').\n4. Submits form; frontend sends `PATCH /api/orders/:id/status` with `{ status: 'REJECTED', rejectionReason: '...' }`.\n5. Backend enforces `rejectionReason` presence; updates status to `REJECTED` and persists explanation.\n6. Customer order view immediately updates with clear reason explanation.",
         "Success: Order cleanly closed with audit trail; customer informed without confusion."),

        ("Flow 10: Stage-by-Stage Order Milestone Tracking",
         "Trigger: Bakery executes baking stages.",
         "1. As baking begins, merchant clicks 'Start Baking' ➔ status transitions to `PREPARING`.\n2. When decorated and chilled, merchant clicks 'Mark Boxed & Ready' ➔ status transitions to `READY`.\n3. When handed to delivery courier, clicks 'Dispatch' ➔ status transitions to `OUT_FOR_DELIVERY`.\n4. Upon delivery confirmation, clicks 'Confirm Delivered' ➔ status transitions to `DELIVERED`.\n5. Customer viewing `/orders/:id` sees progress bar advance stage-by-stage with active green badges.",
         "Success: Real-time milestone visibility achieved across both parties."),

        ("Flow 11: Bakery Cake Catalog Management",
         "Trigger: Bakery adds or updates a cake listing.",
         "1. Merchant navigates to `/bakery/cakes` and clicks 'Add New Cake'.\n2. Fills Name, Category, Description, Base Price in INR, Preparation Lead Days, and Image URL or file.\n3. Toggles 'Customizable' flag if custom sizing/decor apply.\n4. Submits form; backend validates data and inserts record into `cakes` table linked to `bakery_id`.\n5. Cake becomes instantly discoverable on public customer catalog.",
         "Success: Product catalog updated dynamically."),

        ("Flow 12: Verified Customer Review & Merchant Reply",
         "Trigger: Customer receives delivered cake (`status == 'DELIVERED'`).",
         "1. Customer navigates to `/orders/:id`.\n2. System detects order is `DELIVERED` and has no existing review; renders 'Leave a Verified Review' button.\n3. Customer selects star rating (1 to 5) and writes feedback comments.\n4. Submits `POST /api/reviews`; backend verifies customer owns delivered order and enforces single review constraint.\n5. Review appears on public bakery storefront with 'Verified Purchase' badge.\n6. Bakery views review in `/bakery/reviews` and posts a public thank-you reply.",
         "Success: Verified social proof recorded; merchant customer relationship deepened.")
    ]
    
    for title, trigger, steps, outcome in flows:
        add_h2(doc, title)
        add_p(doc, f"**Trigger:** {trigger}")
        add_p(doc, f"**Execution Steps:**\n{steps}")
        add_p(doc, f"**Outcome & State Change:** {outcome}")

    # =========================================================================
    # SECTION 14: PRODUCT SCOPE & RELEASE BOUNDARIES
    # =========================================================================
    add_h1(doc, "14. Product Scope & Release Boundaries")
    
    add_p(doc, "To ensure relentless product focus and prevent scope creep, feature sets are strictly partitioned across MVP Implemented, Post-MVP, and Future Vision phases.")
    
    scope_headers = ["Domain / Capability", "MVP (Current Live State)", "Phase 2 (Post-MVP)", "Phase 3 & 4 (Future Vision)"]
    scope_rows = [
        ["User Identity & Access", "JWT auth, roles (`CUSTOMER`, `BAKERY`, `ADMIN`), Bcrypt hashing, session persistence.", "Google OAuth2 / Apple Sign-In, OTP SMS phone login.", "Enterprise Single Sign-On (SSO) for corporate gifting accounts."],
        ["Bakery Discovery", "Public catalog, city filtering (Ahmedabad, Mumbai, etc.), specialty tags, ratings.", "Geolocation radius search (e.g. within 10 km), open/closed kitchen hours toggle.", "Map-based polygon delivery boundaries, algorithmic ranking."],
        ["Cake Customization", "8-step Custom Studio with locked base tokens and dynamic INR price counter.", "Reference photo upload for artisanal piping inspection, multi-tier preview.", "Interactive 3D WebGL / AR cake preview on table surface."],
        ["Cart & Checkout", "Single-bakery cart, lead-time date check, Indian address, flat delivery & 5% GST.", "Coupon codes, gift message cards, scheduled midnight delivery slots.", "Multi-bakery split cart checkout with staggered courier dispatch."],
        ["Payments & Invoicing", "Pay on Delivery, UPI QR intent, Card/NetBanking placeholders.", "Live Razorpay / Cashfree SDK integration with automated merchant split settlement.", "Wallet balances, corporate invoicing with GST input tax credit."],
        ["Order Fulfillment", "7-stage state machine (`PENDING` to `DELIVERED`), mandatory rejection reason logging.", "Automated WhatsApp Business notifications, customer cancellation window.", "Live third-party 3PL delivery API integration (Dunzo, Porter, Shadowfax)."],
        ["Customer Feedback", "Verified star ratings and text reviews restricted to delivered orders; merchant replies.", "Customer photo upload in reviews, photo upvoting.", "AI review sentiment summarization and kitchen quality alerts."]
    ]
    add_table_component(doc, scope_headers, scope_rows, col_widths=[1.5, 1.8, 1.7, 1.67])

    # =========================================================================
    # SECTION 15: DETAILED FEATURE SPECIFICATIONS & REQUIREMENTS
    # =========================================================================
    add_h1(doc, "15. Detailed Feature Specifications & Requirements")
    
    add_p(doc, "Below are detailed Product Requirements Document (PRD) specifications for the core functional pillars of Whisk & Layers. Each feature includes user stories, functional requirements, Gherkin acceptance criteria (Given/When/Then), edge cases, error states, and measurable success targets.")
    
    # Feature FR-001
    add_h2(doc, "15.1 Feature FR-001: Customer Identity & JWT Authentication")
    add_p(doc, "**User Story:** As a celebration customer, I want to securely register and log in using my email and Indian mobile number, so that I can manage my custom cake orders and view delivery history.")
    add_p(doc, "**Functional Requirements:**")
    add_bullet(doc, "FR-001.1:", "System must enforce email uniqueness across the `users` table.")
    add_bullet(doc, "FR-001.2:", "Password must meet complexity rules (minimum 6 characters, mixed case, alphanumeric).")
    add_bullet(doc, "FR-001.3:", "Indian phone numbers must match 10-digit mobile regex (`/^[6-9]\\d{9}$/`) and normalize to `+91` format.")
    add_bullet(doc, "FR-001.4:", "Passwords must be salted and hashed via Bcrypt before database persistence.")
    add_bullet(doc, "FR-001.5:", "Successful login must issue a signed JWT token containing `userId` and `role` with 7-day TTL.")
    add_p(doc, "**Acceptance Criteria (Gherkin):**")
    add_callout(doc, "Gherkin Acceptance Criteria - FR-001", [
        "**Scenario 1: Successful Customer Registration**",
        "Given a visitor is on `/register` with role 'CUSTOMER',",
        "When they submit valid email 'newuser@whisk.com', password 'Secure123!', and mobile '9876543210',",
        "Then the system creates a user record in `users`,",
        "And issues a signed JWT token returning HTTP 201 with safe user payload (excluding password hash).",
        "",
        "**Scenario 2: Duplicate Email Attempt**",
        "Given an existing user with email 'customer@whiskandlayers.com',",
        "When another user attempts registration with the same email,",
        "Then the system rejects registration with HTTP 400 and message 'An account with this email address already exists.'."
    ])
    add_p(doc, "**Edge Cases & Error Handling:** Network drop during token refresh falls back to login redirect with preserved return URL. Invalid JWT returns 401 Unauthorized with token wipe.")
    add_p(doc, "**Success Metric (Target KPI):** Registration completion rate > 85%; authentication latency P95 < 200ms.")

    # Feature FR-004
    add_h2(doc, "15.2 Feature FR-004: Interactive 8-Step Custom Cake Studio")
    add_p(doc, "**User Story:** As a celebration customer, I want to build a bespoke cake step-by-step with real-time price updates and visual configuration blueprints, so that I can order exactly what I want without back-and-forth negotiation.")
    add_p(doc, "**Functional Requirements:**")
    add_bullet(doc, "FR-004.1:", "System must fetch options from `customization_options` table grouped into: BASE, FLAVOR, SIZE, SHAPE, ICING, TOPPING, DECORATION.")
    add_bullet(doc, "FR-004.2:", "Weight sizes must be explicitly displayed in Kilograms (0.5 Kg, 1.0 Kg, 1.5 Kg, 2.0 Kg, 3.0 Kg).")
    add_bullet(doc, "FR-004.3:", "System must calculate total price dynamically: Base Recipe Price + Sum of Selected Option Surcharges.")
    add_bullet(doc, "FR-004.4:", "Step 8 must provide a validated text box for hand-lettered celebration inscriptions (max 60 characters).")
    add_bullet(doc, "FR-004.5:", "Customer must select an approved fulfilling bakery from the active bakery list before cart addition.")
    add_p(doc, "**Acceptance Criteria (Gherkin):**")
    add_callout(doc, "Gherkin Acceptance Criteria - FR-004", [
        "**Scenario 1: Real-Time Pricing Calculation**",
        "Given the customer selects Dutch Chocolate Base (₹600), Belgian Truffle Filling (+₹150), and 1.5 Kg Size (+₹400),",
        "When the builder renders the summary card,",
        "Then the live price counter displays exactly ₹1,150 before taxes,",
        "And updates instantly if the customer changes size or flavor.",
        "",
        "**Scenario 2: Inscription Message Boundary**",
        "Given the customer enters an inscription message,",
        "When the character length exceeds 60 characters,",
        "Then the input field prevents further typing and displays a character counter warning."
    ])
    add_p(doc, "**Edge Cases & Error Handling:** If a selected bakery becomes inactive during builder flow, system displays warning prompt allowing customer to reassign custom blueprint to another bakery.")
    add_p(doc, "**Success Metric (Target KPI):** Studio step-completion rate > 65%; custom builder to cart addition conversion > 40%.")

    # Feature FR-005 & FR-006
    add_h2(doc, "15.3 Feature FR-005 & FR-006: Cart Isolation & Advance Lead-Time Checkout")
    add_p(doc, "**User Story:** As a customer, I want my cart to protect delivery viability and enforce bakery preparation times, so that my cake arrives freshly baked on my celebration date.")
    add_p(doc, "**Functional Requirements:**")
    add_bullet(doc, "FR-005.1:", "Cart must enforce single-bakery origin; adding an item from a different bakery prompts a clear cart replacement modal.")
    add_bullet(doc, "FR-005.2:", "System must compute: Subtotal + Flat Delivery (₹80) + 5% GST.")
    add_bullet(doc, "FR-006.1:", "Checkout date picker must block all dates earlier than `Today + bakery.minimum_lead_days`.")
    add_bullet(doc, "FR-006.2:", "Address must require: Recipient Name, 10-digit Indian Mobile, Street/Area, City, State, and 6-digit PIN Code.")
    add_p(doc, "**Acceptance Criteria (Gherkin):**")
    add_callout(doc, "Gherkin Acceptance Criteria - FR-005 & FR-006", [
        "**Scenario 1: Lead-Time Violation Blocking**",
        "Given Bakery 'Whisk House' requires `minimum_lead_days = 2`,",
        "When a customer attempts to select tomorrow's date for delivery,",
        "Then the date picker disables that date and displays 'Bakery requires at least 2 days advance notice for handcrafted preparation.'.",
        "",
        "**Scenario 2: Single-Bakery Cart Isolation**",
        "Given the cart contains a cake from 'Whisk House',",
        "When the customer clicks 'Add to Cart' on a cake from 'Sweet Crust Bakery',",
        "Then a dialog prompts: 'Your cart contains items from Whisk House. Replace cart items with this selection?'."
    ])
    add_p(doc, "**Edge Cases & Error Handling:** Customer submits an expired date by altering browser clock; backend re-validates `deliveryDate` against server time and rejects with 400 error.")
    add_p(doc, "**Success Metric (Target KPI):** Cart to checkout completion rate > 70%; zero lead-time booking conflicts.")

    # Feature FR-007 & FR-008
    add_h2(doc, "15.4 Feature FR-007 & FR-008: Bakery Order Review & Milestone Lifecycle")
    add_p(doc, "**User Story:** As a bakery owner, I want to review incoming custom cake specifications and accept or reject with a reason, and update milestone stages as we bake, so that production remains organized and customers stay informed.")
    add_p(doc, "**Functional Requirements:**")
    add_bullet(doc, "FR-007.1:", "Incoming orders must enter `PENDING` status and trigger in-app notification alerts for the bakery.")
    add_bullet(doc, "FR-007.2:", "Bakery must have authority to transition status to `ACCEPTED` or `REJECTED`.")
    add_bullet(doc, "FR-007.3:", "If `REJECTED` is selected, system must strictly enforce a non-empty `rejection_reason` (min 5 characters).")
    add_bullet(doc, "FR-008.1:", "Active accepted orders must transition through linear milestones: `ACCEPTED` ➔ `PREPARING` ➔ `READY` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`.")
    add_bullet(doc, "FR-008.2:", "Non-owner bakeries or unauthorized roles must be blocked with HTTP 403 Forbidden.")
    add_p(doc, "**Acceptance Criteria (Gherkin):**")
    add_callout(doc, "Gherkin Acceptance Criteria - FR-007 & FR-008", [
        "**Scenario 1: Mandatory Rejection Reason Enforcement**",
        "Given an incoming order is in `PENDING` status,",
        "When the bakery merchant attempts to decline without entering a reason,",
        "Then the backend rejects the request with HTTP 400 and message 'Rejection reason is required and must be at least 5 characters.',",
        "And the order remains in `PENDING` status.",
        "",
        "**Scenario 2: Legitimate Status Milestone Advance**",
        "Given an order is in `ACCEPTED` status,",
        "When the authorized bakery merchant clicks 'Start Baking',",
        "Then the order status updates to `PREPARING`, updates the `updated_at` timestamp, and notifies the customer."
    ])
    add_p(doc, "**Edge Cases & Error Handling:** Attempting to transition a `DELIVERED` or `REJECTED` order back to an earlier stage returns 400 Invalid State Transition.")
    add_p(doc, "**Success Metric (Target KPI):** Bakery order decision turnaround time < 4 hours; rejection rate < 8%.")

    # =========================================================================
    # SECTION 16: FUNCTIONAL REQUIREMENTS TRACEABILITY MATRIX
    # =========================================================================
    add_h1(doc, "16. Functional Requirements Traceability Matrix")
    
    add_p(doc, "The matrix below indexes all product functional requirements against their system priority, target user role, implementation status in the codebase, and verifying test routes.")
    
    fr_headers = ["ID", "Requirement Description", "Priority", "Role", "Codebase Status", "Implementation / Test Verification"]
    fr_rows = [
        ["FR-001", "Customer & Bakery JWT registration and login", "P0", "All", "Implemented", "`authRoutes.ts`, `api.test.ts` (Tests 2, 3)"],
        ["FR-002", "Bakery directory search and city filtering", "P0", "Customer", "Implemented", "`bakeryRoutes.ts`, `BakeriesPage.tsx`"],
        ["FR-003", "Pre-built cake catalog with category filtering", "P0", "Customer", "Implemented", "`cakeRoutes.ts`, `CakesPage.tsx`"],
        ["FR-004", "Interactive 8-step Custom Cake Studio with live INR price", "P0", "Customer", "Implemented", "`customizationRoutes.ts`, `CustomCakeBuilderPage.tsx`"],
        ["FR-005", "Single-bakery cart isolation and fee calculation", "P0", "Customer", "Implemented", "`CartContext.tsx`, `CartPage.tsx`"],
        ["FR-006", "Indian address, PIN code, and lead-time checkout", "P0", "Customer", "Implemented", "`CheckoutPage.tsx`, `api.test.ts` (Test 7)"],
        ["FR-007", "Bakery order acceptance and mandatory reason decline", "P0", "Bakery", "Implemented", "`orderRoutes.ts`, `api.test.ts` (Tests 7, 8, 9)"],
        ["FR-008", "Milestone lifecycle management (`PENDING` to `DELIVERED`)", "P0", "Bakery", "Implemented", "`orderService.ts`, `OrderTimeline.tsx`"],
        ["FR-009", "Verified customer star reviews and merchant replies", "P1", "Customer / Bakery", "Implemented", "`reviewRoutes.ts`, `BakeryReviewsPage.tsx`"],
        ["FR-010", "Bakery catalog management (Add, Edit, Price in ₹)", "P1", "Bakery", "Implemented", "`BakeryCakesPage.tsx`, `BakeryCakeEditPage.tsx`"],
        ["FR-011", "Bakery storefront settings and lead-day configuration", "P1", "Bakery", "Implemented", "`BakeryProfilePage.tsx`, `bakeryRepository.ts`"],
        ["FR-012", "Admin platform metrics console and bakery moderation", "P2", "Admin", "Implemented", "`adminRoutes.ts`, `AdminDashboardPage.tsx`"],
        ["FR-013", "In-app notifications for order state changes", "P1", "All", "Implemented", "`notificationRoutes.ts`, `NotificationContext.tsx`"],
        ["FR-014", "Dietary eggless visual badging and filter tags", "P1", "Customer", "Implemented", "`CakesPage.tsx`, `CakeDetailPage.tsx`"],
        ["FR-015", "Live Razorpay / Cashfree UPI payment gateway integration", "P1", "Customer", "Planned (Phase 2)", "Architectural mock ready (`PAY_ON_DELIVERY`, UPI QR)"],
        ["FR-016", "Automated WhatsApp Business API notifications", "P2", "All", "Planned (Phase 2)", "Webhook dispatch architecture designed"]
    ]
    add_table_component(doc, fr_headers, fr_rows, col_widths=[0.6, 2.0, 0.6, 0.9, 1.1, 1.47], text_size=8.5)

    # =========================================================================
    # SECTION 17: NON-FUNCTIONAL REQUIREMENTS (NFR)
    # =========================================================================
    add_h1(doc, "17. Non-Functional Requirements (NFR)", page_break=True)
    
    add_p(doc, "Non-functional requirements define the systemic quality attributes governing performance, security, reliability, scalability, and accessibility. Clear boundaries separate the **Current Production Baseline** from the **Recommended Scale Targets**.")
    
    nfr_headers = ["Category", "Metric / Attribute", "Current Baseline (Local / MVP)", "Production Scale Target (Phase 2)"]
    nfr_rows = [
        ["Performance", "API Endpoint Response Time", "P95 < 250ms on local SQLite disk", "P95 < 120ms with Redis caching layer"],
        ["Performance", "Frontend Initial Page Load", "FCP < 1.2s via Vite 6 code-splitting", "FCP < 0.8s on Cloudflare CDN edge"],
        ["Security", "Password Storage", "Bcrypt with 10 salt rounds", "Bcrypt with 12 salt rounds + Argon2 evaluation"],
        ["Security", "Authentication & Tokens", "Stateless JWT, HMAC-SHA256, 7-day TTL", "JWT (15-min TTL) + HttpOnly Refresh Token in Redis"],
        ["Security", "Input Sanitization", "Zod schemas filtering XSS / injection", "Zod + Cloudflare WAF + strict CSP headers"],
        ["Availability", "System Uptime", "Process managed via PM2 / Node", "99.9% multi-zone cloud deployment"],
        ["Scalability", "Concurrent Active Users", "Up to 200 concurrent users on Node", "10,000+ concurrent with horizontal container pods"],
        ["Data Integrity", "Relational Transactions", "SQLite ACID transactions with foreign keys", "PostgreSQL / MySQL with read replicas & backups"],
        ["Accessibility", "WCAG Conformance", "Semantic HTML5, contrast ratio > 4.5:1", "WCAG 2.1 AA certified with full screen-reader testing"],
        ["Responsiveness", "Viewport Adaptability", "Responsive CSS flex/grid (320px to 4K)", "Mobile-first PWA with offline order caching"]
    ]
    add_table_component(doc, nfr_headers, nfr_rows, col_widths=[1.2, 1.6, 1.9, 1.97])

    # =========================================================================
    # SECTION 18: BUSINESS RULES & POLICY ENGINE
    # =========================================================================
    add_h1(doc, "18. Business Rules & Policy Engine")
    
    add_p(doc, "Whisk & Layers enforces strict commercial and operational policies to protect culinary quality, merchant capacity, and platform trust:")
    
    add_bullet(doc, "BR-001 (Authentication Mandate):", "Browsing bakeries and building custom cakes is public; checkout and order submission strictly requires authenticated identity.")
    add_bullet(doc, "BR-002 (Bakery Catalog Ownership):", "A bakery user can only create, update, or deactivate cakes linked to their own `bakery_id`. Cross-merchant modification is blocked.")
    add_bullet(doc, "BR-003 (Order Isolation):", "A customer can only query and view orders where `customer_id == auth.userId`. Bakeries can only view orders where `bakery_id == auth.bakeryId`.")
    add_bullet(doc, "BR-004 (Advance Lead Time Calculation):", "The minimum allowable delivery date is mathematically enforced as: `MinDate = CurrentDate + bakery.minimum_lead_days`. Orders violating this are blocked at API validation.")
    add_bullet(doc, "BR-005 (Immutable Historical Pricing):", "When an order is created, item prices and snapshots are permanently stored in `order_items`. Future price adjustments in the bakery catalog do not alter historical orders.")
    add_bullet(doc, "BR-006 (Mandatory Rejection Audit):", "When a bakery declines an order, a non-empty `rejection_reason` (>= 5 chars) is mandatory. Unexplained rejections are technically blocked.")
    add_bullet(doc, "BR-007 (Verified Review Exclusivity):", "A customer can only submit a review if they placed the order, the order is in `DELIVERED` status, and no prior review exists for that `order_id`.")
    add_bullet(doc, "BR-008 (Single-Bakery Cart Integrity):", "A cart can only contain items from a single bakery to avoid multi-point delivery logistics failures.")
    add_bullet(doc, "BR-009 (GST & Delivery Fee Standards):", "Flat ₹80 delivery fee and 5% GST are automatically applied across all checkout calculations.")

    # =========================================================================
    # SECTION 19: ORDER STATE MACHINE & LIFECYCLE MANAGEMENT
    # =========================================================================
    add_h1(doc, "19. Order State Machine & Lifecycle Management")
    
    add_p(doc, "The lifecycle of an order on Whisk & Layers is governed by a strict deterministic state machine implemented in `orderService.ts` and validated via database check constraints (`CHECK(status IN (...))`).")
    
    add_callout(doc, "Order State Machine Flow Diagram", [
        "                     [ Customer Places Order ]",
        "                                 │",
        "                                 ▼",
        "                           ┌───────────┐",
        "                           │  PENDING  │",
        "                           └─────┬─────┘",
        "                    ┌────────────┴────────────┐",
        "                    ▼                         ▼",
        "             ┌─────────────┐           ┌─────────────┐",
        "             │  ACCEPTED   │           │  REJECTED   │ (With Mandatory Reason)",
        "             └──────┬──────┘           └─────────────┘",
        "                    ▼",
        "             ┌─────────────┐",
        "             │  PREPARING  │ (Mixing Sponge & Icing)",
        "             └──────┬──────┘",
        "                    ▼",
        "             ┌─────────────┐",
        "             │    READY    │ (Chilled, Boxed, QC Verified)",
        "             └──────┬──────┘",
        "                    ▼",
        "             ┌───────────────────┐",
        "             │ OUT_FOR_DELIVERY  │ (Handed to Fragile Courier)",
        "             └──────┬────────────┘",
        "                    ▼",
        "             ┌─────────────┐",
        "             │  DELIVERED  │ ──► [ Unlocks Verified Review Modal ]",
        "             └─────────────┘"
    ])
    
    osm_headers = ["Current State", "Trigger Event", "Next State", "Authorized Actor", "System Action & Side Effects"]
    osm_rows = [
        ["(None)", "Submit Checkout", "PENDING", "Customer", "Inserts `orders` & `order_items`, notifies bakery."],
        ["PENDING", "Accept Order", "ACCEPTED", "Bakery / Admin", "Commits kitchen capacity, updates `updated_at`, notifies customer."],
        ["PENDING", "Decline Order", "REJECTED", "Bakery / Admin", "Enforces `rejection_reason`, updates status, notifies customer."],
        ["ACCEPTED", "Start Baking", "PREPARING", "Bakery / Admin", "Advances milestone, indicates kitchen activity on timeline."],
        ["PREPARING", "Box & Finalize", "READY", "Bakery / Admin", "Confirms cake is boxed and ready for courier pickup."],
        ["READY", "Dispatch Courier", "OUT_FOR_DELIVERY", "Bakery / Admin", "Alerts customer that courier is en route."],
        ["OUT_FOR_DELIVERY", "Confirm Handover", "DELIVERED", "Bakery / Admin", "Closes fulfillment; unlocks verified review submission."],
        ["PENDING / ACCEPTED", "Cancel Order", "CANCELLED", "Admin / Support", "Operational override for customer cancellations."]
    ]
    add_table_component(doc, osm_headers, osm_rows, col_widths=[1.2, 1.2, 1.3, 1.1, 1.87])

    # =========================================================================
    # SECTION 20: DATA MODEL & ENTITY RELATIONSHIP SPECIFICATION
    # =========================================================================
    add_h1(doc, "20. Data Model & Entity Relationship Specification")
    
    add_p(doc, "The database architecture is built on a normalized relational schema defined in `backend/src/database/schema.ts`. Below are the primary entities, attributes, data types, constraints, and relational mappings.")
    
    dm_headers = ["Table Name", "Primary Entity", "Key Fields & Constraints", "Foreign Key Relationships"]
    dm_rows = [
        ["`users`", "Platform accounts", "`id` (PK), `email` (UQ), `password_hash`, `full_name`, `phone`, `role` ('CUSTOMER','BAKERY','ADMIN'), `is_active`.", "Referenced by `bakeries`, `orders`, `reviews`, `notifications`."],
        ["`bakeries`", "Bakery storefronts", "`id` (PK), `user_id` (UQ), `name`, `slug` (UQ), `address`, `city`, `state`, `postal_code`, `phone`, `minimum_lead_days`, `rating_avg`, `review_count`, `is_approved`.", "`user_id` REFERENCES `users(id)` ON DELETE CASCADE."],
        ["`cake_categories`", "Taxonomy categories", "`id` (PK), `name` (UQ), `slug` (UQ), `description`, `image_url`, `sort_order`.", "Referenced by `cakes`."],
        ["`cakes`", "Cake catalog recipes", "`id` (PK), `bakery_id`, `category_id`, `name`, `slug`, `base_price`, `preparation_days`, `image_url`, `is_customizable`, `is_available`.", "`bakery_id` REFERENCES `bakeries(id)`, `category_id` REFERENCES `cake_categories(id)`."],
        ["`customization_options`", "8-step builder tokens", "`id` (PK), `name`, `type` ('BASE','FLAVOR','SIZE','SHAPE','ICING','TOPPING','DECORATION'), `label`, `extra_price`, `sort_order`.", "Standalone reference library."],
        ["`orders`", "Order transaction header", "`id` (PK), `order_number` (UQ), `customer_id`, `bakery_id`, `total_amount`, `subtotal`, `delivery_fee`, `tax_amount`, `status`, `rejection_reason`, `delivery_address`, `delivery_date`, `payment_method`, `payment_status`.", "`customer_id` REFERENCES `users(id)`, `bakery_id` REFERENCES `bakeries(id)`."],
        ["`order_items`", "Order item line & snapshot", "`id` (PK), `order_id`, `cake_id`, `cake_name`, `base_price`, `quantity`, `subtotal`, `is_custom`, `custom_message`, `selected_options` (JSON text).", "`order_id` REFERENCES `orders(id)` ON DELETE CASCADE, `cake_id` REFERENCES `cakes(id)` ON DELETE SET NULL."],
        ["`reviews`", "Verified feedback", "`id` (PK), `order_id` (UQ), `customer_id`, `bakery_id`, `rating` (1-5), `comment`, `reply_comment`.", "`order_id` REFERENCES `orders(id)`, `customer_id` REFERENCES `users(id)`, `bakery_id` REFERENCES `bakeries(id)`."],
        ["`notifications`", "User in-app alerts", "`id` (PK), `user_id`, `type`, `title`, `message`, `link_url`, `is_read`.", "`user_id` REFERENCES `users(id)` ON DELETE CASCADE."]
    ]
    add_table_component(doc, dm_headers, dm_rows, col_widths=[1.5, 1.4, 2.3, 1.47], text_size=8.5)

print("Compiled PRD Part 2 successfully.")
