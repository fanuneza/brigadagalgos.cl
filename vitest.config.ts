import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "astro:assets": "astro/assets",
      "astro:content": fileURLToPath(new URL("./tests/stubs/astro-content.ts", import.meta.url)),
    },
  },
});
