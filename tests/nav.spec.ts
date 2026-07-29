import { expect, test } from "@playwright/test";

const expectedOrder = ["Adoptar", "Hogar temporal", "Historias", "Colaboradores", "Contacto"];

test("desktop nav still fits at the desktop breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const nav = page.locator(".navbar__nav");
  await expect(nav).toBeVisible();
  await expect(page.locator(".navbar__cta")).toBeVisible();
  await expect(page.locator(".navbar__hamburger")).toBeHidden();
  await expect(nav.locator(".navbar__link")).toHaveText(expectedOrder);
});

const drawerViewports = [
  { name: "tablet", width: 810, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

for (const viewport of drawerViewports) {
  test(`${viewport.name} uses hamburger menu and preserves order in drawer`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page.locator(".navbar__nav")).toBeHidden();
    await expect(page.locator(".navbar__hamburger")).toBeVisible();

    await page.locator(".navbar__hamburger").click();
    const drawer = page.locator(".navbar__drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer.locator(".drawer__link")).toHaveText(expectedOrder);
    await expect(drawer.locator(".drawer__cta")).toBeVisible();
  });
}

// The navbar is transition:persist, so ClientRouter navigations must reset
// drawer state and re-derive aria-current from the new URL.
test("persisted navbar resets drawer and aria-current on client-side navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/adoptar/", { waitUntil: "networkidle" });

  await expect(page.locator('.navbar__link[href="/adoptar/"]')).toHaveAttribute("aria-current", "page");

  await page.locator(".navbar__hamburger").click();
  const drawer = page.locator(".navbar__drawer");
  await expect(drawer).toBeVisible();

  await drawer.locator('.drawer__link[href="/contacto/"]').click();
  await page.waitForURL("**/contacto/");

  await expect(drawer).toBeHidden();
  await expect(page.locator(".navbar__hamburger")).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator('.drawer__link[href="/contacto/"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator('.drawer__link[href="/adoptar/"]')).not.toHaveAttribute("aria-current", "page");
});
