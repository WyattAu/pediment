import { createSignal } from "solid-js";
import { Select } from "pediment-components";

export default function SelectDemo() {
  const [multiple, setMultiple] = createSignal(false);
  const [searchable, setSearchable] = createSignal(true);
  const [disabled, setDisabled] = createSignal(false);

  const options = [
    { value: "react", label: "React", group: "Frontend" },
    { value: "vue", label: "Vue", group: "Frontend" },
    { value: "solid", label: "SolidJS", group: "Frontend" },
    { value: "svelte", label: "Svelte", group: "Frontend" },
    { value: "node", label: "Node.js", group: "Backend" },
    { value: "deno", label: "Deno", group: "Backend" },
    { value: "bun", label: "Bun", group: "Backend" },
  ];

  return (
    <div class="space-y-4 max-w-sm">
      <div class="flex flex-wrap gap-4">
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={multiple()} onChange={(e) => setMultiple(e.currentTarget.checked)} />
          Multiple
        </label>
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={searchable()} onChange={(e) => setSearchable(e.currentTarget.checked)} />
          Searchable
        </label>
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={disabled()} onChange={(e) => setDisabled(e.currentTarget.checked)} />
          Disabled
        </label>
      </div>

      <Select
        options={options}
        multiple={multiple()}
        searchable={searchable()}
        disabled={disabled()}
        placeholder="Select a framework"
      />
    </div>
  );
}
