import { expect, test } from "@playwright/test";

const expectedOrder = ["Inicio", "Adoptar", "Hogar temporal", "Por qué galgos", "Colaboradores", "Contacto"];

test("desktop nav still fits at the desktop breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const nav = page.locator(".navbar__nav");
  await expect(nav).toBeVisible();
  await expect(page.locator(".navbar__cta")).toBeVisible();
  await expect(page.locator(".navbar__hamburger")).toBeHidden();
  await expect(nav.locator(".navbar__link")).toHaveText(expectedOrder);
});

test("tablet uses hamburger menu and preserves order in drawer", async ({ page }) => {
  await page.setViewportSize({ width: 810, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator(".navbar__nav")).toBeHidden();
  await expect(page.locator(".navbar__hamburger")).toBeVisible();

  await page.locator(".navbar__hamburger").click();
  const drawer = page.locator(".navbar__drawer");
  await expect(drawer).toBeVisible();
  await expect(drawer.locator(".drawer__link")).toHaveText(expectedOrder);
  await expect(drawer.locator(".drawer__cta")).toBeVisible();
});

test("mobile uses hamburger menu and preserves order in drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator(".navbar__nav")).toBeHidden();
  await expect(page.locator(".navbar__hamburger")).toBeVisible();

  await page.locator(".navbar__hamburger").click();
  const drawer = page.locator(".navbar__drawer");
  await expect(drawer).toBeVisible();
  await expect(drawer.locator(".drawer__link")).toHaveText(expectedOrder);
  await expect(drawer.locator(".drawer__cta")).toBeVisible();
});
