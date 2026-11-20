# MKTify · Visual Design System Baseline (Current)

## Extracted from assets/styles.css

### Color Palette (from :root variables)

| Variable | Hex | Usage |
|----------|-----|-------|
| --bg | #F3F6FB | Page background |
| --bg-2 | #EEF2F8 | Secondary background |
| --card | #FFFFFF | Card surfaces |
| --line | #E3E9F2 | Divider lines |
| --line-2 | #EDF1F7 | Subtle dividers |
| --ink | #16325C | Primary text |
| --ink-2 | #3E4E66 | Secondary text |
| --muted | #7A8CA6 | Muted text |
| --muted-2 | #5C6B7F | More muted text |
| --brand | #0176D3 | Primary brand blue |
| --brand-2 | #00A1E0 | Lighter blue |
| --navy | #032D60 | Dark navy |
| --navy-2 | #0A3D7A | darker navy |
| --green | #2E844A | Success/positive |
| --green-2 | #1FA855 | Green variants |
| --amber | #DF8A1E | Warning/attention |
| --amber-2 | #B65F00 | Amber/orange |
| --purple | #6B4FBB | Purple accent |
| --pink | #C2397B | Pink accent |
| --teal | #0B827C | Teal accent |
| --red | #C23939 | Error/danger |

### Typography

- **Font family**: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif
- **Font size**: 13.5px (base)
- **Headings**: h1,h2,h3,h4 with margin:0
- **Special classes**: .greeting (24px, weight 800), .brand-name span (color: var(--brand))

### Design System Constants

| Constant | Value | Description |
|----------|-------|-------------|
| --radius | 12px | Default border radius |
| --radius-sm | 8px | Small radius |
| --radius-lg | 16px | Large radius |
| --shadow | 0 1px 2px rgba(16,24,40,.06), 0 4px 12px rgba(16,24,40,.05) | Default shadow |
| --shadow-md | 0 8px 24px rgba(16,24,40,.10) | Medium shadow |
| --shadow-lg | 0 20px 50px rgba(3,45,96,.18) | Large shadow |

### Color Themes (from .btn, .pill, .tag styles)

- **Primary actions**: --brand (#0176D3) / --brand-2 (#00A1E0)
- **Success**: --green (#2E844A) / --green-2 (#1FA855)
- **Warning/Amber**: --amber (#DF8A1E) / --amber-2 (#B65F00)
- **Info/Purple**: --purple (#6B4FBB)
- **Pink**: --pink (#C2397B)
- **Teal**: --teal (#0B827C)
- **Danger**: --red (#C23939)

### Spacing & Layout

- **Base spacing**: 8px grid system
- **Container max-width**: 1480px
- **Grid columns**: 12-column grid with 16px gutter
- **Sidebar width**: 252px
- **Main content**: padding 20px 22px (desktop), fluid below 1120px

### Component Styles

#### Buttons
- Height: 32px default, 40px (.sf-btn), 48px (.sf-btn-lg)
- Padding: 0 13px default
- Border-radius: 8px
- Transition: background .12s, transform .08s, box-shadow .12s
- States: hover, active, focus

#### Cards
- Background: var(--card) #FFFFFF
- Border: 1px solid var(--line) #E3E9F2
- Border-radius: var(--radius) 12px
- Box-shadow: var(--shadow) 0 1px 2px rgba(16,24,40,.06), 0 4px 12px rgba(16,24,40,.05)

#### Modals
- Background: #fff
- Border-radius: 14px
- Max-width: min(920px, 100%)
- Wide: min(1080px, 100%)
- Shadow: var(--shadow-lg)
- Padding: 16px 20px body, 18px 20px head

#### Tables
- border-collapse: collapse
- Font-size: 12px
- Header: var(--bg-2) #EEF2F7, color var(--muted)
- Row hover: #F8FAFD

#### Navigation
- Topbar height: 52px
- Sidebar: 252px wide (desktop), collapsible to hidden (mobile)
- Brand: font-weight 800, font-size 16px, color var(--ink)

#### Colors by component type
- **KPI cards**: colored icons (.ic.blue, .ic.green, .ic.purple, .ic.amber)
- **Status pills**: color-coded by status tone
- **Nav badges**: various colors for different meanings
- **Avatar backgrounds**: gradient linear 135deg

### Responsive Breakpoints (from media queries)

| Breakpoint | Max-width | Changes |
|------------|-----------|---------|
| 1280px | Full | Camp/proj/services grid: 3 cols → 2 cols |
| 1120px | Full | kpi-grid: 4 → 2 cols, various full-width overrides |
| 980px | Full | menu-toggle displays, sidebar position changes |
| 820px | Full | sf-nav padding, sf-links hidden, hero adjustments |
| 760px | Full | kpi-grid: 1fr 1fr, col-4 → span 12, appbar changes |
| 560px | Full | kpi-grid: 1fr, tb-right items hidden, svc-heroArt hidden, various full-width |
| 320px-425px | Full | Full mobile stack, single column layouts |

### Icon System

- 67 SVG symbols in sprite (index.html lines 17-83)
- All icons: currentColor, stroke-width 1.8, stroke-linecap round
- Sizes vary by context: 16px, 24px, 30px, 32px, 36px, 44px

### Visual Effects

- **Gradients**: Used for avatars (135deg), branding elements
- **Shadows**: Layered, subtle, consistent 10px-80px offsets
- **Opacity**: .12, .22, .05, .18 used for overlays and depth
- **Transitions**: .12s default on buttons, transforms on hover
- **Sparkline/sparkles**: decorative SVG elements

### Special Themes

- **Landing page (sf-)**: Radial gradients, strong brand colors, hero section
- **App shell**: Clean, sticky topbar, responsive sidebar
- **Pricing sections**: Card-based with featured styling
- **Charts**: SVG with grid, target lines, fill areas

---
*This baseline documents the current visual system before the complete redesign.*