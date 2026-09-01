import { createSignal } from "solid-js";
import { DatePicker } from "pediment-components";

export default function DatePickerDemo() {
  const [selectedDate, setSelectedDate] = createSignal<string>("");

  return (
    <div class="space-y-4">
      <div class="max-w-xs">
        <DatePicker
          placeholder="Pick a date"
          onChange={(d) => setSelectedDate(d.toLocaleDateString())}
        />
      </div>
      {selectedDate() && (
        <p class="text-sm text-[var(--text-secondary)]">
          Selected: <span class="text-[var(--accent)]">{selectedDate()}</span>
        </p>
      )}
    </div>
  );
}
