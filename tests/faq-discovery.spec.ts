import { expect, test } from "@playwright/test";
import { faqGroups, faqPairs } from "../src/config/faq";

test("el índice de temas llega a cada grupo de preguntas frecuentes", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/preguntas-frecuentes/", { waitUntil: "networkidle" });

  const index = page.getByLabel("Temas de preguntas frecuentes");
  await expect(index).toBeVisible();

  for (const group of faqGroups) {
    const link = index.getByRole("link", { name: group.topicLabel, exact: true });
    await expect(link).toHaveAttribute("href", `#${group.id}`);
  }

  await index.getByRole("link", { name: "Costos de adopción" }).click();
  await expect(page).toHaveURL(/#costos$/);
  await expect(page.locator("#costos h2")).toBeInViewport();
});

test("los enlaces profundos muestran el grupo y el FAQ JSON-LD conserva las respuestas visibles", async ({ page }) => {
  await page.goto("/preguntas-frecuentes/#hogar-y-departamento", { waitUntil: "networkidle" });

  const group = page.locator("#hogar-y-departamento");
  await expect(group.getByRole("heading", { name: "HOGAR Y DEPARTAMENTO" })).toBeVisible();
  await expect(group).toBeInViewport();

  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const graphs = scripts.map((script) => JSON.parse(script) as { "@graph"?: Array<Record<string, unknown>> });
  const faqPage = graphs.flatMap((graph) => graph["@graph"] ?? []).find((node) => node["@type"] === "FAQPage") as
    { mainEntity: Array<Record<string, unknown>> } | undefined;

  expect(faqPage?.mainEntity).toHaveLength(faqPairs.length);

  for (const pair of faqPairs) {
    const visibleAnswer = page.locator(`#${pair.id} .faq-answer`);
    await expect(visibleAnswer).toContainText(pair.answer);
    for (const detail of pair.details ?? []) {
      await expect(visibleAnswer).toContainText(detail);
    }

    const entity = faqPage?.mainEntity.find((item) => item.name === pair.question);
    const acceptedAnswer = entity?.acceptedAnswer as { text?: string } | undefined;
    expect(acceptedAnswer?.text).toBe(pair.details ? `${pair.answer} ${pair.details.join(" ")}` : pair.answer);
  }
});
