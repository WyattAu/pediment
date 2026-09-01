import { createSignal } from "solid-js";
import { FormField } from "pediment-components";

export default function FormFieldDemo() {
  const [required, setRequired] = createSignal(true);
  const [disabled, setDisabled] = createSignal(false);

  return (
    <div class="space-y-4 max-w-md">
      <div class="flex gap-4">
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={required()} onChange={(e) => setRequired(e.currentTarget.checked)} />
          Required
        </label>
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={disabled()} onChange={(e) => setDisabled(e.currentTarget.checked)} />
          Disabled
        </label>
      </div>

      <FormField
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required={required()}
        disabled={disabled()}
        helpText="We'll never share your email"
        rules={[
          { validate: (v) => !required() || v.length > 0, message: "Email is required" },
          { validate: (v) => !v || v.includes("@"), message: "Please enter a valid email" },
        ]}
      />

      <FormField
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required={required()}
        disabled={disabled()}
        helpText="At least 8 characters"
        rules={[
          { validate: (v) => !required() || v.length > 0, message: "Password is required" },
          { validate: (v) => !v || v.length >= 8, message: "Password must be at least 8 characters" },
        ]}
      />
    </div>
  );
}
