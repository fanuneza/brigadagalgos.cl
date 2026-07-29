import { expect, test, type Locator, type Page } from "@playwright/test";

const templateRoutes = [
  "/",
  "/adoptar/",
  "/adoptar/blue/",
  "/casos-de-exito/",
  "/colaboradores/",
  "/contacto/",
  "/donar/",
  "/hogar-temporal/",
  "/por-que-galgos/",
  "/preguntas-frecuentes/",
  "/blog/",
  "/blog/adoptar-un-galgo-por-primera-vez/",
  "/politica-de-cookies/",
  "/404.html",
] as const;

const decisionSurfaces = [
  { path: "/", selector: 'a[data-track-location="hero"][data-track-category="adoption"]' },
  { path: "/adoptar/", selector: 'a[data-track-location="adoption_hero"]' },
  { path: "/adoptar/blue/", selector: "main h1" },
  { path: "/casos-de-exito/", selector: "main h1" },
  { path: "/colaboradores/", selector: "main h1" },
  { path: "/contacto/", selector: 'a[data-track-location="contact_primary"]' },
  { path: "/donar/", selector: 'a[data-track-location="donation_hero"]' },
  { path: "/hogar-temporal/", selector: 'a[data-track-location="foster_hero"]' },
  { path: "/por-que-galgos/", selector: "main h1" },
  { path: "/preguntas-frecuentes/", selector: ".faq-topic-index a" },
  { path: "/blog/", selector: "main h1" },
  { path: "/blog/adoptar-un-galgo-por-primera-vez/", selector: "article h1" },
  { path: "/politica-de-cookies/", selector: ".cookie-policy__section:first-child h2" },
  { path: "/404.html", selector: 'main a[href="/adoptar/"]' },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
    .toBe(true);
}

async function expectNotToOverlap(first: Locator, second: Locator, description: string) {
  const [firstBox, secondBox] = await Promise.all([first.boundingBox(), second.boundingBox()]);
  expect(firstBox, `${description}: first element should render`).not.toBeNull();
  expect(secondBox, `${description}: second element should render`).not.toBeNull();

  const overlaps =
    firstBox!.x < secondBox!.x + secondBox!.width &&
    firstBox!.x + firstBox!.width > secondBox!.x &&
    firstBox!.y < secondBox!.y + secondBox!.height &&
    firstBox!.y + firstBox!.height > secondBox!.y;

  expect(overlaps, description).toBe(false);
}

for (const route of templateRoutes) {
  test(`template ${route} reflows at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(route, { waitUntil: "networkidle" });

    await expect(page.locator("main h1")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}

test("200% text preserves the shell, decisions, forms, cards, and footer", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });

  for (const route of ["/", "/adoptar/", "/contacto/"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });

    await expect(page.locator(".navbar__brand")).toBeVisible();
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }

  await expect(page.locator(".form")).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviar mensaje" })).toBeVisible();

  await page.goto("/adoptar/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expect(page.locator("[data-adoption-card]").first()).toBeVisible();
  await expect(page.locator(".cta-card__actions").last()).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

for (const surface of decisionSurfaces) {
  test(`unresolved consent does not cover the decision surface on ${surface.path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(surface.path, { waitUntil: "networkidle" });

    const decisionSurface = page.locator(surface.selector).first();
    await expectNotToOverlap(page.locator("#cookie-banner"), decisionSurface, `${surface.path} consent overlap`);
  });
}

test("keyboard navigation opens the mobile menu and reaches adoption", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const menu = page.locator(".navbar__hamburger");
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");

  const adopt = page.locator('.drawer__link[href="/adoptar/"]');
  await adopt.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/adoptar/");
  await expect(page.locator("main h1")).toHaveText("Adopta un galgo en Chile");
});

test("keyboard adoption path reaches a profile and returns from its gallery", async ({ page }) => {
  await page.goto("/adoptar/", { waitUntil: "networkidle" });

  const filter = page.locator('.filter-chip[data-filter="Macho"]');
  await filter.focus();
  await page.keyboard.press("Enter");
  await expect(filter).toHaveAttribute("aria-pressed", "true");

  const profile = page.locator("[data-adoption-card]:not([hidden]) a[href^='/adoptar/']").first();
  const name = await profile.textContent();
  await profile.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(/\/adoptar\/[a-z0-9-]+\/$/);
  await expect(page.locator("h1")).toContainText((name ?? "").replace("Conocer a ", ""));

  const zoom = page.locator("[data-gallery-zoom]").first();
  await zoom.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("dialog[data-gallery-lightbox]")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(zoom).toBeFocused();
});

test("keyboard journeys retain focus through FAQ, foster, donation, contact, and consent", async ({ page }) => {
  await page.goto("/preguntas-frecuentes/", { waitUntil: "networkidle" });
  const faqTopic = page.getByRole("link", { name: "Costos de adopción" });
  await faqTopic.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#costos$/);
  await expect(page.locator("#costos h2")).toBeInViewport();

  await page.goto("/hogar-temporal/", { waitUntil: "networkidle" });
  const fosterStart = page.getByRole("link", { name: "Puedo ser hogar temporal" }).first();
  await fosterStart.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#form$/);
  await expect(page.locator("#form")).toBeInViewport();

  await page.goto("/donar/", { waitUntil: "networkidle" });
  const copy = page.getByRole("button", { name: "Copiar datos bancarios" });
  await copy.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-copy-live]")).toContainText("Datos bancarios copiados");

  await page.goto("/contacto/", { waitUntil: "networkidle" });
  const adoptIntent = page.getByRole("button", { name: "Quiero adoptar" });
  await adoptIntent.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Asunto")).toBeFocused();

  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#cookie-accept").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#cookie-reject")).toBeFocused();
});
