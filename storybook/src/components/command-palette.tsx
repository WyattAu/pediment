import { createSignal } from "solid-js";
import { CommandPalette } from "pediment-components";

export default function CommandPaletteDemo() {
  const [open, setOpen] = createSignal(false);
  const [lastAction, setLastAction] = createSignal("");

  const items = [
    { id: "1", label: "New File", icon: "📄", category: "File", shortcut: "Ctrl+N", action: () => setLastAction("New File") },
    { id: "2", label: "Open File", icon: "📂", category: "File", shortcut: "Ctrl+O", action: () => setLastAction("Open File") },
    { id: "3", label: "Save", icon: "💾", category: "File", shortcut: "Ctrl+S", action: () => setLastAction("Save") },
    { id: "4", label: "Find", icon: "🔍", category: "Edit", shortcut: "Ctrl+F", action: () => setLastAction("Find") },
    { id: "5", label: "Replace", icon: "🔄", category: "Edit", shortcut: "Ctrl+H", action: () => setLastAction("Replace") },
    { id: "6", label: "Toggle Theme", icon: "🎨", category: "View", action: () => setLastAction("Toggle Theme") },
    { id: "7", label: "Settings", icon: "⚙️", category: "View", action: () => setLastAction("Settings") },
  ];

  return (
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm hover:border-[var(--accent)] transition-colors"
        >
          Open Command Palette
        </button>
        <span class="text-xs text-[var(--text-secondary)]">or press Ctrl+K</span>
      </div>
      {lastAction() && (
        <p class="text-sm text-[var(--text-secondary)]">
          Last action: <span class="text-[var(--accent)]">{lastAction()}</span>
        </p>
      )}
      <CommandPalette open={open()} onClose={() => setOpen(false)} items={items} />
    </div>
  );
}
