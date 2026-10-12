"""
Whisk & Layers PRD - Part 4: Sections 31 through 41
Author: Aditya Nair | Senior Product Manager
"""

from docx.shared import Inches, Pt, RGBColor
from prd_builder_utils import (
    add_h1, add_h2, add_h3, add_p, add_bullet, add_callout, add_table_component,
    COLOR_PRIMARY_DARK, COLOR_ACCENT, COLOR_BG_LIGHT, COLOR_BG_ALT, COLOR_WARNING, COLOR_SUCCESS
)

def build_part4(doc):
    # =========================================================================
    # SECTION 31: PRODUCT ROADMAP (PHASES 1 TO 4)
    # =========================================================================
    add_h1(doc, "31. Product Roadmap (Phases 1 to 4)")
    
    add_p(doc, "Rather than relying on speculative arbitrary calendar dates, the Whisk & Layers roadmap is organized into four sequential product maturity phases driven by platform readiness, operational compliance, and consumer scale.")
    
    roadmap_headers = ["Phase", "Strategic Theme", "Key Capabilities & Epics Delivered", "Success Milestone Gate"]
    roadmap_rows = [
        ["Phase 1: Foundation (Current MVP)", "Core Artisanal Marketplace", "• Full India-first localization (INR ₹, +91 mobile, 6-digit PIN, Kg weights, Eggless tags).\n• 8-Step Custom Cake Studio with live dynamic price counter.\n• Single-bakery cart isolation with advance lead-time date enforcement.\n• Bakery merchant dashboard with mandatory rejection reasoning.\n• 7-stage linear order milestone tracking & verified customer reviews.\n• Automated Vitest test suite passing 9/9 business tests.", "Production MVP live; zero data model schema regressions."],
        ["Phase 2: Transactions (Next Horizon)", "Payment & Notification Infrastructure", "• Live Razorpay / Cashfree SDK integration for instant UPI, cards, and net banking.\n• Automated WhatsApp Business API integration for instant order status alerts.\n• Merchant kitchen blackout calendar to pause bookings during peak wedding dates.\n• Customer order cancellation window (within 2 hours of placement before baking starts).\n• Photo upload attachments in verified customer reviews.", "Live transaction processing; inbound merchant support calls reduced by > 35%."],
        ["Phase 3: Intelligence (Scale Horizon)", "Kitchen Capacity & Dynamic Radius", "• Algorithmic delivery polygon mapping based on customer PIN code and bakery kitchen radius.\n• Dynamic kitchen scheduling engine calculating daily oven capacity in kilograms.\n• Seasonal flavor recommendations (e.g. Alphonso Mango in summer, Kesar Pista in winter).\n• Occasion reminder engine prompting repeat orders 14 days before family anniversaries.", "Repeat order rate > 25%; average bakery turnaround time < 2 hours."],
        ["Phase 4: Ecosystem (Expansion Horizon)", "Mobile Apps & B2B Gifting", "• Native mobile applications (iOS & Android) built via React Native sharing design tokens.\n• Multi-city expansion into Tier-1 metros (Delhi NCR, Bengaluru, Hyderabad, Pune, Chennai).\n• Corporate B2B gifting portal with bulk GST invoicing and scheduled multi-address dispatch.\n• Interactive WebGL 3D cake builder preview with augmented reality surface projection.", "10,000+ monthly delivered orders; nationwide artisanal patisserie network."]
    ]
    add_table_component(doc, roadmap_headers, roadmap_rows, col_widths=[1.3, 1.6, 2.3, 1.47], text_size=8.5)

    # =========================================================================
    # SECTION 32: FUTURE FEATURES STRATEGIC EVALUATION
    # =========================================================================
    add_h1(doc, "32. Future Features Strategic Evaluation")
    
    add_p(doc, "Historical documentation suggested various ambitious feature concepts. Below is a structured Product Management critique evaluating each concept across user value, business viability, and engineering complexity.")
    
    feat_eval = [
        ("Feature 1: Live Razorpay / Cashfree UPI Gateway Integration",
         "Why it matters: Eliminates reliance on Pay on Delivery and manual UPI invoice transfers, unlocking instant automated settlement and automated refunds upon bakery rejection.",
         "User Value: High. Seamless one-click checkout via Google Pay, PhonePe, and Paytm.",
         "Business Value: Massive. Decreases checkout drop-off, enables automated platform commission collection (15% take-rate), and eliminates cash handling.",
         "Technical Complexity: Moderate. Standard webhook handling with HMAC signature validation and payment status reconciliation.",
         "Strategic Priority: P0 (Immediate Priority for Phase 2)."),

        ("Feature 2: Automated WhatsApp Business API Notifications",
         "Why it matters: WhatsApp is India's default communication channel. Sending automated alerts for `ACCEPTED`, `PREPARING`, and `OUT_FOR_DELIVERY` meets users where they already are.",
         "User Value: High. Instant, anxiety-free updates without needing to remember login passwords or visit the website.",
         "Business Value: High. Slashes inbound support inquiries and customer phone calls to bakeries by over 60%.",
         "Technical Complexity: Low to Moderate. Integration with Meta WhatsApp Cloud API or Twilio via message template webhooks.",
         "Strategic Priority: P0 (Immediate Priority for Phase 2)."),

        ("Feature 3: Dynamic Kitchen Capacity & Blackout Scheduling",
         "Why it matters: Boutique artisan kitchens have finite oven and chef capacity. During major wedding seasons or festival weekends, bakeries get overwhelmed.",
         "User Value: Medium. Prevents disappointed customers from having their orders rejected after waiting hours.",
         "Business Value: High. Prevents merchant burnout and protects brand trust by enforcing realistic kitchen workloads.",
         "Technical Complexity: Moderate. Adding daily capacity ceilings (`max_daily_kg`) and blackout date ranges to the bakery profile.",
         "Strategic Priority: P1 (Phase 2)."),

        ("Feature 4: AI-Powered Cake Inscription & Flavor Pairing Assistant",
         "Why it matters: Customers frequently struggle with what to write on birthday cakes or whether a Rasmalai sponge pairs well with chocolate ganache.",
         "User Value: Medium. Provides creative inspiration for celebration messages and validates flavor harmony.",
         "Business Value: Moderate. Minor lift in custom studio completion; strong PR and marketing novelty.",
         "Technical Complexity: Moderate. LLM prompt wrapper with culinary guardrails and token filtering.",
         "Strategic Priority: P3 (Phase 3 Horizon)."),

        ("Feature 5: Interactive 3D WebGL / Augmented Reality (AR) Cake Preview",
         "Why it matters: Allows customers to project a 3D model of their custom 2-tier cake onto their dining table to visualize scale before ordering.",
         "User Value: Moderate. High visual delight, but does not solve core culinary or logistics pain points.",
         "Business Value: Low to Moderate. High development effort with marginal conversion lift on standard 1.0 Kg cakes.",
         "Technical Complexity: Very High. Requires 3D procedural mesh generation based on 8 dynamic builder parameters and WebXR compatibility.",
         "Strategic Priority: P4 (Future Vision - Not Recommended for Core Marketplace).")
    ]
    
    for title, why, u_val, b_val, comp, prio in feat_eval:
        add_h2(doc, title)
        add_p(doc, f"**Strategic Rationale:** {why}")
        add_p(doc, f"**User Value Assessment:** {u_val}")
        add_p(doc, f"**Business Value Assessment:** {b_val}")
        add_p(doc, f"**Technical Complexity:** {comp}")
        add_p(doc, f"**PM Prioritization Verdict:** {prio}")

    # =========================================================================
    # SECTION 33: EXPLICIT NON-GOALS & BOUNDARIES
    # =========================================================================
    add_h1(doc, "33. Explicit Non-Goals & Boundaries")
    
    add_p(doc, "Defining what a product will **NOT** build is just as critical as defining what it will build. The following non-goals are formally excluded from the current and near-term product boundaries to preserve focus and operational viability:")
    
    add_bullet(doc, "Non-Goal 1: Mass Quick-Commerce Instant Delivery:", "Whisk & Layers will NOT build 15-minute or 30-minute delivery infrastructure. Handcrafted celebration cakes require minimum 24-to-72-hour artisan preparation. Competing with Blinkit/Zepto on speed compromises gourmet culinary integrity.")
    add_bullet(doc, "Non-Goal 2: Fully Autonomous AI-Generated Free-Form Baking:", "Whisk & Layers will NOT allow customers to type unconstrained natural language prompts for automated cake generation. Customization is strictly constrained to vetted, realistic culinary tokens to prevent unfulfillable kitchen requests.")
    add_bullet(doc, "Non-Goal 3: In-House Two-Wheeler Delivery Fleet:", "Whisk & Layers will NOT employ or manage an in-house delivery fleet. Fragile, multi-tier celebration cakes require specialized fragile-handling transport or temperature-controlled four-wheelers managed via specialized 3PL logistics partners.")
    add_bullet(doc, "Non-Goal 4: Complex Bakery Enterprise Resource Planning (ERP):", "Whisk & Layers is a customer-facing marketplace and order management tool, NOT a full-scale accounting, raw ingredient procurement, or payroll ERP for bakeries.")
    add_bullet(doc, "Non-Goal 5: International Delivery & Non-INR Currency:", "Whisk & Layers will NOT support cross-border deliveries or international currencies in MVP. Focus remains exclusively on domestic Indian urban celebration hubs.")

    # =========================================================================
    # SECTION 34: OPEN PRODUCT QUESTIONS & UNRESOLVED DECISIONS
    # =========================================================================
    add_h1(doc, "34. Open Product Questions & Unresolved Decisions")
    
    add_p(doc, "A mature product document explicitly documents open strategic questions that require operational pilot testing and empirical data post-launch:")
    
    open_q_headers = ["Question #", "Strategic Product Dilemma", "Candidate Options Under Review", "Resolution Criteria & Metric"]
    open_q_rows = [
        ["OQ-01", "What should be the maximum SLA window for bakery order decisions before auto-cancelling?", "Option A: 4 hours daytime SLA.\nOption B: 8 hours daytime SLA.\nOption C: Dynamically scaling based on lead days notice.", "Measure pending order bounce rate and merchant response patterns across 100 pilot orders."],
        ["OQ-02", "Who bears financial liability if a cake is damaged during fragile courier transit?", "Option A: 50/50 split between marketplace and bakery.\nOption B: Mandatory delivery insurance fee (₹25) covering damaged goods.\nOption C: Dedicated fragile courier guarantee.", "Analyze transit damage claim rate across initial 500 completed deliveries."],
        ["OQ-03", "When should payment capture occur in the two-stage approval workflow?", "Option A: Pre-authorize card/UPI at checkout; capture only upon bakery acceptance.\nOption B: Charge upfront; auto-refund via Razorpay if declined.\nOption C: Pay on delivery only.", "Test customer checkout drop-off vs. refund friction across A/B gateway pilot."],
        ["OQ-04", "Should customer order cancellation be permitted after the bakery accepts?", "Option A: No cancellations permitted once status == `ACCEPTED`.\nOption B: 50% refund window until baking starts (`PREPARING`).\nOption C: Free cancellation up to 24 hours prior to delivery date.", "Evaluate merchant ingredient spoilage loss against customer satisfaction and dispute volume."],
        ["OQ-05", "What is the optimal platform take-rate commission structure?", "Option A: Flat 15% commission on order total.\nOption B: Tiered commission: 12% for signature cakes, 18% for custom studio cakes.\nOption C: Monthly subscription SaaS fee + 5% transaction fee.", "Survey pilot bakery partners and benchmark against Swiggy/Zomato merchant take-rates (22-28%)."]
    ]
    add_table_component(doc, open_q_headers, open_q_rows, col_widths=[0.8, 1.8, 2.3, 1.77], text_size=8.5)

    # =========================================================================
    # SECTION 35: PRODUCT ASSUMPTIONS REGISTER
    # =========================================================================
    add_h1(doc, "35. Product Assumptions Register")
    
    add_p(doc, "To maintain factual clarity, verified technical capabilities are cleanly separated from behavioral market hypotheses:")
    
    add_h2(doc, "35.1 Confirmed Technical Capabilities (Verified in Codebase)")
    add_bullet(doc, "Assumption T-01 (Validated):", "SQLite relational disk storage reliably manages relational integrity and ACID transactions for single-server Node.js deployments.")
    add_bullet(doc, "Assumption T-02 (Validated):", "Stateless JWT tokens provide secure role authorization across Customer, Bakery, and Admin user accounts.")
    add_bullet(doc, "Assumption T-03 (Validated):", "Single-bakery cart isolation prevents cross-city logistics conflicts and simplifies lead-time enforcement.")
    add_bullet(doc, "Assumption T-04 (Validated):", "Zod schema validation effectively eliminates invalid Indian phone numbers, malformed addresses, and bad prices before logic execution.")

    add_h2(doc, "35.2 Unvalidated Market & Behavioral Hypotheses (To be Tested)")
    add_bullet(doc, "Hypothesis M-01 (Unvalidated):", "Customers are willing to book bespoke celebration cakes 48 to 72 hours in advance rather than seeking last-minute same-day delivery.")
    add_bullet(doc, "Hypothesis M-02 (Unvalidated):", "Independent bakery owners will check the digital dashboard reliably during baking shifts without requiring loud audio alerts or phone calls.")
    add_bullet(doc, "Hypothesis M-03 (Unvalidated):", "Customers will pay a flat ₹80 delivery fee for handcrafted celebration cakes if kitchen provenance and freshness are guaranteed.")
    add_bullet(doc, "Hypothesis M-04 (Unvalidated):", "Verified customer reviews restricted to delivered orders will generate higher consumer trust than Instagram screenshots.")

    # =========================================================================
    # SECTION 36: KEY PRODUCT DECISIONS LOG
    # =========================================================================
    add_h1(doc, "36. Key Product Decisions Log")
    
    add_p(doc, "The following architectural and design decisions were established during development to balance culinary realities with technical feasibility:")
    
    dec_headers = ["Decision ID", "Product Decision", "Context & Rationale", "Alternative Considered & Rejected"]
    dec_rows = [
        ["DEC-01", "Two-Stage Order Workflow (`PENDING` ➔ `ACCEPTED` / `REJECTED`)", "Boutique pastry chefs have finite oven and decorating capacity. Instant auto-confirmation causes overbooking and angry cancellations.", "Instant auto-order confirmation directly charging cards. Rejected because kitchens cannot bake infinite cakes simultaneously."],
        ["DEC-02", "Structured 8-Step Studio Over Free-Text Prompts", "Structured culinary tokens guarantee deterministic pricing, unambiguous kitchen execution, and prevent impossible decoration requests.", "Unconstrained free-text description prompt. Rejected due to severe misinterpretation risks and endless pricing debates."],
        ["DEC-03", "Strict Single-Bakery Cart Isolation", "Combining cakes from multiple bakeries requires multiple delivery couriers, causes disparate arrival times, and complicates dispute liability.", "Multi-bakery aggregated cart checkout. Rejected due to prohibitive logistics coordination complexity."],
        ["DEC-04", "Mandatory Rejection Reason Logging (min 5 chars)", "When an order is declined, customers need to understand why (e.g. fully booked vs out of stock) to preserve goodwill and prevent confusion.", "Silent 1-click rejection without reason. Rejected because it destroys consumer trust and feels like abandonment."],
        ["DEC-05", "India-First Localization Baseline (+91, PIN, INR ₹, Kg, Eggless)", "Reflects genuine Indian consumer psychology and postal logistics realities.", "Generic international templates (USD, lbs, 5-digit zip). Rejected as unviable for local Indian marketplace."]
    ]
    add_table_component(doc, dec_headers, dec_rows, col_widths=[1.0, 1.8, 2.1, 1.77], text_size=8.5)

    # =========================================================================
    # SECTION 37: TECHNICAL & PRODUCT TRADE-OFFS
    # =========================================================================
    add_h1(doc, "37. Technical & Product Trade-offs")
    
    add_p(doc, "Every robust product architecture requires conscious trade-offs between speed, flexibility, operational simplicity, and cognitive load. Below are 6 key trade-offs evaluated in Whisk & Layers:")
    
    trade_headers = ["Trade-off Dimension", "Chosen Implementation Path", "Trade-off Benefit Gained", "Operational / Engineering Cost", "Future Production Implication"]
    trade_rows = [
        ["1. Customization Depth vs Simplicity", "Structured 8-step token builder with locked base choices.", "Zero kitchen misinterpretation; 100% deterministic pricing; no phone negotiation.", "Cannot accommodate hyper-bespoke 3D sculpted fondant sculptures.", "Add optional 'Artisanal Reference Photo Upload' in Phase 2 for manual review."],
        ["2. Immediate Capture vs Two-Stage Approval", "Two-stage approval: Order placed in `PENDING`; kitchen accepts before commitment.", "Protects bakery capacity; eliminates false customer delivery promises.", "Introduces a waiting window before customer celebration plan is locked.", "Enforce 4-hour SLA timer with automated WhatsApp alert to prompt fast bakery action."],
        ["3. Single-Bakery vs Multi-Bakery Cart", "Strict single-bakery cart isolation.", "Clean single-point courier pickup; zero split-dispatch arrival timing collisions.", "Customer must complete separate orders if buying from two different bakeries.", "Maintain single-bakery cart; celebration centerpieces are overwhelmingly single-source."],
        ["4. SQLite Relational vs NoSQL Document DB", "Normalized SQLite relational disk persistence with foreign keys.", "ACID transaction guarantees; zero-setup local startup; standard SQL syntax.", "Single-file write locks if concurrent writes exceed high thresholds.", "Drop-in migration path to PostgreSQL / MySQL container for cloud scale."],
        ["5. Milestone States vs Live Courier GPS", "7-stage milestone state machine (`ACCEPTED`, `PREPARING`, `READY`, etc.).", "Reflects artisan baking realities (baking, chilling, boxing); zero expensive GPS fleet hardware.", "Customer does not see a moving delivery vehicle icon on a live map.", "Partner with 3PL logistics (Dunzo / Shadowfax) in Phase 3 for dispatch tracking link."],
        ["6. Standard Lead Days vs Real-Time Oven Slots", "Static `minimum_lead_days` configured per bakery storefront.", "Simple for bakery to configure; predictable advance notice.", "Does not dynamically reflect hourly kitchen workload or unexpected surges.", "Implement dynamic kitchen capacity scheduling engine in Phase 3."]
    ]
    add_table_component(doc, trade_headers, trade_rows, col_widths=[1.3, 1.4, 1.3, 1.3, 1.37], text_size=8.0)

    # =========================================================================
    # SECTION 38: IMPLEMENTATION GAPS & KNOWN LIMITATIONS AUDIT
    # =========================================================================
    add_h1(doc, "38. Implementation Gaps & Known Limitations Audit")
    
    add_p(doc, "True product leadership requires complete honesty regarding technical debt, partial implementations, and known system limitations. The following audit outlines current gaps and scheduled remediations:")
    
    gap_headers = ["Domain / Subsystem", "Identified Limitation / Gap", "Current Mitigation in Place", "Scheduled Production Remediation"]
    gap_rows = [
        ["Payment Gateway", "Live payment gateway (Razorpay) is in architectural readiness mock mode; orders default to `PAY_ON_DELIVERY` or mock UPI QR.", "Payment method selection persists in database; complete order lifecycle executes cleanly.", "Integrate official `@razorpay/razorpay-js` SDK and webhook reconciliation in Phase 2."],
        ["Image Hosting & Storage", "Uploaded cake and bakery imagery currently writes to local disk (`/uploads`) via Multer.", "`SafeImage.tsx` fallback handler catches broken image paths and renders graceful bakery imagery.", "Migrate media storage to Cloudinary or AWS S3 bucket with auto-generated WebP responsive thumbnails."],
        ["Push Notifications", "Notifications are currently stored in `notifications` table and polled via React `NotificationContext`.", "In-app bell badge displays unread count with real-time UI indicator.", "Implement WebSocket / Server-Sent Events (SSE) and WhatsApp Cloud API webhooks in Phase 2."],
        ["Directory Pagination", "Bakery and cake directories render all active records in a single responsive grid.", "Fast response (<50ms) on current seed data (<20 bakeries, <50 cakes).", "Implement server-side cursor pagination (`limit` / `offset`) prior to 100+ bakery scaling."],
        ["Dispute Resolution", "No self-serve customer dispute submission portal on delivered orders.", "Customers can leave star rating and review explaining issues.", "Build formal Dispute Ticket workflow in Admin console for transit damage claims."]
    ]
    add_table_component(doc, gap_headers, gap_rows, col_widths=[1.3, 1.8, 1.7, 1.87], text_size=8.5)

    # =========================================================================
    # SECTION 39: PRODUCT MANAGEMENT PORTFOLIO TAKEAWAYS
    # =========================================================================
    add_h1(doc, "39. Product Management Portfolio Takeaways")
    
    add_p(doc, "The conceptualization, architectural design, and full-stack execution of Whisk & Layers demonstrates core senior product management competencies across five essential disciplines:")
    
    add_h2(doc, "39.1 Demonstrated PM Competencies")
    add_bullet(doc, "1. Strategic Problem Framing & Market Empathy:", "Identified the high-stakes emotional nature of celebration cakes in India, recognizing why generic quick-commerce and unstructured WhatsApp DMs both fail to satisfy urban consumers and artisan pastry chefs.")
    add_bullet(doc, "2. Complex User Flow Simplification:", "Deconstructed an intricate 8-variable custom baking recipe into an intuitive, sequential 8-Step Studio that maintains continuous price transparency and eliminates cognitive anxiety.")
    add_bullet(doc, "3. Deep Technical & Architectural Collaboration:", "Architected a decoupled, type-safe full-stack system using React 18, Node.js, Express, and SQLite with Zod data contracts, stateless JWT auth, and automated Vitest regression test suites.")
    add_bullet(doc, "4. Ruthless Scope Boundary Governance:", "Enforced strict non-goals (rejecting unfeasible same-day 15-minute delivery and free-form unvalidated text prompts) to protect operational viability and kitchen capacity.")
    add_bullet(doc, "5. Pragmatic Product Trade-Offs:", "Demonstrated mature decision-making by balancing commercial needs (two-stage bakery approval workflow) against customer instant gratification to prevent catastrophic overbooking.")

    # =========================================================================
    # SECTION 40: EXECUTIVE RECRUITER CASE STUDY SUMMARY (ONE-PAGER)
    # =========================================================================
    add_h1(doc, "40. Executive Recruiter Case Study Summary (One-Pager)", page_break=True)
    
    add_callout(doc, "Whisk & Layers — Executive Portfolio Case Study", [
        "PRODUCT TITLE: Whisk & Layers | India-First Artisanal Customized Cake Marketplace",
        "AUTHOR & PM OWNER: Aditya Nair | Senior Product Manager Portfolio",
        "LIVE DEMO: https://desingnerlaunda05.github.io/whisk-and-layers/",
        "TECH STACK: React 18, TypeScript, Vite 6, Node.js, Express, SQLite, Zod, Vitest"
    ], border_color=COLOR_PRIMARY_DARK)
    
    add_h2(doc, "40.1 The Problem")
    add_p(doc, "In India's urban metros, ordering bespoke celebration cakes is a chaotic ordeal: 45 to 90 minutes of unformatted WhatsApp messages, ad-hoc price negotiations, lost dietary requirements (100% Eggless), and zero order status visibility. Meanwhile, local bakeries lose 15+ hours weekly answering repetitive chats instead of baking.")
    
    add_h2(doc, "40.2 The Solution")
    add_p(doc, "Whisk & Layers connects celebration seekers with verified local bakeries through an intuitive **8-Step Custom Cake Studio**, live INR pricing, single-bakery cart isolation, advance lead-time protection, and a two-stage kitchen acceptance workflow with 7 milestone fulfillment stages.")
    
    add_h2(doc, "40.3 Key Product Decisions")
    add_bullet(doc, "Structured Builder Over Free-Text:", "Guarantees 100% deterministic pricing and eliminates culinary misinterpretations.")
    add_bullet(doc, "Two-Stage Kitchen Approval:", "Requires bakeries to explicitly accept or decline with a mandatory logged reason, protecting kitchen capacity.")
    add_bullet(doc, "India-First Ergonomics:", "+91 10-digit mobile validation, 6-digit PIN codes, Kilogram sizing (0.5 to 3.0 Kg), and prominent 100% Eggless visual badging.")
    
    add_h2(doc, "40.4 North Star Metric & Target Funnel")
    add_p(doc, "**North Star Metric Candidate:** Successfully Completed Customized Orders (SCCO) per Month.")
    add_bullet(doc, "Target KPIs:", "Studio completion rate > 60%; Cart-to-order conversion > 65%; Bakery turnaround SLA < 4 hours; Verified review platform average > 4.6 / 5.0.")

    # =========================================================================
    # SECTION 41: APPENDIX: SOURCE TRACEABILITY & EVIDENCE NOTES
    # =========================================================================
    add_h1(doc, "41. Appendix: Source Traceability & Evidence Notes")
    
    add_p(doc, "All specifications, entity models, business rules, and workflows documented in this PRD are directly traceable to specific source files, test suites, and database tables in the Whisk & Layers codebase:")
    
    trace_headers = ["PRD Section / Capability", "Source Code File / Artifact Path", "Verification Evidence & Test Status"]
    trace_rows = [
        ["Database Schema & Entities", "`backend/src/database/schema.ts`", "9 tables (`users`, `bakeries`, `cakes`, `orders`, etc.) with foreign keys and check constraints."],
        ["Automated Test Verification", "`backend/src/tests/api.test.ts`", "9/9 integration tests passing (Auth, Discovery, Custom Price, Order Lifecycle, Mandatory Rejection Reason)."],
        ["Order State Machine & Business Rules", "`backend/src/services/orderService.ts`", "Deterministic transition validation logic and mandatory rejection reason check (min 5 chars)."],
        ["Indian Validation Schemas", "`backend/src/validators/schemas.ts`", "Zod schemas enforcing `/^[6-9]\\d{9}$/` mobile, 6-digit PIN codes, and price positivity."],
        ["8-Step Custom Cake Studio", "`frontend/src/pages/customer/CustomCakeBuilderPage.tsx`", "Interactive 8-step builder state engine with dynamic INR summary card."],
        ["Single-Bakery Cart Isolation", "`frontend/src/context/CartContext.tsx`", "Active cart state checking bakery provenance and computing ₹80 delivery fee and 5% GST."],
        ["Milestone Order Timeline", "`frontend/src/components/ui/OrderTimeline.tsx`", "Visual step component rendering 7-stage fulfillment progress."],
        ["Live Deployment Adapter", "`frontend/src/services/apiClient.ts`, `deploy-pages.cjs`", "Static deployment build live on GitHub Pages with interactive demo switcher."]
    ]
    add_table_component(doc, trace_headers, trace_rows, col_widths=[1.8, 2.2, 2.67], text_size=8.5)

print("Compiled PRD Part 4 successfully.")
