# scripts/generate_main_prd_full.py
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls
import os
import win32com.client as win32

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=70, bottom=70, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def format_run(run, font_name="Calibri", size_pt=9.5, bold=False, italic=False, color_rgb=(0x33, 0x41, 0x55)):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor(*color_rgb)

def add_p(doc, text="", space_before=0, space_after=3, line_spacing=1.12, bold=False, italic=False, font_size=9.2, color=(0x33, 0x41, 0x55), align=WD_ALIGN_PARAGRAPH.LEFT):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if text:
        r = p.add_run(text)
        format_run(r, "Calibri", font_size, bold, italic, color)
    return p

def add_h1(doc, text, space_before=10, space_after=2):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    format_run(r, "Calibri", 12.5, bold=True, color_rgb=(0x0F, 0x17, 0x2A))
    return p

def add_h2(doc, text, space_before=6, space_after=1.5):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    format_run(r, "Calibri", 10.5, bold=True, color_rgb=(0x9B, 0x2C, 0x2C))
    return p

def add_bullet(doc, text, bold_prefix="", space_after=1.5):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.10
    if bold_prefix:
        r_pre = p.add_run(bold_prefix + " ")
        format_run(r_pre, "Calibri", 9.0, bold=True, color_rgb=(0x0F, 0x17, 0x2A))
    r_body = p.add_run(text)
    format_run(r_body, "Calibri", 9.0, color_rgb=(0x33, 0x41, 0x55))
    return p

def add_callout(doc, title, text, border_color="9B2C2C", bg_color="FFF8F6"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(7.0)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=60, bottom=60, left=120, right=100)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>'
        f'<w:top w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.line_spacing = 1.10
    
    r_title = p.add_run(title + ": ")
    format_run(r_title, "Calibri", 8.8, bold=True, color_rgb=(0x9B, 0x2C, 0x2C))
    
    r_text = p.add_run(text)
    format_run(r_text, "Calibri", 8.8, color_rgb=(0x33, 0x41, 0x55))
    
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(2)

