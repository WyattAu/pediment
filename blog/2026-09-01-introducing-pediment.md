# Introducing Pediment: A Production-Ready UI Framework for Astro + SolidJS

*Published: September 1, 2026 | Author: WyattAu*

---

When you run 73 repositories under one GitHub organization, design consistency isn't optional -- it's survival. After months of duplicating CSS variables, copy-pasting component logic, and maintaining six different theme files across our web properties, we built Pediment: a shared design system that powers every Astro + SolidJS project in the WyattAu ecosystem.

This post introduces what Pediment is, why it exists, and how to get started.

## What Is Pediment?

Pediment is a monorepo of five tightly-coupled npm packages that provide everything you need to build consistent, themed web interfaces on top of Astro and SolidJS:

| Package | Purpose |
|---------|---------|
| `@pediment/tokens` | CSS-first design tokens: colors, spacing, typography, elevation, animations |
| `@pediment/components` | 20+ Astro and SolidJS components with built-in accessibility |
| `@pediment/hooks` | SolidJS hooks for theme state, media queries, motion preferences |
| `@pediment/utils` | Security headers, SEO helpers, analytics utilities |
| `@pediment/starlight` | Starlight plugin for documentation site integration |

The name "Pediment" comes from architecture -- the triangular element that sits above a doorway, bearing weight and providing shelter. Our design tokens sit above every web property, providing consistent design language and sheltering developers from the chaos of per-project styling.

## Why We Built It

The breaking point came when I found three different implementations of a theme toggle in three repositories, each with a different color palette and a subtly different bug in the localStorage persistence logic.

By mid-2026, our web properties -- documentation sites, dashboards, marketing pages -- had accumulated:

- 6 separate CSS files defining overlapping custom properties
- 4 different approaches to dark mode
- Component implementations duplicated across Astro and SolidJS codebases
- Inconsistent spacing, typography, and elevation systems

Theduplication wasn't just wasteful -- it was actively harmful. A design update in one repo wouldn't propagate to others. Accessibility fixes in one component didn't benefit the copies. And onboarding new contributors meant teaching them six slightly different conventions.

## The Token Architecture

Pediment's foundation is `@pediment/tokens`, a CSS-first token system built on Tailwind v4's `@theme` directive. It exposes design tokens as CSS custom properties, organized into two design systems:

### Spatial Materialism

A depth-based design system inspired by material design, but with a single light source (top-left) and dramatic elevation tiers:

```css
/* Elevation tiers from subtle to dramatic */
--shadow-elevation-0: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-elevation-1: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-elevation-2: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-elevation-3: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-elevation-4: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
```

Fluid spacing uses `clamp()` to adapt across viewport sizes:

```css
--space-fluid-sm: clamp(0.5rem, 1vw, 1rem);
--space-fluid-md: clamp(1rem, 2vw, 2rem);
--space-fluid-lg: clamp(2rem, 4vw, 4rem);
```

### Amoebic UI

An organic design system with blob-like border radii, custom easing curves, and animation duration tiers:

```css
--radius-xs: 6px;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 24px;
--radius-pill: 999px;
--radius-organic: 42% 58% 70% 30% / 45% 45% 55% 55%;

--ease-organic: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-brutal: cubic-bezier(0.9, 0, 0.1, 1);
```

## Theme Variants

Pediment ships with five themes: `midnight-navy` (default dark), `tokyo-night`, `arctic-dawn`, `solaris`, and `light`. Each theme defines the same set of semantic color tokens:

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

Switching themes is a single attribute change on the `<html>` element. The `ThemeToggle` component handles this automatically with localStorage persistence.

## Getting Started

### Installation

```bash
bun add @pediment/tokens @pediment/components
```

### Import Tokens

In your global CSS file:

```css
@import "@pediment/tokens";
```

### Use a Layout

```astro
---
import BaseLayout from "@pediment/components/BaseLayout.astro";
import Nav from "@pediment/components/Nav.astro";
---

<BaseLayout title="My Site">
  <Nav slot="nav" siteName="My Site" links={[{ label: "Home", href: "/" }]} />
  <main>
    <h1>Welcome</h1>
  </main>
</BaseLayout>
```

### Apply a Theme

Set the `data-theme` attribute on your HTML element:

```html
<html data-theme="midnight-navy">
```

Or use the `ThemeToggle` component for user-switchable themes:

```tsx
import ThemeToggle from "@pediment/components/ThemeToggle";

function Header() {
  return <ThemeToggle />;
}
```

## Component Highlights

Pediment includes 20+ components. Here are a few:

**Modal** -- Dialog with Escape key handling, backdrop click dismissal, and `aria-modal`:

```tsx
<Modal open={showModal()} onClose={() => setShowModal(false)} title="Settings">
  <p>Dialog content here</p>
</Modal>
```

**DataTable** -- Sortable, searchable, paginated tables:

```tsx
<DataTable
  data={users}
  columns={[
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email" },
  ]}
  searchable
  pageSize={20}
/>
```

**Toast** -- Non-blocking notifications with auto-dismiss:

```tsx
showToast.success("Saved", "Your changes have been saved.");
```

## What's Next

In upcoming posts, we'll cover:

- **Accessibility patterns** in our SolidJS components
- **Design token architecture** and custom theme creation
- **Migrating from Tailwind** to Pediment's token system
- **The shared crate ecosystem** that powers our Rust backend

## Links

- [GitHub: WyattAu/pediment](https://github.com/WyattAu/pediment)
- [Packages: @pediment/tokens](https://www.npmjs.com/package/@pediment/tokens)
- [Forgeyard Templates](https://github.com/WyattAu/forgeyard)
- [Previous: Building Shared Infrastructure for 73 Repositories](./2026-08-31-building-shared-infrastructure.md)

---

*Pediment is open source under MIT/Apache-2.0. Contributions welcome.*
