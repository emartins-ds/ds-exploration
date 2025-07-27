# Design System Documentation

## Overview
This is a custom design system built with Angular, Tailwind CSS v4, and Spartan UI. The system uses custom design tokens defined as CSS custom properties, with dynamic color generation capabilities.

## Architecture

### Custom vs Out-of-the-Box Components

#### ✅ **CUSTOM (Built by us):**
- **Design Tokens**: All spacing, colors, typography, borders, shadows, transitions, and z-index tokens
- **Color Service**: Dynamic color generation with `color2k` library
- **Demo Component**: Custom component showcasing the design system
- **Tailwind Configuration**: Custom v4 configuration
- **CSS Custom Properties**: All design tokens defined as CSS variables

#### 🔧 **OUT-OF-THE-BOX (External libraries):**
- **Spartan UI**: Button component library (installed but not yet styled with our tokens)
- **Angular**: Framework and build system
- **Tailwind CSS v4**: Utility-first CSS framework
- **color2k**: Color manipulation library

## Key Files

### 1. `src/styles/design-tokens.css`
**Purpose**: Contains all custom design tokens as CSS custom properties
**Status**: ✅ Complete - All tokens defined and working with Tailwind v4

**Key Sections:**
- **Spacing**: `--spacing-xs` through `--spacing-4xl`
- **Colors**: Primary, secondary, semantic, text, background, border colors
- **Typography**: Font families, sizes, weights, line heights, letter spacing
- **Borders**: Radius tokens
- **Shadows**: Box shadow tokens
- **Transitions**: Duration and timing tokens
- **Z-Index**: Layering tokens

### 2. `tailwind.config.js`
**Purpose**: Tailwind CSS v4 configuration
**Status**: ✅ Updated for v4 - Simplified configuration

**Key Changes for v4:**
- Removed old v3 `theme.extend` configuration
- Now uses minimal configuration with content paths
- Tailwind v4 automatically generates utilities from CSS custom properties

### 3. `src/app/services/color.service.ts`
**Purpose**: Dynamic color generation and management
**Status**: ✅ Complete - Generates light/dark variations with same luminance

**Features:**
- Generates light and dark variations of primary color
- Updates CSS custom properties dynamically
- Color validation and conversion utilities

### 4. `src/app/components/design-system-demo.component.ts`
**Purpose**: Demo component showcasing the design system
**Status**: ✅ Updated for Tailwind v4 - Uses new utility syntax

**Features:**
- Color picker for dynamic primary color changes
- Display of all three color variants (primary, light, dark)
- Button examples using custom design tokens
- Modern, clean UI design

## Tailwind CSS v4 Integration

### ✅ **Working Configuration:**
- **Spacing**: `p-[var(--spacing-2xl)]` (48px)
- **Colors**: `bg-[var(--color-bg-secondary)]`
- **Typography**: `text-[var(--font-size-4xl)]`
- **Borders**: `border-[var(--color-border-primary)]`
- **Shadows**: `shadow-[var(--shadow-xl)]`
- **Transitions**: `transition-[var(--transition-normal)]`

### 🔧 **Key v4 Changes Applied:**
1. **Simplified Config**: Removed complex `theme.extend` mapping
2. **Direct CSS Variable Usage**: `[var(--token-name)]` syntax
3. **Automatic Utility Generation**: v4 creates utilities from CSS custom properties
4. **No Manual Mapping**: No need to map tokens in config file

## Current Status

### ✅ **Completed:**
- [x] Custom design token system
- [x] Dynamic color generation service
- [x] Tailwind CSS v4 integration
- [x] Demo component with color picker
- [x] All spacing, colors, typography tokens working
- [x] Modern, clean UI design
- [x] Proper spacing and layout

### 🔧 **Current Challenge:**
- **Spartan UI Integration**: Need to style Spartan components to use our custom tokens instead of their default styling

### 📋 **Next Steps:**
1. **Storybook Setup**: Component documentation
2. **Spartan Component Styling**: Apply our design tokens to Spartan components
3. **Additional Components**: Add more Spartan components as needed
4. **Dark Mode**: Implement dark mode support
5. **Component Variants**: Create different button variants using our tokens

## Design Token Usage Examples

### Spacing
```html
<!-- Before (v3): -->
<div class="p-2xl mb-3xl gap-lg">

<!-- Now (v4): -->
<div class="p-[var(--spacing-2xl)] mb-[var(--spacing-3xl)] gap-[var(--spacing-lg)]">
```

### Colors
```html
<!-- Before (v3): -->
<div class="bg-bg-secondary text-text-primary border-border-primary">

<!-- Now (v4): -->
<div class="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border-primary)]">
```

### Typography
```html
<!-- Before (v3): -->
<h1 class="text-4xl font-bold">

<!-- Now (v4): -->
<h1 class="text-[var(--font-size-4xl)] font-[var(--font-weight-bold)]">
```

## Technical Decisions

### 1. **CSS Custom Properties Approach**
- **Why**: Direct control over design tokens, easy dynamic updates
- **Benefit**: Can change values at runtime via JavaScript

### 2. **Tailwind v4 Integration**
- **Why**: Latest version with improved CSS variable support
- **Benefit**: Automatic utility generation from CSS custom properties

### 3. **Custom Color System**
- **Why**: User-generated primary colors with dynamic variations
- **Benefit**: Maintains consistent luminance across color variations

### 4. **Spartan UI Integration**
- **Why**: Headless UI components for consistent behavior
- **Challenge**: Need to override default styling with our tokens

## File Structure
```
src/
├── styles/
│   ├── design-tokens.css          # All custom design tokens
│   └── styles.css                 # Main stylesheet (imports Tailwind + tokens)
├── app/
│   ├── services/
│   │   └── color.service.ts       # Dynamic color generation
│   ├── components/
│   │   └── design-system-demo.component.ts  # Demo component
│   └── app.component.ts           # Main app component
├── tailwind.config.js             # Tailwind v4 configuration
└── package.json                   # Dependencies
```

## Dependencies
- **Angular**: v20.1.0
- **Tailwind CSS**: v4.1.11
- **Spartan UI**: v0.0.1-alpha.491
- **color2k**: v2.0.3 (for color manipulation)
- **TypeScript**: v5.8.2

---

*Last Updated: After Tailwind CSS v4 migration and utility class syntax updates* 