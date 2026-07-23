import { expect, test } from "@playwright/test";

const routes = ["/", "/adoptar/", "/casos-de-exito/", "/contacto/", "/donar/"];

for (const route of routes) {
  test(`smoke ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });

    expect(response, `missing response for ${route}`).not.toBeNull();
    expect(response?.ok(), `unexpected status for ${route}: ${response?.status()}`).toBe(true);
    await expect(page.locator("body")).toBeVisible();
  });
}

test("smoke navigation is visible on home", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("header")).toBeVisible();
  await expect(page.getByLabel("Navegación principal").getByRole("link", { name: "Adoptar" })).toBeVisible();
});
