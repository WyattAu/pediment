import { createSignal, Show } from "solid-js";
import { Tabs, TabPanel } from "pediment-components";

export default function TabsDemo() {
  const [active, setActive] = createSignal("overview");
  const [variant, setVariant] = createSignal<"underline" | "pills" | "enclosed">("underline");

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "features", label: "Features", icon: "✨" },
    { id: "settings", label: "Settings", icon: "⚙️", disabled: false },
  ];

  return (
    <div class="space-y-4">
      <div>
        <label class="block text-xs text-[var(--text-secondary)] mb-1">Variant</label>
        <select
          value={variant()}
          onChange={(e) => setVariant(e.currentTarget.value as any)}
          class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm"
        >
          <option value="underline">Underline</option>
          <option value="pills">Pills</option>
          <option value="enclosed">Enclosed</option>
        </select>
      </div>

      <Tabs tabs={tabs} variant={variant()} onChange={setActive} />

      <div class="border border-[var(--border)] rounded-[var(--radius-md)] p-4">
        <Show when={active() === "overview"}>
          <div>
            <h3 class="font-medium mb-2">Overview</h3>
            <p class="text-sm text-[var(--text-secondary)]">Welcome to the overview tab. This content changes based on the active tab.</p>
          </div>
        </Show>
        <Show when={active() === "features"}>
          <div>
            <h3 class="font-medium mb-2">Features</h3>
            <ul class="text-sm text-[var(--text-secondary)] list-disc list-inside space-y-1">
              <li>Keyboard navigation</li>
              <li>Multiple variants</li>
              <li>Disabled state support</li>
            </ul>
          </div>
        </Show>
        <Show when={active() === "settings"}>
          <div>
            <h3 class="font-medium mb-2">Settings</h3>
            <p class="text-sm text-[var(--text-secondary)]">Configure your preferences here.</p>
          </div>
        </Show>
      </div>
    </div>
  );
}
