import { createSignal } from "solid-js";
import { Avatar } from "pediment-components";

export default function AvatarDemo() {
  const [name, setName] = createSignal("Jane Doe");
  const [size, setSize] = createSignal<"sm" | "md" | "lg" | "xl">("md");
  const [src, setSrc] = createSignal("");

  return (
    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-xs text-[var(--text-secondary)] mb-1">Name</label>
          <input
            type="text"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label class="block text-xs text-[var(--text-secondary)] mb-1">Size</label>
          <select
            value={size()}
            onChange={(e) => setSize(e.currentTarget.value as any)}
            class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">X-Large</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-[var(--text-secondary)] mb-1">Image URL (optional)</label>
          <input
            type="text"
            value={src()}
            onInput={(e) => setSrc(e.currentTarget.value)}
            placeholder="https://..."
            class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm w-48"
          />
        </div>
      </div>

      <div class="flex items-center gap-4 pt-4">
        <Avatar name={name()} size={size()} src={src() || undefined} />
        <Avatar name="Alice Smith" size={size()} />
        <Avatar name="Bob Jones" size={size()} />
        <Avatar name="Carol White" size={size()} />
      </div>
    </div>
  );
}
