import { Show } from "solid-js";

export interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  children: any;
  class?: string;
}

export default function Badge(props: BadgeProps) {
  const variantStyles = () => {
    switch (props.variant ?? "default") {
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error": return "bg-red-100 text-red-800 border-red-200";
      case "info": return "bg-blue-100 text-blue-800 border-blue-200";
      case "outline": return "bg-transparent border-[var(--border)] text-[var(--text-secondary)]";
      default: return "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)]";
    }
  };

  const sizeStyles = () => {
    switch (props.size ?? "md") {
      case "sm": return "px-2 py-0.5 text-xs";
      case "lg": return "px-3 py-1 text-sm";
      default: return "px-2.5 py-0.5 text-xs";
    }
  };

  return (
    <span class={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantStyles()} ${sizeStyles()} ${props.class ?? ""}`}>
      <Show when={props.dot}>
        <span class="h-1.5 w-1.5 rounded-full bg-current" />
      </Show>
      {props.children}
      <Show when={props.removable}>
        <button onClick={props.onRemove} class="ml-0.5 hover:opacity-70" aria-label="Remove">×</button>
      </Show>
    </span>
  );
}
