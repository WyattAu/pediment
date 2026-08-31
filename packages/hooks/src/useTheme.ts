import { createSignal, onMount } from "solid-js";

const THEMES = ["midnight-navy", "tokyo-night", "arctic-dawn", "solaris", "light"] as const;

export function useTheme() {
  const [theme, setTheme] = createSignal<string>("midnight-navy");

  onMount(() => {
    const stored = localStorage.getItem("pediment-theme");
    if (stored && THEMES.includes(stored as any)) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  });

  const set = (t: string) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("pediment-theme", t);
  };

  const cycle = () => {
    const idx = THEMES.indexOf(theme() as any);
    set(THEMES[(idx + 1) % THEMES.length]);
  };

  return { theme, set, cycle };
}
