export {};

export interface SharedGalleryPhoto {
  cardAvifSrcSet?: string;
  cardWebpSrcSet: string;
  cardSizes: string;
  cardFallbackSrc: string;
  lightbox: string;
  alt?: string;
  caption?: string;
}

export interface SharedGalleryItem {
  id?: string;
  name: string;
  photos: SharedGalleryPhoto[];
}

const SWIPE_THRESHOLD = 42;
const LIGHTBOX_ROOT_SELECTOR = "[data-shared-gallery-lightbox]";

let lightboxState: { item: SharedGalleryItem; index: number; location: string } | null = null;
let documentKeydownAttached = false;

function dispatchAnalytics(detail: Record<string, string>) {
  document.dispatchEvent(new CustomEvent("brigada:analytics", { detail }));
}

function getStoryContext(element: HTMLElement, fallbackItem: SharedGalleryItem) {
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

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

function escapeAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getPhotoAlt(item: SharedGalleryItem, index: number) {
  return item.photos[index]?.alt ?? `${item.name}, foto ${index + 1}`;
}

function getPhotoCaption(item: SharedGalleryItem, index: number) {
  return item.photos[index]?.caption ?? `${item.name} · Foto ${index + 1} de ${item.photos.length}`;
}

function buildPictureMarkup(photo: SharedGalleryPhoto, alt: string) {
  const avifSource = photo.cardAvifSrcSet
    ? `<source srcset="${photo.cardAvifSrcSet}" sizes="${escapeAttribute(photo.cardSizes)}" type="image/avif" />`
    : "";

  return `
    <picture>
      ${avifSource}
      <source srcset="${photo.cardWebpSrcSet}" sizes="${escapeAttribute(photo.cardSizes)}" type="image/webp" />
      <img
        src="${photo.cardFallbackSrc}"
        srcset="${photo.cardWebpSrcSet}"
        sizes="${escapeAttribute(photo.cardSizes)}"
        alt="${escapeAttribute(alt)}"
        class="story-card__img"
        loading="lazy"
        decoding="async"
        width="350"
        height="350"
      />
    </picture>
  `;
}

function createSlide(item: SharedGalleryItem, photo: SharedGalleryPhoto, index: number, total: number) {
  const slide = document.createElement("button");
  slide.type = "button";
  slide.className = "story-card__slide";
  slide.setAttribute("aria-label", `Abrir foto ${index + 1} de ${total} de ${item.name}`);
  slide.dataset.photoIndex = String(index);
  slide.innerHTML = buildPictureMarkup(photo, getPhotoAlt(item, index));
  return slide;
}

function buildDots(container: HTMLElement, item: SharedGalleryItem, onSelect: (index: number) => void) {
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

function openLightbox(item: SharedGalleryItem, index: number, location = "success_stories") {
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

function parsePayload(element: HTMLElement) {
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

export function buildSharedGalleryMarkup(item: SharedGalleryItem) {
  const payload = escapeAttribute(JSON.stringify(item));

  return `
    <div class="story-card__photo" data-shared-gallery data-gallery-payload='${payload}'>
      <div class="story-card__viewport">
        <div class="story-card__track" data-gallery-track></div>
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

export function initSharedGalleryLightbox() {
  const elements = getLightboxElements();
  if (!elements) {
    return;
  }

  elements.previous?.addEventListener("click", () => stepLightbox(-1));
  elements.next?.addEventListener("click", () => stepLightbox(1));
  elements.closeButtons.forEach((button) => button.addEventListener("click", closeLightbox));

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

export function initSharedGalleries(scope: ParentNode = document) {
  const galleries = [...scope.querySelectorAll<HTMLElement>('[data-shared-gallery]:not([data-gallery-bound="true"])')];

  galleries.forEach((gallery) => {
    const item = parsePayload(gallery);
    if (!item) {
      return;
    }
    const galleryItem = item;

    const viewport = gallery.querySelector<HTMLElement>(".story-card__viewport");
    const track = gallery.querySelector<HTMLElement>("[data-gallery-track]");
    const dots = gallery.querySelector<HTMLElement>("[data-gallery-dots]");
    const previousButton = gallery.querySelector<HTMLButtonElement>("[data-gallery-prev]");
    const nextButton = gallery.querySelector<HTMLButtonElement>("[data-gallery-next]");

    if (!viewport || !track || !dots || !previousButton || !nextButton) {
      return;
    }

    gallery.dataset.galleryBound = "true";

    const total = item.photos.length;
    const hasGallery = total > 1;

    let activeIndex = 0;
    let touchStartX = 0;
    let touchDeltaX = 0;
    let isDragging = false;
    let isAnimating = false;

    const renderedPhotos = hasGallery ? [item.photos[total - 1], ...item.photos, item.photos[0]] : item.photos;

    const slides = renderedPhotos.map((photo, renderIndex) => {
      const realIndex = hasGallery
        ? renderIndex === 0
          ? total - 1
          : renderIndex === renderedPhotos.length - 1
            ? 0
            : renderIndex - 1
        : renderIndex;

      return createSlide(item, photo, realIndex, total);
    });

    track.replaceChildren(...slides);

    function syncDots() {
      const currentIndex = wrapIndex(activeIndex, total);
      [...dots!.children].forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentIndex;
        dot.setAttribute("data-active", String(isActive));
        dot.setAttribute("aria-pressed", String(isActive));
      });
    }

    function setTrackPosition(animate: boolean) {
      const offsetIndex = hasGallery ? activeIndex + 1 : activeIndex;
      track!.style.transition = animate ? "transform var(--duration-base) var(--ease-in-out)" : "none";
      track!.style.transform = `translateX(-${offsetIndex * 100}%)`;
      syncDots();
    }

    function settleAfterLoop() {
      if (activeIndex < 0) {
        activeIndex = total - 1;
        setTrackPosition(false);
      } else if (activeIndex >= total) {
        activeIndex = 0;
        setTrackPosition(false);
      }

      window.requestAnimationFrame(() => {
        isAnimating = false;
      });
    }

    function goTo(index: number, animate = true) {
      if (!hasGallery || isAnimating) {
        return;
      }

      isAnimating = animate;
      activeIndex = index;
      setTrackPosition(animate);

      if (!animate) {
        isAnimating = false;
      }
    }

    function step(delta: number) {
      if (!hasGallery || isAnimating) {
        return;
      }

      const storyContext = getStoryContext(gallery, galleryItem);
      if (storyContext) {
        dispatchAnalytics({
          event: delta > 0 ? "gallery_next" : "gallery_previous",
          ...storyContext,
        });
      }

      goTo(activeIndex + delta, true);
    }

    if (hasGallery) {
      buildDots(dots, item, (dotIndex) => {
        if (isAnimating || dotIndex === activeIndex) {
          return;
        }

        activeIndex = dotIndex;
        setTrackPosition(true);
        isAnimating = true;
      });

      previousButton.addEventListener("click", () => step(-1));
      nextButton.addEventListener("click", () => step(1));
      track.addEventListener("transitionend", settleAfterLoop);

      viewport.addEventListener(
        "touchstart",
        (event) => {
          touchStartX = event.changedTouches[0].clientX;
          touchDeltaX = 0;
          isDragging = false;
        },
        { passive: true }
      );

      viewport.addEventListener(
        "touchmove",
        (event) => {
          touchDeltaX = event.changedTouches[0].clientX - touchStartX;
          if (Math.abs(touchDeltaX) > 10) {
            isDragging = true;
          }
        },
        { passive: true }
      );

      viewport.addEventListener(
        "touchend",
        () => {
          if (Math.abs(touchDeltaX) >= SWIPE_THRESHOLD) {
            step(touchDeltaX < 0 ? 1 : -1);
          }

          window.setTimeout(() => {
            isDragging = false;
            touchDeltaX = 0;
          }, 0);
        },
        { passive: true }
      );
    } else {
      previousButton.hidden = true;
      nextButton.hidden = true;
      dots.hidden = true;
    }

    slides.forEach((slide) => {
      slide.addEventListener("click", (event) => {
        if (isDragging) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }

        const storyContext = getStoryContext(gallery, galleryItem);
        if (storyContext) {
          dispatchAnalytics({
            event: "gallery_open",
            ...storyContext,
          });
        }

        openLightbox(galleryItem, Number(slide.dataset.photoIndex), storyContext?.location ?? "success_stories");
      });
    });

    setTrackPosition(false);
  });
}

if (typeof document !== "undefined") {
  const boot = () => {
    initSharedGalleryLightbox();
    initSharedGalleries();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}
