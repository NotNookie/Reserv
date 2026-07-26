---
name: Clinical Precision
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#424751'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#727782'
  outline-variant: '#c2c6d2'
  surface-tint: '#1960a6'
  primary: '#004782'
  on-primary: '#ffffff'
  primary-container: '#185fa5'
  on-primary-container: '#c1d9ff'
  inverse-primary: '#a4c9ff'
  secondary: '#5f5e5a'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfda'
  on-secondary-container: '#64635e'
  tertiary: '#464644'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e5d5c'
  on-tertiary-container: '#d9d7d4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a4c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#e5e2dd'
  secondary-fixed-dim: '#c9c6c1'
  on-secondary-fixed: '#1c1c19'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#e5e2e0'
  tertiary-fixed-dim: '#c9c6c4'
  on-tertiary-fixed: '#1c1c1a'
  on-tertiary-fixed-variant: '#474745'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
  status-confirmed-text: '#3B6D11'
  status-confirmed-bg: '#EAF3DE'
  status-pending-text: '#854F0B'
  status-pending-bg: '#FAEEDA'
  status-cancelled-text: '#A32D2D'
  status-cancelled-bg: '#FCEBEB'
  status-info-text: '#0F6E56'
  status-info-bg: '#E1F5EE'
  brand-muted: '#E6F1FB'
typography:
  stat-value:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  detail-name:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '700'
    lineHeight: 24px
  topbar-title:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  ui-small:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-badge:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  metadata:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  micro:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
  mono:
    fontFamily: Courier Prime
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  app-padding: 20px
  grid-gap: 14px
  row-gap: 12px
  item-gap: 10px
  card-px: 20px
  card-py: 16px
  sidebar-w: 230px
  sidebar-w-collapsed: 56px
---

## Brand & Style

The design system is built for high-stakes healthcare environments where clarity, speed of data acquisition, and professional trust are paramount. It adopts a **Corporate / Modern** style infused with **Minimalist** principles to reduce cognitive load for medical professionals. 

The aesthetic is characterized by an "Information-Dense Minimalism"—utilizing a rigorous grid, hairline borders, and a sophisticated cool-toned palette to create an environment that feels clinical, orderly, and technologically advanced. The UI evokes a sense of calm and competence, ensuring that critical patient data remains the primary focus while supporting rapid triage and record management.

## Colors

This design system utilizes a structured semantic palette designed for clinical readability. The primary blue is the anchor for action and brand identity, while a tiered neutral system (`primary` white for surfaces, `secondary` soft gray for cards, and `tertiary` for the workspace background) creates subtle depth without relying on heavy shadows.

Status colors are meticulously paired (text and background) to ensure high accessibility and immediate recognition:
- **Confirmed**: A deep forest green on a pale mint background, signifying safety and completion.
- **Pending**: A warm amber on a soft cream, denoting items requiring attention or in progress.
- **Cancelled/Danger**: A sharp crimson on a pale rose, highlighting errors, cancellations, or urgent alerts.

## Typography

The typography system prioritizes legibility in high-density data environments. Using **Inter** for all primary UI elements provides a clean, neutral, and systematic feel that excels at small sizes. 

- **Hierarchy:** Use `stat-value` for primary metrics and `detail-name` for patient identities to establish an immediate focal point. 
- **Utility:** The `micro` and `label-badge` roles should be used for secondary metadata to maximize screen real estate.
- **Precision:** `mono` (Courier Prime) is reserved strictly for technical data, such as ICD-10 codes or Patient IDs, where character differentiation is critical for accuracy.

## Layout & Spacing

This design system employs a **Fluid Grid** with fixed-width sidebars to maximize the utility of the workspace. The layout logic is built on a modular 12px/14px rhythm, ensuring a consistent vertical and horizontal cadence.

- **Desktop:** A fixed 230px sidebar persists on the left. The main content area uses a 20px margin and a flexible 12-column grid.
- **Tablet:** The sidebar collapses to an icon-only 56px view. Gutters remain at 14px to maintain data density.
- **Mobile:** The layout reflows to a single column with a bottom navigation bar or a hamburger menu. Internal card padding may reduce to 12px to preserve space.

The spacing units are designed to create "tight" groupings, allowing clinicians to see more information without scrolling.

## Elevation & Depth

Depth is established through **Tonal Layering** and **Hairline Outlines** rather than traditional shadows. This keeps the interface feeling "light" and technical.

- **Surface Strategy:** The lowest layer is the workspace background (`#f1f0ec`). Interactive cards and navigation elements sit one "level" above on a primary white surface.
- **Borders:** All containers, inputs, and buttons use a consistent `0.5px` border. This razor-thin line provides enough definition to separate elements while maintaining the minimalist aesthetic.
- **Interactions:** A subtle focus ring (`0 0 0 3px` with 12% opacity of the primary blue) is the only shadow used, signifying active input states without disrupting the flat visual language.

## Shapes

The shape language is "Rounded" to soften the clinical edge of the interface, making the software feel approachable yet modern.

- **Large Radius (12px):** Applied to primary containers, cards, and modals to define major content areas.
- **Medium Radius (8px):** The standard for interactive elements like buttons, input fields, and stat cards.
- **Pill (20px+):** Specifically reserved for status badges and tags, creating a distinct visual contrast from the rectangular grid of the rest of the UI.
- **Circular (50%):** Used exclusively for avatars and user icons.

## Components

### Buttons
Buttons should be crisp and purposeful. Primary buttons use the Brand Blue with white text. Secondary buttons use a hairline border with the Primary Blue as the text color. High-priority "Danger" actions use the red status palette. All buttons feature a subtle scale-down effect (`0.98`) on click for tactile feedback.

### Status Badges
Badges are pill-shaped with 600 weight typography. Use the semantic background/text pairings defined in the color section:
- **Confirmed:** Green palette.
- **Pending:** Amber palette.
- **Cancelled:** Red palette.

### Input Fields
Inputs use an 8px corner radius and a 0.5px border. The label sits above the field in `label-badge` typography. On focus, the border color shifts to the Primary Blue with a soft blue focus ring.

### Cards & Stat Cards
Standard cards house complex data tables or forms. Stat cards are smaller, using the `secondary` background color to distinguish them as high-level summary components, featuring a `stat-value` and `metadata` label.

### Lists & Tables
Tables are the heart of the system. Use 0.5px horizontal dividers and `ui-small` typography for body rows. Headers use `metadata` styling with a light gray background to anchor the columns.