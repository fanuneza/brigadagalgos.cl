import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import { buildSrcSet } from "./responsive-gallery-images";

export type ResponsiveImageFormat = "avif" | "webp";

export interface HeroImageSources {
  portraitAvifSrcSet: string;
  portraitWebpSrcSet: string;
  landscapeAvifSrcSet: string;
  landscapeWebpSrcSet: string;
  portraitFallbackSrc: string;
}

const PORTRAIT_WIDTHS = [360, 420, 540, 640, 720];
const LANDSCAPE_WIDTHS = [560, 640, 768, 840, 960, 1120];

export function buildResponsiveImageSrcSet(
  src: ImageMetadata,
  format: ResponsiveImageFormat,
  widths: number[],
  quality?: number
): Promise<string> {
  return buildSrcSet(src, format, widths, quality);
}

export async function buildHeroImageSources(
  portraitSrc: ImageMetadata,
  landscapeSrc: ImageMetadata
): Promise<HeroImageSources> {
  const [portraitAvifSrcSet, portraitWebpSrcSet, landscapeAvifSrcSet, landscapeWebpSrcSet, portraitFallback] =
    await Promise.all([
      buildResponsiveImageSrcSet(portraitSrc, "avif", PORTRAIT_WIDTHS, 60),
      buildResponsiveImageSrcSet(portraitSrc, "webp", PORTRAIT_WIDTHS, 72),
      buildResponsiveImageSrcSet(landscapeSrc, "avif", LANDSCAPE_WIDTHS, 60),
      buildResponsiveImageSrcSet(landscapeSrc, "webp", LANDSCAPE_WIDTHS, 72),
      getImage({ src: portraitSrc, format: "webp", width: 540, quality: 72 }),
    ]);

  return {
    portraitAvifSrcSet,
    portraitWebpSrcSet,
    landscapeAvifSrcSet,
    landscapeWebpSrcSet,
    portraitFallbackSrc: portraitFallback.src,
  };
}
