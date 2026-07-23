import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4399);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const useExternalBaseUrl = Boolean(process.env.PLAYWRIGHT_BASE_URL);
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "true";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  testIgnore: process.env.CI ? ["**/capture.spec.ts"] : [],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: useExternalBaseUrl
    ? undefined
    : {
        command: `node scripts/run-playwright-server.mjs --host 127.0.0.1 --port ${port}`,
        url: baseURL,
        reuseExistingServer,
        timeout: 60_000,
        stdout: "pipe",
        stderr: "pipe",
      },
});
