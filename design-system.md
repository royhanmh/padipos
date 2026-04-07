# PadiPos Design System

## Overview
This document is the canonical UI specification for PadiPos.

- Canonical source rule: provided design boards are the source of truth.
- Implementation may lag behind this spec; gaps are tracked in `Implementation Mapping`.
- Token-first rule: use semantic design tokens, then map to component styles.
- Scope: foundations, component behavior, and layout patterns used by cashier and admin flows.

## Foundations

### Color Tokens

#### Primary Blue

| Token | Hex |
| --- | --- |
| `color-primary-blue-900` | `#0E43AF` |
| `color-primary-blue-800` | `#104CC6` |
| `color-primary-blue-700` | `#1255DE` |
| `color-primary-blue-600` | `#1C61ED` |
| `color-primary-blue-500` | `#3572EF` |
| `color-primary-blue-400` | `#4B82F1` |
| `color-primary-blue-300` | `#6392F3` |
| `color-primary-blue-200` | `#7BA3F5` |
| `color-primary-blue-100` | `#C2D4FA` |

#### Primary Purple

| Token | Hex |
| --- | --- |
| `color-primary-purple-900` | `#171146` |
| `color-primary-purple-800` | `#251B6F` |
| `color-primary-purple-700` | `#322598` |
| `color-primary-purple-600` | `#402FC1` |
| `color-primary-purple-500` | `#4C3BCF` |
| `color-primary-purple-400` | `#5E4FD4` |
| `color-primary-purple-300` | `#8478DE` |
| `color-primary-purple-200` | `#A9A1E8` |
| `color-primary-purple-100` | `#BCB5ED` |

#### Neutral

| Token | Hex |
| --- | --- |
| `color-neutral-900` | `#2B2B2B` |
| `color-neutral-800` | `#5E5E5E` |
| `color-neutral-700` | `#787878` |
| `color-neutral-600` | `#919191` |
| `color-neutral-500` | `#ABABAB` |
| `color-neutral-400` | `#C4C4C4` |
| `color-neutral-300` | `#DEDEDE` |
| `color-neutral-200` | `#F7F7F7` |
| `color-neutral-100` | `#FFFFFF` |

#### Success

| Token | Hex |
| --- | --- |
| `color-success-900` | `#004707` |
| `color-success-800` | `#006109` |
| `color-success-700` | `#007A0B` |
| `color-success-600` | `#00940E` |
| `color-success-500` | `#00AF10` |
| `color-success-400` | `#00C712` |
| `color-success-300` | `#00E015` |
| `color-success-200` | `#14FF2A` |
| `color-success-100` | `#61FF6F` |

#### Danger

| Token | Hex |
| --- | --- |
| `color-danger-900` | `#990000` |
| `color-danger-800` | `#B20000` |
| `color-danger-700` | `#CC0000` |
| `color-danger-600` | `#E50000` |
| `color-danger-500` | `#FF0000` |
| `color-danger-400` | `#FF3333` |
| `color-danger-300` | `#FF6666` |
| `color-danger-200` | `#FF9999` |
| `color-danger-100` | `#FFCCCC` |

#### Warning

| Token | Hex |
| --- | --- |
| `color-warning-900` | `#C28E00` |
| `color-warning-800` | `#DBA100` |
| `color-warning-700` | `#F5B300` |
| `color-warning-600` | `#FFBF0F` |
| `color-warning-500` | `#FFC62A` |
| `color-warning-400` | `#FFCD42` |
| `color-warning-300` | `#FFD35C` |
| `color-warning-200` | `#FFDA75` |
| `color-warning-100` | `#FFE18F` |

#### Info

| Token | Hex |
| --- | --- |
| `color-info-900` | `#0080A8` |
| `color-info-800` | `#0093C2` |
| `color-info-700` | `#00A7DB` |
| `color-info-600` | `#00BAF5` |
| `color-info-500` | `#12C6FF` |
| `color-info-400` | `#42D2FF` |
| `color-info-300` | `#75DEFF` |
| `color-info-200` | `#A8EAFF` |
| `color-info-100` | `#DBF6FF` |

### Typography

#### Font Family

- Primary font: `Roboto`

#### Weight Tokens

| Token | Weight |
| --- | --- |
| `font-light` | `300` |
| `font-regular` | `400` |
| `font-medium` | `500` |
| `font-semi-bold` | `600` |
| `font-bold` | `700` |

#### Type Scale

