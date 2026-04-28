const chips = document.querySelectorAll<HTMLButtonElement>('.chip-btn');
const cards = document.querySelectorAll<HTMLElement>('[data-sex]');
const countEl = document.querySelector<HTMLElement>('[data-count]');
const emptyEl = document.querySelector<HTMLElement>('.dog-grid__empty');

function filter(value: string) {
  let visible = 0;
  cards.forEach(card => {
    const show =
      value === 'all' ||
      card.dataset.sex === value ||
      card.dataset.ageType === value;
    card.hidden = !show;
    if (show) visible++;
  });
  if (countEl) countEl.textContent = String(visible);
  if (emptyEl) {
    emptyEl.hidden = visible > 0;
    emptyEl.setAttribute('aria-hidden', String(visible > 0));
  }
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => {
      c.classList.remove('chip-btn--active');
      c.setAttribute('aria-pressed', 'false');
    });
    chip.classList.add('chip-btn--active');
    chip.setAttribute('aria-pressed', 'true');
    filter(chip.dataset.filter ?? 'all');
  });
});
