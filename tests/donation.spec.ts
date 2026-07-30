import { expect, test } from "@playwright/test";

test("copiar datos bancarios anuncia la confirmación", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          window.sessionStorage.setItem("copied-bank-data", value);
        },
      },
    });
  });

  await page.goto("/donar/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Copiar datos bancarios" }).click();

  await expect(page.locator("[data-copy-live]")).toHaveText("Datos bancarios copiados");
  await expect
    .poll(() => page.evaluate(() => window.sessionStorage.getItem("copied-bank-data")))
    .toContain("Fundación Brigada Galgos");
});