| Token | Size | Line Height | Typical Use |
| --- | --- | --- | --- |
| `text-xs` | `12px` | `16px` | Helper text, micro labels |
| `text-sm` | `14px` | `20px` | Input labels, secondary metadata |
| `text-base` | `16px` | `24px` | Body copy, button text |
| `text-lg` | `18px` | `26px` | Dense list emphasis |
| `text-xl` | `20px` | `28px` | Section headings |
| `text-2xl` | `24px` | `32px` | Sub-page titles |
| `text-3xl` | `30px` | `38px` | Auth page hero title |
| `text-4xl` | `36px` | `44px` | Display heading |

### Radii, Spacing, and Shadows

#### Radius Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `radius-sm` | `8px` | Small chips, compact controls |
| `radius-md` | `10px` | Inputs, primary buttons |
| `radius-lg` | `12px` | Filter pills, secondary controls |
| `radius-xl` | `16px` | Elevated sections |
| `radius-card` | `20px` | Standard cards (canonical) |
| `radius-card-legacy` | `28px` | Legacy modal/card surfaces |
| `radius-full` | `9999px` | Circular and pill elements |

#### Spacing Tokens

| Token | Value |
| --- | --- |
| `space-1` | `4px` |
| `space-2` | `8px` |
| `space-3` | `12px` |
| `space-4` | `16px` |
| `space-5` | `20px` |
| `space-6` | `24px` |
| `space-8` | `32px` |
| `space-10` | `40px` |
| `space-12` | `48px` |

#### Shadow Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `shadow-soft-sm` | `0 8px 24px rgba(25, 45, 88, 0.05)` | Light cards |
| `shadow-soft-md` | `0 12px 30px rgba(25, 45, 88, 0.04)` | Secondary panels |
| `shadow-soft-lg` | `0 14px 36px rgba(25, 45, 88, 0.05)` | Elevated containers |
| `shadow-overlay` | `0 22px 60px rgba(17, 24, 39, 0.2)` | Dialogs and auth card |
| `shadow-overlay-lg` | `0 24px 64px rgba(17, 24, 39, 0.2)` | Large modals |
| `shadow-brand` | `0 12px 28px rgba(53, 114, 239, 0.24)` | Emphasis actions |

## Components

### 1. Button

- Variants:
  - `button-filled-primary`
  - `button-outline-primary`
  - `button-filled-disabled`
  - `button-outline-disabled`
- Content modes:
  - Text only
  - Text + trailing icon (chevron/arrow)
  - Icon only (square button)
- Sizes:
  - `lg`: height `48px`
  - `md`: height `40px`
  - `sm`: height `32px`
- States:
  - Default
  - Hover
  - Focus-visible (2px ring)
  - Disabled

### 2. Input

- Field types:
  - Text
  - Password (with show/hide icon)
  - Select
  - Search box
  - Text area
- States:
  - Default
  - Focus
  - Error (with helper text)
  - Disabled
- Content structure:
  - Label (top)
  - Field container
  - Optional helper or error text
- Baseline sizing:
  - Desktop field height `48px`
  - Large form field height `52px`

### 3. Date Picker

- Trigger field behaves as input component.
- Popup contains:
  - Month selector
  - Year selector
  - Previous/next month controls
  - Weekday header row
  - 6-row date matrix
- Day states:
  - Default day
  - Selected day
  - Today marker
  - Out-of-month day
  - Disabled day

### 4. Time Picker

- Trigger field behaves as input component.
- Popup contains:
  - Header title
  - Hour/minute steppers
  - Editable time values
  - `Clear` and `Apply` actions
- States:
  - Closed
  - Open idle
  - Active edit
  - Confirmed value
  - Disabled action

### 5. Label / Chip

- Types:
  - Solid label
  - Outline label
- Modes:
  - With close icon
  - Without close icon
- States:
  - Default
  - Hover
  - Disabled
- Sizing:
  - Compact and regular chips with pill radius

### 6. Toast

- Variants:
  - Success
  - Error
  - Warning
  - Info
- Anatomy:
  - Left accent rail
  - Leading status icon
  - Message content
  - Dismiss action
- Behavior:
  - Non-blocking
  - Stackable
  - Manual dismiss required by default

### 7. Logo

- Logo marks:
  - Circular mark
  - Square mark
- Lockups:
  - Mark + wordmark horizontal
  - Mark-only compact usage
- Background compatibility:
  - Blue surface
  - White surface
  - Dark surface
- Usage rules:
  - Keep clear space equal to mark radius
  - Do not stretch or recolor outside token set
  - Keep minimum readable lockup width in compact UI

### 8. Iconography

- Current implementation package:
  - `react-icons` (`Pi*` and `Ai*` sets)
