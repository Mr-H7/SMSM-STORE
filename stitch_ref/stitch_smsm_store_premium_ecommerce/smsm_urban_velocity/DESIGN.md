---
name: SMSM Urban Velocity
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e8bdb6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ae8881'
  outline-variant: '#5e3f3a'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#690000'
  primary-container: '#cd0000'
  on-primary-container: '#ffdbd5'
  inverse-primary: '#c00000'
  secondary: '#c8c6c0'
  on-secondary: '#30312c'
  secondary-container: '#474742'
  on-secondary-container: '#b6b5af'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#666565'
  on-tertiary-container: '#e6e3e2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930000'
  secondary-fixed: '#e4e2dc'
  secondary-fixed-dim: '#c8c6c0'
  on-secondary-fixed: '#1b1c18'
  on-secondary-fixed-variant: '#474742'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is engineered for the high-end sneaker enthusiast, blending the aggressive aesthetics of urban sportswear with the refined precision of a luxury boutique. The personality is authoritative, "product-obsessed," and unapologetically dark. By stripping away lifestyle fluff and focusing on the technical beauty of footwear, the UI establishes an atmosphere of exclusive "drops" and elite performance.

The visual direction follows a **High-Contrast Minimalism** approach. It utilizes deep blacks to create a void where product photography serves as the primary light source. The aesthetic is punctuated by surgical applications of Cherry Red to denote action and urgency. The experience must feel "mechanical" yet premium—evoking the craftsmanship of a high-performance sneaker.

For the international audience, the system is built on a symmetrical logic that allows for seamless LTR (English) and RTL (Arabic) transitions without losing the structural integrity of the "bold-and-blocked" layout.

## Colors

The palette is anchored in a true dark-mode experience. **#0F0F0F** serves as the primary canvas, providing a more sophisticated depth than pure black, while **#1A1A1A** is used for subtle container layering. 

**Cherry Red (#CD0000)** is the "Pulse" color. It is used sparingly for critical calls to action, price highlights, and limited-edition badges to maintain its psychological impact. **Soft Warm White (#EFEDE6)** is the primary typographic and icon color, chosen to reduce eye strain against the dark background compared to a clinical pure white, adding a "luxury paper" feel to the digital interface.

**Color Usage Guidelines:**
- **Primary (Cherry Red):** Action buttons, notifications, active states.
- **Neutral (Deep Black):** Page backgrounds and global navigation.
- **Secondary (Warm White):** High-level headers and body copy.
- **Surface (Dark Gray):** Product cards and input fields to differentiate from the background.

## Typography

The typography system relies on a "Technical-Humanist" pairing. **Space Grotesk** is the voice of the brand—its geometric, slightly futuristic letterforms mirror the industrial design of high-end sneakers. It is reserved for headlines and hero statements. **Inter** provides a highly legible, utilitarian balance for body copy, product specs, and checkout flows.

**Bilingual Implementation:**
- **LTR (English):** Space Grotesk used for all H1-H4 tags.
- **RTL (Arabic):** Use a high-quality geometric Kufi-style typeface (like IBM Plex Sans Arabic) that matches the x-height and weight of Inter to maintain visual parity.
- **Uppercase:** Strategic use of uppercase for labels and navigation items in English to enhance the "luxury sports" feel; ensure equivalent emphasis in Arabic through weight or character tracking.

## Layout & Spacing

The design system utilizes a **12-column fixed grid** on desktop to ensure product imagery remains centralized and impactful. Spacing follows a strict 4px base unit, favoring generous "breathing room" (stack-lg) between sections to prevent the dark interface from feeling claustrophobic.

**Layout Principles:**
- **Product Focus:** Product grids use an asymmetrical balance where possible to create a dynamic "urban" feel.
- **Symmetry:** Layouts must flip logically for RTL. Margins on the left in LTR become margins on the right in RTL.
- **Gutters:** 24px gutters ensure that sneaker silhouettes never feel crowded, allowing the negative space to frame the items like museum pieces.

## Elevation & Depth

In a dark, sneaker-store aesthetic, depth is created through **Tonal Layering** rather than traditional shadows. Surfaces "lift" by becoming slightly lighter.

- **Level 0 (Background):** #0F0F0F.
- **Level 1 (Cards/Items):** #1A1A1A with a 1px border of #333333 for definition.
- **Level 2 (Modals/Popovers):** #1A1A1A with a soft, diffused black shadow (0px 20px 40px rgba(0,0,0,0.8)) and a subtle "inner glow" border of #333333.
- **Interaction:** Hovering over a product card should trigger a slight border-color shift to #CD0000 or #EFEDE6, signaling precision and responsiveness.

## Shapes

The shape language is **Refined & Sharp**. To maintain the "urban" and "sporty" energy, we avoid overly bubbly or friendly shapes. 

- **Primary Corners:** A subtle 4px (0.25rem) radius is used for product cards and containers. This is enough to feel "finished" and "premium" without losing the aggressive edge required by the brand.
- **Action Elements:** Buttons and input fields use the same 4px radius. 
- **Icons:** Use sharp, 2px stroke-weight icons. Avoid filled icons unless indicating an active toggle state.

## Components

### Buttons
- **Primary:** Background #CD0000, Text #EFEDE6, 4px radius. High-gloss hover state (increase brightness slightly).
- **Secondary:** Transparent background, 1px border #EFEDE6, Text #EFEDE6.
- **Tertiary/Ghost:** Text #EFEDE6 with underline on hover.

### Product Cards
- Background #1A1A1A. 
- Image aspect ratio 1:1 or 4:5 to emphasize the sneaker silhouette. 
- No visible shadows; use a 1px #333333 border. 
- On hover: The image scales slightly (1.05x) and the border shifts to #EFEDE6.

### Input Fields
- Background #1A1A1A. 
- Border 1px #333333. 
- Focus state: Border becomes #CD0000 with a subtle red outer glow. 
- Label: Inter Bold, uppercase, 12px.

### Badges & Tags
- "Limited Drop" or "New" badges use a sharp-edged rectangular shape.
- Color: #CD0000 background for "High Alert" items; #EFEDE6 with black text for "Premium/Exclusive" items.

### Navigation
- Global Nav: Sticky, #0F0F0F background with a 1px #1A1A1A bottom border.
- RTL Support: Menu items, search bars, and account icons must flip orientation. Cart drawers should slide from the left in LTR and from the right in RTL.