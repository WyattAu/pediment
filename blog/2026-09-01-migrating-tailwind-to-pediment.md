# Migrating from Tailwind CSS to Pediment: A Step-by-Step Guide

*Published: September 1, 2026 | Author: WyattAu*

---

Tailwind CSS is excellent for prototyping and one-off projects. But when you're running 46 documentation sites and a dozen dashboards under one organization, its permissive utility-first approach starts to hurt. Class names grow unmanageable, color values diverge across projects, and there's no shared contract for what "primary blue" or "medium spacing" actually means.

We migrated several of our projects from raw Tailwind CSS to Pediment's token-based system. Here's how we did it, what changed, and what we gained.

## Why We Moved Away from Tailwind

### The Problems

**1. Inconsistent color values across projects.** One site used `text-blue-400` for links, another used `text-cyan-500`, a third used `#00e5ff`. When we wanted to update the accent color, we had to grep every CSS class across 46 sites.

**2. No shared spacing scale.** Developers used `p-4`, `p-6`, and `px-8` interchangeably. There was no agreed-upon spacing rhythm, so components looked slightly different depending on who built them.

**3. Shadow inconsistency.** One project used `shadow-md`, another used `shadow-lg`, a third used a custom `box-shadow` value. There was no shared elevation system.

**4. Theme switching was ad-hoc.** Each project implemented dark mode differently -- some with Tailwind's `dark:` prefix, some with CSS custom properties, some with both.

**5. Bundle size.** Tailwind's JIT compiler generates only the classes you use, but across 46 sites with overlapping class sets, the cumulative CSS output was substantial.

### The Solution

Pediment's `@pediment/tokens` package replaces Tailwind's color palette, spacing scale, and shadow system with a shared set of CSS custom properties. Components reference these tokens instead of raw Tailwind classes. The result: consistent design across all projects, with a single source of truth for every visual value.

## Mapping Tailwind Classes to Pediment Tokens

### Colors

| Tailwind | Pediment Token | Usage |
|----------|---------------|-------|
| `text-white` | `text-[var(--text-primary)]` | Primary text |
| `text-gray-400` | `text-[var(--text-secondary)]` | Secondary text |
| `bg-gray-900` | `bg-[var(--bg-primary)]` | Page background |
| `bg-gray-800` | `bg-[var(--bg-secondary)]` | Elevated background |
| `bg-gray-700` | `bg-[var(--bg-card)]` | Card background |
| `text-cyan-400` | `text-[var(--accent)]` | Accent color |
| `text-orange-400` | `text-[var(--accent-warm)]` | Warm accent |
| `border-gray-700` | `border-[var(--border)]` | Border color |

### Spacing

| Tailwind | Pediment Token |
|----------|---------------|
| `p-2` | `p-[var(--space-fluid-xs)]` |
| `p-4` | `p-[var(--space-fluid-sm)]` |
| `p-6` | `p-[var(--space-fluid-md)]` |
| `p-8` | `p-[var(--space-fluid-lg)]` |

### Shadows

| Tailwind | Pediment Token |
|----------|---------------|
| `shadow-sm` | `shadow-[var(--shadow-elevation-0)]` |
| `shadow` | `shadow-[var(--shadow-elevation-1)]` |
| `shadow-md` | `shadow-[var(--shadow-elevation-2)]` |
| `shadow-lg` | `shadow-[var(--shadow-elevation-3)]` |
| `shadow-xl` | `shadow-[var(--shadow-elevation-4)]` |

### Border Radius

| Tailwind | Pediment Token |
|----------|---------------|
| `rounded` | `rounded-[var(--radius-sm)]` |
| `rounded-md` | `rounded-[var(--radius-md)]` |
| `rounded-lg` | `rounded-[var(--radius-lg)]` |
| `rounded-full` | `rounded-[var(--radius-pill)]` |

## Step-by-Step Migration

### Step 1: Install Pediment

```bash
bun add @pediment/tokens @pediment/components @pediment/hooks
```

### Step 2: Import Tokens

In your global CSS file, add the import at the top:

```css
/* global.css */
@import "@pediment/tokens";

/* Your existing styles below */
```

This registers all Pediment tokens as CSS custom properties. Your existing Tailwind classes still work -- tokens are additive, not a replacement.

### Step 3: Set a Theme

Add the `data-theme` attribute to your HTML element:

```html
<html data-theme="midnight-navy">
```

This activates the semantic color tokens. Your page should look different -- colors shift to the midnight-navy palette.

### Step 4: Replace Hardcoded Colors

Search your CSS and components for hardcoded color values:

```bash
# Find hardcoded hex colors
grep -rn "#[0-9a-fA-F]\{3,6\}" src/

# Find Tailwind color classes
grep -rn "text-\(white\|gray\|blue\|cyan\|orange\)-" src/
grep -rn "bg-\(white\|gray\|blue\|cyan\|orange\)-" src/
grep -rn "border-\(gray\|blue\|cyan\|orange\)-" src/
```

