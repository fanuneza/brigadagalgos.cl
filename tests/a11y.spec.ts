import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe.configure({ timeout: 90_000 });

const pages = [
  { name: "home", path: "/" },
  { name: "adoptar", path: "/adoptar/" },
  { name: "perfil-activo", path: "/adoptar/blue/" },
  { name: "casos-de-exito", path: "/casos-de-exito/" },
  { name: "colaboradores", path: "/colaboradores/" },
  { name: "contacto", path: "/contacto/" },
  { name: "donar", path: "/donar/" },
  { name: "hogar-temporal", path: "/hogar-temporal/" },
  { name: "por-que-galgos", path: "/por-que-galgos/" },
  { name: "preguntas-frecuentes", path: "/preguntas-frecuentes/" },
  { name: "blog", path: "/blog/" },
  { name: "articulo-blog", path: "/blog/adoptar-un-galgo-por-primera-vez/" },
  { name: "politica-de-cookies", path: "/politica-de-cookies/" },
  { name: "404", path: "/404.html" },
];

const viewports = [
  { name: "mobile", width: 320, height: 800 },
  { name: "desktop", width: 1280, height: 800 },
];

for (const theme of ["light", "dark"] as const) {
  for (const viewport of viewports) {
    for (const pageInfo of pages) {
      test(`a11y ${pageInfo.name} in ${theme} mode at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem("brigada-galgos-theme", selectedTheme);
        }, theme);
        await page.goto(pageInfo.path, { waitUntil: "networkidle" });
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }
  }
}

test("la tabla de cookies se puede enfocar y desplazar con teclado a 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/politica-de-cookies/", { waitUntil: "networkidle" });

  const tableWrap = page.locator(".cookie-policy__table-wrap");
  await tableWrap.focus();
  await expect(tableWrap).toBeFocused();
  await tableWrap.press("ArrowRight");

  await expect.poll(() => tableWrap.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
});
