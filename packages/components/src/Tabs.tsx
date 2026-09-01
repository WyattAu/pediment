import { createSignal, For, Show } from "solid-js";

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "underline" | "pills" | "enclosed";
  class?: string;
}

export default function Tabs(props: TabsProps) {
  const [active, setActive] = createSignal(props.activeTab ?? props.tabs[0]?.id ?? "");

  const selectTab = (id: string) => {
    const tab = props.tabs.find(t => t.id === id);
    if (tab?.disabled) return;
    setActive(id);
    props.onChange?.(id);
  };

  return (
    <div class={props.class ?? ""}>
      <div class={`flex gap-1 border-b ${props.variant === "enclosed" ? "border-[var(--border)]" : "border-[var(--border)]"}`}>
        <For each={props.tabs}>
          {(tab) => (
            <button
              onClick={() => selectTab(tab.id)}
              disabled={tab.disabled}
              class={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                active() === tab.id
                  ? props.variant === "pills"
                    ? "rounded-[var(--radius-sm)] bg-[var(--accent)] text-white"
                    : props.variant === "enclosed"
                    ? "border border-b-0 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] -mb-px"
                    : "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              } ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Show when={tab.icon}><span>{tab.icon}</span></Show>
              {tab.label}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

export interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: any;
}

export function TabPanel(props: TabPanelProps) {
  return <Show when={props.activeTab === props.tabId}>{props.children}</Show>;
}
