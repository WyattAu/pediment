import { createSignal, createMemo, For, Show } from "solid-js";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  placeholder?: string;
  class?: string;
}

export default function DatePicker(props: DatePickerProps) {
  const [open, setOpen] = createSignal(false);
  const [currentMonth, setCurrentMonth] = createSignal(props.value ?? new Date());
  const [selected, setSelected] = createSignal<Date | undefined>(props.value);

  const daysInMonth = createMemo(() => {
    const year = currentMonth().getFullYear();
    const month = currentMonth().getMonth();
    return new Date(year, month + 1, 0).getDate();
  });

  const firstDayOfMonth = createMemo(() => {
    return new Date(currentMonth().getFullYear(), currentMonth().getMonth(), 1).getDay();
  });

  const prevMonth = () => {
    const d = new Date(currentMonth());
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };

  const nextMonth = () => {
    const d = new Date(currentMonth());
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  const selectDay = (day: number) => {
    const d = new Date(currentMonth().getFullYear(), currentMonth().getMonth(), day);
    setSelected(d);
    props.onChange?.(d);
    setOpen(false);
  };

  const isSelected = (day: number) => {
    const s = selected();
    if (!s) return false;
    return s.getFullYear() === currentMonth().getFullYear() && s.getMonth() === currentMonth().getMonth() && s.getDate() === day;
  };

  const monthLabel = () => currentMonth().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div class={`relative ${props.class ?? ""}`}>
      <button type="button" onClick={() => setOpen(o => !o)} class="flex w-full items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-left transition-colors hover:border-[var(--accent)]">
        <span class={selected() ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}>
          {selected() ? selected()!.toLocaleDateString() : props.placeholder ?? "Select date"}
        </span>
        <span class="text-[var(--text-secondary)]">📅</span>
      </button>
      <Show when={open()}>
        <div class="absolute z-50 mt-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-3 shadow-[var(--shadow-elevation-3)]">
          <div class="flex items-center justify-between mb-2">
            <button onClick={prevMonth} class="rounded-[var(--radius-sm)] p-1 hover:bg-[var(--bg-secondary)]">‹</button>
            <span class="text-sm font-medium text-[var(--text-primary)]">{monthLabel()}</span>
            <button onClick={nextMonth} class="rounded-[var(--radius-sm)] p-1 hover:bg-[var(--bg-secondary)]">›</button>
          </div>
          <div class="grid grid-cols-7 gap-0.5 text-center text-xs">
            <For each={["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]}>
              {(d) => <div class="py-1 text-[var(--text-secondary)] font-medium">{d}</div>}
            </For>
            <For each={Array.from({ length: firstDayOfMonth() })}>
              {() => <div />}
            </For>
            <For each={Array.from({ length: daysInMonth() })}>
              {(_, i) => (
                <button
                  onClick={() => selectDay(i() + 1)}
                  class={`h-8 w-8 rounded-[var(--radius-sm)] text-sm transition-colors ${
                    isSelected(i() + 1) ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  }`}
                >
                  {i() + 1}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
