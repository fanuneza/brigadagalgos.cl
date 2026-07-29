import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import seoGraph from "@jdevalk/astro-seo-graph/integration";

export default defineConfig({
  output: "static",
  site: "https://brigadagalgos.cl",
  trailingSlash: "always",
  build: {
    inlineStylesheets: "auto",
  },
  env: {
    schema: {
      PUBLIC_GTM_ID: envField.string({ context: "client", access: "public", optional: true }),
      PUBLIC_WEB3FORMS_KEY: envField.string({ context: "client", access: "public", optional: true }),
      ENABLE_INDEXNOW: envField.boolean({ context: "server", access: "public", default: false }),
    },
  },
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
      // astro:env is not available inside astro.config.mjs (Astro limitation),
      // so this gate stays in sync with ENABLE_INDEXNOW in env.schema above.
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
