import { dispatchAnalytics } from "../../utils/analytics";
import { getPhotoAlt, getPhotoCaption, wrapIndex } from "./dom";
import type { SharedGalleryItem } from "./types";

const LIGHTBOX_ROOT_SELECTOR = "[data-shared-gallery-lightbox]";

let lightboxState: { item: SharedGalleryItem; index: number; location: string } | null = null;
let documentKeydownAttached = false;

function getLightboxElements() {
  const root = document.querySelector<HTMLElement>(LIGHTBOX_ROOT_SELECTOR);
  if (!root) {
    return null;
  }

  return {
    root,
    image: root.querySelector<HTMLImageElement>("[data-shared-gallery-lightbox-image]"),
    caption: root.querySelector<HTMLElement>("[data-shared-gallery-lightbox-caption]"),
    previous: root.querySelector<HTMLElement>("[data-shared-gallery-lightbox-prev]"),
    next: root.querySelector<HTMLElement>("[data-shared-gallery-lightbox-next]"),
    closeButtons: [
      ...root.querySelectorAll<HTMLElement>(
        "[data-shared-gallery-lightbox-close], [data-shared-gallery-lightbox-close-button]"
      ),
    ],
  };
}

export function openLightbox(item: SharedGalleryItem, index: number, location = "success_stories") {
  const elements = getLightboxElements();
  if (!elements?.image || !elements.caption) {
    return;
  }

  const safeIndex = wrapIndex(index, item.photos.length);
  lightboxState = { item, index: safeIndex, location };

  elements.image.src = item.photos[safeIndex].lightbox;
  elements.image.alt = getPhotoAlt(item, safeIndex);
  elements.caption.textContent = getPhotoCaption(item, safeIndex);
  elements.root.hidden = false;
  document.documentElement.classList.add("has-lightbox-open");
  elements.root.querySelector<HTMLElement>("[data-shared-gallery-lightbox-close-button]")?.focus();
}

function closeLightbox() {
  const elements = getLightboxElements();
  if (!elements) {
    return;
  }

  elements.root.hidden = true;
  lightboxState = null;
  document.documentElement.classList.remove("has-lightbox-open");
}

function stepLightbox(delta: number) {
  if (!lightboxState) {
    return;
  }

  dispatchAnalytics({
    event: delta > 0 ? "gallery_next" : "gallery_previous",
    location: lightboxState.location,
    story_id: lightboxState.item.id ?? "",
    story_name: lightboxState.item.name,
  });
  openLightbox(lightboxState.item, lightboxState.index + delta, lightboxState.location);
}

export function initSharedGalleryLightbox() {
  const elements = getLightboxElements();
  if (!elements) {
    return;
  }

  if (!elements.root.dataset.lightboxBound) {
    elements.root.dataset.lightboxBound = "true";
    elements.previous?.addEventListener("click", () => stepLightbox(-1));
    elements.next?.addEventListener("click", () => stepLightbox(1));
    elements.closeButtons.forEach((button) => button.addEventListener("click", closeLightbox));
  }

  if (!documentKeydownAttached) {
    document.addEventListener("keydown", (event) => {
      if (!lightboxState) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        stepLightbox(-1);
      } else if (event.key === "ArrowRight") {
        stepLightbox(1);
      }
    });
    documentKeydownAttached = true;
  }
}
