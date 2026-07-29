import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { SharedGalleryPhoto } from "./gallery";

// Card galleries are intentionally manual: SharedPhotoGallery server-renders
// every slide from these variants (AVIF srcset, WebP fallback, 1200px lightbox
// AVIF), and the lightbox swaps a plain <img> src at runtime. Layout-based
// responsive images (<Image layout="constrained">) are used on editorial
// images instead (blog, editorial pages).

const CARD_WIDTHS = [360, 480, 640];
const CARD_SIZES =
  "(min-width: 1024px) calc((min(100vw, 1200px) - 96px - 48px) / 3), (min-width: 768px) calc((100vw - 48px - 24px) / 2), calc((100vw - 48px) / 1.75)";
const LIGHTBOX_WIDTH = 1200;

export async function buildSrcSet(src: ImageMetadata, format: "avif" | "webp", widths: number[], quality?: number) {
  const variants = await Promise.all(widths.map((width) => getImage({ src, format, width, quality })));
  return variants.map((variant) => `${variant.src} ${variant.options.width}w`).join(", ");
}

export async function createResponsiveGalleryPhoto(img: ImageMetadata): Promise<SharedGalleryPhoto> {
  const [cardAvifSrcSet, cardFallback, lightbox] = await Promise.all([
    buildSrcSet(img, "avif", CARD_WIDTHS, 50),
    getImage({ src: img, format: "webp", width: 480, quality: 72 }),
    getImage({ src: img, format: "avif", width: LIGHTBOX_WIDTH, quality: 65 }),
  ]);

  return {
    cardAvifSrcSet,
    cardSizes: CARD_SIZES,
    cardFallbackSrc: cardFallback.src,
    lightbox: lightbox.src,
  };
}
