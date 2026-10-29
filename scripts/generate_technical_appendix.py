# scripts/generate_technical_appendix.py
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
import os
import win32com.client as win32

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=60, bottom=60, left=90, right=90):
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

def add_p(doc, text="", space_before=0, space_after=3, line_spacing=1.12, bold=False, italic=False, font_size=9.0, color=(0x33, 0x41, 0x55), align=WD_ALIGN_PARAGRAPH.LEFT):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if text:
        r = p.add_run(text)
        format_run(r, "Calibri", font_size, bold, italic, color)
    return p

def add_code_block(doc, code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(7.0)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "0F172A")
    set_cell_margins(cell, top=70, bottom=70, left=120, right=100)
    
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="18" w:space="0" w:color="38BDF8"/>'
        f'<w:top w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    cell._tc.get_or_add_tcPr().append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.line_spacing = 1.05
    r = p.add_run(code_text)
    format_run(r, "Consolas", 8.0, color_rgb=(0xEA, 0xE8, 0xE8))
    
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(2)

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
    format_run(r, "Calibri", 10.5, bold=True, color_rgb=(0x0D, 0x94, 0x88))
    return p

def add_bullet(doc, text, bold_prefix="", space_after=1.5):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.10
    if bold_prefix:
        r_pre = p.add_run(bold_prefix + " ")
        format_run(r_pre, "Calibri", 8.8, bold=True, color_rgb=(0x0F, 0x17, 0x2A))
    r_body = p.add_run(text)
    format_run(r_body, "Calibri", 8.8, color_rgb=(0x33, 0x41, 0x55))
    return p

