import { createSignal } from "solid-js";
import { Tooltip } from "pediment-components";

export default function TooltipDemo() {
  const [position, setPosition] = createSignal<"top" | "bottom" | "left" | "right">("top");

  return (
    <div class="space-y-6">
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

      <div class="flex items-center justify-center gap-8 pt-8">
        <Tooltip content="Top tooltip" position="top">
          <button class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm hover:border-[var(--accent)]">
            Top
          </button>
        </Tooltip>
        <Tooltip content="Bottom tooltip" position="bottom">
          <button class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm hover:border-[var(--accent)]">
            Bottom
          </button>
        </Tooltip>
        <Tooltip content="Left tooltip" position="left">
          <button class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm hover:border-[var(--accent)]">
            Left
          </button>
        </Tooltip>
        <Tooltip content="Right tooltip" position="right">
          <button class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm hover:border-[var(--accent)]">
            Right
          </button>
        </Tooltip>
      </div>

      <div class="pt-4">
        <p class="text-sm text-[var(--text-secondary)]">Current position: <span class="text-[var(--accent)]">{position()}</span></p>
      </div>
    </div>
  );
}
