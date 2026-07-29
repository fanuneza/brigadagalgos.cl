import { test, expect } from "@playwright/test";

test("dog profile opens from the adoption grid", async ({ page }) => {
  await page.goto("/adoptar/");
  const firstCard = page.locator("[data-adoption-card]").first();
  const name = (await firstCard.locator(".dog-card__name").textContent())?.trim();
  await firstCard.getByRole("link", { name: `Conocer a ${name}` }).click();
  await expect(page).toHaveURL(/\/adoptar\/[a-z0-9-]+\/$/);
  await expect(page.locator("h1")).toHaveText(name ?? "");
  await expect(page.getByRole("link", { name: new RegExp(`Postular por ${name}`) })).toBeVisible();
  await expect(page.getByRole("link", { name: new RegExp(`Más información sobre ${name}`) })).toBeVisible();
});
