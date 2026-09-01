import { createSignal } from "solid-js";
import { Modal, ConfirmModal } from "pediment-components";

export default function ModalDemo() {
  const [open, setOpen] = createSignal(false);
  const [confirmOpen, setConfirmOpen] = createSignal(false);
  const [size, setSize] = createSignal<"sm" | "md" | "lg">("md");

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-end">
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
        <button
          onClick={() => setOpen(true)}
          class="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-sm text-white font-medium hover:opacity-90"
        >
          Open Modal
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          class="rounded-[var(--radius-sm)] border border-red-500 px-4 py-2 text-sm text-red-500 font-medium hover:bg-red-500/10"
        >
          Confirm Delete
        </button>
      </div>

      <Modal open={open()} onClose={() => setOpen(false)} title="Example Modal" size={size()}>
        <p class="text-sm text-[var(--text-secondary)] mb-4">
          This is a modal dialog. You can put any content here.
        </p>
        <div class="flex justify-end">
          <button
            onClick={() => setOpen(false)}
            class="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-sm text-white font-medium"
          >
            Got it
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={confirmOpen()}
        title="Delete item?"
        message="This action cannot be undone. Are you sure you want to proceed?"
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => { setConfirmOpen(false); alert("Deleted!"); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