def build_table(doc, headers, data, col_widths=None, align_right_cols=None):
    rows = len(data) + 1
    cols = len(headers)
    tbl = doc.add_table(rows=rows, cols=cols)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    set_table_borders(tbl, color="CBD5E1", sz="4")
    
    # Header Row
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].width = Inches(col_widths[i]) if col_widths else Inches(7.0 / cols)
        set_cell_background(hdr_cells[i], "1E293B")
        set_cell_margins(hdr_cells[i], top=55, bottom=55, left=70, right=70)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT if (align_right_cols and i in align_right_cols) else WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(title)
        format_run(r, "Calibri", 8.2, bold=True, color_rgb=(0xFF, 0xFF, 0xFF))
    
    # Body Rows
    for r_idx, row_data in enumerate(data):
        row_cells = tbl.rows[r_idx + 1].cells
        bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].width = Inches(col_widths[c_idx]) if col_widths else Inches(7.0 / cols)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=45, bottom=45, left=70, right=70)
            p = row_cells[c_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT if (align_right_cols and c_idx in align_right_cols) else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.06
            r = p.add_run(str(val))
            format_run(r, "Calibri", 7.8, color_rgb=(0x1E, 0x29, 0x3B))
            
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(2)
    return tbl

def generate_document():
    doc = docx.Document()
    
    # Page Setup: Letter, 0.75" Margins
    for s in doc.sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)
        s.different_first_page_header_footer = True
        
        # Header
        header = s.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("WHISK & LAYERS  |  PRODUCT REQUIREMENTS DOCUMENT (PRD)")
        format_run(hrun, "Calibri", 8.0, color_rgb=(0x94, 0xA3, 0xB8))
        
        # Footer
        footer = s.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        frun = fp.add_run("Author: Aditya Nair (Product Portfolio Owner)   |   Candidate MVP Baseline   |   Strict Verification Standard")
        format_run(frun, "Calibri", 8.0, color_rgb=(0x94, 0xA3, 0xB8))
        
    print("Writing Cover Page...")
    # ==================== COVER PAGE ====================
    add_p(doc, "PRODUCT REQUIREMENTS DOCUMENT  |  PORTFOLIO BASELINE SPECIFICATION", space_before=16, space_after=8, font_size=9, bold=True, color=(0x9B, 0x2C, 0x2C))
    
    p_title = add_p(doc, "WHISK & LAYERS", space_before=0, space_after=4, font_size=26, bold=True, color=(0x0F, 0x17, 0x2A))
    
    p_sub = add_p(doc, "India-First Artisanal Customized Cake Marketplace & Production System", space_before=0, space_after=12, font_size=12, italic=True, color=(0x47, 0x55, 0x69))
    
    add_p(doc, "A full-stack vertical marketplace connecting urban celebration planners with verified independent boutique bakeries. Features structured 8-step cake customization, 3D visual preview, single-bakery cart isolation, mandatory order rejection logging, and stage-by-stage fulfillment tracking.", space_before=0, space_after=16, font_size=9.5, color=(0x33, 0x41, 0x55))
    
    meta_headers = ["Metadata Dimension", "Document Specification"]
    meta_data = [
        ["Document Identifier", "PRD-WL-2026-FINAL (Core Recruiter & Engineering Baseline)"],
        ["Product Portfolio Owner", "Aditya Nair (Candidate Author & Portfolio Owner)"],
        ["Functional Scope", "Product Strategy, Marketplace Mechanics, Custom Studio UX, Relational Architecture"],
        ["Implementation Stage", "Implemented MVP Prototype (Local Full-Stack & GitHub Pages Demo)"],
        ["Target Geographic Hubs", "Tier-1 / Tier-2 Metros: Ahmedabad, Vadodara, Rajkot, Surat, Mumbai, Bengaluru, Delhi-NCR"],
        ["Measurement Standards", "INR (₹), Metric Weights (0.5 Kg to 3.0 Kg), Indian Mobile (+91), 6-Digit Postal PIN Codes"],
        ["Live Evaluation Demo", "https://desingnerlaunda05.github.io/whisk-and-layers/"],
        ["Codebase Repository", "https://github.com/DesingnerLaunda05/whisk-and-layers"],
        ["Automated Test Baseline", "Vitest 9/9 Passed (Locally Reproduced: Windows 11, Node v20+, Vitest v3.2.7)"],
        ["Release Date & Status", "October 2026  |  Final Executive Review Copy"],
    ]
    build_table(doc, meta_headers, meta_data, col_widths=[2.2, 4.8])
    
    add_callout(doc, "RECRUITER & EVALUATOR NOTE", 
        "This specification is an evidence-led product management portfolio artifact created by Aditya Nair. "
        "It distinguishes verified code implementations and local automated test passes from mock demo behaviors, "
        "unvalidated market hypotheses, and future production roadmap requirements. No stakeholder approvals, "
        "enterprise job titles, customer interview quotes, or production GMV numbers have been fabricated.")
    
    doc.add_page_break()
    
    print("Writing Section 1: Executive Summary & Verification Reality...")
    # ==================== SECTION 1 ====================
    add_h1(doc, "1. Executive Summary, Governance & Verification Reality")
    
    add_h2(doc, "1.1 Document Intent & Governance Context")
    add_p(doc, "This document serves as the recruiter-facing and engineering-defensible Product Requirements Document (PRD) for Whisk & Layers. The author, Aditya Nair, acts as the product portfolio owner who conceived the product strategy, mapped user journeys, designed the functional specifications, structured the relational data schemas, and built the functioning full-stack application prototype.")
    add_p(doc, "In accordance with professional product management integrity, this document contains no fabricated enterprise sign-off matrices, fictitious customer discovery counts, or synthetic financial figures. All quantitative claims are tied to either verified codebase logic, local integration test passes, or explicitly labeled unvalidated hypotheses requiring field research.")
    
    add_h2(doc, "1.2 Executive Product Summary")
    add_p(doc, "Whisk & Layers is a vertical, two-sided consumer marketplace designed to solve the operational chaos of ordering bespoke celebration cakes in urban India. Traditional quick-commerce aggregators (Blinkit, Zepto, Swiggy Instamart) solve for 15-minute fulfillment of standardized, mass-produced dry cakes, while food delivery aggregators (Swiggy, Zomato) offer basic catalog listings lacking multi-tier customization, structural weight modeling, or advance multi-day slot protection. Consequently, over an estimated majority of custom cake transactions remain trapped in unstructured WhatsApp chats and Instagram DMs.")
    add_p(doc, "Whisk & Layers establishes structured digital rails for bespoke baking: customers configure custom celebration cakes via an interactive 8-step builder with real-time 3D Three.js visualization, deterministic price updates, and advance preparation lead-time validation. Boutique artisan bakeries receive structured orders through a dedicated operations portal with mandatory rejection reason logging and milestone-driven status transitions.")
    
    add_h2(doc, "1.3 Verified Implementation Stage vs. Prototype Reality")
    add_p(doc, "To maintain absolute credibility, the platform capabilities are classified into distinct verification tiers:")
    
    verif_headers = ["Capability / Subsystem", "Claimed Status", "Verification Classification", "Evidence & Verification Notes"]
    verif_data = [
        ["Relational Schema & DB", "Implemented", "Verified in Code", "Universal SQLite schema (schema.ts) with 9 tables, foreign keys, and indexes initialized in data/whisk_layers.sqlite."],
        ["Backend REST Services", "Implemented", "Verified in Code", "Layered Express.js architecture (Controllers, Services, Repositories) with Zod validation (schemas.ts) and bcrypt."],
        ["Automated Test Suite", "9/9 Passing", "Tested Locally", "Reproduced via 'npm.cmd run test --workspace=backend': 9 Vitest integration tests passed in 726ms on Windows 11."],
        ["Live Interactive Demo", "Hosted", "Observed in Demo", "Deployed to GitHub Pages. Operates entirely as a static client-side application utilizing mockAdapter.ts fallback."],
        ["8-Step Custom Builder", "Implemented", "Verified in Code", "Interactive Studio with 8 customization steps + live Blueprint Summary Card and Three.js 3D model canvas."],
        ["Cart Lead Protection", "Enforced", "Verified in Code", "Single-bakery cart isolation and minimum lead-time date calculation enforced in CartContext.tsx and orderService.ts."],
        ["Checkout & Payments", "Simulated", "Configured Prototype Behavior", "Modal UI supports UPI QR, Card 3D-Secure, NetBanking, and COD. No live payment gateway (Razorpay/Cashfree) connected."],
        ["Logistics & Tracking", "Milestone UI", "Configured Prototype Behavior", "Orders display discrete status milestones (PENDING to DELIVERED). No live GPS courier tracking or 3PL API integrated."],
        ["Dietary Standards", "Eggless Badging", "Configured Prototype Behavior", "100% Eggless badges stored in catalog metadata. Kitchen cross-contamination prevention remains an operational requirement."],
        ["Delivery Fee & GST", "Calculated", "Configured Prototype Behavior", "Hardcoded ₹80 flat delivery and 5% GST configured in orderService.ts; pending formal accounting/legal verification."],
        ["Market Problem Metrics", "80% Chat Orders", "Hypothesis (Unvalidated)", "Specific metrics (80% WhatsApp volume, 45-90 min coordination, 40% baker inquiry time) represent unvalidated hypotheses."],
    ]
    build_table(doc, verif_headers, verif_data, col_widths=[1.5, 1.0, 1.6, 2.9])
    
    add_h2(doc, "1.4 Live Demo Architecture & Backend Hosting Reality")
    add_p(doc, "The live web demonstration is hosted via GitHub Pages (https://desingnerlaunda05.github.io/whisk-and-layers/). GitHub Pages provides static asset hosting and does not run a Node.js Express server or persist a remote SQLite database. In the demo deployment:")
    add_bullet(doc, "All network fetch requests to /api fail or return 404 because there is no remote cloud backend connected.", "Client-Side Mock Fallback:")
    add_bullet(doc, "The frontend apiClient.ts catches fetch errors and routes all requests to mockAdapter.ts, which reads and writes to an in-memory/localStorage mock data store (mockDataStore.ts).", "Seamless Evaluator UX:")
    add_bullet(doc, "To evaluate genuine database persistence and backend Zod validations, the application must be executed locally via 'npm run dev', which launches Express on port 5000 and Vite on port 5173 with proxy routing.", "Local Full-Stack Execution:")
    
    add_h2(doc, "1.5 Critical Known Limitations & Operational Boundaries")
    add_bullet(doc, "Authentication JWTs are stored in browser localStorage. Production deployment requires HttpOnly, Secure, SameSite cookies to mitigate Cross-Site Scripting (XSS) risks.", "Client Token Storage:")
    add_bullet(doc, "Rate limiting is configured via express-rate-limit in memory on single-instance Express. Distributed Redis rate limiting is required for multi-instance scaling.", "Rate Limiting & Abuse Protection:")
    add_bullet(doc, "Order updates rely on client pull / page re-renders. Automated WhatsApp Business API alerts and SMS webhooks are designated as Phase 2 requirements.", "Notification Delivery:")
    add_bullet(doc, "Because payments are simulated, if a bakery rejects an order, no automated refund webhook executes. Refund liability handling represents an open operational decision.", "Post-Payment Order Rejection:")
    
    print("Writing Section 2: Problem Framing & Research Evidence...")
    # ==================== SECTION 2 ====================
    add_h1(doc, "2. Problem Framing, Market Context & Competitive Alternatives")
    
    add_h2(doc, "2.1 The Status Quo: The Frictional Reality of Social Commerce")
    add_p(doc, "Bespoke celebration cakes are high-stakes, emotionally charged purchases. Unlike everyday groceries or lunch takeout, a custom anniversary or birthday cake has an inflexible delivery deadline, multi-generational dietary sensitivities, and aesthetic expectations. In urban India, the current buying workflow takes place primarily through informal social messaging channels (WhatsApp chats, Instagram Direct Messages, phone calls), introducing severe operational failure points:")
    add_bullet(doc, "Customers submit ambiguous requests ('Need a 1 kg chocolate cake with pastel flowers for Saturday'). Bakers must exchange 6 to 10 follow-up messages to clarify sponge type, fillings, structural tiers, shape, and lettering.", "Unstructured Requirements:")
    add_bullet(doc, "In vegetarian and Jain households, eggless integrity is mandatory. In unorganized chat threads, verbal requests are easily overlooked by baking staff, resulting in ruined celebrations and reputational damage.", "Lost Dietary Mandates:")
    add_bullet(doc, "Bakers quote arbitrary prices on chat threads. Surcharges for tiered dowels, custom cake boards, or exotic fruit compotes are introduced late in the interaction, creating price anxiety and customer mistrust.", "Opaque, Arbitrary Pricing:")
    add_bullet(doc, "Payment verification relies on customers sharing manual UPI payment screenshots. Bakers must manually cross-check bank SMS notifications while actively managing kitchen production.", "Manual Payment Reconciliation:")
    add_bullet(doc, "On celebration day, customers send anxious status inquiries. Bakers, actively decorating, cannot respond in real time, causing customer panic.", "Zero Fulfillment Visibility:")
    
    add_h2(doc, "2.2 Formal Product Problem Statement")
    add_callout(doc, "FORMAL PRODUCT PROBLEM STATEMENT",
        "Celebration planners in urban India lack a structured, reliable digital platform to discover local artisan bakeries, "
        "configure custom cake specifications with upfront transparent pricing, and track advance orders. "
        "Simultaneously, independent artisan bakeries lack dedicated operational software to filter uncommitted inquiries, "
        "enforce mandatory preparation lead times, protect kitchen capacity, and capture structured, paid orders.")
    
    add_h2(doc, "2.3 Market Opportunity & Credible Industry Context")
    add_p(doc, "India's commercial bakery sector represents a substantial and expanding market, driven by rapid urbanization, rising disposable incomes, and the cultural proliferation of celebratory micro-occasions:")
    add_bullet(doc, "The broader Indian bakery market was valued at approximately USD 13.8 Billion to USD 14.1 Billion, projected to grow at a Compound Annual Growth Rate (CAGR) of 8.3% to 9.5% over the next decade (Source: IMARC Group, 'India Bakery Market Report', 2024; Spherical Insights, 2024).", "Indian Bakery Market Size:")
    add_bullet(doc, "Within bakery, the standalone Indian cakes and pastries segment is valued at over USD 540 Million, expanding at an estimated CAGR of 5.8% to 6.0% (Source: Research and Markets, 'India Cakes Market - Growth, Trends, and Forecast', 2024).", "Cakes & Pastries Sector:")
    add_bullet(doc, "Consumers are increasingly migrating from unorganized local neighborhood sweet shops to premium organized retail, cloud bakeries, and bespoke artisanal dessert studios offering gourmet flavors, French pastry techniques, and specialized dietary formulations (eggless, vegan, gluten-free).", "Premiumization & Dietary Shift:")
    
    add_h2(doc, "2.4 Research Evidence Audit & Operational Hypotheses")
    add_p(doc, "The original project documentation cited specific operational metrics regarding consumer and merchant friction. To maintain research integrity, these figures are formally classified as Unvalidated Operational Hypotheses:")
    
    hyp_headers = ["Quantitative Claim", "Original Assumption", "Research Classification", "Proposed Validation Methodology"]
    hyp_data = [
        ["Channel Concentration", "80% of custom cake orders occur via WhatsApp / Instagram DMs.", "Hypothesis (Unvalidated)", "Survey 25 urban boutique bakeries across Mumbai and Ahmedabad to quantify inquiry sources."],
        ["Customer Friction", "Customers spend 45 to 90 minutes back-and-forth per custom order.", "Hypothesis (Unvalidated)", "Time-and-motion study of 20 celebration planners ordering custom cakes via messaging apps."],
        ["Merchant Time Loss", "Bakers spend up to 40% of their working hours answering repetitive inquiries.", "Hypothesis (Unvalidated)", "Shadow 10 artisan bakers across a 5-day cycle to log time spent on messaging vs kitchen production."],
        ["Operational Savings", "Standardized forms save 15 to 20 hours of baker communication weekly.", "Hypothesis (Unvalidated)", "Measure order processing duration before and after adopting structured order forms."],
        ["Average Order Value", "Custom celebration cakes range between ₹1,200 and ₹2,800 AOV.", "Directionally Plausible", "Benchmark against published menus of 30 artisan bakeries across Gujarat and Maharashtra."],
    ]
    build_table(doc, hyp_headers, hyp_data, col_widths=[1.5, 1.8, 1.4, 2.3])
    
    add_h2(doc, "2.5 Structured Discovery Research Plan")
    add_p(doc, "To transition these hypotheses into validated user insights, the following qualitative discovery research protocol will be executed prior to commercial capital deployment:")
    add_bullet(doc, "Recruit 12 commercial bakery owners (ranging from home-based cloud bakers producing 15 cakes/week to established boutique studios producing 100+ cakes/week). Assess order intake channels, lead-time management, rejection reasons, and payment reconciliation pain points.", "Merchant Discovery (Cohort A):")
    add_bullet(doc, "Recruit 18 urban celebration planners who purchased at least 2 custom cakes in the past 12 months. Map the discovery process, pricing friction, anxiety triggers, and dietary verification expectations.", "Consumer Discovery (Cohort B):")
    
    add_h2(doc, "2.6 Competitive & Alternative Landscape Matrix")
    add_p(doc, "Existing market alternatives solve adjacent food delivery jobs but fail the specific requirements of bespoke celebration cakes:")
    
    comp_headers = ["Observable User Job", "Swiggy / Zomato", "Blinkit / Zepto (Q-Commerce)", "WhatsApp / Instagram DMs", "Whisk & Layers (Proposed)"]
    comp_data = [
        ["Custom Cake Studio", "None; off-the-shelf catalog only.", "None; mass-produced SKUs only.", "Infinite flexibility, but unstructured.", "8-step guided builder + 3D Three.js visualizer."],
        ["Pricing Transparency", "Fixed menu price; no option pricing.", "Fixed low price; no customization.", "Opaque; manual quotes, surprise add-ons.", "Deterministic live calculation; base + option surcharges."],
        ["Advance Lead Protection", "Immediate or same-day scheduling.", "10-15 minute immediate delivery.", "Manual negotiation; prone to error.", "Enforced minimum lead days (2-5 days) before checkout."],
        ["Order Acceptance SLA", "Automated / algorithmic merchant ping.", "Instant automated warehouse picking.", "Unpredictable; baker replies in 1-6 hours.", "Dedicated dashboard with mandatory rejection reason."],
        ["Fulfillment Visibility", "Real-time rider GPS tracking.", "Minute-by-minute rider GPS tracking.", "Zero visibility; anxious text follow-ups.", "Discrete milestone status updates (Baking to Ready)."],
        ["Dietary Assurance", "Basic restaurant tag; no recipe breakdown.", "Pre-packaged factory ingredient list.", "Verbal promise; prone to kitchen error.", "Prominent 100% Eggless badges + recipe snapshot."],
    ]
    build_table(doc, comp_headers, comp_data, col_widths=[1.4, 1.4, 1.4, 1.4, 1.4])
    
    print("Writing Section 3: Personas & JTBD...")
    # ==================== SECTION 3 ====================
    add_h1(doc, "3. Primary User Segments, Proto-Personas & Jobs to be Done")
    
    add_h2(doc, "3.1 Primary User Segmentation")
    add_p(doc, "Whisk & Layers operates as a two-sided marketplace serving two primary user groups, enabled by an administrative governance role:")
    add_bullet(doc, "Urban consumers arranging cakes for milestone birthdays, anniversaries, baby showers, or corporate events.", "1. Celebration Planners (Demand Side):")
    add_bullet(doc, "Independent boutique pastry chefs, licensed home studios, and specialty bakeries handcrafting gourmet cakes.", "2. Artisan Bakery Merchants (Supply Side):")
    add_bullet(doc, "Internal team members managing storefront onboarding, reviewing business verification, and monitoring GMV.", "3. Platform Administrators (Enabling Operations):")
    
    add_h2(doc, "3.2 Customer Proto-Persona: The Celebration Planner")
    add_p(doc, "Replacing anecdotal personal references, the primary customer archetype is framed as an illustrative proto-persona:")
    
    cust_headers = ["Persona Dimension", "Celebration Planner Archetype (Illustrative Proto-Persona)"]
    cust_data = [
        ["Archetype Profile", "Urban Working Professional / Family Milestone Organizer (Age 26–42, Metros)."],
        ["Context & Triggers", "Organizes 3 to 6 celebratory occasions annually for family, spouses, and close friends. Values high aesthetic quality and reliable delivery."],
        ["Core Jobs to be Done", "Discover reputable local bakeries, specify multi-tier flavor/design preferences, guarantee 100% eggless compliance, and secure delivery timing without stress."],
        ["Key Frustrations", "Waiting hours for Instagram DM replies; hidden surcharges added after hours of chat; fear that the baker will forget the custom inscription or eggless mandate."],
        ["Technology Behaviors", "Heavy mobile UPI user (PhonePe, Google Pay); active on Instagram for visual inspiration; expects modern, responsive web experiences with instant feedback."],
        ["Expected Outcome", "A showstopping, freshly baked celebration cake delivered on time with zero operational friction."],
    ]
    build_table(doc, cust_headers, cust_data, col_widths=[2.0, 5.0])
    
    add_h2(doc, "3.3 Merchant Proto-Persona: The Artisan Bakery Owner")
    add_p(doc, "The merchant archetype reflects the operational reality of independent culinary creators:")
    
    merch_headers = ["Persona Dimension", "Artisan Bakery Merchant Archetype (Illustrative Proto-Persona)"]
    merch_data = [
        ["Archetype Profile", "Boutique Pastry Chef / Independent Bakery Founder (Managing 2–10 kitchen staff)."],
        ["Context & Triggers", "Specializes in high-margin, bespoke celebration cakes. Operates a commercial kitchen or licensed boutique studio in an urban hub."],
        ["Core Jobs to be Done", "Capture qualified custom cake orders; eliminate time wasted answering repetitive inquiries; protect kitchen capacity by enforcing advance lead times."],
        ["Key Frustrations", "Customers expecting elaborate 3-tier cakes with 4 hours' notice; haggling over prices in chat; cross-checking manual UPI screenshot deposits."],
        ["Technology Behaviors", "Manages operations primarily via smartphone; uses WhatsApp for business; willing to use a clean dashboard if it saves daily operational time."],
        ["Expected Outcome", "A steady, predictable stream of pre-paid custom orders with structured recipes and guaranteed preparation timelines."],
    ]
    build_table(doc, merch_headers, merch_data, col_widths=[2.0, 5.0])
    
    add_h2(doc, "3.4 Jobs to be Done (JTBD) Framework")
    add_bullet(doc, "When planning an important celebration, I want to customize a bespoke cake with upfront transparent pricing and guaranteed lead-time protection, so that I can delight my guests without operational anxiety.", "Customer Core Job:")
    add_bullet(doc, "Ensure strict compliance with vegetarian/eggless dietary mandates for family members.", "Customer Emotional Job:")
    add_bullet(doc, "When managing a busy kitchen, I want to receive fully structured custom cake orders with guaranteed payment and sufficient baking notice, so that my team can focus on culinary excellence rather than message coordination.", "Merchant Core Job:")
    add_bullet(doc, "Maintain brand reputation and culinary integrity without burning out on administrative overhead.", "Merchant Professional Job:")
    
    print("Writing Section 4: Product Vision & Metrics...")
    # ==================== SECTION 4 ====================
    add_h1(doc, "4. Product Vision, Value Proposition & Metrics Framework")
    
    add_h2(doc, "4.1 Product Vision & Core Guiding Principles")
    add_p(doc, "Vision Statement: To become India's most trusted vertical marketplace for handcrafted celebration cakes by combining creative customization freedom with disciplined operational fulfillment.")
    add_bullet(doc, "Every price displayed in the Custom Studio must be calculated deterministically from configured base and option surcharges. No hidden checkout fees.", "1. Deterministic Pricing Integrity:")
    add_bullet(doc, "Custom cakes require structural curing and baking time. The platform must strictly reject delivery dates shorter than the merchant's verified lead days.", "2. Strict Advance Lead-Time Protection:")
    add_bullet(doc, "Celebration cakes are delicate and custom-made. Delivery must be direct and refrigerated. Orders cannot be blended across multiple bakeries.", "3. Single-Bakery Cart Isolation:")
    add_bullet(doc, "If a merchant cannot fulfill an order, they must log a structured rejection reason (>= 5 chars) to inform the customer and platform operations.", "4. Mandatory Rejection Accountability:")
    
    add_h2(doc, "4.2 Candidate North Star Metric")
    add_callout(doc, "CANDIDATE NORTH STAR METRIC DEFINITION",
        "Successfully Completed Customized Orders (SCCO) per Month.\n"
        "Eligibility Criteria: An order placed through Whisk & Layers containing at least one custom cake configuration; "
        "successfully accepted by the merchant; fulfilled to 'DELIVERED' status; and free of customer damage disputes, "
        "rejections, or cancellations within a 30-day reporting window.\n"
        "Current Baseline: Unmeasured / 0 (Provisional baseline pending live commercial pilot instrumentation).")
    
    add_h2(doc, "4.3 Provisional Supporting Product Metrics")
    add_p(doc, "Funnel metrics are established to guide analytical instrumentation. All targets are provisional hypotheses pending baseline measurement:")
    
    metric_headers = ["Funnel Dimension", "Candidate Metric", "Definition / Formula", "Baseline Status", "Provisional Target", "Strategic Decision Informed"]
    metric_data = [
        ["Acquisition", "Studio Initiation Rate", "Users visiting /custom-builder / Unique visitors", "Unmeasured", "> 25% of visitors", "Evaluate discovery navigation & home page hero CTA effectiveness."],
        ["Activation", "Custom Cake Builder Completion", "Custom items added to cart / Studio sessions started", "Unmeasured", "> 40% completion", "Identify drop-off steps across the 8 customization steps."],
        ["Conversion", "Checkout Conversion Rate", "Completed orders submitted / Cart sessions created", "Unmeasured", "> 60% conversion", "Assess checkout friction, PIN validation errors, and payment trust."],
        ["Operations", "Bakery Acceptance Rate", "Accepted orders / Total pending orders received", "Unmeasured", "> 85% acceptance", "Identify merchant capacity mismatches and lead-time setting issues."],
        ["Operations", "Bakery Response SLA", "Median time from order submission to accept/reject", "Unmeasured", "< 90 minutes", "Determine when to trigger automated WhatsApp/SMS merchant escalations."],
        ["Retention", "Repeat Celebration Rate", "Customers ordering >= 2 times in 12 months / Total users", "Unmeasured", "> 20% annual", "Evaluate celebration date reminder feature and customer loyalty."],
        ["Quality", "Verified Review Satisfaction", "Average star rating on delivered orders (1.0 - 5.0)", "Unmeasured", "> 4.60 Stars", "Identify quality defects, transit damage, and bakery de-listing gates."],
    ]
    build_table(doc, metric_headers, metric_data, col_widths=[1.0, 1.3, 1.7, 0.9, 1.0, 1.1])
    
    add_h2(doc, "4.4 Strategic Prioritization Framework")
    add_p(doc, "Feature candidates are prioritized using a qualitative Impact × Effort evaluation. The mathematical RICE scores below are illustrative hypotheses to demonstrate strategic framework application:")
    
    rice_headers = ["Feature Candidate", "Reach (Target Occasions)", "Impact (1-3)", "Confidence (%)", "Effort (Person-Wks)", "Illustrative RICE", "Priority Tier"]
    rice_data = [
        ["Live Razorpay UPI Gateway", "100% of ordering users", "3.0 (High)", "90% (Proven API)", "2.0 wks", "135.0", "P0 (Near-Term Gate)"],
        ["WhatsApp Business Alerts", "90% of active users", "2.5 (High)", "85% (Proven API)", "2.0 wks", "95.6", "P0 (Near-Term Gate)"],
        ["Bakery Capacity Calendar", "100% of bakeries", "2.5 (High)", "80% (Operational)", "3.0 wks", "66.7", "P1 (Fast Follow)"],
        ["Customer Photo Reviews", "40% of delivered users", "2.0 (Med)", "85% (Standard)", "1.5 wks", "45.3", "P1 (Fast Follow)"],
        ["Dynamic 3PL Radius Dispatch", "70% of urban users", "2.0 (Med)", "70% (Logistics API)", "4.0 wks", "24.5", "P2 (Phase 3)"],
        ["AI Flavor Assistant", "35% of studio users", "1.5 (Low)", "60% (Experimental)", "3.0 wks", "10.5", "P3 (Deferred)"],
    ]
    build_table(doc, rice_headers, rice_data, col_widths=[1.6, 1.1, 0.7, 0.9, 1.0, 0.9, 0.8], align_right_cols=[5])
    
    print("Writing Section 5: Core User Journeys...")
    # ==================== SECTION 5 ====================
    add_h1(doc, "5. Core User Journeys & Experience Architecture")
    
    add_h2(doc, "5.1 Customer End-to-End Journey")
    add_p(doc, "The customer journey is designed to replace fragmented messaging with a progressive disclosure workflow:")
    add_bullet(doc, "Customer browses curated local bakeries filtered by Indian city, minimum lead notice, and dietary tags. Inspects bakery kitchen credentials, rating averages, and specialty catalogs.", "1. Discovery & Curation:")
    add_bullet(doc, "Customer selects 'Custom Cake Studio'. Chooses across 8 structured variables (Tiers/Shape, Sponge, Gourmet Filling, Frosting Palette, Accent Piping, 3D Garnishes, Dietary Standard, Inscription Plaque). Reviews real-time 3D model canvas.", "2. Interactive Studio Configuration:")
    add_bullet(doc, "Customer reviews Blueprint Summary Card showing itemized price and calculated earliest delivery date. Clicks 'Add to Cart'. System validates that existing cart items belong to the same bakery.", "3. Blueprint Review & Cart Isolation:")
    add_bullet(doc, "Customer selects delivery date (enforcing bakery minimum lead days) and 3-hour time slot. Inputs 10-digit Indian phone and 6-digit postal PIN code address. Selects payment method (UPI / Card / NetBanking / COD).", "4. Advance Slot Checkout:")
    add_bullet(doc, "Customer monitors visual timeline (PENDING -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED). Receives in-app updates upon each milestone transition.", "5. Milestone Fulfillment Tracking:")
    add_bullet(doc, "Upon confirmed delivery, customer receives review eligibility and submits star rating and feedback.", "6. Verified Post-Delivery Feedback:")
    
    add_h2(doc, "5.2 Bakery Merchant End-to-End Journey")
    add_p(doc, "The bakery portal provides structured kitchen operations to eliminate communication overhead:")
    add_bullet(doc, "Bakery receives urgent notification of incoming pending order. Inspects complete cake blueprint (tiers, sponge, fillings, inscription text, reference photo, delivery date, time slot, customer address).", "1. Order Intake & Review:")
    add_bullet(doc, "Bakery either accepts order (moving status to ACCEPTED) or rejects order with mandatory reason logging (>= 5 characters, e.g., 'Fully booked for wedding catering on this date').", "2. Acceptance / Rejection SLA:")
    add_bullet(doc, "Kitchen staff advances order milestones: 'Start Baking' (PREPARING) -> 'Boxed & Ready' (READY) -> 'Dispatched' (OUT_FOR_DELIVERY) -> 'Delivered' (DELIVERED).", "3. Milestone Production Progression:")
    add_bullet(doc, "Bakery owner manages cake catalog (pricing, active toggle, lead days), storefront profile, and reads/replies to verified customer reviews.", "4. Storefront & Catalog Governance:")
    
    add_h2(doc, "5.3 Platform Operations Journey")
    add_p(doc, "Administrators access an internal console to review platform-wide metrics (total registered users, approved bakeries, global orders, settled GMV), review and approve new bakery merchant onboarding applications, toggle bakery store visibility, and moderate user accounts.")
    
    print("Writing Section 6: Scope Boundaries & Non-Goals...")
    # ==================== SECTION 6 ====================
    add_h1(doc, "6. Product Scope Boundaries & Explicit Non-Goals")
    
    add_h2(doc, "6.1 MVP Scope vs. Future Roadmap Phases")
    add_p(doc, "Clear boundaries define current implementation from future planned enhancements:")
    
    scope_headers = ["Domain / Subsystem", "MVP (Current Implemented State)", "Phase 2 (Near-Term Gate)", "Phase 3 & 4 (Future Vision)"]
    scope_data = [
        ["Custom Cake Builder", "8-step builder + 3D Three.js model + Blueprint Summary Card.", "Photo reference uploader enhancement; preset celebration bundles.", "Augmented Reality (AR) mobile camera placement preview."],
        ["Cart & Checkout", "Single-bakery isolation, lead-time date validation, INR formatting.", "Multiple delivery address presets; celebration reminder scheduling.", "Multi-destination gift shipping to separate recipients."],
        ["Payment Processing", "Simulated UPI dynamic QR, Card 3D-Secure, NetBanking, COD.", "Live Razorpay / Cashfree UPI gateway with auto-refund on reject.", "Automated split payments and merchant escrow settlement."],
        ["Notifications", "In-app database notifications (notifications table).", "Automated WhatsApp Business API alerts and SMS gateways.", "Voice call fallback alerts for urgent unaccepted orders."],
        ["Logistics & Fulfillment", "Merchant self-delivery; milestone stage tracking.", "Refrigerated courier packaging guidelines and SLA audits.", "Automated 3PL hyperlocal dispatch (Dunzo / Shadowfax API)."],
        ["Merchant Operations", "Order accept/reject with mandatory reason; catalog management.", "Dynamic kitchen capacity blackout calendar and daily order caps.", "Multi-staff kitchen tablet KDS (Kitchen Display System)."],
    ]
    build_table(doc, scope_headers, scope_data, col_widths=[1.4, 1.9, 1.9, 1.8])
    
    add_h2(doc, "6.2 Explicit Non-Goals")
    add_bullet(doc, "Whisk & Layers will not hire, purchase, or operate a proprietary two-wheeler or van delivery fleet. Fulfillment is handled by merchant logistics or integrated third-party refrigerated 3PL couriers.", "No In-House Delivery Fleet:")
    add_bullet(doc, "The platform deliberately excludes standardized, mass-manufactured, shelf-stable dry cakes and industrial biscuits.", "No Mass-Produced Packaged Goods:")
    add_bullet(doc, "The platform does not support immediate 10-to-15 minute grocery delivery. Handcrafted cakes require structural curing and advance lead time.", "No Quick-Commerce Instant Fulfillment:")
    add_bullet(doc, "Algorithmic Uber-style surge pricing during festivals is rejected to maintain price predictability and customer trust.", "No Unannounced Surge Pricing:")
    add_bullet(doc, "Live video feeds of bakery kitchens are excluded due to kitchen privacy and operational distraction.", "No Live Video Streaming in Kitchens:")
    
    print("Writing Section 7: Key Requirements & Acceptance Criteria...")
    # ==================== SECTION 7 ====================
    add_h1(doc, "7. Prioritized Functional Requirements & Acceptance Criteria")
    
    add_p(doc, "Core functional requirements are detailed with user stories, acceptance criteria in Gherkin syntax, priority tier, and verified implementation status:")
    
    add_h2(doc, "FR-01: Customer Authentication & Session Management (Priority: P0 | Status: Verified in Code)")
    add_p(doc, "User Story: As a celebration customer, I want to securely register and log in using my email and password, so that my order history, delivery addresses, and cart are persisted across sessions.")
    add_p(doc, "Acceptance Criteria (Gherkin):", bold=True)
    add_bullet(doc, "Given a user provides an email, password (>= 6 chars), full name, and 10-digit Indian phone (+91), When they submit registration, Then an account is created with password bcrypt hashed, and a JWT token is returned.", "Scenario 1 (Valid Registration):")
    add_bullet(doc, "Given an unauthenticated user attempts to access /orders/my-orders or /checkout, When the route is intercepted, Then the system redirects to /login and preserves the redirect path.", "Scenario 2 (Protected Route Guard):")
    
    add_h2(doc, "FR-02: Bakery Discovery & Lead-Time Filtering (Priority: P0 | Status: Verified in Code)")
    add_p(doc, "User Story: As a celebration planner, I want to filter local bakeries by Indian city, minimum lead notice, and dietary specialties, so that I only browse bakeries capable of fulfilling my celebration schedule.")
    add_p(doc, "Acceptance Criteria (Gherkin):", bold=True)
    add_bullet(doc, "Given a customer selects city 'Ahmedabad' and lead time '<= 2 days', When the catalog updates, Then only verified bakeries matching those parameters are displayed with ratings and specialty badges.", "Scenario 1 (Discovery Filtering):")
    
    add_h2(doc, "FR-03: Interactive 8-Step Custom Cake Studio (Priority: P0 | Status: Verified in Code)")
    add_p(doc, "User Story: As a celebration customer, I want to configure a custom cake step-by-step across 8 distinct variables with live 3D visual preview and real-time price calculation, followed by a Blueprint review screen, so that I have complete confidence before purchasing.")
    add_p(doc, "Acceptance Criteria (Gherkin):", bold=True)
    add_bullet(doc, "Given a user accesses the Studio, When they select Tiers (1-4), Shape (Round/Heart/Square/Hexagon), Frosting Color, Accent Color, 3D Garnishes, Sponge Base, Gourmet Filling, Dietary Standard, and Celebration Inscription (max 65 chars), Then the Three.js 3D model renders the geometry, colors, and toppings in real time.", "Scenario 1 (8 Customization Choices):")
    add_bullet(doc, "Given the user completes their selections, When viewing the Blueprint Summary Card, Then the system displays an itemized price breakdown (Base Price + Tier Surcharges + Option Extras) with zero hidden fees.", "Scenario 2 (Blueprint Review Step):")
    
    add_h2(doc, "FR-04: Single-Bakery Cart Isolation & Lead-Time Enforcement (Priority: P0 | Status: Verified in Code)")
    add_p(doc, "User Story: As a customer, I want my cart to prevent multi-bakery conflicts and enforce advance lead-time calendar validation, so that my order can be freshly baked and delivered without logistical failure.")
    add_p(doc, "Acceptance Criteria (Gherkin):", bold=True)
    add_bullet(doc, "Given a cart containing items from Bakery A, When the customer attempts to add an item from Bakery B, Then the system presents a confirmation modal warning that adding Bakery B will clear Bakery A items.", "Scenario 1 (Cart Isolation Modal):")
    add_bullet(doc, "Given a bakery requires 3 days minimum lead notice, When the customer enters checkout on October 26, Then calendar delivery dates earlier than October 29 are disabled and cannot be selected.", "Scenario 2 (Lead-Time Date Lock):")
    
    add_h2(doc, "FR-05: Localized Indian Checkout & Payment Selection (Priority: P0 | Status: Configured Prototype)")
    add_p(doc, "User Story: As an Indian celebration shopper, I want to input a 6-digit postal PIN code address and choose my preferred payment method (UPI QR, Card, NetBanking, COD), so that I can complete checkout smoothly.")
    add_p(doc, "Acceptance Criteria (Gherkin):", bold=True)
    add_bullet(doc, "Given a customer selects Instant UPI, When checkout is confirmed, Then a simulated dynamic UPI QR code modal opens with NPCI transaction reference for evaluation.", "Scenario 1 (Simulated Payment Flow):")
    
    add_h2(doc, "FR-06: Bakery Order Acceptance & Mandatory Rejection Reason (Priority: P0 | Status: Verified in Code)")
    add_p(doc, "User Story: As a bakery owner, I want to accept incoming orders or decline them with a mandatory rejection explanation, so that my kitchen capacity is protected and customers receive clear communication.")
    add_p(doc, "Acceptance Criteria (Gherkin):", bold=True)
    add_bullet(doc, "Given a bakery receives a pending order, When they click 'Decline Order' without providing a reason, Then the system blocks submission with a validation error (Zod: minimum 5 characters required).", "Scenario 1 (Rejection Validation):")
    add_bullet(doc, "Given a bakery submits rejection with reason 'Fully booked for wedding catering', Then the order transitions to REJECTED and the customer receives an in-app notification containing the reason.", "Scenario 2 (Successful Rejection):")
    
    add_h2(doc, "FR-07: Stage-by-Stage Milestone Fulfillment Updates (Priority: P0 | Status: Verified in Code)")
    add_p(doc, "User Story: As a customer and bakery, I want orders to progress through discrete fulfillment milestones (PENDING -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED), so that everyone has visibility into cake production status.")
    add_p(doc, "Acceptance Criteria (Gherkin):", bold=True)
    add_bullet(doc, "Given an order in status READY, When the bakery marks 'Dispatch for Delivery', Then the order transitions to OUT_FOR_DELIVERY and customer timeline advances.", "Scenario 1 (Milestone Transition):")
    
    add_h2(doc, "FR-08: Verified Customer Reviews & Merchant Replies (Priority: P1 | Status: Verified in Code)")
    add_p(doc, "User Story: As a customer, I want to submit a review only after receiving my delivered cake, and as a baker, I want to post a public reply, so that marketplace ratings remain authentic and accountable.")
    add_p(doc, "Acceptance Criteria (Gherkin):", bold=True)
    add_bullet(doc, "Given a customer with an order in status PENDING or PREPARING, When they attempt to post a review, Then the backend rejects the request with HTTP 403 / 400 (only DELIVERED orders eligible).", "Scenario 1 (Review Guard):")
    
    print("Writing Section 8: Order Lifecycle & Rules Engine...")
    # ==================== SECTION 8 ====================
    add_h1(doc, "8. Order Lifecycle State Machine, Business Rules & High-Risk Exceptions")
    
    add_h2(doc, "8.1 Order State Machine Specification")
    add_p(doc, "The order lifecycle represents a disciplined state machine. The normal linear fulfillment progression flows through 6 sequential milestones, while REJECTED and CANCELLED represent alternate terminal branches:")
    
    sm_headers = ["Current Status", "Allowed Next Statuses", "Authorized Roles", "State Trigger & Transition Condition"]
    sm_data = [
        ["PENDING", "ACCEPTED, REJECTED, CANCELLED", "Bakery, Customer (Cancel), Admin", "Customer submits checkout. Bakery evaluates kitchen schedule within response window."],
        ["ACCEPTED", "PREPARING, CANCELLED", "Bakery, Admin", "Bakery confirms order feasibility and commits kitchen capacity to fulfillment date."],
        ["PREPARING", "READY", "Bakery, Admin", "Bakery begins baking sponges, whipping frostings, and hand-piping custom inscriptions."],
        ["READY", "OUT_FOR_DELIVERY, DELIVERED", "Bakery, Admin", "Cake is fully decorated, boxed, refrigerated, and packaged with structural dowels."],
        ["OUT_FOR_DELIVERY", "DELIVERED", "Bakery, Admin", "Order handed over to delivery driver for direct refrigerated transit to recipient address."],
        ["DELIVERED", "None (Terminal State)", "None (Final State)", "Order successfully received at doorstep. Triggers verified review submission eligibility."],
        ["REJECTED", "None (Terminal State)", "Bakery, Admin", "Alternate terminal state. Requires mandatory rejection reason (>= 5 chars) in database."],
        ["CANCELLED", "None (Terminal State)", "Customer, Bakery, Admin", "Alternate terminal state. Permitted prior to PREPARING stage; releases reserved date."],
    ]
    build_table(doc, sm_headers, sm_data, col_widths=[1.3, 1.8, 1.5, 2.4])
    
    add_callout(doc, "ORDER LIFECYCLE TERMINOLOGY RESOLUTION",
        "PENDING -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED represents the normal linear milestone progression. "
        "REJECTED is an alternate terminal branch from PENDING, not an additional linear step. Note that READY also allows a direct transition "
        "to DELIVERED in code to support customer direct store pickups.")
    
    add_h2(doc, "8.2 Business-Critical Pricing & Tax Rules Engine")
    add_bullet(doc, "For pre-built catalog items, unit price equals cake base_price. For custom cakes, unit price = starting base price (₹650) + tier surcharge (₹350/₹750/₹1400) + sum of extra_price of selected options (sponge, filling, shape, icing, toppings, decor).", "Pricing Formula:")
    add_bullet(doc, "While client-side calculates price for instant feedback, the backend re-validates item base prices against database records upon POST /api/orders.", "Server-Side Price Validation:")
    add_bullet(doc, "A flat fee of ₹80.00 is currently configured in orderService.ts representing local refrigerated courier transit. Marked as prototype configuration pending dynamic 3PL integration.", "Delivery Fee Configuration:")
    add_bullet(doc, "Tax is calculated at 5% of subtotal (Math.round(calculatedSubtotal * 0.05 * 100) / 100), reflecting standard Indian GST on bakery/confectionery. Labeled as configured prototype rule pending formal tax audit.", "GST Tax Computation:")
    add_bullet(doc, "Once submitted, subtotal, delivery_fee, tax_amount, and total_amount are immutably written to the orders table. Downstream catalog price changes do not alter submitted order totals.", "Order Price Locking:")
    
    add_h2(doc, "8.3 High-Risk Exception Cases Matrix")
    add_p(doc, "Robust marketplace systems anticipate edge failures and define deterministic system behaviors:")
    
    exc_headers = ["Exception Scenario", "Trigger Condition", "Current Implemented System Behavior", "Target Production Enhancement"]
    exc_data = [
        ["Mid-Session Bakery Deactivation", "Bakery owner toggles storefront inactive while user builds cake.", "Studio displays alert banner on add-to-cart; POST /api/orders rejects with 400 error.", "WebSocket real-time notification prompts customer to select alternate neighborhood bakery."],
        ["Delivery Date Collision", "Customer selects date that becomes unavailable during checkout.", "Backend orderService checks minimum lead days upon submission; rejects if invalid.", "Real-time date lock hold for 15 minutes upon entering checkout screen."],
        ["Catalog Base Price Change", "Bakery alters cake base_price while customer holds it in cart.", "Server re-calculates subtotal using latest DB price at order creation time.", "Checkout displays visual diff banner: 'Price updated from ₹X to ₹Y by bakery'."],
        ["Network Disconnect at Submit", "Customer connection drops during order creation POST request.", "UI displays error toast; order remains uncommitted until connection restored.", "Idempotency keys (X-Idempotency-Key) to prevent duplicate order generation on retry."],
        ["Merchant Acceptance Timeout", "Bakery takes no action on PENDING order within response window.", "Order remains PENDING in dashboard; customer sees pending milestone status.", "Automated WhatsApp escalation after 60 min; auto-cancellation & full refund after 4 hours."],
        ["Post-Payment Order Rejection", "Bakery declines custom order after payment authorization.", "Order moves to REJECTED with reason; transaction status flagged in database.", "Automated payment gateway refund webhook execution with instant SMS notification."],
    ]
    build_table(doc, exc_headers, exc_data, col_widths=[1.5, 1.7, 1.9, 1.9])
    
    print("Writing Section 9: NFRs, Security & Operational Policies...")
    # ==================== SECTION 9 ====================
    add_h1(doc, "9. Non-Functional Requirements, Security & Operational Policies")
    
    add_h2(doc, "9.1 Non-Functional Requirements Matrix")
    add_p(doc, "Performance, security, and reliability standards governing the platform:")
    
    nfr_headers = ["Category", "Metric / Attribute", "Current Implemented Baseline", "Production Target (Phase 2 Scale)"]
    nfr_data = [
        ["API Performance", "P95 Response Latency", "< 50ms (Observed on local SQLite in-memory/disk).", "< 250ms under 500 concurrent requests on managed cloud SQL."],
        ["Frontend Load", "Initial Bundle & LCP", "Vite build ~420KB gzip; LCP ~1.2s locally.", "LCP < 2.0s over Indian 4G mobile networks via global CDN."],
        ["3D Graphics", "Three.js Frame Rate", "Maintains 60 FPS on standard modern desktop GPUs.", "Graceful fallback to pre-rendered static WebP previews on low-end devices."],
        ["System Availability", "Uptime SLA", "Single-instance dev uptime (Port 5000 / GitHub Pages).", "99.9% uptime with automated health checks and multi-zone failover."],
        ["Security", "Password Storage", "Bcrypt hashing with salt rounds = 10 (authService.ts).", "Argon2id or managed cloud identity service with mandatory MFA for admin."],
    ]
    build_table(doc, nfr_headers, nfr_data, col_widths=[1.3, 1.5, 2.1, 2.1])
    
    add_h2(doc, "9.2 Security & Privacy Controls vs. Remaining Vulnerabilities")
    add_p(doc, "The prototype enforces fundamental application controls, but production deployment requires addressing specific security gaps:")
    add_bullet(doc, "Passcodes hashed with bcrypt; stateless JWT tokens with role guards (RequireAuth, RequireRole); input validation via Zod schemas; Helmet HTTP security headers; CORS domain whitelisting; Multer MIME and file size guards (8MB max).", "Implemented Security Controls:")
    add_bullet(doc, "JWT tokens are stored in browser localStorage, vulnerable to token exfiltration if XSS occurs. Production remediation requires migrating to HttpOnly, SameSite=Strict cookies.", "Remaining Vulnerability 1 (Token Storage):")
    add_bullet(doc, "Express rate limiting operates in single-process memory. Distributed denial-of-service or brute force attacks require Redis-backed global rate limiting.", "Remaining Vulnerability 2 (Distributed Rate Limiting):")
    add_bullet(doc, "Currently, SQLite stores data locally without automated point-in-time recovery. Production requires managed PostgreSQL/MySQL with automated daily snapshots and encryption at rest.", "Remaining Vulnerability 3 (Database Backup & Disaster Recovery):")
    
    add_h2(doc, "9.3 Dietary Integrity & Food Safety Operational Policy")
    add_callout(doc, "DIETARY & ALLERGEN INTEGRITY DISCLAIMER",
        "The Whisk & Layers platform provides metadata badging ('100% Eggless', 'Gluten-Free', 'Vegan') based on bakery partner declarations. "
        "Software badging alone DOES NOT guarantee absence of airborne cross-contamination in commercial kitchens. "
        "Prior to commercial launch, partner onboarding must require: (1) Valid FSSAI food hygiene registration, "
        "(2) Submission of kitchen allergen separation protocols, and (3) Prominent customer allergen liability disclosures at checkout.")
    
    add_h2(doc, "9.4 Delivery Exception & Transit Damage Dispute Policy")
    add_p(doc, "Celebration cakes are physically fragile and susceptible to transit damage from heat, sharp turns, or courier drops. The operational dispute protocol requires:")
    add_bullet(doc, "Bakeries must package multi-tier cakes with structural food-grade dowels, non-slip cake boards, and insulated thermal boxes.", "Merchant Packaging SLA:")
    add_bullet(doc, "Recipients must inspect the cake at delivery. In case of structural collapse, photographic proof must be uploaded within 60 minutes of delivery.", "Photo Evidence Requirement:")
    add_bullet(doc, "If damage occurred during transit, the platform issues an immediate customer credit/refund; operational cost is shared per merchant SLA agreement.", "Dispute Resolution:")
    
    print("Writing Section 10: Validation Plan & Research Protocol...")
    # ==================== SECTION 10 ====================
    add_h1(doc, "10. Validation Plan, Usability Testing & Experimentation")
    
    add_h2(doc, "10.1 Discovery Research Protocol")
    add_p(doc, "Before commercial market launch, structured user research will replace unvalidated assumptions:")
    add_bullet(doc, "12 boutique bakery owners across Ahmedabad and Mumbai. Methodology: 45-minute semi-structured contextual inquiry and order log review. Key Questions: How many custom inquiries are handled weekly? What percentage convert? How are rejections handled?", "Cohort 1 (Artisan Merchants):")
    add_bullet(doc, "18 urban consumers who purchased a custom cake in the past year. Methodology: 30-minute retrospective journey mapping. Key Questions: What caused the most anxiety during ordering? What would build trust in upfront online payment?", "Cohort 2 (Celebration Planners):")
    
    add_h2(doc, "10.2 Usability Testing Protocol: Studio Wizard vs. Single-Page Form")
    add_p(doc, "Because custom cake building involves 8 variables, usability testing will evaluate cognitive load:")
    add_bullet(doc, "Control Variant: Current 8-Step linear sequential wizard. Test Variant: Single-page accordion form with dynamic summary sidebar.", "Evaluation Setup:")
    add_bullet(doc, "10 non-technical users given the task: 'Design a 2-tier 100% eggless chocolate cake with custom lettering for an anniversary on Friday'.", "Task Protocol:")
    add_bullet(doc, "Task completion rate, time-on-task, subjective usability rating (SUS), and error frequency when selecting conflicting options.", "Measured Signals:")
    
    add_h2(doc, "10.3 Experimentation Framework")
    add_p(doc, "Small usability sessions will guide initial UX refinements. Controlled A/B experiments will be deployed only after commercial traffic achieves statistical power (minimum sample size per variant based on 95% confidence and 80% power):")
    add_bullet(doc, "Dynamic lead-time badging directly on discovery cards vs inside storefront detail page. Hypothesis: Upfront lead-time badging reduces checkout date-collision errors by 25%.", "Experiment 1:")
    add_bullet(doc, "Inspiration photo uploader placed at Step 1 vs Step 8 of Custom Studio. Hypothesis: Placing photo upload first increases studio completion for image-driven buyers by 15%.", "Experiment 2:")
    
    print("Writing Section 11: Roadmap & Senior PM Retrospective...")
    # ==================== SECTION 11 ====================
    add_h1(doc, "11. Outcome-Driven Roadmap, Open Questions & Retrospective")
    
    add_h2(doc, "11.1 Outcome-Based Roadmap & Phase Exit Gates")
    add_p(doc, "Product evolution is structured around measurable outcome-based exit gates rather than arbitrary calendar deadlines:")
    
    road_headers = ["Phase", "Strategic Theme", "Key Capabilities Delivered", "Outcome-Based Exit Gate (Must Pass to Advance)"]
    road_data = [
        ["Phase 1 (MVP)", "Core Marketplace Foundation", "Full-stack web app, 8-step studio, 3D visualizer, single-bakery cart, mandatory rejection logging, verified reviews.", "9/9 Vitest test pass; successful qualitative usability testing with >= 8/10 task completion rate."],
        ["Phase 2 (Pilot)", "Commercial Trust & Payments", "Live Razorpay UPI integration, automated WhatsApp Business alerts, merchant kitchen blackout calendar.", "50 successful paid commercial pilot orders with < 10% merchant rejection rate and zero payment reconciliation failures."],
        ["Phase 3 (Scale)", "Hyperlocal Logistics & Density", "Automated 3PL refrigerated dispatch (Dunzo API), multi-city hub expansion, dynamic delivery radius.", "Maintain > 85% on-time delivery across 500+ monthly orders; customer review average >= 4.60 stars."],
        ["Phase 4 (Ecosystem)", "Merchant SaaS & Enterprise", "Merchant Kitchen Display System (KDS), celebration reminder CRM, corporate B2B gifting accounts.", "Achieve positive unit economics with merchant retention > 80% across 12-month cohort."],
    ]
    build_table(doc, road_headers, road_data, col_widths=[1.2, 1.4, 2.2, 2.2])
    
    add_h2(doc, "11.2 Strategic Open Product Questions")
    add_bullet(doc, "Should customer payments be authorized with a temporary hold and captured only upon bakery acceptance, or captured immediately at checkout and refunded if rejected? Holding minimizes refund fees but requires payment gateway support for delayed capture.", "1. Payment Capture Timing vs Refund Liability:")
    add_bullet(doc, "Should bakeries be allowed to fulfill orders using their own staff, or should platform-managed 3PL refrigerated courier pickup be mandatory? Merchant self-delivery reduces platform liability but risks inconsistent delivery quality.", "2. Merchant Self-Delivery vs Platform 3PL Mandate:")
    add_bullet(doc, "Should commission be a flat marketplace take rate (e.g., 12-15%) or a tiered subscription model for high-volume bakeries? Discovery research will evaluate merchant price sensitivity.", "3. Marketplace Take Rate Structure:")
    
    add_h2(doc, "11.3 Senior PM Retrospective & Demonstrated Competencies")
    add_p(doc, "Creating Whisk & Layers demonstrates fundamental senior product management competencies across consumer marketplaces, systems thinking, and technical execution:")
    add_bullet(doc, "Deconstructed an intricate 8-variable custom baking workflow into a clean, progressive disclosure studio with real-time 3D feedback, eliminating customer decision paralysis.", "1. Complex Problem Deconstruction:")
    add_bullet(doc, "Established single-bakery cart isolation and advance lead-time protections early in the technical architecture, preventing impossible multi-bakery logistical collisions.", "2. Defensible Systems Architecture:")
    add_bullet(doc, "Designed balanced incentives for both marketplace sides—customers gain pricing transparency and tracking visibility, while merchants gain protected kitchen capacity and mandatory rejection logging.", "3. Marketplace Dynamics & Incentive Alignment:")
    add_bullet(doc, "Replaced vanity metrics and unverified claims with strict verification classifications, candidate North Star definitions, and structured discovery protocols.", "4. Evidence-Led Product Rigor:")
    
    print("Writing Section 12: References & Source Traceability...")
    # ==================== SECTION 12 ====================
    add_h1(doc, "12. References, Source Traceability & Verification Records")
    
    add_h2(doc, "12.1 Verified Codebase Artifacts & Test Records")
    add_bullet(doc, "Database schema defined in backend/src/database/schema.ts; connection and SQLite bootstrap in backend/src/database/db.ts.", "Universal Relational Database Schema:")
    add_bullet(doc, "Order creation, lead-time checks, price recalculation, and state transitions in backend/src/services/orderService.ts.", "Order Service & State Machine:")
    add_bullet(doc, "Interactive custom builder in frontend/src/pages/customer/CustomCakeBuilderPage.tsx; Three.js 3D viewer in frontend/src/components/ui/Cake3DViewer.tsx.", "Custom Cake Studio & 3D Viewer:")
    add_bullet(doc, "Single-bakery cart isolation and item snapshots in frontend/src/context/CartContext.tsx.", "Cart & Lead Enforcement:")
    add_bullet(doc, "Client-side fallback adapter in frontend/src/services/mockAdapter.ts and mockDataStore.ts.", "GitHub Pages Demo Fallback:")
    add_bullet(doc, "Command: 'npm.cmd run test --workspace=backend'. Environment: Windows 11, Node v20+, Vitest v3.2.7. Result: 1 test file passed, 9 tests passed in 726ms. Test file: backend/src/tests/api.test.ts.", "Reproduced Automated Vitest Test Run:")
    
    add_h2(doc, "12.2 Credible Industry Market References")
    add_bullet(doc, "IMARC Group, 'India Bakery Market Report: Industry Trends, Share, Size, Growth, Opportunity and Forecast 2024-2032', Published 2024. URL: https://www.imarcgroup.com/india-bakery-market (Supports $13.8B - $14B bakery market valuation and 8.3-9.5% CAGR).", "[1] IMARC Group (2024):")
    add_bullet(doc, "Research and Markets, 'India Cakes Market - Growth, Trends, and Forecasts (2024-2029)', Published 2024. URL: https://www.researchandmarkets.com/reports/india-cakes-market (Supports $540M+ cake sector valuation and ~6% CAGR).", "[2] Research and Markets (2024):")
    add_bullet(doc, "Spherical Insights, 'India Bakery Products Market Size, Share, and COVID-19 Impact Analysis', Published 2024. URL: https://www.sphericalinsights.com/reports/india-bakery-products-market.", "[3] Spherical Insights (2024):")
    
    output_filename = "Whisk_and_Layers_PRD_Final.docx"
    doc.save(output_filename)
    print(f"Main PRD successfully saved as: {output_filename}")
    
    # Check rendered page count using Word COM
    abs_path = os.path.abspath(output_filename)
    try:
        word = win32.gencache.EnsureDispatch('Word.Application')
        word.Visible = False
        wdoc = word.Documents.Open(abs_path)
        pages = wdoc.ComputeStatistics(2) # 2 = wdStatisticPages
        print(f"Microsoft Word rendered page count: {pages} pages")
        
        pdf_path = os.path.abspath("Whisk_and_Layers_PRD_Final.pdf")
        wdoc.SaveAs2(pdf_path, FileFormat=17) # 17 = wdFormatPDF
        print(f"Exported PDF copy to: {pdf_path}")
        
        wdoc.Close()
        word.Quit()
        return pages
    except Exception as e:
        print(f"Word COM automation note: {e}")
        return None

if __name__ == "__main__":
    generate_document()
