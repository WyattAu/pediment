import { createSignal } from "solid-js";
import { Pagination } from "pediment-components";

export default function PaginationDemo() {
  const [page, setPage] = createSignal(1);
  const [total, setTotal] = createSignal(100);
  const [perPage, setPerPage] = createSignal(10);
  const [showFirstLast, setShowFirstLast] = createSignal(true);

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-xs text-[var(--text-secondary)] mb-1">Total items</label>
          <input
            type="number"
            value={total()}
            onInput={(e) => { setTotal(Number(e.currentTarget.value)); setPage(1); }}
            class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm w-20"
          />
        </div>
        <div>
          <label class="block text-xs text-[var(--text-secondary)] mb-1">Per page</label>
          <select
            value={perPage()}
            onChange={(e) => { setPerPage(Number(e.currentTarget.value)); setPage(1); }}
            class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={showFirstLast()} onChange={(e) => setShowFirstLast(e.currentTarget.checked)} />
          Show first/last
        </label>
      </div>

      <div class="pt-4">
        <Pagination
          page={page()}
          total={total()}
          perPage={perPage()}
          showFirstLast={showFirstLast()}
          onPageChange={setPage}
        />
      </div>
      <p class="text-sm text-[var(--text-secondary)]">
        Page {page()} of {Math.ceil(total() / perPage())}
      </p>
    </div>
  );
}
