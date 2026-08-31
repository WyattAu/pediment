import type { StarlightPlugin } from "@astrojs/starlight/types";

export default function pedimentStarlight(): StarlightPlugin {
  return {
    name: "pediment-starlight",
    hooks: {
      "config:setup"({ updateConfig, logger }) {
        updateConfig({
          customCss: [
            "@pediment/tokens",
            "@pediment/tokens/spatial-materialism",
            "@pediment/tokens/amoebic-ui",
          ],
        });
        logger.info("Pediment Starlight plugin loaded");
      },
    },
  };
}
