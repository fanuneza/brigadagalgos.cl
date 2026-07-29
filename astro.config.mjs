import { defineConfig, envField, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import seoGraph from "@jdevalk/astro-seo-graph/integration";
import { INDEXNOW_KEY, SITE } from "./src/config/site.ts";

const siteUrl = SITE.siteUrl;

export default defineConfig({
  output: "static",
  site: siteUrl,
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
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Barlow",
      cssVariable: "--font-body",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Segoe UI Variable", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Barlow Condensed",
      cssVariable: "--font-display",
      weights: [700, 900],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Impact", "Haettenschweiler", "Arial Narrow Bold", "Arial Narrow", "sans-serif"],
    },
  ],
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
              key: INDEXNOW_KEY,
              host: new URL(siteUrl).host,
              siteUrl,
            }
          : undefined,
      markdownAlternate: false,
    }),
  ],
});
