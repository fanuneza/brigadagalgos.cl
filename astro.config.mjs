import { defineConfig, envField, fontProviders, svgoOptimizer } from "astro/config";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import seoGraph from "@jdevalk/astro-seo-graph/integration";
import { INDEXNOW_KEY, SITE } from "./src/config/site.ts";

const siteUrl = SITE.siteUrl;

// astro:env is not available inside astro.config.mjs (Astro evaluates the
// config before the virtual module exists), so load .env files with Vite's
// loadEnv helper, per the Astro docs. loadEnv also merges process.env, so
// CLI-set variables keep working. Stays in sync with the ENABLE_INDEXNOW
// entry in env.schema below.
const { ENABLE_INDEXNOW } = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

export default defineConfig({
  output: "static",
  site: siteUrl,
  trailingSlash: "always",
  build: {
    inlineStylesheets: "auto",
  },
  image: {
    responsiveStyles: true,
  },
  experimental: {
    svgOptimizer: svgoOptimizer({ plugins: ["preset-default", "removeXMLNS"] }),
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
      // astro:env is not available inside astro.config.mjs; the gate reads
      // the value loaded via loadEnv above (see comment there).
      indexNow:
        ENABLE_INDEXNOW === "true"
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
