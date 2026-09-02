import { createSignal, ErrorBoundary, Suspense, Show } from "solid-js";

function BuggyComponent() {
  const [shouldError, setShouldError] = createSignal(false);
  if (shouldError()) throw new Error("Component crashed! This is a simulated error.");
  return (
    <div class="space-y-3">
      <p class="text-sm text-[var(--text-primary)]">I am working correctly. Click the button below to simulate a crash.</p>
      <button
        onClick={() => setShouldError(true)}
        class="rounded-[var(--radius-sm)] bg-red-600 px-4 py-2 text-sm text-white font-medium hover:bg-red-700 transition-colors"
      >
        Trigger Error
      </button>
    </div>
  );
}

function BuggyCounter() {
  const [count, setCount] = createSignal(0);
  const [crashed, setCrashed] = createSignal(false);
  if (crashed()) throw new Error("Counter overflow detected!");
  return (
    <div class="space-y-3">
      <p class="text-sm text-[var(--text-primary)]">Count: {count()}</p>
      <div class="flex gap-2">
        <button
          onClick={() => setCount(c => c + 1)}
          class="rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--bg-secondary)] transition-colors"
        >
          Increment
        </button>
        <button
          onClick={() => setCrashed(true)}
          class="rounded-[var(--radius-sm)] bg-red-600 px-3 py-1.5 text-sm text-white font-medium hover:bg-red-700 transition-colors"
        >
          Crash
        </button>
      </div>
    </div>
  );
}

function CustomFallback(props: { error: unknown; reset: () => void }) {
  return (
    <div class="rounded-[var(--radius-md)] border-2 border-dashed border-yellow-500/40 bg-yellow-500/5 p-6">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-lg">⚠️</span>
        <h3 class="text-lg font-semibold text-yellow-400">Custom Fallback UI</h3>
      </div>
      <p class="text-sm text-[var(--text-secondary)] mb-1">
        {props.error instanceof Error ? props.error.message : "An unexpected error occurred"}
      </p>
      <p class="text-xs text-[var(--text-secondary)] mb-4">This is a custom error boundary fallback with its own design.</p>
      <button
        onClick={props.reset}
        class="rounded-[var(--radius-sm)] bg-yellow-600/20 px-4 py-2 text-sm text-yellow-300 hover:bg-yellow-600/30 transition-colors"
      >
        Reset Component
      </button>
    </div>
  );
}

export default function ErrorBoundaryDemo() {
  const [key1, setKey1] = createSignal(0);
  const [key2, setKey2] = createSignal(0);

  return (
    <div class="space-y-6">
      <section>
        <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-3">Basic ErrorBoundary</h3>
        <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <ErrorBoundary
            fallback={(err, reset) => (
              <div class="rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/5 p-6">
                <h3 class="text-lg font-semibold text-red-400">Something went wrong</h3>
                <p class="mt-2 text-sm text-[var(--text-secondary)]">
                  {err instanceof Error ? err.message : "An unexpected error occurred"}
                </p>
                <button
                  onClick={reset}
                  class="mt-4 rounded-[var(--radius-sm)] bg-red-500/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  Try again
                </button>
              </div>
            )}
          >
            <Suspense fallback={<div class="animate-pulse text-sm text-[var(--text-secondary)]">Loading...</div>}>
              <BuggyComponent />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-3">Custom Fallback UI</h3>
        <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <ErrorBoundary fallback={(err, reset) => <CustomFallback error={err} reset={reset} />}>
            <Suspense fallback={<div class="animate-pulse text-sm text-[var(--text-secondary)]">Loading...</div>}>
              <BuggyCounter />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-3">Reset with Key Prop</h3>
        <p class="text-xs text-[var(--text-secondary)] mb-2">Changing the key forces a full remount, clearing the error state.</p>
        <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <ErrorBoundary
            fallback={(err, reset) => (
              <div class="rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/5 p-4">
                <p class="text-sm text-red-400">{err instanceof Error ? err.message : "Error"}</p>
                <button
                  onClick={reset}
                  class="mt-2 rounded-[var(--radius-sm)] bg-red-500/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
          >
            <Suspense fallback={<div class="animate-pulse text-sm text-[var(--text-secondary)]">Loading...</div>}>
              <BuggyComponent />
            </Suspense>
          </ErrorBoundary>
          <div class="mt-3 flex gap-2">
            <button
              onClick={() => setKey1(k => k + 1)}
              class="rounded-[var(--radius-sm)] border border-[var(--accent)] px-3 py-1.5 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              Remount Basic (key: {key1()})
            </button>
            <button
              onClick={() => setKey2(k => k + 1)}
              class="rounded-[var(--radius-sm)] border border-[var(--accent)] px-3 py-1.5 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              Remount Custom (key: {key2()})
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-3">Multiple Error States</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
            <p class="text-xs font-medium text-[var(--text-secondary)] mb-2">Widget A</p>
            <ErrorBoundary
              fallback={(err, reset) => (
                <div class="rounded border border-red-500/20 bg-red-500/5 p-3">
                  <p class="text-xs text-red-400">Widget A failed</p>
                  <button onClick={reset} class="mt-1 text-xs text-red-300 underline">Reset</button>
                </div>
              )}
            >
              <Suspense fallback={<div class="animate-pulse text-sm text-[var(--text-secondary)]">Loading...</div>}>
                <BuggyComponent />
              </Suspense>
            </ErrorBoundary>
          </div>
          <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
            <p class="text-xs font-medium text-[var(--text-secondary)] mb-2">Widget B</p>
            <ErrorBoundary
              fallback={(err, reset) => (
                <div class="rounded border border-red-500/20 bg-red-500/5 p-3">
                  <p class="text-xs text-red-400">Widget B failed</p>
                  <button onClick={reset} class="mt-1 text-xs text-red-300 underline">Reset</button>
                </div>
              )}
            >
              <Suspense fallback={<div class="animate-pulse text-sm text-[var(--text-secondary)]">Loading...</div>}>
                <BuggyComponent />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </section>
    </div>
  );
}
