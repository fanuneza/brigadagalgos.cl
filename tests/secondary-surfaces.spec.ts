import { expect, test } from "@playwright/test";

test("blog gives each published article a contextual, low-pressure next step", async ({ page }) => {
  await page.goto("/blog/adoptar-un-galgo-por-primera-vez/", { waitUntil: "networkidle" });

  const nextStep = page.locator(".blog-post__next-step");
  await expect(nextStep).toContainText("proceso");
  await expect(nextStep.getByRole("link", { name: "Conocer el proceso de adopción" })).toHaveAttribute(
    "href",
    "/preguntas-frecuentes/#proceso"
  );
  await expect(page.locator(".blog-post__next-step .btn--primary")).toHaveCount(0);
});

test("404 prioritizes adoption and keeps secondary destinations available", async ({ page }) => {
  await page.goto("/404.html", { waitUntil: "networkidle" });

  await expect(page.getByRole("link", { name: "Ver galgos en adopción" })).toHaveAttribute("href", "/adoptar/");
  await expect(page.locator("main .btn--primary")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("link", { name: "Escribirnos" })).toHaveAttribute("href", "/contacto/");
});
