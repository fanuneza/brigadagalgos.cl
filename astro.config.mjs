import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: "https://brigadagalgos.cl",
  trailingSlash: "always",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    sitemap({
      lastmod: new Date(),
      changefreq: "weekly",
      priority: 0.7,
    }),
  ],
});
