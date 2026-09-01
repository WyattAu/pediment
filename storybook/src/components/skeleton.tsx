import { createSignal } from "solid-js";
import { Skeleton, SkeletonText, SkeletonCard } from "pediment-components";

export default function SkeletonDemo() {
  const [showContent, setShowContent] = createSignal(false);

  return (
    <div class="space-y-6">
      <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <input type="checkbox" checked={showContent()} onChange={(e) => setShowContent(e.currentTarget.checked)} />
        Show loaded content
      </label>

      {showContent() ? (
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Loaded Content</h3>
          <p class="text-sm text-[var(--text-secondary)]">
            This is the actual content that would appear after loading completes.
          </p>
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-[var(--accent)]" />
            <div>
              <p class="text-sm font-medium">Jane Doe</p>
              <p class="text-xs text-[var(--text-secondary)]">Software Engineer</p>
            </div>
          </div>
        </div>
      ) : (
        <div class="space-y-4">
          <Skeleton width="200px" height="24px" />
          <SkeletonText lines={3} />
          <div class="flex items-center gap-3">
            <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
            <div class="flex-1 space-y-2">
              <Skeleton width="40%" height="14px" />
              <Skeleton width="60%" height="12px" />
            </div>
          </div>
        </div>
      )}

      <div class="pt-4">
        <h4 class="text-sm font-medium mb-3">Card Skeleton</h4>
        <SkeletonCard />
      </div>

      <div class="pt-4">
        <h4 class="text-sm font-medium mb-3">Various Sizes</h4>
        <div class="space-y-2">
          <Skeleton width="100%" height="8px" rounded="full" />
          <Skeleton width="80%" height="12px" rounded="md" />
          <Skeleton width="60%" height="16px" rounded="lg" />
          <Skeleton width="40%" height="24px" rounded="sm" />
        </div>
      </div>
    </div>
  );
}
