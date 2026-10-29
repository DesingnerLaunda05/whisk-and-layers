# PRODUCT REQUIREMENTS DOCUMENT

## WHISK & LAYERS

- India-First Artisanal Customized Cake Marketplace & Production System

- A full-stack vertical marketplace connecting urban celebration planners with verified independent boutique bakeries. Features structured 8-step cake customization, 3D visual preview, single-bakery cart isolation, mandatory order rejection logging, and stage-by-stage fulfillment tracking.

| Metadata Dimension | Document Specification |
| --- | --- |
| Functional Scope | Product Strategy, Marketplace Mechanics, Custom Studio UX, Relational Architecture |
| Implementation Stage | Implemented MVP Prototype (Local Full-Stack & GitHub Pages Demo) |
| Target Geographic Hubs | Tier-1 / Tier-2 Metros: Ahmedabad, Vadodara, Rajkot, Surat, Mumbai, Bengaluru, Delhi-NCR |
| Measurement Standards | INR (₹), Metric Weights (0.5 Kg to 3.0 Kg), Indian Mobile (+91), 6-Digit Postal PIN Codes |
| Live Evaluation Demo | https://desingnerlaunda05.github.io/whisk-and-layers/ |
| Codebase Repository | https://github.com/DesingnerLaunda05/whisk-and-layers |
| Automated Test Baseline | Vitest 9/9 Passed (Locally Reproduced: Windows 11, Node v20+, Vitest v3.2.7) |
| Release Date & Status | October 2026  \|  Final Executive Review Copy |

| RECRUITER & EVALUATOR NOTE: This specification is an evidence-led product management portfolio artifact created by Aditya Nair. It distinguishes verified code implementations and local automated test passes from mock demo behaviors, unvalidated market hypotheses, and future production roadmap requirements. No stakeholder approvals, enterprise job titles, customer interview quotes, or production GMV numbers have been fabricated. |
| --- |

## 1. Executive Summary, Governance & Verification Reality

### 1.1 Document Intent & Governance Context

- This document serves as the recruiter-facing and engineering-defensible Product Requirements Document (PRD) for Whisk & Layers. The author, Aditya Nair, acts as the product portfolio owner who conceived the product strategy, mapped user journeys, designed the functional specifications, structured the relational data schemas, and built the functioning full-stack application prototype.

- In accordance with professional product management integrity, this document contains no fabricated enterprise sign-off matrices, fictitious customer discovery counts, or synthetic financial figures. All quantitative claims are tied to either verified codebase logic, local integration test passes, or explicitly labeled unvalidated hypotheses requiring field research.

### 1.2 Executive Product Summary

- Whisk & Layers is a vertical, two-sided consumer marketplace designed to solve the operational chaos of ordering bespoke celebration cakes in urban India. Traditional quick-commerce aggregators (Blinkit, Zepto, Swiggy Instamart) solve for 15-minute fulfillment of standardized, mass-produced dry cakes, while food delivery aggregators (Swiggy, Zomato) offer basic catalog listings lacking multi-tier customization, structural weight modeling, or advance multi-day slot protection. Consequently, over an estimated majority of custom cake transactions remain trapped in unstructured WhatsApp chats and Instagram DMs.

- Whisk & Layers establishes structured digital rails for bespoke baking: customers configure custom celebration cakes via an interactive 8-step builder with real-time 3D Three.js visualization, deterministic price updates, and advance preparation lead-time validation. Boutique artisan bakeries receive structured orders through a dedicated operations portal with mandatory rejection reason logging and milestone-driven status transitions.

### 1.3 Verified Implementation Stage vs. Prototype Reality

- To maintain absolute credibility, the platform capabilities are classified into distinct verification tiers:

| Capability / Subsystem | Claimed Status | Verification Classification | Evidence & Verification Notes |
| --- | --- | --- | --- |
| Relational Schema & DB | Implemented | Verified in Code | Universal SQLite schema (schema.ts) with 9 tables, foreign keys, and indexes initialized in data/whisk_layers.sqlite. |
| Backend REST Services | Implemented | Verified in Code | Layered Express.js architecture (Controllers, Services, Repositories) with Zod validation (schemas.ts) and bcrypt. |
| Automated Test Suite | 9/9 Passing | Tested Locally | Reproduced via 'npm.cmd run test --workspace=backend': 9 Vitest integration tests passed in 726ms on Windows 11. |
| Live Interactive Demo | Hosted | Observed in Demo | Deployed to GitHub Pages. Operates entirely as a static client-side application utilizing mockAdapter.ts fallback. |
| 8-Step Custom Builder | Implemented | Verified in Code | Interactive Studio with 8 customization steps + live Blueprint Summary Card and Three.js 3D model canvas. |
| Cart Lead Protection | Enforced | Verified in Code | Single-bakery cart isolation and minimum lead-time date calculation enforced in CartContext.tsx and orderService.ts. |
| Checkout & Payments | Simulated | Configured Prototype Behavior | Modal UI supports UPI QR, Card 3D-Secure, NetBanking, and COD. No live payment gateway (Razorpay/Cashfree) connected. |
| Logistics & Tracking | Milestone UI | Configured Prototype Behavior | Orders display discrete status milestones (PENDING to DELIVERED). No live GPS courier tracking or 3PL API integrated. |
| Dietary Standards | Eggless Badging | Configured Prototype Behavior | 100% Eggless badges stored in catalog metadata. Kitchen cross-contamination prevention remains an operational requirement. |
| Delivery Fee & GST | Calculated | Configured Prototype Behavior | Hardcoded ₹80 flat delivery and 5% GST configured in orderService.ts; pending formal accounting/legal verification. |
| Market Problem Metrics | 80% Chat Orders | Hypothesis (Unvalidated) | Specific metrics (80% WhatsApp volume, 45-90 min coordination, 40% baker inquiry time) represent unvalidated hypotheses. |

### 1.4 Live Demo Architecture & Backend Hosting Reality

