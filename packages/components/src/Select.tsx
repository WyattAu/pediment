import { createSignal, createMemo, For, Show, onCleanup, onMount } from "solid-js";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string | string[]) => void;
  name?: string;
  class?: string;
}

export default function Select(props: SelectProps) {
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [selected, setSelected] = createSignal<string | string[]>(props.value ?? (props.multiple ? [] : ""));
  const [highlightedIndex, setHighlightedIndex] = createSignal(0);
  let containerRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;

  const filtered = createMemo(() => {
    const q = search().toLowerCase();
    if (!q) return props.options;
    return props.options.filter(opt => opt.label.toLowerCase().includes(q));
  });

  const groups = createMemo(() => {
    const map = new Map<string, SelectOption[]>();
    for (const opt of filtered()) {
      const g = opt.group ?? "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(opt);
    }
    return map;
  });

  const toggleOption = (value: string) => {
    if (props.multiple) {
      const current = selected() as string[];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      setSelected(next);
      props.onChange?.(next);
    } else {
      setSelected(value);
      setOpen(false);
      props.onChange?.(value);
    }
  };

  const displayValue = () => {
    if (props.multiple) {
      const sel = selected() as string[];
      if (sel.length === 0) return props.placeholder ?? "Select...";
      return sel.map(v => props.options.find(o => o.value === v)?.label ?? v).join(", ");
    }
    return props.options.find(o => o.value === selected())?.label ?? props.placeholder ?? "Select...";
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIndex(i => Math.min(i + 1, filtered().length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIndex(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); const opt = filtered()[highlightedIndex()]; if (opt && !opt.disabled) toggleOption(opt.value); }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) setOpen(false);
  };

  onMount(() => document.addEventListener("mousedown", handleClickOutside));
  onCleanup(() => document.removeEventListener("mousedown", handleClickOutside));

  return (
    <div ref={containerRef} class={`relative ${props.class ?? ""}`}>
      <button
        type="button"
        onClick={() => !props.disabled && setOpen(o => !o)}
        disabled={props.disabled}
        class={`flex w-full items-center justify-between rounded-[var(--radius-sm)] border bg-[var(--bg-card)] px-3 py-2 text-sm text-left transition-colors ${
          props.error ? "border-red-500" : open() ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20" : "border-[var(--border)]"
        } ${props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span class={selected() ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}>
          {displayValue()}
        </span>
        <span class="ml-2 text-[var(--text-secondary)] transition-transform" classList={{ "rotate-180": open() }}>▾</span>
      </button>
      <Show when={open()}>
        <div class="absolute z-50 mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-elevation-3)]">
          <Show when={props.searchable}>
            <div class="border-b border-[var(--border)] p-2">
              <input ref={inputRef} type="text" placeholder="Search..." value={search()} onInput={e => setSearch(e.currentTarget.value)} class="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5 text-sm focus:outline-none" />
            </div>
          </Show>
          <div class="max-h-60 overflow-y-auto py-1">
            <For each={Array.from(groups().entries())}>
              {([group, options]) => (
                <>
                  {group && <div class="px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">{group}</div>}
                  <For each={options}>
                    {(opt) => (
                      <div
                        onClick={() => !opt.disabled && toggleOption(opt.value)}
                        class={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${
                          opt.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--bg-secondary)]"
                        } ${selected() === opt.value || (Array.isArray(selected()) && (selected() as string[]).includes(opt.value)) ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text-primary)]"}`}
                      >
                        <span>{opt.label}</span>
                        <Show when={selected() === opt.value || (Array.isArray(selected()) && (selected() as string[]).includes(opt.value))}>
                          <span>✓</span>
                        </Show>
                      </div>
                    )}
                  </For>
                </>
              )}
            </For>
            <Show when={filtered().length === 0}>
              <div class="px-3 py-2 text-sm text-[var(--text-secondary)]">No options found</div>
            </Show>
          </div>
        </div>
      </Show>
      <Show when={props.error}>
        <p class="mt-1 text-xs text-red-500">{props.error}</p>
      </Show>
    </div>
  );
}
