import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: "https://brigadagalgos.cl",
  trailingSlash: "always",
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  build: {
    inlineStylesheets: "always",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith(".json"),
    }),
  ],
});
