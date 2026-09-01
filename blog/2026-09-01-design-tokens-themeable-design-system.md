# Design Tokens: How We Built a Themeable Design System

*Published: September 1, 2026 | Author: WyattAu*

---

Design tokens are the atomic values of a design system -- colors, spacing, typography, shadows, and other visual properties extracted into named, reusable variables. They're the contract between designers and developers, and the foundation that makes theming possible.

In this post, we'll walk through how `@pediment/tokens` works, the architecture behind it, and how to create custom themes.

## What Are Design Tokens?

Instead of hardcoding `#ffffff` or `16px` throughout your CSS, you define tokens:

```css
--text-primary: #ffffff;
--space-md: 1rem;
```

Then reference them everywhere:

```css
color: var(--text-primary);
padding: var(--space-md);
```

The benefit is simple: change the token definition, and every reference updates. Switch themes by swapping which token values are active.

## Our Token Architecture

`@pediment/tokens` uses Tailwind v4's `@theme` directive to register CSS custom properties. The token system is organized into four layers:

### 1. Spatial Materialism: Elevation and Space

This layer defines how depth and spacing work across the interface:

```css
@theme {
  /* Elevation tiers — single light source, top-left */
  --shadow-elevation-0: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-elevation-1: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-elevation-2: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-elevation-3: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-elevation-4: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
  --shadow-glow: 0 0 20px rgba(var(--accent-rgb, 0, 229, 255), 0.3);

  /* Z-index layers */
  --z-bg: 0;
  --z-content: 10;
  --z-nav: 100;
  --z-overlay: 500;
  --z-modal: 1000;

  /* Fluid spacing — clamp() adapts to viewport */
  --space-fluid-xs: clamp(0.25rem, 0.5vw, 0.5rem);
  --space-fluid-sm: clamp(0.5rem, 1vw, 1rem);
  --space-fluid-md: clamp(1rem, 2vw, 2rem);
  --space-fluid-lg: clamp(2rem, 4vw, 4rem);
  --space-fluid-xl: clamp(4rem, 8vw, 8rem);

  /* Max content width */
  --max-width: 1200px;
}
```

The elevation tiers follow a consistent visual language: each tier adds more spread and blur, creating a natural sense of depth. The light source is always top-left, which keeps the visual metaphor consistent across components.

Fluid spacing uses CSS `clamp()` to scale between viewport sizes without breakpoints. A `--space-fluid-md` value is 1rem on a phone and 2rem on a wide desktop, scaling linearly in between.

### 2. Amoebic UI: Radii and Motion

This layer defines the organic, flowing character of the interface:

```css
@theme {
  /* Organic border radii */
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 24px;
  --radius-pill: 999px;
  --radius-organic: 42% 58% 70% 30% / 45% 45% 55% 55%;

  /* Easing curves */
  --ease-organic: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-organic-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-organic-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-brutal: cubic-bezier(0.9, 0, 0.1, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Duration tiers */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
}
```

The `--radius-organic` value creates an asymmetric, blob-like shape using CSS border-radius with 8 values. It's used sparingly -- for decorative elements, avatars, and accent shapes -- not for buttons or cards where predictability matters.

The easing curves define the personality of motion:
- **`--ease-organic`**: Smooth, natural movement (default for most transitions)
- **`--ease-spring`**: Bouncy, playful feel (hover states, small elements)
- **`--ease-brutal`**: Sharp, decisive motion (modals appearing, notifications)

### 3. Typography Scale

Fluid type sizes that scale between mobile and desktop:

```css
@theme {
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-display: "Inter", system-ui, sans-serif;

  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 0.95rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.1rem);
  --text-lg: clamp(1.125rem, 1rem + 0.6vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.4rem + 2.5vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 1.5rem + 3.5vw, 3.5rem);
}
```

The `clamp()` function makes every text size responsive without media queries. On a 320px phone, `--text-base` is 1rem. On a 1920px desktop, it's 1.1rem. The scaling is subtle enough to maintain readability at all sizes.

### 4. Theme Variants (Semantic Tokens)

Themes define the actual color values. Each theme targets the `data-theme` attribute:

```css
[data-theme="midnight-navy"] {
  --bg-primary: #050505;
  --bg-secondary: #0a0a0a;
  --bg-card: #111111;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --accent: #00e5ff;
  --accent-warm: #ff6b35;
  --border: #222222;
}
```

The five shipped themes:

| Theme | Style | Background | Accent |
|-------|-------|-----------|--------|
| `midnight-navy` | Dark, professional | Near-black | Cyan |
| `tokyo-night` | Dark, urban | Deep navy | Purple |
| `arctic-dawn` | Light, cool | White-blue | Blue |
| `solaris` | Light, warm | Cream | Orange |
| `light` | Light, neutral | White | Blue |

## Creating a Custom Theme

To create a new theme, define a CSS file with the same token names:

```css
/* my-custom-theme.css */
[data-theme="forest-dusk"] {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-card: #1c2128;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --accent: #3fb950;
  --accent-warm: #d29922;
  --border: #30363d;
}
```

Then import it after the base tokens:

```css
@import "@pediment/tokens";
@import "./my-custom-theme.css";
```

Apply it to your HTML:

```html
<html data-theme="forest-dusk">
```

All components automatically pick up the new colors because they reference `var(--bg-card)`, `var(--text-primary)`, etc. -- never raw hex values.

## Using Tokens in Components

Components reference tokens via CSS custom properties. Here's the Modal component using elevation, border radius, and color tokens:

```tsx
<div class="w-full max-w-lg mx-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-elevation-4)]">
```

The class `rounded-[var(--radius-md)]` uses Tailwind's arbitrary value syntax to reference the token. This works because `@theme` registers the custom property with Tailwind, making it available in class utilities.

## Token Naming Conventions

We follow a consistent pattern:

- **`--bg-*`**: Background colors (primary, secondary, card)
- **`--text-*`**: Text colors (primary, secondary)
- **--accent*`**: Accent colors (primary accent, warm accent)
- **`--border`**: Border color
- **`--shadow-*`**: Elevation shadows
- **`--z-*`**: Z-index layers
- **`--space-*`**: Spacing values
- **`--radius-*`**: Border radius values
- **`--ease-*`**: Easing curves
- **`--duration-*`**: Animation durations
- **`--font-*`**: Font families
- **`--text-*`**: Font sizes (same prefix as text colors, but different context -- the size scale uses numbers like `--text-sm`, `--text-lg`)

## Performance

The tokens package is pure CSS -- no JavaScript runtime, no build step, no bundle size impact. The `@theme` directive compiles down to standard CSS custom properties. Components reference them via Tailwind's arbitrary value syntax, which is resolved at build time.

The total token file is under 150 lines of CSS. It gzips to under 1KB.

## Links

- [GitHub: WyattAu/pediment](https://github.com/WyattAu/pediment)
- [CSS Custom Properties Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind v4 @theme](https://tailwindcss.com/blog/tailwindcss-v4)
- [Previous: Building Accessible Components with SolidJS](./2026-09-01-accessible-components-solidjs.md)

---

*Design tokens are the most boring part of a design system. They're also the most important. Get the tokens right, and everything else falls into place.*
