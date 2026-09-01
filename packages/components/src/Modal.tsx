import { Show, createSignal, onCleanup } from "solid-js";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg";
  children: any;
}

export function Modal(props: ModalProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") props.onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) props.onClose();
  };

  const maxWidth = () => {
    switch (props.size) {
      case "sm": return "max-w-sm";
      case "lg": return "max-w-2xl";
      default: return "max-w-lg";
    }
  };

  return (
    <Show when={props.open}>
      <div
        class="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label={props.title}
      >
        <div class={`w-full ${maxWidth()} mx-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-elevation-4)]`}>
          <Show when={props.title}>
            <div class="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h2 class="text-lg font-semibold text-[var(--text-primary)]">{props.title}</h2>
              <button
                onClick={props.onClose}
                class="rounded-[var(--radius-sm)] p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </Show>
          <div class="px-6 py-4">
            {props.children}
          </div>
        </div>
      </div>
    </Show>
  );
}

export interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
}

export function ConfirmModal(props: ConfirmModalProps) {
  return (
    <Modal open={props.open} onClose={props.onCancel} title={props.title ?? "Confirm"}>
      <p class="text-sm text-[var(--text-secondary)]">{props.message}</p>
      <div class="mt-4 flex justify-end gap-2">
        <button
          onClick={props.onCancel}
          class="rounded-[var(--radius-sm)] border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {props.cancelLabel ?? "Cancel"}
        </button>
        <button
          onClick={props.onConfirm}
          class={`rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium text-white transition-colors ${
            props.variant === "danger"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-[var(--accent)] hover:opacity-90"
          }`}
        >
          {props.confirmLabel ?? "Confirm"}
        </button>
      </div>
    </Modal>
  );
}
