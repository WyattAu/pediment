# Building Accessible Components with SolidJS: Lessons from Pediment

*Published: September 1, 2026 | Author: WyattAu*

---

Accessibility isn't a feature you bolt on at the end. It's a set of constraints that shape every component from the first line of code. When we built Pediment's component library, we made accessibility a first-class requirement -- not just to check boxes, but because our documentation sites, dashboards, and admin tools are used by real people with real needs.

This post walks through the patterns we used, the mistakes we made, and what we learned about building accessible UI with SolidJS.

## Why SolidJS for Accessible Components?

SolidJS has properties that make accessibility work natural:

1. **Fine-grained reactivity** -- No virtual DOM means we can update individual attributes without re-rendering entire subtrees
2. **Direct DOM access** -- `ref` bindings give us real DOM nodes for focus management
3. **JSX without re-renders** -- Event handlers and aria attributes stay exactly where you define them
4. **Compile-time optimization** -- No runtime framework overhead means faster interactions for assistive technology

The tradeoff is that SolidJS doesn't have a built-in component library. You write your own. Which is exactly what Pediment is.

## ARIA Attributes: Getting Them Right

### Dialog: `role="dialog"` and `aria-modal`

The `Modal` component demonstrates proper dialog semantics:

```tsx
export function Modal(props: ModalProps) {
  return (
    <Show when={props.open}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={props.title}
        class="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div class="w-full max-w-lg mx-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] shadow-[var(--shadow-elevation-4)]">
          <Show when={props.title}>
            <div class="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h2 class="text-lg font-semibold text-[var(--text-primary)]">{props.title}</h2>
              <button
                onClick={props.onClose}
                class="rounded-[var(--radius-sm)] p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </Show>
          <div class="px-6 py-4">{props.children}</div>
        </div>
      </div>
    </Show>
  );
}
```

Key decisions:
- **`role="dialog"`** on the outer container tells screen readers this is a dialog
- **`aria-modal="true"`** indicates content behind the dialog is inert
- **`aria-label`** provides an accessible name when no visible title exists
- **Close button** has an `aria-label="Close"` so screen readers announce its purpose

### Select: `aria-expanded` and Keyboard Navigation

The `Select` component is more complex -- it's a custom dropdown that needs to behave like a native `<select>`:

```tsx
export default function Select(props: SelectProps) {
  const [open, setOpen] = createSignal(false);
  const [highlightedIndex, setHighlightedIndex] = createSignal(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, filtered().length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered()[highlightedIndex()];
      if (opt && !opt.disabled) toggleOption(opt.value);
    }
  };

  return (
    <div ref={containerRef} class="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        disabled={props.disabled}
        aria-expanded={open()}
        aria-haspopup="listbox"
      >
        {displayValue()}
      </button>
      <Show when={open()}>
        <div role="listbox" class="absolute z-50 mt-1 w-full bg-[var(--bg-card)] shadow-[var(--shadow-elevation-3)]">
          <For each={filtered()}>
            {(opt) => (
              <div
                role="option"
                aria-selected={selected() === opt.value}
                aria-disabled={opt.disabled}
                onClick={() => !opt.disabled && toggleOption(opt.value)}
              >
                {opt.label}
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
```

The pattern:
- **`aria-expanded`** tells screen readers whether the dropdown is open
- **`aria-haspopup="listbox"`** indicates the button opens a listbox
- **`role="listbox"`** on the dropdown container
- **`role="option"`** on each option
- **`aria-selected`** marks the currently selected option
- **Arrow keys** navigate the list; **Enter** selects; **Escape** closes

### DataTable: `aria-sort` for Column Headers

The `DataTable` component uses `aria-sort` to communicate sort state:

```tsx
<th
  class={`px-4 py-3 text-left font-medium ${col.sortable ? "cursor-pointer hover:text-[var(--text-primary)]" : ""}`}
  aria-sort={sortKey() === col.key ? (sortDir() === "asc" ? "ascending" : "descending") : "none"}
  onClick={() => col.sortable && toggleSort(col.key)}
>
  {col.header}
  <Show when={sortKey() === col.key}>
    <span class="ml-1">{sortDir() === "asc" ? "▲" : "▼"}</span>
  </Show>
</th>
```

Screen readers announce "Name, sorted ascending" or "Email, sorted descending" when a user navigates to sortable column headers.

