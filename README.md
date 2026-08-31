# Pediment

> Shared design tokens, components, hooks, and utilities for Astro+SolidJS+Starlight+Cloudflare projects.

[![License](https://img.shields.io/badge/license-MIT%2FApache--2.0-blue)](LICENSE-MIT)
[![CI](https://img.shields.io/github/actions/workflow/status/WyattAu/pediment/ci.yaml?branch=main)](https://github.com/WyattAu/pediment/actions)

## Packages

| Package | Description |
|---------|-------------|
| `@pediment/tokens` | Design tokens (Spatial Materialism, Amoebic UI, themes) |
| `@pediment/components` | Shared Astro and SolidJS components |
| `@pediment/hooks` | Shared SolidJS hooks |
| `@pediment/utils` | Security headers, SEO, analytics utilities |
| `@pediment/starlight` | Starlight plugin for design system integration |

## Quick Start

```bash
bun install @pediment/tokens @pediment/components
```

```css
/* In your global.css */
@import "@pediment/tokens";
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

## Themes

Available themes: `midnight-navy`, `tokyo-night`, `arctic-dawn`, `solaris`, `light`

```html
<html data-theme="midnight-navy">
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Licensed under MIT OR Apache-2.0.
