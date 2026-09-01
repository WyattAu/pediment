import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Pediment",
      description: "Shared design tokens, components, hooks, and utilities for Astro+SolidJS+Starlight+Cloudflare projects",
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "index" },
            { label: "Installation", slug: "getting-started" },
          ],
        },
        {
          label: "Components",
          items: [
            { label: "DataTable", slug: "components/data-table" },
            { label: "FormField", slug: "components/form-field" },
            { label: "Modal", slug: "components/modal" },
          ],
        },
        {
          label: "Theming",
          items: [
            { label: "Design Tokens", slug: "tokens" },
            { label: "Themes", slug: "themes" },
          ],
        },
      ],
    }),
  ],
});
