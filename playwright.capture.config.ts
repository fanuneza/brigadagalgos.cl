import { defineConfig } from "@playwright/test";
import baseConfig from "./playwright.config";

// Visual-parity screenshots are an on-demand workflow (npm run capture:*),
// kept outside tests/ so `npm test` never runs them.
export default defineConfig({
  ...baseConfig,
  testDir: "./capture",
});
