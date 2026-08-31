import { createSignal, onMount, Show } from "solid-js";

const THEMES = ["midnight-navy", "tokyo-night", "arctic-dawn", "solaris", "light"] as const;

export default function ThemeToggle() {
  const [theme, setTheme] = createSignal<string>("midnight-navy");

  onMount(() => {
    const stored = localStorage.getItem("pediment-theme");
    if (stored && THEMES.includes(stored as any)) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "midnight-navy" : "light";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  });

  const cycle = () => {
    const idx = THEMES.indexOf(theme() as any);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pediment-theme", next);
  };

  return (
    <button
      onClick={cycle}
      aria-label={`Current theme: ${theme()}. Click to cycle.`}
      class="rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
    >
      {theme()}
    </button>
  );
}
