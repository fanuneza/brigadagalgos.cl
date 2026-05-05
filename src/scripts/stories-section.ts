import { initSharedGalleries } from "./shared-gallery";

const PAGE_SIZE = 6;

function initStoriesSection() {
  const grid = document.querySelector<HTMLElement>("[data-stories-list]");
  const button = document.querySelector<HTMLButtonElement>("[data-stories-ver-mas]");

  if (!grid) return;

  const cards = [...grid.querySelectorAll<HTMLElement>("[data-story-card]")];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  cards.forEach((card) => grid.appendChild(card));

  let shown = Math.min(PAGE_SIZE, cards.length);

  function applyVisibility() {
    cards.forEach((card, i) => {
      card.hidden = i >= shown;
    });
    if (button) button.hidden = shown >= cards.length;
  }

  button?.addEventListener("click", () => {
    shown = Math.min(shown + PAGE_SIZE, cards.length);
    applyVisibility();
  });

  applyVisibility();
  initSharedGalleries(grid);
}

if (typeof document !== "undefined") {
  document.addEventListener("astro:page-load", initStoriesSection);
}
