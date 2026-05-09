import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const GTM_CONTAINER_ID = "GTM-M2RN5B38";
const CONSENT_COOKIE = "brigadagalgos_consent";
const GTM_SCRIPT_SELECTOR = `script[src*="googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}"]`;

async function stubGtm(page: Page) {
  let gtmRequestCount = 0;

  await page.route(`https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}*`, async (route) => {
    gtmRequestCount += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "window.__gtmMockLoaded = (window.__gtmMockLoaded || 0) + 1;",
    });
  });

  return () => gtmRequestCount;
}

test("no consent shows banner and does not load GTM", async ({ page }) => {
  const getGtmRequestCount = await stubGtm(page);

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator("#cookie-banner")).toBeVisible();
  await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(0);
  expect(getGtmRequestCount()).toBe(0);

  await page.locator('a[data-track-location="hero"][data-track-category="adoption"]').evaluate((element) => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });

  const trackingState = await page.evaluate(() => {
    const trackingWindow = window as Window & { dataLayer?: Array<Record<string, unknown>> };
    return trackingWindow.dataLayer ?? [];
  });

  expect(trackingState).not.toContainEqual(expect.objectContaining({ event: "cta_click" }));
});

test("response includes a strict CSP with only the required GTM and GA4 allowances", async () => {
  const headersFile = await readFile("public/_headers", "utf8");
  const cspMatch = headersFile.match(/Content-Security-Policy:\s*(.+)/);
  const csp = cspMatch?.[1] ?? "";

  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("script-src 'self' 'unsafe-inline' https://www.googletagmanager.com");
  expect(csp).toContain(
    "connect-src 'self' https://api.web3forms.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.googletagmanager.com"
  );
  expect(csp).toContain("img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com");
  expect(csp).toContain("frame-src https://www.googletagmanager.com");
  expect(csp).not.toContain("*");
});

test("rendered HTML includes the GTM noscript iframe", async ({ page }) => {
  const response = await page.request.get("/");
  const html = await response.text();

  expect(html).toContain(`<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}"`);
  expect(html).not.toContain("https://www.googletagmanager.com/gtag/js?id=G-97CD3EJYML");
});

test("accepted consent hides banner, loads GTM once, and pushes granted consent state", async ({ context, page }) => {
  await context.addCookies([
    {
      name: CONSENT_COOKIE,
      value: "accepted",
      domain: "127.0.0.1",
      path: "/",
    },
  ]);

  const getGtmRequestCount = await stubGtm(page);

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator("#cookie-banner")).toBeHidden();
  await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(1);
  expect(getGtmRequestCount()).toBe(1);

  const consentState = await page.evaluate(() => {
    const trackingWindow = window as Window & {
      __cookieConsentState?: string;
      __gtmMockLoaded?: number;
      dataLayer?: unknown[];
    };

    return {
      consentState: trackingWindow.__cookieConsentState,
      gtmMockLoaded: trackingWindow.__gtmMockLoaded ?? 0,
      dataLayer: trackingWindow.dataLayer ?? [],
    };
  });

  expect(consentState.consentState).toBe("granted");
  expect(consentState.gtmMockLoaded).toBe(1);
  expect(consentState.dataLayer).toContainEqual(
    expect.objectContaining({
      event: "cookie_consent_update",
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })
  );
});

test("rejected consent hides banner, does not load GTM, and pushes denied consent state", async ({ context, page }) => {
  await context.addCookies([
    {
      name: CONSENT_COOKIE,
      value: "rejected",
      domain: "127.0.0.1",
      path: "/",
    },
  ]);

  const getGtmRequestCount = await stubGtm(page);

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator("#cookie-banner")).toBeHidden();
  await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(0);
  expect(getGtmRequestCount()).toBe(0);

  const consentState = await page.evaluate(() => {
    const trackingWindow = window as Window & {
      __cookieConsentState?: string;
      dataLayer?: unknown[];
    };

    return {
      consentState: trackingWindow.__cookieConsentState,
      dataLayer: trackingWindow.dataLayer ?? [],
    };
  });

  expect(consentState.consentState).toBe("denied");
  expect(consentState.dataLayer).toContainEqual(
    expect.objectContaining({
      event: "cookie_consent_update",
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })
  );

  await page.locator('a[data-track-location="hero"][data-track-category="adoption"]').evaluate((element) => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });

  const deniedBehavioralEvents = await page.evaluate(() => {
    const trackingWindow = window as Window & { dataLayer?: Array<Record<string, unknown>> };
    return (trackingWindow.dataLayer ?? []).filter((entry) => entry.event !== "cookie_consent_update");
  });

  expect(deniedBehavioralEvents).toEqual([]);
});

