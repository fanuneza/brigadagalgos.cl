import { test, expect } from "@playwright/test";

test("dog profile opens from the adoption grid", async ({ page }) => {
  await page.goto("/adoptar/");
  const firstLink = page.locator("[data-adoption-card] .dog-card__name-link").first();
  const name = (await firstLink.textContent())?.trim();
  await firstLink.click();
  await expect(page).toHaveURL(/\/adoptar\/[a-z0-9-]+\/$/);
  await expect(page.locator("h1")).toHaveText(name ?? "");
  await expect(page.getByRole("link", { name: new RegExp(`Me interesa ${name}`) })).toBeVisible();
});
