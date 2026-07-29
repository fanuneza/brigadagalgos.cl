import { dispatchAnalytics } from "../../utils/analytics";

const LIGHTBOX_ROOT_SELECTOR = "[data-shared-gallery-lightbox]";

// Slides are read from the SSR markup (data-full carries the 1200px AVIF URL);
// the JSON payload is gone. Task 06 rebuilds this lightbox.
export interface LightboxSlide {
  full: string;
  alt: string;
  caption?: string;
}

export interface LightboxGallery {
  id?: string;
  name: string;
  slides: LightboxSlide[];
}

let lightboxState: { gallery: LightboxGallery; index: number; location: string } | null = null;
let documentKeydownAttached = false;

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

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

export function openLightbox(gallery: LightboxGallery, index: number, location = "success_stories") {
  const elements = getLightboxElements();
  if (!elements?.image || !elements.caption) {
    return;
  }

  const safeIndex = wrapIndex(index, gallery.slides.length);
  lightboxState = { gallery, index: safeIndex, location };

  const slide = gallery.slides[safeIndex];
  elements.image.src = slide.full;
  elements.image.alt = slide.alt;
  elements.caption.textContent = slide.caption ?? `${gallery.name} · Foto ${safeIndex + 1} de ${gallery.slides.length}`;
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
    story_id: lightboxState.gallery.id ?? "",
    story_name: lightboxState.gallery.name,
  });
  openLightbox(lightboxState.gallery, lightboxState.index + delta, lightboxState.location);
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