def add_callout(doc, title, text, border_color="0D9488", bg_color="F0FDFA"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(7.0)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=60, bottom=60, left=120, right=100)
    
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>'
        f'<w:top w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    cell._tc.get_or_add_tcPr().append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.line_spacing = 1.10
    
    r_title = p.add_run(title + ": ")
    format_run(r_title, "Calibri", 8.8, bold=True, color_rgb=(0x0D, 0x94, 0x88))
    
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
        set_cell_margins(hdr_cells[i], top=50, bottom=50, left=60, right=60)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT if (align_right_cols and i in align_right_cols) else WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(title)
        format_run(r, "Calibri", 8.0, bold=True, color_rgb=(0xFF, 0xFF, 0xFF))
    
    # Body Rows
    for r_idx, row_data in enumerate(data):
        row_cells = tbl.rows[r_idx + 1].cells
        bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].width = Inches(col_widths[c_idx]) if col_widths else Inches(7.0 / cols)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=40, bottom=40, left=60, right=60)
            p = row_cells[c_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT if (align_right_cols and c_idx in align_right_cols) else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            r = p.add_run(str(val))
            format_run(r, "Calibri", 7.6, color_rgb=(0x1E, 0x29, 0x3B))
            
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(2)
    return tbl

def generate_technical_appendix():
    doc = docx.Document()
    
    # Page Setup
    for s in doc.sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)
        s.different_first_page_header_footer = True
        
        header = s.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("WHISK & LAYERS  |  TECHNICAL IMPLEMENTATION APPENDIX")
        format_run(hrun, "Calibri", 8.0, color_rgb=(0x94, 0xA3, 0xB8))
        
        footer = s.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        frun = fp.add_run("Companion Technical Specification   |   Codebase Traceability & Architecture Notes")
        format_run(frun, "Calibri", 8.0, color_rgb=(0x94, 0xA3, 0xB8))
        
    print("Writing Appendix Cover...")
    # Cover / Header
    add_p(doc, "TECHNICAL SPECIFICATION COMPANION  |  ENGINEERING BASELINE", space_before=16, space_after=6, font_size=9, bold=True, color=(0x0D, 0x94, 0x88))
    add_p(doc, "WHISK & LAYERS: TECHNICAL APPENDIX", space_before=0, space_after=4, font_size=24, bold=True, color=(0x0F, 0x17, 0x2A))
    add_p(doc, "Detailed API Contracts, Relational Schema DDL, Traceability Matrix, Edge Cases & System Architecture", space_before=0, space_after=12, font_size=11, italic=True, color=(0x47, 0x55, 0x69))
    
    add_p(doc, "This document serves as the comprehensive engineering and architecture companion to the main Product Requirements Document ('Whisk_and_Layers_PRD_Final.docx'). It preserves deep technical specifications, full REST API contracts, entity-relationship schemas, comprehensive edge-case handling rules, design tokens, and source code mapping.", space_before=0, space_after=14, font_size=9.2, color=(0x33, 0x41, 0x55))
    
    meta_headers = ["Technical Dimension", "Specification / System Property"]
    meta_data = [
        ["Document Identifier", "APP-WL-2026-FINAL (Companion to PRD-WL-2026-FINAL)"],
        ["Target Audience", "Technical Product Managers, Engineering Leads, Full-Stack Architects, Hiring Reviewers"],
        ["Monorepo Workspaces", "backend (Node.js/Express/TypeScript) + frontend (React 18/Vite 6/TypeScript)"],
        ["Database Engine", "Universal Relational SQL Engine (SQLite with disk persistence in data/whisk_layers.sqlite)"],
        ["Test Suite", "Vitest 9/9 Integration Tests Passed (npm.cmd run test --workspace=backend)"],
        ["Live Demo Architecture", "Static bundle on GitHub Pages using client-side mockAdapter.ts fallback; zero remote backend required for evaluation."],
    ]
    build_table(doc, meta_headers, meta_data, col_widths=[2.0, 5.0])
    
    add_callout(doc, "TECHNICAL IMPLEMENTATION REALITY NOTICE",
        "This appendix documents genuine technical implementation details from the Whisk & Layers codebase. "
        "It distinguishes verified code implementations and local automated test passes from mock demo behaviors, "
        "unvalidated market hypotheses, and future production roadmap requirements. No claims of unverified cloud "
        "infrastructure, production scale, or live payment gateway integration are made.")
    
    doc.add_page_break()
    
    print("Writing Appendix Section 1: Detailed User Flows (Flow 1 to 12)...")
    # ==================== SECTION 1 ====================
    add_h1(doc, "1. Detailed End-to-End User Flows & Interaction Logic")
    
    add_h2(doc, "Flow 1: Customer Onboarding & JWT Authentication")
    add_bullet(doc, "User clicks 'Sign In' or enters checkout unauthenticated.", "Trigger:")
    add_bullet(doc, "1. User navigates to /register or /login. 2. Provides email, password (>= 6 chars), full name, 10-digit Indian phone (+91). 3. Submits form; frontend sends POST /api/auth/register or /login. 4. Backend validates with Zod; verifies/generates bcrypt hash. 5. Backend signs JWT with payload { userId, email, role }. 6. Frontend stores token in localStorage ('wl_token') and dispatches AuthContext state update.", "Execution Steps:")
    add_bullet(doc, "User authenticated; user session loaded; redirected to origin page.", "Outcome & State:")
    
    add_h2(doc, "Flow 2: Bakery Discovery & Geospatial / Category Filtering")
    add_bullet(doc, "Customer seeks local artisan bakeries.", "Trigger:")
    add_bullet(doc, "1. User navigates to /bakeries. 2. Frontend triggers GET /api/bakeries. 3. User selects City (Ahmedabad, Mumbai, Rajkot, Surat, Vadodara) and Lead Time filter (<= 2 days, <= 3 days). 4. Frontend filters cards by city and minimum_lead_days. 5. User clicks bakery card to view storefront details and signature cakes.", "Execution Steps:")
    add_bullet(doc, "Bakery details and catalog loaded via GET /api/bakeries/:idOrSlug.", "Outcome & State:")
    
    add_h2(doc, "Flow 3: Pre-Built Signature Cake Catalog Selection")
    add_bullet(doc, "Customer browses pre-designed cakes.", "Trigger:")
    add_bullet(doc, "1. User navigates to /cakes. 2. Frontend triggers GET /api/cakes with category/price query parameters. 3. User views high-res imagery, preparation lead days, eggless badges, and base price. 4. User inputs celebration plaque inscription (optional). 5. Clicks 'Add to Cart'.", "Execution Steps:")
    add_bullet(doc, "Item appended to CartContext; single-bakery cart rule validated.", "Outcome & State:")
    
    add_h2(doc, "Flow 4: Interactive 8-Step Custom Cake Studio Flow")
    add_bullet(doc, "Customer wants to design a bespoke cake from scratch.", "Trigger:")
    add_bullet(doc, "1. User navigates to /custom-builder. 2. System fetches options via GET /api/customizations/options. 3. Configuration Step 1 (Architecture): Selects Tiers (1 to 4) and Shape (Round, Heart, Square, Hexagon). 4. Step 2 (Colors): Selects Frosting Palette (10 presets or hex picker) and Accent Piping color. 5. Step 3 (3D Garnishes): Toggles top toppings (Macarons, Berries, Gold Flecks, Candle, Flowers) rendered live onto Three.js canvas. 6. Step 4 (Sponge): Selects crumb sponge (Vanilla, Dutch Chocolate, Ruby Cocoa, Kesar Elaichi). 7. Step 5 (Filling): Selects gourmet compote (Belgian Truffle, Rasmalai, Biscoff, Alphonso Mango). 8. Step 6 (Dietary): Selects 100% Eggless, Vegan, Gluten-Free, or Low Sugar. 9. Step 7 (Inscription): Inputs custom lettering (max 65 chars). 10. Step 8 (Bakery Choice): Selects neighborhood artisan bakery. 11. Review / Blueprint Step: Reviews live Blueprint Summary Card showing itemized price and calculated delivery lead date. 12. Clicks 'Add Bespoke Cake to Cart'.", "Execution Steps:")
    add_bullet(doc, "Custom cake snapshot saved in cart with 3D parameter properties.", "Outcome & State:")
    
    add_h2(doc, "Flow 5: Cart Management & Single-Bakery Lead Enforcement")
    add_bullet(doc, "Customer updates quantities or adds cake from another bakery.", "Trigger:")
    add_bullet(doc, "1. If item belongs to different bakery, modal prompts: 'Clear cart to switch bakeries?'. 2. Cart calculates max lead days across all items. 3. User adjusts quantities; subtotal updates.", "Execution Steps:")
    add_bullet(doc, "Cart state synchronized in localStorage ('wl_cart').", "Outcome & State:")
    
    add_h2(doc, "Flow 6: Indian Address & Date Selection Checkout")
    add_bullet(doc, "Customer proceeds from cart to checkout.", "Trigger:")
    add_bullet(doc, "1. Navigates to /checkout. 2. Calendar disables dates earlier than today + max(bakery.minimum_lead_days, item.leadDays). 3. Customer selects 3-hour delivery slot. 4. Enters 10-digit Indian phone and 6-digit postal PIN code address. 5. Selects payment method (UPI QR, Card, NetBanking, COD).", "Execution Steps:")
    add_bullet(doc, "Checkout form validated via frontend Zod rules.", "Outcome & State:")
    
    add_h2(doc, "Flow 7: Order Placement & Database Persistence Flow")
    add_bullet(doc, "Customer clicks 'Place Order'.", "Trigger:")
    add_bullet(doc, "1. Frontend sends POST /api/orders with bearer token. 2. orderService verifies lead days and re-calculates subtotal, ₹80 delivery fee, and 5% GST. 3. Inserts row into orders and order_items tables. 4. Generates unique order_number (e.g., 'WL-2026-8941'). 5. Inserts notification row for bakery owner.", "Execution Steps:")
    add_bullet(doc, "Order created with status 'PENDING'; customer routed to confirmation page.", "Outcome & State:")
    
    add_h2(doc, "Flow 8: Bakery Order Review & Acceptance Flow")
    add_bullet(doc, "Bakery logs into dashboard to review incoming orders.", "Trigger:")
    add_bullet(doc, "1. Bakery visits /bakery/orders?status=PENDING. 2. Inspects order card: recipe snapshot, delivery date, time slot, inscription text. 3. Verifies kitchen capacity. 4. Clicks 'Accept Order'. 5. Backend executes PATCH /api/orders/:id/status { status: 'ACCEPTED' }.", "Execution Steps:")
    add_bullet(doc, "Order status updated to 'ACCEPTED'; notification created for customer.", "Outcome & State:")
    
    add_h2(doc, "Flow 9: Bakery Order Rejection Flow (Mandatory Reason)")
    add_bullet(doc, "Bakery cannot fulfill order due to capacity/logistics.", "Trigger:")
    add_bullet(doc, "1. Bakery clicks 'Decline Order'. 2. System displays mandatory rejection modal. 3. Bakery types reason (>= 5 chars). 4. Backend validates rejectionReason via Zod. 5. Status updated to 'REJECTED' with rejection_reason stored.", "Execution Steps:")
    add_bullet(doc, "Order terminated; customer notified with exact rejection reason.", "Outcome & State:")
    
    add_h2(doc, "Flow 10: Stage-by-Stage Order Milestone Tracking Flow")
    add_bullet(doc, "Bakery progresses production; customer checks timeline.", "Trigger:")
    add_bullet(doc, "1. Bakery clicks 'Start Baking' -> PREPARING. 2. Bakery clicks 'Mark Boxed & Ready' -> READY. 3. Bakery clicks 'Dispatch Order' -> OUT_FOR_DELIVERY. 4. Driver delivers; bakery marks -> DELIVERED.", "Execution Steps:")
    add_bullet(doc, "Customer visual timeline advances; delivery unlocks review eligibility.", "Outcome & State:")
    
    add_h2(doc, "Flow 11: Bakery Cake Catalog Management")
    add_bullet(doc, "Bakery manages menu offerings and pricing.", "Trigger:")
    add_bullet(doc, "1. Bakery navigates to /bakery/cakes. 2. Adds new cake or edits existing item. 3. Updates base price in INR, image URL, preparation days, or toggles active status. 4. Backend persists updates via cakeRepository.", "Execution Steps:")
    add_bullet(doc, "Public catalog immediately reflects updated pricing and availability.", "Outcome & State:")
    
    add_h2(doc, "Flow 12: Verified Customer Review & Merchant Reply")
    add_bullet(doc, "Customer receives delivered cake and rates experience.", "Trigger:")
    add_bullet(doc, "1. Order detail page displays 'Write a Verified Review' button. 2. Customer selects 1 to 5 stars and writes comment. 3. Backend validates status === 'DELIVERED' and order_id uniqueness. 4. Review saved; bakery rating_avg recalculated. 5. Bakery views review and posts public merchant reply.", "Execution Steps:")
    add_bullet(doc, "Verified review and public bakery reply published on storefront.", "Outcome & State:")
    
    print("Writing Appendix Section 2: Complete REST API Contracts...")
    # ==================== SECTION 2 ====================
    add_h1(doc, "2. Complete REST API Specifications & Request/Response Contracts")
    
    add_p(doc, "Standard Envelope: All endpoints return a consistent JSON structure: { success: boolean, data?: T, message?: string, error?: string }.")
    
    api_headers = ["Method & Path", "Access Role", "Request Payload Summary", "Success Response & Status", "Error Codes"]
    api_data = [
        ["POST /api/auth/register", "Public", "{ email, password, fullName, phone, role ('CUSTOMER'|'BAKERY'), bakeryName?, postalCode? }", "201 Created: { token, user: { id, email, fullName, role } }", "400 (Email taken), 422 (Zod validation error)"],
        ["POST /api/auth/login", "Public", "{ email, password }", "200 OK: { token, user: { id, email, fullName, role, phone, avatarUrl }, bakeryId? }", "401 (Invalid credentials), 422 (Zod validation error)"],
        ["GET /api/auth/me", "Authenticated", "None (Bearer JWT in Authorization header)", "200 OK: { user: { id, email, fullName, role, ... } }", "401 (Missing/expired token)"],
        ["PUT /api/auth/profile", "Authenticated", "{ fullName?, phone?, bio?, dietaryPreferences?, savedAddresses?, celebrationDates? }", "200 OK: { user: { ...updatedUser } }", "401 (Unauthorized), 422 (Validation error)"],
        ["GET /api/bakeries", "Public", "Query params: ?city=&search=&limit=&page=", "200 OK: { bakeries: Bakery[], total: number }", "500 (Database error)"],
        ["GET /api/bakeries/:idOrSlug", "Public", "Path param: bakery ID or unique slug", "200 OK: { bakery: Bakery, cakes: Cake[], reviews: Review[] }", "404 (Bakery not found)"],
        ["PUT /api/bakeries/my-bakery", "Bakery Only", "{ name?, tagline?, description?, address?, city?, state?, postalCode?, phone?, minimumLeadDays? }", "200 OK: { bakery: Bakery }", "401 (Unauthorized), 403 (Not a bakery)"],
        ["GET /api/cakes", "Public", "Query params: ?category=&bakeryId=&minPrice=&maxPrice=&search=", "200 OK: { cakes: Cake[], total: number }", "500 (Database error)"],
        ["POST /api/cakes", "Bakery Only", "{ name, description, basePrice, categoryId, preparationDays, imageUrl, isCustomizable? }", "201 Created: { cake: Cake }", "401 (Unauthorized), 403 (Forbidden), 422 (Invalid input)"],
        ["GET /api/customizations/options", "Public", "None", "200 OK: { options: CustomOption[], grouped: { BASE, FLAVOR, SIZE, SHAPE, ICING, TOPPING, DECORATION } }", "500 (Database error)"],
        ["POST /api/orders", "Customer Only", "{ bakeryId, customerName, customerPhone, deliveryAddress, deliveryDate, deliveryTimeSlot, items: OrderItem[] }", "201 Created: { order: Order (with order_number, subtotal, delivery_fee, tax_amount, total_amount) }", "400 (Lead time error, inactive bakery), 401, 422"],
        ["GET /api/orders/my-orders", "Customer Only", "None (Bearer JWT)", "200 OK: { orders: Order[] (with items, bakery name) }", "401 (Unauthorized)"],
        ["GET /api/orders/:id", "Authenticated", "Path param: order ID", "200 OK: { order: Order (with items, reviews) }", "401 (Unauthorized), 403 (Not own order), 404 (Not found)"],
        ["GET /api/orders/bakery/dashboard", "Bakery Only", "None (Bearer JWT)", "200 OK: { pendingCount, preparingCount, completedCount, totalRevenue, urgentOrders: Order[] }", "401 (Unauthorized), 403 (Forbidden)"],
        ["GET /api/orders/bakery/orders", "Bakery Only", "Query params: ?status=&page=&limit=", "200 OK: { orders: Order[], total: number }", "401 (Unauthorized), 403 (Forbidden)"],
        ["PATCH /api/orders/:id/status", "Bakery / Admin", "{ status: OrderStatus, rejectionReason? }", "200 OK: { order: Order (status updated) }", "400 (Invalid transition), 403 (Wrong bakery), 422 (Missing rejectionReason)"],
        ["POST /api/reviews", "Customer Only", "{ orderId, rating (1-5), comment }", "201 Created: { review: Review }", "400 (Order not delivered, already reviewed), 401, 422"],
        ["POST /api/reviews/:id/reply", "Bakery Only", "{ replyComment }", "200 OK: { review: Review (with reply_comment) }", "401 (Unauthorized), 403 (Not bakery owner of review)"],
        ["GET /api/admin/metrics", "Admin Only", "None (Bearer JWT with role='ADMIN')", "200 OK: { totalUsers, totalBakeries, totalOrders, totalGmv, recentOrders: Order[] }", "401 (Unauthorized), 403 (Forbidden: non-admin)"],
    ]
    build_table(doc, api_headers, api_data, col_widths=[1.5, 0.9, 1.8, 1.6, 1.2])
    
    print("Writing Appendix Section 3: Schema DDL & Data Model...")
    # ==================== SECTION 3 ====================
    add_h1(doc, "3. Universal Relational Data Model & Schema DDL Specification")
    
    add_p(doc, "The database architecture utilizes standard ANSI SQL, implemented via SQLite in local development and compatible with enterprise MySQL / PostgreSQL migrations. The DDL below represents the active schema in backend/src/database/schema.ts:")
    
    schema_code = (
        "-- 1. USERS TABLE\n"
        "CREATE TABLE users (\n"
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        "  email TEXT UNIQUE NOT NULL,\n"
        "  password_hash TEXT NOT NULL,\n"
        "  full_name TEXT NOT NULL,\n"
        "  phone TEXT,\n"
        "  role TEXT NOT NULL CHECK(role IN ('CUSTOMER', 'BAKERY', 'ADMIN')),\n"
        "  avatar_url TEXT,\n"
        "  bio TEXT,\n"
        "  dietary_preferences TEXT,\n"
        "  saved_addresses TEXT,\n"
        "  celebration_dates TEXT,\n"
        "  is_active INTEGER NOT NULL DEFAULT 1,\n"
        "  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n"
        ");\n\n"
        "-- 2. BAKERIES TABLE\n"
        "CREATE TABLE bakeries (\n"
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        "  user_id INTEGER NOT NULL UNIQUE,\n"
        "  name TEXT NOT NULL,\n"
        "  slug TEXT UNIQUE NOT NULL,\n"
        "  tagline TEXT,\n"
        "  description TEXT NOT NULL,\n"
        "  address TEXT NOT NULL,\n"
        "  city TEXT NOT NULL,\n"
        "  state TEXT NOT NULL,\n"
        "  postal_code TEXT NOT NULL,\n"
        "  phone TEXT NOT NULL,\n"
        "  email TEXT NOT NULL,\n"
        "  logo_url TEXT,\n"
        "  banner_url TEXT,\n"
        "  specialties TEXT,\n"
        "  rating_avg REAL DEFAULT 0.0,\n"
        "  review_count INTEGER DEFAULT 0,\n"
        "  is_approved INTEGER NOT NULL DEFAULT 1,\n"
        "  is_active INTEGER NOT NULL DEFAULT 1,\n"
        "  minimum_lead_days INTEGER NOT NULL DEFAULT 2,\n"
        "  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n"
        ");\n\n"
        "-- 3. CAKE CATEGORIES & CAKES TABLES\n"
        "CREATE TABLE cake_categories (\n"
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        "  name TEXT NOT NULL UNIQUE,\n"
        "  slug TEXT NOT NULL UNIQUE,\n"
        "  description TEXT,\n"
        "  image_url TEXT,\n"
        "  sort_order INTEGER DEFAULT 0\n"
        ");\n\n"
        "CREATE TABLE cakes (\n"
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        "  bakery_id INTEGER NOT NULL,\n"
        "  category_id INTEGER,\n"
        "  name TEXT NOT NULL,\n"
        "  slug TEXT NOT NULL,\n"
        "  description TEXT NOT NULL,\n"
        "  base_price REAL NOT NULL,\n"
        "  preparation_days INTEGER NOT NULL DEFAULT 2,\n"
        "  image_url TEXT NOT NULL,\n"
        "  gallery_urls TEXT,\n"
        "  is_customizable INTEGER NOT NULL DEFAULT 0,\n"
        "  is_available INTEGER NOT NULL DEFAULT 1,\n"
        "  is_active INTEGER NOT NULL DEFAULT 1,\n"
        "  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  FOREIGN KEY (bakery_id) REFERENCES bakeries(id) ON DELETE CASCADE,\n"
        "  FOREIGN KEY (category_id) REFERENCES cake_categories(id) ON DELETE SET NULL\n"
        ");\n\n"
        "-- 4. CUSTOMIZATION OPTIONS TABLE\n"
        "CREATE TABLE customization_options (\n"
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        "  name TEXT NOT NULL,\n"
        "  type TEXT NOT NULL CHECK(type IN ('BASE', 'FLAVOR', 'SIZE', 'SHAPE', 'ICING', 'TOPPING', 'DECORATION')),\n"
        "  label TEXT NOT NULL,\n"
        "  description TEXT,\n"
        "  extra_price REAL NOT NULL DEFAULT 0.0,\n"
        "  image_url TEXT,\n"
        "  is_active INTEGER NOT NULL DEFAULT 1,\n"
        "  sort_order INTEGER DEFAULT 0\n"
        ");\n\n"
        "-- 5. ORDERS & ORDER ITEMS TABLES\n"
        "CREATE TABLE orders (\n"
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        "  order_number TEXT UNIQUE NOT NULL,\n"
        "  customer_id INTEGER NOT NULL,\n"
        "  bakery_id INTEGER NOT NULL,\n"
        "  total_amount REAL NOT NULL,\n"
        "  subtotal REAL NOT NULL,\n"
        "  delivery_fee REAL NOT NULL DEFAULT 0.0,\n"
        "  tax_amount REAL NOT NULL DEFAULT 0.0,\n"
        "  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED', 'CANCELLED')),\n"
        "  rejection_reason TEXT,\n"
        "  customer_name TEXT NOT NULL,\n"
        "  customer_phone TEXT NOT NULL,\n"
        "  delivery_address TEXT NOT NULL,\n"
        "  delivery_date TEXT NOT NULL,\n"
        "  delivery_time_slot TEXT,\n"
        "  special_instructions TEXT,\n"
        "  payment_method TEXT NOT NULL DEFAULT 'PAY_ON_DELIVERY',\n"
        "  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(payment_status IN ('UNPAID', 'PENDING', 'PAID', 'REFUNDED')),\n"
        "  transaction_id TEXT,\n"
        "  payment_details TEXT,\n"
        "  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,\n"
        "  FOREIGN KEY (bakery_id) REFERENCES bakeries(id) ON DELETE RESTRICT\n"
        ");\n\n"
        "CREATE TABLE order_items (\n"
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        "  order_id INTEGER NOT NULL,\n"
        "  cake_id INTEGER,\n"
        "  cake_name TEXT NOT NULL,\n"
        "  cake_image TEXT,\n"
        "  base_price REAL NOT NULL,\n"
        "  quantity INTEGER NOT NULL DEFAULT 1,\n"
        "  subtotal REAL NOT NULL,\n"
        "  is_custom INTEGER NOT NULL DEFAULT 0,\n"
        "  custom_message TEXT,\n"
        "  selected_options TEXT,\n"
        "  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,\n"
        "  FOREIGN KEY (cake_id) REFERENCES cakes(id) ON DELETE SET NULL\n"
        ");\n\n"
        "-- 6. REVIEWS & NOTIFICATIONS TABLES\n"
        "CREATE TABLE reviews (\n"
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        "  order_id INTEGER UNIQUE NOT NULL,\n"
        "  customer_id INTEGER NOT NULL,\n"
        "  bakery_id INTEGER NOT NULL,\n"
        "  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),\n"
        "  comment TEXT NOT NULL,\n"
        "  reply_comment TEXT,\n"
        "  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,\n"
        "  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,\n"
        "  FOREIGN KEY (bakery_id) REFERENCES bakeries(id) ON DELETE CASCADE\n"
        ");\n\n"
        "CREATE TABLE notifications (\n"
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        "  user_id INTEGER NOT NULL,\n"
        "  type TEXT NOT NULL,\n"
        "  title TEXT NOT NULL,\n"
        "  message TEXT NOT NULL,\n"
        "  link_url TEXT,\n"
        "  is_read INTEGER NOT NULL DEFAULT 0,\n"
        "  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n"
        "  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n"
        ");"
    )
    add_code_block(doc, schema_code)
    
    print("Writing Appendix Section 4: Traceability Matrix...")
    # ==================== SECTION 4 ====================
    add_h1(doc, "4. Functional Requirements Traceability Matrix")
    
    add_p(doc, "Every functional requirement is mapped to its implementing frontend components, backend controllers, services, repositories, database tables, and verification tests:")
    
    trace_headers = ["Req ID", "Functional Capability", "Frontend Component", "Backend Controller / Service", "Database Tables", "Verification Test / Status"]
    trace_data = [
        ["FR-001", "User Authentication & JWT", "LoginPage.tsx, RegisterPage.tsx", "authController.ts, authService.ts", "users", "Vitest Test 2, 3, 4 (Verified)"],
        ["FR-002", "Role-Based Access Control", "RequireRole.tsx, RequireAuth.tsx", "authMiddleware.ts (requireRole)", "users.role", "Vitest Test 5 (Verified)"],
        ["FR-003", "Bakery Discovery & Filtering", "BakeriesPage.tsx, BakeryDetailPage.tsx", "bakeryController.ts, bakeryRepo.ts", "bakeries, reviews", "Vitest Test 6 (Verified)"],
        ["FR-004", "Cake Catalog & Details", "CakesPage.tsx, CakeDetailPage.tsx", "cakeController.ts, cakeRepo.ts", "cakes, cake_categories", "Vitest Test 6 (Verified)"],
        ["FR-005", "Interactive 8-Step Studio", "CustomCakeBuilderPage.tsx", "customizationController.ts", "customization_options", "Vitest Test 6 (Verified)"],
        ["FR-006", "Real-Time 3D Visualizer", "Cake3DViewer.tsx (Three.js WebGL)", "Client-side WebGL engine", "N/A (Client graphics)", "Observed in Demo (Verified)"],
        ["FR-007", "Cart Isolation & Max Lead", "CartContext.tsx, CartPage.tsx", "Client Context & orderService.ts", "localStorage ('wl_cart')", "Vitest Test 7 (Verified)"],
        ["FR-008", "Address & Slot Checkout", "CheckoutPage.tsx", "orderController.ts, orderService.ts", "orders", "Vitest Test 7, 9 (Verified)"],
        ["FR-009", "Order Placement & Price Lock", "CheckoutPage.tsx, OrderConfirm.tsx", "orderController.ts, orderService.ts", "orders, order_items", "Vitest Test 7 (Verified)"],
        ["FR-010", "Bakery Order Acceptance", "BakeryOrdersPage.tsx, Dashboard.tsx", "orderController.ts, orderService.ts", "orders.status", "Vitest Test 7 (Verified)"],
        ["FR-011", "Mandatory Rejection Logging", "DeclineOrderModal.tsx", "orderController.ts, schemas.ts", "orders.rejection_reason", "Vitest Test 8 (Verified)"],
        ["FR-012", "Fulfillment Milestone Tracking", "OrderDetailPage.tsx, Timeline.tsx", "orderController.ts, notifRepo.ts", "orders, notifications", "Vitest Test 7 (Verified)"],
        ["FR-013", "Verified Reviews & Replies", "ReviewModal.tsx, BakeryReviews.tsx", "reviewController.ts, reviewRepo.ts", "reviews", "Vitest Test 7 (Verified)"],
        ["FR-014", "Storefront & Catalog Management", "BakeryProfilePage.tsx, CakesPage.tsx", "bakeryController.ts, cakeController.ts", "bakeries, cakes", "Verified in Code"],
        ["FR-015", "Platform Governance Metrics", "AdminDashboardPage.tsx", "adminController.ts, adminRepo.ts", "Platform aggregate SQL", "Vitest Test 4 (Verified)"],
    ]
    build_table(doc, trace_headers, trace_data, col_widths=[0.8, 1.4, 1.4, 1.4, 1.0, 1.0])
    
    print("Writing Appendix Section 5: Edge Cases...")
    # ==================== SECTION 5 ====================
    add_h1(doc, "5. Comprehensive Edge Cases & Exception Handling Matrix")
    
    edge_headers = ["Case ID", "Scenario Description", "Trigger Condition", "Implemented System Defense", "Failure Mode Prevented"]
    edge_data = [
        ["EC-001", "Multi-Bakery Cart Addition", "User adds cake from Bakery B while cart holds Bakery A.", "CartContext prompts modal: 'Clear cart to add from new bakery?'.", "Multi-bakery delivery routing & split payment failure."],
        ["EC-002", "Lead Time Date Violation", "Customer manipulates date picker to select tomorrow for a 3-day cake.", "Backend orderService re-checks deliveryDate >= today + leadDays; rejects 400.", "Baker forced to cancel due to impossible curing window."],
        ["EC-003", "Order Rejection Without Reason", "Bakery attempts to PATCH status to REJECTED with empty string.", "Zod validation catches rejectionReason.min(5); returns HTTP 422.", "Customer receives opaque cancellation with zero explanation."],
        ["EC-004", "Review Before Delivery", "Customer attempts to POST /api/reviews while order is PREPARING.", "Backend verifies order.status === 'DELIVERED'; returns HTTP 400.", "Fake or premature reviews distorting marketplace ratings."],
        ["EC-005", "Duplicate Review Submission", "Customer clicks 'Submit Review' twice rapidly or retries POST.", "Database enforces UNIQUE(order_id) constraint on reviews table.", "Artificially inflated review counts for merchants."],
        ["EC-006", "Negative Quantity or Price Injection", "Malicious client sends { quantity: -2, basePrice: -500 } in payload.", "Zod schema validates quantity.min(1) and basePrice.positive(); rejects 422.", "Negative order totals and revenue calculation corruption."],
        ["EC-007", "SQL Injection in Custom Notes", "Attacker submits `'; DROP TABLE orders; --` in custom inscription.", "All SQL queries use parameterized queries (prepared statements via db.ts).", "Database destruction or arbitrary SQL execution."],
        ["EC-008", "Oversized Inspiration Image", "User uploads raw 40MB DSLR photo as custom reference.", "Frontend rejects files > 8MB; backend Multer enforces 8MB limits.", "Server storage exhaustion and memory crash."],
        ["EC-009", "Unauthorized Dashboard Access", "Customer crafts request to /api/orders/bakery/dashboard with valid token.", "authMiddleware checks user.role === 'BAKERY'; rejects with HTTP 403.", "Customer viewing competitor financials and merchant data."],
        ["EC-010", "Network Disconnect on Payment", "Customer connection drops while submitting checkout.", "Order remains uncommitted; client catches error and prompts safe retry.", "Ghost orders created without confirmation visibility."],
    ]
    build_table(doc, edge_headers, edge_data, col_widths=[0.8, 1.5, 1.5, 1.8, 1.4])
    
    print("Writing Appendix Section 6: Design Tokens & Three.js Specifications...")
    # ==================== SECTION 6 ====================
    add_h1(doc, "6. Design System Tokens & WebGL 3D Visualization Engine")
    
    add_h2(doc, "6.1 Design System Color & Typography Tokens")
    add_p(doc, "Defined in frontend/src/styles/index.css, the warm artisan design system reflects bakery aesthetics:")
    
    token_headers = ["Token CSS Variable", "Hex Value", "Semantic Role & Usage Context"]
    token_data = [
        ["--primary", "#C93B67 (Plum Berry) / #9B2C2C (Deep Maroon)", "Primary brand CTA buttons, active state highlights, accents."],
        ["--primary-light", "#FDF2F4 / #FFF8F6", "Active tab backgrounds, card selection highlights, soft badges."],
        ["--bg-main", "#FDFBF7 (Artisan Flour Cream)", "Main application page background; warm organic canvas."],
        ["--bg-card", "#FFFFFF (Pure Snow White)", "Card containers, modals, forms, and elevation surfaces."],
        ["--text-main", "#1E293B (Deep Charcoal Slate)", "Primary headings, titles, high-contrast readable UI body text."],
        ["--text-muted", "#64748B (Slate Muted Gray)", "Secondary text, metadata, lead time badges, ingredient descriptions."],
        ["--border-light", "#E2E8F0 / #ECE0D1", "Subtle card dividers, input borders, structural table lines."],
        ["--font-serif", "'Playfair Display', Georgia, serif", "Artisan headings (h1, h2, h3), celebration cake titles."],
        ["--font-sans", "'Plus Jakarta Sans', system-ui, sans-serif", "Navigation, buttons, form controls, tables, body text."],
    ]
    build_table(doc, token_headers, token_data, col_widths=[1.8, 2.0, 3.2])
    
    add_h2(doc, "6.2 Three.js WebGL 3D Visualization Engine Architecture")
    add_p(doc, "Implemented in frontend/src/components/ui/Cake3DViewer.tsx, the interactive 3D visualizer provides real-time tactile feedback without external asset loading lag:")
    add_bullet(doc, "Stack dynamically builds 1 to 4 tiers based on user selection. Supports 4 base geometries: CylinderGeometry for Classic Round, custom Shape/ExtrudeGeometry for Sweetheart, BoxGeometry with rounded corners for Crisp Square, and CylinderGeometry with 6 radial segments for Regal Hexagon.", "Procedural Geometry Engine:")
    add_bullet(doc, "Tier meshes utilize MeshStandardMaterial with configurable roughness (0.4) and metalness (0.05). Primary frosting color and accent piping hex values update material uniforms in real-time.", "Dynamic Materials & Shading:")
    add_bullet(doc, "3D garnishes (French Macarons, Exotic Berries, 24K Gold Flecks, Lit Birthday Candle, Botanical Petals) are procedurally attached to the cake crown using local coordinate offsets. The celebration candle includes a pulsating PointLight and particle flame shader.", "Procedural Garnish Positioning:")
    add_bullet(doc, "Three.js OrbitControls permit full 360-degree azimuthal rotation and polar pitch clamping (15 to 85 degrees) to prevent disorienting camera angles.", "Camera & Orbit Controls:")
    
    print("Writing Appendix Section 7: Future Technical Evaluations...")
    # ==================== SECTION 7 ====================
    add_h1(doc, "7. Future Engineering Architecture & Feasibility Evaluations")
    
    add_h2(doc, "7.1 Live Razorpay / Cashfree UPI Gateway Integration Architecture")
    add_p(doc, "Phase 2 requires replacing simulated checkout modals with a licensed Indian payment gateway (Razorpay or Cashfree):")
    add_bullet(doc, "Client requests POST /api/payments/create-order; backend initiates gateway order via Razorpay Node SDK with currency INR; returns order_id.", "1. Order Creation:")
    add_bullet(doc, "Razorpay Checkout JS opens native UPI intent (GPay, PhonePe, Paytm). Upon completion, gateway sends signed payment_id and signature.", "2. Payment Execution:")
    add_bullet(doc, "Backend verifies HMAC-SHA256 signature using razorpay_secret. Order transitions to 'PENDING_CONFIRMATION'.", "3. Signature Verification:")
    add_bullet(doc, "If bakery declines order, backend automatically triggers payment refund API (/v1/payments/:id/refund) and logs reversal in transactions table.", "4. Automated Refund Webhook:")
    
    add_h2(doc, "7.2 Automated WhatsApp Business API Architecture")
    add_p(doc, "To ensure high delivery rates for time-sensitive notifications, the system will integrate WhatsApp Cloud API (or Gupshup):")
    add_bullet(doc, "Approved HSM templates for 'New Order Received', 'Order Accepted', 'Cake Dispatched', and 'Order Rejection Notice'.", "Template Approvals:")
    add_bullet(doc, "orderService triggers async webhook dispatch on status changes; worker queue (BullMQ + Redis) handles delivery retries.", "Event-Driven Worker Queue:")
    
    add_h2(doc, "7.3 Hyperlocal Logistics Dispatch API (Dunzo / Shadowfax API)")
    add_p(doc, "Phase 3 scale requires automated refrigerated courier dispatch:")
    add_bullet(doc, "When order moves to 'READY', system pings 3PL dispatch API with pickup PIN, delivery PIN, thermal box requirement, and customer phone.", "1. Automated Dispatch Call:")
    add_bullet(doc, "Courier accepts assignment; webhook receives rider name, phone, and GPS coordinate tracking URL, rendered in customer order timeline.", "2. Rider Assignment & GPS Tracking:")
    
    output_filename = "Whisk_and_Layers_Technical_Appendix.docx"
    doc.save(output_filename)
    print(f"Technical Appendix successfully saved as: {output_filename}")
    
    abs_path = os.path.abspath(output_filename)
    try:
        word = win32.gencache.EnsureDispatch('Word.Application')
        word.Visible = False
        wdoc = word.Documents.Open(abs_path)
        pages = wdoc.ComputeStatistics(2)
        print(f"Microsoft Word rendered page count: {pages} pages")
        
        pdf_path = os.path.abspath("Whisk_and_Layers_Technical_Appendix.pdf")
        wdoc.SaveAs2(pdf_path, FileFormat=17)
        print(f"Exported PDF copy to: {pdf_path}")
        
        wdoc.Close()
        word.Quit()
        return pages
    except Exception as e:
        print(f"Word COM automation note: {e}")
        return None

if __name__ == "__main__":
    generate_technical_appendix()
