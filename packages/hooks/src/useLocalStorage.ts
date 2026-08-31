import { createSignal, onMount } from "solid-js";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = createSignal<T>(defaultValue);

  onMount(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {}
  });

  const set = (v: T) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  };

  return [value, set] as const;
}
