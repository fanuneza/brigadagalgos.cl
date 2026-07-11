import { dispatchAnalytics } from "../../utils/analytics";
import { buildDots, createSlide, ensureSlideImage, getStoryContext, parsePayload, wrapIndex } from "./dom";
import { openLightbox } from "./lightbox";

const SWIPE_THRESHOLD = 42;

function initGalleryList(galleries: HTMLElement[]) {
  galleries.forEach((gallery) => {
    const item = parsePayload(gallery);
    if (!item) {
      return;
    }
    const galleryItem = item;
    // Read the loading priority set at SSR time. Eager galleries skip lazy loading
    // for the initial (visible) slide so they contribute to a faster LCP.
    const loadingPriority = (gallery.dataset.loadingPriority as "lazy" | "eager" | undefined) ?? "lazy";

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

    let slides: HTMLElement[];
    if (track.dataset.ssrInitialSlide === "true") {
      const initialSlide = track.firstElementChild as HTMLElement | null;
      if (!initialSlide) {
        return;
      }

      if (hasGallery) {
        const before = createSlide(item, item.photos[total - 1], total - 1, total, false);
        const remaining = item.photos.slice(1).map((photo, index) => createSlide(item, photo, index + 1, total, false));
        const after = createSlide(item, item.photos[0], 0, total, false);
        track.replaceChildren(before, initialSlide, ...remaining, after);
      }

      delete track.dataset.ssrInitialSlide;
      slides = [...track.children] as HTMLElement[];
    } else if (track.children.length === 0) {
      // Fallback: create slides from scratch (for dynamically loaded stories or old markup)
      slides = renderedPhotos.map((photo, renderIndex) => {
        const realIndex = hasGallery
          ? renderIndex === 0
            ? total - 1
            : renderIndex === renderedPhotos.length - 1
              ? 0
              : renderIndex - 1
          : renderIndex;

        const isInitialSlide = hasGallery ? renderIndex === 1 : renderIndex === 0;
        return createSlide(item, photo, realIndex, total, isInitialSlide, isInitialSlide ? loadingPriority : "lazy");
      });

      track.replaceChildren(...slides);
    } else {
      // Use SSR'd slides
      slides = [...track.children] as HTMLElement[];
    }

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
      ensureSlideImage(slides[offsetIndex], galleryItem);
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

export function initSharedGalleries(scope: ParentNode = document, eagerCount?: number) {
  const allGalleries = [
    ...scope.querySelectorAll<HTMLElement>('[data-shared-gallery]:not([data-gallery-bound="true"])'),
  ];

  if (eagerCount === undefined || allGalleries.length <= eagerCount) {
    initGalleryList(allGalleries);
    return;
  }

  initGalleryList(allGalleries.slice(0, eagerCount));

  const lazyGalleries = allGalleries.slice(eagerCount);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const gallery = entry.target as HTMLElement;
          initGalleryList([gallery]);
          observer.unobserve(gallery);
        }
      });
    },
    { rootMargin: "200px" }
  );

  lazyGalleries.forEach((gallery) => observer.observe(gallery));
}
