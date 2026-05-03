const hamburger = document.querySelector("[data-hamburger]") as HTMLButtonElement;
const drawer = document.querySelector("[data-drawer]") as HTMLElement;
const closeBtn = document.querySelector("[data-close]") as HTMLButtonElement;
const backdrop = document.querySelector("[data-backdrop]") as HTMLElement;
const nav = document.querySelector("[data-navbar]") as HTMLElement;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(): HTMLElement[] {
  return Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE));
}

function openDrawer() {
  drawer.classList.add("drawer--open");
  backdrop.classList.add("backdrop--visible");
  hamburger.setAttribute("aria-expanded", "true");
  hamburger.setAttribute("aria-label", "Cerrar menú");
  drawer.setAttribute("aria-hidden", "false");
  const focusable = getFocusable();
  if (focusable.length) focusable[0].focus();
}

function closeDrawer() {
  drawer.classList.remove("drawer--open");
  backdrop.classList.remove("backdrop--visible");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Abrir menú");
  drawer.setAttribute("aria-hidden", "true");
  hamburger.focus();
}

hamburger.addEventListener("click", () => {
  if (drawer.classList.contains("drawer--open")) {
    closeDrawer();
  } else {
    openDrawer();
  }
});

closeBtn.addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);

document.addEventListener("keydown", (e) => {
  if (!drawer.classList.contains("drawer--open")) return;

  if (e.key === "Escape") {
    closeDrawer();
    return;
  }

  if (e.key === "Tab") {
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
});

window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("navbar--scrolled", window.scrollY > 0);
  },
  { passive: true }
);