test("clicking accept sets the cookie, loads GTM once, and hides the banner", async ({ page }) => {
  const getGtmRequestCount = await stubGtm(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#cookie-accept").click();

  await expect(page.locator("#cookie-banner")).toBeHidden();
  await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(1);
  expect(getGtmRequestCount()).toBe(1);

  const trackingState = await page.evaluate(() => {
    const trackingWindow = window as Window & {
      dataLayer?: unknown[];
    };

    return {
      dataLayerExists: Array.isArray(trackingWindow.dataLayer),
      scriptCount: document.querySelectorAll('script[src*="googletagmanager.com/gtm.js?id=GTM-M2RN5B38"]').length,
    };
  });

  expect(trackingState.dataLayerExists).toBe(true);
  expect(trackingState.scriptCount).toBe(1);

  await expect
    .poll(async () => page.evaluate((cookieName) => document.cookie.includes(`${cookieName}=accepted`), CONSENT_COOKIE))
    .toBe(true);
});

test("clicking reject sets the cookie, does not load GTM, and hides the banner", async ({ page }) => {
  const getGtmRequestCount = await stubGtm(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#cookie-reject").click();

  await expect(page.locator("#cookie-banner")).toBeHidden();
  await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(0);
  expect(getGtmRequestCount()).toBe(0);

  await expect
    .poll(async () => page.evaluate((cookieName) => document.cookie.includes(`${cookieName}=rejected`), CONSENT_COOKIE))
    .toBe(true);
});

test("accepted consent allows CTA, section visibility, and scroll analytics once per milestone", async ({ context, page }) => {
  await context.addCookies([
    {
      name: CONSENT_COOKIE,
      value: "accepted",
      domain: "127.0.0.1",
      path: "/",
    },
  ]);

  await stubGtm(page);
  await page.goto("/", { waitUntil: "networkidle" });

  await page.locator('a[data-track-location="hero"][data-track-category="adoption"]').evaluate((element) => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });

  await page.locator('[data-track-section="help_cards"]').scrollIntoViewIfNeeded();
  await page.locator('[data-track-section="donation_banner"]').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(200);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(200);

  const dataLayer = await page.evaluate(() => {
    const trackingWindow = window as Window & { dataLayer?: Array<Record<string, unknown>> };
    return trackingWindow.dataLayer ?? [];
  });

  expect(dataLayer).toContainEqual(
    expect.objectContaining({
      event: "cta_click",
      event_category: "adoption",
      event_label: "Quiero adoptar",
      event_location: "hero",
      destination_url: "/adoptar/",
      page_path: "/",
    })
  );
  expect(dataLayer.filter((entry) => entry.event === "section_view" && entry.section_name === "hero")).toHaveLength(1);
  expect(
    dataLayer.filter((entry) => entry.event === "section_view" && entry.section_name === "help_cards")
  ).toHaveLength(1);
  expect(dataLayer.filter((entry) => entry.event === "scroll_depth" && entry.percent === 25)).toHaveLength(1);
  expect(dataLayer.filter((entry) => entry.event === "scroll_depth" && entry.percent === 50)).toHaveLength(1);
});

test("manage consent clears the cookie and restores the banner on reload", async ({ context, page }) => {
  await context.addCookies([
    {
      name: CONSENT_COOKIE,
      value: "accepted",
      domain: "127.0.0.1",
      path: "/",
    },
  ]);

  await stubGtm(page);
  await page.goto("/", { waitUntil: "networkidle" });

  await Promise.all([page.waitForLoadState("load"), page.locator("#cookie-manage-btn").click()]);

  await expect(page.locator("#cookie-banner")).toBeVisible();
  await expect
    .poll(async () => page.evaluate((cookieName) => document.cookie.includes(`${cookieName}=`), CONSENT_COOKIE))
    .toBe(false);
});
