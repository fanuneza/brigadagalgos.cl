import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import seoGraph from "@jdevalk/astro-seo-graph/integration";

export default defineConfig({
  output: "static",
  site: "https://brigadagalgos.cl",
  trailingSlash: "always",
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  build: {
    inlineStylesheets: "auto",
  },
  vite: {},
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith(".json"),
    }),
    seoGraph({
      validateH1: true,
      validateUniqueMetadata: true,
      validateImageAlt: true,
      validateMetadataLength: true,
      validateInternalLinks: {
        skip: (href) =>
          href.startsWith("/api/") ||
          href.startsWith("/feed.xml") ||
          href.startsWith("/sitemap.xml") ||
          href.startsWith("/schemamap.xml") ||
          href.startsWith("/schema/"),
      },
      indexNow:
        process.env.ENABLE_INDEXNOW === "true"
          ? {
              key: "591c2b87f0b68c44f260215f5d8e9da3",
              host: "brigadagalgos.cl",
              siteUrl: "https://brigadagalgos.cl",
            }
          : undefined,
      markdownAlternate: false,
    }),
  ],
});
