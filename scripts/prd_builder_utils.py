"""
Whisk & Layers - Comprehensive Product Requirements Document (PRD) Generator
Author: Aditya Nair | Senior Product Manager
Target Deliverable: Whisk_and_Layers_PRD_Aditya_Nair.docx
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

# --- Color Palette Constants ---
COLOR_PRIMARY_DARK = "4A1E29"   # Deep Burgundy / Artisan Dark Chocolate
COLOR_ACCENT = "C93B67"         # Brand Raspberry Crimson
COLOR_TEXT_MAIN = "2D3748"      # Slate Charcoal body text
COLOR_TEXT_MUTED = "718096"     # Muted gray text
COLOR_BG_LIGHT = "FFF8F6"       # Soft Warm Cream
COLOR_BG_ALT = "FBF7F7"         # Subtle table zebra tint
COLOR_BORDER = "E2E8F0"         # Clean light border
COLOR_BORDER_STRONG = "CBD5E1"  # Medium border
COLOR_SUCCESS = "059669"        # Forest Emerald
COLOR_WARNING = "D97706"        # Warm Honey / Amber
COLOR_INFO = "2563EB"           # Royal Blue
COLOR_CARD_BORDER = "E5E7EB"

RGB_PRIMARY_DARK = RGBColor(0x4A, 0x1E, 0x29)
RGB_ACCENT = RGBColor(0xC9, 0x3B, 0x67)
RGB_TEXT_MAIN = RGBColor(0x2D, 0x37, 0x48)
RGB_TEXT_MUTED = RGBColor(0x71, 0x80, 0x96)
RGB_WHITE = RGBColor(0xFF, 0xFF, 0xFF)

def set_cell_background(cell, hex_color):
    """Sets cell background shading."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    """Sets inner padding for table cells in dxa (1 pt = 20 dxa)."""
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

def set_cell_borders(cell, top=None, bottom=None, left=None, right=None):
    """Applies custom borders to a cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="{top.get("val", "none") if top else "none"}" w:sz="{top.get("sz", "0") if top else "0"}" w:space="0" w:color="{top.get("color", "auto") if top else "auto"}"/>'
        f'<w:left w:val="{left.get("val", "none") if left else "none"}" w:sz="{left.get("sz", "0") if left else "0"}" w:space="0" w:color="{left.get("color", "auto") if left else "auto"}"/>'
        f'<w:bottom w:val="{bottom.get("val", "none") if bottom else "none"}" w:sz="{bottom.get("sz", "0") if bottom else "0"}" w:space="0" w:color="{bottom.get("color", "auto") if bottom else "auto"}"/>'
        f'<w:right w:val="{right.get("val", "none") if right else "none"}" w:sz="{right.get("sz", "0") if right else "0"}" w:space="0" w:color="{right.get("color", "auto") if right else "auto"}"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

def add_callout(doc, title, paragraphs, border_color=COLOR_ACCENT, bg_color=COLOR_BG_LIGHT):
    """Creates a highlighted callout box with a colored left accent border."""
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.rows[0].cells[0]
    cell.width = Inches(6.67)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=180, right=160)
    
    left_b = {"val": "single", "sz": "36", "color": border_color} # 4.5 pt left border
    thin_b = {"val": "single", "sz": "4", "color": COLOR_BORDER}
    set_cell_borders(cell, top=thin_b, bottom=thin_b, left=left_b, right=thin_b)
    
    # Title paragraph
    cp = cell.paragraphs[0]
    cp.paragraph_format.space_before = Pt(2)
    cp.paragraph_format.space_after = Pt(4)
    cp.paragraph_format.line_spacing = 1.15
    run_t = cp.add_run(f"📌 {title}")
    run_t.font.name = "Segoe UI"
    run_t.font.size = Pt(10.5)
    run_t.font.bold = True
    run_t.font.color.rgb = RGB_PRIMARY_DARK
    
    for idx, p_text in enumerate(paragraphs):
        p = cell.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4 if idx == len(paragraphs)-1 else 2)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(p_text)
        run.font.name = "Segoe UI"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGB_TEXT_MAIN

    # Callout finished

