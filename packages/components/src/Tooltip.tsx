import { createSignal, Show, onCleanup, onMount } from "solid-js";

export interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  children: any;
  class?: string;
}

export default function Tooltip(props: TooltipProps) {
  const [show, setShow] = createSignal(false);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const positionStyles = () => {
    switch (props.position ?? "top") {
      case "bottom": return "top-full mt-2 left-1/2 -translate-x-1/2";
      case "left": return "right-full mr-2 top-1/2 -translate-y-1/2";
      case "right": return "left-full ml-2 top-1/2 -translate-y-1/2";
      default: return "bottom-full mb-2 left-1/2 -translate-x-1/2";
    }
  };

  const enter = () => { timeout = setTimeout(() => setShow(true), props.delay ?? 200); };
  const leave = () => { clearTimeout(timeout); setShow(false); };

  onCleanup(() => clearTimeout(timeout));

  return (
    <div class={`relative inline-block ${props.class ?? ""}`} onMouseEnter={enter} onMouseLeave={leave}>
      {props.children}
      <Show when={show()}>
        <div class={`absolute z-50 whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--text-primary)] px-2.5 py-1.5 text-xs text-[var(--bg-primary)] shadow-[var(--shadow-elevation-2)] ${positionStyles()}`}>
          {props.content}
        </div>
      </Show>
    </div>
  );
}
