import { createSignal } from "solid-js";
import { DataTable } from "pediment-components";

export default function DataTableDemo() {
  const [searchable, setSearchable] = createSignal(true);
  const [pageSize, setPageSize] = createSignal(5);

  const data = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    { id: 3, name: "Carol Williams", email: "carol@example.com", role: "Editor" },
    { id: 4, name: "David Brown", email: "david@example.com", role: "User" },
    { id: 5, name: "Eve Davis", email: "eve@example.com", role: "Admin" },
    { id: 6, name: "Frank Miller", email: "frank@example.com", role: "User" },
    { id: 7, name: "Grace Wilson", email: "grace@example.com", role: "Editor" },
    { id: 8, name: "Henry Taylor", email: "henry@example.com", role: "User" },
  ];

  const columns = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", sortable: true },
  ];

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center">
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={searchable()} onChange={(e) => setSearchable(e.currentTarget.checked)} />
          Searchable
        </label>
        <div>
          <label class="block text-xs text-[var(--text-secondary)] mb-1">Page size</label>
          <select
            value={pageSize()}
            onChange={(e) => setPageSize(Number(e.currentTarget.value))}
            class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm"
          >
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
      <DataTable data={data} columns={columns} pageSize={pageSize()} searchable={searchable()} />
    </div>
  );
}
