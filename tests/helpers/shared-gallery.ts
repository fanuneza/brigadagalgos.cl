import { expect, type Page } from "@playwright/test";

export interface GalleryPhoto {
  cardWebpSrcSet?: string;
  cardAvifSrcSet: string;
  cardFallbackSrc: string;
  lightbox: string;
}

export interface GalleryPayload {
  photos: GalleryPhoto[];
}

/**
 * Reads every shared-gallery payload rendered on the current page and asserts
 * the editorial gallery cap (1–3 photos per gallery, schema-enforced).
 */
export async function getSharedGalleryPayloads(page: Page): Promise<GalleryPayload[]> {
  const payloads = (await page
    .locator("[data-shared-gallery]")
    .evaluateAll((galleries) =>
      galleries.map((gallery) => JSON.parse(gallery.getAttribute("data-gallery-payload") ?? "{}"))
    )) as GalleryPayload[];

  expect(payloads.length).toBeGreaterThan(0);
  for (const payload of payloads) {
    expect(payload.photos.length).toBeGreaterThan(0);
    expect(payload.photos.length).toBeLessThanOrEqual(3);
  }

  return payloads;
}
