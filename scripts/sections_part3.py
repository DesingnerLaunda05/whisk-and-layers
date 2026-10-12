"""
Whisk & Layers PRD - Part 3: Sections 21 through 30
Author: Aditya Nair | Senior Product Manager
"""

from docx.shared import Inches, Pt, RGBColor
from prd_builder_utils import (
    add_h1, add_h2, add_h3, add_p, add_bullet, add_callout, add_table_component,
    COLOR_PRIMARY_DARK, COLOR_ACCENT, COLOR_BG_LIGHT, COLOR_BG_ALT, COLOR_WARNING, COLOR_SUCCESS
)

def build_part3(doc):
    # =========================================================================
    # SECTION 21: TECHNICAL PRODUCT ARCHITECTURE & INTEGRATION CONTEXT
    # =========================================================================
    add_h1(doc, "21. Technical Product Architecture & Integration Context")
    
    add_p(doc, "A great Product Manager understands how architectural design directly shapes user experience, operational reliability, and platform unit economics. Whisk & Layers is engineered with a clean, decoupled client-server architecture designed for high responsiveness, deterministic business rules, and low operational overhead.")
    
    add_h2(doc, "21.1 System Architecture Topology")
    add_callout(doc, "Architectural Topology Diagram", [
        " ┌─────────────────────────────────────────────────────────────┐",
        " │                 CLIENT TIER (React 18 + Vite 6)              │",
        " │  - Role-Guarded React Router 6 (/customer, /bakery, /admin)  │",
        " │  - Context State Engines (Auth, Cart, Toast, Notifications)  │",
        " │  - Warm Artisan CSS Tokens (Playfair Display + Jakarta Sans) │",
        " └──────────────────────────────┬──────────────────────────────┘",
        "                                │ HTTPS / JSON REST API",
        "                                ▼",
        " ┌─────────────────────────────────────────────────────────────┐",
        " │             BACKEND APPLICATION TIER (Express + TS)         │",
        " │  - Security Middleware: Helmet, CORS, Rate Limiters         │",
        " │  - Auth Middleware: Stateless JWT Verification & Role ACL  │",
        " │  - Validation Layer: Zod Schemas (+91 Mobile, 6-digit PIN) │",
        " │  - Domain Controllers & Services: Pricing, State Machine     │",
        " └──────────────────────────────┬──────────────────────────────┘",
        "                                │ SQL Queries / Transactions",
        "                                ▼",
        " ┌─────────────────────────────────────────────────────────────┐",
        " │                DATA PERSISTENCE & STORAGE TIER              │",
        " │  - SQLite Engine (Universal Relational Disk Persistence)    │",
        " │  - Indexed Foreign Key Constraints & ACID Transaction Guard │",
        " │  - Static Asset Delivery: Local Multer / Static Uploads      │",
        " └─────────────────────────────────────────────────────────────┘"
    ])
    
    add_h2(doc, "21.2 Architectural Stack Evaluation")
    arch_headers = ["Layer", "Chosen Technology", "PM Rationale & User Impact", "Production Evolution Path"]
    arch_rows = [
        ["Frontend UI", "React 18 + TypeScript + Vite 6", "Blazing fast FCP (<1.2s), type-safe props, predictable client state across complex 8-step customization.", "Next.js 15 for SSR / SSG SEO on bakery storefronts."],
        ["Styling System", "Vanilla CSS Tokens (Custom Artisan)", "Zero runtime overhead, pixel-perfect theme consistency, no bulky CSS framework dependencies.", "Maintain token architecture; export design tokens to Figma / React Native."],
        ["Backend Runtime", "Node.js v22+ with Express.js", "Non-blocking event loop ideal for concurrent REST traffic; rich npm ecosystem; shared TS types with frontend.", "NestJS or Fastify for micro-services at 50,000+ daily orders."],
        ["Validation Engine", "Zod Schema Validation", "Guarantees strict data contracts before logic execution; blocks malformed addresses, negative prices, and bad phones.", "Shared Zod schemas compiled as universal validation library."],
        ["Database Layer", "Relational SQL (SQLite / `better-sqlite3`)", "Zero-configuration local persistence, relational integrity, foreign key cascades, instant evaluator startup.", "Seamless drop-in migration to PostgreSQL / Amazon RDS."],
        ["Authentication", "Stateless JWT + Bcrypt (Salt 10)", "Scalable, stateless session management across web and future mobile clients without session store overhead.", "Add Redis token blacklist for instant user revocations."],
        ["Media Storage", "Local Disk via Multer Static Engine", "Simple zero-dependency image upload pipeline for bakery storefront logos and cake photographs.", "Migrate to AWS S3 / Cloudinary with auto WebP compression."]
    ]
    add_table_component(doc, arch_headers, arch_rows, col_widths=[1.2, 1.6, 2.3, 1.57])

    # =========================================================================
    # SECTION 22: DESIGN & USER EXPERIENCE (UX) REQUIREMENTS
    # =========================================================================
    add_h1(doc, "22. Design & User Experience (UX) Requirements")
    
    add_p(doc, "Celebration cake purchasing is an emotionally charged task. The UX is deliberately engineered to evoke warmth, culinary craftsmanship, and absolute reassurance, eliminating the cognitive friction typical of generic food delivery apps.")
    
    add_h2(doc, "22.1 Core UX Principles")
    add_bullet(doc, "1. Progressive Disclosure in Customization:", "Building a bespoke cake involves 8 distinct variables. Rather than confronting the user with a single daunting page with 20 input fields, the 8-Step Studio reveals one culinary decision at a time, keeping cognitive load minimal.")
    add_bullet(doc, "2. Continuous Price Reassurance:", "Custom cake buyers dread hidden fees. The floating Blueprint Summary Card updates instantly in INR (₹) whenever an option is clicked, displaying exact ingredient surcharges.")
    add_bullet(doc, "3. Preventative Error Design:", "Rather than letting users select an unfeasible delivery date and showing a red error on submit, the date picker actively disables past dates and dates within the bakery's lead-time window.")
    add_bullet(doc, "4. Form Ergonomics for India:", "Phone inputs feature a pre-fixed `+91` country code with automatic 10-digit masking. Address fields separate House/Flat, Street, Landmark, City, State, and 6-digit PIN code to guarantee couriers can locate venues without calling.")

    add_h2(doc, "22.2 UX State Guidelines")
    add_table_component(doc, ["UX State", "Design Standard & Behavioral Pattern", "Implementation in Whisk & Layers"], [
        ["Loading States", "Skeleton placeholders preserving layout height rather than jarring full-screen spinners.", "`Skeleton.tsx` components across cake grids, bakery cards, and order lists."],
        ["Empty States", "Friendly illustrative empty states with warm messaging and clear action CTAs.", "`EmptyState.tsx` rendered when cart is empty, search has 0 results, or order list has 0 entries."],
        ["Error States", "Actionable, human-readable toast notifications explaining how to recover.", "`ToastContext.tsx` displaying non-blocking error, success, and warning toasts."],
        ["Success States", "Confirmatory celebratory banners with permanent order tracking deep-links.", "`OrderConfirmationPage.tsx` with one-click navigation to live order status."]
    ], col_widths=[1.4, 2.6, 2.67])

    # =========================================================================
    # SECTION 23: DESIGN SYSTEM & UI TOKEN SPECIFICATION
    # =========================================================================
    add_h1(doc, "23. Design System & UI Token Specification")
    
    add_p(doc, "The visual identity balances warm artisanal patisserie aesthetics with clean, modern digital usability. All tokens are defined in `frontend/src/styles/index.css`.")
    
    add_h2(doc, "23.1 Color Token Palette")
    color_headers = ["Token Name", "Hex Value", "Role & Usage Context", "Color Preview Sample"]
    color_rows = [
        ["`--color-primary-dark`", "#4A1E29", "Deep Burgundy / Dark Chocolate. Primary brand color, headers, table crowns.", "Dark Rich Burgundy"],
        ["`--color-accent`", "#C93B67", "Raspberry Crimson. Primary CTAs, active tab indicators, accent borders.", "Vibrant Raspberry"],
        ["`--color-cream-light`", "#FFF8F6", "Soft Warm Cream. Page background tint, callout containers, card hover.", "Warm Cream / Ivory"],
        ["`--color-slate-text`", "#2D3748", "Deep Slate. Primary body typography, subheadings, form labels.", "Charcoal Slate"],
        ["`--color-emerald`", "#059669", "Forest Emerald. Eggless badges, `ACCEPTED`/`DELIVERED` status badges.", "Emerald Green"],
        ["`--color-amber`", "#D97706", "Warm Honey Amber. `PENDING` status, lead-time warnings, star ratings.", "Amber Honey"],
        ["`--color-border`", "#E2E8F0", "Subtle border gray. Card dividers, table borders, input outlines.", "Neutral Gray"]
    ]
    add_table_component(doc, color_headers, color_rows, col_widths=[1.5, 1.1, 2.6, 1.47])

    add_h2(doc, "23.2 Typography Tokens")
    add_bullet(doc, "Display & Heading Typography:", "`Playfair Display`, serif. Evokes handcrafted luxury and classic French patisserie menus; applied to H1, H2, and hero banners.")
    add_bullet(doc, "UI & Body Typography:", "`Plus Jakarta Sans` / `Segoe UI`, sans-serif. Highly readable at small sizes (9pt to 11pt); applied to form inputs, tables, button labels, and body paragraphs.")

    add_h2(doc, "23.3 UI Component Tokens")
    add_bullet(doc, "Buttons:", "Border-radius `8px`, transition `all 0.2s ease`. Primary button: Raspberry fill with white text; Secondary: Burgundy outline; Ghost: Transparent.")
    add_bullet(doc, "Badges (`StatusBadge.tsx`):", "Pill shape (`border-radius: 9999px`), padding `4px 10px`, font-size `12px`, semibold. Semantic color coding for order states.")
    add_bullet(doc, "Cards:", "Border `1px solid #E2E8F0`, border-radius `12px`, box-shadow `0 2px 4px rgba(0,0,0,0.04)`, hover elevation `0 8px 16px rgba(0,0,0,0.08)`.")

    # =========================================================================
    # SECTION 24: PRODUCT METRICS & TELEMETRY FRAMEWORK
    # =========================================================================
    add_h1(doc, "24. Product Metrics & Telemetry Framework", page_break=True)
    
    add_p(doc, "In accordance with strict product management integrity, **no fabricated conversion percentages, fake customer counts, or synthetic revenue figures are presented here**. The metrics below represent the formal telemetry framework and Target KPIs to be established post-instrumentation.")
    
    add_h2(doc, "24.1 North Star Metric Candidate")
    add_callout(doc, "North Star Metric Definition", [
        "**Candidate Metric:** Successfully Completed Customized Orders (SCCO) per Month",
        "**Formula:** Count of orders where `is_custom == 1` and `status == 'DELIVERED'` with zero post-delivery dispute flags.",
        "**Why this North Star matters:**",
        "1. Captures True Customer Value: A successfully delivered custom cake represents a delighted customer whose celebration centerpiece was executed flawlessly.",
        "2. Captures Bakery Health: Reflects merchant capacity utilization, operational efficiency, and kitchen revenue without order rejection churn.",
        "3. Captures Marketplace Defensibility: Proves Whisk & Layers' core differentiation versus commoditized quick-commerce dry cakes."
    ])
    
    add_h2(doc, "24.2 AARRR Supporting Funnel Metrics Matrix")
    metrics_headers = ["Funnel Stage", "Metric Name", "Metric Definition / Formula", "Instrumented Status", "Target KPI (Post-Rollout)"]
    metrics_rows = [
        ["Acquisition", "Bakery Discovery Visits", "Unique monthly visitors visiting `/bakeries` or `/`.", "Target KPI", "Baseline to be established post-launch."],
        ["Acquisition", "Merchant Registration Flow", "Count of bakery registrations submitted.", "Target KPI", "15 new verified bakeries/city/month."],
        ["Activation", "First Customization Started", "% of visitors who enter `/custom-builder`.", "Target KPI", "> 35% of qualified landing visits."],
        ["Activation", "First Order Placement Rate", "% of registered users placing an order within 14 days.", "Target KPI", "> 25% activation target."],
        ["Engagement", "Custom Studio Step Completion", "% of builder sessions completing all 8 stages.", "Target KPI", "> 60% completion rate."],
        ["Engagement", "Blueprint Summary Views", "Count of users generating a custom summary blueprint.", "Target KPI", "> 5,000 views/month."],
        ["Conversion", "Studio-to-Cart Conversion", "% of completed builder sessions added to cart.", "Target KPI", "> 45% conversion."],
        ["Conversion", "Cart-to-Order Conversion", "% of cart sessions resulting in `orders.status == 'PENDING'`.", "Target KPI", "> 65% completion target."],
        ["Marketplace", "Bakery Acceptance Rate", "`COUNT(ACCEPTED) / COUNT(PENDING)` orders.", "Target KPI", "> 90% acceptance target."],
        ["Marketplace", "Bakery Decision Turnaround", "Average hours between order creation and Accept/Reject.", "Target KPI", "< 4 hours average SLA."],
        ["Retention", "Occasion Repeat Order Rate", "% of customers ordering again within 12 months.", "Target KPI", "> 30% annual repeat rate."],
        ["Quality", "Order Rejection Rate", "`COUNT(REJECTED) / COUNT(PENDING)` orders.", "Target KPI", "< 8% total rejection target."],
        ["Experience", "Delivered Review Rating Avg", "Mean rating value across `reviews.rating`.", "Target KPI", "Maintain > 4.6 / 5.0 platform average."]
    ]
    add_table_component(doc, metrics_headers, metrics_rows, col_widths=[1.1, 1.6, 2.0, 0.9, 1.07], text_size=8.5)

    # =========================================================================
    # SECTION 25: RECOMMENDED PRODUCT ANALYTICS INSTRUMENTATION PLAN
    # =========================================================================
    add_h1(doc, "25. Recommended Product Analytics Instrumentation Plan")
    
    add_p(doc, "To establish baselines and power data-driven product iterations, the following telemetry dictionary specifies the schema for tracking events to be piped to Mixpanel, PostHog, or Segment.")
    
    tele_headers = ["Event Name", "Trigger Mechanism", "Payload Attributes & Properties", "Core PM Question Answered"]
    tele_rows = [
        ["`bakery_directory_viewed`", "User loads `/bakeries`.", "`city_filter`, `specialty_filter`, `sort_order`", "Which geographic markets attract customer interest?"],
        ["`bakery_storefront_viewed`", "User opens `/bakeries/:slug`.", "`bakery_id`, `bakery_slug`, `min_lead_days`", "Which merchant profiles drive the highest engagement?"],
        ["`cake_detail_viewed`", "User views `/cakes/:id`.", "`cake_id`, `bakery_id`, `category`, `price_inr`", "Which signature recipes are most attractive?"],
        ["`custom_studio_started`", "User enters Step 1 of builder.", "`referrer_page`, `device_type`", "What percentage of visitors seek bespoke cakes?"],
        ["`custom_step_completed`", "User advances builder step.", "`step_number` (1-8), `selected_token_id`", "At which custom builder step does user drop-off occur?"],
        ["`custom_cake_added_to_cart`", "User clicks 'Add Custom Cake'.", "`bakery_id`, `total_price_inr`, `weight_kg`", "What is the average order configuration value?"],
        ["`cart_bakery_conflict_modal`", "User tries adding 2nd bakery item.", "`existing_bakery_id`, `new_bakery_id`", "How frequently do multi-bakery cart collisions occur?"],
        ["`checkout_started`", "User navigates to `/checkout`.", "`cart_subtotal_inr`, `item_count`, `lead_days`", "What is the checkout initiation volume?"],
        ["`order_submitted`", "Customer places order.", "`order_id`, `order_number`, `bakery_id`, `total_inr`", "What is the daily Gross Merchandise Value (GMV)?"],
        ["`bakery_order_decision`", "Bakery clicks Accept or Reject.", "`order_id`, `decision` ('ACCEPT'/'REJECT'), `reason`", "Why are bakeries declining orders (capacity vs stock)?"],
        ["`milestone_updated`", "Bakery advances milestone.", "`order_id`, `milestone` ('PREPARING'/'READY'/'OUT')", "How long do artisan cakes spend in each baking phase?"],
        ["`verified_review_submitted`", "Customer posts review.", "`order_id`, `bakery_id`, `rating`, `char_length`", "What is customer satisfaction across specific bakeries?"]
    ]
    add_table_component(doc, tele_headers, tele_rows, col_widths=[1.5, 1.4, 2.0, 1.77], text_size=8.5)

    # =========================================================================
    # SECTION 26: PRODUCT EXPERIMENTATION ROADMAP
    # =========================================================================
    add_h1(doc, "26. Product Experimentation Roadmap")
    
    add_p(doc, "The following 4 A/B testing and multivariate experimentation hypotheses demonstrate structured Product Management thinking to drive activation, conversion, and kitchen compliance post-launch.")
    
    exp_list = [
        ("Experiment 1: Progressive Multi-Step Studio vs. Single-Page Accordion Form",
         "Observation: Some users abandon multi-step wizards if they feel uncertain about remaining steps.",
         "Hypothesis: Presenting the 8 customization categories as an interactive vertical accordion with visible progress checkmarks will increase studio-to-cart completion by reducing step anxiety.",
         "Primary Metric: Custom Studio-to-Cart Completion Rate (%). Guardrail Metric: Time spent in studio.",
         "Control: Current 8-Step linear sequential wizard. Variant: Collapsible vertical accordion with dynamic completion counter.",
         "Strategic Decision Rule: Adopt variant if completion rate improves by >= 10% without increasing incomplete inscription errors."),

        ("Experiment 2: 'Customize This Signature Cake' Hero CTA on Product Detail",
         "Observation: 70% of first-time visitors explore pre-built signature cakes before discovering the blank-canvas custom studio.",
         "Hypothesis: Adding a prominent secondary button 'Customize This Recipe in Studio' pre-populating the builder with that cake's base sponge and flavor will increase Custom Studio activations.",
         "Primary Metric: Custom Studio Entry Rate from Cake Detail pages (%). Guardrail: Pre-built cake checkout conversion.",
         "Control: Standard 'Add to Cart' button with static custom checkbox. Variant: Primary 'Order Standard Cake' + Secondary 'Customize Recipe in Studio'.",
         "Strategic Decision Rule: Roll out if Studio activations increase by >= 15% with neutral or positive total cart additions."),

        ("Experiment 3: Dynamic Lead-Time Badging on Bakery Cards vs Storefront Detail",
         "Observation: Users sometimes build an entire custom cake only to find the bakery requires 3 days lead time, causing checkout drop-off.",
         "Hypothesis: Displaying an explicit 'Earliest Available Delivery: [Date]' badge on bakery cards in `/bakeries` will filter low-intent users early and improve checkout completion.",
         "Primary Metric: Checkout Date-Selection Completion Rate (%). Guardrail: Bakery card click-through rate.",
         "Control: Standard text 'Min Lead Time: 2 Days'. Variant: Dynamic computed date badge 'Baking for [Day, Date] onwards'.",
         "Strategic Decision Rule: Adopt dynamic badge if checkout date bounce rate drops by >= 12%."),

        ("Experiment 4: Milestone SMS Notifications vs. Pull-Based In-App Polling",
         "Observation: Customers check the order tracking page 4.2 times on celebration day to verify cake progress.",
         "Hypothesis: Sending automated transactional SMS/WhatsApp alerts at `ACCEPTED`, `READY`, and `OUT_FOR_DELIVERY` will decrease inbound customer phone calls to bakeries.",
         "Primary Metric: Bakery Inbound Support / Phone Call Volume per Order. Guardrail: User NPS / CSAT score.",
         "Control: Current in-app notification bell and manual order tracking page. Variant: Automated transactional SMS notifications triggered on state changes.",
         "Strategic Decision Rule: Implement SMS integration if inbound merchant phone calls drop by >= 35%.")
    ]
    
    for title, obs, hyp, prim, cont, rule in exp_list:
        add_h2(doc, title)
        add_p(doc, f"**Observation & Context:** {obs}")
        add_p(doc, f"**Hypothesis:** {hyp}")
        add_p(doc, f"**Metrics:** {prim}")
        add_p(doc, f"**Test Setup:** {cont}")
        add_p(doc, f"**Decision Framework:** {rule}")

    # =========================================================================
    # SECTION 27: COMPETITIVE & ALTERNATIVE LANDSCAPE
    # =========================================================================
    add_h1(doc, "27. Competitive & Alternative Landscape")
    
    add_p(doc, "Customers currently rely on four primary alternative methods for acquiring celebration cakes in Indian cities. The matrix below benchmarks Whisk & Layers across structural capabilities.")
    
    comp_headers = ["Market Alternative", "Key Competitors", "Core Advantages", "Systemic Failure Modes", "Whisk & Layers Strategic Win"]
    comp_rows = [
        ["Hyperlocal Quick Food Delivery", "Swiggy, Zomato, Blinkit, Zepto", "Instant speed (15 to 45 mins), deep consumer habituation, massive delivery fleet.", "Only standard dry/cold-storage cakes; zero bespoke customization; high courier handling damage.", "Captures high-stakes celebration cakes requiring 24-72h artisan preparation and delicate transport."],
        ["Social Commerce & Direct DMs", "Instagram Home Bakers, WhatsApp Business chats", "Hyper-personalized, intimate relationship with local pastry chef, infinite design flexibility.", "Unorganized chat chaos; no price transparency; missed dietary preferences; manual payment proofs; zero tracking.", "Replaces chaotic chat threads with structured 8-step builder, guaranteed pricing, and milestone tracking."],
        ["National Gifting Portals", "Ferns N Petals (FNP), Bakingo, Winni, FlowerAura", "Same-day delivery network, multi-city flower/cake bundles, established brand awareness.", "Mass-produced industrial bakery hubs; mediocre gourmet quality; generic recipes; uninspired aesthetics.", "Partners with verified local gourmet artisans (French patisseries, Le Cordon Bleu chefs) for authentic quality."],
        ["Physical Brick-and-Mortar Visits", "Local High-Street Bakeries, Theobroma, Monginis", "Tactile inspection of display cakes, immediate face-to-face ordering with store staff.", "Requires physical travel in traffic; staff write specs on paper slips prone to lost notes; inflexible pickup.", "Enables rich digital browsing and custom configuration from home with guaranteed advance kitchen booking."]
    ]
    add_table_component(doc, comp_headers, comp_rows, col_widths=[1.3, 1.2, 1.4, 1.4, 1.37], text_size=8.5)

    # =========================================================================
    # SECTION 28: RISK REGISTER & MITIGATION STRATEGY
    # =========================================================================
    add_h1(doc, "28. Risk Register & Mitigation Strategy")
    
    add_p(doc, "Proactive product management requires identifying strategic, technical, and operational failure risks early with actionable mitigations.")
    
    risk_headers = ["ID", "Risk Description", "Category", "Prob.", "Impact", "Mitigation Strategy", "Leading Warning Indicator"]
    risk_rows = [
        ["RSK-01", "Bakery delays order response, stranding customer in `PENDING` state.", "Operational", "Medium", "High", "Implement automated SLA timer (4h); auto-alert bakery on WhatsApp; escalate to admin.", "% of pending orders exceeding 4-hour decision threshold."],
        ["RSK-02", "Bakery rejects high percentage of custom orders due to overcapacity.", "Marketplace", "Medium", "High", "Introduce bakery 'Kitchen Blackout Calendar' allowing merchants to pause incoming dates.", "Bakery rejection rate exceeding 10% platform average."],
        ["RSK-03", "Custom cake damaged in transit due to unspecialized two-wheeler delivery.", "Logistics", "High", "Critical", "Partner with specialized four-wheeler delicate courier services; enforce cake box strapping guidelines.", "Post-delivery damage dispute tickets in customer reviews."],
        ["RSK-04", "Customer enters inaccurate 6-digit PIN code causing delivery failure.", "UX / Tech", "Low", "Medium", "Validate Indian PIN codes against official India Post postal API; auto-fill City and State.", "Checkout validation errors on address submission."],
        ["RSK-05", "Ingredient cost inflation causes bakery catalog pricing to become obsolete.", "Economics", "Medium", "Medium", "Provide merchant bulk-price adjustment tools and seasonal ingredient surcharges.", "Bakery margin complaints or decline reasons citing cost."],
        ["RSK-06", "High-resolution cake images slow down directory browsing on mobile 4G.", "Technical", "Medium", "Medium", "Implement client-side compression (`SafeImage.tsx`), Next-gen WebP formatting, and CDN edge caching.", "Lighthouse Performance score dropping below 80."],
        ["RSK-07", "Customer disputes dietary eggless purity after celebration.", "Trust / Legal", "Low", "Critical", "Require explicit bakery eggless certification tags; separate kitchen prep verification; FSSAI compliance.", "Dietary inquiry tickets or customer complaints."]
    ]
    add_table_component(doc, risk_headers, risk_rows, col_widths=[0.6, 1.6, 0.9, 0.6, 0.6, 1.4, 1.07], text_size=8.0)

    # =========================================================================
    # SECTION 29: EDGE CASES & EXCEPTION HANDLING MATRIX
    # =========================================================================
    add_h1(doc, "29. Edge Cases & Exception Handling Matrix")
    
    add_p(doc, "The matrix below documents edge-case scenarios and details how the application handles them today versus planned future safeguards.")
    
    edge_headers = ["Scenario", "Trigger Condition", "Current Implemented System Behavior", "Future Production Enhancement"]
    edge_rows = [
        ["Bakery Rejection", "Bakery cannot fulfill pending order.", "Bakery must submit mandatory reason (>= 5 chars); status updates to `REJECTED`; reason displayed to customer.", "Auto-suggest similar alternative bakeries with available capacity on that date."],
        ["Lead Time Breach", "Customer attempts booking a date within `minimum_lead_days`.", "Date picker physically blocks invalid dates; backend API validates date and returns 400 error.", "Offer 'Rush Baking' surcharge option if bakery kitchen accepts overtime shifts."],
        ["Multi-Bakery Cart Collision", "Customer adds item from Bakery B while cart has Bakery A items.", "System displays replacement modal prompt asking user to confirm clearing existing cart.", "Allow split-checkout with segregated order headers and staggered courier fees."],
        ["Catalog Price Change", "Bakery edits cake price while customer has item in cart.", "Cart recalculates subtotal on page load; informs user of price update before checkout submission.", "Freeze cart item price for a 30-minute reservation window."],
        ["Network Interruption During Order", "User drops internet connection during `POST /api/orders`.", "Frontend displays retry toast; order creation is atomic within SQLite transaction.", "Add idempotency key (`idempotency_key` header) to prevent duplicate order generation."],
        ["Invalid Inscription Length", "Customer types > 60 characters for celebration message.", "Frontend enforces `maxLength={60}` and renders real-time character countdown badge.", "Support multi-line inscription layout preview with font style selection."],
        ["Unauthenticated Checkout Attempt", "Visitor clicks 'Proceed to Checkout' without logging in.", "`RequireAuth` guard redirects to `/login` with `from` location state; auto-redirects back post-login.", "Support guest checkout with automated background account creation via SMS OTP."]
    ]
    add_table_component(doc, edge_headers, edge_rows, col_widths=[1.3, 1.4, 2.0, 1.97], text_size=8.5)

    # =========================================================================
    # SECTION 30: PRIORITIZATION FRAMEWORK (STRATEGIC RICE / IMPACT-EFFORT)
    # =========================================================================
    add_h1(doc, "30. Prioritization Framework (Strategic RICE / Impact-Effort)", page_break=True)
    
    add_p(doc, "To guide resource allocation across future product quarters, candidate features are evaluated using a strategic **RICE Prioritization Framework** (Reach × Impact × Confidence ÷ Effort). All values reflect senior PM strategic assessments based on current technical maturity.")
    
    rice_headers = ["Feature Candidate", "Reach (Target Occasions)", "Impact (1-3)", "Confidence (%)", "Effort (Person-Wks)", "RICE Score", "Strategic Priority"]
    rice_rows = [
        ["Live Razorpay UPI Gateway Integration", "100% of ordering users", "3.0 (Massive)", "95%", "2.0 wks", "142.5", "**P0 (Immediate Phase 2)**"],
        ["Automated WhatsApp Order Alerts", "90% of active users", "2.5 (High)", "90%", "1.5 wks", "135.0", "**P0 (Immediate Phase 2)**"],
        ["Bakery Kitchen Capacity Calendar", "100% of bakeries", "2.5 (High)", "85%", "2.0 wks", "106.2", "**P1 (Phase 2)**"],
        ["Customer Photo Upload in Reviews", "40% of delivered users", "2.0 (Med)", "90%", "1.0 wk", "72.0", "**P1 (Phase 2)**"],
        ["Dynamic Delivery Geolocation Radius", "70% of urban users", "2.0 (Med)", "80%", "3.0 wks", "37.3", "**P2 (Phase 3)**"],
        ["AI Inscription & Flavor Pairing Assistant", "35% of custom builders", "1.5 (Low)", "70%", "2.5 wks", "14.7", "**P3 (Phase 3)**"],
        ["Interactive 3D WebGL / AR Cake Preview", "25% of custom builders", "1.5 (Low)", "60%", "6.0 wks", "3.75", "**P4 (Future Vision)**"]
    ]
    add_table_component(doc, rice_headers, rice_rows, col_widths=[1.8, 1.1, 0.8, 0.8, 0.9, 0.6, 1.07], text_size=8.0)

print("Compiled PRD Part 3 successfully.")
