const STORAGE_KEY = "brigada-galgos-theme";
const LIGHT_THEME_COLOR = "#0FB0C9";
const DARK_THEME_COLOR = "#101217";

function getStoredTheme(): "light" | "dark" | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === "light" || val === "dark" ? val : null;
  } catch {
    return null;
  }
}

function applyStoredTheme(): void {
  const stored = getStoredTheme();
  if (stored) {
    document.documentElement.dataset.theme = stored;
  } else {
    delete document.documentElement.dataset.theme;
  }
  const effective = getEffectiveTheme();
  syncToggleAria(effective);
  syncThemeColorMeta(effective);
}

function getEffectiveTheme(): "light" | "dark" {
  const stored = getStoredTheme();
  if (stored) return stored;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark"): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  syncToggleAria(theme);
  syncThemeColorMeta(theme);
}

function syncToggleAria(effective: "light" | "dark"): void {
  const isDark = effective === "dark";
  const ariaLabel = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
  document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-label", ariaLabel);
    btn.setAttribute("aria-pressed", String(isDark));
  });
}

function syncThemeColorMeta(theme: "light" | "dark"): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-theme-color]');
  if (!meta) return;
  meta.content = theme === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR;
}

function initThemeToggle(): void {
  document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((btn) => {
    if (btn.dataset.themeToggleInitialized) return;
    btn.dataset.themeToggleInitialized = "true";

    btn.addEventListener("click", () => {
      const current = getEffectiveTheme();
      applyTheme(current === "dark" ? "light" : "dark");
    });
  });

  syncToggleAria(getEffectiveTheme());
}

// Inject stored theme into the incoming document before Astro swaps it in.
// Without this, ClientRouter would swap in a <html> with no data-theme,
// causing a flash back to system preference on every navigation.
document.addEventListener("astro:before-swap", (event) => {
  const stored = getStoredTheme();
  const newDoc = (event as Event & { newDocument: Document }).newDocument;
  if (stored) {
    newDoc.documentElement.dataset.theme = stored;
  } else {
    newDoc.documentElement.removeAttribute("data-theme");
  }
});

// Reapply stored theme to the live document after the swap completes.
document.addEventListener("astro:after-swap", applyStoredTheme);

// On each page load (initial hard load + after every ClientRouter navigation),
// reapply the stored theme and rebind toggle buttons.
document.addEventListener("astro:page-load", () => {
  applyStoredTheme();
  initThemeToggle();
});

export {};
