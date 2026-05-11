import { initSharedGalleries, initSharedGalleryLightbox } from "./shared-gallery";

document.addEventListener("astro:page-load", () => {
  initSharedGalleryLightbox();
  initSharedGalleries();
});
