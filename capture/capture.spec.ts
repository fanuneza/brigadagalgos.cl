import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const outputDir = path.resolve(".cache", "parity");
const pages = [
  { name: "home", path: "/", tag: "@home" },
  { name: "adoptar", path: "/adoptar/", tag: "@adoptar" },
  { name: "perfil", path: "/adoptar/blue/", tag: "@perfil" },
  { name: "historias", path: "/casos-de-exito/", tag: "@historias" },
  { name: "colaboradores", path: "/colaboradores/", tag: "@colaboradores" },
  { name: "contacto", path: "/contacto/", tag: "@contacto" },
  { name: "donar", path: "/donar/", tag: "@donar" },
  { name: "hogar-temporal", path: "/hogar-temporal/", tag: "@hogar-temporal" },
  { name: "por-que-galgos", path: "/por-que-galgos/", tag: "@por-que-galgos" },
  { name: "preguntas-frecuentes", path: "/preguntas-frecuentes/", tag: "@preguntas-frecuentes" },
  { name: "blog", path: "/blog/", tag: "@blog" },
  { name: "articulo-blog", path: "/blog/adoptar-un-galgo-por-primera-vez/", tag: "@articulo-blog" },
  { name: "politica-de-cookies", path: "/politica-de-cookies/", tag: "@politica-de-cookies" },
  { name: "404", path: "/404.html", tag: "@404" },
] as const;

const viewports = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const darkPages = [
  { name: "home", path: "/" },
  { name: "adoptar", path: "/adoptar/" },
  { name: "perfil", path: "/adoptar/blue/" },
  { name: "preguntas-frecuentes", path: "/preguntas-frecuentes/" },
  { name: "contacto", path: "/contacto/" },
  { name: "donar", path: "/donar/" },
  { name: "404", path: "/404.html" },
] as const;

async function loadLazyImages(page: import("@playwright/test").Page) {
  const images = page.locator("img");

  for (let index = 0; index < (await images.count()); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded();
  }

  await expect
    .poll(() =>
      images.evaluateAll((elements) =>
        elements.every((element) => {
          const image = element as HTMLImageElement;
          return image.complete && image.naturalWidth > 0;
        })
      )
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function prepareCapture(page: import("@playwright/test").Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  await expect(page.locator("body")).toBeVisible();

  // Captures always use an explicit rejected-consent state so the fixed banner
  // neither obscures the page nor produces an ambiguous visual baseline.
  await page.locator("#cookie-reject").click();
  await loadLazyImages(page);
}

test.beforeAll(async () => {
  await mkdir(outputDir, { recursive: true });
});

for (const pageInfo of pages) {
  for (const viewport of viewports) {
    test(`${pageInfo.tag} capture ${pageInfo.name} ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript(() => {
        localStorage.setItem("brigada-galgos-theme", "light");
      });
      await prepareCapture(page, pageInfo.path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

      await page.screenshot({
        path: path.join(outputDir, `local-${pageInfo.name}-${viewport.name}-light.png`),
        fullPage: true,
      });
    });
  }
}

for (const pageInfo of darkPages) {
  test(`@dark capture ${pageInfo.name} mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem("brigada-galgos-theme", "dark");
    });
    await prepareCapture(page, pageInfo.path);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.screenshot({
      path: path.join(outputDir, `local-${pageInfo.name}-mobile-dark.png`),
      fullPage: true,
    });
  });
}
