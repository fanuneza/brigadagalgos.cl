function initFilterChips() {
  const grid = document.querySelector<HTMLElement>("[data-dog-grid]");
  if (grid) {
    const items = [...grid.children];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    items.forEach((item) => grid.appendChild(item));
  }

  const chips = document.querySelectorAll<HTMLButtonElement>(".chip-btn");
  const cards = document.querySelectorAll<HTMLElement>("[data-sex]");
  const countEl = document.querySelector<HTMLElement>("[data-count]");
  const countLabelEl = document.querySelector<HTMLElement>("[data-count-label]");
  const emptyEl = document.querySelector<HTMLElement>(".dog-grid__empty");
  const desktopQuery = typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)") : null;

  let activeFilter = "all";

  function getVisibleLimit() {
    return desktopQuery?.matches ? 6 : 3;
  }

  function filter(value: string) {
    const matchingCards: HTMLElement[] = [];

    cards.forEach((card) => {
      const matches = value === "all" || card.dataset.sex === value || card.dataset.ageType === value;

      if (matches) {
        matchingCards.push(card);
      }
    });

    const visibleLimit = getVisibleLimit();

    cards.forEach((card) => {
      card.hidden = true;
    });

    matchingCards.forEach((card, index) => {
      card.hidden = index >= visibleLimit;
    });

    if (countEl) {
      countEl.textContent = String(matchingCards.length);
    }

    if (countLabelEl) {
      countLabelEl.textContent = matchingCards.length === 1 ? "galgo disponible" : "galgos disponibles";
    }

    if (emptyEl) {
      emptyEl.hidden = matchingCards.length > 0;
      emptyEl.setAttribute("aria-hidden", String(matchingCards.length > 0));
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((candidate) => {
        candidate.classList.remove("chip-btn--active");
        candidate.setAttribute("aria-pressed", "false");
      });

      chip.classList.add("chip-btn--active");
      chip.setAttribute("aria-pressed", "true");
      activeFilter = chip.dataset.filter ?? "all";
      filter(activeFilter);
    });
  });

  desktopQuery?.addEventListener("change", () => {
    filter(activeFilter);
  });

  filter(activeFilter);
}

if (typeof document !== "undefined") {
  document.addEventListener("astro:page-load", initFilterChips);
}
