import { expect, test } from "@playwright/test";

const requiredPages = [
  { path: "/", titleIncludes: "Brigada Galgos" },
  { path: "/casos-de-exito/", titleIncludes: "Historias de galgos" },
  { path: "/404.html", titleIncludes: "no encontrada" },
];

for (const pageInfo of requiredPages) {
  test(`page output ${pageInfo.path}`, async ({ page }) => {
    const response = await page.goto(pageInfo.path, { waitUntil: "load" });
    expect(response?.status()).toBeLessThan(500);

    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(new RegExp(pageInfo.titleIncludes, "i"));
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
  });
}

test("robots and sitemap are available", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap-index.xml");
  expect(sitemap.ok()).toBe(true);
});

test("published blog posts are syndicated and structured", async ({ page, request }) => {
  const postPath = "/blog/galgos-departamento-santiago/";
  const [feed, schemaEndpoint, sitemapIndex] = await Promise.all([
    request.get("/feed.xml"),
    request.get("/schema/post.json"),
    request.get("/sitemap-index.xml"),
  ]);
  const sitemapPaths = [...(await sitemapIndex.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, url]) => new URL(url).pathname
  );
  const sitemapContent = await Promise.all(sitemapPaths.map(async (path) => (await request.get(path)).text()));

  expect(await feed.text()).toContain(postPath);
  expect(await schemaEndpoint.text()).toContain(postPath);
  expect(sitemapContent.join()).toContain(postPath);
  expect(sitemapContent.join()).toContain("/casos-de-exito/");

  await page.goto(postPath, { waitUntil: "load" });
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const graphs = scripts.map((script) => JSON.parse(script) as { "@graph"?: Array<{ "@type"?: string }> });
  expect(graphs.some((graph) => graph["@graph"]?.some((node) => node["@type"] === "BlogPosting"))).toBe(true);
});

test("json-ld scripts parse", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(scripts.length).toBeGreaterThan(0);
  for (const script of scripts) {
    expect(() => JSON.parse(script)).not.toThrow();
  }
});
