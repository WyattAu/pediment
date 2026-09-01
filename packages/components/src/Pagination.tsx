import { createMemo, For, Show } from "solid-js";

export interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onPageChange?: (page: number) => void;
  showFirstLast?: boolean;
  siblingCount?: number;
  class?: string;
}

export default function Pagination(props: PaginationProps) {
  const totalPages = createMemo(() => Math.ceil(props.total / props.perPage));
  const sibling = () => props.siblingCount ?? 1;

  const pages = createMemo(() => {
    const total = totalPages();
    const current = props.page;
    const s = sibling();
    const left = Math.max(current - s, 1);
    const right = Math.min(current + s, total);
    const items: (number | "...")[] = [];
    if (left > 2) items.push(1, "...");
    for (let i = left; i <= right; i++) items.push(i);
    if (right < total - 1) items.push("...", total);
    return items;
  });

  return (
    <nav class={`flex items-center gap-1 ${props.class ?? ""}`} aria-label="Pagination">
      <Show when={props.showFirstLast}>
        <button onClick={() => props.onPageChange?.(1)} disabled={props.page === 1} class="rounded-[var(--radius-sm)] px-2 py-1.5 text-sm disabled:opacity-50 hover:bg-[var(--bg-secondary)]">«</button>
      </Show>
      <button onClick={() => props.onPageChange?.(props.page - 1)} disabled={props.page === 1} class="rounded-[var(--radius-sm)] px-2 py-1.5 text-sm disabled:opacity-50 hover:bg-[var(--bg-secondary)]">‹</button>
      <For each={pages()}>
        {(p) => (
          <Show
            when={p !== "..."}
            fallback={<span class="px-1 py-1.5 text-sm text-[var(--text-secondary)]">…</span>}
          >
            <button
              onClick={() => props.onPageChange?.(p as number)}
              class={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors ${
                props.page === p
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {p}
            </button>
          </Show>
        )}
      </For>
      <button onClick={() => props.onPageChange?.(props.page + 1)} disabled={props.page === totalPages()} class="rounded-[var(--radius-sm)] px-2 py-1.5 text-sm disabled:opacity-50 hover:bg-[var(--bg-secondary)]">›</button>
      <Show when={props.showFirstLast}>
        <button onClick={() => props.onPageChange?.(totalPages())} disabled={props.page === totalPages()} class="rounded-[var(--radius-sm)] px-2 py-1.5 text-sm disabled:opacity-50 hover:bg-[var(--bg-secondary)]">»</button>
      </Show>
    </nav>
  );
}
