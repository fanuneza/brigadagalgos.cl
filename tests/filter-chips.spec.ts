import { expect, test } from "@playwright/test";

test("filter chips show subset of adoption cards and update count", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto("/adoptar/", { waitUntil: "networkidle" });

  const cards = page.locator("[data-sex]");
  const count = page.locator("[data-count]");
  const countLabel = page.locator("[data-count-label]");
  const emptyMessage = page.locator(".dog-grid__empty");

  // Initial state: "Todos" active, all cards visible
  await expect(page.locator(".filter-chip--active")).toHaveAttribute("data-filter", "all");
  const totalCards = await cards.count();
  expect(totalCards).toBeGreaterThan(0);
  await expect(count).toHaveText(String(totalCards));
  await expect(countLabel).toContainText("galgos disponibles");
  await expect(emptyMessage).toBeHidden();

  // Filter by "Macho"
  await page.locator(".filter-chip[data-filter='Macho']").click();
  await expect(page.locator(".filter-chip--active")).toHaveAttribute("data-filter", "Macho");

  const machoCards = cards.filter({ has: page.locator(".dog-chip--sex", { hasText: "Macho" }) });
  const machoCount = await machoCards.count();
  expect(machoCount).toBeGreaterThan(0);
  await expect(count).toHaveText(String(machoCount));

  // All visible cards should match the filter
  const visibleCards = page.locator("[data-sex]:not([hidden])");
  const visibleCount = await visibleCards.count();
  expect(visibleCount).toBe(machoCount);

  // Filter by "Hembra"
  await page.locator(".filter-chip[data-filter='Hembra']").click();
  await expect(page.locator(".filter-chip--active")).toHaveAttribute("data-filter", "Hembra");

  const hembraCards = cards.filter({ has: page.locator(".dog-chip--sex", { hasText: "Hembra" }) });
  const hembraCount = await hembraCards.count();
  await expect(count).toHaveText(String(hembraCount));
  await expect(visibleCards).toHaveCount(hembraCount);

  if (hembraCount === 0) {
    await expect(emptyMessage).toBeVisible();
  } else {
    await expect(emptyMessage).toBeHidden();
  }

  // Back to "Todos"
  await page.locator(".filter-chip[data-filter='all']").click();
  await expect(page.locator(".filter-chip--active")).toHaveAttribute("data-filter", "all");
  await expect(count).toHaveText(String(totalCards));
});

test("filter chips are keyboard operable and restore all results", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto("/adoptar/", { waitUntil: "networkidle" });

  const cards = page.locator("[data-sex]");
  const totalCards = await cards.count();

  const maleChip = page.locator(".filter-chip[data-filter='Macho']");
  await maleChip.focus();
  await page.keyboard.press("Enter");
  await expect(maleChip).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-sex]:not([hidden])")).toHaveCount(
    await cards.filter({ has: page.locator(".dog-chip--sex", { hasText: "Macho" }) }).count()
  );

  // Reset to all
  await page.locator(".filter-chip[data-filter='all']").click();
  await expect(page.locator(".filter-chip--active")).toHaveAttribute("data-filter", "all");
  await expect(cards).toHaveCount(totalCards);
});

test("adoption cards use one image and a named profile action", async ({ page }) => {
  await page.goto("/adoptar/", { waitUntil: "networkidle" });

  const cards = page.locator("[data-adoption-card]");
  const count = await cards.count();

  for (let index = 0; index < count; index++) {
    const card = cards.nth(index);
    const name = (await card.locator(".dog-card__name").textContent())?.trim();
    await expect(card.locator(".dog-card__image")).toHaveCount(1);
    await expect(card.locator("[data-shared-gallery]")).toHaveCount(0);
    await expect(card.getByRole("link", { name: `Conocer a ${name}` })).toHaveAttribute(
      "href",
      /\/adoptar\/[a-z0-9-]+\/$/
    );
  }
});
