import { createSignal, For, Show, createMemo } from "solid-js";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => any;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  const [sortKey, setSortKey] = createSignal<string>("");
  const [sortDir, setSortDir] = createSignal<"asc" | "desc">("asc");
  const [search, setSearch] = createSignal("");
  const [page, setPage] = createSignal(1);
  
  const pageSize = () => props.pageSize ?? 10;
  
  const filtered = createMemo(() => {
    let result = props.data;
    const q = search().toLowerCase();
    if (q) {
      result = result.filter(row =>
        props.columns.some(col => String(row[col.key]).toLowerCase().includes(q))
      );
    }
    return result;
  });

  const sorted = createMemo(() => {
    const key = sortKey();
    if (!key) return filtered();
    return [...filtered()].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir() === "asc" ? cmp : -cmp;
    });
  });

  const paged = createMemo(() => {
    const start = (page() - 1) * pageSize();
    return sorted().slice(start, start + pageSize());
  });

  const totalPages = createMemo(() => Math.ceil(sorted().length / pageSize()));

  const toggleSort = (key: string) => {
    if (sortKey() === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div class="rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
      <Show when={props.searchable}>
        <div class="p-3 border-b border-[var(--border)]">
          <input
            type="text"
            placeholder={props.searchPlaceholder ?? "Search..."}
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
            class="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          />
        </div>
      </Show>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <For each={props.columns}>
                {(col) => (
                  <th
                    class={`px-4 py-3 text-left font-medium text-[var(--text-secondary)] ${col.sortable ? "cursor-pointer hover:text-[var(--text-primary)]" : ""}`}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    {col.header}
                    <Show when={sortKey() === col.key}>
                      <span class="ml-1">{sortDir() === "asc" ? "▲" : "▼"}</span>
                    </Show>
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <Show
              when={paged().length > 0}
              fallback={
                <tr>
                  <td colspan={props.columns.length} class="px-4 py-8 text-center text-[var(--text-secondary)]">
                    {props.emptyMessage ?? "No data available"}
                  </td>
                </tr>
              }
            >
              <For each={paged()}>
                {(row) => (
                  <tr class="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)]">
                    <For each={props.columns}>
                      {(col) => (
                        <td class="px-4 py-3">
                          {col.render ? col.render(row) : String(row[col.key] ?? "")}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>
      <Show when={totalPages() > 1}>
        <div class="flex items-center justify-between border-t border-[var(--border)] px-4 py-3">
          <span class="text-sm text-[var(--text-secondary)]">
            Page {page()} of {totalPages()} ({sorted().length} items)
          </span>
          <div class="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page() === 1}
              class="rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages(), p + 1))}
              disabled={page() === totalPages()}
              class="rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
