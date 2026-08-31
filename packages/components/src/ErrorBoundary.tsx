import { createSignal, ErrorBoundary, Show, Suspense } from "solid-js";

function FallbackUI(props: { error: unknown; reset: () => void }) {
  return (
    <div class="rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/5 p-6">
      <h3 class="text-lg font-semibold text-red-400">Something went wrong</h3>
      <p class="mt-2 text-sm text-[var(--text-secondary)]">
        {props.error instanceof Error ? props.error.message : "An unexpected error occurred"}
      </p>
      <button
        onClick={props.reset}
        class="mt-4 rounded-[var(--radius-sm)] bg-red-500/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/30 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export default function AppErrorBoundary(props: { children: any }) {
  return (
    <ErrorBoundary fallback={(err, reset) => <FallbackUI error={err} reset={reset} />}>
      <Suspense fallback={<div class="animate-pulse">Loading...</div>}>
        {props.children}
      </Suspense>
    </ErrorBoundary>
  );
}
