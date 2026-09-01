import { createSignal, createMemo, For, Show, onCleanup, onMount } from "solid-js";

export interface CommandItem {
  id: string;
  label: string;
  icon?: string;
  category?: string;
  action: () => void;
  shortcut?: string;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

export default function CommandPalette(props: CommandPaletteProps) {
  const [query, setQuery] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  const filtered = createMemo(() => {
    const q = query().toLowerCase();
    const items = q ? props.items.filter(i => i.label.toLowerCase().includes(q)) : props.items;
    return items;
  });

  const execute = (item: CommandItem) => {
    item.action();
    props.onClose();
    setQuery("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered().length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); const item = filtered()[selectedIndex()]; if (item) execute(item); }
    if (e.key === "Escape") { props.onClose(); setQuery(""); }
  };

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) props.onClose(); }}>
        <div class="w-full max-w-lg rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-elevation-4)] overflow-hidden" onKeyDown={handleKeyDown}>
          <div class="border-b border-[var(--border)] p-3">
            <input
              type="text"
              placeholder={props.placeholder ?? "Type a command..."}
              value={query()}
              onInput={(e) => { setQuery(e.currentTarget.value); setSelectedIndex(0); }}
              class="w-full bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none text-sm"
              autofocus
            />
          </div>
          <div class="max-h-80 overflow-y-auto py-2">
            <For each={filtered()}>
              {(item, i) => (
                <button
                  onClick={() => execute(item)}
                  class={`flex w-full items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                    i() === selectedIndex() ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  <Show when={item.icon}><span class="text-base">{item.icon}</span></Show>
                  <div class="flex-1 min-w-0">
                    <div class="truncate">{item.label}</div>
                    <Show when={item.category}>
                      <div class="text-xs text-[var(--text-secondary)]">{item.category}</div>
                    </Show>
                  </div>
                  <Show when={item.shortcut}>
                    <kbd class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-secondary)] px-1.5 py-0.5 text-xs text-[var(--text-secondary)] font-mono">{item.shortcut}</kbd>
                  </Show>
                </button>
              )}
            </For>
            <Show when={filtered().length === 0}>
              <div class="px-4 py-8 text-center text-sm text-[var(--text-secondary)]">No results found</div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
