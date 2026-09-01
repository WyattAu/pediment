import { createSignal, For, Show, onCleanup, createEffect } from "solid-js";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

const [toasts, setToasts] = createSignal<Toast[]>([]);

let nextId = 0;
const toast = (t: Omit<Toast, "id">) => {
  const id = `toast-${++nextId}`;
  const newToast = { ...t, id, duration: t.duration ?? 5000 };
  setToasts(prev => [...prev, newToast]);
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, newToast.duration);
  }
  return id;
};

export const showToast = {
  success: (title: string, message?: string) => toast({ type: "success", title, message }),
  error: (title: string, message?: string) => toast({ type: "error", title, message, duration: 8000 }),
  warning: (title: string, message?: string) => toast({ type: "warning", title, message }),
  info: (title: string, message?: string) => toast({ type: "info", title, message }),
};

export function ToastContainer() {
  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons: Record<string, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colors: Record<string, string> = {
    success: "border-green-500 bg-green-500/10 text-green-700",
    error: "border-red-500 bg-red-500/10 text-red-700",
    warning: "border-yellow-500 bg-yellow-500/10 text-yellow-700",
    info: "border-blue-500 bg-blue-500/10 text-blue-700",
  };

  return (
    <div class="fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 max-w-sm">
      <For each={toasts()}>
        {(t) => (
          <div class={`flex items-start gap-3 rounded-[var(--radius-md)] border-l-4 bg-[var(--bg-card)] p-4 shadow-[var(--shadow-elevation-3)] animate-slide-in ${colors[t.type]}`}>
            <span class="text-lg mt-0.5">{icons[t.type]}</span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium">{t.title}</p>
              <Show when={t.message}>
                <p class="mt-1 text-sm opacity-80">{t.message}</p>
              </Show>
            </div>
            <button onClick={() => dismiss(t.id)} class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-lg leading-none" aria-label="Dismiss">×</button>
          </div>
        )}
      </For>
    </div>
  );
}
