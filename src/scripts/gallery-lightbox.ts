import { dispatchAnalytics } from "../utils/analytics";

// Native <dialog> lightbox for the shared photo gallery. Slides are read from
// the SSR markup (data-full carries the 1200px AVIF URL); all listeners are
// event-delegated on the document so they survive ClientRouter page swaps.

interface LightboxState {
  gallery: HTMLElement;
  slides: HTMLElement[];
  index: number;
  context: string;
  origin: HTMLElement | null;
}

let state: LightboxState | null = null;
let loadToken = 0;
let bound = false;

function getDialog() {
  return document.querySelector<HTMLDialogElement>("[data-gallery-lightbox]");
}

function renderSlide() {
  const dialog = getDialog();
  const image = dialog?.querySelector<HTMLImageElement>("[data-gallery-lightbox-image]");
  const caption = dialog?.querySelector<HTMLElement>("[data-gallery-lightbox-caption]");
  if (!dialog || !image || !caption || !state) {
    return;
  }

  const { gallery, slides, index } = state;
  const slide = slides[index];
  const name = gallery.dataset.galleryName ?? "";
  caption.textContent = slide.dataset.caption ?? `${name} · Foto ${index + 1} de ${slides.length}`;
  image.alt = slide.dataset.alt ?? name;

  // Blur-up: show the card-size image already in the DOM (same aspect ratio as
  // the 1200px AVIF) until the full file finishes loading.
  const token = ++loadToken;
  const cardImage = slide.querySelector("img");
  image.classList.add("is-loading");
  image.src = cardImage?.currentSrc || cardImage?.src || slide.dataset.full || "";

  const full = slide.dataset.full ?? "";
  const preloader = new Image();
  preloader.onload = () => {
    if (token !== loadToken) {
      return;
    }
    image.src = full;
    image.classList.remove("is-loading");
  };
  preloader.src = full;
}

function openLightbox(zoom: HTMLElement) {
  const gallery = zoom.closest<HTMLElement>("[data-shared-gallery]");
  const dialog = getDialog();
  if (!gallery || !dialog) {
    return;
  }

  const slides = [...gallery.querySelectorAll<HTMLElement>(".story-card__slide")];
  const index = slides.findIndex((slide) => slide.contains(zoom));
  if (index < 0) {
    return;
  }

  const context = gallery.dataset.galleryContext ?? "exito";
  state = { gallery, slides, index, context, origin: zoom };

  dispatchAnalytics({
    event: "gallery_open",
    location: context,
    story_id: gallery.dataset.galleryId ?? "",
    story_name: gallery.dataset.galleryName ?? "",
  });

  renderSlide();
  dialog.showModal();
  dialog.querySelector<HTMLElement>("[data-gallery-lightbox-close]")?.focus();
}

function stepLightbox(delta: number) {
  if (!state) {
    return;
  }

  dispatchAnalytics({
    event: delta > 0 ? "gallery_next" : "gallery_previous",
    location: state.context,
    story_id: state.gallery.dataset.galleryId ?? "",
    story_name: state.gallery.dataset.galleryName ?? "",
  });
  state.index = (state.index + delta + state.slides.length) % state.slides.length;
  renderSlide();
}

function preloadGallery(gallery: HTMLElement) {
  if (gallery.dataset.lightboxPreloaded) {
    return;
  }
  gallery.dataset.lightboxPreloaded = "true";
  gallery.querySelectorAll<HTMLElement>(".story-card__slide").forEach((slide) => {
    if (slide.dataset.full) {
      const preloader = new Image();
      preloader.src = slide.dataset.full;
    }
  });
}

function initGalleryLightbox() {
  if (bound) {
    return;
  }
  bound = true;

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const zoom = event.target.closest<HTMLElement>("[data-gallery-zoom]");
    if (zoom) {
      openLightbox(zoom);
      return;
    }

    const dialog = getDialog();
    if (!dialog?.open || !state) {
      return;
    }

    if (event.target.closest("[data-gallery-lightbox-close]")) {
      dialog.close();
    } else if (event.target.closest("[data-gallery-lightbox-prev]")) {
      stepLightbox(-1);
    } else if (event.target.closest("[data-gallery-lightbox-next]")) {
      stepLightbox(1);
    } else if (event.target === dialog) {
      // Clicks on the backdrop surface as clicks on the dialog element itself.
      dialog.close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!getDialog()?.open || !state) {
      return;
    }
    if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    } else if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  });

  // `close` does not bubble, but document-level capture listeners still see it.
  document.addEventListener(
    "close",
    () => {
      const origin = state?.origin;
      state = null;
      if (origin?.isConnected) {
        origin.focus();
      }
    },
    true
  );

  const preloadOnIntent = (event: Event) => {
    if (event.target instanceof Element) {
      const gallery = event.target.closest<HTMLElement>("[data-shared-gallery]");
      if (gallery) {
        preloadGallery(gallery);
      }
    }
  };
  document.addEventListener("pointerover", preloadOnIntent, { passive: true });
  document.addEventListener("focusin", preloadOnIntent, { passive: true });
  document.addEventListener("touchstart", preloadOnIntent, { passive: true });
}

document.addEventListener("astro:page-load", initGalleryLightbox);
