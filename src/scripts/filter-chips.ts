import { dispatchAnalytics } from "../utils/analytics";

function initFilterChips() {
  const chips = document.querySelectorAll<HTMLButtonElement>(".filter-chip");
  const cards = document.querySelectorAll<HTMLElement>("[data-sex]");
  const countEl = document.querySelector<HTMLElement>("[data-count]");
  const countLabelEl = document.querySelector<HTMLElement>("[data-count-label]");
  const emptyEl = document.querySelector<HTMLElement>(".dog-grid__empty");

  let activeFilter = "all";

  function filter(value: string) {
    let visibleCount = 0;

    cards.forEach((card) => {
      const matches = value === "all" || card.dataset.sex === value || card.dataset.ageType === value;
      card.hidden = !matches;
      if (matches) visibleCount++;
    });

    if (countEl) {
      countEl.textContent = String(visibleCount);
    }

    if (countLabelEl) {
      countLabelEl.textContent = visibleCount === 1 ? "galgo disponible" : "galgos disponibles";
    }

    if (emptyEl) {
      emptyEl.hidden = visibleCount > 0;
      emptyEl.setAttribute("aria-hidden", String(visibleCount > 0));
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((candidate) => {
        candidate.classList.remove("filter-chip--active");
        candidate.setAttribute("aria-pressed", "false");
      });

      chip.classList.add("filter-chip--active");
      chip.setAttribute("aria-pressed", "true");
      activeFilter = chip.dataset.filter ?? "all";
      filter(activeFilter);

      dispatchAnalytics({
        event: "dog_filter_click",
        filter_category: activeFilter,
      });
    });
  });
}

document.addEventListener("astro:page-load", initFilterChips);
