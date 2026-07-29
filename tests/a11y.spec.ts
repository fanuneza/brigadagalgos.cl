import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import DISABLED_RULES from "./a11y-disabled-rules.json" with { type: "json" };

const pages = [
  { name: "home", path: "/" },
  { name: "adoptar", path: "/adoptar/" },
  { name: "casos-de-exito", path: "/casos-de-exito/" },
  { name: "colaboradores", path: "/colaboradores/" },
  { name: "contacto", path: "/contacto/" },
  { name: "donar", path: "/donar/" },
  { name: "hogar-temporal", path: "/hogar-temporal/" },
  { name: "por-que-galgos", path: "/por-que-galgos/" },
  { name: "404", path: "/404" },
];

// Rules disabled due to pre-existing design/content choices that would require
// significant redesign to fix. We still run the scan and monitor for regressions.
// Shared with .lighthouserc.cjs — edit tests/a11y-disabled-rules.json only.

for (const pageInfo of pages) {
  test(`a11y ${pageInfo.name}`, async ({ page }) => {
    await page.goto(pageInfo.path, { waitUntil: "networkidle" });
    await expect(page.locator("body")).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .disableRules(DISABLED_RULES)
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}
