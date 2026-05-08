const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initNavbar() {
  const hamburger = document.querySelector("[data-hamburger]") as HTMLButtonElement | null;
  const drawer = document.querySelector("[data-drawer]") as HTMLElement | null;
  const closeBtn = document.querySelector("[data-close]") as HTMLButtonElement | null;
  const backdrop = document.querySelector("[data-backdrop]") as HTMLElement | null;
  const nav = document.querySelector("[data-navbar]") as HTMLElement | null;

  if (!hamburger || !drawer || !closeBtn || !backdrop || !nav) return;
  const ham = hamburger;
  const drw = drawer;
  const close = closeBtn;
  const back = backdrop;
  const navbar = nav;
  let isDrawerOpen = false;

  function getFocusable(): HTMLElement[] {
    return Array.from(drw.querySelectorAll<HTMLElement>(FOCUSABLE));
  }

  function openDrawer() {
    if (isDrawerOpen) return;

    isDrawerOpen = true;
    drw.hidden = false;
    drw.inert = false;

    requestAnimationFrame(() => {
      drw.classList.add("drawer--open");
      back.classList.add("backdrop--visible");
    });

    ham.setAttribute("aria-expanded", "true");
    ham.setAttribute("aria-label", "Cerrar menu");
    const focusable = getFocusable();
    if (focusable.length) focusable[0].focus();
  }

  function closeDrawer() {
    if (!isDrawerOpen) return;

    isDrawerOpen = false;
    drw.classList.remove("drawer--open");
    back.classList.remove("backdrop--visible");
    drw.inert = true;
    ham.setAttribute("aria-expanded", "false");
    ham.setAttribute("aria-label", "Abrir menu");
    ham.focus();
  }

  drw.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform" || isDrawerOpen) {
      return;
    }

    drw.hidden = true;
  });

  ham.addEventListener("click", () => {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  close.addEventListener("click", closeDrawer);
  back.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (!isDrawerOpen) return;

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
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("navbar--scrolled", window.scrollY > 0);
    },
    { passive: true }
  );
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavbar, { once: true });
  } else {
    initNavbar();
  }
}
