# Hacker News Post

## Show HN: Pediment – Open-source UI framework for Astro + SolidJS

Pediment is a production-ready UI framework with 18 accessible SolidJS components, design tokens, and 5 themes.

**What it does:**
- 18 components: DataTable, Modal, Select, Toast, Tabs, Accordion, Badge, Avatar, Pagination, Tooltip, Popover, CommandPalette, FileUpload, DatePicker, Skeleton, ErrorBoundary, ThemeToggle, FormField
- 5 design themes via CSS custom properties (zero JS runtime cost)
- Full ARIA and keyboard navigation support
- TypeScript-first with strict typing
- Works standalone, with Astro, or any SolidJS setup

**How to use it:**

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

**Why it exists:**

I needed a component library that worked properly with Astro and had real theming. Most SolidJS component libraries either don't support Astro or treat it as an afterthought. The design token system uses CSS custom properties, so there's zero bundle cost from theming.

**Architecture:**

- `@pediment/tokens` — Design tokens (Spatial Materialism + Amoebic UI patterns)
- `@pediment/components` — SolidJS and Astro components
- `@pediment/hooks` — Shared SolidJS hooks
- `@pediment/utils` — Security headers, SEO, analytics
- `@pediment/starlight` — Starlight plugin

MIT/Apache-2.0 licensed.

GitHub: https://github.com/WyattAu/pediment
Storybook: https://storybook.pediment.wyattau.com
