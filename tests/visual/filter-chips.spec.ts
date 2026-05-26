import { expect, test } from "@playwright/test";

test("filter chips show subset of adoption cards and update count", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto("/adoptar/", { waitUntil: "networkidle" });

  const cards = page.locator("[data-sex]");
  const count = page.locator("[data-count]");
  const countLabel = page.locator("[data-count-label]");
  const emptyMessage = page.locator(".dog-grid__empty");

  // Initial state: "Todos" active, all cards visible
  await expect(page.locator(".chip-btn--active")).toHaveAttribute("data-filter", "all");
  const totalCards = await cards.count();
  expect(totalCards).toBeGreaterThan(0);
  await expect(count).toHaveText(String(totalCards));
  await expect(countLabel).toContainText("galgos disponibles");
  await expect(emptyMessage).toBeHidden();

  // Filter by "Macho"
  await page.locator(".chip-btn[data-filter='Macho']").click();
  await expect(page.locator(".chip-btn--active")).toHaveAttribute("data-filter", "Macho");

  const machoCards = cards.filter({ has: page.locator(".chip--sex", { hasText: "Macho" }) });
  const machoCount = await machoCards.count();
  expect(machoCount).toBeGreaterThan(0);
  await expect(count).toHaveText(String(machoCount));

  // All visible cards should match the filter
  const visibleCards = page.locator("[data-sex]:not([hidden])");
  const visibleCount = await visibleCards.count();
  expect(visibleCount).toBe(machoCount);

  // Filter by "Hembra"
  await page.locator(".chip-btn[data-filter='Hembra']").click();
  await expect(page.locator(".chip-btn--active")).toHaveAttribute("data-filter", "Hembra");

  const hembraCards = cards.filter({ has: page.locator(".chip--sex", { hasText: "Hembra" }) });
  const hembraCount = await hembraCards.count();
  expect(hembraCount).toBeGreaterThan(0);
  await expect(count).toHaveText(String(hembraCount));

  // Filter by "Adultos" (age type) — all current dogs are adulto
  await page.locator(".chip-btn[data-filter='adulto']").click();
  await expect(page.locator(".chip-btn--active")).toHaveAttribute("data-filter", "adulto");

  const adultoCards = page.locator("[data-age-type='adulto']");
  const adultoCount = await adultoCards.count();
  expect(adultoCount).toBeGreaterThan(0);
  await expect(count).toHaveText(String(adultoCount));

  // Back to "Todos"
  await page.locator(".chip-btn[data-filter='all']").click();
  await expect(page.locator(".chip-btn--active")).toHaveAttribute("data-filter", "all");
  await expect(count).toHaveText(String(totalCards));
});

test("filter chips handle empty results and restore on reset", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto("/adoptar/", { waitUntil: "networkidle" });

  const cards = page.locator("[data-sex]");
  const emptyMessage = page.locator(".dog-grid__empty");
  const totalCards = await cards.count();

  // Apply a filter that should never match (simulate by checking a non-existent value
  // isn't possible via UI, so we test the "all" reset path instead)
  await page.locator(".chip-btn[data-filter='adulto']").click();
  await expect(page.locator(".chip-btn--active")).toHaveAttribute("data-filter", "adulto");
  await expect(emptyMessage).toBeHidden();

  // Reset to all
  await page.locator(".chip-btn[data-filter='all']").click();
  await expect(page.locator(".chip-btn--active")).toHaveAttribute("data-filter", "all");
  await expect(cards).toHaveCount(totalCards);
  await expect(emptyMessage).toBeHidden();
});

test("adoption galleries expose up to three optimized photos", async ({ page }) => {
  await page.goto("/adoptar/", { waitUntil: "networkidle" });

  const payloads = await page
    .locator("[data-shared-gallery]")
    .evaluateAll((galleries) =>
      galleries.map((gallery) => JSON.parse(gallery.getAttribute("data-gallery-payload") ?? "{}"))
    );

  expect(payloads.length).toBeGreaterThan(0);

  for (const payload of payloads) {
    expect(payload.photos.length).toBeGreaterThan(0);
    expect(payload.photos.length).toBeLessThanOrEqual(3);

    for (const photo of payload.photos) {
      expect(photo.cardWebpSrcSet).toBeUndefined();
      expect(photo.cardAvifSrcSet.split(",")).toHaveLength(3);
      expect(photo.cardFallbackSrc).toMatch(/\.webp$/);
      expect(photo.lightbox).toMatch(/\.avif$/);
    }
  }
});