- Coverage categories from design boards:
  - Money
  - Video, Audio, Image
  - Programing
  - Essential
  - Type, Paragraph, Character
  - Arrow
  - Emails, Messages
  - Location
  - Support, Like, Question
  - Security
  - Design, Tools
  - Content, Edit
  - Grid
  - Crypto, Company
  - Shop
  - Crypto Currency
  - Call
  - Notifications
  - Users
  - Business
  - Settings
  - Car
  - Building
  - Archive
  - School, Learning
  - Astrology
  - Time
  - Delivery
  - Search
  - Weather
  - Computers, Devices, Electronics
  - Files

## Layout Patterns

### 1. Header / Topbar

- Structure:
  - Left: search field
  - Right: optional utility action(s), profile block, logout action
- States:
  - Default neutral
  - Highlighted utility link state (active blue)
  - Role-specific profile metadata
- Layout rules:
  - Keep search and action area on one row at desktop width
  - Preserve spacing rhythm between action, avatar, and sign-out

### 2. Sidebar

- Variants:
  - Cashier
  - Admin dashboard
- Density modes:
  - Collapsed (icon-first)
  - Expanded (icon + label)
- Navigation states:
  - Default
  - Hover
  - Active text/icon color
  - Active vertical indicator bar
- Identity area:
  - Brand mark at top
  - Secondary control beneath logo

### 3. Menu & Card Patterns

- Category tabs:
  - Active category pill
  - Inactive category pill
  - Disabled category pill
- Product/menu card states:
  - Default
  - Selected
  - Disabled
- Order card states:
  - Empty cart with disabled pay action
  - Filled cart with totals and enabled pay action
  - Scrollable list when item count exceeds card height

## Implementation Mapping

| Spec Area | Current Implementation | Status | Notes |
| --- | --- | --- | --- |
| Button | `frontend/src/components/PrimaryButtonComponent.jsx` and page-level button classes | Partial | Shared primary exists; secondary/outline styles are still mostly inline. |
| Input | `frontend/src/components/DefaultInputComponent.jsx` | Partial | Shared text/password exists; select/search/textarea are partially inline. |
| Date Picker | `frontend/src/features/sales-report/components/DatePickerField.jsx` | Implemented | Shared date picker exists in sales report flow. |
| Time Picker | No shared primitive | Spec only | Create reusable time picker component to match board states. |
| Label / Chip | Inline chip patterns in pages (catalog and filters) | Spec only | No shared label/chip component yet. |
| Toast | Inline toast patterns in `frontend/src/pages/dashboard/CatalogPage.jsx` and `frontend/src/features/settings/components/SettingsView.jsx` | Partial | Needs shared toast primitive for consistency. |
| Logo | `frontend/public/images/BlueRoundLogo.png`, `frontend/public/images/PrimaryRoundIcon.png` | Implemented | Variants exist; usage rules now documented. |
| Iconography | `react-icons` usage across layouts and pages | Implemented | Central package exists; category governance documented here. |
| Header / Topbar | `frontend/src/layouts/TopbarLayout.jsx` | Implemented | Matches header board pattern with optional utility region. |
| Sidebar | `frontend/src/layouts/SidebarLayout.jsx` | Implemented | Supports role variants and active indicator pattern. |
| Menu & Card | `frontend/src/pages/kasir/KasirCatalogPage.jsx`, `frontend/src/pages/dashboard/CatalogPage.jsx` | Partial | Rich patterns exist but are page-scoped, not extracted primitives. |
| Auth Card | `frontend/src/components/LoginCardComponent.jsx`, `frontend/src/components/AuthPageShell.jsx` | Implemented | Canonical auth surface pattern exists and can inherit token updates. |

## Adoption Notes

### Canonical Rule

- When implementation differs from this document, update code to match this document unless product explicitly approves an exception.
- New UI work must reference tokens from `Foundations` before adding new raw values.

### Token Naming Convention (Tailwind `@theme` Migration Ready)

- Color token format: `--color-{group}-{step}`  
  Example: `--color-primary-blue-500`
- Radius token format: `--radius-{name}`  
  Example: `--radius-card`
- Spacing token format: `--space-{scale}`  
  Example: `--space-6`
- Shadow token format: `--shadow-{name}`  
  Example: `--shadow-overlay`
- Typography token format: `--font-{family|weight}` and `--text-{scale}`

### UI PR Checklist

- Confirm component uses existing shared primitive before adding inline styling.
- Validate all required states: default, hover, focus, disabled, and error where applicable.
- Use semantic tokens, not ad hoc raw values, except during approved migration bridges.
- Validate role-specific layouts (cashier and admin) when touching shared navigation/header.
- Update this document if a new component pattern or token is introduced.
