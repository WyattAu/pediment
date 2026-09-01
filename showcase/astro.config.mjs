import { defineConfig } from "astro/config";
import solid from "@astrojs/solidjs";

export default defineConfig({
  integrations: [solid()],
  server: { port: 4321 },
});
