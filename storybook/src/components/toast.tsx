import { showToast, ToastContainer } from "pediment-components";

export default function ToastDemo() {
  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-3">
        <button
          onClick={() => showToast.success("Saved!", "Your changes were saved successfully")}
          class="rounded-[var(--radius-sm)] bg-green-600 px-4 py-2 text-sm text-white font-medium hover:bg-green-700"
        >
          Success Toast
        </button>
        <button
          onClick={() => showToast.error("Error", "Something went wrong. Please try again.")}
          class="rounded-[var(--radius-sm)] bg-red-600 px-4 py-2 text-sm text-white font-medium hover:bg-red-700"
        >
          Error Toast
        </button>
        <button
          onClick={() => showToast.warning("Warning", "Please check your input")}
          class="rounded-[var(--radius-sm)] bg-yellow-600 px-4 py-2 text-sm text-white font-medium hover:bg-yellow-700"
        >
          Warning Toast
        </button>
        <button
          onClick={() => showToast.info("Info", "New update available")}
          class="rounded-[var(--radius-sm)] bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700"
        >
          Info Toast
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
