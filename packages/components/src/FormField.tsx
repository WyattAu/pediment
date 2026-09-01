import { Show, createSignal, For } from "solid-js";

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  rules?: ValidationRule[];
  helpText?: string;
  class?: string;
}

export default function FormField(props: FormFieldProps) {
  const [touched, setTouched] = createSignal(false);
  const [localError, setLocalError] = createSignal<string | undefined>(undefined);

  const validate = (value: string) => {
    if (!props.rules) return;
    for (const rule of props.rules) {
      if (!rule.validate(value)) {
        setLocalError(rule.message);
        return;
      }
    }
    setLocalError(undefined);
  };

  const displayError = () => props.error ?? localError();

  return (
    <div class={`flex flex-col gap-1.5 ${props.class ?? ""}`}>
      <label for={props.name} class="text-sm font-medium text-[var(--text-primary)]">
        {props.label}
        <Show when={props.required}>
          <span class="text-red-500 ml-0.5">*</span>
        </Show>
      </label>
      <input
        id={props.name}
        name={props.name}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        value={props.value ?? ""}
        required={props.required}
        disabled={props.disabled}
        onInput={(e) => validate(e.currentTarget.value)}
        onBlur={(e) => { setTouched(true); validate(e.currentTarget.value); }}
        class={`rounded-[var(--radius-sm)] border px-3 py-2 text-sm bg-[var(--bg-card)] text-[var(--text-primary)] transition-colors ${
          displayError()
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
        } focus:outline-none focus:ring-2 disabled:opacity-50`}
      />
      <Show when={displayError()}>
        <p class="text-xs text-red-500">{displayError()}</p>
      </Show>
      <Show when={props.helpText && !displayError()}>
        <p class="text-xs text-[var(--text-secondary)]">{props.helpText}</p>
      </Show>
    </div>
  );
}
