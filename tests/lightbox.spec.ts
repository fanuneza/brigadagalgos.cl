import { expect, test } from "@playwright/test";

test("story gallery opens the native dialog lightbox and returns focus on Escape", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const gallery = page.locator("[data-shared-gallery][data-gallery-context='exito']").first();
  const slide = gallery.locator(".story-card__slide").first();
  const zoom = slide.locator("[data-gallery-zoom]");
  const expectedFull = await slide.getAttribute("data-full");
  const expectedCaption = await slide.getAttribute("data-caption");

  await zoom.click();

  const dialog = page.locator("dialog[data-gallery-lightbox]");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-gallery-lightbox-image]")).toHaveAttribute("src", expectedFull ?? "");

  const caption = dialog.locator("[data-gallery-lightbox-caption]");
  if (expectedCaption) {
    await expect(caption).toHaveText(expectedCaption);
  } else {
    await expect(caption).not.toBeEmpty();
  }

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(zoom).toBeFocused();
});

test("profile galleries carry the adopcion analytics context and open the lightbox", async ({ page }) => {
  await page.goto("/adoptar/blue/", { waitUntil: "networkidle" });

  const gallery = page.locator("[data-shared-gallery][data-gallery-context='adopcion']").first();
  await expect(gallery).toBeVisible();

  const zoom = gallery.locator("[data-gallery-zoom]").first();
  await zoom.click();

  const dialog = page.locator("dialog[data-gallery-lightbox]");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-gallery-lightbox-image]")).toHaveAttribute("src", /\.avif$/);

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(zoom).toBeFocused();
});
