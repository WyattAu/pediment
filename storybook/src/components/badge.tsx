import { createSignal } from "solid-js";
import { Badge } from "pediment-components";

export default function BadgeDemo() {
  const [variant, setVariant] = createSignal<"default" | "success" | "warning" | "error" | "info" | "outline">("default");
  const [size, setSize] = createSignal<"sm" | "md" | "lg">("md");
  const [dot, setDot] = createSignal(false);
  const [removable, setRemovable] = createSignal(false);

  return (
    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-xs text-[var(--text-secondary)] mb-1">Variant</label>
          <select
            value={variant()}
            onChange={(e) => setVariant(e.currentTarget.value as any)}
            class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm"
          >
            <option value="default">Default</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="info">Info</option>
            <option value="outline">Outline</option>
          </select>
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
          </select>
        </div>
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={dot()} onChange={(e) => setDot(e.currentTarget.checked)} />
          Dot
        </label>
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={removable()} onChange={(e) => setRemovable(e.currentTarget.checked)} />
          Removable
        </label>
      </div>

      <div class="flex flex-wrap gap-2 pt-4">
        <Badge variant={variant()} size={size()} dot={dot()} removable={removable()} onRemove={() => alert("Removed!")}>
          Badge
        </Badge>
        <Badge variant="success" dot>Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="error" size="lg">Critical</Badge>
        <Badge variant="info">New</Badge>
        <Badge variant="outline">Draft</Badge>
      </div>
    </div>
  );
}
