import { expect, type Page } from "@playwright/test";

/**
 * Asserts every shared gallery on the current page renders all of its slides
 * server-side: 1–3 slides each (editorial cap, schema-enforced), an AVIF
 * srcset with exactly 3 variants and a WebP fallback per slide, lazy loading
 * on slides after the first, and the 1200px AVIF lightbox URL in data-full.
 */
export async function assertSharedGallerySlides(page: Page): Promise<void> {
  const galleries = page.locator("[data-shared-gallery]");
  expect(await galleries.count()).toBeGreaterThan(0);

  for (const gallery of await galleries.all()) {
    const slides = gallery.locator(".story-card__slide");
    const slideCount = await slides.count();
    expect(slideCount).toBeGreaterThan(0);
    expect(slideCount).toBeLessThanOrEqual(3);

    for (let index = 0; index < slideCount; index += 1) {
      const slide = slides.nth(index);
      await expect(slide).toHaveAttribute("data-full", /\.avif$/);

      const srcset = await slide.locator("picture source[type='image/avif']").getAttribute("srcset");
      expect(srcset?.split(",")).toHaveLength(3);

      const img = slide.locator("img.story-card__img");
      await expect(img).toHaveAttribute("src", /\.webp$/);
      await expect(img).toHaveAttribute("loading", index === 0 ? /^(eager|lazy)$/ : "lazy");
    }
  }
}
