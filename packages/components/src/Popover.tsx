import { createSignal, Show, onCleanup, onMount } from "solid-js";

export interface PopoverProps {
  trigger: any;
  children: any;
  position?: "top" | "bottom" | "left" | "right";
  class?: string;
}

export default function Popover(props: PopoverProps) {
  const [open, setOpen] = createSignal(false);
  let ref: HTMLDivElement | undefined;

  const positionStyles = () => {
    switch (props.position ?? "bottom") {
      case "top": return "bottom-full mb-2 left-1/2 -translate-x-1/2";
      case "left": return "right-full mr-2 top-1/2 -translate-y-1/2";
      case "right": return "left-full ml-2 top-1/2 -translate-y-1/2";
      default: return "top-full mt-2 left-1/2 -translate-x-1/2";
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (ref && !ref.contains(e.target as Node)) setOpen(false);
  };

  onMount(() => document.addEventListener("mousedown", handleClickOutside));
  onCleanup(() => document.removeEventListener("mousedown", handleClickOutside));

  return (
    <div ref={ref} class={`relative inline-block ${props.class ?? ""}`}>
      <div onClick={() => setOpen(o => !o)}>{props.trigger}</div>
      <Show when={open()}>
        <div class={`absolute z-50 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-elevation-3)] ${positionStyles()}`}>
          {props.children}
        </div>
      </Show>
    </div>
  );
}
