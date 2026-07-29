import { test, expect } from "@playwright/test";

test("dog profile opens from the adoption grid", async ({ page }) => {
  await page.goto("/adoptar/");
  const firstCard = page.locator("[data-adoption-card]").first();
  const name = (await firstCard.locator(".dog-card__name").textContent())?.trim();
  await firstCard.getByRole("link", { name: `Conocer a ${name}` }).click();
  await expect(page).toHaveURL(/\/adoptar\/[a-z0-9-]+\/$/);
  await expect(page.locator("h1")).toHaveText(name ?? "");
  await expect(page.getByRole("link", { name: new RegExp(`Postular por ${name}`) })).toBeVisible();
  await expect(page.getByRole("link", { name: new RegExp(`Hablar sobre ${name}`) })).toBeVisible();
});

test("a constrained profile makes limits and current setting explicit", async ({ page }) => {
  await page.goto("/adoptar/turron/");

  await expect(page.getByRole("heading", { name: "Convivencia" })).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: /^GatosNo$/ })).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: /^Perros machosNo$/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cuidados y rutina" })).toBeVisible();
  await expect(
    page.getByText("Necesita un ambiente tranquilo, sin niños pequeños, gatos ni perros machos.")
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dónde está hoy" })).toBeVisible();
  await expect(page.getByText("Isla de Maipo", { exact: true })).toBeVisible();
});

test("an unknown compatibility state asks for a conversation instead of promising a match", async ({ page }) => {
  await page.goto("/adoptar/blue/");

  await expect(page.getByRole("listitem").filter({ hasText: /^GatosSin información confirmada$/ })).toBeVisible();
  await expect(page.getByText("Aún estamos conociendo esta parte de su convivencia.")).toBeVisible();
  await expect(page.getByText("Al postular revisamos tu rutina y conversamos sobre Blue;")).toBeVisible();
});
