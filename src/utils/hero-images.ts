import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import { buildSrcSet } from "./responsive-gallery-images";

export interface HeroImageSources {
  portraitAvifSrcSet: string;
  portraitWebpSrcSet: string;
  landscapeAvifSrcSet: string;
  landscapeWebpSrcSet: string;
  portraitFallbackSrc: string;
}

const PORTRAIT_WIDTHS = [360, 540, 720];
const LANDSCAPE_WIDTHS = [640, 960, 1120];

export async function buildHeroImageSources(
  portraitSrc: ImageMetadata,
  landscapeSrc: ImageMetadata
): Promise<HeroImageSources> {
  const [portraitAvifSrcSet, portraitWebpSrcSet, landscapeAvifSrcSet, landscapeWebpSrcSet, portraitFallback] =
    await Promise.all([
      buildSrcSet(portraitSrc, "avif", PORTRAIT_WIDTHS, 60),
      buildSrcSet(portraitSrc, "webp", PORTRAIT_WIDTHS, 72),
      buildSrcSet(landscapeSrc, "avif", LANDSCAPE_WIDTHS, 60),
      buildSrcSet(landscapeSrc, "webp", LANDSCAPE_WIDTHS, 72),
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
