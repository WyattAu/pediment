# Reddit Post Drafts

## r/rust

**Title:** I built 34 shared Rust crates to eliminate duplicated code across 60+ repos

**Body:**

Hey r/rust,

After years of copying security headers, SEO utilities, and boilerplate across 60+ repos, I extracted the common patterns into a shared crate system.

The result is **Pediment** — a monorepo of 5 packages that handle the boring stuff so I can focus on features:

- `@pediment/tokens` — Design token system (Spatial Materialism + Amoebic UI patterns, CSS custom properties)
- `@pediment/components` — 18 accessible SolidJS components with full ARIA/keyboard support
- `@pediment/hooks` — Shared SolidJS hooks
- `@pediment/utils` — Security headers, SEO, analytics utilities (the Rust-derived patterns, now in TS)
- `@pediment/starlight` — Starlight plugin for design system integration

**What I learned:**

- Cargo workspaces are great, but monorepos with `bun` workspaces solve a different problem
- Design tokens as CSS custom properties (not JS runtime) = zero bundle cost
- The hard part isn't building components — it's making them accessible and themeable
- Having 5 themes that actually look good takes more effort than the code itself

The component library covers: DataTable, Modal, Select, Toast, Tabs, Accordion, Badge, Avatar, Pagination, Tooltip, Popover, CommandPalette, FileUpload, DatePicker, Skeleton, ErrorBoundary, ThemeToggle, FormField.

It works with Astro + SolidJS but can be used standalone.

GitHub: https://github.com/WyattAu/pediment

---

## r/solidjs

**Title:** Pediment: A production-ready UI framework for SolidJS with 18 components

**Body:**

I've been building UIs with SolidJS for a while and needed a component library that:

1. Actually works with Astro (not just SSR as an afterthought)
2. Has real theming (5 themes, CSS custom properties)
3. Is accessible out of the box (ARIA, keyboard navigation)
4. Doesn't fight you on customization

So I built **Pediment** — 18 components with design tokens and theming:

- DataTable, Modal, Select, Toast, Tabs
- Accordion, Badge, Avatar, Pagination, Tooltip
- Popover, CommandPalette, FileUpload, DatePicker
- Skeleton, ErrorBoundary, ThemeToggle, FormField

All TypeScript, all accessible, all themeable.

**Design tokens** are CSS custom properties — zero JS runtime cost. Use them with or without the components.

**Quick start:**

```bash
bun install @pediment/tokens @pediment/components
```

```astro
---
import BaseLayout from "@pediment/components/BaseLayout.astro";
import Nav from "@pediment/components/Nav.astro";
---
<BaseLayout title="My Site">
  <Nav slot="nav" siteName="My Site" links={[{ label: "Home", href: "/" }]} />
  <p>Hello world</p>
</BaseLayout>
```

Themes: midnight-navy, tokyo-night, arctic-dawn, solaris, light

GitHub: https://github.com/WyattAu/pediment
Storybook: https://storybook.pediment.wyattau.com
