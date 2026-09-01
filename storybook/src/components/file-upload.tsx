import { createSignal } from "solid-js";
import { FileUpload } from "pediment-components";

export default function FileUploadDemo() {
  const [multiple, setMultiple] = createSignal(true);
  const [accept, setAccept] = createSignal("*");
  const [maxSizeMB, setMaxSizeMB] = createSignal(10);

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-end">
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={multiple()} onChange={(e) => setMultiple(e.currentTarget.checked)} />
          Multiple files
        </label>
        <div>
          <label class="block text-xs text-[var(--text-secondary)] mb-1">Accept</label>
          <select
            value={accept()}
            onChange={(e) => setAccept(e.currentTarget.value)}
            class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm"
          >
            <option value="*">Any file</option>
            <option value="image/*">Images</option>
            <option value=".pdf">PDF only</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-[var(--text-secondary)] mb-1">Max size (MB)</label>
          <input
            type="number"
            value={maxSizeMB()}
            onInput={(e) => setMaxSizeMB(Number(e.currentTarget.value))}
            class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm w-20"
          />
        </div>
      </div>
      <FileUpload
        accept={accept()}
        multiple={multiple()}
        maxSize={maxSizeMB() * 1024 * 1024}
        onFiles={(files) => console.log("Files:", files)}
      />
    </div>
  );
}
