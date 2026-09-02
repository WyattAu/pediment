import { createSignal, onMount, For, Show } from "solid-js";

const THEMES = [
  { id: "midnight-navy", label: "Spatial Materialism", icon: "🌌", description: "Deep navy with material depth" },
  { id: "solaris", label: "Amoebic UI", icon: "🫧", description: "Warm, organic tones" },
  { id: "tokyo-night", label: "Brutalist", icon: "🏙️", description: "Raw, high-contrast urban" },
  { id: "arctic-dawn", label: "Tokyo Night", icon: "🌙", description: "Cool purples and teals" },
  { id: "light", label: "Arctic Dawn", icon: "🌅", description: "Bright, crisp morning" },
] as const;

function ThemePreviewCard(props: { theme: typeof THEMES[number]; isActive: boolean }) {
  return (
    <div class={`rounded-[var(--radius-md)] border p-4 transition-all ${
      props.isActive
        ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/30 bg-[var(--accent)]/5"
        : "border-[var(--border)] bg-[var(--bg-card)]"
    }`}>
      <div class="flex items-center gap-3 mb-2">
        <span class="text-2xl">{props.theme.icon}</span>
        <div>
          <p class="text-sm font-semibold text-[var(--text-primary)]">{props.theme.label}</p>
          <p class="text-xs text-[var(--text-secondary)]">{props.theme.id}</p>
        </div>
      </div>
      <p class="text-xs text-[var(--text-secondary)] mb-3">{props.theme.description}</p>
      <div class="flex gap-2">
        <div class="h-4 w-4 rounded-full bg-[var(--accent)]" title="Accent" />
        <div class="h-4 w-4 rounded-full bg-[var(--bg-card)] border border-[var(--border)]" title="Card" />
        <div class="h-4 w-4 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)]" title="Secondary" />
        <div class="h-4 w-4 rounded-full bg-[var(--text-primary)]" title="Text Primary" />
        <div class="h-4 w-4 rounded-full bg-[var(--text-secondary)]" title="Text Secondary" />
      </div>
    </div>
  );
}

function SampleComponents() {
  return (
    <div class="space-y-4">
      <div class="flex gap-3">
        <button class="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)]">
          Primary Button
        </button>
        <button class="rounded-[var(--radius-sm)] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
          Secondary Button
        </button>
      </div>
      <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <p class="text-sm font-medium text-[var(--text-primary)]">Card Component</p>
        <p class="mt-1 text-xs text-[var(--text-secondary)]">This is how cards look in the current theme.</p>
      </div>
      <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-3">
        <input
          type="text"
          class="w-full rounded border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--accent)]"
          placeholder="Text input example..."
        />
      </div>
    </div>
  );
}

export default function ThemeToggleDemo() {
  const [currentTheme, setCurrentTheme] = createSignal("midnight-navy");

  onMount(() => {
    const stored = localStorage.getItem("pediment-theme");
    if (stored) setCurrentTheme(stored);
  });

  const setTheme = (id: string) => {
    setCurrentTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("pediment-theme", id);
  };

  return (
    <div class="space-y-6">
      <section>
        <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-3">Available Themes</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <For each={THEMES}>
            {(theme) => (
              <button
                onClick={() => setTheme(theme.id)}
                class={`text-left rounded-[var(--radius-md)] border p-4 transition-all ${
                  currentTheme() === theme.id
                    ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/30 bg-[var(--accent)]/5"
                    : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50"
                }`}
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-lg">{theme.icon}</span>
                  <span class="text-sm font-semibold text-[var(--text-primary)]">{theme.label}</span>
                </div>
                <p class="text-xs text-[var(--text-secondary)]">{theme.description}</p>
                <Show when={currentTheme() === theme.id}>
                  <span class="mt-2 inline-block rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--accent)]">
                    Active
                  </span>
                </Show>
              </button>
            )}
          </For>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-3">Theme Preview</h3>
        <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <SampleComponents />
        </div>
      </section>

      <section>
        <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-3">Color Palette</h3>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <For each={THEMES}>
            {(theme) => (
              <ThemePreviewCard theme={theme} isActive={currentTheme() === theme.id} />
            )}
          </For>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-3">Persistence</h3>
        <p class="text-xs text-[var(--text-secondary)] mb-2">
          Selected theme is stored in <code class="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">localStorage</code> under <code class="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">pediment-theme</code>.
          Refreshing the page will restore the last selected theme.
        </p>
        <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-3">
          <code class="text-xs text-[var(--text-primary)]">Current theme: {currentTheme()}</code>
        </div>
      </section>
    </div>
  );
}
