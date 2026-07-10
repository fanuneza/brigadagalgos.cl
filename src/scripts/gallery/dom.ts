import { escapeAttribute } from "../../utils/html-escape";
import type { SharedGalleryItem, SharedGalleryPhoto } from "./types";

export function getStoryContext(element: HTMLElement, fallbackItem: SharedGalleryItem) {
  const storyCard = element.closest<HTMLElement>("[data-story-card]");
  if (!storyCard) {
    return null;
  }

  return {
    location: storyCard.dataset.storyLocation ?? "success_stories",
    story_id: storyCard.dataset.storyId ?? fallbackItem.id ?? "",
    story_name: storyCard.dataset.storyName ?? fallbackItem.name,
  };
}

export function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

export function getPhotoAlt(item: SharedGalleryItem, index: number) {
  return item.photos[index]?.alt ?? `${item.name}, foto ${index + 1}`;
}

export function getPhotoCaption(item: SharedGalleryItem, index: number) {
  return item.photos[index]?.caption ?? `${item.name} · Foto ${index + 1} de ${item.photos.length}`;
}

function buildPictureMarkup(photo: SharedGalleryPhoto, alt: string, loading: "lazy" | "eager" = "lazy") {
  const avifSource = photo.cardAvifSrcSet
    ? `<source srcset="${photo.cardAvifSrcSet}" sizes="${escapeAttribute(photo.cardSizes)}" type="image/avif" />`
    : "";

  return `
    <picture>
      ${avifSource}
      <img
        src="${photo.cardFallbackSrc}"
        alt="${escapeAttribute(alt)}"
        class="story-card__img"
        loading="${loading}"
        decoding="async"
        width="350"
        height="350"
      />
    </picture>
  `;
}

export function createSlide(
  item: SharedGalleryItem,
  photo: SharedGalleryPhoto,
  index: number,
  total: number,
  renderImage: boolean,
  loading: "lazy" | "eager" = "lazy"
) {
  const slide = document.createElement("button");
  slide.type = "button";
  slide.className = "story-card__slide";
  slide.setAttribute("aria-label", `Abrir foto ${index + 1} de ${total} de ${item.name}`);
  slide.dataset.photoIndex = String(index);
  if (renderImage) {
    slide.innerHTML = buildPictureMarkup(photo, getPhotoAlt(item, index), loading);
    slide.dataset.imageLoaded = "true";
  }
  return slide;
}

export function ensureSlideImage(slide: HTMLElement, item: SharedGalleryItem) {
  if (slide.dataset.imageLoaded === "true") {
    return;
  }

  const index = Number(slide.dataset.photoIndex);
  const photo = item.photos[index];
  if (!photo) {
    return;
  }

  slide.innerHTML = buildPictureMarkup(photo, getPhotoAlt(item, index));
  slide.dataset.imageLoaded = "true";
}

export function buildDots(container: HTMLElement, item: SharedGalleryItem, onSelect: (index: number) => void) {
  const fragment = document.createDocumentFragment();

  item.photos.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "story-card__dot";
    dot.setAttribute("aria-label", `Ver foto ${index + 1} de ${item.photos.length} de ${item.name}`);
    dot.addEventListener("click", () => onSelect(index));
    fragment.appendChild(dot);
  });

  container.replaceChildren(fragment);
}

export function parsePayload(element: HTMLElement) {
  const payload = element.dataset.galleryPayload;
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload) as SharedGalleryItem;
    if (!parsed.name || !Array.isArray(parsed.photos) || parsed.photos.length === 0) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
