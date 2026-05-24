import { initSharedGalleries, initSharedGalleryLightbox } from "./shared-gallery";

document.addEventListener("astro:page-load", () => {
  initSharedGalleryLightbox();

  // Yield to the browser so paint can happen before we bind gallery interactivity.
  // Above-fold galleries are initialized immediately; below-fold are deferred via IntersectionObserver.
  setTimeout(() => {
    initSharedGalleries(document, 2);
  }, 0);
});
