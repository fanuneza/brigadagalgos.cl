import { dispatchAnalytics } from "../utils/analytics";
import { initSharedGalleryLightbox, openLightbox, type LightboxGallery } from "./gallery/lightbox";

// Slides are fully server-rendered; JS only opens the lightbox from them.
// Task 06 replaces this bootstrap.
function bindGalleryLightbox(gallery: HTMLElement) {
  if (gallery.dataset.lightboxTriggersBound === "true") {
    return;
  }
  gallery.dataset.lightboxTriggersBound = "true";

  const name = gallery.dataset.galleryName ?? "";
  const slides = [...gallery.querySelectorAll<HTMLElement>(".story-card__slide")];
  const item: LightboxGallery = {
    id: gallery.dataset.galleryId,
    name,
    slides: slides.map((slide) => ({
      full: slide.dataset.full ?? "",
      alt: slide.querySelector("img")?.alt ?? name,
      caption: slide.dataset.caption,
    })),
  };

  slides.forEach((slide, index) => {
    slide.querySelector("[data-gallery-zoom]")?.addEventListener("click", () => {
      const storyCard = gallery.closest<HTMLElement>("[data-story-card]");
      const location = storyCard?.dataset.storyLocation ?? "success_stories";
      if (storyCard) {
        dispatchAnalytics({
          event: "gallery_open",
          location,
          story_id: storyCard.dataset.storyId ?? item.id ?? "",
          story_name: storyCard.dataset.storyName ?? name,
        });
      }
      openLightbox(item, index, location);
    });
  });
}

document.addEventListener("astro:page-load", () => {
  initSharedGalleryLightbox();
  document.querySelectorAll<HTMLElement>("[data-shared-gallery]").forEach(bindGalleryLightbox);
});
