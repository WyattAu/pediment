import { createSignal } from "solid-js";
import { Popover } from "pediment-components";

export default function PopoverDemo() {
  const [position, setPosition] = createSignal<"top" | "bottom" | "left" | "right">("bottom");

  return (
    <div class="space-y-4">
      <div>
        <label class="block text-xs text-[var(--text-secondary)] mb-1">Position</label>
        <select
          value={position()}
          onChange={(e) => setPosition(e.currentTarget.value as any)}
          class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm"
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div class="flex items-center gap-8 pt-4">
        <Popover
          trigger={
            <button class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm hover:border-[var(--accent)]">
              Click me
            </button>
          }
          position={position()}
        >
          <div class="w-48">
            <p class="text-sm font-medium text-[var(--text-primary)] mb-1">Popover Title</p>
            <p class="text-xs text-[var(--text-secondary)]">This is popover content with some useful information.</p>
          </div>
        </Popover>
      </div>
    </div>
  );
}