def add_table_component(doc, headers, rows_data, col_widths=None, header_bg=COLOR_PRIMARY_DARK, alt_bg=COLOR_BG_ALT, text_size=9):
    """Creates a professional styled data table with zebra striping, repeated header, and cantSplit rows."""
    tbl = doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    # Repeat header row & cantSplit on all rows
    trPr = tbl.rows[0]._tr.get_or_add_trPr()
    trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
    
    # Format Header Row
    for idx, heading in enumerate(headers):
        cell = tbl.rows[0].cells[idx]
        set_cell_background(cell, header_bg)
        set_cell_margins(cell, top=90, bottom=90, left=120, right=120)
        border = {"val": "single", "sz": "4", "color": COLOR_BORDER_STRONG}
        set_cell_borders(cell, top=border, bottom=border, left=border, right=border)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.1
        run = p.add_run(heading)
        run.font.name = "Segoe UI"
        run.font.size = Pt(text_size)
        run.font.bold = True
        run.font.color.rgb = RGB_WHITE
        
    # Format Body Rows
    for r_idx, row_values in enumerate(rows_data):
        row = tbl.rows[r_idx + 1]
        r_trPr = row._tr.get_or_add_trPr()
        r_trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        
        bg_col = alt_bg if (r_idx % 2 == 1) else "FFFFFF"
        for c_idx, val in enumerate(row_values):
            cell = row.cells[c_idx]
            set_cell_background(cell, bg_col)
            set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
            border = {"val": "single", "sz": "4", "color": COLOR_BORDER}
            set_cell_borders(cell, top=border, bottom=border, left=border, right=border)
            
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.12
            
            # Check for bold prefixes like **Note:**
            text_str = str(val)
            if "**" in text_str:
                parts = text_str.split("**")
                is_bold = False
                for part in parts:
                    if part:
                        r = p.add_run(part)
                        r.font.name = "Segoe UI"
                        r.font.size = Pt(text_size)
                        r.font.color.rgb = RGB_TEXT_MAIN
                        if is_bold:
                            r.font.bold = True
                    is_bold = not is_bold
            else:
                run = p.add_run(text_str)
                run.font.name = "Segoe UI"
                run.font.size = Pt(text_size)
                run.font.color.rgb = RGB_TEXT_MAIN

    # Apply column widths if provided
    if col_widths and len(col_widths) == len(headers):
        for row in tbl.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = Inches(width)

    return tbl

def add_h1(doc, text, page_break=False):
    """Section level 1 heading."""
    if page_break:
        doc.add_page_break()
    h = doc.add_heading(level=1)
    h.paragraph_format.space_before = Pt(10)
    h.paragraph_format.space_after = Pt(2)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(18)
    run.font.bold = True
    run.font.color.rgb = RGB_PRIMARY_DARK
    return h

def add_h2(doc, text):
    """Section level 2 heading."""
    h = doc.add_heading(level=2)
    h.paragraph_format.space_before = Pt(8)
    h.paragraph_format.space_after = Pt(2)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = RGB_ACCENT
    return h

def add_h3(doc, text):
    """Section level 3 heading."""
    h = doc.add_heading(level=3)
    h.paragraph_format.space_before = Pt(6)
    h.paragraph_format.space_after = Pt(2)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(10.5)
    run.font.bold = True
    run.font.color.rgb = RGB_TEXT_MAIN
    return h

def add_p(doc, text, space_after=2):
    """Body paragraph with proper typography and bold markup."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    
    if "**" in text:
        parts = text.split("**")
        is_bold = False
        for part in parts:
            if part:
                r = p.add_run(part)
                r.font.name = "Segoe UI"
                r.font.size = Pt(9.5)
                r.font.color.rgb = RGB_TEXT_MAIN
                if is_bold:
                    r.font.bold = True
            is_bold = not is_bold
    else:
        r = p.add_run(text)
        r.font.name = "Segoe UI"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGB_TEXT_MAIN
    return p

def add_bullet(doc, bold_prefix, text, space_after=2):
    """Styled bullet item."""
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    
    if bold_prefix:
        r_b = p.add_run(bold_prefix + " ")
        r_b.font.name = "Segoe UI"
        r_b.font.size = Pt(9.5)
        r_b.font.bold = True
        r_b.font.color.rgb = RGB_PRIMARY_DARK
        
    r_t = p.add_run(text)
    r_t.font.name = "Segoe UI"
    r_t.font.size = Pt(9.5)
    r_t.font.color.rgb = RGB_TEXT_MAIN
    return p

print("Loaded PRD builder utilities successfully.")