- The live web demonstration is hosted via GitHub Pages (https://desingnerlaunda05.github.io/whisk-and-layers/). GitHub Pages provides static asset hosting and does not run a Node.js Express server or persist a remote SQLite database. In the demo deployment:

- **Client-Side Mock Fallback:** All network fetch requests to /api fail or return 404 because there is no remote cloud backend connected.

- **Seamless Evaluator UX:** The frontend apiClient.ts catches fetch errors and routes all requests to mockAdapter.ts, which reads and writes to an in-memory/localStorage mock data store (mockDataStore.ts).

- **Local Full-Stack Execution:** To evaluate genuine database persistence and backend Zod validations, the application must be executed locally via 'npm run dev', which launches Express on port 5000 and Vite on port 5173 with proxy routing.

### 1.5 Critical Known Limitations & Operational Boundaries

- **Client Token Storage:** Authentication JWTs are stored in browser localStorage. Production deployment requires HttpOnly, Secure, SameSite cookies to mitigate Cross-Site Scripting (XSS) risks.

- **Rate Limiting & Abuse Protection:** Rate limiting is configured via express-rate-limit in memory on single-instance Express. Distributed Redis rate limiting is required for multi-instance scaling.

- **Notification Delivery:** Order updates rely on client pull / page re-renders. Automated WhatsApp Business API alerts and SMS webhooks are designated as Phase 2 requirements.

- **Post-Payment Order Rejection:** Because payments are simulated, if a bakery rejects an order, no automated refund webhook executes. Refund liability handling represents an open operational decision.

## 2. Problem Framing, Market Context & Competitive Alternatives

### 2.1 The Status Quo: The Frictional Reality of Social Commerce

- Bespoke celebration cakes are high-stakes, emotionally charged purchases. Unlike everyday groceries or lunch takeout, a custom anniversary or birthday cake has an inflexible delivery deadline, multi-generational dietary sensitivities, and aesthetic expectations. In urban India, the current buying workflow takes place primarily through informal social messaging channels (WhatsApp chats, Instagram Direct Messages, phone calls), introducing severe operational failure points:

- **Unstructured Requirements:** Customers submit ambiguous requests ('Need a 1 kg chocolate cake with pastel flowers for Saturday'). Bakers must exchange 6 to 10 follow-up messages to clarify sponge type, fillings, structural tiers, shape, and lettering.

- **Lost Dietary Mandates:** In vegetarian and Jain households, eggless integrity is mandatory. In unorganized chat threads, verbal requests are easily overlooked by baking staff, resulting in ruined celebrations and reputational damage.

- **Opaque, Arbitrary Pricing:** Bakers quote arbitrary prices on chat threads. Surcharges for tiered dowels, custom cake boards, or exotic fruit compotes are introduced late in the interaction, creating price anxiety and customer mistrust.

- **Manual Payment Reconciliation:** Payment verification relies on customers sharing manual UPI payment screenshots. Bakers must manually cross-check bank SMS notifications while actively managing kitchen production.

- **Zero Fulfillment Visibility:** On celebration day, customers send anxious status inquiries. Bakers, actively decorating, cannot respond in real time, causing customer panic.

### 2.2 Formal Product Problem Statement

| FORMAL PRODUCT PROBLEM STATEMENT: Celebration planners in urban India lack a structured, reliable digital platform to discover local artisan bakeries, configure custom cake specifications with upfront transparent pricing, and track advance orders. Simultaneously, independent artisan bakeries lack dedicated operational software to filter uncommitted inquiries, enforce mandatory preparation lead times, protect kitchen capacity, and capture structured, paid orders. |
| --- |

### 2.3 Market Opportunity & Credible Industry Context

- India's commercial bakery sector represents a substantial and expanding market, driven by rapid urbanization, rising disposable incomes, and the cultural proliferation of celebratory micro-occasions:

- **Indian Bakery Market Size:** The broader Indian bakery market was valued at approximately USD 13.8 Billion to USD 14.1 Billion, projected to grow at a Compound Annual Growth Rate (CAGR) of 8.3% to 9.5% over the next decade (Source: IMARC Group, 'India Bakery Market Report', 2024; Spherical Insights, 2024).

- **Cakes & Pastries Sector:** Within bakery, the standalone Indian cakes and pastries segment is valued at over USD 540 Million, expanding at an estimated CAGR of 5.8% to 6.0% (Source: Research and Markets, 'India Cakes Market - Growth, Trends, and Forecast', 2024).

- **Premiumization & Dietary Shift:** Consumers are increasingly migrating from unorganized local neighborhood sweet shops to premium organized retail, cloud bakeries, and bespoke artisanal dessert studios offering gourmet flavors, French pastry techniques, and specialized dietary formulations (eggless, vegan, gluten-free).

### 2.4 Research Evidence Audit & Operational Hypotheses

- The original project documentation cited specific operational metrics regarding consumer and merchant friction. To maintain research integrity, these figures are formally classified as Unvalidated Operational Hypotheses:

| Quantitative Claim | Original Assumption | Research Classification | Proposed Validation Methodology |
| --- | --- | --- | --- |
| Channel Concentration | 80% of custom cake orders occur via WhatsApp / Instagram DMs. | Hypothesis (Unvalidated) | Survey 25 urban boutique bakeries across Mumbai and Ahmedabad to quantify inquiry sources. |
| Customer Friction | Customers spend 45 to 90 minutes back-and-forth per custom order. | Hypothesis (Unvalidated) | Time-and-motion study of 20 celebration planners ordering custom cakes via messaging apps. |
| Merchant Time Loss | Bakers spend up to 40% of their working hours answering repetitive inquiries. | Hypothesis (Unvalidated) | Shadow 10 artisan bakers across a 5-day cycle to log time spent on messaging vs kitchen production. |
| Operational Savings | Standardized forms save 15 to 20 hours of baker communication weekly. | Hypothesis (Unvalidated) | Measure order processing duration before and after adopting structured order forms. |
| Average Order Value | Custom celebration cakes range between ₹1,200 and ₹2,800 AOV. | Directionally Plausible | Benchmark against published menus of 30 artisan bakeries across Gujarat and Maharashtra. |

### 2.5 Structured Discovery Research Plan

- To transition these hypotheses into validated user insights, the following qualitative discovery research protocol will be executed prior to commercial capital deployment:

- **Merchant Discovery (Cohort A):** Recruit 12 commercial bakery owners (ranging from home-based cloud bakers producing 15 cakes/week to established boutique studios producing 100+ cakes/week). Assess order intake channels, lead-time management, rejection reasons, and payment reconciliation pain points.

- **Consumer Discovery (Cohort B):** Recruit 18 urban celebration planners who purchased at least 2 custom cakes in the past 12 months. Map the discovery process, pricing friction, anxiety triggers, and dietary verification expectations.

### 2.6 Competitive & Alternative Landscape Matrix

- Existing market alternatives solve adjacent food delivery jobs but fail the specific requirements of bespoke celebration cakes:

| Observable User Job | Swiggy / Zomato | Blinkit / Zepto (Q-Commerce) | WhatsApp / Instagram DMs | Whisk & Layers (Proposed) |
| --- | --- | --- | --- | --- |
| Custom Cake Studio | None; off-the-shelf catalog only. | None; mass-produced SKUs only. | Infinite flexibility, but unstructured. | 8-step guided builder + 3D Three.js visualizer. |
| Pricing Transparency | Fixed menu price; no option pricing. | Fixed low price; no customization. | Opaque; manual quotes, surprise add-ons. | Deterministic live calculation; base + option surcharges. |
| Advance Lead Protection | Immediate or same-day scheduling. | 10-15 minute immediate delivery. | Manual negotiation; prone to error. | Enforced minimum lead days (2-5 days) before checkout. |
| Order Acceptance SLA | Automated / algorithmic merchant ping. | Instant automated warehouse picking. | Unpredictable; baker replies in 1-6 hours. | Dedicated dashboard with mandatory rejection reason. |
| Fulfillment Visibility | Real-time rider GPS tracking. | Minute-by-minute rider GPS tracking. | Zero visibility; anxious text follow-ups. | Discrete milestone status updates (Baking to Ready). |
| Dietary Assurance | Basic restaurant tag; no recipe breakdown. | Pre-packaged factory ingredient list. | Verbal promise; prone to kitchen error. | Prominent 100% Eggless badges + recipe snapshot. |

## 3. Primary User Segments, Proto-Personas & Jobs to be Done

### 3.1 Primary User Segmentation

- Whisk & Layers operates as a two-sided marketplace serving two primary user groups, enabled by an administrative governance role:

## 1. Celebration Planners (Demand Side): Urban consumers arranging cakes for milestone birthdays, anniversaries, baby showers, or corporate events.

## 2. Artisan Bakery Merchants (Supply Side): Independent boutique pastry chefs, licensed home studios, and specialty bakeries handcrafting gourmet cakes.

## 3. Platform Administrators (Enabling Operations): Internal team members managing storefront onboarding, reviewing business verification, and monitoring GMV.

### 3.2 Customer Proto-Persona: The Celebration Planner

- Replacing anecdotal personal references, the primary customer archetype is framed as an illustrative proto-persona:

| Persona Dimension | Celebration Planner Archetype (Illustrative Proto-Persona) |
| --- | --- |
| Archetype Profile | Urban Working Professional / Family Milestone Organizer (Age 26–42, Metros). |
| Context & Triggers | Organizes 3 to 6 celebratory occasions annually for family, spouses, and close friends. Values high aesthetic quality and reliable delivery. |
| Core Jobs to be Done | Discover reputable local bakeries, specify multi-tier flavor/design preferences, guarantee 100% eggless compliance, and secure delivery timing without stress. |
| Key Frustrations | Waiting hours for Instagram DM replies; hidden surcharges added after hours of chat; fear that the baker will forget the custom inscription or eggless mandate. |
| Technology Behaviors | Heavy mobile UPI user (PhonePe, Google Pay); active on Instagram for visual inspiration; expects modern, responsive web experiences with instant feedback. |
| Expected Outcome | A showstopping, freshly baked celebration cake delivered on time with zero operational friction. |

### 3.3 Merchant Proto-Persona: The Artisan Bakery Owner

- The merchant archetype reflects the operational reality of independent culinary creators:

| Persona Dimension | Artisan Bakery Merchant Archetype (Illustrative Proto-Persona) |
| --- | --- |
| Archetype Profile | Boutique Pastry Chef / Independent Bakery Founder (Managing 2–10 kitchen staff). |
| Context & Triggers | Specializes in high-margin, bespoke celebration cakes. Operates a commercial kitchen or licensed boutique studio in an urban hub. |
| Core Jobs to be Done | Capture qualified custom cake orders; eliminate time wasted answering repetitive inquiries; protect kitchen capacity by enforcing advance lead times. |
| Key Frustrations | Customers expecting elaborate 3-tier cakes with 4 hours' notice; haggling over prices in chat; cross-checking manual UPI screenshot deposits. |
| Technology Behaviors | Manages operations primarily via smartphone; uses WhatsApp for business; willing to use a clean dashboard if it saves daily operational time. |
| Expected Outcome | A steady, predictable stream of pre-paid custom orders with structured recipes and guaranteed preparation timelines. |

### 3.4 Jobs to be Done (JTBD) Framework

- **Customer Core Job:** When planning an important celebration, I want to customize a bespoke cake with upfront transparent pricing and guaranteed lead-time protection, so that I can delight my guests without operational anxiety.

- **Customer Emotional Job:** Ensure strict compliance with vegetarian/eggless dietary mandates for family members.

- **Merchant Core Job:** When managing a busy kitchen, I want to receive fully structured custom cake orders with guaranteed payment and sufficient baking notice, so that my team can focus on culinary excellence rather than message coordination.

- **Merchant Professional Job:** Maintain brand reputation and culinary integrity without burning out on administrative overhead.

## 4. Product Vision, Value Proposition & Metrics Framework

### 4.1 Product Vision & Core Guiding Principles

- Vision Statement: To become India's most trusted vertical marketplace for handcrafted celebration cakes by combining creative customization freedom with disciplined operational fulfillment.

## 1. Deterministic Pricing Integrity: Every price displayed in the Custom Studio must be calculated deterministically from configured base and option surcharges. No hidden checkout fees.

## 2. Strict Advance Lead-Time Protection: Custom cakes require structural curing and baking time. The platform must strictly reject delivery dates shorter than the merchant's verified lead days.

## 3. Single-Bakery Cart Isolation: Celebration cakes are delicate and custom-made. Delivery must be direct and refrigerated. Orders cannot be blended across multiple bakeries.

## 4. Mandatory Rejection Accountability: If a merchant cannot fulfill an order, they must log a structured rejection reason (>= 5 chars) to inform the customer and platform operations.

### 4.2 Candidate North Star Metric

| CANDIDATE NORTH STAR METRIC DEFINITION: Successfully Completed Customized Orders (SCCO) per Month.<br>Eligibility Criteria: An order placed through Whisk & Layers containing at least one custom cake configuration; successfully accepted by the merchant; fulfilled to 'DELIVERED' status; and free of customer damage disputes, rejections, or cancellations within a 30-day reporting window.<br>Current Baseline: Unmeasured / 0 (Provisional baseline pending live commercial pilot instrumentation). |
| --- |

### 4.3 Provisional Supporting Product Metrics

- Funnel metrics are established to guide analytical instrumentation. All targets are provisional hypotheses pending baseline measurement:

| Funnel Dimension | Candidate Metric | Definition / Formula | Baseline Status | Provisional Target | Strategic Decision Informed |
| --- | --- | --- | --- | --- | --- |
| Acquisition | Studio Initiation Rate | Users visiting /custom-builder / Unique visitors | Unmeasured | > 25% of visitors | Evaluate discovery navigation & home page hero CTA effectiveness. |
| Activation | Custom Cake Builder Completion | Custom items added to cart / Studio sessions started | Unmeasured | > 40% completion | Identify drop-off steps across the 8 customization steps. |
| Conversion | Checkout Conversion Rate | Completed orders submitted / Cart sessions created | Unmeasured | > 60% conversion | Assess checkout friction, PIN validation errors, and payment trust. |
| Operations | Bakery Acceptance Rate | Accepted orders / Total pending orders received | Unmeasured | > 85% acceptance | Identify merchant capacity mismatches and lead-time setting issues. |
| Operations | Bakery Response SLA | Median time from order submission to accept/reject | Unmeasured | < 90 minutes | Determine when to trigger automated WhatsApp/SMS merchant escalations. |
| Retention | Repeat Celebration Rate | Customers ordering >= 2 times in 12 months / Total users | Unmeasured | > 20% annual | Evaluate celebration date reminder feature and customer loyalty. |
| Quality | Verified Review Satisfaction | Average star rating on delivered orders (1.0 - 5.0) | Unmeasured | > 4.60 Stars | Identify quality defects, transit damage, and bakery de-listing gates. |

### 4.4 Strategic Prioritization Framework

- Feature candidates are prioritized using a qualitative Impact × Effort evaluation. The mathematical RICE scores below are illustrative hypotheses to demonstrate strategic framework application:

| Feature Candidate | Reach (Target Occasions) | Impact (1-3) | Confidence (%) | Effort (Person-Wks) | Illustrative RICE | Priority Tier |
| --- | --- | --- | --- | --- | --- | --- |
| Live Razorpay UPI Gateway | 100% of ordering users | 3.0 (High) | 90% (Proven API) | 2.0 wks | 135.0 | P0 (Near-Term Gate) |
| WhatsApp Business Alerts | 90% of active users | 2.5 (High) | 85% (Proven API) | 2.0 wks | 95.6 | P0 (Near-Term Gate) |
| Bakery Capacity Calendar | 100% of bakeries | 2.5 (High) | 80% (Operational) | 3.0 wks | 66.7 | P1 (Fast Follow) |
| Customer Photo Reviews | 40% of delivered users | 2.0 (Med) | 85% (Standard) | 1.5 wks | 45.3 | P1 (Fast Follow) |
| Dynamic 3PL Radius Dispatch | 70% of urban users | 2.0 (Med) | 70% (Logistics API) | 4.0 wks | 24.5 | P2 (Phase 3) |
| AI Flavor Assistant | 35% of studio users | 1.5 (Low) | 60% (Experimental) | 3.0 wks | 10.5 | P3 (Deferred) |

## 5. Core User Journeys & Experience Architecture

### 5.1 Customer End-to-End Journey

- The customer journey is designed to replace fragmented messaging with a progressive disclosure workflow:

## 1. Discovery & Curation: Customer browses curated local bakeries filtered by Indian city, minimum lead notice, and dietary tags. Inspects bakery kitchen credentials, rating averages, and specialty catalogs.

## 2. Interactive Studio Configuration: Customer selects 'Custom Cake Studio'. Chooses across 8 structured variables (Tiers/Shape, Sponge, Gourmet Filling, Frosting Palette, Accent Piping, 3D Garnishes, Dietary Standard, Inscription Plaque). Reviews real-time 3D model canvas.

## 3. Blueprint Review & Cart Isolation: Customer reviews Blueprint Summary Card showing itemized price and calculated earliest delivery date. Clicks 'Add to Cart'. System validates that existing cart items belong to the same bakery.

## 4. Advance Slot Checkout: Customer selects delivery date (enforcing bakery minimum lead days) and 3-hour time slot. Inputs 10-digit Indian phone and 6-digit postal PIN code address. Selects payment method (UPI / Card / NetBanking / COD).

## 5. Milestone Fulfillment Tracking: Customer monitors visual timeline (PENDING -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED). Receives in-app updates upon each milestone transition.

## 6. Verified Post-Delivery Feedback: Upon confirmed delivery, customer receives review eligibility and submits star rating and feedback.

### 5.2 Bakery Merchant End-to-End Journey

- The bakery portal provides structured kitchen operations to eliminate communication overhead:

## 1. Order Intake & Review: Bakery receives urgent notification of incoming pending order. Inspects complete cake blueprint (tiers, sponge, fillings, inscription text, reference photo, delivery date, time slot, customer address).

## 2. Acceptance / Rejection SLA: Bakery either accepts order (moving status to ACCEPTED) or rejects order with mandatory reason logging (>= 5 characters, e.g., 'Fully booked for wedding catering on this date').

## 3. Milestone Production Progression: Kitchen staff advances order milestones: 'Start Baking' (PREPARING) -> 'Boxed & Ready' (READY) -> 'Dispatched' (OUT_FOR_DELIVERY) -> 'Delivered' (DELIVERED).

## 4. Storefront & Catalog Governance: Bakery owner manages cake catalog (pricing, active toggle, lead days), storefront profile, and reads/replies to verified customer reviews.

### 5.3 Platform Operations Journey

- Administrators access an internal console to review platform-wide metrics (total registered users, approved bakeries, global orders, settled GMV), review and approve new bakery merchant onboarding applications, toggle bakery store visibility, and moderate user accounts.

## 6. Product Scope Boundaries & Explicit Non-Goals

### 6.1 MVP Scope vs. Future Roadmap Phases

- Clear boundaries define current implementation from future planned enhancements:

| Domain / Subsystem | MVP (Current Implemented State) | Phase 2 (Near-Term Gate) | Phase 3 & 4 (Future Vision) |
| --- | --- | --- | --- |
| Custom Cake Builder | 8-step builder + 3D Three.js model + Blueprint Summary Card. | Photo reference uploader enhancement; preset celebration bundles. | Augmented Reality (AR) mobile camera placement preview. |
| Cart & Checkout | Single-bakery isolation, lead-time date validation, INR formatting. | Multiple delivery address presets; celebration reminder scheduling. | Multi-destination gift shipping to separate recipients. |
| Payment Processing | Simulated UPI dynamic QR, Card 3D-Secure, NetBanking, COD. | Live Razorpay / Cashfree UPI gateway with auto-refund on reject. | Automated split payments and merchant escrow settlement. |
| Notifications | In-app database notifications (notifications table). | Automated WhatsApp Business API alerts and SMS gateways. | Voice call fallback alerts for urgent unaccepted orders. |
| Logistics & Fulfillment | Merchant self-delivery; milestone stage tracking. | Refrigerated courier packaging guidelines and SLA audits. | Automated 3PL hyperlocal dispatch (Dunzo / Shadowfax API). |
| Merchant Operations | Order accept/reject with mandatory reason; catalog management. | Dynamic kitchen capacity blackout calendar and daily order caps. | Multi-staff kitchen tablet KDS (Kitchen Display System). |

### 6.2 Explicit Non-Goals

- **No In-House Delivery Fleet:** Whisk & Layers will not hire, purchase, or operate a proprietary two-wheeler or van delivery fleet. Fulfillment is handled by merchant logistics or integrated third-party refrigerated 3PL couriers.

- **No Mass-Produced Packaged Goods:** The platform deliberately excludes standardized, mass-manufactured, shelf-stable dry cakes and industrial biscuits.

- **No Quick-Commerce Instant Fulfillment:** The platform does not support immediate 10-to-15 minute grocery delivery. Handcrafted cakes require structural curing and advance lead time.

- **No Unannounced Surge Pricing:** Algorithmic Uber-style surge pricing during festivals is rejected to maintain price predictability and customer trust.

- **No Live Video Streaming in Kitchens:** Live video feeds of bakery kitchens are excluded due to kitchen privacy and operational distraction.

## 7. Prioritized Functional Requirements & Acceptance Criteria

- Core functional requirements are detailed with user stories, acceptance criteria in Gherkin syntax, priority tier, and verified implementation status:

- **FR-01: Customer Authentication & Session Management (Priority: P0 | Status: Verified in Code)** 

- User Story: As a celebration customer, I want to securely register and log in using my email and password, so that my order history, delivery addresses, and cart are persisted across sessions.

- **Acceptance Criteria (Gherkin):** 

- **Scenario 1 (Valid Registration):** Given a user provides an email, password (>= 6 chars), full name, and 10-digit Indian phone (+91), When they submit registration, Then an account is created with password bcrypt hashed, and a JWT token is returned.

- **Scenario 2 (Protected Route Guard):** Given an unauthenticated user attempts to access /orders/my-orders or /checkout, When the route is intercepted, Then the system redirects to /login and preserves the redirect path.

- **FR-02: Bakery Discovery & Lead-Time Filtering (Priority: P0 | Status: Verified in Code)** 

- User Story: As a celebration planner, I want to filter local bakeries by Indian city, minimum lead notice, and dietary specialties, so that I only browse bakeries capable of fulfilling my celebration schedule.

- **Acceptance Criteria (Gherkin):** 

- **Scenario 1 (Discovery Filtering):** Given a customer selects city 'Ahmedabad' and lead time '<= 2 days', When the catalog updates, Then only verified bakeries matching those parameters are displayed with ratings and specialty badges.

- **FR-03: Interactive 8-Step Custom Cake Studio (Priority: P0 | Status: Verified in Code)** 

- User Story: As a celebration customer, I want to configure a custom cake step-by-step across 8 distinct variables with live 3D visual preview and real-time price calculation, followed by a Blueprint review screen, so that I have complete confidence before purchasing.

- **Acceptance Criteria (Gherkin):** 

- **Scenario 1 (8 Customization Choices):** Given a user accesses the Studio, When they select Tiers (1-4), Shape (Round/Heart/Square/Hexagon), Frosting Color, Accent Color, 3D Garnishes, Sponge Base, Gourmet Filling, Dietary Standard, and Celebration Inscription (max 65 chars), Then the Three.js 3D model renders the geometry, colors, and toppings in real time.

- **Scenario 2 (Blueprint Review Step):** Given the user completes their selections, When viewing the Blueprint Summary Card, Then the system displays an itemized price breakdown (Base Price + Tier Surcharges + Option Extras) with zero hidden fees.

- **FR-04: Single-Bakery Cart Isolation & Lead-Time Enforcement (Priority: P0 | Status: Verified in Code)** 

- User Story: As a customer, I want my cart to prevent multi-bakery conflicts and enforce advance lead-time calendar validation, so that my order can be freshly baked and delivered without logistical failure.

- **Acceptance Criteria (Gherkin):** 

- **Scenario 1 (Cart Isolation Modal):** Given a cart containing items from Bakery A, When the customer attempts to add an item from Bakery B, Then the system presents a confirmation modal warning that adding Bakery B will clear Bakery A items.

- **Scenario 2 (Lead-Time Date Lock):** Given a bakery requires 3 days minimum lead notice, When the customer enters checkout on October 26, Then calendar delivery dates earlier than October 29 are disabled and cannot be selected.

- **FR-05: Localized Indian Checkout & Payment Selection (Priority: P0 | Status: Configured Prototype)** 

- User Story: As an Indian celebration shopper, I want to input a 6-digit postal PIN code address and choose my preferred payment method (UPI QR, Card, NetBanking, COD), so that I can complete checkout smoothly.

- **Acceptance Criteria (Gherkin):** 

- **Scenario 1 (Simulated Payment Flow):** Given a customer selects Instant UPI, When checkout is confirmed, Then a simulated dynamic UPI QR code modal opens with NPCI transaction reference for evaluation.

- **FR-06: Bakery Order Acceptance & Mandatory Rejection Reason (Priority: P0 | Status: Verified in Code)** 

- User Story: As a bakery owner, I want to accept incoming orders or decline them with a mandatory rejection explanation, so that my kitchen capacity is protected and customers receive clear communication.

- **Acceptance Criteria (Gherkin):** 

- **Scenario 1 (Rejection Validation):** Given a bakery receives a pending order, When they click 'Decline Order' without providing a reason, Then the system blocks submission with a validation error (Zod: minimum 5 characters required).

- **Scenario 2 (Successful Rejection):** Given a bakery submits rejection with reason 'Fully booked for wedding catering', Then the order transitions to REJECTED and the customer receives an in-app notification containing the reason.

- **FR-07: Stage-by-Stage Milestone Fulfillment Updates (Priority: P0 | Status: Verified in Code)** 

- User Story: As a customer and bakery, I want orders to progress through discrete fulfillment milestones (PENDING -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED), so that everyone has visibility into cake production status.

- **Acceptance Criteria (Gherkin):** 

- **Scenario 1 (Milestone Transition):** Given an order in status READY, When the bakery marks 'Dispatch for Delivery', Then the order transitions to OUT_FOR_DELIVERY and customer timeline advances.

- **FR-08: Verified Customer Reviews & Merchant Replies (Priority: P1 | Status: Verified in Code)** 

- User Story: As a customer, I want to submit a review only after receiving my delivered cake, and as a baker, I want to post a public reply, so that marketplace ratings remain authentic and accountable.

- **Acceptance Criteria (Gherkin):** 

- **Scenario 1 (Review Guard):** Given a customer with an order in status PENDING or PREPARING, When they attempt to post a review, Then the backend rejects the request with HTTP 403 / 400 (only DELIVERED orders eligible).

## 8. Order Lifecycle State Machine, Business Rules & High-Risk Exceptions

### 8.1 Order State Machine Specification

- The order lifecycle represents a disciplined state machine. The normal linear fulfillment progression flows through 6 sequential milestones, while REJECTED and CANCELLED represent alternate terminal branches:

| Current Status | Allowed Next Statuses | Authorized Roles | State Trigger & Transition Condition |
| --- | --- | --- | --- |
| PENDING | ACCEPTED, REJECTED, CANCELLED | Bakery, Customer (Cancel), Admin | Customer submits checkout. Bakery evaluates kitchen schedule within response window. |
| ACCEPTED | PREPARING, CANCELLED | Bakery, Admin | Bakery confirms order feasibility and commits kitchen capacity to fulfillment date. |
| PREPARING | READY | Bakery, Admin | Bakery begins baking sponges, whipping frostings, and hand-piping custom inscriptions. |
| READY | OUT_FOR_DELIVERY, DELIVERED | Bakery, Admin | Cake is fully decorated, boxed, refrigerated, and packaged with structural dowels. |
| OUT_FOR_DELIVERY | DELIVERED | Bakery, Admin | Order handed over to delivery driver for direct refrigerated transit to recipient address. |
| DELIVERED | None (Terminal State) | None (Final State) | Order successfully received at doorstep. Triggers verified review submission eligibility. |
| REJECTED | None (Terminal State) | Bakery, Admin | Alternate terminal state. Requires mandatory rejection reason (>= 5 chars) in database. |
| CANCELLED | None (Terminal State) | Customer, Bakery, Admin | Alternate terminal state. Permitted prior to PREPARING stage; releases reserved date. |

| ORDER LIFECYCLE TERMINOLOGY RESOLUTION: PENDING -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED represents the normal linear milestone progression. REJECTED is an alternate terminal branch from PENDING, not an additional linear step. Note that READY also allows a direct transition to DELIVERED in code to support customer direct store pickups. |
| --- |

### 8.2 Business-Critical Pricing & Tax Rules Engine

- **Pricing Formula:** For pre-built catalog items, unit price equals cake base_price. For custom cakes, unit price = starting base price (₹650) + tier surcharge (₹350/₹750/₹1400) + sum of extra_price of selected options (sponge, filling, shape, icing, toppings, decor).

- **Server-Side Price Validation:** While client-side calculates price for instant feedback, the backend re-validates item base prices against database records upon POST /api/orders.

- **Delivery Fee Configuration:** A flat fee of ₹80.00 is currently configured in orderService.ts representing local refrigerated courier transit. Marked as prototype configuration pending dynamic 3PL integration.

- **GST Tax Computation:** Tax is calculated at 5% of subtotal (Math.round(calculatedSubtotal * 0.05 * 100) / 100), reflecting standard Indian GST on bakery/confectionery. Labeled as configured prototype rule pending formal tax audit.

- **Order Price Locking:** Once submitted, subtotal, delivery_fee, tax_amount, and total_amount are immutably written to the orders table. Downstream catalog price changes do not alter submitted order totals.

### 8.3 High-Risk Exception Cases Matrix

- Robust marketplace systems anticipate edge failures and define deterministic system behaviors:

| Exception Scenario | Trigger Condition | Current Implemented System Behavior | Target Production Enhancement |
| --- | --- | --- | --- |
| Mid-Session Bakery Deactivation | Bakery owner toggles storefront inactive while user builds cake. | Studio displays alert banner on add-to-cart; POST /api/orders rejects with 400 error. | WebSocket real-time notification prompts customer to select alternate neighborhood bakery. |
| Delivery Date Collision | Customer selects date that becomes unavailable during checkout. | Backend orderService checks minimum lead days upon submission; rejects if invalid. | Real-time date lock hold for 15 minutes upon entering checkout screen. |
| Catalog Base Price Change | Bakery alters cake base_price while customer holds it in cart. | Server re-calculates subtotal using latest DB price at order creation time. | Checkout displays visual diff banner: 'Price updated from ₹X to ₹Y by bakery'. |
| Network Disconnect at Submit | Customer connection drops during order creation POST request. | UI displays error toast; order remains uncommitted until connection restored. | Idempotency keys (X-Idempotency-Key) to prevent duplicate order generation on retry. |
| Merchant Acceptance Timeout | Bakery takes no action on PENDING order within response window. | Order remains PENDING in dashboard; customer sees pending milestone status. | Automated WhatsApp escalation after 60 min; auto-cancellation & full refund after 4 hours. |
| Post-Payment Order Rejection | Bakery declines custom order after payment authorization. | Order moves to REJECTED with reason; transaction status flagged in database. | Automated payment gateway refund webhook execution with instant SMS notification. |

## 9. Non-Functional Requirements, Security & Operational Policies

### 9.1 Non-Functional Requirements Matrix

- Performance, security, and reliability standards governing the platform:

| Category | Metric / Attribute | Current Implemented Baseline | Production Target (Phase 2 Scale) |
| --- | --- | --- | --- |
| API Performance | P95 Response Latency | < 50ms (Observed on local SQLite in-memory/disk). | < 250ms under 500 concurrent requests on managed cloud SQL. |
| Frontend Load | Initial Bundle & LCP | Vite build ~420KB gzip; LCP ~1.2s locally. | LCP < 2.0s over Indian 4G mobile networks via global CDN. |
| 3D Graphics | Three.js Frame Rate | Maintains 60 FPS on standard modern desktop GPUs. | Graceful fallback to pre-rendered static WebP previews on low-end devices. |
| System Availability | Uptime SLA | Single-instance dev uptime (Port 5000 / GitHub Pages). | 99.9% uptime with automated health checks and multi-zone failover. |
| Security | Password Storage | Bcrypt hashing with salt rounds = 10 (authService.ts). | Argon2id or managed cloud identity service with mandatory MFA for admin. |

### 9.2 Security & Privacy Controls vs. Remaining Vulnerabilities

- The prototype enforces fundamental application controls, but production deployment requires addressing specific security gaps:

- **Implemented Security Controls:** Passcodes hashed with bcrypt; stateless JWT tokens with role guards (RequireAuth, RequireRole); input validation via Zod schemas; Helmet HTTP security headers; CORS domain whitelisting; Multer MIME and file size guards (8MB max).

- **Remaining Vulnerability 1 (Token Storage):** JWT tokens are stored in browser localStorage, vulnerable to token exfiltration if XSS occurs. Production remediation requires migrating to HttpOnly, SameSite=Strict cookies.

- **Remaining Vulnerability 2 (Distributed Rate Limiting):** Express rate limiting operates in single-process memory. Distributed denial-of-service or brute force attacks require Redis-backed global rate limiting.

- **Remaining Vulnerability 3 (Database Backup & Disaster Recovery):** Currently, SQLite stores data locally without automated point-in-time recovery. Production requires managed PostgreSQL/MySQL with automated daily snapshots and encryption at rest.

### 9.3 Dietary Integrity & Food Safety Operational Policy

| DIETARY & ALLERGEN INTEGRITY DISCLAIMER: The Whisk & Layers platform provides metadata badging ('100% Eggless', 'Gluten-Free', 'Vegan') based on bakery partner declarations. Software badging alone DOES NOT guarantee absence of airborne cross-contamination in commercial kitchens. Prior to commercial launch, partner onboarding must require: (1) Valid FSSAI food hygiene registration, (2) Submission of kitchen allergen separation protocols, and (3) Prominent customer allergen liability disclosures at checkout. |
| --- |

### 9.4 Delivery Exception & Transit Damage Dispute Policy

- Celebration cakes are physically fragile and susceptible to transit damage from heat, sharp turns, or courier drops. The operational dispute protocol requires:

- **Merchant Packaging SLA:** Bakeries must package multi-tier cakes with structural food-grade dowels, non-slip cake boards, and insulated thermal boxes.

- **Photo Evidence Requirement:** Recipients must inspect the cake at delivery. In case of structural collapse, photographic proof must be uploaded within 60 minutes of delivery.

- **Dispute Resolution:** If damage occurred during transit, the platform issues an immediate customer credit/refund; operational cost is shared per merchant SLA agreement.

## 10. Validation Plan, Usability Testing & Experimentation

### 10.1 Discovery Research Protocol

- Before commercial market launch, structured user research will replace unvalidated assumptions:

- **Cohort 1 (Artisan Merchants):** 12 boutique bakery owners across Ahmedabad and Mumbai. Methodology: 45-minute semi-structured contextual inquiry and order log review. Key Questions: How many custom inquiries are handled weekly? What percentage convert? How are rejections handled?

- **Cohort 2 (Celebration Planners):** 18 urban consumers who purchased a custom cake in the past year. Methodology: 30-minute retrospective journey mapping. Key Questions: What caused the most anxiety during ordering? What would build trust in upfront online payment?

### 10.2 Usability Testing Protocol: Studio Wizard vs. Single-Page Form

- Because custom cake building involves 8 variables, usability testing will evaluate cognitive load:

- **Evaluation Setup:** Control Variant: Current 8-Step linear sequential wizard. Test Variant: Single-page accordion form with dynamic summary sidebar.

- **Task Protocol:** 10 non-technical users given the task: 'Design a 2-tier 100% eggless chocolate cake with custom lettering for an anniversary on Friday'.

- **Measured Signals:** Task completion rate, time-on-task, subjective usability rating (SUS), and error frequency when selecting conflicting options.

### 10.3 Experimentation Framework

- Small usability sessions will guide initial UX refinements. Controlled A/B experiments will be deployed only after commercial traffic achieves statistical power (minimum sample size per variant based on 95% confidence and 80% power):

- **Experiment 1:** Dynamic lead-time badging directly on discovery cards vs inside storefront detail page. Hypothesis: Upfront lead-time badging reduces checkout date-collision errors by 25%.

- **Experiment 2:** Inspiration photo uploader placed at Step 1 vs Step 8 of Custom Studio. Hypothesis: Placing photo upload first increases studio completion for image-driven buyers by 15%.

## 11. Outcome-Driven Roadmap, Open Questions & Retrospective

### 11.1 Outcome-Based Roadmap & Phase Exit Gates

- Product evolution is structured around measurable outcome-based exit gates rather than arbitrary calendar deadlines:

| Phase | Strategic Theme | Key Capabilities Delivered | Outcome-Based Exit Gate (Must Pass to Advance) |
| --- | --- | --- | --- |
| Phase 1 (MVP) | Core Marketplace Foundation | Full-stack web app, 8-step studio, 3D visualizer, single-bakery cart, mandatory rejection logging, verified reviews. | 9/9 Vitest test pass; successful qualitative usability testing with >= 8/10 task completion rate. |
| Phase 2 (Pilot) | Commercial Trust & Payments | Live Razorpay UPI integration, automated WhatsApp Business alerts, merchant kitchen blackout calendar. | 50 successful paid commercial pilot orders with < 10% merchant rejection rate and zero payment reconciliation failures. |
| Phase 3 (Scale) | Hyperlocal Logistics & Density | Automated 3PL refrigerated dispatch (Dunzo API), multi-city hub expansion, dynamic delivery radius. | Maintain > 85% on-time delivery across 500+ monthly orders; customer review average >= 4.60 stars. |
| Phase 4 (Ecosystem) | Merchant SaaS & Enterprise | Merchant Kitchen Display System (KDS), celebration reminder CRM, corporate B2B gifting accounts. | Achieve positive unit economics with merchant retention > 80% across 12-month cohort. |

### 11.2 Strategic Open Product Questions

## 1. Payment Capture Timing vs Refund Liability: Should customer payments be authorized with a temporary hold and captured only upon bakery acceptance, or captured immediately at checkout and refunded if rejected? Holding minimizes refund fees but requires payment gateway support for delayed capture.

## 2. Merchant Self-Delivery vs Platform 3PL Mandate: Should bakeries be allowed to fulfill orders using their own staff, or should platform-managed 3PL refrigerated courier pickup be mandatory? Merchant self-delivery reduces platform liability but risks inconsistent delivery quality.

## 3. Marketplace Take Rate Structure: Should commission be a flat marketplace take rate (e.g., 12-15%) or a tiered subscription model for high-volume bakeries? Discovery research will evaluate merchant price sensitivity.

### 11.3 Senior PM Retrospective & Demonstrated Competencies

- Creating Whisk & Layers demonstrates fundamental senior product management competencies across consumer marketplaces, systems thinking, and technical execution:

## 1. Complex Problem Deconstruction: Deconstructed an intricate 8-variable custom baking workflow into a clean, progressive disclosure studio with real-time 3D feedback, eliminating customer decision paralysis.

## 2. Defensible Systems Architecture: Established single-bakery cart isolation and advance lead-time protections early in the technical architecture, preventing impossible multi-bakery logistical collisions.

## 3. Marketplace Dynamics & Incentive Alignment: Designed balanced incentives for both marketplace sides—customers gain pricing transparency and tracking visibility, while merchants gain protected kitchen capacity and mandatory rejection logging.

## 4. Evidence-Led Product Rigor: Replaced vanity metrics and unverified claims with strict verification classifications, candidate North Star definitions, and structured discovery protocols.

## 12. References, Source Traceability & Verification Records

### 12.1 Verified Codebase Artifacts & Test Records

- **Universal Relational Database Schema:** Database schema defined in backend/src/database/schema.ts; connection and SQLite bootstrap in backend/src/database/db.ts.

- **Order Service & State Machine:** Order creation, lead-time checks, price recalculation, and state transitions in backend/src/services/orderService.ts.

- **Custom Cake Studio & 3D Viewer:** Interactive custom builder in frontend/src/pages/customer/CustomCakeBuilderPage.tsx; Three.js 3D viewer in frontend/src/components/ui/Cake3DViewer.tsx.

- **Cart & Lead Enforcement:** Single-bakery cart isolation and item snapshots in frontend/src/context/CartContext.tsx.

- **GitHub Pages Demo Fallback:** Client-side fallback adapter in frontend/src/services/mockAdapter.ts and mockDataStore.ts.

- **Reproduced Automated Vitest Test Run:** Command: 'npm.cmd run test --workspace=backend'. Environment: Windows 11, Node v20+, Vitest v3.2.7. Result: 1 test file passed, 9 tests passed in 726ms. Test file: backend/src/tests/api.test.ts.

### 12.2 Credible Industry Market References

- **[1] IMARC Group (2024):** IMARC Group, 'India Bakery Market Report: Industry Trends, Share, Size, Growth, Opportunity and Forecast 2024-2032', Published 2024. URL: https://www.imarcgroup.com/india-bakery-market (Supports $13.8B - $14B bakery market valuation and 8.3-9.5% CAGR).

- **[2] Research and Markets (2024):** Research and Markets, 'India Cakes Market - Growth, Trends, and Forecasts (2024-2029)', Published 2024. URL: https://www.researchandmarkets.com/reports/india-cakes-market (Supports $540M+ cake sector valuation and ~6% CAGR).

- **[3] Spherical Insights (2024):** Spherical Insights, 'India Bakery Products Market Size, Share, and COVID-19 Impact Analysis', Published 2024. URL: https://www.sphericalinsights.com/reports/india-bakery-products-market.
