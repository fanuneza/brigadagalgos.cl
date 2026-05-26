import { escapeAttribute } from "../../utils/html-escape";
import type { SharedGalleryItem } from "./types";

export function buildSharedGalleryMarkup(item: SharedGalleryItem, loadingPriority: "lazy" | "eager" = "lazy") {
  const payload = escapeAttribute(JSON.stringify(item));
  return `
    <div class="story-card__photo" data-shared-gallery data-gallery-payload='${payload}' data-loading-priority="${loadingPriority}">
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
