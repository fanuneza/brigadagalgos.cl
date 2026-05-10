import { expect, test } from "@playwright/test";

test("Ver mas loads additional stories without duplicates", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const grid = page.locator("[data-stories-list]");
  const button = page.locator("[data-stories-ver-mas]");

  await expect(grid).toBeVisible();

  // Count initial cards (story-card level only, avoiding nested data-story-id duplicates)
  const initialCards = grid.locator("[data-story-card]");
  const initialCount = await initialCards.count();
  expect(initialCount).toBeGreaterThan(0);

  // Button should be visible (more stories exist)
  await expect(button).toBeVisible();

  // Click "Ver mas" once
  await button.click();

  // Wait for new cards to appear
  await expect.poll(async () => await grid.locator("[data-story-card]").count()).toBeGreaterThan(initialCount);

  const afterFirstCount = await grid.locator("[data-story-card]").count();

  // Verify no duplicate story IDs (query card-level ids only)
  const idsAfterFirst = await grid
    .locator("[data-story-card]")
    .evaluateAll((els) => els.map((el) => el.getAttribute("data-story-id")));
  expect(new Set(idsAfterFirst).size).toBe(idsAfterFirst.length);

  // Click "Ver mas" again if button is still visible
  const isButtonVisible = await button.isVisible().catch(() => false);
  if (isButtonVisible) {
    await button.click();
    await expect.poll(async () => await grid.locator("[data-story-card]").count()).toBeGreaterThan(afterFirstCount);

    const afterSecondCount = await grid.locator("[data-story-card]").count();

    // Verify no duplicate story IDs after second load
    const idsAfterSecond = await grid
      .locator("[data-story-card]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-story-id")));
    expect(new Set(idsAfterSecond).size).toBe(idsAfterSecond.length);
    expect(afterSecondCount).toBeGreaterThan(afterFirstCount);
  }
});

test("Ver mas button hides when all stories are loaded", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const button = page.locator("[data-stories-ver-mas]");
  const grid = page.locator("[data-stories-list]");

  // If button is not visible, all stories are already loaded
  const isVisible = await button.isVisible().catch(() => false);
  if (!isVisible) {
    // All stories loaded from the start — verify grid has cards
    const count = await grid.locator("[data-story-card]").count();
    expect(count).toBeGreaterThan(0);
    return;
  }

  // Click until button disappears (with a reasonable max to prevent infinite loops)
  for (let i = 0; i < 10; i++) {
    const stillVisible = await button.isVisible().catch(() => false);
    if (!stillVisible) break;
    await button.click();
    // Small wait for DOM update
    await page.waitForTimeout(100);
  }

  await expect(button).toBeHidden();
});