## Keyboard Navigation

### Focus Trapping in Modals

When a modal opens, focus should move into it. When it closes, focus should return to the trigger. We handle this with SolidJS's `onMount` and `onCleanup`:

```tsx
export function Modal(props: ModalProps) {
  let triggerRef: HTMLButtonElement | undefined;

  onMount(() => {
    if (props.open) {
      const modal = document.querySelector('[role="dialog"]') as HTMLElement;
      modal?.focus();
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") props.onClose();
    if (e.key === "Tab") {
      const focusable = document.querySelectorAll(
        '[role="dialog"] button, [role="dialog"] input, [role="dialog"] [tabindex]'
      );
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <Show when={props.open}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={props.title}
        onKeyDown={handleKeyDown}
        tabindex="-1"
      >
        {/* ... */}
      </div>
    </Show>
  );
}
```

### Tabs: Arrow Key Navigation

Tab components should support arrow keys for navigation between tabs:

```tsx
const handleKeyDown = (e: KeyboardEvent, index: number) => {
  const tabs = props.tabs.filter(t => !t.disabled);
  if (e.key === "ArrowRight") {
    const next = (index + 1) % tabs.length;
    selectTab(tabs[next].id);
    // Focus the newly selected tab
  }
  if (e.key === "ArrowLeft") {
    const prev = (index - 1 + tabs.length) % tabs.length;
    selectTab(tabs[prev].id);
  }
};
```

## Reduced Motion

Not all users want animations. The `useReducedMotion` hook respects the `prefers-reduced-motion` media query:

```tsx
// useReducedMotion.ts
import { useMediaQuery } from "./useMediaQuery";

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
```

Usage in components:

```tsx
import { useReducedMotion } from "@pediment/hooks";

function AnimatedCard(props) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      class="transition-transform"
      style={{
        "transition-duration": reducedMotion() ? "0ms" : "var(--duration-normal)",
        transform: props.expanded ? "scale(1.02)" : "scale(1)",
      }}
    >
      {props.children}
    </div>
  );
}
```

## Color Contrast and Theme Tokens

Pediment's themes define semantic color tokens (`--text-primary`, `--text-secondary`, `--bg-card`, etc.) rather than raw hex values. This means accessibility is baked into the theme:

```css
[data-theme="midnight-navy"] {
  --bg-primary: #050505;
  --text-primary: #ffffff;    /* 21:1 contrast ratio on --bg-primary */
  --text-secondary: #a0a0a0;  /* 10.5:1 contrast ratio on --bg-primary */
  --accent: #00e5ff;          /* 11.3:1 contrast ratio on --bg-primary */
}
```

All themes are designed to meet WCAG AA contrast requirements. The `--text-secondary` token is never used for essential content -- only for labels and descriptions where a lower contrast ratio is acceptable.

## Common Mistakes We Made

**1. Missing `aria-label` on icon-only buttons.** Our first Toast component had a dismiss button that was just "×". Screen readers announced it as "times" instead of "Dismiss". Fix: add `aria-label="Dismiss"`.

**2. Forgetting `aria-disabled` vs `disabled`.** The native `disabled` attribute prevents all interaction, including focus. For tab navigation, `aria-disabled` with manual focus management is sometimes better.

**3. No focus indicator on custom components.** Our initial Select component removed the default focus ring. Users with motor disabilities couldn't see which element was focused. Fix: use `focus:ring-2 focus:ring-[var(--accent)]` consistently.

**4. Announcing state changes.** When a toast appears, screen readers should know about it. We added `role="status"` and `aria-live="polite"` to the toast container so new toasts are announced without interrupting the user.

## Testing Accessibility

We use a combination of approaches:

- **Manual testing** with VoiceOver and NVDA
- **axe-core** integration in CI for automated checks
- **Keyboard-only navigation** testing for every interactive component
- **Storybook** with accessibility addon for visual review

The `@pediment/tokens` package is pure CSS, so there's no runtime to test -- but we verify contrast ratios with each theme update.

## Links

- [GitHub: WyattAu/pediment](https://github.com/WyattAu/pediment)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Previous: Introducing Pediment](./2026-09-01-introducing-pediment.md)

---

*Accessibility is an ongoing commitment, not a destination. If you find issues with Pediment's components, please open an issue on GitHub.*
