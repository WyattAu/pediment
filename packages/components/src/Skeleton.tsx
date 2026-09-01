import { For, Show } from "solid-js";

export interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
  class?: string;
}

export default function Skeleton(props: SkeletonProps) {
  const rounded = () => {
    switch (props.rounded ?? "md") {
      case "sm": return "rounded-[var(--radius-sm)]";
      case "lg": return "rounded-[var(--radius-lg)]";
      case "full": return "rounded-full";
      default: return "rounded-[var(--radius-md)]";
    }
  };

  return (
    <div
      class={`animate-pulse bg-[var(--bg-secondary)] ${rounded()} ${props.class ?? ""}`}
      style={{ width: props.width ?? "100%", height: props.height ?? "1rem" }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText(props: { lines?: number; class?: string }) {
  return (
    <div class={`space-y-2 ${props.class ?? ""}`}>
      <For each={Array.from({ length: props.lines ?? 3 })}>
        {(_, i) => (
          <Skeleton
            width={i() === (props.lines ?? 3) - 1 ? "60%" : "100%"}
            height="0.875rem"
          />
        )}
      </For>
    </div>
  );
}

export function SkeletonCard(props: { class?: string }) {
  return (
    <div class={`rounded-[var(--radius-md)] border border-[var(--border)] p-4 space-y-3 ${props.class ?? ""}`}>
      <div class="flex items-center gap-3">
        <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
        <div class="flex-1 space-y-2">
          <Skeleton width="40%" height="0.875rem" />
          <Skeleton width="60%" height="0.75rem" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}
