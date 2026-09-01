import { createSignal } from "solid-js";
import { Accordion } from "pediment-components";

export default function AccordionDemo() {
  const [multiple, setMultiple] = createSignal(false);

  const items = [
    { id: "1", title: "What is Pediment?", content: "Pediment is a shared design system with tokens, components, hooks, and utilities for Astro + SolidJS projects." },
    { id: "2", title: "How do I install it?", content: "Add pediment as a workspace dependency in your package.json and import the tokens and components you need." },
    { id: "3", title: "Is it accessible?", content: "Yes! All components follow WAI-ARIA patterns and support keyboard navigation." },
  ];

  return (
    <div class="space-y-4">
      <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <input type="checkbox" checked={multiple()} onChange={(e) => setMultiple(e.currentTarget.checked)} class="rounded" />
        Allow multiple open
      </label>
      <Accordion items={items} multiple={multiple()} defaultOpen={["1"]} />
    </div>
  );
}
