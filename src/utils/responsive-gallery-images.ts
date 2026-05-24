import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { SharedGalleryPhoto } from "../scripts/shared-gallery";

const CARD_WIDTHS = [320, 480, 640];
const CARD_SIZES = "(min-width: 1024px) 350px, (min-width: 768px) calc(50vw - 48px), calc(100vw - 48px)";
const LIGHTBOX_WIDTH = 1200;

async function buildSrcSet(src: ImageMetadata, format: "avif" | "webp", widths: number[]) {
  const variants = await Promise.all(widths.map((width) => getImage({ src, format, width })));
  return variants.map((variant) => `${variant.src} ${variant.options.width}w`).join(", ");
}

export async function createResponsiveGalleryPhoto(img: ImageMetadata): Promise<SharedGalleryPhoto> {
  const [cardAvifSrcSet, cardWebpSrcSet, cardFallback, lightbox] = await Promise.all([
    buildSrcSet(img, "avif", CARD_WIDTHS),
    buildSrcSet(img, "webp", CARD_WIDTHS),
    getImage({ src: img, format: "webp", width: 480 }),
    getImage({ src: img, format: "avif", width: LIGHTBOX_WIDTH }),
  ]);

  return {
    cardAvifSrcSet,
    cardWebpSrcSet,
    cardSizes: CARD_SIZES,
    cardFallbackSrc: cardFallback.src,
    lightbox: lightbox.src,
  };
}
