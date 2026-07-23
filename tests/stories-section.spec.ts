import { expect, test } from "@playwright/test";

test("home prioritizes active dogs and links the stories preview to the archive", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const featured = page.locator("#galgos-en-adopcion");
  const stories = page.locator("#historias");
  const featuredCards = featured.locator("[data-featured-adoption-card]");

  await expect(featured).toBeVisible();
  await expect(featuredCards).toHaveCount(3);
  await expect(stories).toBeVisible();
  const featuredBeforeStories = await featured.evaluate((element) => {
    const storiesSection = document.querySelector("#historias");
    return Boolean(
      storiesSection && element.compareDocumentPosition(storiesSection) & Node.DOCUMENT_POSITION_FOLLOWING
    );
  });
  expect(featuredBeforeStories).toBe(true);

  for (const card of await featuredCards.all()) {
    await expect(card.locator("a[href^='/adoptar/']").first()).toHaveAttribute("href", /\/adoptar\/[^/]+\/$/);
  }

  await expect(featured.getByRole("link", { name: "Ver todos los galgos en adopción" })).toHaveAttribute(
    "href",
    "/adoptar/"
  );
  await expect(stories.locator("[data-story-card]")).toHaveCount(3);
  await expect(stories.getByRole("link", { name: "Ver todas las historias" })).toHaveAttribute(
    "href",
    "/casos-de-exito/"
  );
  await expect(page.locator("[data-stories-ver-mas]")).toHaveCount(0);
});

test("success archive renders every story and returns visitors to active adoption", async ({ page }) => {
  await page.goto("/casos-de-exito/", { waitUntil: "networkidle" });

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".rainbow-divider")).toHaveCount(1);
  await expect(page.locator("[data-story-card]")).toHaveCount(25);
  await expect(
    page.locator(".stories-archive-cta").getByRole("link", { name: "Ver galgos disponibles" })
  ).toHaveAttribute("href", "/adoptar/");
  await expect(page).toHaveTitle(/Historias de galgos que encontraron hogar/i);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /galgos que fueron adoptados/);
});

test("success-story galleries preserve responsive image output", async ({ page }) => {
  await page.goto("/casos-de-exito/", { waitUntil: "networkidle" });

  const payloads = await page
    .locator("[data-shared-gallery]")
    .evaluateAll((galleries) =>
      galleries.map((gallery) => JSON.parse(gallery.getAttribute("data-gallery-payload") ?? "{}"))
    );

  expect(payloads.length).toBeGreaterThan(0);
  for (const payload of payloads) {
    expect(payload.photos.length).toBeGreaterThan(0);
    expect(payload.photos.length).toBeLessThanOrEqual(3);
  }
});
