import { createSignal, For, Show } from "solid-js";

export interface AccordionItem {
  id: string;
  title: string;
  content: any;
  disabled?: boolean;
  icon?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: string[];
  class?: string;
}

export default function Accordion(props: AccordionProps) {
  const [openIds, setOpenIds] = createSignal<Set<string>>(new Set(props.defaultOpen ?? []));

  const toggle = (id: string) => {
    const item = props.items.find(i => i.id === id);
    if (item?.disabled) return;
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!props.multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div class={`divide-y divide-[var(--border)] rounded-[var(--radius-md)] border border-[var(--border)] ${props.class ?? ""}`}>
      <For each={props.items}>
        {(item) => {
          const isOpen = () => openIds().has(item.id);
          return (
            <div>
              <button
                onClick={() => toggle(item.id)}
                disabled={item.disabled}
                class={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-left transition-colors ${
                  item.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--bg-secondary)] cursor-pointer"
                }`}
              >
                <span class="flex items-center gap-2 text-[var(--text-primary)]">
                  <Show when={item.icon}><span>{item.icon}</span></Show>
                  {item.title}
                </span>
                <span class="text-[var(--text-secondary)] transition-transform" classList={{ "rotate-180": isOpen() }}>▾</span>
              </button>
              <Show when={isOpen()}>
                <div class="px-4 pb-4 text-sm text-[var(--text-secondary)]">
                  {item.content}
                </div>
              </Show>
            </div>
          );
        }}
      </For>
    </div>
  );
}
