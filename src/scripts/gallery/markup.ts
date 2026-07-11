import { escapeAttribute } from "../../utils/html-escape";
import type { SharedGalleryItem, SharedGalleryPhoto } from "./types";

function buildInitialSlide(item: SharedGalleryItem, photo: SharedGalleryPhoto, loadingPriority: "lazy" | "eager") {
  const avifSource = photo.cardAvifSrcSet
    ? `<source srcset="${photo.cardAvifSrcSet}" sizes="${escapeAttribute(photo.cardSizes)}" type="image/avif" />`
    : "";
  const fetchPriority = loadingPriority === "eager" ? ' fetchpriority="high"' : "";
  const alt = photo.alt ?? `${item.name}, foto 1`;

  return `
    <button type="button" class="story-card__slide" data-photo-index="0" data-image-loaded="true" aria-label="Abrir foto 1 de ${item.photos.length} de ${escapeAttribute(item.name)}">
      <picture>
        ${avifSource}
        <img
          src="${photo.cardFallbackSrc}"
          alt="${escapeAttribute(alt)}"
          class="story-card__img"
          loading="${loadingPriority}"
          decoding="async"${fetchPriority}
          width="350"
          height="350"
        />
      </picture>
    </button>
  `;
}

export function buildSharedGalleryMarkup(item: SharedGalleryItem, loadingPriority: "lazy" | "eager" = "lazy") {
  const payload = escapeAttribute(JSON.stringify(item));
  const initialPhoto = item.photos[0];
  const initialSlide = initialPhoto ? buildInitialSlide(item, initialPhoto, loadingPriority) : "";
  return `
    <div class="story-card__photo" data-shared-gallery data-gallery-payload='${payload}' data-loading-priority="${loadingPriority}">
      <div class="story-card__viewport">
        <div class="story-card__track" data-gallery-track data-ssr-initial-slide="true">${initialSlide}</div>
      </div>
      <button type="button" class="story-card__control story-card__control--prev" data-gallery-prev aria-label="Ver foto anterior de ${escapeAttribute(item.name)}">
        <span aria-hidden="true">&lsaquo;</span>
      </button>
      <button type="button" class="story-card__control story-card__control--next" data-gallery-next aria-label="Ver foto siguiente de ${escapeAttribute(item.name)}">
        <span aria-hidden="true">&rsaquo;</span>
      </button>
      <div class="story-card__dots" data-gallery-dots></div>
    </div>
  `;
}