Replace each with the appropriate token:

```css
/* Before */
color: #ffffff;
background: #111111;
border-color: #333333;

/* After */
color: var(--text-primary);
background: var(--bg-card);
border-color: var(--border);
```

### Step 5: Replace Shadow Classes

```tsx
// Before
<div class="shadow-lg">

// After
<div class="shadow-[var(--shadow-elevation-3)]">
```

### Step 6: Replace Radius Classes

```tsx
// Before
<div class="rounded-lg">

// After
<div class="rounded-[var(--radius-lg)]">
```

### Step 7: Add Theme Toggle (Optional)

Replace your existing dark mode implementation with Pediment's `ThemeToggle`:

```tsx
// Before: complex dark mode toggle
const [dark, setDark] = createSignal(false);
// ... localStorage logic, class toggling, media query detection

// After
import ThemeToggle from "@pediment/components/ThemeToggle";

function Header() {
  return <ThemeToggle />;
}
```

The `ThemeToggle` component handles:
- localStorage persistence
- System preference detection (`prefers-color-scheme`)
- Cycling through all five themes
- Proper `data-theme` attribute management

### Step 8: Update Component Styles

For components you've built, replace Tailwind color and spacing classes with token references:

```tsx
// Before
<button class="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-cyan-600">

// After
<button class="bg-[var(--accent)] text-white px-4 py-2 rounded-[var(--radius-lg)] shadow-[var(--shadow-elevation-2)] hover:opacity-90">
```

## Before and After: A Card Component

```tsx
// Before — hardcoded Tailwind values
function UserCard(props) {
  return (
    <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
      <h3 class="text-white text-lg font-semibold">{props.name}</h3>
      <p class="text-gray-400 text-sm mt-1">{props.email}</p>
      <div class="mt-4 flex gap-2">
        <button class="bg-cyan-500 text-white px-3 py-1.5 rounded text-sm hover:bg-cyan-600">
          View
        </button>
        <button class="border border-gray-600 text-gray-400 px-3 py-1.5 rounded text-sm hover:text-white">
          Edit
        </button>
      </div>
    </div>
  );
}

// After — Pediment tokens
function UserCard(props) {
  return (
    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-md)] p-[var(--space-fluid-md)] shadow-[var(--shadow-elevation-3)]">
      <h3 class="text-[var(--text-primary)] text-lg font-semibold">{props.name}</h3>
      <p class="text-[var(--text-secondary)] text-sm mt-1">{props.email}</p>
      <div class="mt-4 flex gap-2">
        <button class="bg-[var(--accent)] text-white px-3 py-1.5 rounded-[var(--radius-sm)] text-sm hover:opacity-90">
          View
        </button>
        <button class="border border-[var(--border)] text-[var(--text-secondary)] px-3 py-1.5 rounded-[var(--radius-sm)] text-sm hover:text-[var(--text-primary)]">
          Edit
        </button>
      </div>
    </div>
  );
}
```

The second version is longer, but every visual value is semantic. Change the theme, and the entire card updates.

## Performance Benefits

### Before Migration (6 Documentation Sites)

- 46 unique Tailwind color classes across sites
- 12 unique shadow definitions
- 8 different border-radius values
- ~180KB of CSS per site (JIT output)
- Total: ~1.08MB across 6 sites

### After Migration

- 0 hardcoded color values (all use tokens)
- 1 shared elevation system (5 shadow tiers)
- 1 shared radius system (6 radius values)
- ~120KB of CSS per site (Tailwind utilities only, no color definitions)
- Total: ~720KB across 6 sites

The 33% reduction comes from eliminating duplicate color definitions. Tailwind still generates utility classes, but the color palette is smaller because components reference semantic tokens instead of raw values.

### Build Time

Turborepo's caching means token changes propagate across all sites without rebuilding unchanged packages. A design token update takes seconds, not minutes.

## Common Pitfalls

**1. Don't remove Tailwind entirely.** Pediment tokens work *with* Tailwind, not instead of it. You still use Tailwind for layout (`flex`, `grid`, `gap`), typography (`font-semibold`, `text-lg`), and responsive design (`md:`, `lg:`).

**2. Watch out for specificity.** `bg-[var(--bg-card)]` has the same specificity as `bg-gray-800`. If you're overriding Tailwind defaults, the order matters.

**3. Test theme switching.** Not all combinations work. A button styled with `bg-[var(--accent)] text-white` looks great on dark themes but may be unreadable on `light` if the accent is light. Test every theme.

**4. The `hover:opacity-90` pattern.** Instead of `hover:bg-cyan-600` (which requires a different color value), we use `hover:opacity-90` on accent-colored elements. This works because opacity-based hover states are theme-agnostic.

## Links

- [GitHub: WyattAu/pediment](https://github.com/WyattAu/pediment)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Previous: Design Tokens Themeable Design System](./2026-09-01-design-tokens-themeable-design-system.md)

---

*The migration took about 2 hours per site. The consistency and maintainability gains have been worth every minute.*
